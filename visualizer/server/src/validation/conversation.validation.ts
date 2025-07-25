import Joi from 'joi';

export const createConversation = Joi.object({
    body: Joi.object().keys({
        prompt: Joi.string().required()
    })
});