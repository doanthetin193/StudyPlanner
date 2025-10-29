# Courses (Môn học) — Chi tiết chức năng

Trang Courses cho phép người dùng quản lý toàn bộ các môn học (courses) đang theo học, bao gồm thêm mới, sửa, xóa và hiển thị chi tiết từng môn học.

## Mục tiêu
- Quản lý danh sách môn học (CRUD): tạo, sửa, xóa, liệt kê.
- Lưu trữ thông tin chi tiết: tên môn, mã môn, giảng viên, phòng học, số tín chỉ, học kỳ, năm học, mô tả.
- Gắn màu sắc cho từng môn học để phân biệt trong calendar/timetable.
- Cung cấp UI cards đẹp mắt với gradient, icon/emoji, dễ nhìn và tương tác.

## Thành phần UI chính

### 1. Course List (Danh sách môn học)
- **Hiển thị**: Grid layout (responsive: 1 cột trên mobile, 2-3 cột trên tablet/desktop).
- **Course Card** bao gồm:
  - **Header**: Icon 📚 + Tên môn (font bold) + Mã môn (font mono nhỏ)
  - **Color indicator**: Thanh màu gradient phía trên hoặc border màu tùy `course.color` (lấy từ `COURSE_COLORS` constant)
  - **Action buttons**: Sửa (✏️ Sửa), Xóa (🗑️ Xóa)
  - **Details section**:
    - 📘 Số tín chỉ (credits): badge màu tím
    - 👨‍🏫 Giảng viên (instructor): text màu xanh
    - 🚪 Phòng học (room): text màu cam
    - 🗓️ Học kỳ (semester): badge gradient xanh lá (VD: "HK1 2025-2026")
  - **Description** (nếu có): text xám nhẹ, line-clamp-2 để không quá dài
- **Empty state**: Khi chưa có môn học, hiển thị placeholder với icon + text khuyến khích thêm môn học đầu tiên.

### 2. Add/Edit Course Modal
- **Trigger**: Nút "➕ Thêm môn học" (floating button hoặc top bar) -> mở modal.
- **Form fields**:
  - **Tên môn học** (`name`): text input, bắt buộc
  - **Mã môn** (`code`): text input, bắt buộc, unique (kiểm tra backend)
  - **Số tín chỉ** (`credits`): number input, mặc định = 3, min = 1, max = 6
  - **Giảng viên** (`instructor`): text input, tùy chọn
  - **Phòng học** (`room`): text input, tùy chọn
  - **Màu sắc** (`color`): color picker hoặc dropdown chọn từ `COURSE_COLORS` (để phân biệt trong lịch)
  - **Mô tả** (`description`): textarea, tùy chọn
  - **Học kỳ** (`semester`): dropdown hoặc input (VD: "HK1", "HK2", "HK3")
  - **Năm học** (`year`): number input, mặc định = năm hiện tại
- **Validation**:
  - `name`, `code` không được để trống
  - `credits` phải là số nguyên dương (1–6)
  - `code` không trùng với course đã tồn tại (backend response 400 nếu duplicate)
- **Hành vi submit**:
  - Nếu **thêm mới**: gọi `POST /api/courses`
  - Nếu **chỉnh sửa**: gọi `PUT /api/courses/:id`
  - Sau khi submit thành công: đóng modal, refresh danh sách, hiển thị toast "Thêm/Cập nhật môn học thành công!"
  - Nếu lỗi: hiển thị toast lỗi, giữ modal mở để người dùng sửa
- **Cancel**: Đóng modal, reset form (clear inputs)

### 3. Delete Course
- **Trigger**: Nút "Xóa" trên course card -> hiện confirm dialog "Bạn có chắc muốn xóa môn học '{name}'?"
- **API call**: `DELETE /api/courses/:id`
- **Hành vi**:
  - Nếu người dùng confirm: gọi API, xóa khỏi danh sách, toast "Đã xóa môn học"
  - Nếu cancel: không làm gì
- **Edge case**: Nếu môn học đang được dùng trong tasks/timetable, backend có thể trả lỗi (cần xử lý cascade delete hoặc cảnh báo người dùng).

### 4. Search & Filter (nếu có)
- **Search bar**: Tìm kiếm theo tên môn hoặc mã môn (client-side filter hoặc server-side query param `?search=`).
- **Filter by semester**: Dropdown chọn học kỳ -> chỉ hiển thị môn học thuộc kỳ đó.
- **Sort**: Sắp xếp theo tên (A-Z), mã môn, hoặc thời gian tạo.

## Dữ liệu & API

### Endpoints
- `GET /api/courses` — Lấy danh sách tất cả môn học của user
- `POST /api/courses` — Tạo môn học mới
- `PUT /api/courses/:id` — Cập nhật thông tin môn học
- `DELETE /api/courses/:id` — Xóa môn học

### Data model (Course)
```json
{
  "_id": "64abc...",
  "userId": "64xyz...",
  "name": "Cấu trúc dữ liệu và giải thuật",
  "code": "CS202",
  "credits": 4,
  "instructor": "Nguyễn Văn A",
  "room": "A101",
  "color": "#3b82f6",
  "description": "Học về cây, đồ thị, thuật toán tìm kiếm, sắp xếp...",
  "semester": "HK1 2025-2026",
  "year": 2025,
  "createdAt": "2025-10-01T...",
  "updatedAt": "2025-10-15T..."
}
```

### Validation rules (backend)
- `name`: required, string, max 200 chars
- `code`: required, unique per user, string, max 20 chars, uppercase recommended
- `credits`: required, integer, min 1, max 6
- `instructor`, `room`, `description`: optional strings
- `color`: optional, hex color (default từ `COURSE_COLORS[0]`)
- `semester`: optional string (VD: "HK1", "HK2")
- `year`: optional integer (default = năm hiện tại)

## Hành vi tương tác (UX)

### Loading states
- Khi tải danh sách courses lần đầu: hiển thị skeleton cards (3-4 cards giả với shimmer effect).
- Khi submit form: disable button, show spinner hoặc text "Đang lưu..."

### Error handling
- **Network error**: Toast "Không thể kết nối đến server. Vui lòng thử lại."
- **Duplicate code**: Toast "Mã môn đã tồn tại. Vui lòng chọn mã khác."
- **Validation error**: Highlight trường lỗi màu đỏ + message dưới input (VD: "Tên môn học không được để trống")

### Optimistic UI
- Khi xóa course: tạm ẩn card ngay lập tức, nếu API lỗi thì rollback và toast lỗi.
- Khi thêm course: có thể tạm thêm vào danh sách với `_id` tạm, sau khi server trả về thì update `_id` thật.

### Semester display
- **Hiện tại**: Semester được hiển thị dạng badge "🗓️ HK1 2025-2026" (không thêm năm dư thừa).
- **Công thức**: `semester` (VD: "HK1") + `year` (VD: 2025) + năm kế tiếp (2026).
- **Edge case**: Nếu `semester` rỗng hoặc `year` không hợp lệ, không hiển thị badge semester.

## Color system (COURSE_COLORS)
- Định nghĩa trong `frontend/src/utils/constants.js`:
  ```js
  export const COURSE_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316'  // orange
  ];
  ```
- Mỗi course chọn 1 màu từ danh sách này (hoặc custom color picker).
- Màu này được dùng để:
  - Tô border/header của course card
  - Gắn màu cho events trong timetable/calendar
  - Phân biệt các môn học dễ dàng

## Edge cases & Troubleshooting

### 1. Duplicate course code
- **Tình huống**: User thêm 2 môn có cùng `code` (VD: "CS101").
- **Giải pháp**: Backend kiểm tra unique constraint, trả lỗi 400. Frontend toast "Mã môn đã tồn tại."
- **UX**: Giữ modal mở, focus vào trường `code` để người dùng sửa.

### 2. Course đang được dùng trong Tasks/Timetable
- **Tình huống**: User xóa course nhưng có tasks hoặc timetable entries liên kết.
- **Giải pháp**:
  - Option 1: Backend cascade delete (xóa luôn tasks/timetable liên quan) — **rủi ro mất dữ liệu**.
  - Option 2: Backend trả lỗi 400 "Môn học đang được sử dụng, không thể xóa" — **an toàn hơn**.
  - Frontend: Toast cảnh báo + link tới trang Tasks/Timetable để user dọn dẹp trước.

### 3. Semester/Year không hợp lệ
- **Tình huống**: User nhập năm = 1900 hoặc semester = "ABC123".
- **Giải pháp**: Frontend validation: năm từ 2000–2100, semester từ list cố định (HK1, HK2, HK3) hoặc regex pattern.

### 4. Màu sắc không hiển thị đúng
- **Tình huống**: `course.color` = null hoặc invalid hex.
- **Giải pháp**: Frontend fallback về `COURSE_COLORS[0]`, backend default `color` khi tạo course.

## Kiểm thử (Testing checklist)
- [ ] Thêm course mới với đầy đủ thông tin -> Kiểm tra hiển thị card đúng, màu sắc đúng.
- [ ] Thêm course thiếu trường bắt buộc (`name` hoặc `code`) -> Toast lỗi, modal không đóng.
- [ ] Thêm course trùng `code` -> Toast "Mã môn đã tồn tại".
- [ ] Sửa course -> Form load đúng dữ liệu cũ, submit cập nhật thành công.
- [ ] Xóa course -> Confirm dialog xuất hiện, xóa thành công, danh sách update.
- [ ] Empty state -> Không có course, hiển thị placeholder.
- [ ] Mobile responsive -> Cards xếp 1 cột, modal hiển thị đầy đủ trên màn hình nhỏ.
- [ ] Search/filter (nếu có) -> Tìm đúng môn học, lọc đúng học kỳ.

## Accessibility (A11y)
- Form inputs có `<label>` rõ ràng, liên kết với `htmlFor`.
- Buttons có aria-label (VD: "Thêm môn học", "Sửa {courseName}").
- Modal có focus trap: khi mở, focus vào input đầu tiên; khi đóng, focus về nút trigger.
- Color contrast: text trên background gradient đủ tương phản (WCAG AA).
- Keyboard navigation: Tab qua các card, Enter để mở modal sửa, Escape để đóng modal.

## Performance tips
- **Pagination/Virtual scroll**: Nếu user có > 50 môn học, cân nhắc phân trang hoặc infinite scroll.
- **Debounce search**: Nếu search gọi API, debounce input 300ms để giảm số request.
- **Caching**: Lưu danh sách courses trong context/state, chỉ refetch khi cần thiết (sau add/edit/delete).

## Gợi ý mở rộng
- **Import/Export**: Cho phép user import danh sách môn học từ CSV/Excel.
- **Duplicate course**: Nút "Nhân bản" để copy course sang học kỳ khác.
- **Archive courses**: Thay vì xóa, đánh dấu course là "archived" (ẩn khỏi danh sách chính nhưng vẫn giữ lại).
- **Course statistics**: Số lượng tasks, số buổi học liên quan đến course này.
- **Tags/Categories**: Gắn tag cho môn học (VD: "Cơ sở ngành", "Chuyên ngành", "Tự chọn").

---