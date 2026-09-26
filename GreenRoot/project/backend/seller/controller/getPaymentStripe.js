const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Cart = require("../model/cartModel"); // ✅ Import Cart model

const getPayment = async (req, res) => {
  const { sessionId } = req.params;
  console.log(sessionId);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId); // Retrieve Stripe session

    if (!session || !session.metadata) {
      return res.status(400).json({ error: "Invalid session data" });
    }

    // Fetch cart data using session metadata
    const cart = await Cart.findById(session.metadata.cartId); // ✅ Use `findById` for direct lookup
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    

    // Return the session and cart details to frontend
    const orderDetails = {
      userId: session.metadata.userId,
      cartId: session.metadata.cartId,
      totalPrice: session.amount_total / 100, // Convert cents to dollars
      items: cart.items, // Cart items
    };

    res.json(orderDetails);
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPayment };
