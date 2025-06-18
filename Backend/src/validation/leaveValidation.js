import Joi from 'joi';


export const leaveT = Joi.object({
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


  export  const holidayV = Joi.object({
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

  export  const leaveP = Joi.object({
    employee_type_id: Joi.number().required().messages({
      "any.required": "Role is required",
      "number.empty": "Role cannot be empty",
    }),
    leave_type_id: Joi.number().required().messages({
      "any.required": "Role is required",
      "number.empty": "Role cannot be empty",
    }),
    max_days_per_year: Joi.number().required().messages({
      "any.required": "Role is required",
      "number.empty": "Role cannot be empty",
    }),
    name: Joi.string().min(10).max(400).required().messages({
      "string.min": "Name must be at least 20 characters long",
      "string.max": "Name must not exceed 400 characters",
      "any.required": "Name is required",
    }),
    accrual_per_month: Joi.number().required().messages({
      "any.required": "Role is required",
      "number.empty": "Role cannot be empty",
    }),
  })

  export const leaveR = Joi.object({
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