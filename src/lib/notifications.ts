import emailjs from '@emailjs/browser';
import { supabase } from './supabase';

export async function sendOrderNotification(orderId: string) {
  try {
    // First get the order details
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*, user_profile_id')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Then get the order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          price
        )
      `)
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // Get user profile details
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', orderData.user_profile_id)
      .single();

    if (profileError) throw profileError;

    // Format order items for email
    const formattedItems = orderItems.map(item => `
      ${item.products.name}
      - Size: ${item.size}
      - Color: ${item.color}
      - Quantity: ${item.quantity}
      - Price: $${item.price_at_time}
    `).join('\n');

    // Format shipping address
    const shippingAddress = `
      ${orderData.shipping_address.name}
      ${orderData.shipping_address.address}
      ${orderData.shipping_address.city}, ${orderData.shipping_address.state} ${orderData.shipping_address.zipCode}
      ${orderData.shipping_address.country}
    `.trim();

    // Prepare email template parameters
    const templateParams = {
      to_email: 'amandaswearsau@gmail.com',
      from_name: 'Amandaswears Boutique',
      order_id: orderId,
      order_date: new Date(orderData.created_at).toLocaleString(),
      order_status: orderData.status,
      total_amount: `$${orderData.total_amount.toFixed(2)}`,
      customer_name: profile.full_name,
      customer_email: profile.email,
      shipping_address: shippingAddress,
      order_items: formattedItems
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email notification');
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send order notification:', error);
    throw error;
  }
}