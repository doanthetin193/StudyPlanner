import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaBook, FaTimes } from 'react-icons/fa';
import { COURSE_COLORS } from '../../utils/constants';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    instructor: '',
    room: '',
    color: COURSE_COLORS[0],
    description: '',
    semester: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await courseAPI.getAll();
      setCourses(data);
    } catch (err) {
      toast.error('Không thể tải danh sách môn học');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseAPI.update(editingCourse._id, formData);
        toast.success('Cập nhật môn học thành công!');
      } else {
        await courseAPI.create(formData);
        toast.success('Thêm môn học thành công!');
      }
      setShowModal(false);
      resetForm();
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      instructor: course.instructor || '',
      room: course.room || '',
      color: course.color,
      description: course.description || '',
      semester: course.semester || '',
      year: course.year || new Date().getFullYear()
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa môn học "${name}"?`)) return;
    
    try {
      await courseAPI.delete(id);
      toast.success('Đã xóa môn học');
      fetchCourses();
    } catch (err) {
      toast.error('Không thể xóa môn học');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      credits: 3,
      instructor: '',
      room: '',
      color: COURSE_COLORS[0],
      description: '',
      semester: '',
      year: new Date().getFullYear()
    });
    setEditingCourse(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
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
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaBook className="text-3xl" />
              </div>
              <h1 className="text-4xl font-bold">📚 Môn học</h1>
            </div>
            <p className="text-green-50 text-lg">
              Quản lý các môn học trong học kỳ • <span className="font-semibold">{courses.length} môn</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-green-600 px-6 py-3 rounded-xl hover:bg-green-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
          >
            <FaPlus /> Thêm môn học
          </button>
        </div>
      </div>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-green-200">
          <div className="text-8xl mb-6 animate-bounce">📚</div>
          <p className="text-gray-700 text-2xl font-bold mb-3">Chưa có môn học nào</p>
          <p className="text-gray-500 text-lg mb-6">Hãy thêm môn học đầu tiên để bắt đầu!</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all font-semibold text-lg hover:scale-105"
          >
            <FaPlus className="inline mr-2" /> Thêm môn học đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-green-200 hover:scale-105 cursor-pointer"
            >
              {/* Color stripe with gradient */}
              <div
                className="h-2"
                style={{ 
                  background: `linear-gradient(90deg, ${course.color}, ${course.color}cc)` 
                }}
              />
              
              <div className="p-6">
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">{course.code}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 p-2.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 border border-blue-200 hover:border-blue-300"
                    title="Sửa"
                  >
                    <FaEdit /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(course._id, course.name)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 p-2.5 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 border border-red-200 hover:border-red-300"
                    title="Xóa"
                  >
                    <FaTrash /> Xóa
                  </button>
                </div>

                {/* Course details */}
                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                    <span className="text-gray-600 font-medium">📘 Số tín chỉ:</span>
                    <span className="font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                      {course.credits} TC
                    </span>
                  </div>
                  {course.instructor && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-100">
                      <span className="text-gray-600 font-medium">👨‍🏫 Giảng viên:</span>
                      <span className="font-semibold text-blue-700">{course.instructor}</span>
                    </div>
                  )}
                  {course.room && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100">
                      <span className="text-gray-600 font-medium">🚪 Phòng học:</span>
                      <span className="font-semibold text-orange-700">{course.room}</span>
                    </div>
                  )}
                  {course.semester && (
                    <div className="text-center mt-3">
                      <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full font-bold border border-green-200">
                        🗓️ {course.semester}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {course.description && (
                  <p className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 line-clamp-2 italic">
                    💬 {course.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <FaBook className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editingCourse ? '✏️ Sửa môn học' : '➕ Thêm môn học mới'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Cấu trúc dữ liệu và giải thuật"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: IT3011"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tín chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảng viên
                  </label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: TS. Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng học
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: TC-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎨 Màu sắc
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {COURSE_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-12 h-12 rounded-xl border-3 transition-all duration-200 shadow-md hover:shadow-lg ${
                          formData.color === color 
                            ? 'border-gray-800 scale-110 ring-4 ring-offset-2' 
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: color,
                          ringColor: formData.color === color ? color + '40' : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học kỳ
                  </label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: HK1 2024-2025"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả về môn học..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {editingCourse ? '✅ Cập nhật' : '➕ Thêm môn học'}
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
