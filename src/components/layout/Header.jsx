import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import logoImg from '../../assets/aham-logo.png';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const containerClass = isHome
    ? "fixed top-4 sm:top-5 lg:top-8 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] max-w-[1400px] mx-auto pointer-events-none"
    : "sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] max-w-[1400px] mx-auto pointer-events-none mb-4";

  return (
    <header className={containerClass}>
      <div className="pointer-events-auto w-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-2xl sm:rounded-full px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between transition-all duration-300">

        {/* LEFT: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center gap-2" aria-label="AHAM Home">
            <img
              src={logoImg}
              alt="AHAM"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain drop-shadow-sm"
            />
          </Link>
        </div>

        {/* CENTER: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-[13px] lg:text-[14px] font-semibold text-[#1B3022] hover:text-[#71835B] transition-colors">Home</Link>
          <Link to="/products" className="text-[13px] lg:text-[14px] font-medium text-[#1B3022]/80 hover:text-[#1B3022] transition-colors">Shop</Link>
          <Link to="/about" className="text-[13px] lg:text-[14px] font-medium text-[#1B3022]/80 hover:text-[#1B3022] transition-colors">Our Story</Link>
          <Link to="/how-it-works" className="text-[13px] lg:text-[14px] font-medium text-[#1B3022]/80 hover:text-[#1B3022] transition-colors">How It Works</Link>
          <Link to="/testimonials" className="text-[13px] lg:text-[14px] font-medium text-[#1B3022]/80 hover:text-[#1B3022] transition-colors">Testimonials</Link>
          <Link to="/faq" className="text-[13px] lg:text-[14px] font-medium text-[#1B3022]/80 hover:text-[#1B3022] transition-colors">FAQ</Link>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="hidden sm:flex text-[13px] lg:text-[14px] font-semibold text-[#1B3022] hover:text-[#71835B] transition-colors items-center gap-1.5"
          >
            <User size={16} />
            <span>Sign In</span>
          </Link>

          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#1B3022] transition-colors relative shadow-sm"
          >
            <ShoppingCart size={17} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#243D2B] text-[9px] font-bold text-white shadow-sm">
              0
            </span>
          </Link>

          <Link
            to="/products"
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-xl sm:rounded-full bg-[#243D2B] hover:bg-[#1B3022] text-white text-[12px] sm:text-[13px] font-semibold tracking-wide shadow-sm hover:shadow transition-all"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open Navigation Menu"
            className="lg:hidden w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#1B3022] transition-colors shadow-sm"
          >
            <Menu size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
