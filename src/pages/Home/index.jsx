import React from 'react';
import Hero from './Hero';
import FeaturedProducts from './FeaturedProducts';
import Categories from './Categories';
import BrandStory from './BrandStory';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <BrandStory />
    </div>
  );
};

export default Home;
