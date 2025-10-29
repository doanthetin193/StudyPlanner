import express from 'express';
const router = express.Router();
import {
  getTimetable,
  getWeeklyTimetable,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable
} from '../controllers/timetableController.js';
import { protect } from '../middleware/auth.js';

router.route('/')
  .get(protect, getTimetable)
  .post(protect, createTimetable);

router.get('/weekly', protect, getWeeklyTimetable);

router.route('/:id')
  .get(protect, getTimetableById)
  .put(protect, updateTimetable)
  .delete(protect, deleteTimetable);

export default router;
