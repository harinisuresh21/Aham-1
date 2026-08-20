import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';

const Hero = () => {
  return (
    <div className="relative bg-brand-cream-light overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1611077544775-47672db91e70?auto=format&fit=crop&q=80&w=2000" 
          alt="Natural wellness ingredients" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream-light via-brand-cream-light/80 to-transparent"></div>
      </div>

      <Container className="relative z-10">
        <div className="py-20 md:py-32 lg:py-40 max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-brand-primary mb-6 leading-tight">
            Purity in Every <br/><span className="text-brand-accent italic">Tradition</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-charcoal/80 mb-10 max-w-xl font-sans">
            Rediscover ancient wellness through our premium selection of natural turmeric, cold-pressed oils, and authentic remedies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto px-10">Shop the Collection</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 border-brand-primary/20 bg-white/50 backdrop-blur-sm">Our Story</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
