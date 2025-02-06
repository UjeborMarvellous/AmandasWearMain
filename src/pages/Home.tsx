import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ModelImage from '../components/Images/Model.png';

function Home() {
  return (
    <div className=" fixed w-full h-screen">
      {/* Hero Section */}
      <div className="h-screen">
        <h1 className="text-[550%] 2xl:mt-[5%] lg:mt-[5%] md:mt-[26%] sm:mt-[10%] mt-[10%] text-center font-extrabold tracking-tight text-white sm:text-5xl md:text-[6.5rem] lg:text-[9rem] 2xl:text-[1250%]">
          FASHION MEETS
        </h1>
        <div className="con ">
          <div className="absolute inset-0  scale-100 2xl:ml-[6%]">
            <img
              src={ModelImage}
              alt="Fashion hero"
              className="w-full h-full object-cover scale-110 "
            />
            <div className="absolut inset-0 bg-opacity-90"></div>
          </div>
          <div className=" relative mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 2xl:mt-auto lg:mt-auto md:mt-auto sm:-mt-[14%] -mt-[14%]">
            <h1 className="text-[550%] text-center font-extrabold tracking-tight text-white sm:text-5xl md:text-[6.5rem] lg:text-[9rem] 2xl:text-[14rem]">
              LUXURY
            </h1>
            <div className="2xl:mt-[7%] lg:mt-[7%] md:mt-[7%] sm:mt-[3%] mt-[3%] text-center">
              <Link
                to="/products"
                className="inline-flex items-center 2xl:px-32 lg:px-32 md:px-32 sm:px-32 px-10 font-semibold py-3 border border-transparent text-base rounded-md text-gray-900 bg-white hover:bg-BWhite/90 hover:text-white"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Dresses', 'Accessories', 'Outerwear'].map((category) => (
            <div key={category} className="relative group">
              <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white">
                <img
                  src={`https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                  alt={category}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-6 text-sm text-gray-500">{category}</h3>
              <p className="text-base font-semibold text-gray-900">Shop Collection</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default Home;
