import User from '../models/User.js';
import Course from '../models/Course.js';
import Task from '../models/Task.js';
import Timetable from '../models/Timetable.js';

// @desc    Lấy dashboard stats cho admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalTasks,
      totalTimetable,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Task.countDocuments(),
      Timetable.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password')
    ]);

    // Task statistics
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User registration over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalTasks,
      totalTimetable,
      taskStats,
      userGrowth,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { studentId: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin chi tiết một user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Lấy thống kê của user
    const [coursesCount, tasksCount, timetableCount] = await Promise.all([
      Course.countDocuments({ user: user._id }),
      Task.countDocuments({ user: user._id }),
      Timetable.countDocuments({ user: user._id })
    ]);

    res.json({
      user,
      stats: {
        courses: coursesCount,
        tasks: tasksCount,
        timetable: timetableCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    const { name, email, studentId, major, semester, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (studentId !== undefined) user.studentId = studentId;
    if (major !== undefined) user.major = major;
    if (semester !== undefined) user.semester = semester;
    if (role) user.role = role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      studentId: updatedUser.studentId,
      major: updatedUser.major,
      semester: updatedUser.semester,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Xóa user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    // Không cho phép xóa chính mình
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Không thể xóa chính mình' });
    }

    // Xóa tất cả dữ liệu liên quan
    await Promise.all([
      Course.deleteMany({ user: user._id }),
      Task.deleteMany({ user: user._id }),
      Timetable.deleteMany({ user: user._id }),
      user.deleteOne()
    ]);

    res.json({ message: 'Đã xóa user và tất cả dữ liệu liên quan' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả courses (admin)
// @route   GET /api/admin/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const courses = await Course.find()
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Course.countDocuments();

    res.json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy danh sách tất cả tasks (admin)
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = status ? { status } : {};

    const tasks = await Task.find(query)
      .populate('user', 'name email')
      .populate('course', 'name code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1 });

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCourses,
  getAllTasks
};
