import Joi from 'joi';

export const loginValidation = Joi.object({
    body: Joi.object().keys({
        contact: Joi.string()
            .pattern(/^\d{10}$/)
            .required()
            .messages({
            'string.pattern.base': 'Contact number must be exactly 10 digits',
            'any.required': 'Contact number is required'
        }),

        password: Joi.string()
            .required()
            .messages({
            'any.required': 'Password is required'
        })
    })
});


export const registerValidation = Joi.object({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        contact: Joi.string().pattern(/^\d{10}$/).required(),
        password: Joi.string().required()
    })
});
