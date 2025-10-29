import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, studentId, major, semester } = req.body;

    // Kiểm tra user đã tồn tại
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      studentId,
      major,
      semester
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        major: user.major,
        semester: user.semester,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        major: user.major,
        semester: user.semester,
        preferences: user.preferences,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cập nhật thông tin user
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.studentId = req.body.studentId || user.studentId;
      user.major = req.body.major || user.major;
      user.semester = req.body.semester || user.semester;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.preferences) {
        user.preferences = { ...user.preferences, ...req.body.preferences };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        major: updatedUser.major,
        semester: updatedUser.semester,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences
      });
    } else {
      res.status(404).json({ message: 'User không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  register,
  login,
  getMe,
  updateProfile
};
