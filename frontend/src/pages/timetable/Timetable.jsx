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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Thời khóa biểu</h1>
          <p className="text-gray-600 mt-1">Lịch học cố định trong tuần</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
        >
          <FaPlus /> Thêm lịch học
        </button>
      </div>

      {/* Weekly Calendar */}
      {!hasAnyClass ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaCalendarWeek className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Chưa có lịch học nào</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Thêm lịch học đầu tiên
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">
                    Giờ
                  </th>
                  {DAYS_OF_WEEK.slice(1).map(day => (
                    <th key={day.value} className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600 font-medium bg-gray-50">
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
                        <td key={day.value} className="border border-gray-200 p-1">
                          {classAtTime && parseInt(classAtTime.startTime.split(':')[0]) === parseInt(time.split(':')[0]) && (
                            <div
                              className="rounded p-2 text-xs cursor-pointer hover:shadow-md transition group relative"
                              style={{ 
                                backgroundColor: classAtTime.course?.color + '20',
                                borderLeft: `4px solid ${classAtTime.course?.color}`
                              }}
                            >
                              <div className="font-semibold mb-1" style={{ color: classAtTime.course?.color }}>
                                {classAtTime.course?.name}
                              </div>
                              <div className="text-gray-600">
                                {classAtTime.startTime} - {classAtTime.endTime}
                              </div>
                              {classAtTime.room && (
                                <div className="text-gray-500">📍 {classAtTime.room}</div>
                              )}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                <button
                                  onClick={() => handleEdit(classAtTime)}
                                  className="bg-white p-1 rounded shadow hover:bg-blue-50 text-blue-600"
                                >
                                  <FaEdit size={12} />
                                </button>
                                <button
                                  onClick={() => handleDelete(classAtTime._id)}
                                  className="bg-white p-1 rounded shadow hover:bg-red-50 text-red-600"
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
                <div key={day.value} className="border-b border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{day.label}</h3>
                  <div className="space-y-2">
                    {dayClasses.map(entry => (
                      <div
                        key={entry._id}
                        className="rounded-lg p-3 border-l-4"
                        style={{ 
                          backgroundColor: entry.course?.color + '20',
                          borderLeftColor: entry.course?.color
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold" style={{ color: entry.course?.color }}>
                            {entry.course?.name}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="text-blue-600 p-1"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(entry._id)}
                              className="text-red-600 p-1"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          ⏰ {entry.startTime} - {entry.endTime}
                        </div>
                        {entry.room && (
                          <div className="text-sm text-gray-600">📍 {entry.room}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {CLASS_TYPES[entry.type].label}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEntry ? 'Sửa lịch học' : 'Thêm lịch học mới'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {editingEntry ? 'Cập nhật' : 'Thêm lịch học'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
