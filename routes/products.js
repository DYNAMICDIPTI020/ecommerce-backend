const express = require('express');
const Product = require('../models/Product');
const { cacheMiddleware } = require('../middleware/cache');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', cacheMiddleware(2 * 60 * 1000), async (req, res) => {
  try {
    const { page = 1, limit = 12, search = '', category = '', sort = 'newest', minPrice, maxPrice } = req.query;
    
    const query = { isActive: true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.categories = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let sortQuery = { createdAt: -1 };
    switch (sort) {
      case 'price-low': sortQuery = { price: 1 }; break;
      case 'price-high': sortQuery = { price: -1 }; break;
      case 'rating': sortQuery = { averageRating: -1 }; break;
      case 'popular': sortQuery = { totalReviews: -1 }; break;
    }
    
    const products = await Product.find(query)
      .select('-reviews') // Exclude reviews for list view
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortQuery);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:slug - Get single product
router.get('/:slug', cacheMiddleware(5 * 60 * 1000), async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('reviews.user', 'name email');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;