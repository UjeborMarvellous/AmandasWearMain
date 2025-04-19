'use client';

import React, { useState } from 'react';
import ReactCookieBot from 'react-cookiebot';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import ModelImage from '../components/Images/ModelsMain..png';
import Footer from '../components/Footer';

const domainGroupId = '610ba6a1-cac8-47f6-8058-62fbffc6b31d';
function Home() {
  
  return (
    <div className="bg-BWhite/80 w-full relative">
      <ReactCookieBot domainGroupId={domainGroupId} />
      {/* Hero Section */}
      <div className="overflow-hidden h-screen">
        <h1 className="text-[550%] md:leading-[90%] 2xl:mt-[10%] lg:mt-[5%] md:mt-[16%] sm:mt-[10%] mt-[10%] text-center font-extrabold tracking-tight text-white sm:text-4xl md:text-[8.5rem] lg:text-[9rem] 2xl:text-[1250%]">
          FASHION MEETS
        </h1>
        <div className="con relative">
          <div className="absolute inset-0 2xl:ml-[6%]">
            <img
              src={ModelImage}
              alt="Fashion hero"
              className="w-full scale-150 h-full lg:object-contain object-cover"
            />
          </div>
          <div className="relative mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 2xl:mt-auto lg:mt-auto md:mt-auto sm:-mt-[14%] -mt-[14%]">
            <h1 className="text-[450%] mt-12 text-center font-extrabold tracking-tight text-white sm:text-5xl md:text-[6.5rem] lg:text-[9rem] 2xl:text-[14rem]">
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

      {/* Footer positioned on top of image */}
      <div className="lg:mt-auto md:-mt-[40%] -mt-[26%] bottom-0 left-0 w-full z-40">
        <Footer />
      </div>
    </div>
  );
}

export default Home;