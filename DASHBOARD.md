# Dashboard — Tổng quan trang

Tập trung mô tả chi tiết tất cả các chức năng nhỏ (micro-features) xuất hiện trong trang Dashboard để người đọc nắm rõ hành vi, dữ liệu và các API liên quan.

## Mục tiêu
- Cung cấp cái nhìn tổng quan nhanh về trạng thái học tập của người dùng.
- Hiển thị các mục cần chú ý: nhiệm vụ sắp đến hạn, lớp học hôm nay, thống kê nhanh.
- Cung cấp hành động nhanh (quick actions) để tạo task, vào course, mở timetable.

## Thành phần UI chính
1. Hero / Summary bar
   - Nội dung: số lượng khóa học đang theo học, tổng số nhiệm vụ, nhiệm vụ sắp đến hạn trong 24h.
   - Kiểu hiển thị: card nhỏ với gradient nền, icon/emoji, giá trị số lớn và mô tả ngắn.
   - Dữ liệu: lấy từ API `/api/courses` (đếm), `/api/tasks?status!=completed` (lọc nhiệm vụ chưa hoàn thành và sắp hạn).
   - Edge cases: nếu không có dữ liệu, hiển thị 0 và lời khuyên ngắn (VD: "Bạn chưa có khóa học nào — Thêm khóa học để bắt đầu").

2. Danh sách "Upcoming Tasks" (Nhiệm vụ sắp đến)
   - Mô tả: liệt kê các task sắp tới theo thứ tự thời gian (hoặc ưu tiên nếu cùng giờ).
   - Trường hiển thị: tiêu đề task, course liên kết (nếu có), dueDate (ngày & giờ), priority (emoji), trạng thái.
   - Tương tác: click vào task -> mở modal / điều hướng đến trang task chi tiết; có checkbox để đánh dấu hoàn thành.
   - Dữ liệu: `/api/tasks?sort=dueDate&limit=5` hoặc client-side filter trên toàn bộ tasks đã tải.
   - Notifications: các task trong danh sách có thể kích hoạt notification ngay (xem hooks `useTaskNotifications`).
   - Edge cases: nếu task không có dueDate, chuyển sang nhóm "No due date"; nếu có quá nhiều task cùng thời gian, hiện số lượng tiếp theo.

3. Quick Actions (Hành động nhanh)
   - Nút: "Tạo Task mới", "Thêm Khóa học", "Thêm buổi học vào Timetable".
   - Hành vi: mở form dạng modal hoặc điều hướng đến trang tương ứng.
   - Validation: form cần kiểm tra trường bắt buộc (title, dueDate nếu có yêu cầu), hiển thị lỗi rõ ràng.

4. Mini Calendar / Today Preview
   - Hiển thị: ô tóm tắt lịch của ngày hôm nay (các lớp có trong timetable, sự kiện task trong ngày).
   - Nguồn dữ liệu: `/api/timetable?day=<today>` và lọc tasks có dueDate cùng ngày.
   - Interaction: click vào một buổi học -> điều hướng đến phần Timetable hoặc mở chi tiết.
   - Edge cases: ngày không có buổi học -> hiển thị placeholder "Không có buổi học hôm nay".

5. Recent Activity / Feed
   - Nội dung: thay đổi gần đây (task tạo/hoàn thành, course thêm/sửa), hiển thị theo thời gian.
   - Dữ liệu: có thể lấy từ endpoint logs nếu backend hỗ trợ hoặc xây dựng client-side từ các responses.
   - Use cases: giúp người dùng thấy hoạt động gần nhất.

6. Widgets phụ (tuỳ cấu hình)
   - Productivity chart: biểu đồ thanh/đường cho thấy số task hoàn thành theo ngày/tuần.
   - Study streak: số ngày liên tiếp người dùng hoàn thành ít nhất 1 task.
   - Tips & Motivations: card có mẹo học tập, bài viết ngắn, emoji khích lệ.

## Dữ liệu & API liên quan
- GET `/api/courses` — lấy danh sách khóa học (dùng cho counts, liên kết course)
- GET `/api/tasks` — lấy nhiệm vụ; hỗ trợ params: `status`, `sort`, `limit`, `dueDate`
- GET `/api/timetable?day=<YYYY-MM-DD>` — lấy buổi học trong ngày
- PATCH `api/tasks/:id` — cập nhật task (ví dụ đánh dấu hoàn thành từ dashboard)

Dạng dữ liệu (ví dụ)
- Task
  ```json
  {
    "_id": "...",
    "title": "Nộp báo cáo",
    "courseId": "...",
    "dueDate": "2025-10-30T14:00:00.000Z",
    "priority": "high",
    "status": "in-progress"
  }
  ```
- Course
  ```json
  {
    "_id": "...",
    "name": "Cấu trúc dữ liệu",
    "code": "CS202",
    "semester": "HK1 2025-2026"
  }
  ```

## Hành vi tương tác (UX rules)
- Refresh dữ liệu: Dashboard chủ yếu cập nhật khi trang được truy xuất lần đầu và khi có hành động (tạo task, hoàn thành task). Có thể có background polling mỗi 30 phút để cập nhật thông báo (tùy cấu hình).
- Optimistic UI: Khi người dùng đánh dấu task hoàn thành từ dashboard, sử dụng optimistic update (tạm ẩn task hoặc gạch ngang) và rollback khi server trả lỗi.
- Loading states: Sử dụng skeleton cards cho hero/statistics và spinner cho các widget khi dữ liệu đang tải.
- Error states: Hiển thị thông báo toast khi gọi API lỗi; offer retry button cho widget quan trọng (VD: tải lịch hôm nay).

## Quy tắc hiển thị & Priority
- Các task sắp hết hạn trong 24 giờ được highlight màu cam/đỏ nhẹ.
- Task có priority = 'urgent' (🔥) luôn xuất hiện trên cùng trong Upcoming Tasks.
- Nếu người dùng có > 10 nhiệm vụ sắp đến, chỉ hiển thị 5 nhiệm vụ đầu và một dòng "+X còn lại" dẫn tới trang Tasks.

## Kiểm thử (Testing checklist)
- [ ] Khi không có course/task, Dashboard hiển thị placeholder và không lỗi.
- [ ] Tạo task mới, đảm bảo nó xuất hiện ở chỗ đúng (Upcoming nếu trong khoảng thời gian phù hợp).
- [ ] Đánh dấu task hoàn thành từ Dashboard: API gọi, UI cập nhật tức thì; rollback nếu API trả lỗi.
- [ ] Notifications: khi có task sắp hạn, kiểm tra Browser Notification hoạt động (quyền được cấp).
- [ ] Mobile responsiveness: các cards xếp theo cột, không overflow.

## Accessibility (A11y)
- Buttons có aria-label rõ ràng (VD: "Tạo task mới", "Mở chi tiết task")
- Color contrast đủ cao cho texts trên gradient cards
- Keyboard navigation: có thể tab tới các quick actions và mở modal bằng Enter/Space

## Debug & Troubleshooting
- Nếu số liệu không khớp (ví dụ count tasks khác backend): kiểm tra query params (status filter) và thời gian (timezone). Backend lưu UTC, frontend hiển thị theo locale.
- Nếu notification không xuất hiện: kiểm tra quyền trình duyệt và console logs của `useTaskNotifications`.
- Nếu calendar hôm nay trống mặc dù có timetable: kiểm tra format ngày khi gọi endpoint `?day=` (YYYY-MM-DD) và timezone conversion.

## Gợi ý mở rộng
- Cho phép người dùng tuỳ chỉnh widgets hiển thị (show/hide)
- Lưu trạng thái sắp xếp/lọc trên dashboard trong localStorage
- Export quick report (PDF/CSV) cho tiến độ học tập

---