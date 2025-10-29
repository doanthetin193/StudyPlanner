import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên môn học'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Vui lòng nhập mã môn học'],
    trim: true
  },
  credits: {
    type: Number,
    required: [true, 'Vui lòng nhập số tín chỉ'],
    min: 1,
    max: 10
  },
  instructor: {
    type: String,
    trim: true
  },
  room: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6' // màu mặc định
  },
  description: {
    type: String,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  }
}, {
  timestamps: true
});

// Index để tìm kiếm nhanh
courseSchema.index({ user: 1, code: 1 });

export default mongoose.model('Course', courseSchema);
