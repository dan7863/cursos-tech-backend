import express from "express";
import UserModel from "../models/user.js";
import { UserNames } from "../config/names.js";

const router = express.Router();

router.get(`/${UserNames.api_name}`, UserModel.getUsers);
router.get(`/${UserNames.api_name}/:id`, UserModel.getUser);
router.post(`/${UserNames.api_name}`, UserModel.createUser);
router.patch(`/${UserNames.api_name}/:id`, UserModel.partialUpdateUser);
router.put(`/${UserNames.api_name}/:id`, UserModel.updateUser);
router.delete(`/${UserNames.api_name}/:id`, UserModel.deleteUser);

export default router;