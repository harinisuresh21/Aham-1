import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { products } from '../data/products';

const Cart = () => {
  // Mock cart items based on our product data
  const cartItems = [
    { id: 1, product: products[0], quantity: 2 },
    { id: 2, product: products[1], quantity: 1 },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 50; // Mock shipping cost
  const total = subtotal + shipping;

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-screen">
      <Container>
        <h1 className="text-4xl font-serif text-brand-primary mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {cartItems.length > 0 ? (
              <div className="bg-white border border-brand-border">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-6 border-b border-brand-border bg-brand-cream/30 text-sm font-medium text-brand-muted">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                {/* Items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-6 border-b border-brand-border items-center">
                    <div className="col-span-1 sm:col-span-6 flex gap-4">
                      <div className="w-24 h-24 bg-brand-cream border border-brand-border flex-shrink-0">
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link to={`/products/${item.product.slug}`} className="font-medium text-brand-charcoal hover:text-brand-primary line-clamp-2">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-brand-muted mt-1">{item.product.weight}</p>
                        
                        <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-3 w-fit sm:hidden">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                      <span className="sm:hidden text-sm text-brand-muted">Price:</span>
                      <span className="font-medium text-brand-charcoal">₹{item.product.price}</span>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                      <span className="sm:hidden text-sm text-brand-muted">Qty:</span>
                      <div className="flex items-center border border-brand-border">
                        <button className="px-2 py-1 text-brand-muted hover:bg-brand-cream"><Minus size={14} /></button>
                        <span className="px-2 text-sm font-medium">{item.quantity}</span>
                        <button className="px-2 py-1 text-brand-muted hover:bg-brand-cream"><Plus size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center">
                      <span className="sm:hidden text-sm text-brand-muted">Total:</span>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-medium text-brand-charcoal">₹{item.product.price * item.quantity}</span>
                        <button className="hidden sm:flex text-xs text-brand-muted hover:text-red-500 items-center gap-1 transition-colors">
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-brand-border p-12 text-center">
                <p className="text-lg text-brand-muted mb-6">Your cart is empty.</p>
                <Link to="/products">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-brand-border p-8 sticky top-24">
              <h2 className="font-serif text-2xl text-brand-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-brand-charcoal">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="border-t border-brand-border pt-4 mt-4 flex justify-between text-lg font-medium text-brand-primary">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="block w-full">
                <Button className="w-full flex justify-between items-center px-6">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-brand-muted mt-4">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Cart;
