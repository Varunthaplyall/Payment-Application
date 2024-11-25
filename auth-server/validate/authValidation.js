const joi = require('joi');


const userRegistrationSchema = joi.object({
    name: joi.string().required().messages({
        'string.empty': 'Name is required',
      }),
      email: joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
      phone: joi.string().pattern(/^[0-9]{12}$/).required().messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Please provide a valid 10-digit phone number',
      }),
      password: joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
      }),
})


module.exports = userRegistrationSchema