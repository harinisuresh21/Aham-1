import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Heart, Search, Package } from 'lucide-react';
import logoImg from '../../assets/aham-logo.png';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const containerClass = isHome
    ? "fixed top-4 sm:top-5 lg:top-8 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] max-w-[1400px] mx-auto pointer-events-none"
    : "sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-[clamp(32px,5vw,80px)] max-w-[1400px] mx-auto pointer-events-none mb-4";

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
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
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[13px] lg:text-[14px] font-semibold transition-colors ${
                  location.pathname === link.to
                    ? 'text-[#71835B]'
                    : 'text-[#1B3022] hover:text-[#71835B]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 items-center justify-center text-[#1B3022] transition-colors relative shadow-sm"
            >
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Profile / Sign In */}
            <Link
              to="/profile"
              className="hidden sm:flex text-[13px] lg:text-[14px] font-semibold text-[#1B3022] hover:text-[#71835B] transition-colors items-center gap-1.5"
            >
              <User size={16} />
              <span className="hidden lg:inline">Account</span>
            </Link>

            {/* Cart Icon with Dynamic Badge */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#1B3022] transition-colors relative shadow-sm"
            >
              <ShoppingCart size={17} />
              <span
                className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm transition-all duration-300 ${
                  cartCount > 0
                    ? 'bg-[#243D2B] scale-100'
                    : 'bg-[#243D2B]/60 scale-90'
                }`}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </Link>

            {/* Shop Now CTA */}
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-xl sm:rounded-full bg-[#243D2B] hover:bg-[#1B3022] text-white text-[12px] sm:text-[13px] font-semibold tracking-wide shadow-sm hover:shadow transition-all"
            >
              Shop Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center text-[#1B3022] transition-colors shadow-sm"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <img src={logoImg} alt="AHAM" className="h-8 object-contain" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center text-brand-charcoal"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 p-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-semibold rounded transition-colors ${
                    location.pathname === link.to
                      ? 'bg-brand-cream text-brand-primary'
                      : 'text-brand-charcoal hover:bg-brand-cream/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-brand-border pt-3 mt-3 space-y-1">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-brand-charcoal hover:bg-brand-cream/50 rounded"
                >
                  <span className="flex items-center gap-2"><Heart size={16} className="text-red-500" /> Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm font-medium text-brand-charcoal hover:bg-brand-cream/50 rounded"
                >
                  <span className="flex items-center gap-2"><ShoppingCart size={16} /> Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-brand-charcoal hover:bg-brand-cream/50 rounded"
                >
                  <Package size={16} /> My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-brand-charcoal hover:bg-brand-cream/50 rounded"
                >
                  <User size={16} /> Account
                </Link>
              </div>
            </nav>

            <div className="p-5 border-t border-brand-border">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 bg-[#243D2B] text-white text-sm font-semibold rounded-full shadow-sm"
              >
                Shop All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
