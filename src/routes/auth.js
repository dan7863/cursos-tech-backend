import express from "express";
import AuthController from "../controllers/auth.js";
import { validateAuthFields } from "../schemas/auth.js";
import { loginLimiter, resendLimiter } from "../config/rate_limits/auth.js";

const router = express.Router();

router.post('/signin', loginLimiter, validateAuthFields('signin'), AuthController.signIn);

router.post('/signup', validateAuthFields('signup'), AuthController.signUp);

router.get('/confirmation/:email/:token', resendLimiter, AuthController.confirmEmail);

router.get('/reset/:email/:token', resendLimiter, AuthController.confirmPassword);

router.post('/resend', AuthController.resendLink);

router.post('/recover', AuthController.recoverPassword);

router.post('/reset', resendLimiter, AuthController.resetPassword);

export default router;
