import React from 'react';

function Returns() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif mb-8">Returns & Exchanges</h1>
        
        <div className="space-y-8">
          {/* Return Policy */}
          <section>
            <h2 className="text-xl font-medium mb-4">Return Policy</h2>
            <div className="prose prose-sm">
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with your order,
                we accept returns within 30 days of delivery for a full refund or exchange.
              </p>
              <h3 className="text-lg font-medium mt-4 mb-2">Conditions for Returns:</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Items must be unworn, unwashed, and in original condition</li>
                <li>Original tags must be attached</li>
                <li>Items must be in original packaging</li>
                <li>Sale items are final sale and cannot be returned</li>
                <li>Swimwear and intimates cannot be returned for hygiene reasons</li>
              </ul>
            </div>
          </section>

          {/* Exchange Process */}
          <section>
            <h2 className="text-xl font-medium mb-4">Exchange Process</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0">1</span>
                  <div>
                    <h3 className="font-medium">Contact Us</h3>
                    <p className="text-gray-600">Email our customer service team to initiate an exchange</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0">2</span>
                  <div>
                    <h3 className="font-medium">Receive Return Label</h3>
                    <p className="text-gray-600">We'll email you a prepaid return shipping label</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0">3</span>
                  <div>
                    <h3 className="font-medium">Ship Items Back</h3>
                    <p className="text-gray-600">Pack items securely and attach the return label</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-3 flex-shrink-0">4</span>
                  <div>
                    <h3 className="font-medium">Receive Exchange</h3>
                    <p className="text-gray-600">We'll process your exchange within 5-7 business days</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Refund Information */}
          <section>
            <h2 className="text-xl font-medium mb-4">Refund Information</h2>
            <div className="prose prose-sm">
              <p>
                Refunds will be processed to the original payment method within 5-7 business days
                of receiving your return. Please note:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Original shipping charges are non-refundable</li>
                <li>Return shipping costs are the responsibility of the customer</li>
                <li>Store credit is available if original payment method is expired</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Returns;