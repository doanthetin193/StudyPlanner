# Admin Panel — Chi tiết chức năng

Trang Admin cho phép quản trị viên quản lý toàn bộ hệ thống, bao gồm xem thống kê, quản lý người dùng, phân quyền và xóa dữ liệu.

## Mục tiêu
- Quản lý người dùng: xem, tìm kiếm, chỉnh sửa, xóa users.
- Phân quyền: chuyển đổi role giữa `user` và `admin`.
- Thống kê tổng quan: số lượng users, courses, tasks, timetable entries trong toàn hệ thống.
- Bảo mật: chỉ admin mới truy cập được, protected bằng middleware.

## Phân quyền

### User Model với Role
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin'], default: 'user'), // ← Field mới
  studentId: String,
  major: String,
  semester: String,
  createdAt: Date
}
```

### Middleware Auth
- `protect`: Xác thực JWT token, gán `req.user`
- `admin`: Kiểm tra `req.user.role === 'admin'`, trả về 403 nếu không phải admin

### Protected Routes
Tất cả routes admin được bảo vệ bằng cả 2 middleware:
```javascript
router.use(protect);  // Phải đăng nhập
router.use(admin);    // Phải là admin
```

## Thành phần UI chính

### 1. Admin Dashboard (Tab Thống kê)
- **Layout**: Grid 2x2 hoặc 4 cột responsive
- **Stats Cards**:
  1. **Tổng Users** 👥
     - Số lượng: `stats.totalUsers`
     - Màu: Blue gradient
     - Icon: `FaUsers`
  2. **Tổng Courses** 📚
     - Số lượng: `stats.totalCourses`
     - Màu: Green gradient
     - Icon: `FaBook`
  3. **Tổng Tasks** ✅
     - Số lượng: `stats.totalTasks`
     - Màu: Purple gradient
     - Icon: `FaTasks`
  4. **Tổng Timetable Entries** 📅
     - Số lượng: `stats.totalTimetableEntries`
     - Màu: Orange gradient
     - Icon: `FaCalendar`
- **Card Design**:
  - Gradient background (purple-pink hoặc custom)
  - Icon lớn bên trái
  - Số lượng (text-4xl, bold)
  - Label mô tả (text-sm)
  - Shadow và hover effect

### 2. Users Management (Tab Người dùng)

#### Search & Filter
- **Search bar**: 
  - Placeholder: "Tìm kiếm theo tên hoặc email..."
  - Debounce 300ms để tránh spam API
  - Icon search: 🔍
  - Clear button khi có text
- **Filter options** (tùy chọn mở rộng):
  - Role filter: All / Users only / Admins only
  - Sort by: Name, Email, Created Date, Last Login

#### User Table
- **Columns**:
  1. **STT**: Row number (pagination offset + index)
  2. **Tên**: `user.name` với avatar placeholder hoặc initial
  3. **Email**: `user.email` (màu xanh, có link mailto)
  4. **Mã SV**: `user.studentId` (nếu có)
  5. **Ngành**: `user.major` (nếu có)
  6. **Role**: Badge màu theo role
     - `admin`: Red/Pink badge với icon 👑
     - `user`: Blue/Gray badge với icon 👤
  7. **Ngày tạo**: `createdAt` (format: DD/MM/YYYY)
  8. **Hành động**: 
     - **Chuyển role**: Toggle button (user ↔ admin)
     - **Xóa**: Button màu đỏ với icon 🗑️

- **Table Design**:
  - Striped rows (zebra striping)
  - Hover effect: background màu nhạt
  - Responsive: scroll horizontal trên mobile
  - Sticky header khi scroll

#### Pagination
- **Controls**:
  - Previous button (disabled nếu page = 1)
  - Page numbers: hiện 5 pages xung quanh current page
  - Next button (disabled nếu page = totalPages)
  - Page info: "Trang X / Y" hoặc "Hiển thị 1-10 của 50 users"
- **Page size**: Default 10, có thể chọn 10/20/50/100

#### Actions

**Toggle Role (Chuyển role)**
- **Trigger**: Click button "Chuyển thành admin" hoặc "Chuyển thành user"
- **Confirmation**: Alert confirm trước khi thực hiện
  - Text: "Bạn có chắc muốn chuyển [name] thành [newRole]?"
  - Buttons: Có / Không
- **API call**: `PUT /api/admin/users/:id` với body `{ role: 'admin' | 'user' }`
- **Response handling**:
  - Success: Toast "Đã cập nhật role thành [newRole]", reload user list
  - Error: Toast error message, không reload
- **Edge cases**:
  - Admin không thể tự chuyển role của chính mình (backend check)
  - Phải có ít nhất 1 admin trong hệ thống

**Delete User (Xóa người dùng)**
- **Trigger**: Click button Xóa
- **Confirmation**: Alert confirm với warning nghiêm trọng
  - Text: "⚠️ Bạn có chắc muốn xóa user '[name]'? Tất cả dữ liệu của user (courses, tasks, timetable) sẽ bị xóa vĩnh viễn!"
  - Buttons: Xóa (màu đỏ) / Hủy
- **API call**: `DELETE /api/admin/users/:id`
- **Cascade Delete** (backend tự động xóa):
  - Tất cả courses của user
  - Tất cả tasks của user
  - Tất cả timetable entries của user
- **Response handling**:
  - Success: Toast "Đã xóa user thành công", reload user list và stats
  - Error: Toast error message (VD: "Không thể xóa chính mình", "User không tồn tại")
- **Edge cases**:
  - Admin không thể tự xóa chính mình (backend check `req.user._id !== userId`)
  - Nếu xóa user cuối cùng của 1 page, redirect về page trước

### 3. Tab Navigation
- **Tabs**: Dashboard (📊), Users (👥)
- **Design**: Pills style với gradient khi active
- **Active state**: 
  - Background: `bg-gradient-to-r from-purple-600 to-pink-600`
  - Text: white
  - Shadow: elevated
- **Inactive state**:
  - Background: transparent
  - Text: gray-600
  - Hover: bg-gray-100

## API Endpoints

### Admin Stats
```
GET /api/admin/stats
Authorization: Bearer {token}
Role: admin

Response:
{
  totalUsers: 25,
  totalCourses: 120,
  totalTasks: 450,
  totalTimetableEntries: 300
}
```

### Get All Users
```
GET /api/admin/users?page=1&limit=10&search=nguyen
Authorization: Bearer {token}
Role: admin

Response:
{
  users: [
    {
      _id: "...",
      name: "Nguyen Van A",
      email: "a@example.com",
      studentId: "SV001",
      major: "IT",
      role: "user",
      createdAt: "2024-01-15T10:00:00Z"
    },
    ...
  ],
  total: 50,
  page: 1,
  totalPages: 5
}
```

### Get User Detail
```
GET /api/admin/users/:id
Authorization: Bearer {token}
Role: admin

Response:
{
  _id: "...",
  name: "Nguyen Van A",
  email: "a@example.com",
  role: "user",
  ...
  stats: {
    coursesCount: 5,
    tasksCount: 18,
    timetableEntriesCount: 12
  }
}
```

### Update User
```
PUT /api/admin/users/:id
Authorization: Bearer {token}
Role: admin

Body:
{
  role: "admin"  // Chỉ admin mới được update role
}

Response:
{
  _id: "...",
  name: "Nguyen Van A",
  role: "admin",  // ← Updated
  ...
}
```

### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer {token}
Role: admin

Response:
{
  message: "Đã xóa user và toàn bộ dữ liệu liên quan"
}

Error cases:
- 400: Cannot delete yourself
- 404: User not found
- 500: Server error
```

### Get All Courses (Admin view)
```
GET /api/admin/courses
Authorization: Bearer {token}
Role: admin

Response:
[
  {
    _id: "...",
    name: "Cấu trúc dữ liệu",
    code: "CS202",
    user: {
      _id: "...",
      name: "Nguyen Van A",
      email: "a@example.com"
    },
    ...
  },
  ...
]
```

### Get All Tasks (Admin view)
```
GET /api/admin/tasks
Authorization: Bearer {token}
Role: admin

Response:
[
  {
    _id: "...",
    title: "Bài tập tuần 1",
    user: {
      _id: "...",
      name: "Nguyen Van A"
    },
    course: {
      _id: "...",
      name: "Cấu trúc dữ liệu"
    },
    ...
  },
  ...
]
```

## Backend Implementation

### Models
- **User model**: Đã có field `role` với enum `['user', 'admin']`, default `'user'`

### Middleware
```javascript
// middleware/auth.js

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Chỉ admin mới có quyền truy cập' 
    });
  }
};
```

### Controller
```javascript
// controllers/adminController.js

// Get stats
export const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalTasks = await Task.countDocuments();
  const totalTimetableEntries = await Timetable.countDocuments();
  
  res.json({
    totalUsers,
    totalCourses,
    totalTasks,
    totalTimetableEntries
  });
};

// Get all users with pagination & search
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  const query = search 
    ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
    : {};
  
  const users = await User.find(query)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  
  const total = await User.countDocuments(query);
  
  res.json({
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit)
  });
};

// Update user (including role)
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    return res.status(404).json({ message: 'User không tồn tại' });
  }
  
  res.json(user);
};

// Delete user (cascade)
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  
  // Prevent self-deletion
  if (userId === req.user._id.toString()) {
    return res.status(400).json({ 
      message: 'Không thể xóa chính mình' 
    });
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User không tồn tại' });
  }
  
  // Cascade delete
  await Course.deleteMany({ user: userId });
  await Task.deleteMany({ user: userId });
  await Timetable.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);
  
  res.json({ 
    message: 'Đã xóa user và toàn bộ dữ liệu liên quan' 
  });
};
```

### Routes
```javascript
// routes/adminRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCourses,
  getAllTasks
} from '../controllers/adminController.js';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(admin);

// Stats
router.get('/stats', getAdminStats);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// System-wide data
router.get('/courses', getAllCourses);
router.get('/tasks', getAllTasks);

export default router;
```

## Frontend Implementation

### Admin Page Structure
```jsx
// pages/admin/Admin.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaBook, FaTasks, FaCalendar, FaTrash, FaUserShield } from 'react-icons/fa';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
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
      setPagination(prev => ({ 
        ...prev, 
        total: data.total, 
        totalPages: data.totalPages 
      }));
    } catch (error) {
      toast.error('Không thể tải danh sách users');
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(
      `⚠️ Bạn có chắc muốn xóa user "${userName}"? Tất cả dữ liệu sẽ bị xóa vĩnh viễn!`
    )) {
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

  // ... render logic
}
```

### API Service
```javascript
// services/api.js
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllCourses: () => api.get('/admin/courses'),
  getAllTasks: () => api.get('/admin/tasks'),
};
```

### Layout Navigation
```jsx
// components/layout/Layout.jsx
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user } = useAuth();
  
  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Trang chủ' },
    { path: '/courses', icon: FaBook, label: 'Khóa học' },
    { path: '/tasks', icon: FaTasks, label: 'Nhiệm vụ' },
    { path: '/timetable', icon: FaCalendar, label: 'Thời khóa biểu' },
    { path: '/profile', icon: FaUser, label: 'Hồ sơ' },
  ];
  
  // Chỉ hiện Admin link nếu user có role admin
  if (user?.role === 'admin') {
    navItems.push({
      path: '/admin',
      icon: FaUserShield,
      label: 'Admin'
    });
  }
  
  // ... render navigation
}
```

## Edge Cases & Error Handling

### Edge Cases
1. **Admin tự xóa chính mình**: Backend trả 400, toast error "Không thể xóa chính mình"
2. **Admin tự chuyển role của mình**: Backend cho phép nhưng cần confirm nghiêm trọng
3. **Xóa admin cuối cùng**: Nên có check backend để giữ ít nhất 1 admin
4. **Search không có kết quả**: Hiển thị empty state "Không tìm thấy user nào"
5. **Pagination page không hợp lệ**: Clamp về page 1 hoặc lastPage
6. **User bị xóa khi đang xem**: 404 error, redirect về user list

### Error Messages
- **403 Forbidden**: "Bạn không có quyền truy cập trang này"
- **404 Not Found**: "User không tồn tại"
- **400 Bad Request**: "Không thể xóa chính mình"
- **500 Server Error**: "Đã xảy ra lỗi, vui lòng thử lại"

## Security Considerations

1. **Authentication**: Tất cả routes đều cần JWT token hợp lệ
2. **Authorization**: Check role admin ở cả frontend (UI) và backend (API)
3. **CSRF Protection**: Sử dụng token-based auth thay vì cookie
4. **Rate Limiting**: Giới hạn số request delete/update để tránh abuse
5. **Audit Log** (future): Ghi log các hành động admin (delete, role change)
6. **Password Protection**: Admin không được xem password của user (luôn exclude `-password`)

## Future Enhancements

1. **Bulk Actions**: Xóa nhiều users cùng lúc, bulk role change
2. **Advanced Filters**: Filter by role, date range, major, semester
3. **Export Data**: Export user list ra CSV/Excel
4. **Activity Logs**: Lịch sử các hành động admin
5. **User Details Modal**: Xem chi tiết user với charts (task completion rate, study hours)
6. **Email Notifications**: Gửi email thông báo khi role được thay đổi
7. **System Settings**: Cấu hình global settings (maintenance mode, feature flags)
8. **Analytics Dashboard**: Biểu đồ thống kê users/courses/tasks theo thời gian

## Testing

### Manual Test Cases
1. **Access Control**:
   - [ ] User thường không truy cập được /admin (redirect hoặc 403)
   - [ ] Admin truy cập được /admin
   - [ ] Admin link chỉ hiện trong nav nếu role = admin

2. **Dashboard Stats**:
   - [ ] Stats hiển thị đúng số lượng
   - [ ] Refresh stats sau khi delete user

3. **User Management**:
   - [ ] Search user theo tên/email
   - [ ] Pagination hoạt động đúng
   - [ ] Toggle role user ↔ admin
   - [ ] Delete user thành công
   - [ ] Cascade delete: courses/tasks/timetable bị xóa theo

4. **Edge Cases**:
   - [ ] Admin không thể tự xóa mình
   - [ ] Confirm dialog xuất hiện trước khi delete/change role
   - [ ] Error handling: toast hiển thị lỗi rõ ràng

## UI/UX Guidelines

### Colors
- **Admin theme**: Purple-Pink gradient (`from-purple-600 to-pink-600`)
- **Stats cards**: Varied gradients (blue, green, purple, orange)
- **Role badges**: 
  - Admin: Red/Pink with 👑
  - User: Blue/Gray with 👤

### Spacing
- Card padding: `p-6`
- Grid gap: `gap-6`
- Table cell padding: `px-4 py-3`

### Typography
- Page title: `text-3xl font-bold`
- Stats numbers: `text-4xl font-bold`
- Table headers: `text-sm font-semibold uppercase`

### Icons
- Use react-icons/fa
- Consistent sizing: `size={20}` cho buttons, `size={40}` cho stats

### Animations
- Hover: `transition-all duration-200`
- Button hover: `hover:scale-105`
- Card hover: `hover:shadow-xl`

---

**Note**: File này mô tả đầy đủ Admin panel. Kết hợp với các file khác (COURSES.md, TASKS.md...) để có cái nhìn toàn diện về hệ thống.
