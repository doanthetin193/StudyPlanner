import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaBook, FaTasks, FaCalendar, FaTrash, FaUserShield } from 'react-icons/fa';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, courses, tasks
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStats();
    if (activeTab === 'users') {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.page, searchTerm]);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      toast.error('Không thể tải thống kê');
      console.error(error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });
      setUsers(data.users);
      setPagination(prev => ({ ...prev, total: data.total, totalPages: data.totalPages }));
    } catch (error) {
      toast.error('Không thể tải danh sách users');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa user "${userName}"? Tất cả dữ liệu của user sẽ bị xóa.`)) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      toast.success('Đã xóa user thành công');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa user');
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    
    if (!window.confirm(`Chuyển user thành ${newRole}?`)) {
      return;
    }

    try {
      await adminAPI.updateUser(userId, { role: newRole });
      toast.success(`Đã cập nhật role thành ${newRole}`);
      fetchUsers();
    } catch {
      toast.error('Không thể cập nhật role');
    }
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <FaUserShield className="text-3xl" />
          </div>
          <h1 className="text-4xl font-bold">👑 Admin Dashboard</h1>
        </div>
        <p className="text-purple-50 text-lg">
          Quản lý hệ thống và người dùng
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 flex gap-2 overflow-x-auto">
        {[
          { id: 'dashboard', label: '📊 Thống kê' },
          { id: 'users', label: '👥 Người dùng' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FaUsers className="text-4xl opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-blue-100 text-sm">Người dùng</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FaBook className="text-4xl opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalCourses}</div>
                  <div className="text-green-100 text-sm">Môn học</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FaTasks className="text-4xl opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalTasks}</div>
                  <div className="text-orange-100 text-sm">Công việc</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <FaCalendar className="text-4xl opacity-80" />
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.totalTimetable}</div>
                  <div className="text-purple-100 text-sm">Lịch học</div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Stats */}
          {stats.taskStats && stats.taskStats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Thống kê công việc</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.taskStats.map(stat => (
                  <div key={stat._id} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                    <div className="text-sm text-gray-600 capitalize">{stat._id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Users */}
          {stats.recentUsers && stats.recentUsers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Người dùng mới nhất</h3>
              <div className="space-y-3">
                {stats.recentUsers.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, email, mã sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Người dùng</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">MSSV</th>
                    <th className="px-6 py-4 text-left font-semibold">Ngành</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Ngày tạo</th>
                    <th className="px-6 py-4 text-center font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-gray-800">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">{user.studentId || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{user.major || '-'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUpdateRole(user._id, user.role)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            title="Xóa user"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-600">
                  Trang {pagination.page} / {pagination.totalPages} ({pagination.total} users)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
