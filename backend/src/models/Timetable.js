import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: [true, 'Vui lòng chọn ngày trong tuần'],
    min: 0, // 0 = Chủ nhật
    max: 6  // 6 = Thứ 7
  },
  startTime: {
    type: String,
    required: [true, 'Vui lòng nhập giờ bắt đầu'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ không hợp lệ (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'Vui lòng nhập giờ kết thúc'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ không hợp lệ (HH:MM)']
  },
  room: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial', 'seminar'],
    default: 'lecture'
  },
  notes: {
    type: String,
    trim: true
  },
  isRecurring: {
    type: Boolean,
    default: true // lặp lại hàng tuần
  },
  semester: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index để query nhanh
timetableSchema.index({ user: 1, dayOfWeek: 1 });
timetableSchema.index({ course: 1 });

// Validate thời gian bắt đầu phải trước thời gian kết thúc
timetableSchema.pre('save', function(next) {
  const start = this.startTime.split(':').map(Number);
  const end = this.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  
  if (startMinutes >= endMinutes) {
    next(new Error('Giờ bắt đầu phải trước giờ kết thúc'));
  }
  next();
});

export default mongoose.model('Timetable', timetableSchema);
