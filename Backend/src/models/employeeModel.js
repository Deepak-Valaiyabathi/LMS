// models/employeeModel.js
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken";
import { teamEmployeesIdFind } from "../utility/employeeIdFind.js";
import { addLeaveBalance } from "../utility/addLeaveBalance.js";
import logger from "../logger/logger.js";
import dotenv from 'dotenv';
dotenv.config();

//=======> POST 🚩 <=========
// create employee or add new employee data
export const createEmployeeModel = async (payload) => {
  try {
    const {
      Employee_id,
      Empolyee_name,
      Employee_email,
      Password,
      Role_id,
      Manager_id,
      HR_id,
      Director_id,
    } = payload;

    const query = `
    INSERT INTO Employee (id, name, email, emp_type_id, manager_id, hr_id, director_id, password, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')
  `;

    const values = [
      Employee_id,
      Empolyee_name,
      Employee_email,
      Role_id,
      Manager_id,
      HR_id,
      Director_id,
      Password,
    ];

    const [result] = await pool.query(query, values);
    if (result.affectedRows > 0) {
      await addLeaveBalance(Employee_id, Role_id);
    }
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/createEmployeeModel: ${err}`
    );
  }
};

//employee details add
export const employeeDetailsModel = async (payload) => {
  try {
    const {
      EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address,
    } = payload;

    const query = `
          INSERT INTO employeedetails 
          (employee_id, full_name, gender, martial_status, nationality, mobile_number, date_of_birth, blood_group, address) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address,
    ];

    const [result] = await pool.query(query, values);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/employeeDetailsModel: ${err}`
    );
  }
};
//employee job details add

export const employeeJobDetailsModel = async (payload) => {
  try {
    const {
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager,
    } = payload;

    const query = `
           INSERT INTO jobdetails 
           (employee_id, date_of_joining, job_title, worker_type, time_type, location, reporting_manager) 
           VALUES (?, ?, ?, ?, ?, ?, ?)
         `;

    const values = [
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager,
    ];

    const [result] = await pool.query(query, values);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/employeeJobDetailsModel: ${err}`
    );
  }
};

// employee type add

export const employeTypeModel = async (payload) => {
  try {
    const { name, description } = payload;

    const query = `INSERT INTO employeetype (name, description) VALUES (?, ?)`;
    const values = [name, description];
    const [result] = await pool.query(query, values);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/employeTypeModel: ${err}`
    );
    throw err;
  }
};
// employee employee count and roles list

export const employeeCountRoleModel = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
    et.name AS role, 
    COUNT(*) AS count 
FROM 
    employeetype et 
JOIN 
    employee e ON e.emp_type_id = et.id
GROUP BY 
    et.id, et.name;

    `);
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/employeeCountRoleModel: ${err}`
    );
  }
};

/// PUT

// account deactivated
export const employeeDeactivateModel = async (payload) => {
  try {
    const { employee_id } = payload;
   const query = `UPDATE employee SET status = 'Deactive' where id = ?`;
    const values = [employee_id];
    const [result] = await pool.query(query, values);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/getEmployeeListModel: ${err}`
    );
  }
};
export const employeeEditModel = async (payload) => {


  const updateResults = [];

  for (const [id, manager_id] of Object.entries(payload.employeeEditChange)) {
    const query = `
      UPDATE employee
      SET manager_id = ?
      WHERE id = ?
    `;
    const values = [manager_id, id];
  
    try {
      const result = await pool.query(query, values);
      updateResults.push({ id, status: 'success', result });
    } catch (error) {
      updateResults.push({ id, status: 'error', error: error.message });
    }
  }
  
  console.log('Update Results:', updateResults);
  return updateResults;
  
}

//=#=#=#=#=#=# GET #=#=#=#=#=#=#=

// get employee list
export const getEmployeeListModel = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT *, jobdetails.date_of_joining FROM employee JOIN jobdetails ON jobdetails.employee_id = employee.id`
    );
    return rows;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/getEmployeeListModel: ${err}`
    );
  }
};

// user & admin login

export const loginModel = async (payload) => {
  try {
    const { email, password } = payload;
    const query = `
    SELECT 
      et.name AS employee_type_name,
      e.*
    FROM 
      Employee e
    JOIN 
      EmployeeType et ON et.id = e.emp_type_id
    WHERE 
      e.email = ? AND e.status = 'Active' AND e.password = ?;
  `;
  
  const [rows] = await pool.query(query, [email, password]);
  
    const SECRET_KEY = process.env.JWT_SECRET;

    if (rows.length === 0) {
  
      return rows;
    }

    const employee = rows[0];
    if (employee.password == password) {
      const tokenPayload = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        emp_type_id: employee.emp_type_id,
      };

      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "3h" });
      const result = {
        token: token,
        id: employee.id,
        name: employee.name,
        emp_type_id: employee.emp_type_id,
        manager_id: employee.manager_id,
        role: employee.employee_type_name,
      };
      return result;
    } else {
      console.log("Invalid password");
      return rows;
    }
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/loginModel: ${err}`
    );
  }
};

//user see the leave balance
export const leaveBalanceModel = async (employee_id) => {
  try {

    const query = `
        SELECT LeaveType.name, LeaveBalance.total_leave, LeaveType.id
        FROM LeaveBalance 
        JOIN LeaveType ON LeaveType.id = LeaveBalance.leave_type_id 
        WHERE LeaveBalance.employee_id = ?
      `;

    const [result] = await pool.query(query, [employee_id]);

    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/leaveBalanceModel: ${err}`
    );
  }
};

//user see the personal details
export const personalDetailsModel = async (employee_id) => {
  try {
 console.log("worked");
 
console.log("employee_id", employee_id);
    const query = `SELECT * FROM EmployeeDetails WHERE employee_id = ?`;

    const [result] = await pool.query(query, employee_id);

    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/personalDetailsModel: ${err}`
    );
  }
};

//user see the job details
export const jobDetailsModel = async (employee_id) => {
  try {
  
    const query = `SELECT * FROM JobDetails WHERE employee_id = ?`;
    const [result] = await pool.query(query, employee_id);
  
    return result;
  } 
  catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/jobDetailsModel: ${err}`
    );
  }
};

// peers show
export const peersModel = async (manager_id) => {

  try {
    const employeeRows = await teamEmployeesIdFind(manager_id);
    const employeeIds = employeeRows.map((emp) => emp.id);
    const placeholders = employeeIds.map(() => "?").join(",");
    const query = `SELECT 
  e.name, 
  e.email, 
  j.location, 
  j.job_title, 
  ed.gender 
FROM Employee e 
JOIN jobdetails j ON e.id = j.employee_id 
JOIN employeedetails ed ON e.id = ed.employee_id 
WHERE e.id IN (${placeholders}) AND e.status = 'Active';
`;
    const [result] = await pool.query(query, employeeIds);
    return result;
  } catch (err) {
    console.error(err);
    logger.error(
      `This is an error message for employeeModel/peersModel: ${err}`
    );
  }
};
