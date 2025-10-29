import { useState, useEffect } from 'react';
import { taskAPI, courseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle, 
  FaListAlt,
  FaCalendarCheck,
  FaSpinner
} from 'react-icons/fa';
import { formatRelativeTime, isOverdue } from '../../utils/dateHelpers';
import { TASK_PRIORITIES, TASK_STATUS } from '../../utils/constants';
import { Link } from 'react-router-dom';
import NotificationPermission from '../../components/notifications/NotificationPermission';
import NotificationTest from '../../components/notifications/NotificationTest';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes, coursesRes] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getAll({ status: 'todo,in-progress' }),
        courseAPI.getAll()
      ]);

      setStats(statsRes.data);
      
      // Lấy 5 task sắp đến hạn nhất
      const sortedTasks = tasksRes.data
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
      setUpcomingTasks(sortedTasks);
      
      setCourses(coursesRes.data);
    } catch (err) {
      toast.error('Không thể tải dữ liệu dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
      await taskAPI.update(taskId, { status: newStatus });
      fetchDashboardData();
      toast.success(newStatus === 'completed' ? 'Đã hoàn thành task!' : 'Đã đánh dấu chưa hoàn thành');
    } catch (err) {
      toast.error('Không thể cập nhật task');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng công việc',
      value: stats?.total || 0,
      icon: FaListAlt,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Hoàn thành',
      value: stats?.completed || 0,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sắp đến hạn',
      value: stats?.upcoming || 0,
      icon: FaClock,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Quá hạn',
      value: stats?.overdue || 0,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Permission Banner */}
      <NotificationPermission />

      {/* Hero Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">📚 Dashboard</h1>
            <p className="text-blue-100 text-lg">Chào mừng trở lại! Hãy cùng chinh phục kế hoạch học tập của bạn 🚀</p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl opacity-20">📊</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className={`${stat.bgColor} rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 ${stat.color.replace('bg-', 'border-')}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className={`text-4xl font-extrabold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                  <Icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaCalendarCheck className="text-blue-600 text-xl" />
              </div>
              Công việc sắp tới
            </h2>
            <Link 
              to="/tasks" 
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-dashed border-blue-200">
              <div className="text-7xl mb-4 animate-bounce">📝</div>
              <p className="text-gray-700 text-xl font-semibold mb-2">Không có công việc sắp tới</p>
              <p className="text-gray-500 text-base">Bạn đang rảnh rỗi! 🎉</p>
              <Link
                to="/tasks"
                className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                ➕ Thêm công việc mới
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const priorityConfig = TASK_PRIORITIES[task.priority];
                const overdueTask = isOverdue(task.dueDate) && task.status !== 'completed';

                return (
                  <div
                    key={task._id}
                    className={`border-l-4 rounded-xl p-4 transition-all duration-300 ${
                      overdueTask 
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-xl hover:from-red-100 hover:to-orange-100' 
                        : task.status === 'completed'
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-xl hover:from-green-100'
                        : 'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 hover:shadow-xl hover:from-blue-100 hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <button
                            onClick={() => handleToggleTaskStatus(task._id, task.status)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                              task.status === 'completed'
                                ? 'bg-green-500 border-green-500 shadow-lg'
                                : 'border-gray-300 hover:border-green-500 hover:scale-110'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <FaCheckCircle className="text-white text-sm" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className={`font-bold text-base ${
                              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}>
                              {task.title}
                            </h3>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                            style={{
                              backgroundColor: task.course?.color + '30',
                              color: task.course?.color,
                              border: `1.5px solid ${task.course?.color}50`
                            }}
                          >
                            📚 {task.course?.name}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700 border border-${priorityConfig.color}-300`}>
                            {priorityConfig.icon} {priorityConfig.label}
                          </span>
                        </div>
                        <p className={`text-sm font-semibold flex items-center gap-2 ${
                          overdueTask ? 'text-red-700' : task.status === 'completed' ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {overdueTask ? '⚠️ Quá hạn: ' : task.status === 'completed' ? '✅ ' : '🕒 '}
                          {formatRelativeTime(task.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Courses Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <FaListAlt className="text-green-600 text-xl" />
              </div>
              Môn học ({courses.length})
            </h2>
            <Link 
              to="/courses" 
              className="text-green-600 hover:text-green-700 font-semibold text-sm bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
              Quản lý →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
              <div className="text-7xl mb-4 animate-bounce">📚</div>
              <p className="text-gray-700 text-xl font-semibold mb-2">Chưa có môn học nào</p>
              <p className="text-gray-500 text-base mb-4">Hãy thêm môn học để bắt đầu!</p>
              <Link
                to="/courses"
                className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                ➕ Thêm môn học
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course._id}
                  className="border-l-4 border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-l-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-white cursor-pointer"
                  style={{ borderLeftColor: course.color }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div
                        className="w-12 h-12 rounded-xl mr-4 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code?.charAt(0) || '📖'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">{course.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{course.code}</p>
                        {course.instructor && (
                          <p className="text-xs text-gray-400 mt-1">👨‍🏫 {course.instructor}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {course.credits} TC
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Test Notification Button */}
      <NotificationTest />
    </div>
  );
}
