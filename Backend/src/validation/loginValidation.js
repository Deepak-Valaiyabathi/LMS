import Joi from 'joi';

export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/@lumel\.com$/)
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.pattern.base": "Email must end with @lumel.com",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:"\\\\|,.<>/?]).{8,20}$'))
    .required()
    .messages({
      "string.pattern.base": "Password must be 8-20 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required"
    }),
});






