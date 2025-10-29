import express from 'express';
const router = express.Router();
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';

router.route('/')
  .get(protect, getCourses)
  .post(protect, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

export default router;
