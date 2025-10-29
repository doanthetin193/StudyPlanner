import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề công việc'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['assignment', 'exam', 'project', 'reading', 'review', 'other'],
    default: 'assignment'
  },
  dueDate: {
    type: Date,
    required: [true, 'Vui lòng nhập hạn hoàn thành']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'overdue'],
    default: 'todo'
  },
  estimatedTime: {
    type: Number, // tính bằng phút
    min: 0
  },
  completedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true
  },
  remindBefore: {
    type: Number, // nhắc nhở trước bao nhiêu phút
    default: 60 // mặc định 1 giờ
  }
}, {
  timestamps: true
});

// Index để tìm kiếm và sắp xếp
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ course: 1, status: 1 });

// Virtual để kiểm tra task có sắp hết hạn không
taskSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const hoursDiff = (this.dueDate - now) / (1000 * 60 * 60);
  return hoursDiff > 0 && hoursDiff <= 48; // trong 48h tới
});

// Tự động cập nhật status thành overdue
taskSchema.pre('save', function(next) {
  if (this.status !== 'completed' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  next();
});

export default mongoose.model('Task', taskSchema);
