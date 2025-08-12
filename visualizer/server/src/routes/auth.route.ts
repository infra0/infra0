import express from 'express';
import * as authController from '../controller/auth.controller';
import validate from '../middleware/validate';
import { loginValidation, refreshToken, sessionStatusValidation } from '../validation/auth.validation';
import { registerValidation } from '../validation/auth.validation';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/login', validate(loginValidation), authController.login);

router.get('/session', authController.createSession);
router.post('/session/status', validate(sessionStatusValidation), authController.getSessionStatus);

router.post('/register', validate(registerValidation), authController.register);
router.post('/refresh', validate(refreshToken), authController.refreshToken);
router.get('/validate', authController.validateAccessToken);

router.get('/me', authMiddleware.verifyToken, authController.me);

export default router;