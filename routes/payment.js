const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { userId: req.user.id }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment and create order
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, items, shippingAddress, totalAmount } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentIntentId,
      status: 'confirmed'
    });

    await order.save();
    res.json({ message: 'Order created successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;