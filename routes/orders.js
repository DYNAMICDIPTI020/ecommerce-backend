const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/orders - Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.productId', 'name images')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders - Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;
    
    const order = await Order.create({
      userId: req.user.userId,
      items,
      total,
      shippingAddress,
      status: 'pending'
    });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;