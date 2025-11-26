const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
require('dotenv').config();

async function seedOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get existing users and products
    const users = await User.find();
    const products = await Product.find();
    
    if (users.length === 0 || products.length === 0) {
      console.log('No users or products found. Please seed them first.');
      return;
    }

    // Create sample orders
    const sampleOrders = [
      {
        userId: users[0]._id,
        items: [
          { productId: products[0]._id, name: products[0].name, quantity: 2, price: products[0].price },
          { productId: products[1]._id, name: products[1].name, quantity: 1, price: products[1].price }
        ],
        total: (products[0].price * 2) + products[1].price,
        status: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[2]._id, name: products[2].name, quantity: 1, price: products[2].price }
        ],
        total: products[2].price,
        status: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[3]._id, name: products[3].name, quantity: 3, price: products[3].price },
          { productId: products[4]._id, name: products[4].name, quantity: 1, price: products[4].price }
        ],
        total: (products[3].price * 3) + products[4].price,
        status: 'shipped',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[5]._id, name: products[5].name, quantity: 2, price: products[5].price }
        ],
        total: products[5].price * 2,
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: users[0]._id,
        items: [
          { productId: products[6]._id, name: products[6].name, quantity: 1, price: products[6].price },
          { productId: products[7]._id, name: products[7].name, quantity: 2, price: products[7].price }
        ],
        total: products[6].price + (products[7].price * 2),
        status: 'paid',
        createdAt: new Date() // Today
      }
    ];

    // Clear existing orders
    await Order.deleteMany({});
    
    // Insert sample orders
    const createdOrders = await Order.insertMany(sampleOrders);
    
    console.log(`Created ${createdOrders.length} sample orders`);
    console.log('Sample orders with revenue data created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();