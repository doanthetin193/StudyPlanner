import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Task from '../src/models/Task.js';
import Timetable from '../src/models/Timetable.js';
import connectDB from '../src/config/database.js';

// Load env vars
dotenv.config();

const COURSE_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🗑️  Cleaning existing data...');
    
    // Delete all existing data
    await Promise.all([
      User.deleteMany({ role: 'user' }), // Keep admin users
      Course.deleteMany({}),
      Task.deleteMany({}),
      Timetable.deleteMany({})
    ]);

    console.log('✅ Cleaned existing data');
    console.log('');

    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await User.create([
      {
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@student.com',
        password: 'password123',
        studentId: '2021001',
        major: 'Công nghệ thông tin',
        semester: 'HK1 2025-2026',
        role: 'user'
      },
      {
        name: 'Trần Thị Bình',
        email: 'binh.tran@student.com',
        password: 'password123',
        studentId: '2021002',
        major: 'Khoa học máy tính',
        semester: 'HK1 2025-2026',
        role: 'user'
      },
      {
        name: 'Lê Minh Cường',
        email: 'cuong.le@student.com',
        password: 'password123',
        studentId: '2021003',
        major: 'Hệ thống thông tin',
        semester: 'HK1 2025-2026',
        role: 'user'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);
    console.log('');

    // Create courses for each user
    console.log('📚 Creating courses...');
    const allCourses = [];

    for (const user of users) {
      const courses = await Course.create([
        {
          user: user._id,
          name: 'Cấu trúc dữ liệu và giải thuật',
          code: 'CS202',
          credits: 4,
          instructor: 'TS. Nguyễn Văn A',
          room: 'A101',
          color: COURSE_COLORS[0],
          description: 'Học về cây, đồ thị, thuật toán sắp xếp, tìm kiếm',
          semester: 'HK1',
          year: 2025
        },
        {
          user: user._id,
          name: 'Lập trình hướng đối tượng',
          code: 'CS203',
          credits: 3,
          instructor: 'ThS. Trần Thị B',
          room: 'B205',
          color: COURSE_COLORS[1],
          description: 'Java, C++, Design Patterns',
          semester: 'HK1',
          year: 2025
        },
        {
          user: user._id,
          name: 'Cơ sở dữ liệu',
          code: 'CS204',
          credits: 3,
          instructor: 'TS. Lê Văn C',
          room: 'C301',
          color: COURSE_COLORS[2],
          description: 'SQL, NoSQL, Database Design',
          semester: 'HK1',
          year: 2025
        },
        {
          user: user._id,
          name: 'Mạng máy tính',
          code: 'CS205',
          credits: 3,
          instructor: 'PGS.TS. Phạm Văn D',
          room: 'A202',
          color: COURSE_COLORS[3],
          description: 'TCP/IP, Network Security, Protocols',
          semester: 'HK1',
          year: 2025
        },
        {
          user: user._id,
          name: 'Công nghệ Web',
          code: 'CS206',
          credits: 3,
          instructor: 'ThS. Hoàng Thị E',
          room: 'B105',
          color: COURSE_COLORS[4],
          description: 'HTML, CSS, JavaScript, React, Node.js',
          semester: 'HK1',
          year: 2025
        }
      ]);
      allCourses.push(...courses);
    }

    console.log(`✅ Created ${allCourses.length} courses`);
    console.log('');

    // Create tasks for first user
    console.log('✅ Creating tasks...');
    const firstUser = users[0];
    const userCourses = allCourses.filter(c => c.user.toString() === firstUser._id.toString());

    const now = new Date();
    const tasks = await Task.create([
      {
        user: firstUser._id,
        course: userCourses[0]._id, // CS202
        title: 'Bài tập tuần 5 - Cây nhị phân',
        description: 'Cài đặt Binary Search Tree và các phép duyệt cây',
        type: 'assignment',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        priority: 'high',
        status: 'in-progress',
        estimatedTime: 120,
        notes: 'Tham khảo slide bài 4 và 5'
      },
      {
        user: firstUser._id,
        course: userCourses[1]._id, // CS203
        title: 'Project giữa kỳ - Quản lý thư viện',
        description: 'Xây dựng ứng dụng quản lý thư viện sử dụng OOP',
        type: 'project',
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        priority: 'urgent',
        status: 'in-progress',
        estimatedTime: 480,
        notes: 'Làm theo nhóm 4 người'
      },
      {
        user: firstUser._id,
        course: userCourses[2]._id, // CS204
        title: 'Kiểm tra giữa kỳ',
        description: 'Ôn tập chương 1-5: SQL queries, normalization, indexing',
        type: 'exam',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
        priority: 'urgent',
        status: 'todo',
        estimatedTime: 180,
        notes: 'Mang theo máy tính'
      },
      {
        user: firstUser._id,
        course: userCourses[3]._id, // CS205
        title: 'Đọc chapter 3 - Network Layer',
        description: 'Đọc và tóm tắt nội dung chương 3 trong sách giáo trình',
        type: 'reading',
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
        priority: 'medium',
        status: 'todo',
        estimatedTime: 90
      },
      {
        user: firstUser._id,
        course: userCourses[4]._id, // CS206
        title: 'Bài tập React - Todo App',
        description: 'Xây dựng Todo App với React hooks và local storage',
        type: 'assignment',
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days
        priority: 'medium',
        status: 'todo',
        estimatedTime: 150,
        notes: 'Sử dụng useState và useEffect'
      },
      {
        user: firstUser._id,
        course: userCourses[0]._id,
        title: 'Ôn tập thuật toán sắp xếp',
        description: 'Ôn lại Quick Sort, Merge Sort, Heap Sort',
        type: 'review',
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
        priority: 'high',
        status: 'todo',
        estimatedTime: 60
      }
    ]);

    console.log(`✅ Created ${tasks.length} tasks`);
    console.log('');

    // Create timetable for first user
    console.log('📅 Creating timetable...');
    const timetableEntries = await Timetable.create([
      // Monday
      {
        user: firstUser._id,
        course: userCourses[0]._id, // CS202
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '10:00',
        room: 'A101',
        type: 'lecture',
        notes: 'Nhớ mang máy tính'
      },
      {
        user: firstUser._id,
        course: userCourses[1]._id, // CS203
        dayOfWeek: 1,
        startTime: '13:00',
        endTime: '15:00',
        room: 'B205',
        type: 'lab',
        notes: 'Phòng máy lab 2'
      },
      // Tuesday
      {
        user: firstUser._id,
        course: userCourses[2]._id, // CS204
        dayOfWeek: 2,
        startTime: '08:00',
        endTime: '10:00',
        room: 'C301',
        type: 'lecture'
      },
      {
        user: firstUser._id,
        course: userCourses[3]._id, // CS205
        dayOfWeek: 2,
        startTime: '14:00',
        endTime: '16:00',
        room: 'A202',
        type: 'lecture'
      },
      // Wednesday
      {
        user: firstUser._id,
        course: userCourses[0]._id, // CS202
        dayOfWeek: 3,
        startTime: '10:00',
        endTime: '12:00',
        room: 'A101',
        type: 'tutorial',
        notes: 'Bài tập tuần 5'
      },
      {
        user: firstUser._id,
        course: userCourses[4]._id, // CS206
        dayOfWeek: 3,
        startTime: '13:00',
        endTime: '15:00',
        room: 'B105',
        type: 'lab',
        notes: 'Phòng máy lab 1'
      },
      // Thursday
      {
        user: firstUser._id,
        course: userCourses[1]._id, // CS203
        dayOfWeek: 4,
        startTime: '08:00',
        endTime: '10:00',
        room: 'B205',
        type: 'lecture'
      },
      {
        user: firstUser._id,
        course: userCourses[2]._id, // CS204
        dayOfWeek: 4,
        startTime: '14:00',
        endTime: '16:00',
        room: 'C301',
        type: 'lab',
        notes: 'Thực hành SQL'
      },
      // Friday
      {
        user: firstUser._id,
        course: userCourses[3]._id, // CS205
        dayOfWeek: 5,
        startTime: '08:00',
        endTime: '10:00',
        room: 'A202',
        type: 'lecture'
      },
      {
        user: firstUser._id,
        course: userCourses[4]._id, // CS206
        dayOfWeek: 5,
        startTime: '13:00',
        endTime: '15:00',
        room: 'B105',
        type: 'lecture',
        notes: 'Học về React Router'
      }
    ]);

    console.log(`✅ Created ${timetableEntries.length} timetable entries`);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════');
    console.log('✅ SEED DATA COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📚 Courses: ${allCourses.length}`);
    console.log(`   ✅ Tasks: ${tasks.length}`);
    console.log(`   📅 Timetable entries: ${timetableEntries.length}`);
    console.log('');
    console.log('🔐 Test Accounts:');
    users.forEach(user => {
      console.log(`   📧 ${user.email} | 🔑 password123`);
    });
    console.log('');
    console.log('💡 You can now login with any of these accounts!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run the script
seedData();
