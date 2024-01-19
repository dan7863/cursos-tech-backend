import express from "express";
import AuthController from "../controllers/auth.js";
import { validateAuthFields } from "../schemas/auth.js";
import { loginLimiter, resendLimiter } from "../config/rate_limits/auth.js";
import { UserNames } from "../config/names.js";

const router = express.Router();

router.post(`/${UserNames.api_name}/signin`, loginLimiter, validateAuthFields('signin'), AuthController.signIn);

router.post(`/${UserNames.api_name}/signup`, validateAuthFields('signup'), AuthController.signUp);

router.get(`/${UserNames.api_name}/confirmation/:email/:token`, resendLimiter, AuthController.confirmEmail);

router.get(`/${UserNames.api_name}/validate-request-password/:email/:token`, resendLimiter, AuthController.validateRequestPassword);

router.post(`/${UserNames.api_name}/resend`, AuthController.resendLink);

router.post(`/${UserNames.api_name}/recover`, AuthController.recoverPassword);

router.post(`/${UserNames.api_name}/reset`, resendLimiter, AuthController.resetPassword);

export default router;
