import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="bg-brand-primary text-brand-cream py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-serif font-semibold tracking-wide text-brand-cream-light mb-4 block">
              AHAM
            </Link>
            <p className="text-sm text-brand-cream/80 max-w-xs">
              Traditional knowledge presented through a modern premium ecommerce experience. Natural, pure, and authentic.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-4 text-brand-accent">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-sm text-brand-cream/80 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/categories/turmeric" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Turmeric</Link></li>
              <li><Link to="/categories/traditional-oils" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Traditional Oils</Link></li>
              <li><Link to="/categories/wellness" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Wellness</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-4 text-brand-accent">About</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-brand-cream/80 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-brand-accent">Account</h4>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/profile" className="text-sm text-brand-cream/80 hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/orders" className="text-sm text-brand-cream/80 hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-brand-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-cream/60">
            &copy; {new Date().getFullYear()} AHAM. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-brand-cream/60 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-brand-cream/60 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
