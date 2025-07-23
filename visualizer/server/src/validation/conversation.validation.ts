import Joi from 'joi';

export const createConversation = Joi.object({
    body: Joi.object().keys({
        userPrompt: Joi.string().optional()
    })
});