import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import Container from './Container';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-cream-light/90 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          
          {/* Mobile Menu & Search */}
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-brand-charcoal hover:text-brand-primary transition-colors">
              <Menu size={24} />
            </button>
            <button className="text-brand-charcoal hover:text-brand-primary transition-colors">
              <Search size={20} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium text-brand-charcoal hover:text-brand-primary transition-colors">Shop</Link>
            <Link to="/categories/turmeric" className="text-sm font-medium text-brand-charcoal hover:text-brand-primary transition-colors">Turmeric</Link>
            <Link to="/categories/traditional-oils" className="text-sm font-medium text-brand-charcoal hover:text-brand-primary transition-colors">Oils</Link>
            <Link to="/about" className="text-sm font-medium text-brand-charcoal hover:text-brand-primary transition-colors">Our Story</Link>
          </nav>

          {/* Logo */}
          <div className="flex-1 flex justify-center lg:flex-none">
            <Link to="/" className="text-3xl font-serif font-semibold tracking-wide text-brand-primary">
              AHAM
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="hidden lg:block text-brand-charcoal hover:text-brand-primary transition-colors">
              <Search size={20} />
            </button>
            <Link to="/login" className="text-brand-charcoal hover:text-brand-primary transition-colors flex items-center gap-2">
              <User size={20} />
              <span className="hidden lg:block text-sm font-medium">Account</span>
            </Link>
            <Link to="/cart" className="text-brand-charcoal hover:text-brand-primary transition-colors relative flex items-center gap-2">
              <ShoppingCart size={20} />
              <span className="hidden lg:block text-sm font-medium">Cart</span>
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white">
                0
              </span>
            </Link>
          </div>
          
        </div>
      </Container>
    </header>
  );
};

export default Header;
