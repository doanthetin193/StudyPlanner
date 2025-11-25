import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import connectDB from '../src/config/database.js';

// Load env vars
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🔍 Checking for existing admin...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@studyplanner.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@studyplanner.com',
      password: 'admin123456',
      role: 'admin',
      studentId: 'ADMIN001',
      major: 'System Administrator',
      semester: 'All Semesters',
      preferences: {
        theme: 'light',
        notifications: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('─────────────────────────────────');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('👤 Name:', admin.name);
    console.log('🎭 Role:', admin.role);
    console.log('─────────────────────────────────');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
