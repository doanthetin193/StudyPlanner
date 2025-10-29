# Tasks (Công việc) — Chi tiết chức năng

Trang Tasks cho phép người dùng quản lý toàn bộ công việc/nhiệm vụ học tập (assignments, exams, projects, readings...), bao gồm tạo, sửa, xóa, lọc, phân loại và nhận thông báo tự động khi sắp đến hạn.

## Mục tiêu
- Quản lý danh sách công việc (CRUD): tạo, sửa, xóa, đánh dấu hoàn thành.
- Phân loại công việc theo **loại** (type), **độ ưu tiên** (priority), **trạng thái** (status).
- Gắn công việc với **môn học** (course) cụ thể.
- **Thông báo thông minh**: tự động nhắc nhở khi công việc sắp đến hạn (browser notifications).
- Lọc và sắp xếp công việc theo nhiều tiêu chí.
- Hiển thị UI rõ ràng, dễ đọc với màu sắc, icon/emoji phân biệt.

## Thành phần UI chính

### 1. Task List (Danh sách công việc)
- **Hiển thị**: Nhóm theo **trạng thái** (status):
  - 📝 **Chưa làm** (todo): các task chưa bắt đầu
  - ⏳ **Đang làm** (in-progress): task đang thực hiện
  - ✅ **Hoàn thành** (completed): task đã xong
  - 🚨 **Quá hạn** (overdue): task đã qua thời gian dueDate mà chưa hoàn thành
- **Task Card** bao gồm:
  - **Header**: Icon theo type (📝, 📋, 🚀...) + Tiêu đề task (font bold) + Priority badge (⬇️, ➡️, ⬆️, 🔥)
  - **Course tag**: Badge hiển thị tên môn học liên kết (nếu có), màu theo `course.color`
  - **Due date**: Thời gian hết hạn, hiển thị relative time (VD: "2 giờ nữa", "3 ngày nữa", "Quá hạn 1 ngày")
  - **Status indicator**: Checkbox hoặc badge màu theo trạng thái
  - **Action buttons**: Sửa (✏️), Xóa (🗑️), Đánh dấu hoàn thành (✅)
  - **Description** (nếu có): Text mô tả ngắn, line-clamp-2
  - **Metadata**: Estimated time (thời gian ước tính), notes (ghi chú)
- **Empty state**: Khi không có task, hiển thị placeholder "Chưa có công việc nào" + CTA "Tạo công việc đầu tiên".

### 2. Add/Edit Task Modal
- **Trigger**: Nút "➕ Thêm công việc" -> mở modal.
- **Form fields**:
  - **Môn học** (`course`): dropdown chọn từ danh sách courses, bắt buộc
  - **Tiêu đề** (`title`): text input, bắt buộc, max 200 chars
  - **Mô tả** (`description`): textarea, tùy chọn
  - **Loại công việc** (`type`): dropdown từ `TASK_TYPES`
    - 📝 Bài tập (assignment)
    - 📋 Kiểm tra (exam)
    - 🚀 Dự án (project)
    - 📚 Đọc tài liệu (reading)
    - 📖 Ôn tập (review)
    - 📌 Khác (other)
  - **Thời gian hết hạn** (`dueDate`): datetime-local input, bắt buộc (để trigger notifications)
  - **Độ ưu tiên** (`priority`): dropdown từ `TASK_PRIORITIES`
    - ⬇️ Thấp (low)
    - ➡️ Trung bình (medium) — mặc định
    - ⬆️ Cao (high)
    - 🔥 Khẩn cấp (urgent)
  - **Thời gian ước tính** (`estimatedTime`): text input (VD: "2h", "30 phút"), tùy chọn
  - **Ghi chú** (`notes`): textarea, tùy chọn
- **Validation**:
  - `course`, `title`, `dueDate` không được để trống
  - `dueDate` phải là thời gian trong tương lai (nếu tạo mới)
  - `type`, `priority` phải nằm trong danh sách hợp lệ
- **Hành vi submit**:
  - Nếu **thêm mới**: `POST /api/tasks`, status mặc định = `todo`
  - Nếu **chỉnh sửa**: `PUT /api/tasks/:id`
  - Sau khi submit thành công: đóng modal, refresh danh sách, toast "Thêm/Cập nhật công việc thành công!"
  - Nếu lỗi: toast lỗi, giữ modal mở
- **Cancel**: Đóng modal, reset form

### 3. Task Status Management
- **Đánh dấu hoàn thành**: Click checkbox hoặc nút "✅ Hoàn thành" -> gọi `PATCH /api/tasks/:id { status: 'completed' }`
- **Đánh dấu đang làm**: Nút "⏳ Bắt đầu" -> `{ status: 'in-progress' }`
- **Reopen task**: Nếu task đã hoàn thành, có nút "↩️ Mở lại" -> `{ status: 'todo' }`
- **Auto-detect overdue**: Client-side hoặc backend tự động đánh dấu task có `dueDate < now` và `status != completed` thành `overdue`
- **Optimistic UI**: Khi đổi status, update UI ngay lập tức, rollback nếu API lỗi

### 4. Delete Task
- **Trigger**: Nút "Xóa" trên task card -> confirm dialog "Bạn có chắc muốn xóa '{title}'?"
- **API call**: `DELETE /api/tasks/:id`
- **Hành vi**: Confirm -> xóa khỏi danh sách, toast "Đã xóa công việc"
- **Optimistic UI**: Tạm ẩn task ngay, rollback nếu lỗi

### 5. Filters & Search
- **Filter panel**: Toggle hiển thị với nút "🔍 Lọc" / "Ẩn bộ lọc"
- **Filter options**:
  - **Môn học** (filterCourse): dropdown chọn course hoặc "Tất cả môn học"
  - **Trạng thái** (filterStatus): todo, in-progress, completed, overdue, hoặc "Tất cả trạng thái"
  - **Độ ưu tiên** (filterPriority): low, medium, high, urgent, hoặc "Tất cả độ ưu tiên"
- **Search bar** (tùy chọn): Tìm kiếm theo tiêu đề task (client-side filter hoặc query param `?search=`)
- **Sort**: Sắp xếp theo:
  - Due date (sắp hết hạn trước)
  - Priority (urgent -> high -> medium -> low)
  - Created date (mới nhất)
  - Alphabetical (A-Z)

### 6. Browser Notifications
- **Tính năng**: Tự động gửi browser notification khi task sắp đến hạn
- **Thời điểm nhắc nhở**:
  - 1 ngày trước hạn (24h)
  - 3 giờ trước hạn
  - 30 phút trước hạn
- **Cơ chế**:
  - Hook `useTaskNotifications` kiểm tra mỗi 30 phút (polling)
  - Kiểm tra ngay khi quay lại tab sau khi rời đi (visibility change)
  - Lưu trạng thái notifications đã gửi trong localStorage để tránh spam
- **Permission**: Yêu cầu người dùng cấp quyền notification lần đầu
- **Nội dung notification**: 
  - Title: "{priority_icon} {task_title}"
  - Body: "Môn: {course_name} • Hạn: {relative_time}"
  - Icon: emoji theo task type
- **Click notification**: Mở tab/window tới trang Tasks hoặc focus vào task cụ thể

## Dữ liệu & API

### Endpoints
- `GET /api/tasks` — Lấy tất cả tasks của user (hỗ trợ query params: `?course=`, `?status=`, `?priority=`, `?search=`, `?sort=`)
- `POST /api/tasks` — Tạo task mới
- `PUT /api/tasks/:id` — Cập nhật toàn bộ task
- `PATCH /api/tasks/:id` — Cập nhật một phần (VD: chỉ đổi status)
- `DELETE /api/tasks/:id` — Xóa task

### Data model (Task)
```json
{
  "_id": "64abc...",
  "userId": "64xyz...",
  "course": {
    "_id": "64def...",
    "name": "Cấu trúc dữ liệu",
    "code": "CS202",
    "color": "#3b82f6"
  },
  "title": "Nộp bài tập tuần 5",
  "description": "Làm bài tập về cây nhị phân và BST",
  "type": "assignment",
  "dueDate": "2025-11-05T23:59:00.000Z",
  "priority": "high",
  "status": "in-progress",
  "estimatedTime": "2h",
  "notes": "Tham khảo slide bài 4",
  "createdAt": "2025-10-25T10:00:00.000Z",
  "updatedAt": "2025-10-28T14:30:00.000Z"
}
```

### Validation rules (backend)
- `userId`: required (auto từ auth middleware)
- `course`: required, ObjectId ref Course
- `title`: required, string, max 200 chars
- `description`, `notes`: optional strings
- `type`: required, enum ['assignment', 'exam', 'project', 'reading', 'review', 'other']
- `dueDate`: required, Date (ISO 8601)
- `priority`: required, enum ['low', 'medium', 'high', 'urgent'], default = 'medium'
- `status`: required, enum ['todo', 'in-progress', 'completed', 'overdue'], default = 'todo'
- `estimatedTime`: optional string

### Constants (frontend)
Định nghĩa trong `frontend/src/utils/constants.js`:
```javascript
export const TASK_TYPES = {
  assignment: { label: 'Bài tập', color: 'blue', icon: '📝' },
  exam: { label: 'Kiểm tra', color: 'red', icon: '📋' },
  project: { label: 'Dự án', color: 'purple', icon: '🚀' },
  reading: { label: 'Đọc tài liệu', color: 'green', icon: '📚' },
  review: { label: 'Ôn tập', color: 'yellow', icon: '📖' },
  other: { label: 'Khác', color: 'gray', icon: '📌' }
};

export const TASK_PRIORITIES = {
  low: { label: 'Thấp', color: 'gray', icon: '⬇️' },
  medium: { label: 'Trung bình', color: 'blue', icon: '➡️' },
  high: { label: 'Cao', color: 'orange', icon: '⬆️' },
  urgent: { label: 'Khẩn cấp', color: 'red', icon: '🔥' }
};

export const TASK_STATUS = {
  todo: { label: 'Chưa làm', color: 'gray' },
  'in-progress': { label: 'Đang làm', color: 'blue' },
  completed: { label: 'Hoàn thành', color: 'green' },
  overdue: { label: 'Quá hạn', color: 'red' }
};
```

## Hành vi tương tác (UX)

### Loading states
- Khi tải tasks lần đầu: skeleton cards với shimmer effect
- Khi submit form: disable button, spinner hoặc text "Đang lưu..."
- Khi đổi status: tạm disable checkbox/button cho đến khi API trả về

### Error handling
- **Network error**: Toast "Không thể kết nối server"
- **Invalid dueDate**: Toast "Thời gian hết hạn không hợp lệ" (nếu trong quá khứ khi tạo mới)
- **Missing required fields**: Highlight trường lỗi màu đỏ + message
- **Course not found**: Toast "Môn học không tồn tại" (nếu course đã bị xóa)

### Relative time display
- Sử dụng `formatRelativeTime()` utility:
  - "2 giờ nữa"
  - "3 ngày nữa"
  - "Quá hạn 1 ngày"
  - "Hôm nay lúc 14:00"
  - "Ngày mai lúc 09:00"
- Màu sắc:
  - Xanh lá: còn > 3 ngày
  - Vàng: còn 1-3 ngày
  - Cam: còn < 24h
  - Đỏ: quá hạn

### Grouping & Sorting
- **Default**: Group by status (todo -> in-progress -> overdue -> completed)
- Trong mỗi group: sort by due date (sắp hết hạn trước), sau đó priority (urgent trước)
- **Collapsed groups**: Cho phép thu gọn/mở rộng từng nhóm (VD: ẩn completed tasks)

## Notification system chi tiết

### Permission flow
1. Khi user lần đầu vào trang Tasks, hiện banner "🔔 Bật thông báo để nhận nhắc nhở khi công việc sắp hết hạn"
2. Click "Bật thông báo" -> gọi `Notification.requestPermission()`
3. Nếu granted -> lưu `notificationPermission = 'granted'` vào localStorage
4. Nếu denied -> ẩn banner, không hỏi lại (trừ khi user tự reset)

### Notification logic (useTaskNotifications hook)
```javascript
// Pseudo-code
function useTaskNotifications(tasks) {
  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.status === 'completed') return;
        const timeLeft = task.dueDate - now;
        
        // 1 day before
        if (timeLeft <= 24*60*60*1000 && timeLeft > 23*60*60*1000) {
          if (!wasNotified(task._id, '1day')) {
            sendNotification(task, '1 ngày nữa');
            markNotified(task._id, '1day');
          }
        }
        // 3 hours before
        if (timeLeft <= 3*60*60*1000 && timeLeft > 2.5*60*60*1000) {
          if (!wasNotified(task._id, '3hours')) {
            sendNotification(task, '3 giờ nữa');
            markNotified(task._id, '3hours');
          }
        }
        // 30 minutes before
        if (timeLeft <= 30*60*1000 && timeLeft > 25*60*1000) {
          if (!wasNotified(task._id, '30min')) {
            sendNotification(task, '30 phút nữa');
            markNotified(task._id, '30min');
          }
        }
      });
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(checkInterval);
  }, [tasks]);

  // Also check on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) checkNotifications();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}

function sendNotification(task, timeLeftText) {
  new Notification(`${TASK_PRIORITIES[task.priority].icon} ${task.title}`, {
    body: `Môn: ${task.course.name} • Hạn: ${timeLeftText}`,
    icon: '/favicon.ico',
    tag: task._id
  });
}
```

### Notification state (localStorage)
```json
{
  "taskNotifications": {
    "64abc...": {
      "1day": 1730123456789,
      "3hours": 1730210000000,
      "30min": 1730220000000
    }
  }
}
```

## Edge cases & Troubleshooting

### 1. Task đã quá hạn khi tạo
- **Tình huống**: User chọn `dueDate` trong quá khứ.
- **Giải pháp**: Frontend validation: toast "Thời gian hết hạn phải ở tương lai" + block submit.
- **Exception**: Cho phép edit task quá hạn (để sửa lại dueDate hoặc đánh dấu hoàn thành).

### 2. Course bị xóa nhưng task vẫn tồn tại
- **Tình huống**: User xóa course, task liên kết hiển thị lỗi.
- **Giải pháp**:
  - Backend: Khi xóa course, kiểm tra tasks liên quan:
    - Option 1: Cascade delete (xóa luôn tasks) — **mất dữ liệu**
    - Option 2: Set `task.course = null`, frontend hiển thị "Môn học không xác định" — **an toàn hơn**
  - Frontend: Hiển thị badge xám "Không rõ môn" nếu `task.course == null`

### 3. Notification không xuất hiện
- **Nguyên nhân**:
  - Permission denied
  - Browser không hỗ trợ (Safari iOS)
  - Tab đang background (một số browser chặn)
  - Notification đã được gửi rồi (check localStorage)
- **Debug**:
  - Console log `Notification.permission`
  - Kiểm tra localStorage key `taskNotifications`
  - Thử gửi notification thủ công (test button)

### 4. Timezone issues
- **Tình huống**: User ở timezone +7, backend lưu UTC, hiển thị sai giờ.
- **Giải pháp**:
  - Backend lưu `dueDate` dưới dạng UTC ISO string
  - Frontend convert sang local timezone khi hiển thị: `new Date(task.dueDate).toLocaleString()`
  - Khi submit form: `new Date(inputValue).toISOString()`

### 5. Quá nhiều tasks
- **Tình huống**: User có > 100 tasks, trang load chậm.
- **Giải pháp**:
  - **Pagination**: Backend hỗ trợ `?page=1&limit=20`
  - **Virtual scrolling**: Chỉ render tasks trong viewport
  - **Lazy load completed tasks**: Default ẩn completed, click "Xem đã hoàn thành" mới load

## Kiểm thử (Testing checklist)
- [ ] Tạo task mới với đầy đủ thông tin -> Hiển thị đúng nhóm status, màu sắc, icon
- [ ] Tạo task thiếu trường bắt buộc (title, course, dueDate) -> Toast lỗi, form không submit
- [ ] Sửa task -> Form load đúng dữ liệu cũ, submit cập nhật thành công
- [ ] Xóa task -> Confirm dialog, xóa thành công, danh sách update
- [ ] Đánh dấu hoàn thành -> Status đổi sang completed, task chuyển nhóm
- [ ] Reopen task completed -> Status trở lại todo
- [ ] Filter theo course, status, priority -> Danh sách lọc đúng
- [ ] Search task theo title -> Kết quả đúng
- [ ] Sort by due date -> Tasks xếp theo thời gian hết hạn
- [ ] Overdue detection -> Task quá hạn tự động chuyển sang nhóm overdue, màu đỏ
- [ ] Notification permission -> Banner hiện, click bật -> permission granted
- [ ] Notification trigger -> Task sắp hết hạn (1 day, 3h, 30min) -> Notification xuất hiện
- [ ] Mobile responsive -> Cards xếp 1 cột, form hiển thị đúng
- [ ] Empty state -> Không có task, hiển thị placeholder

## Accessibility (A11y)
- Form inputs có `<label>` và `htmlFor` liên kết
- Buttons có aria-label rõ ràng
- Checkbox status có aria-checked
- Modal có focus trap, Escape để đóng
- Color contrast đủ WCAG AA (text trên badge, gradient)
- Keyboard navigation: Tab qua tasks, Enter mở modal sửa, Space toggle checkbox
- Screen reader: announce khi task status thay đổi

## Performance tips
- **Debounce search**: 300ms để giảm re-renders
- **Memoize filtered tasks**: `useMemo` để tránh filter/sort lại mỗi render
- **Virtual scroll**: React Window/Virtuoso nếu > 100 tasks
- **Lazy load courses**: Chỉ fetch khi mở modal thêm/sửa
- **Optimistic updates**: Đổi status ngay, không chờ API

## Gợi ý mở rộng
- **Bulk actions**: Chọn nhiều tasks, đánh dấu hoàn thành/xóa cùng lúc
- **Subtasks**: Task lớn chia thành nhiều subtasks nhỏ
- **Recurring tasks**: Task lặp lại hàng tuần (VD: bài tập thực hành mỗi thứ 3)
- **Tags**: Gắn tags tùy chỉnh cho tasks (VD: #important, #groupwork)
- **Calendar view**: Hiển thị tasks trên lịch theo ngày/tuần/tháng
- **Export**: Xuất danh sách tasks ra CSV/PDF
- **Pomodoro timer**: Tích hợp bộ đếm thời gian Pomodoro cho mỗi task
- **Collaboration**: Chia sẻ task với bạn học, comment/chat

---