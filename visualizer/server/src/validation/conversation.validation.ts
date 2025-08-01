import Joi from 'joi';

export const createConversation = Joi.object({
    body: Joi.object().keys({
        prompt: Joi.string().required()
    })
});

export const addAssistantMessage = Joi.object({
    body: Joi.object().keys({
        conversation_id: Joi.string().required(),
        message: Joi.string().required(),
    })
});

export const getAllMessages = Joi.object({
    body: Joi.object().keys({
        conversation_id: Joi.string().required(),
    })
});