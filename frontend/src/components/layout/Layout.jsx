import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTaskNotifications } from '../../hooks/useTaskNotifications';
import { 
  FaHome, 
  FaBook, 
  FaTasks, 
  FaCalendarAlt, 
  FaUser, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Enable task notifications
  useTaskNotifications();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FaHome },
    { name: 'Môn học', href: '/courses', icon: FaBook },
    { name: 'Công việc', href: '/tasks', icon: FaTasks },
    { name: 'Thời khóa biểu', href: '/timetable', icon: FaCalendarAlt },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">📚 Study Planner</h1>
            <button 
              className="lg:hidden text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
            >
              <FaUser className="mr-3" />
              Hồ sơ
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <FaSignOutAlt className="mr-3" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-30 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 mr-4"
          >
            <FaBars size={24} />
          </button>
          <h1 className="text-lg font-bold text-blue-600">📚 Study Planner</h1>
        </div>

        {/* Content */}
        <main className="lg:pt-0 pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
