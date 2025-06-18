import Joi from 'joi';

export const empployeeCreateValidation = Joi.object({
  Employee_id: Joi.string().min(8).max(8).pattern(/^LMT/).required().messages({
    "string.pattern.base": "Employee_id must start with LMT",
    "string.min": "Employee_id must be exactly 8 characters long",
    "string.max": "Employee_id must be exactly 8 characters long",
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
    .email()
    .pattern(/@lumel\.com$/)
    .required()
    .messages({
      "string.email": "Invalid Employee_email format",
      "string.pattern.base": "Employee_email must end with @lumel.com",
      "any.required": "Employee_email is required",
    }),

  Role_id: Joi.number().required().messages({
    "any.required": "Role is required",
    "number.base": "Role must be a number",
  }),

  Manager_id: Joi.string().min(8).max(8).pattern(/^LMT/).required().messages({
    "string.pattern.base": "Manager_id must start with LMT",
    "any.required": "Manager_id is required",
  }),

  HR_id: Joi.string().min(8).max(8).pattern(/^LMT/).required().messages({
    "string.pattern.base": "HR_id must start with LMT",
    "any.required": "HR_id is required",
  }),

  Director_id: Joi.string().min(8).max(8).pattern(/^LMT/).required().messages({
    "string.pattern.base": "Director_id must start with LMT",
    "any.required": "Director_id is required",
  }),

  Password: Joi.string().min(7).max(8).required().messages({
    "string.min": "Password must be at least 7 characters long",
    "string.max": "Password must not exceed 8 characters",
    "any.required": "Password is required",
  }),
});






export const employeePersonalD = Joi.object({

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



export const employeeJobD = Joi.object({

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




export const employeeT = Joi.object({
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