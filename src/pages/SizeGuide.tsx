import React from 'react';

function SizeGuide() {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif mb-8">Size Guide</h1>
        
        <div className="space-y-8">
          {/* How to Measure */}
          <section>
            <h2 className="text-xl font-medium mb-4">How to Measure</h2>
            <div className="prose prose-sm">
              <p className="mb-4">
                To find your perfect fit, follow these measuring guidelines. Use a soft measuring tape
                and measure against your body wearing minimal clothing.
              </p>
              <ul className="space-y-4">
                <li>
                  <strong>Bust:</strong> Measure around the fullest part of your bust, keeping the tape parallel to the floor.
                </li>
                <li>
                  <strong>Waist:</strong> Measure around your natural waistline, at the smallest part of your waist.
                </li>
                <li>
                  <strong>Hips:</strong> Measure around the fullest part of your hips, usually about 8" below your waist.
                </li>
              </ul>
            </div>
          </section>

          {/* Size Charts */}
          <section>
            <h2 className="text-xl font-medium mb-4">Size Charts</h2>
            
            {/* Dresses & Tops */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Dresses & Tops</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bust (cm)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist (cm)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">XS</td>
                      <td className="px-6 py-4 whitespace-nowrap">81-86</td>
                      <td className="px-6 py-4 whitespace-nowrap">61-66</td>
                      <td className="px-6 py-4 whitespace-nowrap">86-91</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">S</td>
                      <td className="px-6 py-4 whitespace-nowrap">86-91</td>
                      <td className="px-6 py-4 whitespace-nowrap">66-71</td>
                      <td className="px-6 py-4 whitespace-nowrap">91-96</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">M</td>
                      <td className="px-6 py-4 whitespace-nowrap">91-96</td>
                      <td className="px-6 py-4 whitespace-nowrap">71-76</td>
                      <td className="px-6 py-4 whitespace-nowrap">96-101</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">L</td>
                      <td className="px-6 py-4 whitespace-nowrap">96-101</td>
                      <td className="px-6 py-4 whitespace-nowrap">76-81</td>
                      <td className="px-6 py-4 whitespace-nowrap">101-106</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">XL</td>
                      <td className="px-6 py-4 whitespace-nowrap">101-106</td>
                      <td className="px-6 py-4 whitespace-nowrap">81-86</td>
                      <td className="px-6 py-4 whitespace-nowrap">106-111</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Fit Tips */}
          <section>
            <h2 className="text-xl font-medium mb-4">Fit Tips</h2>
            <div className="prose prose-sm">
              <ul className="list-disc pl-4 space-y-2">
                <li>If you're between sizes, order the larger size for a more comfortable fit</li>
                <li>Consider the fabric and style when choosing your size</li>
                <li>Check the product description for specific fit advice</li>
                <li>Our models typically wear size S and are 175cm tall</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SizeGuide;