import express from "express";
import AuthController from "../controllers/auth.js";
import { validateAuthFields } from "../schemas/auth.js";

const router = express.Router();

router.post('/signin', validateAuthFields('signin'),AuthController.signIn);

router.post('/signup', validateAuthFields('signup'), AuthController.signUp);


export default router;
