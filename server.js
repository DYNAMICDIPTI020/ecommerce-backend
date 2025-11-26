const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://myshop_user:MyShop123!@my-shop-cluster.nggthgn.mongodb.net/myshop')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Basic routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API Server Running!' });
});

// API status check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is working!',
    endpoints: {
      products: '/api/products',
      auth: '/api/auth/login (POST), /api/auth/register (POST)',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});