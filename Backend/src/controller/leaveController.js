//leave controller
import { leavePolicyModel } from "../models/leaveModel.js";
import {
  leaveTypeModel,
  teamMemberCalenderModel,
} from "../models/leaveModel.js";
import { leaveRequestModel } from "../models/leaveModel.js";
import { holidayModel } from "../models/leaveModel.js";
import { leaveRequestStatusModel } from "../models/leaveModel.js";
import { leaveRequestStatusTimelineModel } from "../models/leaveModel.js";
import { managerLeaveUpdateModel } from "../models/leaveModel.js";
import { hrLeaveUpdateModel } from "../models/leaveModel.js";
import { directorLeaveUpdateModel } from "../models/leaveModel.js";
import { teamMembersLeaveStatusModel } from "../models/leaveModel.js";
import { employeeLeaveUpdateModel } from "../models/leaveModel.js";
import { leaveRequestManagerModel } from "../models/leaveModel.js";
import { leaveRequestHRModel } from "../models/leaveModel.js";
import { leaveRequestDirectorModel } from "../models/leaveModel.js";
import { leaveHistoryModel } from "../models/leaveModel.js";
import { holidaysModel } from "../models/leaveModel.js";
import { leaveDateHistoryModel } from "../models/leaveModel.js";
import { employeeTypeModel } from "../models/leaveModel.js";
import { leavePoliciesModel } from "../models/leaveModel.js";
import { leaveTypeShowModel } from "../models/leaveModel.js";
import Joi from "joi";

//=======> POST 🚩 <=========
//******** Admin ********/

// leave type create
export const leaveType = async (request, h) => {
  try {
    const { leaveName, description } = request.payload;

    const schema = Joi.object({
      leaveName: Joi.string().min(4).max(20).required().messages({
        "string.min": "leave name must be at least 4 characters long",
        "string.max": "leave name must not exceed 20 characters",
        "any.required": "leave name is required",
      }),
      description: Joi.string().min(10).max(150).required().messages({
        "string.min": "description must be at least 4 characters long",
        "string.max": "description must not exceed 20 characters",
        "any.required": "description is required",
      }),
    });

    const { error } = schema.validate({
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

    const schema = Joi.object({
      holidayDate: Joi.date().less("now").required().messages({
        "date.base": "Date of joining must be a valid date",
        "date.less": "Date of joining must be in the past",
        "any.required": "Date of joining is required",
      }),
      holidayName: Joi.string().min(4).max(20).required().messages({
        "string.min": "holiday name must be at least 4 characters long",
        "string.max": "holiday name must not exceed 20 characters",
        "any.required": "holiday name is required",
      }),
      type: Joi.string()
      .valid('Public', 'National', 'Floater', 'Other')
      .required()
      .messages({
        'any.only': 'Leave Type must be one of Public, National, Floater, Other',
        'any.required': 'Leave Type is required',
      }),
    });
    const { error } = schema.validate({
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

    const schema = Joi.object({
      employee_type_id: Joi.number().Role_id().required().messages({
        "any.required": "Role is required",
        "number.empty": "Role cannot be empty",
      }),
      leave_type_id: Joi.number().Role_id().required().messages({
        "any.required": "Role is required",
        "number.empty": "Role cannot be empty",
      }),
      max_days_per_year: Joi.number().Role_id().required().messages({
        "any.required": "Role is required",
        "number.empty": "Role cannot be empty",
      }),
      name: Joi.string().min(10).max(400).required().messages({
        "string.min": "Name must be at least 20 characters long",
        "string.max": "Name must not exceed 400 characters",
        "any.required": "Name is required",
      }),
      accrual_per_month: Joi.number().Role_id().required().messages({
        "any.required": "Role is required",
        "number.empty": "Role cannot be empty",
      }),
    })

    const { error } = schema.validate({  employee_type_id, leave_type_id, max_days_per_year, name, accrual_per_month  });

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
//=======> POST 🚩 <=========

//leave apply
export const leaveRequest = async (request, h) => {
  try {

const {employee_id, leaveId, startDate, endDate, reason} = request.payload.formData;

const schema = Joi.object({
  employee_id: Joi.string()
    .pattern(/^LMT\d{5}$/)
    .required()
    .messages({
      'string.pattern.base': 'Employee ID must start with "LMT" followed by 5 digits (e.g., LMT12345)',
      'string.empty': 'Employee ID is required',
      'any.required': 'Employee ID is required',
    }),

    leaveId: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Leave Type ID must be a number',
      'number.integer': 'Leave Type ID must be an integer',
      'number.positive': 'Leave Type ID must be a positive number',
      'any.required': 'Leave Type ID is required',
    }),

    startDate: Joi.date()
    .required()
    .messages({
      'date.base': 'Start Date must be a valid date',
      'any.required': 'Start Date is required',
    }),
  
    endDate: Joi.date()
    .min(Joi.ref('startDate')) 
    .required()
    .messages({
      'date.base': 'End Date must be a valid date',
      'date.min': 'End Date must be same or after Start Date',
      'any.required': 'End Date is required',
    }),
  
  

  reason: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.base': 'Reason must be a string',
      'string.empty': 'Reason is required',
      'string.min': 'Reason must be at least 5 characters long',
      'string.max': 'Reason must not exceed 200 characters',
      'any.required': 'Reason is required',
    }),
});

    const { error } = schema.validate({  employee_id, leaveId, startDate, endDate, reason  });

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
    const result = await leaveRequestStatusModel(request.payload);

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
    const result = await leaveRequestStatusTimelineModel(request.payload);

    return h.response({ result }).code(200);
  } catch (err) {
    console.error(err);
  }
};

//******** Employee see automatic data********/
//+++++++++++++ Post ++++++++++
//
// team members leave status

export const teamMembersLeaveStatus = async (request, h) => {
  try {
    const result = await teamMembersLeaveStatusModel(request.payload);

    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const teamLeaveStatus = result.map((row) => ({
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
    const result = await teamMemberCalenderModel(request.payload);

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
    const result = await leaveRequestManagerModel(request.payload);
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
    const result = await leaveRequestHRModel(request.payload);
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
    const result = await leaveRequestDirectorModel(request.payload);

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
    const result = await leaveHistoryModel(request.payload);
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
  console.log("history payload", request.payload);
  try {
    const result = await leaveDateHistoryModel(request.payload);
    console.log("leave dates: ", result);

    return h.response({ data: result }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to fetch leave history" }).code(500);
  }
};

//=======> PUT 🆙 <=========
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

//==========GET==============
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