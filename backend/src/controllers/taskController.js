import Task from '../models/Task.js';
import Course from '../models/Course.js';

// @desc    Lấy tất cả task của user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { course, status, priority, startDate, endDate } = req.query;
    
    let query = { user: req.user._id };

    // Filter theo course
    if (course) {
      query.course = course;
    }

    // Filter theo status
    if (status) {
      query.status = status;
    }

    // Filter theo priority
    if (priority) {
      query.priority = priority;
    }

    // Filter theo khoảng thời gian
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(query)
      .populate('course', 'name code color')
      .sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy task theo ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('course', 'name code color');

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Kiểm tra quyền
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo task mới
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { course, title, description, type, dueDate, priority, estimatedTime, notes, remindBefore } = req.body;

    // Kiểm tra course có tồn tại và thuộc về user
    const courseExists = await Course.findOne({ _id: course, user: req.user._id });
    if (!courseExists) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    const task = await Task.create({
      user: req.user._id,
      course,
      title,
      description,
      type,
      dueDate,
      priority,
      estimatedTime,
      notes,
      remindBefore
    });

    const populatedTask = await Task.findById(task._id).populate('course', 'name code color');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cập nhật task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Kiểm tra quyền
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    // Nếu đánh dấu completed, cập nhật completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    }

    // Nếu thay đổi từ completed sang status khác, xóa completedAt
    if (req.body.status && req.body.status !== 'completed') {
      req.body.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'name code color');

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy task' });
    }

    // Kiểm tra quyền
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Đã xóa task' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thống kê task
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      urgent: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length,
      upcoming: tasks.filter(t => {
        const hoursDiff = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60);
        return hoursDiff > 0 && hoursDiff <= 48 && t.status !== 'completed';
      }).length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
