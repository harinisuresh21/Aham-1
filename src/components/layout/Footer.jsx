import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';

const Footer = () => {
  return (
    <footer className="bg-[#F5F0E4] text-[#243D2B] border-t border-[#243D2B]/10">
      <Container className="py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 mb-10">
          
          <div className="md:col-span-5 flex flex-col items-start">
            <Link to="/" className="text-2xl font-serif text-[#243D2B] tracking-wide mb-3 block hover:opacity-80 transition-opacity">
              AHAM
            </Link>
            <p className="text-xs font-sans text-[#243D2B]/70 max-w-[260px] leading-relaxed">
              Traditional knowledge presented through a modern premium experience. Natural, pure, and authentic.
            </p>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col">
              <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#243D2B] mb-4">Shop</h4>
              <ul className="space-y-2.5">
                <li><Link to="/products" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">All Products</Link></li>
                <li><Link to="/categories/turmeric" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Turmeric</Link></li>
                <li><Link to="/categories/traditional-oils" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Traditional Oils</Link></li>
                <li><Link to="/categories/wellness" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Wellness</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#243D2B] mb-4">About</h4>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Our Story</Link></li>
                <li><Link to="/contact" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-[11px] font-sans font-semibold tracking-widest uppercase text-[#243D2B] mb-4">Account</h4>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Sign In</Link></li>
                <li><Link to="/profile" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">My Profile</Link></li>
                <li><Link to="/orders" className="text-xs font-sans text-[#243D2B]/70 hover:text-[#47623F] transition-colors">Track Order</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#243D2B]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-sans text-[#243D2B]/50">
            &copy; 2026 AHAM. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-[11px] font-sans text-[#243D2B]/50 hover:text-[#47623F] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[11px] font-sans text-[#243D2B]/50 hover:text-[#47623F] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
