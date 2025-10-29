export const TASK_TYPES = {
  assignment: { label: 'Bài tập', color: 'blue' },
  exam: { label: 'Kiểm tra', color: 'red' },
  project: { label: 'Dự án', color: 'purple' },
  reading: { label: 'Đọc tài liệu', color: 'green' },
  review: { label: 'Ôn tập', color: 'yellow' },
  other: { label: 'Khác', color: 'gray' }
};

export const TASK_PRIORITIES = {
  low: { label: 'Thấp', color: 'gray' },
  medium: { label: 'Trung bình', color: 'blue' },
  high: { label: 'Cao', color: 'orange' },
  urgent: { label: 'Khẩn cấp', color: 'red' }
};

export const TASK_STATUS = {
  todo: { label: 'Chưa làm', color: 'gray' },
  'in-progress': { label: 'Đang làm', color: 'blue' },
  completed: { label: 'Hoàn thành', color: 'green' },
  overdue: { label: 'Quá hạn', color: 'red' }
};

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Chủ nhật', short: 'CN' },
  { value: 1, label: 'Thứ 2', short: 'T2' },
  { value: 2, label: 'Thứ 3', short: 'T3' },
  { value: 3, label: 'Thứ 4', short: 'T4' },
  { value: 4, label: 'Thứ 5', short: 'T5' },
  { value: 5, label: 'Thứ 6', short: 'T6' },
  { value: 6, label: 'Thứ 7', short: 'T7' }
];

export const CLASS_TYPES = {
  lecture: { label: 'Lý thuyết', color: 'blue' },
  lab: { label: 'Thực hành', color: 'green' },
  tutorial: { label: 'Bài tập', color: 'purple' },
  seminar: { label: 'Seminar', color: 'orange' }
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
