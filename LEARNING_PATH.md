# 📚 Lộ trình Tìm hiểu Project Study Planner

Hướng dẫn thứ tự tìm hiểu từng phần, từng file để hiểu toàn bộ project một cách logic và hiệu quả.

---

## 🎯 Nguyên tắc

1. **Hiểu tổng quan trước, chi tiết sau**
2. **Backend trước, Frontend sau** (vì Frontend gọi API từ Backend)
3. **Models → Routes → Controllers → Middleware** (luồng dữ liệu)
4. **Context → Services → Pages → Components** (luồng UI)

---

## 📋 Lộ trình Chi tiết

### PHẦN 0: Tổng quan Project
> *Mục tiêu: Hiểu project làm gì, dùng công nghệ gì*

```
📁 Root
├── 1. README.md              ← Đọc đầu tiên: mô tả tổng quan, tính năng, cách cài đặt
├── 2. DIAGRAMS.md            ← Xem sơ đồ để hiểu kiến trúc
└── 3. Cấu trúc thư mục       ← Lướt qua để biết file nằm ở đâu
```

---

### PHẦN 1: Backend - Database Models
> *Mục tiêu: Hiểu cấu trúc dữ liệu, các entity và quan hệ*

```
📁 backend/src/models/
├── 1. User.js                ← Model quan trọng nhất: user, authentication, role
├── 2. Course.js              ← Khóa học: thuộc về user
├── 3. Task.js                ← Nhiệm vụ: thuộc về user + course
└── 4. Timetable.js           ← Thời khóa biểu: thuộc về user + course
```

**Lưu ý khi đọc Models:**
- Xem các fields và kiểu dữ liệu
- Xem `ref` để hiểu quan hệ giữa các collections
- Xem `enum` để biết các giá trị cho phép
- Xem validation rules
- Xem methods (nếu có) như `matchPassword` trong User

---

### PHẦN 2: Backend - Cấu hình
> *Mục tiêu: Hiểu cách kết nối database và khởi tạo server*

```
📁 backend/
├── 1. package.json           ← Dependencies, scripts
├── 2. .env (tạo theo mẫu)    ← Biến môi trường
└── 📁 src/
    ├── 3. config/database.js ← Kết nối MongoDB
    └── 4. server.js          ← Entry point, khởi tạo Express
```

---

### PHẦN 3: Backend - Middleware
> *Mục tiêu: Hiểu cơ chế xác thực và phân quyền*

```
📁 backend/src/middleware/
└── 1. auth.js                ← 2 middleware quan trọng:
                                 - protect: verify JWT token
                                 - admin: check role admin
```

**Lưu ý:**
- Đây là "cửa ngõ" bảo vệ các API routes
- Hiểu luồng: Token → Decode → Gán req.user → next()

---

### PHẦN 4: Backend - Controllers
> *Mục tiêu: Hiểu logic xử lý nghiệp vụ*

```
📁 backend/src/controllers/
├── 1. authController.js      ← Đăng ký, đăng nhập, profile (đọc đầu tiên)
├── 2. courseController.js    ← CRUD khóa học
├── 3. taskController.js      ← CRUD nhiệm vụ + logic phức tạp hơn
├── 4. timetableController.js ← CRUD thời khóa biểu
└── 5. adminController.js     ← Quản trị: stats, manage users
```

**Thứ tự đọc từng controller:**
1. Đọc các hàm export ở cuối file
2. Đọc từng hàm theo thứ tự CRUD: create → getAll → getById → update → delete
3. Chú ý cách handle error và response

---

### PHẦN 5: Backend - Routes
> *Mục tiêu: Hiểu API endpoints và cách áp dụng middleware*

```
📁 backend/src/routes/
├── 1. authRoutes.js          ← Public routes (register, login) + Protected (profile)
├── 2. courseRoutes.js        ← Tất cả protected
├── 3. taskRoutes.js          ← Tất cả protected
├── 4. timetableRoutes.js     ← Tất cả protected
└── 5. adminRoutes.js         ← Protected + Admin only
```

**Lưu ý:**
- Xem middleware nào được apply: `protect`, `admin`
- Map route với controller function

---

### PHẦN 6: Backend - Seed Scripts (Tùy chọn)
> *Mục tiêu: Hiểu cách tạo dữ liệu mẫu*

```
📁 backend/scripts/
├── 1. README.md              ← Hướng dẫn sử dụng
├── 2. seedAdmin.js           ← Tạo admin user
└── 3. seedData.js            ← Tạo sample data
```

---

### PHẦN 7: Frontend - Cấu hình
> *Mục tiêu: Hiểu cấu trúc React project với Vite*

```
📁 frontend/
├── 1. package.json           ← Dependencies, scripts
├── 2. vite.config.js         ← Cấu hình Vite
├── 3. tailwind.config.js     ← Cấu hình Tailwind CSS
├── 4. postcss.config.js      ← PostCSS plugins
├── 5. index.html             ← HTML entry point
└── 📁 src/
    ├── 6. main.jsx           ← React entry point
    └── 7. index.css          ← Global styles, Tailwind imports
```

---

### PHẦN 8: Frontend - Services (API Layer)
> *Mục tiêu: Hiểu cách Frontend gọi Backend API*

```
📁 frontend/src/services/
└── 1. api.js                 ← ⭐ FILE QUAN TRỌNG:
                                 - Axios instance
                                 - Request/Response interceptors
                                 - Tất cả API functions (authAPI, courseAPI, taskAPI, etc.)
```

**Đọc kỹ file này để hiểu:**
- Cách thêm token vào header
- Cách handle lỗi 401 (redirect to login)
- Các endpoints tương ứng với Backend

---

### PHẦN 9: Frontend - Context (Global State)
> *Mục tiêu: Hiểu cách quản lý state toàn cục*

```
📁 frontend/src/context/
├── 1. AuthContext.jsx        ← ⭐ Quan trọng nhất:
│                                - User state
│                                - login, register, logout functions
│                                - isAuthenticated
└── 2. NotificationContext.jsx ← Browser notification permission & sending
```

**Lưu ý:**
- Hiểu pattern: createContext → Provider → useContext hook
- AuthContext wrap toàn bộ app

---

### PHẦN 10: Frontend - Custom Hooks
> *Mục tiêu: Hiểu reusable logic*

```
📁 frontend/src/hooks/
└── 1. useTaskNotifications.js ← Logic check và gửi notification cho tasks sắp hạn
```

---

### PHẦN 11: Frontend - Utils & Constants
> *Mục tiêu: Hiểu các helper functions và constants*

```
📁 frontend/src/utils/
├── 1. constants.js           ← Các giá trị cố định: TASK_TYPES, PRIORITIES, DAYS_OF_WEEK...
└── 2. dateHelpers.js         ← Hàm xử lý ngày tháng với date-fns
```

---

### PHẦN 12: Frontend - App & Routing
> *Mục tiêu: Hiểu cấu trúc routing và protected routes*

```
📁 frontend/src/
└── 1. App.jsx                ← ⭐ FILE QUAN TRỌNG:
                                 - Provider wrappers (Auth, Notification)
                                 - React Router setup
                                 - PrivateRoute component
                                 - Route definitions
```

---

### PHẦN 13: Frontend - Layout Components
> *Mục tiêu: Hiểu cấu trúc UI chung*

```
📁 frontend/src/components/
├── 📁 layout/
│   └── 1. Layout.jsx         ← Sidebar + Main content area
│                                - Navigation links
│                                - Logout button
│                                - Conditional admin link
└── 📁 notifications/
    ├── 2. NotificationPermission.jsx ← UI yêu cầu quyền notification
    └── 3. NotificationTest.jsx       ← Nút test notification
```

---

### PHẦN 14: Frontend - Auth Pages
> *Mục tiêu: Hiểu form xử lý và authentication flow*

```
📁 frontend/src/pages/auth/
├── 1. Login.jsx              ← Form đăng nhập, gọi AuthContext.login()
└── 2. Register.jsx           ← Form đăng ký, gọi AuthContext.register()
```

**Lưu ý:**
- Cách sử dụng useState cho form
- Cách gọi context functions
- Cách navigate sau khi đăng nhập thành công

---

### PHẦN 15: Frontend - Main Pages (Theo thứ tự phức tạp)
> *Mục tiêu: Hiểu các trang chính của ứng dụng*

```
📁 frontend/src/pages/

1. 📁 profile/
   └── Profile.jsx            ← Đơn giản nhất: form update profile

2. 📁 dashboard/
   └── Dashboard.jsx          ← Trang tổng quan: gọi nhiều API, hiển thị stats

3. 📁 courses/
   └── Courses.jsx            ← CRUD cơ bản: list, add, edit, delete modal

4. 📁 timetable/
   └── Timetable.jsx          ← Phức tạp hơn: hiển thị theo grid tuần

5. 📁 tasks/
   └── Tasks.jsx              ← Phức tạp nhất: filter, sort, status, priority

6. 📁 admin/
   └── Admin.jsx              ← Admin panel: tabs, pagination, search, role management
```

**Thứ tự đọc từng page:**
1. Xem imports
2. Xem state declarations (useState)
3. Xem useEffect (data fetching)
4. Xem các handler functions
5. Xem JSX return

---

## 🔄 Tóm tắt Luồng Đọc

```
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                 │
├─────────────────────────────────────────────────────────────┤
│  Models → Config → Middleware → Controllers → Routes        │
│    ↓         ↓         ↓            ↓           ↓          │
│  (Data)   (DB)    (Auth)      (Logic)      (API)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
                         HTTP/REST
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                                │
├─────────────────────────────────────────────────────────────┤
│  Config → Services → Context → Hooks → Utils                │
│    ↓         ↓          ↓        ↓       ↓                  │
│ (Setup)   (API)     (State)  (Logic) (Helpers)              │
│                         ↓                                    │
│              App.jsx (Routing)                               │
│                         ↓                                    │
│         Layout → Pages → Components                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Checklist Tìm hiểu

### Backend
- [ ] Đọc README.md
- [ ] Hiểu 4 Models và quan hệ
- [ ] Hiểu cách kết nối MongoDB
- [ ] Hiểu 2 middleware: protect, admin
- [ ] Hiểu authController (register, login)
- [ ] Hiểu 1 controller CRUD hoàn chỉnh (courseController)
- [ ] Hiểu cách routes map với controllers
- [ ] Chạy thử backend, test API với Postman

### Frontend
- [ ] Hiểu cấu trúc Vite + React
- [ ] Hiểu api.js và axios interceptors
- [ ] Hiểu AuthContext và flow đăng nhập
- [ ] Hiểu App.jsx và routing
- [ ] Hiểu Layout component
- [ ] Hiểu 1 page CRUD hoàn chỉnh (Courses)
- [ ] Hiểu cách dùng Tailwind CSS
- [ ] Chạy thử frontend, đăng ký/đăng nhập

### Tích hợp
- [ ] Theo dõi 1 request từ UI → API → DB → Response → UI
- [ ] Debug bằng console.log hoặc DevTools
- [ ] Thử thay đổi nhỏ và xem kết quả

---

## 💡 Tips

1. **Chạy project song song khi đọc code** - Dễ hiểu hơn khi thấy kết quả
2. **Dùng DevTools Network tab** - Xem request/response thực tế
3. **Console.log không xấu** - Thêm log để hiểu flow
4. **Đọc theo use case** - VD: "Đăng nhập" → trace từ Login.jsx → AuthContext → api.js → authRoutes → authController → User model
5. **Không cần đọc hết 1 lần** - Đọc overview rồi quay lại đọc sâu khi cần

---

## 🎓 Sau khi Hiểu Xong

Bạn có thể thử:
1. Thêm 1 field mới vào Model
2. Tạo 1 API endpoint mới
3. Tạo 1 page mới trong Frontend
4. Thêm tính năng nhỏ (VD: dark mode, export data)

---

**Chúc bạn học tốt! 🚀**
