const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@myshop.com',
      password: 'admin123',
      roles: ['admin', 'user']
    });
    
    console.log('Admin user created:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();