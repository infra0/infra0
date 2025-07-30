import express from 'express';
import { seedUser } from "../controller/user.controller";

const router = express.Router();

router.post('/demo-user', seedUser);

export default router;