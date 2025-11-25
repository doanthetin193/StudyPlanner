import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTaskNotifications } from '../../hooks/useTaskNotifications';
import { 
  FaHome, 
  FaBook, 
  FaTasks, 
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaUserShield
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

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin', href: '/admin', icon: FaUserShield });
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-r-2 border-gray-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo with gradient */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h1 className="text-xl font-bold text-white">Study Planner</h1>
            </div>
            <button 
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
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
                  className={`flex items-center px-5 py-3.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 font-semibold'
                  }`}
                >
                  <Icon className={`mr-3 text-lg ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                  <span>{item.name}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section with gradient */}
          <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-5">
            <div className="flex items-center mb-4 p-3 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-white hover:text-blue-600 rounded-xl mb-2 font-semibold transition-all hover:shadow-md group"
            >
              <span>👤 Hồ sơ</span>
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all hover:shadow-md group"
            >
              <span>🚪 Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar (mobile) with gradient */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl z-30 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors mr-3"
          >
            <FaBars size={24} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h1 className="text-lg font-bold text-white">Study Planner</h1>
          </div>
        </div>

        {/* Content */}
        <main className="lg:pt-0 pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
