# 📚 Study Planner - Ứng dụng Quản lý Học tập

Ứng dụng web MERN Stack giúp sinh viên quản lý học tập hiệu quả với giao diện hiện đại, tính năng thông báo thông minh và **hệ thống quản trị admin**.

## ✨ Tính năng chính

### 🔐 Hệ thống Admin (Mới!)
- **Dashboard Admin**: Thống kê tổng quan toàn hệ thống (users, courses, tasks, timetable)
- **Quản lý người dùng**: Xem danh sách, tìm kiếm, phân trang
- **Phân quyền**: Chuyển đổi role user ↔ admin
- **Xóa người dùng**: Cascade delete (xóa toàn bộ dữ liệu liên quan)
- **Giao diện đẹp**: Purple-pink gradient với stats cards
- **Bảo mật**: Protected routes với middleware admin-only

### 📊 Dashboard - Trang tổng quan
- Thống kê tổng quan cá nhân: số lượng khóa học, nhiệm vụ, buổi học
- Hiển thị nhiệm vụ sắp tới và danh sách khóa học đang theo học
- Giao diện gradient màu sắc bắt mắt với các card thông tin
- Nút kiểm tra quyền và test thông báo

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
- **Node.js** + **Express.js v5**: Server và RESTful API
- **MongoDB Atlas**: Cơ sở dữ liệu cloud NoSQL
- **Mongoose**: ODM cho MongoDB
- **JWT**: Xác thực và bảo mật
- **bcryptjs**: Mã hóa mật khẩu
- **Role-based Access Control**: Phân quyền user/admin

### Frontend
- **React 19**: Framework UI hiện đại nhất
- **Vite**: Build tool cực nhanh
- **React Router v7**: Điều hướng SPA
- **Tailwind CSS v4**: Utility-first CSS framework
- **React Icons**: Thư viện icon phong phú
- **React Toastify**: Thông báo toast đẹp mắt
- **Axios**: HTTP client với interceptors
- **date-fns**: Thư viện xử lý ngày tháng

### Tính năng đặc biệt
- **Browser Notification API**: Thông báo nền trình duyệt
- **Context API**: Quản lý state toàn cục (Auth, Notification)
- **Custom Hooks**: useAuth, useTaskNotifications
- **Protected Routes**: Bảo vệ routes theo authentication và role
- **Cascade Delete**: Xóa dữ liệu liên kết tự động
- **Search & Pagination**: Tìm kiếm và phân trang hiệu quả

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

**Tạo dữ liệu mẫu** (tuỳ chọn):
```powershell
# Tạo tài khoản admin
npm run seed:admin

# Tạo dữ liệu mẫu (3 users, 15 courses, 6 tasks, 10 timetable entries)
npm run seed:data

# Hoặc tạo tất cả
npm run seed:all
```

**Tài khoản sau khi seed:**
- Admin: `admin@studyplanner.com` / `admin123456`
- User 1: `an.nguyen@student.com` / `password123`
- User 2: `binh.tran@student.com` / `password123`
- User 3: `cuong.le@student.com` / `password123`

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
│   ├── scripts/            # Seed scripts
│   │   ├── seedAdmin.js    # Tạo admin user
│   │   ├── seedData.js     # Tạo sample data
│   │   └── README.md       # Hướng dẫn seed
│   ├── src/
│   │   ├── config/         # Cấu hình database
│   │   ├── controllers/    # Xử lý logic API
│   │   │   ├── authController.js
│   │   │   ├── courseController.js
│   │   │   ├── taskController.js
│   │   │   ├── timetableController.js
│   │   │   └── adminController.js    # Controller admin (NEW)
│   │   ├── middleware/     # Auth & Admin middleware
│   │   │   └── auth.js     # protect & admin middleware
│   │   ├── models/         # MongoDB models
│   │   │   ├── User.js     # Có field role (user/admin)
│   │   │   ├── Course.js
│   │   │   ├── Task.js
│   │   │   └── Timetable.js
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── timetableRoutes.js
│   │   │   └── adminRoutes.js        # Routes admin (NEW)
│   │   └── server.js       # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Components tái sử dụng
    │   │   ├── layout/     # Layout và Sidebar
    │   │   └── notifications/ # NotificationPermission, NotificationTest
    │   ├── context/        # Context API
    │   │   ├── AuthContext.jsx
    │   │   └── NotificationContext.jsx
    │   ├── hooks/          # Custom hooks
    │   │   └── useTaskNotifications.js
    │   ├── pages/          # Các trang chính
    │   │   ├── admin/      # Admin page (NEW)
    │   │   │   └── Admin.jsx
    │   │   ├── auth/       # Login, Register
    │   │   ├── courses/    # Quản lý khóa học
    │   │   ├── dashboard/  # Trang tổng quan
    │   │   ├── profile/    # Hồ sơ cá nhân
    │   │   ├── tasks/      # Quản lý nhiệm vụ
    │   │   └── timetable/  # Thời khóa biểu
    │   ├── services/       # API service
    │   │   └── api.js      # Có adminAPI endpoints
    │   ├── utils/          # Utilities, constants
    │   │   ├── constants.js
    │   │   └── dateHelpers.js
    │   ├── App.jsx         # Root component với /admin route
    │   └── main.jsx        # Entry point
    └── package.json
```

## 🎯 Hướng dẫn sử dụng

### Cho người dùng thường
1. **Đăng ký/Đăng nhập**: Tạo tài khoản hoặc đăng nhập
2. **Cập nhật hồ sơ**: Điền thông tin cá nhân (tùy chọn)
3. **Thêm khóa học**: Tạo danh sách các môn học đang theo học
4. **Tạo thời khóa biểu**: Thêm lịch học cho từng ngày
5. **Quản lý nhiệm vụ**: Tạo task và gắn với khóa học
6. **Bật thông báo**: Cho phép thông báo trình duyệt để nhận nhắc nhở
7. **Theo dõi tiến độ**: Xem tổng quan tại Dashboard

### Cho Admin
1. **Đăng nhập với tài khoản admin** (sau khi chạy seed:admin)
2. **Truy cập trang Admin**: Nhấp vào "Admin" trong sidebar
3. **Xem thống kê**: Dashboard hiển thị tổng quan toàn hệ thống
4. **Quản lý users**: 
   - Tìm kiếm user theo tên/email
   - Chuyển đổi role user ↔ admin
   - Xóa user (cascade delete toàn bộ data)
5. **Phân trang**: Điều hướng qua các trang user

## 🔐 Bảo mật

- Mật khẩu được mã hóa với bcrypt (salt rounds: 10)
- JWT token cho xác thực với expiration
- Protected routes với middleware `protect`
- Admin-only routes với middleware `admin`
- Role-based access control (RBAC)
- CORS configuration
- Input validation và sanitization
- Cascade delete để bảo toàn tính toàn vẹn dữ liệu

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập (trả về token + user info với role)
- `GET /api/auth/profile` - Lấy thông tin profile (protected)
- `PUT /api/auth/profile` - Cập nhật profile (protected)

### Courses (Protected)
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới
- `PUT /api/courses/:id` - Cập nhật khóa học
- `DELETE /api/courses/:id` - Xóa khóa học

### Tasks (Protected)
- `GET /api/tasks` - Lấy danh sách nhiệm vụ (có filter: status, priority, courseId)
- `GET /api/tasks/:id` - Lấy chi tiết nhiệm vụ
- `GET /api/tasks/upcoming` - Lấy nhiệm vụ sắp đến hạn (cho notification)
- `POST /api/tasks` - Tạo nhiệm vụ mới
- `PUT /api/tasks/:id` - Cập nhật nhiệm vụ
- `DELETE /api/tasks/:id` - Xóa nhiệm vụ

### Timetable (Protected)
- `GET /api/timetable` - Lấy thời khóa biểu (có filter: day)
- `GET /api/timetable/:id` - Lấy chi tiết buổi học
- `POST /api/timetable` - Thêm buổi học
- `PUT /api/timetable/:id` - Cập nhật buổi học
- `DELETE /api/timetable/:id` - Xóa buổi học

### Admin (Protected + Admin only)
- `GET /api/admin/stats` - Lấy thống kê tổng quan hệ thống
- `GET /api/admin/users` - Lấy danh sách users (search, pagination)
- `GET /api/admin/users/:id` - Lấy chi tiết user
- `PUT /api/admin/users/:id` - Cập nhật user (bao gồm role)
- `DELETE /api/admin/users/:id` - Xóa user (cascade delete)
- `GET /api/admin/courses` - Lấy tất cả courses trong hệ thống
- `GET /api/admin/tasks` - Lấy tất cả tasks trong hệ thống

## 🎨 Color Scheme

- **Primary**: Blue-Indigo-Purple gradient (Dashboard, Navigation)
- **Admin**: Purple-Pink gradient (Admin pages)
- **Success**: Green tones (Completed tasks, success messages)
- **Warning**: Yellow-Orange tones (Upcoming deadlines)
- **Danger**: Red tones (Overdue tasks, delete actions)
- **Info**: Cyan-Blue tones (Information messages)

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  studentId: String,
  major: String,
  semester: String,
  createdAt: Date
}
```

### Course Model
```javascript
{
  user: ObjectId (ref: 'User'),
  name: String,
  code: String,
  instructor: String,
  room: String,
  semester: String,
  year: String,
  color: String,
  credits: Number
}
```

### Task Model
```javascript
{
  user: ObjectId (ref: 'User'),
  course: ObjectId (ref: 'Course'),
  title: String,
  description: String,
  type: String (enum: assignment, project, exam, reading, review, other),
  priority: String (enum: low, medium, high, urgent),
  status: String (enum: pending, in-progress, completed),
  dueDate: Date,
  completed: Boolean
}
```

### Timetable Model
```javascript
{
  user: ObjectId (ref: 'User'),
  course: ObjectId (ref: 'Course'),
  day: String (enum: monday-sunday),
  startTime: String,
  endTime: String,
  room: String,
  type: String (enum: lecture, lab, tutorial, discussion),
  notes: String
}
```

## 📊 Seed Data

Chạy lệnh `npm run seed:data` trong thư mục backend để tạo dữ liệu mẫu:

**Users (3)**:
- An Nguyen (Khoa học Máy tính)
- Binh Tran (Công nghệ Thông tin)
- Cuong Le (Trí tuệ Nhân tạo)

**Courses (15 - 5 courses/user)**:
- CS202: Cấu trúc Dữ liệu
- CS203: Lập trình Hướng đối tượng
- CS204: Cơ sở Dữ liệu
- CS205: Mạng Máy tính
- CS206: Phát triển Web

**Tasks (6 cho user đầu tiên)**:
- Mix các loại: assignment, project, exam, reading, review
- Priority từ low → urgent
- Due dates từ 1-7 ngày

**Timetable (10 entries)**:
- Lịch học từ Monday-Friday
- Mix lecture, lab, tutorial
- Thời gian từ 7:00-17:00

## 🚀 Deployment

### Backend (Railway/Render/Heroku)
1. Push code lên Git repository
2. Connect repository với platform
3. Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code lên Git repository
2. Connect repository với platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variable: `VITE_API_URL`
6. Deploy

## 📚 Tài liệu thêm

- [COURSES.md](./COURSES.md) - Chi tiết chức năng Quản lý khóa học
- [TASKS.md](./TASKS.md) - Chi tiết chức năng Quản lý nhiệm vụ
- [TIMETABLE.md](./TIMETABLE.md) - Chi tiết chức năng Thời khóa biểu
- [DASHBOARD.md](./DASHBOARD.md) - Chi tiết trang Dashboard
- [backend/scripts/README.md](./backend/scripts/README.md) - Hướng dẫn seed scripts

## 🐛 Known Issues & Limitations

- Browser notifications chỉ hoạt động khi tab đang mở hoặc trong 30 phút sau khi rời tab
- Notification API không hoạt động trên iOS Safari
- Admin không thể tự xóa chính mình
- Pagination giới hạn 10 users/page (có thể điều chỉnh)

## 👨‍💻 Tác giả

Dự án Study Planner - Ứng dụng quản lý học tập cho sinh viên

**Công nghệ**: MERN Stack (MongoDB, Express v5, React 19, Node.js)

**Tính năng nổi bật**: 
- Hệ thống admin với role-based access control
- Browser notifications thông minh
- Seed scripts tự động tạo data
- Modern UI với Tailwind CSS v4

## 🙏 Credits

- **React Icons** - Icon library
- **date-fns** - Date manipulation
- **React Toastify** - Toast notifications
- **Tailwind CSS** - Styling framework

## 📄 License

MIT License - Free to use and modify

---

⭐ **Star repo nếu bạn thấy hữu ích!**

📧 **Liên hệ**: Mở issue trên GitHub để báo lỗi hoặc đề xuất tính năng mới
