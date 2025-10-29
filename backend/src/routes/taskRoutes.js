import express from 'express';
const router = express.Router();
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.get('/stats/summary', protect, getTaskStats);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
