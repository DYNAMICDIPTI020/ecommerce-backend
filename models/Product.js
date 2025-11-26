const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  categories: [String],
  images: [{ url: String, alt: String }],
  stock: { type: Number, default: 0 },
  sku: String,
  isActive: { type: Boolean, default: true },
  reviews: [ReviewSchema],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  tags: [String],
  brand: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);