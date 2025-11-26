const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// GET /api/admin/analytics
router.get('/analytics', auth, adminAuth, async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const orderCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const productCount = await Product.countDocuments({ isActive: true });
    const userCount = await User.countDocuments();
    
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      orderCounts: orderCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      productCount,
      userCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/products
router.get('/products', auth, adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/products
router.post('/products', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;