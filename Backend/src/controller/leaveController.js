//leave controller

import {
  leavePolicyModel,
  leaveTypeModel,
  teamMemberCalenderModel,
  leaveRequestModel,
  holidayModel,
  leaveRequestStatusModel,
  leaveRequestStatusTimelineModel,
  managerLeaveUpdateModel,
  hrLeaveUpdateModel,
  directorLeaveUpdateModel,
  teamMembersLeaveStatusModel,
  employeeLeaveUpdateModel,
  leaveRequestManagerModel,
  leaveRequestHRModel,
  leaveTypeShowModel,
  leaveRequestDirectorModel,
  leaveHistoryModel,
  holidaysModel,
  leaveDateHistoryModel,
  employeeTypeModel,
  leavePoliciesModel
} from "../models/leaveModel.js";


import { leaveT, holidayV, leaveP, leaveR } from "../validation/leaveValidation.js";


//******** Admin ********/

// leave type create
export const leaveType = async (request, h) => {
  try {
    const { leaveName, description } = request.payload;


    const { error } = leaveT.validate({
      leaveName,
      description,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await leaveTypeModel(request.payload);
    return h
      .response({
        message: "leave Type created",
        leave_Type_ID: result.insertId,
      })
      .code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//holiday
export const holiday = async (request, h) => {
  try {
    const { holidayDate, holidayName, type } = request.payload;

   

    const { error } = holidayV.validate({
      holidayDate,
      holidayName,
      type,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await holidayModel(request.payload);
    return h
      .response({ message: "holiday added", holiday_Id: result.insertId })
      .code(201);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// Leave policy

export const leavePolicy = async (request, h) => {
  try {
    const {employee_type_id, leave_type_id, max_days_per_year, name, accrual_per_month} = request.payload;

  
    const { error } = leaveP.validate({  employee_type_id, leave_type_id, max_days_per_year, name, accrual_per_month  });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await leavePolicyModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "leave policy added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//******** Employee ********/


//leave apply
export const leaveRequest = async (request, h) => {
  try {

const {employee_id, leaveId, startDate, endDate, reason} = request.payload.formData;

    const { error } = leaveR.validate({  employee_id, leaveId, startDate, endDate, reason  });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }


    const result = await leaveRequestModel(request.payload);
   
    if (result.affectedRows === 0) {
      return h.response({ message: "Check leave balance" }).code(201);
    } else if (result.affectedRows === 1) {
      return h.response({ message: "leave request created" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//user see the leave request status

export const leaveRequestStatus = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;
    const result = await leaveRequestStatusModel(employee_id);

    if (result && Object.keys(result).length > 0) {
      const leaveStatus = result.map((row) => ({
        id: row.id,
        name: row.name,
        start_date: row.start_date,
        end_date: row.end_date,
        count: row.count,
        status: row.status,
      }));

      return h.response({ leaveStatus }).code(200);
    } else {
      return h.response({ message: "Leave request not available" }).code(404);
    }
  } catch (err) {
    console.error(err);
    return h
      .response({ message: "Internal server error", error: err.message })
      .code(500);
  }
};

// user see the leave request status timeline

export const leaveRequestStatusTimeline = async (request, h) => {
  try {
    const request_id = request.params.request_id;
    const result = await leaveRequestStatusTimelineModel(request_id);

    return h.response({ result }).code(200);
  } catch (err) {
    console.error(err);
  }
};



// team members leave status

export const teamMembersLeaveStatus = async (request, h) => {
  try {
    const result = await teamMembersLeaveStatusModel(request.params);

    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const teamLeaveStatus = result.map((row) => ({
      id: row.id,
      name: row.name,
      start_date: row.start_date,
      end_date: row.end_date,
      count: row.count,
      status: row.status,
    }));

    return h.response({ teamLeaveStatus }).code(200);
  } catch (err) {
    console.error("Error fetching team leave status:", err);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};

// team member calender

export const teamMemberCalender = async (request, h) => {
  try {
    const manager_id = request.params.manager_id;
    const result = await teamMemberCalenderModel(manager_id);

    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    console.log("Calender: ", result);
    const grouped = {};

    result.forEach(({ start_date, end_date, name, leave_type_name }) => {
      const employee = name.trim();
      const leaveType = leave_type_name.toLowerCase();

      if (!grouped[employee]) {
        grouped[employee] = {};
      }

      if (!grouped[employee][leaveType]) {
        grouped[employee][leaveType] = [];
      }

      grouped[employee][leaveType].push({ start_date, end_date });
    });

    return h.response(grouped).code(200);
  } catch (err) {
    console.error("Error in teamMemberCalender:", err);
    return h.response({ message: "Internal Server Error" }).code(500);
  }
};

// manager see the leave request
export const leaveRequestManager = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;
    const result = await leaveRequestManagerModel(employee_id);
    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const leaveRequestForManager = result.map((row) => ({
      LeaveRequestId: row.id,
      Employee_Id: row.employee_id,
      Employee_name: row.employee_name,
      Leave_Type: row.leave_type_name,
      Start_Date: row.start_date,
      End_Date: row.end_date,
      Leave_Count: row.count,
      Reason: row.reason,
      Status: row.status,
    }));

    return h.response({ leaveRequestForManager }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Internal server error", error: err.message });
  }
};

// hr see the leave request

export const leaveRequestHR = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;

    const result = await leaveRequestHRModel(employee_id);
    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const leaveRequestForHR = result.map((row) => ({
      LeaveRequestId: row.id,
      Employee_Id: row.employee_id,
      Employee_name: row.employee_name,
      Leave_Type: row.leave_type_name,
      leave_Type_ID: row.leave_type_id,
      Start_Date: row.start_date,
      End_Date: row.end_date,
      Leave_Count: row.count,
      Reason: row.reason,
      Status: row.status,
    }));

    return h.response({ leaveRequestForHR }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Internal server error", error: err.message });
  }
};

// Director see the leave request
export const leaveRequestDirector = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;
    const result = await leaveRequestDirectorModel(employee_id);

    if (!result || result === "empty" || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }

    const leaveRequestForDirector = result.map((row) => ({
      LeaveRequestId: row.id,
      Employee_Id: row.employee_id,
      Employee_name: row.employee_name,
      Leave_Type: row.leave_type_name,
      leave_Type_ID: row.leave_type_id,
      Start_Date: row.start_date,
      End_Date: row.end_date,
      Leave_Count: row.count,
      Reason: row.reason,
      Status: row.status,
    }));

    return h.response({ leaveRequestForDirector }).code(200);
  } catch (err) {
    console.error("Director Controller Error:", err);
    return h
      .response({ message: "Internal server error", error: err.message })
      .code(500);
  }
};

// Manger and HR and Director see the leaves history

export const leavesHistory = async (request, h) => {
  try {
    const employee_id = request.params.employee_id;
    const result = await leaveHistoryModel(employee_id);
    console.log("result", result);

    if (!result || result === "empty" || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const leavesHistory = result.map((row) => ({
      leaveRequestId: row.id,
      Employee_Id: row.employee_id,
      Employee_name: row.name,
      Leave_Type: row.Leave_Name,
      Start_Date: row.start_date,
      End_Date: row.end_date,
      Leave_Count: row.count,
      Status: row.status,
    }));
    return h.response({ leavesHistory }).code(200);
  } catch (err) {
    console.error(err);
    return h
      .response({ message: "Internal server error", error: err.message })
      .code(500);
  }
};

export const leaveDateHistory = async (request, h) => {

  try {
    const employee_id = request.params.employee_id;
    const result = await leaveDateHistoryModel(employee_id);
    console.log("leave dates: ", result);

    return h.response({ data: result }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to fetch leave history" }).code(500);
  }
};


// employee cancel the leave

export const employeeLeaveUpdate = async (request, h) => {
  try {
    const result = await employeeLeaveUpdateModel(request.payload);

    if (result.affectedRows === 0) {
      return h
        .response({
          message: "No matching leave request found or already processed",
        })
        .code(404);
    }
    return h.response({ message: "Leave successfully canceled" }).code(200);
  } catch (err) {
    console.error("Update Error:", err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// manager accepet or cancel the leave

export const managerLeaveUpdate = async (request, h) => {
  try {
    const result = await managerLeaveUpdateModel(request.payload);
    if (result.affectedRows === 0) {
      return h
        .response({ message: "User Cancell the leave request" })
        .code(404);
    }
    return h.response({
      message: "Successfully updated",
      leaveRequestId: request.payload.leaveRequestId,
    });
  } catch (err) {
    console.error("Update Error:", err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// HR accept or cancel the leave

export const hrLeaveUpdate = async (request, h) => {
  try {
    const result = await hrLeaveUpdateModel(request.payload);
    if (result.affectedRows === 0) {
      return h
        .response({ message: "Manager cancel the leave request" })
        .code(404);
    }
    return h.response({
      message: "Successfully updated",
      leaveRequest: request.payload.leaveRequestId,
    });
  } catch (err) {
    console.error("Update Error:", err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//Director accept or cancel the leave

export const directorLeaveUpdate = async (request, h) => {
  try {
    const result = await directorLeaveUpdateModel(request.payload);

    return h.response({
      message: "Successfully updated",
      leaveRequest: result,
    });
  } catch (err) {
    console.error("Update Error:", err);
    return h.response({ message: "Server error" }).code(500);
  }
};


// all user see the holidays

export const holidays = async (request, h) => {
  try {
    const result = await holidaysModel();

    if (!result || result.length === 0) {
      return h.response({ message: "Holidays not available" }).code(404);
    }

    const holiday = {};

    for (const { holiday_date, name, type } of result) {
      const normalizedType = type?.toLowerCase();

      if (normalizedType === "floater") {
        if (!holiday[normalizedType]) {
          holiday[normalizedType] = [];
        }
        holiday[normalizedType].push({ date: holiday_date, name });
      } else {
        if (!holiday[normalizedType]) {
          holiday[normalizedType] = [];
        }
        holiday[normalizedType].push({ date: holiday_date, name });
      }
    }

    const holidaysByType = {
      ...holiday,
    };

    return h.response(holidaysByType).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// employee type show


export const employeeType = async (request, h) => {
  try {
    const result = await employeeTypeModel();
      return h.response(result).code(200);

  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
}


// leave policy show

export const leavePolicies = async (request, h) => {
  try {
    const result = await leavePoliciesModel();
    return h.response(result).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
}

// leave type show


export const leaveTypeShow = async (request, h) => {
  try {
    const result = await leaveTypeShowModel();
      return h.response(result).code(200);

  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
}