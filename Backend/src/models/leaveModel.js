//leave model.js

import { pool } from "../config/db.js";
import logger from '../logger/logger.js'; 
import { employeeLeaveBalance } from "../utility/employeeLeaveBalance.js";
import { getWeekendAndHolidayCount } from "../utility/leaveCount.js";
import { getHolidayList } from "../utility/leaveCount.js";
import { balanceLeaveCheck } from "../utility/leaveCount.js";
import { employeesIdFind } from "../utility/employeeIdFind.js";
import { teamEmployeesIdFind } from "../utility/employeeIdFind.js";
// import { duplicateDateCheck } from "../utility/duplicateDateChecker.js";
//=======> POST 🚩 <=========
//******** Admin ********/

// leave type create
export const leaveTypeModel = async (payload) => {
try {
  const { leaveName, description } = payload;
  const query = `INSERT INTO leavetype ( name, Description) VALUES (?, ?)`;
  const values = [leaveName, description];
  const [result] = await pool.query(query, values);
  return result;
} catch (err) {
  logger.error(`This is an error message for leaveModel/leaveTypeModel: ${err}`);
  console.error(err);
}

};

//holiday
export const holidayModel = async (payload) => {
try {
  const { holidayDate, holidayName, type } = payload;
  const query = `INSERT INTO holidays (holiday_date, name, type) VALUES (?, ?, ?)`;
  const values = [holidayDate, holidayName, type];
  const [result] = await pool.query(query, values);
  return result;
} catch (err) {
  console.error(err);
  logger.error(`This is an error message for leaveModel/holidayModel: ${err}`);
}
};

//leave policy

export const leavePolicyModel = async (payload) => {
 try {
  const {
    employee_type_id,
    leave_type_id,
    max_days_per_year,
    name,
    accrual_per_month,
  } = payload;
  const query = `INSERT INTO leavepolicy ( employee_type_id, leave_type_id, max_days_per_year, name, accrual_per_month) VALUES (?, ?, ?, ?, ?)`;
  const values = [
    employee_type_id,
    leave_type_id,
    max_days_per_year,
    name,
    accrual_per_month,
  ];
  const [result] = await pool.query(query, values);
  return result;
 } catch (err) {
  console.error(err);
  logger.error(`This is an error message for leaveModel/leavePolicyModel: ${err}`);
 }
};

//******** Employee ********/
//=======> POST 🚩 <=========

//leave apply

export const leaveRequestModel = async (payload) => {
  try {
    const { employee_id, leaveId, startDate, endDate, reason } = payload.formData;
  console.log(payload.formData);
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDiff = end.getTime() - start.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  const holidayList = await getHolidayList();
  const weekEndAndHolidayCount = getWeekendAndHolidayCount(
    startDate,
    endDate,
    holidayList
  );

  if (weekEndAndHolidayCount >= 0) {
    const workingDays = dayDiff - weekEndAndHolidayCount;
    const balanceLeave = await balanceLeaveCheck(employee_id, leaveId);

    let query;
    let values;
    if (balanceLeave >= workingDays) {
      if (leaveId === 1) {
        query = `
          INSERT INTO LeaveRequest 
          (employee_id, leave_type_id, start_date, end_date, count, reason, status
           )
          VALUES (?, ?, ?, ?, ? ,?, 6)
        `;
        values = [
          employee_id,
          leaveId,
          startDate,
          endDate,
          workingDays,
          reason,
        ];

        const lb = await employeeLeaveBalance(
          employee_id,
          workingDays,
          leaveId
        );
        if (lb) {
          console.log("worked", lb);
          const [result] = await pool.query(query, values);
          return result;
        } else {
          console.log("not work");
        }
      } else {
        const query = `
            INSERT INTO LeaveRequest 
              (employee_id, leave_type_id, start_date, end_date, count, reason, status)
            VALUES (?, ?, ?, ?, ?, ?, 0)
          `;
        const values = [
          employee_id,
          leaveId,
          startDate,
          endDate,
          workingDays,
          reason,
        ];

        const [result] = await pool.query(query, values);
        return result;
      }
    } else {
      return { affectedRows: 0, message: "Check leave balance" };
    }
  } else {
    console.log("Invalid date range or holiday data");
    return {
      affectedRows: 0,
      message: "Invalid date or holiday configuration",
    };
  }
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/leaveRequestModel: ${err}`);
  }
};

//user see the leave request

export const leaveRequestStatusModel = async (employee_id) => {

  const query = `
  SELECT 
    LR.id, 
    LR.start_date, 
    LR.end_date, 
    LR.count,
    LR.status,
    LT.name
  FROM LeaveRequest LR
  JOIN LeaveType LT ON LT.id = LR.leave_type_id
  WHERE LR.Employee_id = ?
`;
  try {
    const [result] = await pool.query(query, [employee_id]);

    return result;
  } catch (error) {
    console.error("Query error:", error);
    logger.error(`This is an error message for leaveModel/leaveRequestStatusModel: ${error}`);
    throw error;
  }
};

// user see the leave request status approved timeline

export const leaveRequestStatusTimelineModel = async (request_id) => {
  try {

    const [data] = await pool.query(
      `
      SELECT * FROM approvalflow WHERE leave_request_id = ?
    `,
      [request_id]
    );
    // console.log(data);
    const enrichedData = await Promise.all(
      data.map(async (d) => {
        const [result] = await pool.query(
          `
          SELECT et.name 
          FROM EmployeeType et 
          JOIN Employee e ON e.emp_type_id = et.id 
          WHERE e.id = ?
        `,
          [d.approved_id]
        );

        return {
          ...d,
          approver_type: result[0]?.name || null,
        };
      })
    );
    // console.log(enrichedData);

    return enrichedData;
  } catch (err) {
    console.error("Query error:", err);
    logger.error(`This is an error message for leaveModel/leaveRequestStatusTimelineModel: ${err}`);
    throw err;
  }
};

//  team member leave status
export const teamMembersLeaveStatusModel = async (params) => {
  const { manager_id, employee_id } = params;

  try {
    const employeeRows = await employeesIdFind(manager_id, employee_id);

    const employeeIds = employeeRows.map((emp) => emp.id);

    if (employeeIds.length === 0) {
      return [];
    }

    const placeholders = employeeIds.map(() => "?").join(",");

    const query = `
        SELECT 
          lr.*, 
          e.name 
        FROM 
          LeaveRequest lr
        INNER JOIN 
          employee e 
        ON 
          lr.Employee_id = e.id
        WHERE 
          lr.status = 6 
          AND lr.Employee_id IN (${placeholders})
      `;

    const [result] = await pool.query(query, employeeIds);
    return result;
  } catch (error) {
    console.error("Query error:", error);
    logger.error(`This is an error message for leaveModel/teamMembersLeaveStatusModel: ${error}`);
    throw error;
  }
};

// team member calender

export const teamMemberCalenderModel = async (manager_id) => {

  try {
    const query = `
    SELECT 
      LR.start_date, 
      LR.end_date, 
      LT.name AS leave_type_name,
      E.name AS name,
      E.id AS id
    FROM 
      LeaveRequest LR
    JOIN 
      LeaveType LT ON LT.id = LR.leave_type_id
    JOIN 
      Employee E ON E.id = LR.employee_id
    WHERE 
      LR.status = 6 AND (
        E.manager_id = ? 
      )
  `;
    const [result] = await pool.query(query, [
      manager_id,
    ]);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/teamMemberCalenderModel: ${err}`);
  }
};

// manager see the leave request

export const leaveRequestManagerModel = async (employee_id) => {
 

  console.log(employee_id, ": employee id");
  try {
    const employeeRows = await teamEmployeesIdFind(employee_id);

    if (!employeeRows || employeeRows.length === 0) {
      return "empty";
    }

    const employeeIds = employeeRows.map((emp) => emp.id);
    const placeholders = employeeIds.map(() => "?").join(",");

    const query = `
SELECT  
  lr.*, 
  e.name AS employee_name,
  lt.name AS leave_type_name
FROM 
  LeaveRequest lr
JOIN 
  Employee e ON e.id = lr.employee_id
JOIN 
  LeaveType lt ON lt.id = lr.leave_type_id
WHERE 
  lr.status = 0 
  AND lr.employee_id IN (${placeholders});

`;

    const [result] = await pool.query(query, employeeIds);
    return result;
  } catch (err) {
    console.error("Manager Model Error:", err);
    logger.error(`This is an error message for leaveModel/leaveRequestManagerModel: ${err}`);
    return err;
  }
};

// hr see the leave request

export const leaveRequestHRModel = async (employee_id) => {

  try {
    const employeeRows = await teamEmployeesIdFind(employee_id);

    if (!employeeRows || employeeRows.length === 0) {
      return "empty";
    }

    const employeeIds = employeeRows.map((emp) => emp.id);
    const placeholders = employeeIds.map(() => "?").join(",");

    const query = `
          SELECT  
  lr.*, 
  e.name AS employee_name,
  lt.name AS leave_type_name,
  lt.id AS leave_type_id
FROM 
  LeaveRequest lr
JOIN 
  Employee e ON e.id = lr.employee_id
JOIN 
  LeaveType lt ON lt.id = lr.leave_type_id
WHERE 
  lr.status = 1
  AND lr.employee_id IN (${placeholders});
    `;

    const [result] = await pool.query(query, employeeIds);
    return result;
  } catch (err) {
    console.error("HR Model Error:", err);
    logger.error(`This is an error message for leaveModel/leaveRequestHRModel: ${err}`);
    return err;
  }
};

// director see the leave request.
export const leaveRequestDirectorModel = async (employee_id) => {

  try {
    const employeeRows = await teamEmployeesIdFind(employee_id);

    if (!employeeRows || employeeRows.length === 0) {
      return "empty";
    }

    const employeeIds = employeeRows.map((emp) => emp.Employee_id);
    const placeholders = employeeIds.map(() => "?").join(",");

    const query = `
          SELECT  
  lr.*, 
  e.name AS employee_name,
  lt.name AS leave_type_name,
   lt.id AS leave_type_id
FROM 
  LeaveRequest lr
JOIN 
  Employee e ON e.id = lr.employee_id
JOIN 
  LeaveType lt ON lt.id = lr.leave_type_id
WHERE 
  lr.status = 2 
  AND lr.employee_id IN (${placeholders});
    `;

    const [result] = await pool.query(query, employeeIds);
    console.log("result: ", result);
    return result;
  } catch (err) {
    console.error("Director Model Error:", err);
    logger.error(`This is an error message for leaveModel/leaveRequestDirectorModel: ${err}`);
    return err;
  }
};

// Manger and HR and Director see the leaves history

export const leaveHistoryModel = async (employee_id) => {

  try {
    const employeeRows = await teamEmployeesIdFind(employee_id);
    if (!employeeRows || employeeRows.length === 0) {
      return "empty";
    }

    const employeeIds = employeeRows.map((emp) => emp.id);
    const placeholders = employeeIds.map(() => "?").join(",");

    const query = `
     SELECT 
    lr.*, 
    e.name,
    lt.name AS Leave_Name
  FROM 
    LeaveRequest lr
  INNER JOIN 
    Employee e ON lr.Employee_id = e.id
  INNER JOIN 
    LeaveType lt ON lr.leave_type_id = lt.id
  WHERE 
    lr.status IN (6, 7)
    AND lr.Employee_id IN (${placeholders})
  `;

    const [result] = await pool.query(query, employeeIds);
    return result;
  } catch (err) {
    console.error("HR Model Error:", err);
    logger.error(`This is an error message for leaveModel/leaveHistoryModel: ${err}`);
    return err;
  }
};
  // all user leave request dates
export const leaveDateHistoryModel = async (employee_id) => {
  try {

    const query = `
      SELECT start_date, end_date
      FROM LeaveRequest
      WHERE status != 7
        AND Employee_id = ?;
    `;

    const [result] = await pool.query(query, [employee_id]);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/leaveDateHistoryModel: ${err}`);
    throw err;
  }
};


// employee cancel the leave

export const employeeLeaveUpdateModel = async (payload) => {
 try {
  const { Leave_Request_Id, employee_id } = payload;

  const cancelLeaveStatusQuery = `UPDATE LeaveRequest SET status = 7 WHERE id = ? AND (status = 0 OR status = 1)`;

  const query = `INSERT INTO ApprovalFlow(leave_request_id, approved_id, approval_status, comments)VALUES(?, ?, 7, 'I Cancel the leave') `;
  const values = [Leave_Request_Id, employee_id];
 const result =  await pool.query(cancelLeaveStatusQuery, [Leave_Request_Id]);
   await pool.query(query, values);
  return result;
 } catch (err) {
  console.error(err);
  logger.error(`This is an error message for leaveModel/employeeLeaveUpdateModel: ${err}`);
 }
};

// manager accepet or cancel the leave

export const managerLeaveUpdateModel = async (payload) => {
  const { LeaveRequestId, employee_id, changeStatus, comment } = payload;
  try {
    const query = `INSERT INTO ApprovalFlow(leave_request_id, approved_id, approval_status, comments)VALUES(?, ?, ?, ?) `;
    const cancelLeaveStatusQuery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
    const approvedLeaveStatusQuery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
    const values = [LeaveRequestId, employee_id, changeStatus, comment];
    const [result] = await pool.query(query, values);
    if (result.affectedRows > 0) {
      if (changeStatus === 7) {
        await pool.query(cancelLeaveStatusQuery, [
          changeStatus,
          LeaveRequestId,
        ]);
      } else if (changeStatus === 1) {
        await pool.query(approvedLeaveStatusQuery, [
          changeStatus,
          LeaveRequestId,
        ]);
      }
    }
    return result;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/managerLeaveUpdateModel: ${err}`);
  }
};

// HR accept or cancel the leave

export const hrLeaveUpdateModel = async (payload) => {
 try {
  const {
    LeaveRequestId,
    employee_id,
    changeStatus,
    Leave_Count,
    leave_Type_ID,
    comment,
    Employee_Id,
  } = payload;

  const query = `INSERT INTO ApprovalFlow(leave_request_id, approved_id, approval_status, comments)VALUES(?, ?, ?, ?) `;
  const values = [LeaveRequestId, employee_id, changeStatus, comment];
  const cancelLeaveStatusQuery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
  const [result] = await pool.query(query, values);
  if (result.affectedRows > 0) {
    if (changeStatus === 7) {
      await pool.query(cancelLeaveStatusQuery, [changeStatus, LeaveRequestId]);
    } else if (changeStatus === 6) {
      if (Leave_Count >= 4) {
        let status = 2;
        const query = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
        await pool.query(query, [status, LeaveRequestId]);
      } else {
        const lb = await employeeLeaveBalance(
          Employee_Id,
          Leave_Count,
          leave_Type_ID
        );
        console.log("lb:", lb);

        if (lb.success && lb.result.affectedRows > 0) {
          const lbquery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
          const [result] = await pool.query(lbquery, [
            changeStatus,
            LeaveRequestId,
          ]);
          return result;
        } else {
          console.log("Leave balance not updated or no matching record.");
        }
      }
    }
  }
  return result;
 } catch (err) {
  console.error(err);
  logger.error(`This is an error message for leaveModel/hrLeaveUpdateModel: ${err}`);
 }
};

// Dirctor accept or cancel the leave

export const directorLeaveUpdateModel = async (payload) => {
try {
  const {
    LeaveRequestId,
    employee_id,
    changeStatus,
    Leave_Count,
    leave_Type_ID,
    comment,
    Employee_Id,
  } = payload;

  const query = `INSERT INTO ApprovalFlow(leave_request_id, approved_id, approval_status, comments)VALUES(?, ?, ?, ?) `;
  const cancelLeaveStatusQuery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
  const approvedLeaveStatusQuery = `UPDATE LeaveRequest SET status = ? WHERE id = ?`;
  const values = [LeaveRequestId, employee_id, changeStatus, comment];
  const [result] = await pool.query(query, values);
  if (result.affectedRows > 0) {
    if (changeStatus === 7) {
      await pool.query(cancelLeaveStatusQuery, [changeStatus, LeaveRequestId]);
    } else if (changeStatus === 6) {
      const lb = await employeeLeaveBalance(
        Employee_Id,
        Leave_Count,
        leave_Type_ID
      );
      if (lb) {
        console.log("worked", lb);
        const [result] = await pool.query(approvedLeaveStatusQuery, [
          changeStatus,
          LeaveRequestId,
        ]);
        return result;
      } else {
        console.log("not work");
      }
    }
  }
  return result;
} catch (err) {
  console.error(err);
  logger.error(`This is an error message for leaveModel/directorLeaveUpdateModel: ${err}`);
}
};

//========GET==========

//user see the holidays
export const holidaysModel = async () => {
  try {
    const [rows] = await pool.query(`SELECT * FROM HOLIDAYS`);
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/holidaysModel: ${err}`);
  }
};


// employee type show

export const employeeTypeModel = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT name, description FROM employeetype`
    );
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/employeeTypeModel: ${err}`);
    throw err;
  }
};

// leave policy show

export const leavePoliciesModel = async () => {
  try {
    const [rows] = await pool.query(`SELECT * FROM leavepolicy`);
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/leavePoliciesModel: ${err}`);
    throw err;
  }
};

// leave type show

export const leaveTypeShowModel = async () => {
  try {
    const [rows] = await pool.query(`SELECT * FROM leavetype`);
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(`This is an error message for leaveModel/leaveTypeShowModel: ${err}`);
    throw err;
  }
};
