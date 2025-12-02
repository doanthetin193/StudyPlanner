# 📊 Study Planner - Sơ đồ Hệ thống

Tài liệu này cung cấp các sơ đồ chính của hệ thống Study Planner dưới dạng code PlantUML.

> **Hướng dẫn sử dụng**: Copy code PlantUML vào các công cụ như [PlantUML Online](https://www.plantuml.com/plantuml/uml), [PlantText](https://www.planttext.com/), hoặc extension PlantUML trong VS Code để render sơ đồ.

---

## 📑 Mục lục
1. [Sơ đồ Use Case](#1-sơ-đồ-use-case)
2. [Sơ đồ Class (ERD)](#2-sơ-đồ-class-erd)
3. [Sơ đồ Sequence - Đăng nhập](#3-sơ-đồ-sequence---đăng-nhập)
4. [Sơ đồ Sequence - CRUD Task](#4-sơ-đồ-sequence---crud-task)
5. [Sơ đồ Activity - Quản lý Task](#5-sơ-đồ-activity---quản-lý-task)
6. [Sơ đồ Luồng Dữ liệu (DFD Level 0)](#6-sơ-đồ-luồng-dữ-liệu-dfd-level-0)
7. [Sơ đồ Luồng Dữ liệu (DFD Level 1)](#7-sơ-đồ-luồng-dữ-liệu-dfd-level-1)
8. [Sơ đồ Component](#8-sơ-đồ-component)
9. [Sơ đồ Deployment](#9-sơ-đồ-deployment)

---

## 1. Sơ đồ Use Case

### 1.1 Use Case Tổng quan

```plantuml
@startuml Use Case - Study Planner

left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

' Actors
actor "Sinh viên\n(User)" as User
actor "Quản trị viên\n(Admin)" as Admin
actor "Hệ thống\nThông báo" as NotifSystem

' System boundary
rectangle "Study Planner" {
  ' Authentication
  package "Xác thực" {
    usecase "Đăng ký" as UC_Register
    usecase "Đăng nhập" as UC_Login
    usecase "Đăng xuất" as UC_Logout
    usecase "Cập nhật hồ sơ" as UC_Profile
  }
  
  ' Course Management
  package "Quản lý Khóa học" {
    usecase "Xem danh sách\nkhóa học" as UC_ViewCourses
    usecase "Thêm khóa học" as UC_AddCourse
    usecase "Sửa khóa học" as UC_EditCourse
    usecase "Xóa khóa học" as UC_DeleteCourse
  }
  
  ' Task Management
  package "Quản lý Nhiệm vụ" {
    usecase "Xem danh sách\nnhiệm vụ" as UC_ViewTasks
    usecase "Thêm nhiệm vụ" as UC_AddTask
    usecase "Sửa nhiệm vụ" as UC_EditTask
    usecase "Xóa nhiệm vụ" as UC_DeleteTask
    usecase "Đánh dấu\nhoàn thành" as UC_CompleteTask
    usecase "Lọc nhiệm vụ" as UC_FilterTasks
  }
  
  ' Timetable Management
  package "Quản lý Thời khóa biểu" {
    usecase "Xem thời khóa biểu" as UC_ViewTimetable
    usecase "Thêm lịch học" as UC_AddClass
    usecase "Sửa lịch học" as UC_EditClass
    usecase "Xóa lịch học" as UC_DeleteClass
  }
  
  ' Dashboard & Notifications
  package "Dashboard & Thông báo" {
    usecase "Xem Dashboard" as UC_Dashboard
    usecase "Nhận thông báo\nnhiệm vụ sắp hạn" as UC_Notification
    usecase "Bật/Tắt\nthông báo" as UC_ToggleNotif
  }
  
  ' Admin Functions
  package "Quản trị hệ thống" <<Admin>> {
    usecase "Xem thống kê\nhệ thống" as UC_AdminStats
    usecase "Quản lý người dùng" as UC_ManageUsers
    usecase "Xóa người dùng" as UC_DeleteUser
    usecase "Thay đổi quyền\nngười dùng" as UC_ChangeRole
  }
}

' User relationships
User --> UC_Register
User --> UC_Login
User --> UC_Logout
User --> UC_Profile

User --> UC_ViewCourses
User --> UC_AddCourse
User --> UC_EditCourse
User --> UC_DeleteCourse

User --> UC_ViewTasks
User --> UC_AddTask
User --> UC_EditTask
User --> UC_DeleteTask
User --> UC_CompleteTask
User --> UC_FilterTasks

User --> UC_ViewTimetable
User --> UC_AddClass
User --> UC_EditClass
User --> UC_DeleteClass

User --> UC_Dashboard
User --> UC_ToggleNotif

' Admin relationships (Admin extends User)
Admin --|> User
Admin --> UC_AdminStats
Admin --> UC_ManageUsers
Admin --> UC_DeleteUser
Admin --> UC_ChangeRole

' System relationships
NotifSystem --> UC_Notification

' Includes and Extends
UC_AddTask ..> UC_ViewCourses : <<include>>
UC_AddClass ..> UC_ViewCourses : <<include>>
UC_Notification ..> UC_ViewTasks : <<include>>

@enduml
```

### 1.2 Use Case Chi tiết - Quản lý Nhiệm vụ

```plantuml
@startuml Use Case - Task Management Detail

left to right direction
skinparam actorStyle awesome

actor "Sinh viên" as User

rectangle "Quản lý Nhiệm vụ" {
  usecase "Xem danh sách nhiệm vụ" as UC_View
  usecase "Thêm nhiệm vụ mới" as UC_Add
  usecase "Sửa nhiệm vụ" as UC_Edit
  usecase "Xóa nhiệm vụ" as UC_Delete
  usecase "Đánh dấu hoàn thành" as UC_Complete
  usecase "Lọc theo trạng thái" as UC_FilterStatus
  usecase "Lọc theo ưu tiên" as UC_FilterPriority
  usecase "Lọc theo môn học" as UC_FilterCourse
  usecase "Sắp xếp theo hạn" as UC_SortDue
  usecase "Chọn môn học" as UC_SelectCourse
  usecase "Chọn loại nhiệm vụ" as UC_SelectType
  usecase "Đặt mức ưu tiên" as UC_SetPriority
  usecase "Đặt hạn hoàn thành" as UC_SetDueDate
  usecase "Xác nhận xóa" as UC_ConfirmDelete
}

User --> UC_View
User --> UC_Add
User --> UC_Edit
User --> UC_Delete
User --> UC_Complete
User --> UC_FilterStatus
User --> UC_FilterPriority
User --> UC_FilterCourse
User --> UC_SortDue

UC_Add ..> UC_SelectCourse : <<include>>
UC_Add ..> UC_SelectType : <<include>>
UC_Add ..> UC_SetPriority : <<include>>
UC_Add ..> UC_SetDueDate : <<include>>

UC_Edit ..> UC_SelectCourse : <<include>>
UC_Edit ..> UC_SelectType : <<include>>
UC_Edit ..> UC_SetPriority : <<include>>
UC_Edit ..> UC_SetDueDate : <<include>>

UC_Delete ..> UC_ConfirmDelete : <<include>>

@enduml
```

---

## 2. Sơ đồ Class (ERD)

### 2.1 Entity Relationship Diagram

```plantuml
@startuml ERD - Study Planner

skinparam linetype ortho
skinparam classAttributeIconSize 0

entity "User" as User {
  * _id : ObjectId <<PK>>
  --
  * name : String
  * email : String <<unique>>
  * password : String
  studentId : String
  major : String
  semester : String
  avatar : String
  * role : Enum ['user', 'admin']
  preferences : Object
  --
  * createdAt : Date
  * updatedAt : Date
}

entity "Course" as Course {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * name : String
  * code : String
  * credits : Number
  instructor : String
  room : String
  color : String
  description : String
  semester : String
  year : Number
  --
  * createdAt : Date
  * updatedAt : Date
}

entity "Task" as Task {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * course : ObjectId <<FK>>
  * title : String
  description : String
  * type : Enum
  * dueDate : Date
  * priority : Enum
  * status : Enum
  estimatedTime : Number
  completedAt : Date
  notes : String
  remindBefore : Number
  --
  * createdAt : Date
  * updatedAt : Date
}

entity "Timetable" as Timetable {
  * _id : ObjectId <<PK>>
  --
  * user : ObjectId <<FK>>
  * course : ObjectId <<FK>>
  * dayOfWeek : Number [0-6]
  * startTime : String
  * endTime : String
  room : String
  * type : Enum
  notes : String
  isRecurring : Boolean
  semester : String
  --
  * createdAt : Date
  * updatedAt : Date
}

' Relationships
User ||--o{ Course : "owns"
User ||--o{ Task : "owns"
User ||--o{ Timetable : "owns"
Course ||--o{ Task : "has"
Course ||--o{ Timetable : "has"

@enduml
```

### 2.2 Class Diagram Chi tiết

```plantuml
@startuml Class Diagram - Models

skinparam classAttributeIconSize 0

class User {
  -_id: ObjectId
  -name: String
  -email: String
  -password: String
  -studentId: String
  -major: String
  -semester: String
  -avatar: String
  -role: String
  -preferences: Object
  -createdAt: Date
  -updatedAt: Date
  --
  +matchPassword(password): Boolean
  +generateToken(): String
}

class Course {
  -_id: ObjectId
  -user: ObjectId
  -name: String
  -code: String
  -credits: Number
  -instructor: String
  -room: String
  -color: String
  -description: String
  -semester: String
  -year: Number
  --
}

class Task {
  -_id: ObjectId
  -user: ObjectId
  -course: ObjectId
  -title: String
  -description: String
  -type: TaskType
  -dueDate: Date
  -priority: Priority
  -status: Status
  -estimatedTime: Number
  -completedAt: Date
  -notes: String
  -remindBefore: Number
  --
  +isOverdue(): Boolean
  +markComplete(): void
}

class Timetable {
  -_id: ObjectId
  -user: ObjectId
  -course: ObjectId
  -dayOfWeek: Number
  -startTime: String
  -endTime: String
  -room: String
  -type: ClassType
  -notes: String
  -isRecurring: Boolean
  --
  +getDuration(): Number
}

enum TaskType {
  assignment
  exam
  project
  reading
  review
  other
}

enum Priority {
  low
  medium
  high
  urgent
}

enum Status {
  todo
  in-progress
  completed
  overdue
}

enum ClassType {
  lecture
  lab
  tutorial
  seminar
}

enum Role {
  user
  admin
}

User "1" --> "*" Course
User "1" --> "*" Task
User "1" --> "*" Timetable
Course "1" --> "*" Task
Course "1" --> "*" Timetable

Task --> TaskType
Task --> Priority
Task --> Status
Timetable --> ClassType
User --> Role

@enduml
```

---

## 3. Sơ đồ Sequence - Đăng nhập

```plantuml
@startuml Sequence - Login Flow

skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "User" as User
participant "React\nFrontend" as FE
participant "Axios\nInterceptor" as Axios
participant "Express\nBackend" as BE
participant "Auth\nController" as Auth
database "MongoDB" as DB

title Sequence Diagram - Đăng nhập

User -> FE: Nhập email, password
activate FE

FE -> FE: Validate form
FE -> Axios: POST /api/auth/login
activate Axios

Axios -> BE: HTTP Request
activate BE

BE -> Auth: login(req, res)
activate Auth

Auth -> DB: User.findOne({ email })
activate DB
DB --> Auth: user document
deactivate DB

alt User không tồn tại
  Auth --> BE: 401 Unauthorized
  BE --> Axios: Error Response
  Axios --> FE: Error
  FE --> User: Toast "Email không tồn tại"
else User tồn tại
  Auth -> Auth: bcrypt.compare(password, user.password)
  
  alt Password sai
    Auth --> BE: 401 Unauthorized
    BE --> Axios: Error Response
    Axios --> FE: Error
    FE --> User: Toast "Mật khẩu không đúng"
  else Password đúng
    Auth -> Auth: jwt.sign({ id: user._id })
    Auth --> BE: { token, user data }
    deactivate Auth
    
    BE --> Axios: 200 OK + JSON
    deactivate BE
    
    Axios -> Axios: Store token in localStorage
    Axios --> FE: Response data
    deactivate Axios
    
    FE -> FE: setUser(data)
    FE -> FE: Navigate to /dashboard
    FE --> User: Dashboard page
    deactivate FE
  end
end

@enduml
```

---

## 4. Sơ đồ Sequence - CRUD Task

```plantuml
@startuml Sequence - CRUD Task

skinparam sequenceMessageAlign center

actor "User" as User
participant "Tasks Page\n(React)" as Page
participant "API Service\n(Axios)" as API
participant "Auth\nMiddleware" as AuthMW
participant "Task\nController" as Ctrl
database "MongoDB" as DB

title Sequence Diagram - CRUD Nhiệm vụ

== Xem danh sách Tasks ==
User -> Page: Truy cập /tasks
activate Page
Page -> API: taskAPI.getAll()
activate API
API -> AuthMW: GET /api/tasks + Token
activate AuthMW
AuthMW -> AuthMW: Verify JWT
AuthMW -> Ctrl: next()
activate Ctrl
Ctrl -> DB: Task.find({ user: req.user._id })
activate DB
DB --> Ctrl: tasks[]
deactivate DB
Ctrl --> API: 200 + tasks
deactivate Ctrl
deactivate AuthMW
API --> Page: tasks[]
deactivate API
Page --> User: Hiển thị danh sách
deactivate Page

== Thêm Task mới ==
User -> Page: Click "Thêm nhiệm vụ"
activate Page
Page -> Page: Mở Modal form
User -> Page: Điền form + Submit
Page -> API: taskAPI.create(formData)
activate API
API -> AuthMW: POST /api/tasks
activate AuthMW
AuthMW -> Ctrl: next()
activate Ctrl
Ctrl -> Ctrl: Validate input
Ctrl -> DB: Task.create(data)
activate DB
DB --> Ctrl: new task
deactivate DB
Ctrl --> API: 201 + task
deactivate Ctrl
deactivate AuthMW
API --> Page: task
deactivate API
Page -> Page: Đóng modal, refresh list
Page --> User: Toast "Thành công"
deactivate Page

== Cập nhật Task ==
User -> Page: Click "Sửa" trên task
activate Page
Page -> Page: Mở Modal với data
User -> Page: Sửa + Submit
Page -> API: taskAPI.update(id, data)
activate API
API -> AuthMW: PUT /api/tasks/:id
activate AuthMW
AuthMW -> Ctrl: next()
activate Ctrl
Ctrl -> DB: Task.findByIdAndUpdate()
activate DB
DB --> Ctrl: updated task
deactivate DB
Ctrl --> API: 200 + task
deactivate Ctrl
deactivate AuthMW
API --> Page: task
deactivate API
Page --> User: Toast + Refresh list
deactivate Page

== Xóa Task ==
User -> Page: Click "Xóa"
activate Page
Page -> Page: Confirm dialog
User -> Page: Xác nhận xóa
Page -> API: taskAPI.delete(id)
activate API
API -> AuthMW: DELETE /api/tasks/:id
activate AuthMW
AuthMW -> Ctrl: next()
activate Ctrl
Ctrl -> DB: Task.findByIdAndDelete()
activate DB
DB --> Ctrl: deleted
deactivate DB
Ctrl --> API: 200 + message
deactivate Ctrl
deactivate AuthMW
API --> Page: success
deactivate API
Page --> User: Toast + Refresh list
deactivate Page

@enduml
```

---

## 5. Sơ đồ Activity - Quản lý Task

### 5.1 Activity - Tạo Task mới

```plantuml
@startuml Activity - Create Task

start

:User click "Thêm nhiệm vụ";

:Mở form modal;

:Chọn môn học từ dropdown;

:Nhập tiêu đề nhiệm vụ;

:Chọn loại nhiệm vụ;
note right
  - Bài tập
  - Kiểm tra
  - Dự án
  - Đọc tài liệu
  - Ôn tập
  - Khác
end note

:Chọn mức ưu tiên;
note right
  - Thấp
  - Trung bình
  - Cao
  - Khẩn cấp
end note

:Chọn hạn hoàn thành;

:Nhập mô tả (tùy chọn);

:Click "Lưu";

if (Form hợp lệ?) then (không)
  :Hiển thị lỗi validation;
  :Quay lại chỉnh sửa;
  backward :Sửa form;
else (có)
  :Gửi request POST /api/tasks;
  
  if (API thành công?) then (có)
    :Đóng modal;
    :Refresh danh sách;
    :Hiển thị toast "Thành công";
  else (không)
    :Hiển thị toast lỗi;
  endif
endif

stop

@enduml
```

### 5.2 Activity - Đánh dấu hoàn thành Task

```plantuml
@startuml Activity - Complete Task

start

:User xem danh sách tasks;

:Click checkbox hoặc nút\n"Đánh dấu hoàn thành";

:Gửi request PUT /api/tasks/:id;
note right
  {
    status: "completed",
    completedAt: new Date()
  }
end note

if (API thành công?) then (có)
  :Cập nhật UI;
  :Di chuyển task sang\nmục "Hoàn thành";
  :Cập nhật thống kê Dashboard;
  :Hiển thị toast "Đã hoàn thành!";
else (không)
  :Giữ nguyên trạng thái;
  :Hiển thị toast lỗi;
endif

stop

@enduml
```

### 5.3 Activity - Luồng Thông báo Task

```plantuml
@startuml Activity - Task Notification

|User|
start
:Đăng nhập vào app;

|System|
:Load danh sách tasks;

:Kiểm tra tasks có dueDate;

while (Có task sắp đến hạn?) is (có)
  :Lấy task gần nhất;
  
  if (Trong 24h?) then (có)
    if (Browser notification enabled?) then (có)
      :Gửi browser notification;
      note right
        "Task [title] sắp đến hạn
        trong [x] giờ nữa"
      end note
    else (không)
      :Hiển thị banner trong app;
    endif
  else (không)
    :Không làm gì;
  endif
endwhile (không)

|User|
if (Nhận được thông báo?) then (có)
  :Click vào thông báo;
  
  |System|
  :Điều hướng đến trang Tasks;
  :Highlight task tương ứng;
endif

stop

@enduml
```

---

## 6. Sơ đồ Luồng Dữ liệu (DFD Level 0)

```plantuml
@startuml DFD Level 0 - Context Diagram

!define ENTITY_COLOR #E8F5E9
!define PROCESS_COLOR #E3F2FD
!define DATASTORE_COLOR #FFF3E0

skinparam rectangle {
  BackgroundColor PROCESS_COLOR
  RoundCorner 25
}

' External Entities
actor "Sinh viên\n(User)" as User #E8F5E9
actor "Quản trị viên\n(Admin)" as Admin #E8F5E9
cloud "Browser\nNotification API" as Notif #F3E5F5

' Main Process
rectangle "Hệ thống\nStudy Planner" as System #E3F2FD

' Data flows
User --> System : Thông tin đăng ký/đăng nhập
User --> System : Dữ liệu khóa học
User --> System : Dữ liệu nhiệm vụ
User --> System : Dữ liệu thời khóa biểu

System --> User : Xác nhận đăng nhập
System --> User : Danh sách khóa học
System --> User : Danh sách nhiệm vụ
System --> User : Thời khóa biểu
System --> User : Thống kê Dashboard

Admin --> System : Yêu cầu quản lý users
System --> Admin : Danh sách users
System --> Admin : Thống kê hệ thống

System --> Notif : Gửi thông báo
Notif --> User : Push notification

@enduml
```

---

## 7. Sơ đồ Luồng Dữ liệu (DFD Level 1)

```plantuml
@startuml DFD Level 1

left to right direction

' External Entities
actor "User" as User
actor "Admin" as Admin

' Processes (circles)
usecase "1.0\nXác thực" as P1
usecase "2.0\nQuản lý\nKhóa học" as P2
usecase "3.0\nQuản lý\nNhiệm vụ" as P3
usecase "4.0\nQuản lý\nThời khóa biểu" as P4
usecase "5.0\nDashboard &\nThống kê" as P5
usecase "6.0\nQuản trị\nHệ thống" as P6
usecase "7.0\nThông báo" as P7

' Data Stores
database "D1: Users" as D1
database "D2: Courses" as D2
database "D3: Tasks" as D3
database "D4: Timetable" as D4

' User flows
User --> P1 : credentials
P1 --> User : token, user info
P1 --> D1 : verify/create user
D1 --> P1 : user data

User --> P2 : course data
P2 --> User : course list
P2 <--> D2 : CRUD courses
D2 --> P2 : courses

User --> P3 : task data
P3 --> User : task list
P3 <--> D3 : CRUD tasks
D3 --> P3 : tasks
P3 --> D2 : get course info

User --> P4 : schedule data
P4 --> User : timetable
P4 <--> D4 : CRUD entries
D4 --> P4 : schedule
P4 --> D2 : get course info

User --> P5 : request stats
P5 --> User : dashboard data
D2 --> P5 : course count
D3 --> P5 : task stats
D4 --> P5 : schedule

D3 --> P7 : upcoming tasks
P7 --> User : notifications

' Admin flows
Admin --> P6 : admin requests
P6 --> Admin : system stats, user list
D1 --> P6 : all users
D2 --> P6 : all courses
D3 --> P6 : all tasks
D4 --> P6 : all timetables
P6 --> D1 : update/delete users

@enduml
```

---

## 8. Sơ đồ Component

```plantuml
@startuml Component Diagram

skinparam componentStyle uml2
skinparam linetype ortho

package "Frontend (React)" {
  [App.jsx] as App
  [AuthContext] as AuthCtx
  [NotificationContext] as NotifCtx
  
  package "Pages" {
    [Login/Register] as AuthPages
    [Dashboard] as DashPage
    [Courses] as CoursePage
    [Tasks] as TaskPage
    [Timetable] as TimePage
    [Profile] as ProfilePage
    [Admin] as AdminPage
  }
  
  package "Components" {
    [Layout] as Layout
    [Sidebar] as Sidebar
    [Modals] as Modals
    [Cards] as Cards
  }
  
  package "Services" {
    [api.js] as ApiService
    [Axios Interceptors] as AxiosInt
  }
  
  package "Hooks" {
    [useTaskNotifications] as TaskNotifHook
  }
}

package "Backend (Express)" {
  [server.js] as Server
  
  package "Routes" {
    [authRoutes] as AuthRoutes
    [courseRoutes] as CourseRoutes
    [taskRoutes] as TaskRoutes
    [timetableRoutes] as TimeRoutes
    [adminRoutes] as AdminRoutes
  }
  
  package "Controllers" {
    [authController] as AuthCtrl
    [courseController] as CourseCtrl
    [taskController] as TaskCtrl
    [timetableController] as TimeCtrl
    [adminController] as AdminCtrl
  }
  
  package "Middleware" {
    [auth.js] as AuthMiddleware
  }
  
  package "Models" {
    [User] as UserModel
    [Course] as CourseModel
    [Task] as TaskModel
    [Timetable] as TimeModel
  }
}

database "MongoDB Atlas" as MongoDB

' Frontend internal connections
App --> AuthCtx
App --> NotifCtx
App --> Layout
Layout --> Sidebar
AuthCtx --> ApiService
Pages --> ApiService
ApiService --> AxiosInt

' Frontend to Backend
AxiosInt --> Server : HTTP/REST

' Backend internal connections
Server --> AuthRoutes
Server --> CourseRoutes
Server --> TaskRoutes
Server --> TimeRoutes
Server --> AdminRoutes

AuthRoutes --> AuthMiddleware
CourseRoutes --> AuthMiddleware
TaskRoutes --> AuthMiddleware
TimeRoutes --> AuthMiddleware
AdminRoutes --> AuthMiddleware

AuthRoutes --> AuthCtrl
CourseRoutes --> CourseCtrl
TaskRoutes --> TaskCtrl
TimeRoutes --> TimeCtrl
AdminRoutes --> AdminCtrl

AuthCtrl --> UserModel
CourseCtrl --> CourseModel
TaskCtrl --> TaskModel
TimeCtrl --> TimeModel
AdminCtrl --> UserModel
AdminCtrl --> CourseModel
AdminCtrl --> TaskModel
AdminCtrl --> TimeModel

' Backend to Database
UserModel --> MongoDB
CourseModel --> MongoDB
TaskModel --> MongoDB
TimeModel --> MongoDB

@enduml
```

---

## 9. Sơ đồ Deployment

```plantuml
@startuml Deployment Diagram

skinparam nodeStyle rectangle

node "Client Browser" as Client {
  artifact "React SPA" as ReactApp {
    [HTML/CSS/JS Bundle]
    [Tailwind CSS]
    [React Router]
  }
}

node "Frontend Hosting\n(Vercel/Netlify)" as FrontendHost {
  artifact "Static Files" as Static
  artifact "Vite Build Output" as ViteBuild
}

node "Backend Server\n(Railway/Render/Heroku)" as BackendHost {
  artifact "Node.js Runtime" as NodeRuntime {
    [Express Server]
    [Mongoose ODM]
    [JWT Auth]
    [bcryptjs]
  }
}

cloud "MongoDB Atlas" as MongoDB {
  database "study-planner-db" as DB {
    [users collection]
    [courses collection]
    [tasks collection]
    [timetables collection]
  }
}

cloud "External Services" {
  [Browser Notification API] as NotifAPI
}

' Connections
Client --> FrontendHost : HTTPS (CDN)
FrontendHost --> Static
Static --> ViteBuild

Client --> BackendHost : REST API (HTTPS)
Client --> NotifAPI : Push Notifications

BackendHost --> MongoDB : MongoDB Protocol\n(TLS/SSL)
BackendHost --> NodeRuntime

' Environment vars
note right of BackendHost
  Environment Variables:
  - MONGODB_URI
  - JWT_SECRET
  - PORT
  - NODE_ENV
end note

note right of FrontendHost
  Environment Variables:
  - VITE_API_URL
end note

@enduml
```

---

## 10. Sơ đồ State - Task Status

```plantuml
@startuml State Diagram - Task Status

[*] --> Todo : Tạo task mới

state Todo {
  [*] --> Pending
  Pending : Chưa bắt đầu
  Pending : status = 'todo'
}

state InProgress {
  [*] --> Working
  Working : Đang thực hiện
  Working : status = 'in-progress'
}

state Completed {
  [*] --> Done
  Done : Đã hoàn thành
  Done : status = 'completed'
  Done : completedAt = Date
}

state Overdue {
  [*] --> Late
  Late : Quá hạn
  Late : status = 'overdue'
  Late : dueDate < now
}

Todo --> InProgress : Bắt đầu làm
Todo --> Completed : Hoàn thành ngay
Todo --> Overdue : Hết hạn (tự động)

InProgress --> Completed : Hoàn thành
InProgress --> Todo : Tạm dừng
InProgress --> Overdue : Hết hạn (tự động)

Overdue --> Completed : Hoàn thành muộn
Overdue --> InProgress : Tiếp tục làm

Completed --> [*] : Xóa task

note right of Overdue
  System tự động chuyển
  khi currentDate > dueDate
  và status != 'completed'
end note

@enduml
```

---

## 11. Sơ đồ Sequence - Admin Delete User (Cascade)

```plantuml
@startuml Sequence - Admin Delete User

actor "Admin" as Admin
participant "Admin Page\n(React)" as Page
participant "adminAPI" as API
participant "Admin\nMiddleware" as MW
participant "Admin\nController" as Ctrl
database "MongoDB" as DB

title Admin xóa User (Cascade Delete)

Admin -> Page: Click "Xóa" user
activate Page

Page -> Page: window.confirm(\n"Xác nhận xóa user?")

alt User xác nhận
  Page -> API: adminAPI.deleteUser(userId)
  activate API
  
  API -> MW: DELETE /api/admin/users/:id
  activate MW
  
  MW -> MW: Verify JWT token
  MW -> MW: Check role === 'admin'
  
  alt Không phải admin
    MW --> API: 403 Forbidden
    API --> Page: Error
    Page --> Admin: Toast "Không có quyền"
  else Là admin
    MW -> Ctrl: next()
    activate Ctrl
    
    Ctrl -> Ctrl: Check self-deletion
    
    alt Xóa chính mình
      Ctrl --> API: 400 Bad Request
      API --> Page: Error
      Page --> Admin: Toast "Không thể xóa chính mình"
    else Xóa user khác
      Ctrl -> DB: User.findById(userId)
      activate DB
      DB --> Ctrl: user
      
      alt User không tồn tại
        Ctrl --> API: 404 Not Found
        API --> Page: Error
        Page --> Admin: Toast "User không tồn tại"
      else User tồn tại
        note over Ctrl, DB: Cascade Delete
        Ctrl -> DB: Course.deleteMany({ user: userId })
        DB --> Ctrl: deleted courses
        
        Ctrl -> DB: Task.deleteMany({ user: userId })
        DB --> Ctrl: deleted tasks
        
        Ctrl -> DB: Timetable.deleteMany({ user: userId })
        DB --> Ctrl: deleted timetables
        
        Ctrl -> DB: User.findByIdAndDelete(userId)
        DB --> Ctrl: deleted user
        deactivate DB
        
        Ctrl --> API: 200 + success message
        deactivate Ctrl
        
        API --> Page: Success
        deactivate API
        
        Page -> Page: Refresh user list
        Page -> Page: Refresh stats
        Page --> Admin: Toast "Đã xóa user thành công"
      end
    end
  end
  deactivate MW
else User hủy
  Page --> Admin: Không làm gì
end

deactivate Page

@enduml
```

---

## 📌 Ghi chú

### Công cụ render PlantUML:
1. **Online**: 
   - https://www.plantuml.com/plantuml/uml
   - https://www.planttext.com/
   - https://kroki.io/

2. **VS Code Extension**: 
   - PlantUML (jebbs.plantuml)
   - Cần cài Java và Graphviz

3. **IDE Integration**:
   - IntelliJ IDEA PlantUML plugin
   - Eclipse PlantUML plugin

### Cách sử dụng:
1. Copy đoạn code PlantUML (bao gồm `@startuml` và `@enduml`)
2. Paste vào công cụ render
3. Export ra PNG, SVG hoặc PDF

### Tùy chỉnh:
- Thay đổi `skinparam` để điều chỉnh màu sắc, font
- Thêm `scale` để điều chỉnh kích thước
- Sử dụng `!theme` để áp dụng theme có sẵn

---

**Tổng kết**: File này chứa 11 sơ đồ chính mô tả hệ thống Study Planner:
- 2 Use Case diagrams
- 2 Class/ERD diagrams  
- 3 Sequence diagrams
- 3 Activity diagrams
- 2 DFD diagrams
- 1 Component diagram
- 1 Deployment diagram
- 1 State diagram
