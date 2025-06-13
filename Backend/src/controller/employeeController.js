import Joi from "joi";

// controller/employeeController.js
import { createEmployeeModel } from "../models/employeeModel.js";
import { employeTypeModel } from "../models/employeeModel.js";
import { employeeDetailsModel } from "../models/employeeModel.js";
import { employeeJobDetailsModel } from "../models/employeeModel.js";
import { loginModel } from "../models/employeeModel.js";
import { personalDetailsModel } from "../models/employeeModel.js";
import { jobDetailsModel } from "../models/employeeModel.js";
import { leaveBalanceModel } from "../models/employeeModel.js";
import { employeeCountRoleModel } from "../models/employeeModel.js";
import { getEmployeeListModel } from "../models/employeeModel.js";
import { peersModel } from "../models/employeeModel.js";
//xxxxxxxxxxxxxxx Admin xxxxxxxxxxxx>

//=======> POST 🚩 <=========

// create employee or add new employee data
export const createEmployee = async (request, h) => {
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
    } = request.payload;
    const schema = Joi.object({
      Employee_id: Joi.string()
        .min(8)
        .max(8)
        .pattern(/^LMT/)
        .required()
        .messages({
          "string.pattern.base": "Employee_id must start with LMT",
          "string.min": "Employee_id must be exactly 8 characters long",
          "string.max": "Employee_id must be exactly 8 characters long",
          "string.base": "Employee_id must be a string",
          "any.required": "Employee_id is required",
        }),

      Empolyee_name: Joi.string().min(3).max(50).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name must not exceed 50 characters",
        "any.required": "Name is required",
      }),

      Employee_email: Joi.string()
        .Employee_email()
        .pattern(/@lumel\.com$/)
        .required()
        .messages({
          "string.Employee_email": "Invalid Employee_email format",
          "string.pattern.base": "Employee_email must end with @lumel.com",
          "any.required": "Employee_email is required",
        }),

      Role_id: Joi.number().Role_id().required().messages({
        "any.required": "Role is required",
        "number.empty": "Role cannot be empty",
      }),

      Manager_id: Joi.string()
        .min(8)
        .max(8)
        .pattern(/^LMT/)
        .required()
        .messages({
          "string.pattern.base": "Manager_id must start with LMT",
          "string.min": "Manager_id must be exactly 8 characters long",
          "string.max": "Manager_id must be exactly 8 characters long",
          "string.base": "Manager_id must be a string",
          "any.required": "Manager_id is required",
        }),

      HR_id: Joi.string().min(8).max(8).pattern(/^LMT/).required().messages({
        "string.pattern.base": "HR_id must start with LMT",
        "string.min": "HR_id must be exactly 8 characters long",
        "string.max": "HR_id must be exactly 8 characters long",
        "string.base": "HR_id must be a string",
        "any.required": "HR_id is required",
      }),

      Director_id: Joi.string()
        .min(8)
        .max(8)
        .pattern(/^LMT/)
        .required()
        .messages({
          "string.pattern.base": "Director_id must start with LMT",
          "string.min": "Director_id must be exactly 8 characters long",
          "string.max": "Director_id must be exactly 8 characters long",
          "string.base": "Director_id must be a string",
          "any.required": "Director_id is required",
        }),
      Password: Joi.string().min(7).max(8).required().messages({
        "string.min": "Password must be at least 7 characters long",
        "string.max": "Password must not exceed 8 characters",
        "any.required": "Password is required",
      }),
    });

    const { error } = schema.validate({
      Employee_id,
      Empolyee_name,
      Employee_email,
      Password,
      Role_id,
      Manager_id,
      HR_id,
      Director_id,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await createEmployeeModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "Employee added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//employee details add
export const employeeDetails = async (request, h) => {
  try {
    const {EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address} = request.payload;

    const schema = Joi.object({

      EmployeeId: Joi.string()
      .min(8)
      .max(8)
      .pattern(/^LMT/)
      .required()
      .messages({
        "string.pattern.base": "Employee_id must start with LMT",
        "string.min": "Employee_id must be exactly 8 characters long",
        "string.max": "Employee_id must be exactly 8 characters long",
        "string.base": "Employee_id must be a string",
        "any.required": "Employee_id is required",
      }),

      FullName: Joi.string().min(4).max(20).required().messages({
        "string.min": "FullName must be at least 4 characters long",
        "string.max": "FullName must not exceed 20 characters",
        "any.required": "FullName is required",
      }),

      Gender: Joi.string()
        .valid("Male", "Female", "Other")
        .required()
        .messages({
          "any.only": "Gender must be one of male, female, or other",
          "any.required": "Gender is required",
          "string.base": "Gender must be a string",
        }),
        MaritalStatus: Joi.string()
        .valid("Single", "Married", "Divorced")
        .required()
        .messages({
          "any.only": "MaritalStatus must be one of Single, Married, or Divorced",
          "any.required": "MaritalStatus is required",
          "string.base": "MaritalStatus must be a string",
        }),
        Nationality: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Nationality must be a string',
      'string.empty': 'Nationality is required',
      'string.min': 'Nationality must be at least 2 characters',
      'string.max': 'Nationality must not exceed 50 characters',
      'any.required': 'Nationality is required',
    }),

  MobileNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be a valid 10-digit number starting with 6-9',
      'any.required': 'Mobile number is required',
    }),

  DateOfBirth: Joi.date()
    .less('now')
    .required()
    .messages({
      'date.base': 'Date of Birth must be a valid date',
      'date.less': 'Date of Birth must be in the past',
      'any.required': 'Date of Birth is required',
    }),

  BloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')
    .required()
    .messages({
      'any.only': 'Blood Group must be a valid type (A+, A-, B+, etc.)',
      'any.required': 'Blood Group is required',
    }),

  Address: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.base': 'Address must be a string',
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address must not exceed 200 characters',
      'any.required': 'Address is required',
    }),

    });
    const { error } = schema.validate({
      EmployeeId,
      FullName,
      Gender,
      MaritalStatus,
      Nationality,
      MobileNumber,
      DateOfBirth,
      BloodGroup,
      Address,
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await employeeDetailsModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee details added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};
//employee job details add
export const employeeJobDetails = async (request, h) => {
  try {
    const {
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager
    } = request.payload;

    const schema = Joi.object({

      EmployeeId: Joi.string()
      .min(8)
      .max(8)
      .pattern(/^LMT/)
      .required()
      .messages({
        "string.pattern.base": "Employee_id must start with LMT",
        "string.min": "Employee_id must be exactly 8 characters long",
        "string.max": "Employee_id must be exactly 8 characters long",
        "string.base": "Employee_id must be a string",
        "any.required": "Employee_id is required",
      }),
      Dateofjoining: Joi.date()
    .less('now')
    .required()
    .messages({
      'date.base': 'Date of joining must be a valid date',
      'date.less': 'Date of joining must be in the past',
      'any.required': 'Date of joining is required',
    }),
    
    JobTitle: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Job Title must be a string',
      'string.empty': 'Job Title is required',
      'string.min': 'Job Title must be at least 2 characters',
      'string.max': 'Job Title must not exceed 100 characters',
      'any.required': 'Job Title is required',
    }),

  WorkedType: Joi.string()
    .valid('Remote', 'Onsite', 'Hybrid')
    .required()
    .messages({
      'any.only': 'Worked Type must be one of Remote, Onsite, Hybrid',
      'any.required': 'Worked Type is required',
    }),

  TimeType: Joi.string()
    .valid('Full-Time', 'Part-Time', 'Contract')
    .required()
    .messages({
      'any.only': 'Time Type must be one of Full-Time, Part-Time, or Contract',
      'any.required': 'Time Type is required',
    }),

  Location: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Location must be a string',
      'string.empty': 'Location is required',
      'string.min': 'Location must be at least 2 characters',
      'string.max': 'Location must not exceed 100 characters',
      'any.required': 'Location is required',
    }),

  ReportingManager: Joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({
      'string.base': 'Reporting Manager must be a string',
      'string.empty': 'Reporting Manager is required',
      'string.min': 'Reporting Manager must be at least 3 characters',
      'string.max': 'Reporting Manager must not exceed 25 characters',
      'any.required': 'Reporting Manager is required',
    }),

    });


    const { error } = schema.validate({
      EmployeeId,
      Dateofjoining,
      JobTitle,
      WorkedType,
      TimeType,
      Location,
      ReportingManager
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await employeeJobDetailsModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee job details added" }).code(201);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// empoyee type add
export const employeType = async (request, h) => {
  try {

    const {name, description} = request.payload;

    const schema = Joi.object({
      name: Joi.string().min(4).max(20).required().messages({
        "string.min": "name must be at least 4 characters long",
        "string.max": "name must not exceed 20 characters",
        "any.required": "name is required",
      }),
      description: Joi.string().min(10).max(150).required().messages({
        "string.min": "description must be at least 4 characters long",
        "string.max": "description must not exceed 20 characters",
        "any.required": "description is required",
      }),
    })

    const { error } = schema.validate({
      name, description
    });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }


    const result = await employeTypeModel(request.payload);
    if (result.affectedRows > 0) {
      return h.response({ message: "employee type added" }).code(201);
    }
  } catch (err) {
    console.error(err);
  }
};
//=#=#=#=#=#=# GET #=#=#=#=#=#=#=
//employee count and role list
export const employeeCountRole = async (request, h) => {
  try {
    const result = await employeeCountRoleModel(request.payload);
    if (result.length > 0) {
      return h.response({ result: result });
    } else {
      h.response({ message: "employees not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// get employee list

export const getEmployeeList = async (request, h) => {
  try {
    const result = await getEmployeeListModel(request.payload);

    if (result.length > 0) {
      return h.response(result);
    } else {
      h.response({ message: "employees not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

//<xxxxxxxxxxxx> user <xxxxxxxxxxxxxxxx>

//<============> Post 🚩<==============>

// user & admin login
export const login = async (request, h) => {
  try {
    const { email, password } = request.payload;
    const schema = Joi.object({
      email: Joi.string()
        .email()
        .pattern(/@lumel\.com$/)
        .required()
        .messages({
          "string.email": "Invalid email format",
          "string.pattern.base": "Email must end with @lumel.com",
          "any.required": "Email is required",
        }),

      password: Joi.string().min(7).max(8).required().messages({
        "string.min": "Password must be at least 7 characters long",
        "string.max": "Password must not exceed 8 characters",
        "any.required": "Password is required",
      }),
    });

    const { error } = schema.validate({ email, password });

    if (error) {
      return h.response({ message: error.message }).code(400);
    }

    const result = await loginModel(request.payload);
    const { token, id, name, emp_type_id, manager_id, role } = result;

    if (result.token.length > 0) {
      console.log(manager_id);
      return h.response({
        token: token,
        id: id,
        name: name,
        emp_type_id: emp_type_id,
        manager_id: manager_id,
        role: role,
      });
    } else {
      return h.response({ message: "login failed" }).code(404);
    }
  } catch (err) {
    console.error(err);
  }
};

//user see the leave balance

export const leaveBalance = async (request, h) => {
  try {
    const result = await leaveBalanceModel(request.payload);
    if (result.length > 0) {
      console.log(result,"ok")
      return h
        .response({
          message: "leave balance data available",
          leaveBalance: result,
        })
        .code(200);
    } else {
      return h.response({ message: "leave balance data not available" });
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "sever error" }).code(500);
  }
};

//user see the personal details
export const personalDetails = async (request, h) => {
  try {
    const result = await personalDetailsModel(request.payload);
    if (result.length > 0) {
      const {
        full_name,
        gender,
        martial_status,
        nationality,
        mobile_number,
        date_of_birth,
        blood_group,
        address,
      } = result[0];

      return h
        .response({
          message: "Personal details available",
          personalDetails: {
            full_name,
            gender,
            martial_status,
            nationality,
            mobile_number,
            date_of_birth,
            blood_group,
            address,
          },
        })
        .code(200);
    } else {
      return h
        .response({ message: "Personal details not available" })
        .code(404);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};

// // user see the job details

export const jobDetails = async (request, h) => {
  try {
    const result = await jobDetailsModel(request.payload);

    if (result.length > 0) {
      const {
        employee_id,
        date_of_joing,
        job_title,
        worker_type,
        time_type,
        location,
        reporting_manager,
      } = result[0];
      return h
        .response({
          jobDetails: {
            employee_id,
            date_of_joing,
            job_title,
            worker_type,
            time_type,
            location,
            reporting_manager,
          },
        })
        .code(200);
    } else {
      return h.response({ message: "job details not available" }).code(404);
    }
  } catch (err) {
    console.error(err);
    return h.response({ message: "Server error" }).code(500);
  }
};
 // peers show
export const peers = async (request, h) => {
  try {
    const result = await peersModel(request.payload);
    if (!result || result.length === 0) {
      return h.response({ message: "Not available" }).code(404);
    }
    const peersData = result.map((row) => ({
      Employee_name: row.name,
      Employee_job_title: row.job_title,
      Employee_email: row.email,
      Location: row.location,
      Gender: row.gender,
    }));

    return h.response({ peersData }).code(200);
  } catch (err) {
    console.error(err);
  }
};
