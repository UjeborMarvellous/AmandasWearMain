import { serve } from 'https://deno.fresh.dev/std@0.177.0/http/server.ts';
import { SendGrid } from 'https://deno.land/x/sendgrid@0.0.3/mod.ts';

const sendgrid = new SendGrid(Deno.env.get('SENDGRID_API_KEY'));
// Store email address where all order notifications will be sent
const STORE_EMAIL = 'amandaswearsau@gmail.com';
const STORE_NAME = 'Amandaswears Boutique';

serve(async (req) => {
  try {
    const { order } = await req.json();
    
    // Format order details for email
    const orderItems = order.order_items.map(item => `
      ${item.products.name}
      - Size: ${item.size}
      - Color: ${item.color}
      - Quantity: ${item.quantity}
      - Price: $${item.price_at_time}
    `).join('\n');

    const shippingAddress = `
      ${order.shipping_address.name}
      ${order.shipping_address.address}
      ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.zipCode}
      ${order.shipping_address.country}
    `;

    // Send email to store owner at amandaswearsau@gmail.com
    // This email will be sent after successful payment confirmation
    await sendgrid.send({
      to: STORE_EMAIL, // Emails will be sent to amandaswearsau@gmail.com
      from: STORE_EMAIL, // Using same email as sender (must be verified in SendGrid)
      subject: `New Order #${order.id}`,
      text: `
        New order received!

        Order Details:
        Order ID: ${order.id}
        Date: ${new Date(order.created_at).toLocaleString()}
        Status: ${order.status}
        Total Amount: $${order.total_amount}

        Customer Information:
        Name: ${order.profile.full_name}
        Email: ${order.profile.email}

        Shipping Address:
        ${shippingAddress}

        Items Ordered:
        ${orderItems}

        View order details in your admin dashboard.
      `,
      html: `
        <h1>New order received!</h1>

        <h2>Order Details:</h2>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Total Amount:</strong> $${order.total_amount}</p>

        <h2>Customer Information:</h2>
        <p><strong>Name:</strong> ${order.profile.full_name}</p>
        <p><strong>Email:</strong> ${order.profile.email}</p>

        <h2>Shipping Address:</h2>
        <p>${shippingAddress.replace(/\n/g, '<br>')}</p>

        <h2>Items Ordered:</h2>
        <div>${orderItems.replace(/\n/g, '<br>')}</div>

        <p><a href="https://your-admin-dashboard.com/orders/${order.id}">View order details in your admin dashboard</a></p>
      `
    });

    return new Response(
      JSON.stringify({ message: 'Order notification sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending order notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send order notification' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});