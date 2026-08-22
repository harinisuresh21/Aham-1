import React from 'react';
import Hero from './Hero/Hero';
import SignatureProducts from './SignatureProducts';
import Categories from './Categories';
import BrandStatement from './BrandStatement';

const Home = () => {
  return (
    <div>
      <Hero />
      <BrandStatement />
      <SignatureProducts />
      <Categories />
    </div>
  );
};

export default Home;
