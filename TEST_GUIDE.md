# 🧪 HƯỚNG DẪN TEST ỨNG DỤNG

## ✅ Ứng dụng đang chạy

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 📋 BƯỚC 1: TEST ĐĂNG NHẬP & DASHBOARD

### 1.1 Đăng nhập (Đã làm ✅)
Bạn đã đăng nhập thành công!

### 1.2 Xem Dashboard
- Nhìn vào **Dashboard**, bạn sẽ thấy:
  - ✅ 4 thẻ thống kê: Tổng công việc, Hoàn thành, Sắp đến hạn, Quá hạn
  - ✅ Danh sách "Công việc sắp tới" (hiện đang trống vì chưa có task)
  - ✅ Danh sách "Môn học" (hiện đang trống vì chưa có môn học)

---

## 📚 BƯỚC 2: TEST QUẢN LÝ MÔN HỌC

### 2.1 Thêm môn học mới
1. Click vào **"Môn học"** ở sidebar bên trái
2. Click nút **"+ Thêm môn học"** (góc phải trên)
3. Điền form:
   ```
   Tên môn học: Cấu trúc dữ liệu và giải thuật
   Mã môn học: IT3011
   Số tín chỉ: 3
   Giảng viên: TS. Nguyễn Văn A
   Phòng học: TC-101
   Màu sắc: Chọn màu xanh dương
   Học kỳ: HK1 2024-2025
   Mô tả: Học về các cấu trúc dữ liệu cơ bản
   ```
4. Click **"Thêm môn học"**
5. ✅ **Kết quả**: Toast thông báo "Thêm môn học thành công!" và thấy môn học xuất hiện

### 2.2 Thêm thêm vài môn học khác
Thêm tiếp 2-3 môn học nữa để test đầy đủ:

**Môn học 2:**
```
Tên: Lập trình hướng đối tượng
Mã: IT3100
Tín chỉ: 4
GV: PGS. Trần Thị B
Phòng: TC-205
Màu: Xanh lá
Học kỳ: HK1 2024-2025
```

**Môn học 3:**
```
Tên: Cơ sở dữ liệu
Mã: IT3020
Tín chỉ: 3
GV: ThS. Lê Văn C
Phòng: TC-303
Màu: Cam
Học kỳ: HK1 2024-2025
```

### 2.3 Test chỉnh sửa môn học
1. Hover vào một môn học bất kỳ
2. Click icon **Sửa** (bút chì màu xanh)
3. Thay đổi thông tin (VD: đổi phòng học, giảng viên)
4. Click **"Cập nhật"**
5. ✅ **Kết quả**: Thông tin đã được cập nhật

### 2.4 Test xóa môn học
1. Click icon **Xóa** (thùng rác màu đỏ)
2. Confirm trong popup
3. ✅ **Kết quả**: Môn học bị xóa khỏi danh sách

---

## ✅ BƯỚC 3: KIỂM TRA DASHBOARD LẠI

1. Quay lại **Dashboard** (click "Dashboard" ở sidebar)
2. ✅ **Kết quả**: Phần "Môn học" bây giờ hiển thị danh sách các môn học bạn vừa thêm

---

## 🎯 BƯỚC 4: TEST VỚI POSTMAN/API (OPTIONAL)

Nếu muốn test thêm API backend:

### 4.1 Lấy token
- Mở DevTools (F12) → Console
- Gõ: `localStorage.getItem('token')`
- Copy token

### 4.2 Test API thêm Task
```http
POST http://localhost:5000/api/tasks
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json

{
  "course": "<COURSE_ID>",
  "title": "Bài tập tuần 1 - Quick Sort",
  "description": "Implement thuật toán Quick Sort bằng C++",
  "type": "assignment",
  "dueDate": "2025-11-05T23:59:00.000Z",
  "priority": "high"
}
```

**Lấy COURSE_ID:**
- Vào tab Network trong DevTools
- Reload trang Môn học
- Tìm request `GET /api/courses`
- Copy `_id` của một môn học

### 4.3 Test xem Task vừa tạo
```http
GET http://localhost:5000/api/tasks
Authorization: Bearer <YOUR_TOKEN>
```

---

## 📊 BƯỚC 5: KIỂM TRA DATABASE (OPTIONAL)

Nếu bạn có MongoDB Compass:

1. Kết nối với URI:
   ```
   mongodb+srv://doanthetindeveloper:doanthetin193@cluster0.g69mfzf.mongodb.net/study_planner
   ```
2. Xem các collection:
   - `users` - Tài khoản của bạn
   - `courses` - Các môn học đã thêm
   - `tasks` - Các task đã tạo (nếu có)

---

## 🎨 BƯỚC 6: TEST RESPONSIVE (MOBILE)

1. Mở DevTools (F12)
2. Click icon **Toggle device toolbar** (hoặc Ctrl+Shift+M)
3. Chọn iPhone/iPad để xem responsive
4. ✅ **Kết quả**: 
   - Sidebar thu vào
   - Nút hamburger menu xuất hiện
   - Layout thích ứng với màn hình nhỏ

---

## 🔍 BƯỚC 7: TEST PROFILE

1. Click vào **"Hồ sơ"** ở sidebar (hoặc phần user ở dưới cùng sidebar)
2. Thử cập nhật thông tin:
   - Họ tên
   - Mã sinh viên
   - Ngành học
   - Học kỳ
3. Click **"Lưu thay đổi"**
4. ✅ **Kết quả**: Toast "Cập nhật thông tin thành công!"

---

## 🚀 CÁC CHỨC NĂNG ĐÃ HOẠT ĐỘNG

✅ **Authentication**
- [x] Đăng ký
- [x] Đăng nhập
- [x] Đăng xuất
- [x] Lưu token tự động
- [x] Protected routes

✅ **Dashboard**
- [x] Hiển thị thống kê tổng quan
- [x] Danh sách môn học
- [x] Danh sách task sắp tới (realtime)

✅ **Quản lý môn học**
- [x] Thêm môn học (với form đầy đủ)
- [x] Sửa môn học
- [x] Xóa môn học (có confirm)
- [x] Hiển thị grid đẹp với màu sắc
- [x] Validation

✅ **Profile**
- [x] Xem thông tin
- [x] Cập nhật thông tin

---

## ⚠️ CHÚ Ý

### Tasks & Timetable đang ở UI cơ bản
- Trang "Công việc" và "Thời khóa biểu" chưa có form CRUD đầy đủ
- Tuy nhiên, **API backend hoàn chỉnh** - bạn có thể test bằng Postman
- Để thêm task/timetable, hiện tại dùng API hoặc tôi sẽ code thêm form nếu bạn cần

---

## 🎓 CHECKLIST TEST HOÀN CHỈNH

- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập
- [ ] Xem Dashboard (stats)
- [ ] Thêm 3 môn học khác nhau
- [ ] Sửa 1 môn học
- [ ] Xóa 1 môn học
- [ ] Quay lại Dashboard kiểm tra
- [ ] Cập nhật Profile
- [ ] Đăng xuất
- [ ] Đăng nhập lại (kiểm tra token còn hiệu lực)
- [ ] Test responsive mobile
- [ ] (Optional) Test API với Postman

---

## 💡 GỢI Ý DEMO CHO GIẢNG VIÊN

### Kịch bản demo (5-7 phút):

1. **Giới thiệu** (30s)
   - Mở ứng dụng, giải thích mục đích

2. **Đăng ký/Đăng nhập** (30s)
   - Show tính năng authentication

3. **Dashboard** (1 phút)
   - Giải thích các thống kê
   - Show realtime updates

4. **Quản lý môn học** (2 phút)
   - Thêm 2 môn học mẫu
   - Show form validation
   - Chọn màu sắc
   - Sửa, xóa

5. **Show API** (1 phút)
   - Mở Postman/Thunder Client
   - Demo 1-2 API call
   - Show JWT authentication

6. **Show Database** (1 phút)
   - Mở MongoDB Compass hoặc Atlas
   - Show collections
   - Explain schema

7. **Mobile responsive** (30s)
   - Toggle device toolbar
   - Show responsive design

8. **Kết luận** (30s)
   - Tổng kết tính năng
   - Hướng phát triển tiếp theo

---

**Chúc bạn test thành công! 🎉**
