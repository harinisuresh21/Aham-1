import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { products } from '../data/products';
import { ShieldCheck, Truck } from 'lucide-react';

const Checkout = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Mock cart items
  const cartItems = [
    { id: 1, product: products[0], quantity: 2 },
    { id: 2, product: products[1], quantity: 1 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="bg-brand-cream-light py-20 min-h-[calc(100vh-80px)]">
        <Container className="max-w-2xl text-center">
          <div className="bg-white border border-brand-border p-12 shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-serif text-brand-primary mb-4">Order Placed Successfully</h1>
            <p className="text-lg text-brand-muted mb-8">Thank you for choosing AHAM. Your order has been confirmed.</p>
            
            <div className="bg-brand-cream/50 border border-brand-border p-6 mb-10 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brand-muted uppercase">Order Number</p>
                  <p className="font-medium">#AHM-10023</p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted uppercase">Payment Method</p>
                  <p className="font-medium">Cash on Delivery</p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted uppercase">Total Amount</p>
                  <p className="font-medium">₹{total}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/orders/AHM-10023"><Button variant="outline">View Order Details</Button></Link>
              <Link to="/products"><Button>Continue Shopping</Button></Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <Container>
        <h1 className="text-4xl font-serif text-brand-primary mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              <div className="bg-white border border-brand-border p-8">
                <h2 className="text-2xl font-serif text-brand-primary mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Email Address" type="email" required />
                  <Input label="Phone Number" type="tel" required />
                </div>
              </div>

              <div className="bg-white border border-brand-border p-8">
                <h2 className="text-2xl font-serif text-brand-primary mb-6">Delivery Address</h2>
                <div className="space-y-6">
                  <Input label="Full Name" required />
                  <Input label="Address Line 1" required />
                  <Input label="Address Line 2 (Optional)" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="City" required />
                    <Input label="State" required />
                    <Input label="Postal Code" required />
                    <Input label="Country" defaultValue="India" required />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-brand-border p-8">
                <h2 className="text-2xl font-serif text-brand-primary mb-6">Payment Method</h2>
                <div className="border border-brand-primary bg-brand-cream/30 p-4 flex items-start gap-4">
                  <input type="radio" id="cod" name="payment" defaultChecked className="mt-1" />
                  <div>
                    <label htmlFor="cod" className="font-medium text-brand-charcoal block mb-1">Cash on Delivery (COD)</label>
                    <p className="text-sm text-brand-muted">Payment will be collected at the time of delivery.</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full text-lg h-14" type="submit">Place Order</Button>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-brand-border p-8 sticky top-24">
              <h2 className="font-serif text-2xl text-brand-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-brand-cream border border-brand-border flex-shrink-0 relative">
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-brand-muted text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-brand-charcoal line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm font-medium text-brand-charcoal mt-1">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-brand-border pt-6 space-y-4 mb-6">
                <div className="flex justify-between text-brand-charcoal text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal text-sm">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="border-t border-brand-border pt-4 mt-4 flex justify-between text-lg font-medium text-brand-primary">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <div className="bg-brand-cream-light p-4 flex items-start gap-3 border border-brand-border">
                <Truck className="text-brand-primary flex-shrink-0" size={20} />
                <p className="text-xs text-brand-charcoal">Expected delivery in 3-5 business days. Safe and secure packaging.</p>
              </div>
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default Checkout;
