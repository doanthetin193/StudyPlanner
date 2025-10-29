import Timetable from '../models/Timetable.js';
import Course from '../models/Course.js';

// @desc    Lấy tất cả lịch học của user
// @route   GET /api/timetable
// @access  Private
const getTimetable = async (req, res) => {
  try {
    const { dayOfWeek } = req.query;
    
    let query = { user: req.user._id };

    // Filter theo ngày trong tuần
    if (dayOfWeek !== undefined) {
      query.dayOfWeek = parseInt(dayOfWeek);
    }

    const timetable = await Timetable.find(query)
      .populate('course', 'name code color instructor')
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy lịch học theo tuần (grouped by day)
// @route   GET /api/timetable/weekly
// @access  Private
const getWeeklyTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find({ user: req.user._id })
      .populate('course', 'name code color instructor')
      .sort({ dayOfWeek: 1, startTime: 1 });

    // Nhóm theo ngày trong tuần
    const weeklySchedule = {
      0: [], // Chủ nhật
      1: [], // Thứ 2
      2: [], // Thứ 3
      3: [], // Thứ 4
      4: [], // Thứ 5
      5: [], // Thứ 6
      6: []  // Thứ 7
    };

    timetable.forEach(entry => {
      weeklySchedule[entry.dayOfWeek].push(entry);
    });

    res.json(weeklySchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy lịch học theo ID
// @route   GET /api/timetable/:id
// @access  Private
const getTimetableById = async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id)
      .populate('course', 'name code color instructor');

    if (!entry) {
      return res.status(404).json({ message: 'Không tìm thấy lịch học' });
    }

    // Kiểm tra quyền
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo lịch học mới
// @route   POST /api/timetable
// @access  Private
const createTimetable = async (req, res) => {
  try {
    const { course, dayOfWeek, startTime, endTime, room, type, notes, semester } = req.body;

    // Kiểm tra course có tồn tại và thuộc về user
    const courseExists = await Course.findOne({ _id: course, user: req.user._id });
    if (!courseExists) {
      return res.status(404).json({ message: 'Không tìm thấy môn học' });
    }

    // Kiểm tra trùng lịch
    const conflictingEntry = await Timetable.findOne({
      user: req.user._id,
      dayOfWeek,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingEntry) {
      return res.status(400).json({ 
        message: 'Lịch học bị trùng với lịch khác',
        conflict: conflictingEntry
      });
    }

    const entry = await Timetable.create({
      user: req.user._id,
      course,
      dayOfWeek,
      startTime,
      endTime,
      room: room || courseExists.room,
      type,
      notes,
      semester
    });

    const populatedEntry = await Timetable.findById(entry._id)
      .populate('course', 'name code color instructor');

    res.status(201).json(populatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cập nhật lịch học
// @route   PUT /api/timetable/:id
// @access  Private
const updateTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Không tìm thấy lịch học' });
    }

    // Kiểm tra quyền
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    // Kiểm tra trùng lịch nếu thay đổi thời gian
    if (req.body.dayOfWeek || req.body.startTime || req.body.endTime) {
      const dayOfWeek = req.body.dayOfWeek || entry.dayOfWeek;
      const startTime = req.body.startTime || entry.startTime;
      const endTime = req.body.endTime || entry.endTime;

      const conflictingEntry = await Timetable.findOne({
        user: req.user._id,
        _id: { $ne: req.params.id },
        dayOfWeek,
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
          }
        ]
      });

      if (conflictingEntry) {
        return res.status(400).json({ 
          message: 'Lịch học bị trùng với lịch khác',
          conflict: conflictingEntry
        });
      }
    }

    const updatedEntry = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'name code color instructor');

    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Xóa lịch học
// @route   DELETE /api/timetable/:id
// @access  Private
const deleteTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Không tìm thấy lịch học' });
    }

    // Kiểm tra quyền
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    await Timetable.findByIdAndDelete(req.params.id);

    res.json({ message: 'Đã xóa lịch học' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getTimetable,
  getWeeklyTimetable,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable
};
