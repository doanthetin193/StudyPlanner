import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSave } from 'react-icons/fa';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    major: user?.major || '',
    semester: user?.semester || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30 shadow-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">👤 Hồ sơ cá nhân</h1>
            <p className="text-indigo-50 text-lg">Quản lý thông tin tài khoản của bạn</p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b-2 border-indigo-100">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm">
                  ✉️ {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                👨‍🎓 Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🎫 Mã sinh viên
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                placeholder="VD: 2024001"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📚 Ngành học
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                placeholder="VD: Công nghệ thông tin"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📅 Học kỳ hiện tại
              </label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-all"
                placeholder="VD: HK1 2024-2025"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-100 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">📧</div>
              <div className="text-sm text-gray-600 font-semibold">Email đã xác thực</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-100 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">✅</div>
              <div className="text-sm text-gray-600 font-semibold">Tài khoản hoạt động</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-100 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">🎓</div>
              <div className="text-sm text-gray-600 font-semibold">Sinh viên</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <FaSave className="inline mr-2" />
            {loading ? '⏳ Đang lưu...' : '✅ Lưu thay đổi'}
          </button>
        </form>
      </div>

      {/* Additional Info Card */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border-2 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Mẹo sử dụng</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Cập nhật thông tin của bạn để hệ thống cá nhân hóa trải nghiệm tốt hơn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Mã sinh viên giúp phân biệt tài khoản trong các chức năng tương lai</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Thông tin ngành học và học kỳ giúp tổ chức dữ liệu hiệu quả hơn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
