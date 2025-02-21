import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const successUrl = "http://localhost:5173/success";
console.log(successUrl);


const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY,{
  apiVersion: "2023-10-16",
});

// console.log(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Stripe payment intent endpoint
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    console.log("Received checkout request:", req.body); // Debugging log

    const { orderId, items, shipping_amount } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid request data" });
    }

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

    if (!shipping_amount || isNaN(shipping_amount) || shipping_amount < 0) {
      return res.status(400).json({ error: "Invalid shipping amount" });
    }
    
    // write this const session that it will route to the success page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // add this
      line_items: lineItems, // add this
      mode: "payment", // add this
      success_url: process.env.STRIPE_SUCCESS_URL, // add this
      cancel_url: process.env.STRIPE_CANCLE_URL, // add this
      metadata: { orderId }, // add this
      shipping_options: [ // add this
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: parseInt(shipping_amount, 10), currency: "usd" },
            display_name: "Standard Shipping",
          },
        },
      ],
    });

    console.log("Stripe session created:", session.id); // Debugging log
    res.json({ id: session.id });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});


app.listen(process.env.PORT || 3000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 3000}`);
});
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  });
};

// Start server on port 3000 or the next available port
// startServer(4000);

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// app.listen(3000, () => {
//   console.log("Server started on port 3000");
// });