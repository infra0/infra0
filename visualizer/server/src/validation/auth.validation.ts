import Joi, { bool } from 'joi';

// OAuth metadata validation
const loginMetaData = Joi.object().keys({
  email: Joi.string().email(),
  password: Joi.string(),
  gAccessToken: Joi.string(),
  sessionId: Joi.string(),
});

export const loginValidation = Joi.object({
    body: Joi.object().keys({
        provider: Joi.string().required(),
        metaData: loginMetaData.required()
    })
});


export const registerValidation = Joi.object({
    body: Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
});


export const refreshToken = Joi.object({
    body: Joi.object().keys({
        refreshToken: Joi.string().required()
    })
})

export const sessionStatusValidation = Joi.object({
    body: Joi.object().keys({
        sessionId: Joi.string().required()
    })
})