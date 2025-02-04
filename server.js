import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/create-checkout-session', async (req, res) => {
  console.log('Received checkout request:', req.body);
  
  try {
    const { orderId, items, shipping_amount } = req.body;

    if (!orderId || !items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid request data:', { orderId, items });
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: 'Order ID and items are required' 
      });
    }

    // Verify the order exists in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return res.status(404).json({
        error: 'Order not found',
        details: 'Could not find the specified order'
      });
    }
    

    // Validate line items
    const validatedItems = items.map(item => {
      if (!item.price_data?.product_data?.name || !item.price_data.unit_amount || !item.quantity) {
        console.error('Invalid line item:', item);
        throw new Error('Invalid line item data');
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.price_data.product_data.name,
            description: item.price_data.product_data.description,
            images: item.price_data.product_data.images || [],
          },
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      };
    });

    console.log('Creating Stripe session with items:', validatedItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shipping_amount || 1000,
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      metadata: { order_id: orderId }
    });

    console.log('Stripe session created:', session.id);

    // Update order with payment intent ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_intent_id: session.payment_intent,
        status: 'pending_payment'
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      // Don't throw here, just log the error
    }

    res.json({ id: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ 
      error: 'Checkout failed',
      details: error.message 
    });
  }
});

// Port handling with retry on failure
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ Port ${port} is already in use. Retrying on port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
};

// Start server on port 3000 or the next available port
startServer(parseInt(process.env.PORT, 10) || 3000);
