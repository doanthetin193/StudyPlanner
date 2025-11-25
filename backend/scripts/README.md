# Seed Scripts - Hướng dẫn sử dụng

## 📝 Giới thiệu

Thư mục này chứa các script để seed (khởi tạo) dữ liệu mẫu cho hệ thống Study Planner.

## 🗂️ Các file seed

### 1. `seedAdmin.js` - Tạo Admin User

Script này tạo một tài khoản admin mặc định cho hệ thống.

**Thông tin tài khoản:**
- **Email:** `admin@studyplanner.com`
- **Password:** `admin123456`
- **Role:** `admin`

**Chạy script:**
```bash
cd backend
npm run seed:admin
```

**Lưu ý:**
- Script sẽ kiểm tra và không tạo lại nếu admin đã tồn tại
- ⚠️ **Quan trọng:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

### 2. `seedData.js` - Tạo Sample Data

Script này tạo dữ liệu mẫu đầy đủ cho testing, bao gồm:

**Dữ liệu được tạo:**
- 👥 **3 Users** (sinh viên mẫu)
- 📚 **15 Courses** (5 môn học cho mỗi user)
- ✅ **6 Tasks** cho user đầu tiên
- 📅 **10 Timetable entries** cho user đầu tiên

**Thông tin test accounts:**

| Email | Password | MSSV | Ngành |
|-------|----------|------|-------|
| `an.nguyen@student.com` | `password123` | 2021001 | Công nghệ thông tin |
| `binh.tran@student.com` | `password123` | 2021002 | Khoa học máy tính |
| `cuong.le@student.com` | `password123` | 2021003 | Hệ thống thông tin |

**Môn học mẫu:**
1. Cấu trúc dữ liệu và giải thuật (CS202)
2. Lập trình hướng đối tượng (CS203)
3. Cơ sở dữ liệu (CS204)
4. Mạng máy tính (CS205)
5. Công nghệ Web (CS206)

**Chạy script:**
```bash
cd backend
npm run seed:data
```

**Lưu ý:**
- ⚠️ Script sẽ **XÓA TẤT CẢ** dữ liệu user hiện có (trừ admin) trước khi seed
- Dữ liệu tasks và timetable chỉ được tạo cho user đầu tiên
- Tasks có deadline từ 1-7 ngày sau khi chạy script

### 3. Seed All - Tạo tất cả

Chạy cả 2 script liên tiếp:

```bash
cd backend
npm run seed:all
```

## 🚀 Quy trình khuyến nghị

### Lần đầu setup:
```bash
# 1. Tạo admin user
npm run seed:admin

# 2. Tạo sample data
npm run seed:data
```

### Reset toàn bộ dữ liệu:
```bash
# Xóa và tạo lại tất cả
npm run seed:all
```

### Chỉ reset sample data:
```bash
# Giữ nguyên admin, chỉ reset user data
npm run seed:data
```

## 🔧 Yêu cầu

- Node.js đã cài đặt
- MongoDB đang chạy
- File `.env` đã cấu hình đúng với `MONGODB_URI`

## 📋 Cấu trúc dữ liệu tạo ra

### Tasks (6 tasks)
- 2 tasks với priority "urgent" (deadline 5-7 ngày)
- 2 tasks với priority "high" (deadline 1-2 ngày)
- 2 tasks với priority "medium" (deadline 3-4 ngày)
- Mix các loại: assignment, project, exam, reading, review

### Timetable (10 entries)
- Thứ 2: 2 buổi học (08:00-10:00, 13:00-15:00)
- Thứ 3: 2 buổi học (08:00-10:00, 14:00-16:00)
- Thứ 4: 2 buổi học (10:00-12:00, 13:00-15:00)
- Thứ 5: 2 buổi học (08:00-10:00, 14:00-16:00)
- Thứ 6: 2 buổi học (08:00-10:00, 13:00-15:00)
- Mix các loại: lecture, lab, tutorial

## ⚠️ Cảnh báo

- **seedData.js** sẽ XÓA tất cả users (trừ admin), courses, tasks, và timetable
- Không chạy trên production environment
- Backup dữ liệu quan trọng trước khi chạy
- Admin user được bảo vệ và không bị xóa

## 🐛 Troubleshooting

### Lỗi kết nối database:
```bash
# Kiểm tra MongoDB đang chạy
# Kiểm tra MONGODB_URI trong .env
```

### Admin đã tồn tại:
```bash
# Script sẽ báo và không tạo lại
# Nếu cần reset admin, xóa thủ công trong database
```

### Import error:
```bash
# Đảm bảo "type": "module" trong package.json
# Đảm bảo sử dụng .js extension trong import
```

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. MongoDB connection string
2. Environment variables
3. Node.js version (recommend v16+)
4. Package dependencies installed
