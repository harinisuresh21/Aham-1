import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white border border-brand-border p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center text-xl font-serif">
                  J
                </div>
                <div>
                  <h3 className="font-medium text-brand-charcoal">John Doe</h3>
                  <p className="text-sm text-brand-muted">john@example.com</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <Link to="/profile" className="block px-4 py-3 bg-brand-cream text-brand-primary font-medium border-l-2 border-brand-primary">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent">
                  My Orders
                </Link>
                <Link to="#" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent">
                  Addresses
                </Link>
                <button className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-l-2 border-transparent mt-4">
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 space-y-8">
            
            <div className="bg-white border border-brand-border p-8">
              <h2 className="text-2xl font-serif text-brand-primary mb-6">Personal Information</h2>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue="John Doe" />
                  <Input label="Email Address" type="email" defaultValue="john@example.com" disabled />
                  <Input label="Phone Number" type="tel" defaultValue="+91 98765 43210" />
                </div>
                <Button>Save Changes</Button>
              </form>
            </div>
            
            <div className="bg-white border border-brand-border p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-brand-primary">Addresses</h2>
                <Button variant="outline" size="sm">Add New</Button>
              </div>
              
              <div className="border border-brand-border p-6 relative">
                <div className="absolute top-6 right-6 flex gap-3">
                  <button className="text-sm text-brand-primary hover:underline">Edit</button>
                  <button className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
                
                <span className="bg-brand-cream px-2 py-1 text-xs uppercase tracking-wider text-brand-charcoal mb-3 inline-block font-medium">Default</span>
                <p className="font-medium text-brand-charcoal mb-1">John Doe</p>
                <p className="text-brand-muted text-sm mb-1">+91 98765 43210</p>
                <p className="text-brand-muted text-sm leading-relaxed max-w-sm mt-3">
                  123 Heritage Lane, Apartment 4B, Ayurveda Society<br/>
                  Bengaluru, Karnataka 560001<br/>
                  India
                </p>
              </div>
            </div>

          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default Profile;
