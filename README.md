# 📚 Study Planner - Ứng dụng Lập Kế Hoạch Học Tập

## 🎯 Mô tả dự án

Ứng dụng web hỗ trợ sinh viên quản lý kế hoạch học tập theo tuần, bao gồm:
- ✅ Quản lý môn học và thời khóa biểu
- ✅ Lập kế hoạch công việc (task) chi tiết
- ✅ Theo dõi tiến độ học tập
- ✅ Nhắc nhở deadline

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB Atlas** - Database (Cloud)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** (v19) - UI Library
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP Client
- **React Toastify** - Notifications
- **React Icons** - Icons
- **date-fns** - Date utilities

## 📁 Cấu trúc dự án

```
study-planner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Kết nối MongoDB
│   │   ├── models/
│   │   │   ├── User.js            # Model User
│   │   │   ├── Course.js          # Model Môn học
│   │   │   ├── Task.js            # Model Công việc
│   │   │   └── Timetable.js       # Model Thời khóa biểu
│   │   ├── controllers/
│   │   │   ├── authController.js  # Controller Authentication
│   │   │   ├── courseController.js
│   │   │   ├── taskController.js
│   │   │   └── timetableController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── timetableRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT Middleware
│   │   └── server.js              # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Layout.jsx     # Main layout với sidebar
    │   │   └── PrivateRoute.jsx   # Protected route
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── dashboard/
    │   │   │   └── Dashboard.jsx  # Trang chính
    │   │   ├── courses/
    │   │   │   └── Courses.jsx    # Quản lý môn học
    │   │   ├── tasks/
    │   │   │   └── Tasks.jsx      # Quản lý task
    │   │   ├── timetable/
    │   │   │   └── Timetable.jsx  # Thời khóa biểu
    │   │   └── profile/
    │   │       └── Profile.jsx    # Hồ sơ cá nhân
    │   ├── services/
    │   │   └── api.js             # API service
    │   ├── utils/
    │   │   ├── constants.js       # Constants
    │   │   └── dateHelpers.js     # Date utilities
    │   ├── App.jsx                # Root component
    │   └── main.jsx              # Entry point
    ├── .env
    └── package.json
```

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository
```bash
cd d:\study-planner
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

**File `.env` đã được tạo sẵn với:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://doanthetindeveloper:doanthetin193@cluster0.g69mfzf.mongodb.net/study_planner?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_change_this_in_production_2024
NODE_ENV=development
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

**File `.env` đã được tạo sẵn với:**
```env
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Chạy ứng dụng

### Chạy Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Server sẽ chạy tại: `http://localhost:5000`

### Chạy Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user (Private)
- `PUT /api/auth/profile` - Cập nhật profile (Private)

### Courses (Môn học)
- `GET /api/courses` - Lấy danh sách môn học
- `GET /api/courses/:id` - Lấy chi tiết môn học
- `POST /api/courses` - Tạo môn học mới
- `PUT /api/courses/:id` - Cập nhật môn học
- `DELETE /api/courses/:id` - Xóa môn học

### Tasks (Công việc)
- `GET /api/tasks` - Lấy danh sách task (có filter)
- `GET /api/tasks/:id` - Lấy chi tiết task
- `GET /api/tasks/stats/summary` - Lấy thống kê task
- `POST /api/tasks` - Tạo task mới
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa task

### Timetable (Thời khóa biểu)
- `GET /api/timetable` - Lấy lịch học (có filter theo ngày)
- `GET /api/timetable/weekly` - Lấy lịch học theo tuần
- `GET /api/timetable/:id` - Lấy chi tiết lịch học
- `POST /api/timetable` - Tạo lịch học mới
- `PUT /api/timetable/:id` - Cập nhật lịch học
- `DELETE /api/timetable/:id` - Xóa lịch học

## 🎨 Tính năng đã triển khai

### ✅ Backend (Hoàn thành 100%)
- [x] Kết nối MongoDB Atlas
- [x] Models: User, Course, Task, Timetable
- [x] Authentication với JWT
- [x] CRUD API cho tất cả models
- [x] Middleware bảo vệ routes
- [x] Error handling
- [x] Validation dữ liệu

### ✅ Frontend (Hoàn thành 70%)
- [x] Cấu trúc dự án React + Router
- [x] Authentication Context
- [x] API Service layer
- [x] Login/Register pages
- [x] Main Layout với Sidebar
- [x] Dashboard với thống kê
- [x] Private Routes
- [x] Toast notifications
- [x] Profile page
- [ ] Courses Management (UI cơ bản, cần hoàn thiện CRUD)
- [ ] Tasks Management (UI cơ bản, cần hoàn thiện CRUD)
- [ ] Timetable/Calendar view (UI cơ bản, cần hoàn thiện)

## 🔄 Các bước tiếp theo

1. **Hoàn thiện Components**:
   - Courses: Form thêm/sửa môn học, danh sách với filter
   - Tasks: Form thêm/sửa task, filter nâng cao, drag & drop
   - Timetable: Calendar view, thêm/sửa lịch học

2. **Tính năng nâng cao**:
   - Push Notifications (browser)
   - Dark mode
   - Export/Import data
   - Statistics & Charts
   - Mobile responsive improvements

3. **PWA (Optional)**:
   - Service Worker
   - Offline support
   - Install prompt

## 🧪 Test ứng dụng

1. Mở trình duyệt: `http://localhost:5173`
2. Đăng ký tài khoản mới
3. Đăng nhập
4. Xem Dashboard với thống kê
5. Test các trang: Courses, Tasks, Timetable, Profile

## 📝 Ghi chú

- Database đã được kết nối với MongoDB Atlas (cloud)
- JWT token có thời hạn 30 ngày
- Passwords được mã hóa với bcrypt
- API hỗ trợ CORS cho frontend
- Frontend sử dụng Tailwind CSS v4 (PostCSS)

## 👨‍💻 Tác giả

Đồ án 1 - Ứng dụng Lập Kế Hoạch Học Tập cho Sinh Viên

---

**Good luck với đồ án! 🎓📚**
