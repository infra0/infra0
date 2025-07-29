import Joi, { bool } from 'joi';

export const loginValidation = Joi.object({
    body: Joi.object().keys({
        contact: Joi.string()
            .required()
            .min(10)
            .max(15)
            .messages({
            'string.min': 'Contact number must be at least 10 digits',
            'string.max': 'Contact number must be at most 15 digits',
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


export const refreshToken = Joi.object({
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
})