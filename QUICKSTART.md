# 🚀 HƯỚNG DẪN CHẠY ỨNG DỤNG NHANH

## ✅ Trạng thái hiện tại

- ✅ **Backend**: Đang chạy tại `http://localhost:5000`
- ✅ **Frontend**: Đang chạy tại `http://localhost:5173`
- ✅ **Database**: Đã kết nối MongoDB Atlas thành công

## 📝 Các bước đã hoàn thành

### Backend (100% hoàn thành)
- ✅ Kết nối MongoDB Atlas
- ✅ 4 Models: User, Course, Task, Timetable
- ✅ JWT Authentication
- ✅ 4 Controllers với CRUD đầy đủ
- ✅ RESTful API routes
- ✅ Middleware bảo vệ

### Frontend (70% hoàn thành)
- ✅ React Router setup
- ✅ Auth Context & API services
- ✅ Login/Register pages (đầy đủ chức năng)
- ✅ Dashboard với thống kê realtime
- ✅ Layout responsive với sidebar
- ✅ Profile management
- ⚠️ Courses/Tasks/Timetable (UI cơ bản, cần hoàn thiện CRUD forms)

## 🎯 Test ứng dụng ngay

### Bước 1: Mở trình duyệt
```
http://localhost:5173
```

### Bước 2: Đăng ký tài khoản mới
- Nhấn "Đăng ký ngay"
- Điền thông tin:
  - Họ tên: Nguyễn Văn A
  - Email: test@example.com
  - Mật khẩu: 123456
  - (Optional) Mã SV, Ngành học, Học kỳ

### Bước 3: Khám phá ứng dụng
1. **Dashboard**: Xem thống kê tổng quan
2. **Môn học**: Quản lý môn học (UI cơ bản)
3. **Công việc**: Quản lý task (UI cơ bản)
4. **Thời khóa biểu**: Lịch học tuần (UI cơ bản)
5. **Hồ sơ**: Cập nhật thông tin cá nhân

## 🔧 API đã sẵn sàng

Test API với Postman/Thunder Client:

### 1. Đăng ký
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test2@example.com",
  "password": "123456"
}
```

### 2. Đăng nhập
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test2@example.com",
  "password": "123456"
}
```
→ Lưu `token` nhận được

### 3. Tạo môn học (cần token)
```http
POST http://localhost:5000/api/courses
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "name": "Cấu trúc dữ liệu và giải thuật",
  "code": "IT3011",
  "credits": 3,
  "instructor": "TS. Nguyễn Văn A",
  "color": "#3B82F6"
}
```

### 4. Tạo task (cần token và courseId)
```http
POST http://localhost:5000/api/tasks
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "course": "<COURSE_ID>",
  "title": "Bài tập tuần 1",
  "description": "Implement Quick Sort",
  "type": "assignment",
  "dueDate": "2025-11-05T23:59:00.000Z",
  "priority": "high"
}
```

## 📊 Cơ sở dữ liệu

**MongoDB Atlas** đã được kết nối:
- Database: `study_planner`
- Collections: `users`, `courses`, `tasks`, `timetables`

## 🔄 Các tính năng cần hoàn thiện

### Ưu tiên cao:
1. **Courses Management**
   - Form modal thêm/sửa môn học
   - Hiển thị danh sách với grid/list view
   - Xóa môn học với confirm dialog

2. **Tasks Management**
   - Form thêm/sửa task với DatePicker
   - Filter theo môn học, trạng thái, ưu tiên
   - Drag & drop để thay đổi trạng thái
   - Calendar view cho tasks

3. **Timetable/Weekly Schedule**
   - Calendar grid view (7 ngày)
   - Thêm/sửa lịch học trực tiếp trên calendar
   - Hiển thị màu theo môn học
   - Check conflict thời gian

### Ưu tiên trung bình:
- Dark mode toggle
- Charts thống kê (Chart.js / Recharts)
- Export PDF thời khóa biểu
- Push notifications

### Optional (Nâng cao):
- PWA support
- Offline mode
- File attachments cho tasks
- Collaboration features

## 🐛 Debugging

### Backend không chạy?
```bash
cd backend
npm install
npm run dev
```

### Frontend không chạy?
```bash
cd frontend
npm install
npm run dev
```

### Database connection failed?
- Kiểm tra file `backend/.env`
- Đảm bảo MONGODB_URI đúng
- Kiểm tra internet connection

## 📚 Tài liệu tham khảo

- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Chúc bạn triển khai thành công! 🎓**
