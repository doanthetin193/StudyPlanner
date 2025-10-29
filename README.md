# 📚 Study Planner - Ứng dụng Quản lý Học tập

Ứng dụng web giúp sinh viên quản lý học tập hiệu quả với giao diện hiện đại, màu sắc bắt mắt và tính năng thông báo thông minh.

## ✨ Tính năng chính

### 📊 Dashboard - Trang tổng quan
- Thống kê tổng quan: số lượng khóa học, nhiệm vụ, buổi học
- Hiển thị nhiệm vụ sắp tới và danh sách khóa học đang theo học
- Giao diện gradient màu sắc bắt mắt với các card thông tin

### 📖 Quản lý khóa học
- Thêm, sửa, xóa thông tin khóa học
- Lưu trữ thông tin: tên môn, mã môn, giảng viên, phòng học, học kỳ, năm học
- Hiển thị danh sách khóa học với design gradient và icon màu sắc

### ✅ Quản lý nhiệm vụ (Tasks)
- Tạo và theo dõi các nhiệm vụ học tập
- **Phân loại nhiệm vụ**: Bài tập (📝), Dự án (📋), Thi (🚀), Ôn tập (📚), Đọc (📖), Khác (📌)
- **Mức độ ưu tiên**: Thấp (⬇️), Trung bình (➡️), Cao (⬆️), Khẩn cấp (🔥)
- **Trạng thái**: Chưa làm, Đang làm, Hoàn thành
- **Thông báo thông minh**: Tự động nhắc nhở khi nhiệm vụu sắp đến hạn
- Gắn nhiệm vụ với khóa học cụ thể

### 📅 Thời khóa biểu
- Quản lý lịch học theo từng ngày trong tuần
- **Loại buổi học**: Lý thuyết (📖), Thực hành (🔬), Bài tập (✏️), Thảo luận (💬)
- Hiển thị thông tin chi tiết: thời gian bắt đầu/kết thúc, phòng học, ghi chú
- Giao diện bảng thời khóa biểu đẹp mắt, dễ nhìn

### 👤 Hồ sơ cá nhân
- Quản lý thông tin sinh viên: họ tên, mã sinh viên, ngành học, học kỳ
- Thống kê cá nhân: số khóa học, nhiệm vụ, buổi học
- Cập nhật thông tin dễ dàng

### 🔔 Hệ thống thông báo
- **Thông báo trình duyệt**: Tự động nhắc nhở nhiệm vụ sắp đến hạn
- **Cơ chế kiểm tra thông minh**: 
  - Kiểm tra mỗi 30 phút khi tab đang mở
  - Kiểm tra ngay khi quay lại tab sau khi rời đi
- **Thời gian nhắc nhở**:
  - 1 ngày trước hạn
  - 3 giờ trước hạn  
  - 30 phút trước hạn
- Quản lý quyền thông báo trình duyệt
- Kiểm tra thông báo thủ công

## 🎨 Giao diện

- **Design hiện đại**: Sử dụng Tailwind CSS v4 với gradient màu sắc đẹp mắt
- **Glass Morphism**: Hiệu ứng kính mờ cho trang đăng nhập/đăng ký
- **Icon & Emoji**: Kết hợp emoji để giao diện sinh động, dễ nhìn
- **Responsive**: Tối ưu cho cả desktop và mobile
- **Animation**: Hiệu ứng chuyển động mượt mà, hover effects
- **Theme**: Chủ đề màu xanh-tím gradient xuyên suốt ứng dụng

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js**: Server và API
- **MongoDB Atlas**: Cơ sở dữ liệu cloud
- **JWT**: Xác thực và bảo mật
- **bcryptjs**: Mã hóa mật khẩu

### Frontend
- **React 19**: Framework UI hiện đại
- **Vite**: Build tool nhanh chóng
- **React Router v7**: Điều hướng trang
- **Tailwind CSS v4**: Styling với utility classes
- **React Icons**: Thư viện icon
- **React Toastify**: Thông báo toast
- **Axios**: HTTP client

### Tính năng đặc biệt
- **Browser Notification API**: Thông báo nền trình duyệt
- **Context API**: Quản lý state toàn cục (Auth, Theme)
- **Custom Hooks**: useAuth, useTaskNotifications
- **Protected Routes**: Bảo vệ các trang yêu cầu đăng nhập

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js (v16 trở lên)
- MongoDB Atlas account hoặc MongoDB local
- Trình duyệt hiện đại (Chrome, Firefox, Edge)

### Cài đặt Backend
```powershell
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Chạy backend:
```powershell
npm start
```

### Cài đặt Frontend
```powershell
cd frontend
npm install
```

Chạy frontend:
```powershell
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Cấu trúc dự án

```
study-planner/
├── backend/
│   ├── src/
│   │   ├── config/         # Cấu hình database
│   │   ├── controllers/    # Xử lý logic API
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Components tái sử dụng
    │   │   └── layout/     # Layout và Sidebar
    │   ├── context/        # Context API (Auth, Theme)
    │   ├── hooks/          # Custom hooks
    │   ├── pages/          # Các trang chính
    │   │   ├── auth/       # Login, Register
    │   │   ├── courses/    # Quản lý khóa học
    │   │   ├── dashboard/  # Trang tổng quan
    │   │   ├── profile/    # Hồ sơ cá nhân
    │   │   ├── tasks/      # Quản lý nhiệm vụ
    │   │   └── timetable/  # Thời khóa biểu
    │   ├── services/       # API service
    │   ├── utils/          # Utilities, constants
    │   ├── App.jsx         # Root component
    │   └── main.jsx        # Entry point
    └── package.json
```

## 🎯 Hướng dẫn sử dụng

1. **Đăng ký/Đăng nhập**: Tạo tài khoản hoặc đăng nhập
2. **Cập nhật hồ sơ**: Điền thông tin cá nhân (tùy chọn)
3. **Thêm khóa học**: Tạo danh sách các môn học đang theo học
4. **Tạo thời khóa biểu**: Thêm lịch học cho từng ngày
5. **Quản lý nhiệm vụ**: Tạo task và gắn với khóa học
6. **Bật thông báo**: Cho phép thông báo trình duyệt để nhận nhắc nhở
7. **Theo dõi tiến độ**: Xem tổng quan tại Dashboard

## 🔐 Bảo mật

- Mật khẩu được mã hóa với bcrypt
- JWT token cho xác thực
- Protected routes với middleware
- CORS configuration
- Input validation

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Courses
- `GET /api/courses` - Lấy danh sách khóa học
- `POST /api/courses` - Tạo khóa học mới
- `PUT /api/courses/:id` - Cập nhật khóa học
- `DELETE /api/courses/:id` - Xóa khóa học

### Tasks
- `GET /api/tasks` - Lấy danh sách nhiệm vụ
- `POST /api/tasks` - Tạo nhiệm vụ mới
- `PUT /api/tasks/:id` - Cập nhật nhiệm vụ
- `DELETE /api/tasks/:id` - Xóa nhiệm vụ

### Timetable
- `GET /api/timetable` - Lấy thời khóa biểu
- `POST /api/timetable` - Thêm buổi học
- `PUT /api/timetable/:id` - Cập nhật buổi học
- `DELETE /api/timetable/:id` - Xóa buổi học

## 🎨 Color Scheme

- **Primary**: Blue-Indigo-Purple gradient
- **Success**: Green tones
- **Warning**: Yellow-Orange tones
- **Danger**: Red tones
- **Info**: Cyan-Blue tones

## 👨‍💻 Tác giả

Dự án Study Planner - Ứng dụng quản lý học tập cho sinh viên

## 📄 License

MIT License - Free to use and modify
