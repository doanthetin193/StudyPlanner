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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Tổng quan về kế hoạch học tập của bạn</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} dark:bg-gray-800 rounded-lg p-6 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} dark:text-gray-100`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              <FaCalendarCheck className="inline mr-2 text-blue-600 dark:text-blue-400" />
              Công việc sắp tới
            </h2>
            <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Xem tất cả
            </Link>
          </div>

          {upcomingTasks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Không có công việc sắp tới</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const priorityConfig = TASK_PRIORITIES[task.priority];
                const overdueTask = isOverdue(task.dueDate) && task.status !== 'completed';

                return (
                  <div
                    key={task._id}
                    className={`border rounded-lg p-4 hover:shadow-md transition ${
                      overdueTask ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => handleToggleTaskStatus(task._id, task.status)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              task.status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <FaCheckCircle className="text-white text-xs" />
                            )}
                          </button>
                          <h3 className={`font-semibold ${
                            task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'
                          }`}>
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: task.course?.color + '20',
                              color: task.course?.color
                            }}
                          >
                            {task.course?.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700`}>
                            {priorityConfig.label}
                          </span>
                        </div>
                        <p className={`text-sm mt-2 ${overdueTask ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                          {overdueTask ? '⚠️ Quá hạn: ' : ''}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              <FaListAlt className="inline mr-2 text-blue-600 dark:text-blue-400" />
              Môn học ({courses.length})
            </h2>
            <Link to="/courses" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              Quản lý
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có môn học nào</p>
              <Link
                to="/courses"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm môn học
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{course.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{course.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.credits} tín chỉ</p>
                      {course.instructor && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">{course.instructor}</p>
                      )}
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
