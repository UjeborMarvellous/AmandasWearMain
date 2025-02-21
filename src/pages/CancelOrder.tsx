import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

function Cancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-6 text-3xl font-serif text-gray-900">
          Payment Cancelled
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your order has been cancelled and no payment has been processed.
        </p>
        <div className="mt-8">
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cancel;