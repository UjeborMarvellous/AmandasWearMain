import React from 'react';

function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="About hero"
            className="w-full 2xl:h-[30dvh] lg:h-[30dvh] md:h-[27dvh] sm:h-[31dvh] h-[31dvh] object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif text-white text-center">
            About Amandaswear
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-6">African Fashion in Adelaide</h2>
            <div className="prose prose-lg">
              <p>
                Amandaswear brings the vibrant beauty of African fashion to Adelaide, specializing in stylish Ankara dresses and unique African-inspired designs. We blend traditional prints with modern styles to create bold, elegant outfits for any occasion.
              </p>
              <p>
                Our high-quality pieces celebrate culture, confidence, and individuality with rich colors and striking patterns. We are passionate about making African fashion accessible, affordable, and empowering for everyone.
              </p>
              <p>
                Whether for casual wear or special events, Amandaswear offers unique designs that let you embrace African elegance without breaking the bank. Explore our collection and celebrate fashion with us!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
              alt="Fashion"
              className="rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
              alt="Fashion"
              className="rounded-lg mt-8"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-serif text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Quality & Authenticity</h3>
              <p className="text-gray-600">
                We source the finest materials and work with skilled artisans to create authentic, high-quality pieces.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Cultural Celebration</h3>
              <p className="text-gray-600">
                Each piece tells a story and celebrates the rich heritage of African fashion and design.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium mb-4">Accessibility</h3>
              <p className="text-gray-600">
                We believe beautiful, cultural fashion should be accessible to everyone at fair prices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;