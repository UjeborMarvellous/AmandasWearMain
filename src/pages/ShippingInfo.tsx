import React from 'react';

function ShippingInfo() {
  return (
    <div className="">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif mb-8">Shipping Information</h1>
        
        <div className="space-y-8">
          {/* Delivery Options */}
          <section>
            <h2 className="text-xl font-medium mb-4">Delivery Options</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Standard Shipping</h3>
                <p className="text-gray-600">5-7 business days</p>
                <p className="text-gray-600">$10.00</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Express Shipping</h3>
                <p className="text-gray-600">2-3 business days</p>
                <p className="text-gray-600">$25.00</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Next Day Delivery</h3>
                <p className="text-gray-600">Next business day</p>
                <p className="text-gray-600">$35.00</p>
              </div>
            </div>
          </section>

          {/* Shipping Policies */}
          <section>
            <h2 className="text-xl font-medium mb-4">Shipping Policies</h2>
            <div className="prose prose-sm">
              <ul className="list-disc pl-4 space-y-2">
                <li>Orders are processed within 1-2 business days</li>
                <li>Free shipping on orders over $150 (standard shipping only)</li>
                <li>We ship to all states within Australia</li>
                <li>International shipping is not available at this time</li>
                <li>Tracking information will be provided via email once your order ships</li>
                <li>Delivery times may be affected by customs, holidays, or weather conditions</li>
              </ul>
            </div>
          </section>

          {/* Order Tracking */}
          <section>
            <h2 className="text-xl font-medium mb-4">Order Tracking</h2>
            <p className="text-gray-600 mb-4">
              Once your order ships, you will receive a confirmation email with tracking information.
              You can track your order by:
            </p>
            <ul className="list-disc pl-4 space-y-2 text-gray-600">
              <li>Clicking the tracking link in your shipping confirmation email</li>
              <li>Logging into your account and viewing your order history</li>
              <li>Contacting our customer service team with your order number</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfo;