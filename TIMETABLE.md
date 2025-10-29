# Timetable (Thời khóa biểu) — Chi tiết chức năng

Trang Timetable cho phép người dùng quản lý lịch học theo tuần, bao gồm thêm, sửa, xóa các buổi học và hiển thị trực quan trên bảng thời khóa biểu.

## Mục tiêu
- Quản lý lịch học hàng tuần (weekly schedule): tạo, sửa, xóa buổi học.
- Hiển thị trực quan theo bảng (table view): cột = ngày trong tuần, hàng = khung giờ.
- Gắn buổi học với **môn học** (course) cụ thể, kế thừa màu sắc và thông tin.
- Phân loại buổi học theo **loại** (type): lý thuyết, thực hành, bài tập, thảo luận.
- Lưu trữ thông tin: thời gian bắt đầu/kết thúc, phòng học, ghi chú.
- Tối ưu cho cả desktop (table) và mobile (list/card view).

## Thành phần UI chính

### 1. Weekly Timetable View (Desktop)
- **Layout**: Bảng (table) với:
  - **Cột header**: Thứ 2 → Chủ nhật (7 cột, có thể bỏ Chủ nhật nếu không dùng)
  - **Hàng header**: Time slots (07:00, 08:00, ..., 21:00)
  - **Cells**: Hiển thị buổi học nếu có, trống nếu không có
- **Class Entry Cell** bao gồm:
  - **Background color**: Màu theo `course.color` với opacity (VD: `#3b82f6 + '20'` = rgba)
  - **Border-left**: Thanh màu đậm theo `course.color` (4px)
  - **Content**:
    - 📚 Tên môn học (font bold, màu theo course)
    - 🕐 Thời gian: `startTime - endTime` (VD: "08:00 - 10:00")
    - 📍 Phòng học (nếu có)
    - Icon loại buổi học: 📖 (lý thuyết), 🔬 (thực hành), ✏️ (bài tập), 💬 (thảo luận)
  - **Hover actions**: Khi hover lên cell, hiện 2 nút:
    - ✏️ Sửa (edit)
    - 🗑️ Xóa (delete)
  - **Multi-hour span**: Nếu buổi học kéo dài nhiều giờ (VD: 08:00-10:00), cell chiếm 2 hàng (rowspan)

### 2. Mobile Timetable View
- **Layout**: Danh sách theo ngày (accordion/list)
- **Day section**: 
  - Header: Emoji + Tên ngày (VD: "📅 Thứ 2") + Badge số lượng lớp (VD: "3 lớp")
  - Expandable: Click để mở/đóng danh sách buổi học trong ngày
- **Class Card**:
  - Background gradient nhẹ theo màu course
  - Border-left màu đậm
  - Nội dung: Tên môn, thời gian, phòng học, loại buổi học
  - Action buttons: Sửa, Xóa (nằm góc phải)
- **Empty state**: Nếu ngày không có buổi học, không hiển thị section đó

### 3. Add/Edit Timetable Entry Modal
- **Trigger**: Nút "➕ Thêm lịch học" -> mở modal
- **Form fields**:
  - **Môn học** (`course`): dropdown chọn từ danh sách courses, bắt buộc
  - **Ngày trong tuần** (`dayOfWeek`): dropdown từ `DAYS_OF_WEEK`
    - 1 = Thứ 2, 2 = Thứ 3, ..., 6 = Thứ 7, 0 = Chủ nhật
  - **Thời gian bắt đầu** (`startTime`): time input (HH:MM), bắt buộc
  - **Thời gian kết thúc** (`endTime`): time input (HH:MM), bắt buộc
  - **Phòng học** (`room`): text input, tùy chọn (VD: "A101", "B205")
  - **Loại buổi học** (`type`): dropdown từ `CLASS_TYPES`
    - 📖 Lý thuyết (lecture) — mặc định
    - 🔬 Thực hành (lab)
    - ✏️ Bài tập (tutorial)
    - 💬 Thảo luận (seminar)
  - **Ghi chú** (`notes`): textarea, tùy chọn
- **Validation**:
  - `course`, `dayOfWeek`, `startTime`, `endTime` không được để trống
  - `endTime` phải sau `startTime` (VD: không cho phép 10:00 → 08:00)
  - Kiểm tra **trùng lịch**: nếu đã có buổi học cùng ngày, cùng khung giờ (hoặc overlap) -> cảnh báo
    - Option 1: Block submit, toast "Trùng lịch với {courseName}"
    - Option 2: Cho phép nhưng highlight conflict (màu đỏ) trong bảng
- **Hành vi submit**:
  - Nếu **thêm mới**: `POST /api/timetable`
  - Nếu **chỉnh sửa**: `PUT /api/timetable/:id`
  - Sau khi submit thành công: đóng modal, refresh timetable, toast "Thêm/Cập nhật lịch học thành công!"
  - Nếu lỗi: toast lỗi, giữ modal mở
- **Cancel**: Đóng modal, reset form

### 4. Delete Timetable Entry
- **Trigger**: Nút "Xóa" trên cell/card -> confirm dialog "Bạn có chắc muốn xóa lịch học này?"
- **API call**: `DELETE /api/timetable/:id`
- **Hành vi**: Confirm -> xóa khỏi bảng, toast "Đã xóa lịch học"
- **Optimistic UI**: Tạm ẩn entry ngay, rollback nếu API lỗi

### 5. Today Highlight
- **Tính năng**: Highlight cột ngày hôm nay với màu/border khác biệt
- **Implementation**: 
  - Lấy `new Date().getDay()` (0 = Chủ nhật, 1 = Thứ 2, ...)
  - Thêm class CSS `bg-yellow-50` hoặc `border-2 border-blue-500` cho cột tương ứng
- **Mobile**: Badge "Hôm nay" bên cạnh tên ngày

### 6. Time Slots Configuration
- **Default**: 07:00 → 21:00 (15 slots)
- **Customizable**: Cho phép user chọn khung giờ hiển thị (VD: chỉ hiển thị 08:00-18:00 nếu không có lớp sáng sớm/tối muộn)
- **Auto-detect**: Tự động ẩn các time slots không có buổi học nào (option)

## Dữ liệu & API

### Endpoints
- `GET /api/timetable` — Lấy tất cả timetable entries của user
- `GET /api/timetable/weekly` — Lấy timetable nhóm theo ngày trong tuần (object với keys 0-6)
- `POST /api/timetable` — Tạo timetable entry mới
- `PUT /api/timetable/:id` — Cập nhật timetable entry
- `DELETE /api/timetable/:id` — Xóa timetable entry

### Data model (Timetable Entry)
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
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "10:00",
  "room": "A101",
  "type": "lecture",
  "notes": "Nhớ mang máy tính",
  "createdAt": "2025-10-01T...",
  "updatedAt": "2025-10-15T..."
}
```

### Validation rules (backend)
- `userId`: required (auto từ auth middleware)
- `course`: required, ObjectId ref Course
- `dayOfWeek`: required, integer 0-6 (0 = CN, 1 = T2, ..., 6 = T7)
- `startTime`: required, string HH:MM (24-hour format)
- `endTime`: required, string HH:MM, phải > startTime
- `room`: optional string, max 50 chars
- `type`: required, enum ['lecture', 'lab', 'tutorial', 'seminar'], default = 'lecture'
- `notes`: optional string, max 500 chars

### Weekly data structure (frontend)
```javascript
// Response từ GET /api/timetable/weekly
{
  0: [], // Chủ nhật
  1: [   // Thứ 2
    { _id: "...", course: {...}, startTime: "08:00", endTime: "10:00", ... },
    { _id: "...", course: {...}, startTime: "14:00", endTime: "16:00", ... }
  ],
  2: [...], // Thứ 3
  // ...
  6: []  // Thứ 7
}
```

### Constants (frontend)
Định nghĩa trong `frontend/src/utils/constants.js`:
```javascript
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Chủ nhật', short: 'CN', emoji: '🌞' },
  { value: 1, label: 'Thứ 2', short: 'T2', emoji: '📅' },
  { value: 2, label: 'Thứ 3', short: 'T3', emoji: '📅' },
  { value: 3, label: 'Thứ 4', short: 'T4', emoji: '📅' },
  { value: 4, label: 'Thứ 5', short: 'T5', emoji: '📅' },
  { value: 5, label: 'Thứ 6', short: 'T6', emoji: '📅' },
  { value: 6, label: 'Thứ 7', short: 'T7', emoji: '🎉' }
];

export const CLASS_TYPES = {
  lecture: { label: 'Lý thuyết', color: 'blue', icon: '📖' },
  lab: { label: 'Thực hành', color: 'green', icon: '🔬' },
  tutorial: { label: 'Bài tập', color: 'purple', icon: '✏️' },
  seminar: { label: 'Thảo luận', color: 'orange', icon: '💬' }
};
```

## Hành vi tương tác (UX)

### Loading states
- Khi tải timetable lần đầu: skeleton table/cards với shimmer effect
- Khi submit form: disable button, spinner hoặc text "Đang lưu..."

### Error handling
- **Invalid time**: Toast "Thời gian kết thúc phải sau thời gian bắt đầu"
- **Overlap conflict**: Toast "Trùng lịch với {courseName} vào {time}"
- **Course not found**: Toast "Môn học không tồn tại"
- **Network error**: Toast "Không thể kết nối server"

### Cell rendering logic (multi-hour classes)
```javascript
// Pseudo-code cho việc render cell trong table
timeSlots.map(time => {
  const timeHour = parseInt(time.split(':')[0]);
  const classAtTime = dayClasses.find(entry => {
    const startHour = parseInt(entry.startTime.split(':')[0]);
    const endHour = parseInt(entry.endTime.split(':')[0]);
    return timeHour >= startHour && timeHour < endHour;
  });
  
  // Chỉ render khi time === startTime (để tránh duplicate)
  if (classAtTime && timeHour === parseInt(classAtTime.startTime.split(':')[0])) {
    return <ClassCell entry={classAtTime} />;
  }
  return <EmptyCell />;
});
```

### Color coordination
- Mỗi entry kế thừa màu từ `course.color`
- Background: `color + '20'` (hex color + opacity 20%)
- Border-left: `color` (full opacity)
- Text color: `color` (cho tên môn)

### Responsive behavior
- **Desktop (≥ 768px)**: Table view với 7 cột (hoặc 6 nếu ẩn Chủ nhật)
- **Mobile (< 768px)**: List/card view, nhóm theo ngày
- **Tablet**: Có thể giữ table nhưng font size nhỏ hơn, horizontal scroll nếu cần

## Edge cases & Troubleshooting

### 1. Trùng lịch (Schedule conflict)
- **Tình huống**: 2 buổi học cùng ngày, cùng giờ hoặc overlap.
  - VD: Lớp A (08:00-10:00) và Lớp B (09:00-11:00) -> overlap 1 giờ
- **Giải pháp**:
  - **Backend validation**: Kiểm tra overlap khi create/update, trả lỗi 400 nếu conflict
  - **Frontend**: Toast cảnh báo, highlight conflict màu đỏ
  - **Option**: Cho phép override (checkbox "Cho phép trùng lịch" trong form)

### 2. Time validation
- **Tình huống**: User nhập `endTime = 08:00`, `startTime = 10:00` (đảo ngược)
- **Giải pháp**: Frontend validation trước khi submit, toast lỗi

### 3. Course bị xóa
- **Tình huống**: Course đã xóa nhưng timetable entry vẫn tồn tại
- **Giải pháp**: 
  - Backend cascade delete (xóa luôn timetable entries khi xóa course)
  - Hoặc set `entry.course = null`, frontend hiển thị "Môn học không xác định"

### 4. Midnight crossing
- **Tình huống**: Lớp học từ 23:00 → 01:00 (qua ngày mới)
- **Giải pháp**: Không hỗ trợ (constraint: endTime phải trong cùng ngày với startTime)
  - Alternative: Tạo 2 entries riêng biệt (23:00-23:59, 00:00-01:00)

### 5. Empty timetable
- **Tình huống**: User chưa thêm buổi học nào
- **Giải pháp**: Hiển thị placeholder "Chưa có lịch học nào. Thêm lịch học đầu tiên!" + CTA button

### 6. Timezone issues
- **Tình huống**: Time được lưu dưới dạng string "HH:MM" (không có timezone), có thể gây nhầm lẫn
- **Giải pháp**: Lưu cả timezone info hoặc assume local timezone
  - Current: Lưu string đơn giản (08:00, 14:00) -> đủ cho use case tuần lặp lại

## Kiểm thử (Testing checklist)
- [ ] Thêm lịch học mới với đầy đủ thông tin -> Hiển thị đúng cell trong bảng, màu sắc đúng
- [ ] Thêm lịch thiếu trường bắt buộc (course, time) -> Toast lỗi, form không submit
- [ ] Thêm lịch với endTime < startTime -> Toast lỗi "Thời gian không hợp lệ"
- [ ] Thêm lịch trùng giờ -> Cảnh báo conflict (hoặc block submit)
- [ ] Sửa lịch học -> Form load đúng dữ liệu cũ, submit cập nhật thành công
- [ ] Xóa lịch học -> Confirm dialog, xóa thành công, bảng update
- [ ] Multi-hour class (08:00-10:00) -> Cell chiếm 2 hàng, không duplicate
- [ ] Today highlight -> Cột ngày hôm nay có màu/border nổi bật
- [ ] Mobile responsive -> List view hiển thị đầy đủ, expandable sections
- [ ] Empty state -> Không có lịch, hiển thị placeholder

## Accessibility (A11y)
- Table có `<caption>` hoặc `aria-label="Thời khóa biểu tuần"`
- Header cells dùng `<th scope="col">` cho ngày, `<th scope="row">` cho giờ
- Buttons có aria-label rõ ràng (VD: "Sửa lịch học CS202 thứ 2 lúc 08:00")
- Color contrast: text trên background màu đủ tương phản (WCAG AA)
- Keyboard navigation: Tab qua cells, Enter mở modal sửa
- Focus management: Modal focus trap, Escape đóng modal

## Performance tips
- **Lazy load**: Chỉ render cells trong viewport (virtual scrolling nếu có nhiều time slots)
- **Memoize colors**: Tính toán màu background/border một lần, lưu trong useMemo
- **Debounce form validation**: Kiểm tra conflict khi user gõ xong (300ms)
- **Cache courses**: Lưu danh sách courses trong context, tránh fetch lại mỗi lần mở modal

## Advanced features (gợi ý mở rộng)

### 1. Drag & Drop
- **Tính năng**: Kéo thả buổi học để đổi ngày/giờ
- **Implementation**: React DnD hoặc dnd-kit
- **UX**: Kéo cell sang cột khác (đổi ngày) hoặc hàng khác (đổi giờ)
- **Validation**: Kiểm tra conflict sau khi drop, rollback nếu không hợp lệ

### 2. Recurring classes
- **Tình huống**: Lớp học lặp lại nhiều tuần (VD: cả học kỳ)
- **Giải pháp**: Thêm trường `recurring: true`, `startDate`, `endDate`
- **Generate**: Tự động tạo entries cho tất cả tuần trong khoảng thời gian

### 3. Export/Import
- **Export**: Xuất timetable ra PDF/PNG (screenshot) hoặc iCal format
- **Import**: Import từ file CSV/Excel (batch create)

### 4. Calendar integration
- **Tính năng**: Sync timetable với Google Calendar, Outlook
- **Implementation**: OAuth + Calendar API, tạo recurring events

### 5. Notifications
- **Tính năng**: Nhắc nhở trước giờ học (VD: 15 phút trước)
- **Implementation**: Browser notification hoặc push notification
- **Logic**: Tương tự task notifications, check time mỗi 15 phút

### 6. Multi-week view
- **Tính năng**: Xem timetable của nhiều tuần (VD: lịch học cả tháng)
- **Implementation**: Tab/dropdown chọn tuần, render multiple tables

### 7. Statistics
- **Tính năng**: Thống kê số giờ học/tuần, môn nào nhiều giờ nhất, ngày nào rảnh
- **Widget**: Biểu đồ thanh/đường cho số giờ theo ngày, theo môn

### 8. Template/Preset
- **Tính năng**: Lưu timetable hiện tại thành template, áp dụng cho học kỳ sau
- **Use case**: Môn học lặp lại mỗi kỳ, giữ nguyên lịch

## UI/UX Best Practices

### Visual hierarchy
- **Primary**: Tên môn học (font bold, màu nổi bật)
- **Secondary**: Thời gian, phòng học (font medium)
- **Tertiary**: Loại buổi học, ghi chú (font regular, màu nhạt)

### Spacing
- Padding cell: đủ rộng để dễ đọc (3-4px), không quá chật
- Gap giữa các cells: 2px border để phân biệt rõ
- Hover state: tăng shadow/scale nhẹ (105%) để feedback

### Color system
- Dùng màu từ courses (đồng nhất với Courses page)
- Opacity 20-30% cho background để không chói mắt
- Border-left đậm để highlight course color
- Tránh quá nhiều màu sắc: limit 8-10 màu trong palette

### Mobile optimization
- Touch target: buttons tối thiểu 44x44px (Apple HIG, Material Design)
- Swipe actions: swipe left để xóa, swipe right để sửa (tùy chọn)
- Bottom sheet modal: thay vì center modal trên mobile

---