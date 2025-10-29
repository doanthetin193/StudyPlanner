import { useState, useEffect } from 'react';
import { taskAPI, courseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTasks, 
  FaTimes, 
  FaCheckCircle,
  FaFilter
} from 'react-icons/fa';
import { formatRelativeTime, isOverdue } from '../../utils/dateHelpers';
import { TASK_TYPES, TASK_PRIORITIES, TASK_STATUS } from '../../utils/constants';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filters
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    type: 'assignment',
    dueDate: '',
    priority: 'medium',
    estimatedTime: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, coursesRes] = await Promise.all([
        taskAPI.getAll(),
        courseAPI.getAll()
      ]);
      setTasks(tasksRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      toast.error('Không thể tải dữ liệu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskAPI.update(editingTask._id, formData);
        toast.success('Cập nhật công việc thành công!');
      } else {
        await taskAPI.create(formData);
        toast.success('Thêm công việc thành công!');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      course: task.course._id,
      title: task.title,
      description: task.description || '',
      type: task.type,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      priority: task.priority,
      estimatedTime: task.estimatedTime || '',
      notes: task.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn xóa công việc "${title}"?`)) return;
    
    try {
      await taskAPI.delete(id);
      toast.success('Đã xóa công việc');
      fetchData();
    } catch (err) {
      toast.error('Không thể xóa công việc');
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await taskAPI.update(task._id, { status: newStatus });
      toast.success(newStatus === 'completed' ? 'Đã hoàn thành!' : 'Đã đánh dấu chưa hoàn thành');
      fetchData();
    } catch (err) {
      toast.error('Không thể cập nhật trạng thái');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      course: '',
      title: '',
      description: '',
      type: 'assignment',
      dueDate: '',
      priority: 'medium',
      estimatedTime: '',
      notes: ''
    });
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterCourse !== 'all' && task.course._id !== filterCourse) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  // Group tasks by status
  const groupedTasks = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    overdue: filteredTasks.filter(t => t.status === 'overdue')
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaTasks className="text-3xl" />
              </div>
              <h1 className="text-4xl font-bold">📋 Công việc</h1>
            </div>
            <p className="text-blue-50 text-lg">
              Quản lý công việc và bài tập • <span className="font-semibold">{filteredTasks.length} công việc</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                showFilters 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <FaFilter /> {showFilters ? 'Ẩn bộ lọc' : 'Lọc'}
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
            >
              <FaPlus /> Thêm công việc
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border-2 border-blue-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaFilter className="text-blue-600" /> Bộ lọc nâng cao
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📚 Môn học</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="all">Tất cả môn học</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🎯 Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(TASK_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">⚡ Độ ưu tiên</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="all">Tất cả độ ưu tiên</option>
                {Object.entries(TASK_PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-blue-200">
          <div className="text-8xl mb-6 animate-bounce">📋</div>
          <p className="text-gray-700 text-2xl font-bold mb-3">
            {tasks.length === 0 ? 'Chưa có công việc nào' : 'Không có công việc phù hợp với bộ lọc'}
          </p>
          <p className="text-gray-500 text-lg mb-6">
            {tasks.length === 0 ? 'Hãy thêm công việc đầu tiên để bắt đầu!' : 'Thử thay đổi bộ lọc hoặc thêm công việc mới'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all font-semibold text-lg hover:scale-105"
          >
            <FaPlus className="inline mr-2" /> Thêm công việc đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tasks grouped by status */}
          {Object.entries(groupedTasks).map(([status, statusTasks]) => {
            if (statusTasks.length === 0) return null;
            const statusConfig = TASK_STATUS[status];
            
            return (
              <div key={status} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full bg-${statusConfig.color}-500 shadow-lg`}></span>
                  <span className="text-gray-800">{statusConfig.label}</span>
                  <span className={`ml-auto bg-${statusConfig.color}-100 text-${statusConfig.color}-700 px-3 py-1 rounded-full text-sm font-bold`}>
                    {statusTasks.length}
                  </span>
                </h2>
                
                <div className="space-y-3">
                  {statusTasks.map(task => {
                    const priorityConfig = TASK_PRIORITIES[task.priority];
                    const typeConfig = TASK_TYPES[task.type];
                    const overdueTask = isOverdue(task.dueDate) && task.status !== 'completed';

                    return (
                      <div
                        key={task._id}
                        className={`border-l-4 rounded-xl p-5 transition-all duration-300 ${
                          overdueTask 
                            ? 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-xl hover:from-red-100' 
                            : task.status === 'completed'
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-xl'
                            : 'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl hover:border-blue-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleStatus(task)}
                            className={`mt-1 w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              task.status === 'completed'
                                ? 'bg-green-500 border-green-500 shadow-lg'
                                : 'border-gray-300 hover:border-green-500 hover:scale-110'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <FaCheckCircle className="text-white text-base" />
                            )}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-xl font-bold mb-2 ${
                              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}>
                              {task.title}
                            </h3>

                            {task.description && (
                              <p className="text-sm text-gray-600 mb-3 p-3 bg-white/50 rounded-lg border border-gray-200 italic">
                                💬 {task.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span
                                className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                  backgroundColor: task.course?.color + '30',
                                  color: task.course?.color,
                                  border: `1.5px solid ${task.course?.color}50`
                                }}
                              >
                                📚 {task.course?.name}
                              </span>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-${typeConfig.color}-100 text-${typeConfig.color}-700 border border-${typeConfig.color}-300`}>
                                {typeConfig.icon} {typeConfig.label}
                              </span>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700 border border-${priorityConfig.color}-300`}>
                                {priorityConfig.icon} {priorityConfig.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm mb-3">
                              <span className={`font-bold ${
                                overdueTask ? 'text-red-700' : task.status === 'completed' ? 'text-green-700' : 'text-blue-700'
                              }`}>
                                {overdueTask ? '⚠️ Quá hạn: ' : task.status === 'completed' ? '✅ ' : '🕒 '}
                                {formatRelativeTime(task.dueDate)}
                              </span>
                              {task.estimatedTime && (
                                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-semibold">
                                  ⏱️ {task.estimatedTime} phút
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleEdit(task)}
                              className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-3 rounded-xl transition-all border border-blue-300 hover:scale-110 shadow-sm"
                              title="Sửa"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(task._id, task.title)}
                              className="bg-red-100 text-red-600 hover:bg-red-200 p-3 rounded-xl transition-all border border-red-300 hover:scale-110 shadow-sm"
                              title="Xóa"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <FaTasks className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editingTask ? '✏️ Sửa công việc' : '➕ Thêm công việc mới'}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn môn học</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Bài tập tuần 1 - Quick Sort"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả chi tiết về công việc..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại công việc
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(TASK_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ ưu tiên
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(TASK_PRIORITIES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn hoàn thành <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian ước tính (phút)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {editingTask ? '✅ Cập nhật' : '➕ Thêm công việc'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 py-3.5 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-all hover:border-gray-400"
                >
                  ❌ Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
