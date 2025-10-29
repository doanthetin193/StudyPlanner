import { useState, useEffect } from 'react';
import { timetableAPI, courseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCalendarWeek } from 'react-icons/fa';
import { DAYS_OF_WEEK, CLASS_TYPES } from '../../utils/constants';

export default function Timetable() {
  const [timetable, setTimetable] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    course: '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    room: '',
    type: 'lecture',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [timetableRes, coursesRes] = await Promise.all([
        timetableAPI.getWeekly(),
        courseAPI.getAll()
      ]);
      setTimetable(timetableRes.data);
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
      if (editingEntry) {
        await timetableAPI.update(editingEntry._id, formData);
        toast.success('Cập nhật lịch học thành công!');
      } else {
        await timetableAPI.create(formData);
        toast.success('Thêm lịch học thành công!');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      course: entry.course._id,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      room: entry.room || '',
      type: entry.type,
      notes: entry.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch học này?')) return;
    
    try {
      await timetableAPI.delete(id);
      toast.success('Đã xóa lịch học');
      fetchData();
    } catch (err) {
      toast.error('Không thể xóa lịch học');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      course: '',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
      room: '',
      type: 'lecture',
      notes: ''
    });
    setEditingEntry(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasAnyClass = Object.values(timetable).some(day => day.length > 0);

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaCalendarWeek className="text-3xl" />
              </div>
              <h1 className="text-4xl font-bold">📅 Thời khóa biểu</h1>
            </div>
            <p className="text-purple-50 text-lg">
              Lịch học cố định trong tuần • Quản lý thời gian hiệu quả
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
          >
            <FaPlus /> Thêm lịch học
          </button>
        </div>
      </div>

      {/* Weekly Calendar */}
      {!hasAnyClass ? (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-purple-200">
          <div className="text-8xl mb-6 animate-bounce">📅</div>
          <p className="text-gray-700 text-2xl font-bold mb-3">Chưa có lịch học nào</p>
          <p className="text-gray-500 text-lg mb-6">Hãy thêm lịch học để quản lý thời gian hiệu quả!</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all font-semibold text-lg hover:scale-105"
          >
            <FaPlus className="inline mr-2" /> Thêm lịch học đầu tiên
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                  <th className="border-2 border-purple-200 px-4 py-4 text-left text-sm font-bold text-purple-900 w-24">
                    ⏰ Giờ
                  </th>
                  {DAYS_OF_WEEK.slice(1).map(day => (
                    <th key={day.value} className="border-2 border-purple-200 px-4 py-4 text-center text-sm font-bold text-purple-900">
                      {day.emoji} {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="hover:bg-purple-50/30 transition-colors">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 font-bold bg-gradient-to-r from-gray-50 to-gray-100">
                      {time}
                    </td>
                    {DAYS_OF_WEEK.slice(1).map(day => {
                      const dayClasses = timetable[day.value] || [];
                      const classAtTime = dayClasses.find(entry => {
                        const startHour = parseInt(entry.startTime.split(':')[0]);
                        const timeHour = parseInt(time.split(':')[0]);
                        const endHour = parseInt(entry.endTime.split(':')[0]);
                        return timeHour >= startHour && timeHour < endHour;
                      });

                      return (
                        <td key={day.value} className="border border-gray-200 p-2 bg-white">
                          {classAtTime && parseInt(classAtTime.startTime.split(':')[0]) === parseInt(time.split(':')[0]) && (
                            <div
                              className="rounded-xl p-3 text-xs cursor-pointer hover:shadow-xl transition-all duration-300 group relative border-l-4 hover:scale-105"
                              style={{ 
                                backgroundColor: classAtTime.course?.color + '20',
                                borderLeftColor: classAtTime.course?.color
                              }}
                            >
                              <div className="font-bold mb-1.5 text-sm" style={{ color: classAtTime.course?.color }}>
                                📚 {classAtTime.course?.name}
                              </div>
                              <div className="text-gray-700 font-semibold mb-1">
                                🕐 {classAtTime.startTime} - {classAtTime.endTime}
                              </div>
                              {classAtTime.room && (
                                <div className="text-gray-600 font-medium">📍 {classAtTime.room}</div>
                              )}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                <button
                                  onClick={() => handleEdit(classAtTime)}
                                  className="bg-blue-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
                                >
                                  <FaEdit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDelete(classAtTime._id)}
                                  className="bg-red-500 text-white p-1.5 rounded-lg shadow-lg hover:bg-red-600 transition-all"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {DAYS_OF_WEEK.slice(1).map(day => {
              const dayClasses = timetable[day.value] || [];
              if (dayClasses.length === 0) return null;

              return (
                <div key={day.value} className="border-b-2 border-purple-200 p-5 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
                  <h3 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
                    {day.emoji} {day.label}
                    <span className="ml-auto bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                      {dayClasses.length} lớp
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {dayClasses.map(entry => (
                      <div
                        key={entry._id}
                        className="rounded-xl p-4 border-l-4 shadow-md hover:shadow-xl transition-all duration-300"
                        style={{ 
                          backgroundColor: entry.course?.color + '20',
                          borderLeftColor: entry.course?.color
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="font-bold text-base" style={{ color: entry.course?.color }}>
                            📚 {entry.course?.name}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(entry._id)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 font-semibold mb-2">
                          🕐 {entry.startTime} - {entry.endTime}
                        </div>
                        {entry.room && (
                          <div className="text-sm text-gray-600 font-medium mb-2">📍 {entry.room}</div>
                        )}
                        <div className="inline-block text-xs bg-white/50 px-3 py-1 rounded-full font-semibold text-gray-700 border border-gray-300">
                          {CLASS_TYPES[entry.type].icon} {CLASS_TYPES[entry.type].label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <FaCalendarWeek className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editingEntry ? '✏️ Sửa lịch học' : '➕ Thêm lịch học mới'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày trong tuần <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {DAYS_OF_WEEK.slice(1).map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại lớp
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(CLASS_TYPES).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú về lịch học..."
                />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {editingEntry ? '✅ Cập nhật' : '➕ Thêm lịch học'}
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
