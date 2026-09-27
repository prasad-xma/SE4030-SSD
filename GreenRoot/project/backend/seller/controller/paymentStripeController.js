const stripe = require('stripe')(
  process.env.SELLER_STRIPE_SECRET || process.env.STRIPE_SECRET
);
const mongoose = require('mongoose');
const Cart = require('../model/cartModel');
const Crop = require('../../farmer/model/cropModel');

async function createCheckoutSession(req, res) {
  try {
    const { cartId } = req.body;

    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({ error: 'A valid cartId is required' });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cannot checkout an empty cart' });
    }

    const line_items = [];
    let calculatedTotal = 0;

    for (const item of cart.items) {
      if (!item.cropId || !mongoose.Types.ObjectId.isValid(item.cropId)) {
        return res.status(400).json({ error: 'Cart contains an invalid crop reference' });
      }

      const crop = await Crop.findById(item.cropId);

      if (!crop) {
        return res.status(404).json({ error: 'A crop in the cart no longer exists' });
      }

      if (!Number.isFinite(crop.price) || crop.price <= 0) {
        return res.status(400).json({ error: 'A crop in the cart has an invalid price' });
      }

      const unitAmount = Math.round(crop.price * 100);

      if (!Number.isSafeInteger(unitAmount) || unitAmount <= 0) {
        return res.status(400).json({ error: 'A crop in the cart has an invalid price' });
      }

      calculatedTotal += unitAmount;
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: crop.name,
            images: crop.image ? [crop.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      });
    }

    const sellerId = cart.sellerId.toString();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:5173/seller/${sellerId}/placeOrder?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/seller/${sellerId}/Inventory`,
      metadata: {
        cartId, 
        userId: sellerId,
        totalAmount: calculatedTotal.toString(),
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createCheckoutSession };
