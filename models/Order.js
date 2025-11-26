const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: Number,
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    provider: String,
    paymentIntentId: String,
    status: String
  },
  shippingAddress: {
    line1: String,
    city: String,
    state: String,
    country: String,
    postal: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);