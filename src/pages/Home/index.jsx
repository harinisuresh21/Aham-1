import React from 'react';
import Hero from './Hero/Hero';
import SignatureProducts from './SignatureProducts';
import Categories from './Categories';
import BrandStatement from './BrandStatement';

const Home = () => {
  return (
    <div className="bg-[#FDFAF5] w-full min-h-screen overflow-x-hidden">
      <Hero />
      <SignatureProducts />
      <BrandStatement />
      <Categories />
    </div>
  );
};

export default Home;
