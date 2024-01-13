import express from "express";
import AuthController from "../controllers/auth.js";
import { validateAuthFields } from "../schemas/auth.js";
import { loginLimiter, resendLimiter } from "../config/rate_limits/auth.js";

const router = express.Router();

router.post('/signin', loginLimiter, validateAuthFields('signin'), AuthController.signIn);

router.post('/signup', validateAuthFields('signup'), AuthController.signUp);

router.get('/confirmation/:email/:token', resendLimiter, AuthController.confirmEmail);

router.post('/resend', AuthController.resendLink);

export default router;
