import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';

const BrandStory = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/5] relative z-10 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000" 
                alt="Traditional ingredients" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 w-2/3 aspect-square bg-brand-cream -z-10"></div>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-10">
            <h2 className="text-4xl lg:text-5xl font-serif text-brand-primary mb-6">
              Rooted in Nature, <br/>
              <span className="italic text-brand-accent">Perfected by Time</span>
            </h2>
            <p className="text-lg text-brand-charcoal/80 mb-6 font-sans leading-relaxed">
              At AHAM, we believe that true wellness comes from the earth. We source the purest ingredients from traditional farms, respecting the ancient processes that preserve their natural potency.
            </p>
            <p className="text-lg text-brand-charcoal/80 mb-10 font-sans leading-relaxed">
              Our products are not just commodities; they are a bridge to a simpler, healthier way of living inspired by generations of knowledge.
            </p>
            <Link to="/about">
              <Button size="lg" variant="outline">Discover Our Journey</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandStory;
