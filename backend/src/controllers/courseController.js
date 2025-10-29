import Course from '../models/Course.js';
import Task from '../models/Task.js';
import Timetable from '../models/Timetable.js';

// @desc    Lấy tất cả môn học của user
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin 1 môn học
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    // Kiểm tra quyền
    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    // Lấy thêm thống kê task
    const tasks = await Task.find({ course: course._id });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      ...course.toObject(),
      stats: {
        totalTasks,
        completedTasks,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo môn học mới
// @route   POST /api/courses
// @access  Private
const createCourse = async (req, res) => {
  try {
    const { name, code, credits, instructor, room, color, description, semester, year } = req.body;

    const course = await Course.create({
      user: req.user._id,
      name,
      code,
      credits,
      instructor,
      room,
      color,
      description,
      semester,
      year
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cập nhật môn học
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    // Kiểm tra quyền
    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa môn học
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    // Kiểm tra quyền
    if (course.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    // Xóa tất cả task và timetable liên quan
    await Task.deleteMany({ course: req.params.id });
    await Timetable.deleteMany({ course: req.params.id });

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Đã xóa môn học' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
