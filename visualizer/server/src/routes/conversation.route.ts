import express from 'express';
import * as conversationController from '../controller/conversation.controller';
import validate from '../middleware/validate';
import * as authMiddleware from '../middleware/auth';
import { addAssistantMessage, createConversation } from '../validation/conversation.validation';

const router = express.Router();


router.post('/create', authMiddleware.verifyToken, validate(createConversation), conversationController.create);
router.get('/', authMiddleware.verifyToken, conversationController.getAllConversations);
router.post('/completions', conversationController.chatCompletions);


router.post('/add-assistant-message', authMiddleware.verifyToken, validate(addAssistantMessage), conversationController.addAssistantMessage);


export default router;