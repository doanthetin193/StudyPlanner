# 🔔 Browser Notification - Hướng Dẫn Sử Dụng

## ✅ Tính Năng Đã Hoàn Thành (B4)

Browser Notification đã được implement đầy đủ với các tính năng:

### 📋 Chức Năng Chính

1. **Request Permission Banner**
   - Hiển thị banner yêu cầu quyền thông báo khi lần đầu vào Dashboard
   - Có thể "Bật thông báo" hoặc "Để sau"
   - Tự động ẩn sau khi chọn

2. **Auto Check Task Sắp Đến Hạn**
   - Kiểm tra mỗi 1 phút một lần
   - Thông báo khi task còn <= `remindBefore` phút (mặc định 60 phút)
   - Nhóm notification theo khoảng 5 phút để tránh spam

3. **Notification Thông Minh**
   - ⏰ **Sắp đến hạn**: Thông báo khi task còn ít thời gian
   - 🚨 **Quá hạn**: Thông báo urgent khi task vừa mới quá hạn (trong 5 phút)
   - Hiển thị: Tên task, thời gian còn lại, tên môn học
   - Rung (vibrate) cho task urgent

4. **Test Notification Button**
   - Nút floating ở góc phải dưới Dashboard
   - Click để test notification ngay

---

## 🚀 Cách Sử Dụng

### Lần Đầu Sử Dụng

1. **Đăng nhập vào ứng dụng**
2. **Vào Dashboard** - sẽ thấy banner xanh yêu cầu bật thông báo
3. **Click "Bật thông báo"**
4. **Cho phép** khi trình duyệt hỏi permission
5. **Test ngay** bằng nút chuông 🔔 ở góc phải dưới

### Tạo Task Để Test

1. **Vào trang "Công việc"**
2. **Thêm task mới** với:
   - Chọn môn học
   - Đặt deadline trong 30 phút nữa
   - Click "Thêm công việc"
3. **Chờ** - sau khi còn <= 60 phút, sẽ nhận notification
4. **Hoặc test ngay** với nút 🔔 ở Dashboard

---

## 🎯 Kịch Bản Notification

| Thời Gian Còn Lại | Loại Notification | Hành Động |
|-------------------|-------------------|-----------|
| > 60 phút | Không thông báo | Chờ |
| 30-60 phút | ⏰ Sắp đến hạn | Notification thông thường |
| 10-30 phút | ⏰ Sắp đến hạn | Notification + nhóm 5 phút |
| < 10 phút | ⏰ Sắp đến hạn | Notification + Vibrate + Keep visible |
| Vừa quá hạn (< 5 phút) | 🚨 Quá hạn | Notification URGENT + Vibrate mạnh |

---

## 🛠️ Cấu Trúc Code

### Files Đã Tạo/Sửa

```
frontend/src/
├── context/
│   └── NotificationContext.jsx        # Context quản lý notification permission
├── hooks/
│   └── useTaskNotifications.js        # Hook check task và trigger notification
├── components/
│   └── notifications/
│       ├── NotificationPermission.jsx # Banner xin permission
│       └── NotificationTest.jsx       # Button test notification
├── App.jsx                            # Wrap NotificationProvider
├── components/layout/Layout.jsx       # Enable useTaskNotifications
└── pages/dashboard/Dashboard.jsx      # Show banner + test button
```

### Cách Hoạt Động

```javascript
// 1. NotificationProvider wrap toàn app
<NotificationProvider>
  <App />
</NotificationProvider>

// 2. Layout component enable auto-check
useTaskNotifications(); // Check mỗi phút

// 3. Dashboard show banner
<NotificationPermission /> // Xin permission

// 4. Auto trigger khi task sắp đến hạn
showNotification('⏰ Sắp đến hạn!', {
  body: 'Task ABC còn 30 phút',
  vibrate: [200, 100, 200]
});
```

---

## 🎨 Tùy Chỉnh

### Thay Đổi Thời Gian Nhắc Nhở

Trong Task model (`backend/src/models/Task.js`):

```javascript
remindBefore: {
  type: Number,
  default: 60 // Đổi số này (phút)
}
```

### Thay Đổi Icon Notification

Trong `NotificationContext.jsx`:

```javascript
icon: '/vite.svg', // Đổi path icon
badge: '/vite.svg'
```

### Thay Đổi Tần Suất Check

Trong `useTaskNotifications.js`:

```javascript
setInterval(checkUpcomingTasks, 60 * 1000); // 60 giây = 1 phút
```

---

## 🧪 Testing Checklist

- [x] Permission request hoạt động
- [x] Test notification button hoạt động
- [x] Auto check task mỗi 1 phút
- [x] Notification hiển thị đúng nội dung
- [x] Không spam notification (nhóm 5 phút)
- [x] Vibrate cho urgent task
- [x] Xử lý khi user block permission
- [x] Banner dismiss và lưu localStorage
- [x] Dark mode support

---

## ⚙️ Browser Support

| Browser | Support | Note |
|---------|---------|------|
| Chrome | ✅ | Full support |
| Firefox | ✅ | Full support |
| Edge | ✅ | Full support |
| Safari | ⚠️ | Cần user action để enable |
| Opera | ✅ | Full support |

---

## 🐛 Troubleshooting

### Không Nhận Được Notification?

1. **Check permission**: Vào settings browser → Site settings → Notifications
2. **Check tab**: Tab phải đang mở (có thể minimize nhưng không close)
3. **Check Focus Assist** (Windows): Tắt Focus Assist/Do Not Disturb
4. **Check task**: Task phải có `dueDate` và status là `todo` hoặc `in-progress`

### Permission Bị Denied?

1. Click icon 🔒 bên cạnh URL
2. Tìm "Notifications" → Allow
3. Refresh trang

### Notification Spam?

- Logic đã có group theo 5 phút
- Nếu vẫn spam, tăng interval trong `useTaskNotifications.js`

---

## 📊 Metrics

**Code Added:**
- `NotificationContext.jsx`: ~85 dòng
- `useTaskNotifications.js`: ~100 dòng  
- `NotificationPermission.jsx`: ~95 dòng
- `NotificationTest.jsx`: ~30 dòng
- Integrations: ~10 dòng

**Total: ~320 dòng code**

**Time: 2-3 giờ** ✅

---

## 🎯 Next Steps (Optional)

Nếu muốn nâng cấp thêm:

1. **Service Worker Notification** (cho PWA)
2. **Notification với ảnh** (rich notification)
3. **Click notification** → mở task detail
4. **Snooze notification** (nhắc lại sau X phút)
5. **Customizable notification sound**
6. **Weekly summary notification**

---

## ✅ Kết Luận

**Yêu cầu B4 (Thông báo nhắc nhở) đã hoàn thành 100%!** 🎉

Ứng dụng giờ đã có:
- ✅ Browser notification API
- ✅ Auto check task sắp đến hạn
- ✅ Permission management
- ✅ Smart notification (không spam)
- ✅ Test functionality
- ✅ Error handling

**Ready for demo!** 🚀
