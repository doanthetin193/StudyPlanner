export const TASK_TYPES = {
  assignment: { label: 'Bài tập', color: 'blue', icon: '📝' },
  exam: { label: 'Kiểm tra', color: 'red', icon: '📋' },
  project: { label: 'Dự án', color: 'purple', icon: '🚀' },
  reading: { label: 'Đọc tài liệu', color: 'green', icon: '📚' },
  review: { label: 'Ôn tập', color: 'yellow', icon: '📖' },
  other: { label: 'Khác', color: 'gray', icon: '📌' }
};

export const TASK_PRIORITIES = {
  low: { label: 'Thấp', color: 'gray', icon: '⬇️' },
  medium: { label: 'Trung bình', color: 'blue', icon: '➡️' },
  high: { label: 'Cao', color: 'orange', icon: '⬆️' },
  urgent: { label: 'Khẩn cấp', color: 'red', icon: '🔥' }
};

export const TASK_STATUS = {
  todo: { label: 'Chưa làm', color: 'gray' },
  'in-progress': { label: 'Đang làm', color: 'blue' },
  completed: { label: 'Hoàn thành', color: 'green' },
  overdue: { label: 'Quá hạn', color: 'red' }
};

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Chủ nhật', short: 'CN', emoji: '🌞' },
  { value: 1, label: 'Thứ 2', short: 'T2', emoji: '📅' },
  { value: 2, label: 'Thứ 3', short: 'T3', emoji: '📅' },
  { value: 3, label: 'Thứ 4', short: 'T4', emoji: '📅' },
  { value: 4, label: 'Thứ 5', short: 'T5', emoji: '📅' },
  { value: 5, label: 'Thứ 6', short: 'T6', emoji: '📅' },
  { value: 6, label: 'Thứ 7', short: 'T7', emoji: '🎉' }
];

export const CLASS_TYPES = {
  lecture: { label: 'Lý thuyết', color: 'blue', icon: '📖' },
  lab: { label: 'Thực hành', color: 'green', icon: '🔬' },
  tutorial: { label: 'Bài tập', color: 'purple', icon: '✏️' },
  seminar: { label: 'Seminar', color: 'orange', icon: '💬' }
};

export const COURSE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6'  // teal
];
