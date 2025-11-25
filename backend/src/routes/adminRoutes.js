import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCourses,
  getAllTasks
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes đều require authentication và admin role
router.use(protect);
router.use(admin);

// Stats
router.get('/stats', getAdminStats);

// Users management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// View all data
router.get('/courses', getAllCourses);
router.get('/tasks', getAllTasks);

export default router;
