import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore'; 
import { sendOrderNotification } from '../lib/notifications';  
import React, { useState, useEffect } from 'react'; 

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 10.00;
  const total = subtotal + shipping;

  useEffect(() => {
    checkUser();
  }, []);

  // async function checkUser() {
  //   try {
  //     const { data: { user }, error: authError } = await supabase.auth.getUser();
  //     if (authError) throw authError;
      
  //     if (!user) {
  //       navigate('/auth?returnTo=/checkout');
  //       return;
  //     }
  //     // setUser(user);
      
  //     // if (user.email) {
  //     //   setFormData(prev => ({ ...prev, email: user.email }));
  //     // }
  //   } catch (error) {
  //     console.error('Error checking user:', error);
  //     setError('Authentication error. Please try logging in again.');
  //     navigate('/auth?returnTo=/checkout');
  //   }
  // }
  async function checkUser() {
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError || !data.user) {
        navigate('/auth?returnTo=/checkout');
        return;
      }
      setFormData((prev) => ({ ...prev, email: data.user.email || '' }));
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth?returnTo=/checkout');
    }
  }
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.address || 
        !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error('Authentication error. Please log in again.');
    if (!user) throw new Error('Please log in to complete your purchase.');

    // Get user's profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError) throw new Error('Failed to get user profile.');

    // Create order in Supabase
    console.log('Creating order in Supabase...');
    const { data: insertedOrders, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        user_profile_id: profile.id,
        status: 'pending',
        total_amount: total,
        shipping_address: formData
      }])
      .select('*');

    if (orderError) {
      console.error('Failed to create order:', orderError);
      throw new Error('Failed to create order. Please try again.');
    }

    const order = insertedOrders?.[0];
    if (!order) {
      console.error('No order was created:', insertedOrders);
      throw new Error('Failed to create order. Please try again.');
    }

    console.log('Order created successfully:', order);

    // Create order items
    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price_at_time: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // If order items creation fails, delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error('Failed to create order items. Please try again.');
    } 

    // Send order notification
    try {
      await sendOrderNotification(order.id);
    } catch (error) {
      console.error('Failed to send order notification:', error);
      // Don't throw here - we don't want to stop the checkout process
      // if notification fails
    }

    return order;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
    
  //   setLoading(true);
  //   setError('');

  //   try {
  //     // First create the order
  //     const order = await createOrder();

  //     // Then create Stripe checkout session with the order ID
  //     const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-checkout-session`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         orderId: order.id,
  //         items: cart.map((item) => ({
  //           price_data: {
  //             currency: 'usd',
  //             product_data: {
  //               name: item.product.name,
  //               description: `Size: ${item.size}, Color: ${item.color}`,
  //               images: [item.product.images[0]],
  //             },
  //             unit_amount: Math.round(item.product.price * 100),            
  //           },
  //           quantity: item.quantity,          
  //         })),
  //         shipping_amount: shipping * 100,
  //       }),      
  //     });            

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to create checkout session');
  //     }

  //     const session = await response.json();
  //     const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
  //     if (!stripe) {
  //       throw new Error('Failed to load payment processor');
  //     }

  //     const { error: stripeError } = await stripe.redirectToCheckout({
  //       sessionId: session.id,
  //     });

  //     if (stripeError) throw stripeError;

  //     clearCart();
  //   } catch (error) {
  //     console.error('Checkout error:', error);
  //     setError(error.message || 'An error occurred during checkout. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;
    
  //   setLoading(true);
  //   setError('');
  
  //   try {
  //     const order = await createOrder();
      
  //     const response = await fetch(`/api/create-checkout-session`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ orderId: order.id, items: cart, shipping }),
  //     });
  
  //     if (!response.ok) throw new Error('Failed to create checkout session');
      
  //     const { id } = await response.json();
  //     const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
  //     if (!stripe) throw new Error('Stripe failed to load');
  
  //     await stripe.redirectToCheckout({ sessionId: id });
  //     clearCart();
  //   } catch (error) {
  //     console.error('Checkout error:', error);
  //     setError(error.message || 'An error occurred during checkout.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
        const response = await fetch('/api/create-checkout-session', { method: 'POST' });

        if (!response.ok) {
            throw new Error(`Checkout failed: ${response.statusText}`);
        }

        const session = await response.json();
        window.location.href = session.url; // Redirect to Stripe checkout
    } catch (error) {
        console.error('Checkout error:', error);
        alert(`Error: ${error.message}`);
    }
};


  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif mb-8">Checkout</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg p-6 border">
                <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>                
              </div>      
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center"
              >                
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            </form>
          </div>          
          {/* Order Summary */}
          <div className="lg:col-span-4">            
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between">
                    <span className="text-sm">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2 font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

export default Checkout;  


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { supabase } from '../lib/supabase';
// import { useStore } from '../store/useStore';
// import { sendOrderNotification } from '../lib/notifications';

// function Checkout() {
//   const navigate = useNavigate();
//   const { cart, clearCart } = useStore();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     email: '',
//     name: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: '',
//   });

//   const subtotal = cart.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );
//   const shipping = 10.00;
//   const total = subtotal + shipping;

//   useEffect(() => {
//     checkUser();
//   }, []);

//   async function checkUser() {
//     try {
//       const { data: { user }, error: authError } = await supabase.auth.getUser();
//       if (authError) throw authError;
      
//       if (!user) {
//         navigate('/auth?returnTo=/checkout');
//         return;
//       }
//       setUser(user);
      
//       if (user.email) {
//         setFormData(prev => ({ ...prev, email: user.email }));
//       }
//     } catch (error) {
//       console.error('Error checking user:', error);
//       setError('Authentication error. Please try logging in again.');
//       navigate('/auth?returnTo=/checkout');
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError('');
//   };

//   const validateForm = () => {
//     if (!formData.email || !formData.name || !formData.address || 
//         !formData.city || !formData.state || !formData.zipCode || !formData.country) {
//       setError('Please fill in all required fields');
//       return false;
//     }
//     return true;
//   };

//   const createOrder = async () => {
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
//     if (authError) throw new Error('Authentication error. Please log in again.');
//     if (!user) throw new Error('Please log in to complete your purchase.');

//     // Get user's profile ID
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('id')
//       .eq('id', user.id)
//       .single();

//     if (profileError) throw new Error('Failed to get user profile.');

//     // Create order in Supabase
//     console.log('Creating order in Supabase...');
//     const { data: insertedOrders, error: orderError } = await supabase
//       .from('orders')
//       .insert([{
//         user_id: user.id,
//         user_profile_id: profile.id,
//         status: 'pending',
//         total_amount: total,
//         shipping_address: formData
//       }])
//       .select('*');

//     if (orderError) {
//       console.error('Failed to create order:', orderError);
//       throw new Error('Failed to create order. Please try again.');
//     }

//     const order = insertedOrders?.[0];
//     if (!order) {
//       console.error('No order was created:', insertedOrders);
//       throw new Error('Failed to create order. Please try again.');
//     }

//     console.log('Order created successfully:', order);

//     // Create order items
//     const orderItems = cart.map(item => ({
//       order_id: order.id,
//       product_id: item.product.id,
//       quantity: item.quantity,
//       size: item.size,
//       color: item.color,
//       price_at_time: item.product.price
//     }));

//     const { error: itemsError } = await supabase
//       .from('order_items')
//       .insert(orderItems);

//     if (itemsError) {
//       // If order items creation fails, delete the order
//       await supabase.from('orders').delete().eq('id', order.id);
//       throw new Error('Failed to create order items. Please try again.');
//     }

//     // Send order notification
//     try {
//       await sendOrderNotification(order.id);
//     } catch (error) {
//       console.error('Failed to send order notification:', error);
//       // Don't throw here - we don't want to stop the checkout process
//       // if notification fails
//     }

//     return order;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setError('');

//     try {
//       // First create the order
//       const order = await createOrder();

//       // Then create Stripe checkout session with the order ID
//       const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-checkout-session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           orderId: order.id,
//           items: cart.map((item) => ({
//             price_data: {
//               currency: 'usd',
//               product_data: {
//                 name: item.product.name,
//                 description: `Size: ${item.size}, Color: ${item.color}`,
//                 images: [item.product.images[0]],
//               },
//               unit_amount: Math.round(item.product.price * 100),
//             },
//             quantity: item.quantity,
//           })),
//           shipping_amount: shipping * 100,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create checkout session');
//       }

//       const session = await response.json();
//       const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      
//       if (!stripe) {
//         throw new Error('Failed to load payment processor');
//       }

//       const { error: stripeError } = await stripe.redirectToCheckout({
//         sessionId: session.id,
//       });

//       if (stripeError) throw stripeError;

//       clearCart();
//     } catch (error) {
//       console.error('Checkout error:', error);
//       setError(error.message || 'An error occurred during checkout. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cart.length === 0) {
//     navigate('/cart');
//     return null;
//   }

//   return (
//     <div className="">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="text-3xl font-serif mb-8">Checkout</h1>

//         {error && (
//           <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-red-600">{error}</p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Checkout Form */}
//           <div className="lg:col-span-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="bg-white rounded-lg p-6 border">
//                 <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
//                 <div className="grid grid-cols-1 gap-4">
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       required
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       required
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       id="address"
//                       name="address"
//                       required
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="city" className="block text-sm font-medium text-gray-700">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         id="city"
//                         name="city"
//                         required
//                         value={formData.city}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="state" className="block text-sm font-medium text-gray-700">
//                         State
//                       </label>
//                       <input
//                         type="text"
//                         id="state"
//                         name="state"
//                         required
//                         value={formData.state}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
//                         ZIP Code
//                       </label>
//                       <input
//                         type="text"
//                         id="zipCode"
//                         name="zipCode"
//                         required
//                         value={formData.zipCode}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="country" className="block text-sm font-medium text-gray-700">
//                         Country
//                       </label>
//                       <input
//                         type="text"
//                         id="country"
//                         name="country"
//                         required
//                         value={formData.country}
//                         onChange={handleInputChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   'Proceed to Payment'
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-4">
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h2 className="text-lg font-medium mb-4">Order Summary</h2>
//               <div className="space-y-4">
//                 {cart.map((item) => (
//                   <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between">
//                     <span className="text-sm">
//                       {item.product.name} x {item.quantity}
//                     </span>
//                     <span className="text-sm">
//                       ${(item.product.price * item.quantity).toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>${subtotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between mt-2">
//                     <span>Shipping</span>
//                     <span>${shipping.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between mt-2 font-medium">
//                     <span>Total</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Checkout;