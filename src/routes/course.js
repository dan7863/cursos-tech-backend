import express from "express";
import CourseController from "../controllers/courses.js";
import { CourseNames } from "../config/names.js";

const router = express.Router();

router.get(`/${CourseNames.api_name}/cards`, CourseController.getCoursesCards);

export default router;