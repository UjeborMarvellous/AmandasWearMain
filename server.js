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
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
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

// app.post("/api/create-checkout-session", async (req, res) => {
//   console.log("📌Received checkout request:", req.body);
//   // log order id
//   console.log(req.body.orderId);
//   try {
//     const { orderId, items, shipping_amount } = req.body;
//     if (!req.body.orderId || !req.body.items || !req.body.shipping_amount) {
//       return res.status(400).json({ error: "Invalid request payload" });
//     }
//     console.log("Order is valid:", order);

//     // ✅ Validate & format line items for Stripe
//     let validatedItems;
//     try {
//       validatedItems = items.map((item) => {
//         if (
//           !item.price_data?.product_data?.name ||
//           !item.price_data.unit_amount ||
//           !item.quantity
//         ) {
//           throw new Error("Invalid line item data");
//         }
//         return {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: item.price_data.product_data.name,
//               description: item.price_data.product_data.description || "",
//               images: item.price_data.product_data.images || [],
//             },
//             unit_amount: item.price_data.unit_amount,
//           },
//           quantity: item.quantity,
//         };
//       });
//     } catch (error) {
//       console.error("❌ Invalid line item:", err);
//       return res.status(400).json({
//         error: "Invalid line item data",
//         details: err.message,
//       });
//     }

//     console.log("✅ Creating Stripe session with items:", validatedItems);

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: validatedItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cart`,
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: {
//               amount: shipping_amount || 1000, // Default to $10 if missing
//               currency: "usd",
//             },
//             display_name: "Standard Shipping",
//             delivery_estimate: {
//               minimum: { unit: "business_day", value: 5 },
//               maximum: { unit: "business_day", value: 7 },
//             },
//           },
//         },
//       ],
//       metadata: { order_id: orderId },
//     });

//     console.log("Stripe session created:", session.id);

  
//     // Update order with payment intent ID
//     const { error: updateError } = await supabase
//       .from("orders")
//       .update({
//         status: "pending_payment",
//         payment_intent_id: session.payment_intent || session.id,
//       })
//       .eq("id", orderId);

//     if (updateError) {
//       console.error("Error updating order:", updateError);
//       // Don't throw here, just log the error
//     }
//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Checkout error:", error);
//     res.status(500).json({
//       error: "Checkout failed",
//       details: error.message,
//     });
//   }
// }); // Port handling with retry on failure

// app.post("/api/create-checkout-session", async (req, res) => {
//   try {
//     const { orderId, items, shipping_amount } = req.body;

//     if (!orderId || !items || items.length === 0) {
//       return res.status(400).json({ error: "Invalid request data" });
//     }

//     const lineItems = items.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.price_data.product_data.name,
//           description: item.price_data.product_data.description,
//           images: item.price_data.product_data.images,
//         },
//         unit_amount: item.price_data.unit_amount,
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/checkout`,
//       metadata: {
//         orderId,
//       },
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             type: "fixed_amount",
//             fixed_amount: { amount: shipping_amount, currency: "usd" },
//             display_name: "Standard Shipping",
//           },
//         },
//       ],
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Stripe Checkout Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
