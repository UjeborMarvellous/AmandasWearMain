import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL, // Explicitly allow frontend origin
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Stripe Checkout Session Endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("Received checkout request:", req.body);

    const { orderId, items, shipping_amount } = req.body;

    // Validate request data
    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    if (!shipping_amount || isNaN(shipping_amount) || shipping_amount < 0) {
      return res.status(400).json({ error: "Invalid shipping amount" });
    }

    // Map items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product_data?.name || "Unnamed Product",
          description: item.product_data?.description || "No description",
          images: item.product_data?.images || [],
        },
        unit_amount: item.price_data?.unit_amount || 0,
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCLE_URL,
      metadata: { orderId },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: parseInt(shipping_amount, 10), currency: "usd" },
            display_name: "Standard Shipping",
          },
        },
      ],
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
