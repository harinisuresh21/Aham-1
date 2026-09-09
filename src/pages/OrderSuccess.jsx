import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Copy, 
  Check, 
  Download, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { products } from '../data/products';
import turmericEssenceImg from '../assets/turmeric-essence.jpeg';
import forestHoneyImg from '../assets/forest-honey.jpeg';

const OrderSuccess = () => {
  const location = useLocation();
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  // Retrieve passed state from Checkout or fallback to default sample order
  const orderData = location.state?.order || {
    orderId: 'AHM-10023',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    estimatedDelivery: 'Aug 19, 2026',
    recipientName: 'Priya Sundaram',
    recipientPhone: '+91 98765 43210',
    recipientEmail: 'priya.sundaram@example.com',
    deliveryAddress: 'No. 42, 3rd Cross, 100ft Road, Indiranagar, Bengaluru, Karnataka - 560038',
    paymentMethod: 'Google Pay / UPI',
    total: 849,
    subtotal: 849,
    shipping: 0,
    codHandlingFee: 0,
    items: [
      {
        id: 'prod-1',
        name: 'Aham Natural Turmeric Powder',
        price: 399,
        quantity: 1,
        weight: '250g',
        image: turmericEssenceImg,
        slug: 'aham-natural-turmeric-powder'
      },
      {
        id: 'prod-2',
        name: 'Cold-Pressed Sesame Oil (Mara Chekku)',
        price: 450,
        quantity: 1,
        weight: '500ml',
        image: 'https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800',
        slug: 'cold-pressed-sesame-oil'
      }
    ]
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    setCopied(true);
    toast.success(`Order ID #${orderData.orderId} copied to clipboard!`, 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* 1. Success Hero Card with Checkmark Animation */}
          <div className="bg-white border border-brand-border p-8 sm:p-12 shadow-sm rounded-sm text-center relative overflow-hidden">
            
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>

            {/* Green Checkmark Animation Circle */}
            <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-20 h-20 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center shadow-lg text-green-700 animate-in zoom-in-75 duration-500">
                <CheckCircle2 size={46} className="text-green-700 stroke-[2.2]" />
              </div>
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-brand-accent block mb-1">
              Order Confirmed & Payment Verified
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-3 leading-tight">
              Order Placed Successfully!
            </h1>

            <p className="text-sm sm:text-base text-brand-charcoal/80 max-w-lg mx-auto leading-relaxed mb-6 font-sans">
              Thank you, <strong className="text-brand-primary font-semibold">{orderData.recipientName}</strong>! Your order is registered in our farm dispatch system and will be packaged with traditional care.
            </p>

            {/* Order Tracking ID Pill Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-brand-cream/80 border border-brand-border px-5 py-2.5 rounded-full shadow-2xs mb-8">
              <span className="text-xs text-brand-muted uppercase font-semibold">Tracking ID:</span>
              <strong className="text-brand-primary font-mono text-base tracking-wider font-bold">
                #{orderData.orderId}
              </strong>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="inline-flex items-center gap-1 text-xs text-brand-primary hover:text-brand-accent font-semibold ml-1 transition-colors"
                title="Copy Tracking ID"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Delivery Timeline Step-Indicator */}
            <div className="pt-6 border-t border-brand-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-brand-cream-light/60 border border-brand-border rounded flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-primary">Order Received</h4>
                  <p className="text-xs text-brand-muted mt-0.5">Payment Verified • {orderData.date}</p>
                </div>
              </div>

              <div className="p-4 bg-brand-cream-light/60 border border-brand-border rounded flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-primary">Packaging</h4>
                  <p className="text-xs text-brand-muted mt-0.5">Eco-Amber Protective Glass</p>
                </div>
              </div>

              <div className="p-4 bg-brand-cream-light/60 border border-brand-border rounded flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brand-primary">Delivery</h4>
                  <p className="text-xs text-green-700 font-semibold mt-0.5">Est. {orderData.estimatedDelivery || '3-5 business days'}</p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row justify-center gap-4">
              <Link to={`/orders/${orderData.orderId}`}>
                <Button size="lg" variant="accent" className="w-full sm:w-auto gap-2 font-semibold shadow-md">
                  <Truck size={18} /> Track Your Order
                </Button>
              </Link>

              <Link to={`/orders/${orderData.orderId}/invoice`}>
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-brand-border bg-white px-6 py-3.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-cream hover:border-brand-primary transition-colors rounded cursor-pointer shadow-2xs"
                >
                  <FileText size={16} className="text-brand-primary" /> View & Print Invoice
                </button>
              </Link>

              <Link to="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* 2. Purchase Summary Breakdown Card */}
          <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-brand-primary pb-3 border-b border-brand-border">
              Purchase Summary Breakdown
            </h2>

            {/* Items List */}
            <div className="divide-y divide-brand-border">
              {orderData.items.map((item, index) => {
                const itemImg = item.image || item.images?.[0]?.url || (item.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg);

                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-brand-cream border border-brand-border flex-shrink-0 rounded-xl overflow-hidden relative">
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="object-cover w-full h-full rounded-xl"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = item.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg;
                          }}
                        />
                        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-brand-charcoal line-clamp-1">{item.name}</h4>
                        {item.weight && <p className="text-xs text-brand-muted mt-0.5">Pack: {item.weight}</p>}
                        <p className="text-xs font-medium text-brand-charcoal mt-1">₹{item.price} × {item.quantity || 1}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base text-brand-primary">
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-brand-border space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-charcoal">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderData.subtotal}</span>
              </div>

              <div className="flex justify-between text-brand-charcoal">
                <span>Standard Delivery</span>
                <span className="font-medium">
                  {orderData.shipping === 0 ? (
                    <span className="text-green-700 font-bold">FREE</span>
                  ) : (
                    `₹${orderData.shipping}`
                  )}
                </span>
              </div>

              {orderData.codHandlingFee > 0 && (
                <div className="flex justify-between text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <span>COD Handling Fee</span>
                  <span className="font-bold">+₹{orderData.codHandlingFee}</span>
                </div>
              )}

              <div className="border-t border-brand-border pt-3 mt-3 flex justify-between items-baseline text-brand-primary">
                <span className="font-serif text-base font-bold">Total Paid / Due</span>
                <span className="text-2xl font-bold">₹{orderData.total}</span>
              </div>
            </div>
          </div>

          {/* 3. Shipping Destination & Payment Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Delivery Address Details */}
            <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
              <h3 className="font-serif text-base font-bold text-brand-primary mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-brand-primary" /> Delivery Destination
              </h3>
              <p className="text-sm font-semibold text-brand-charcoal">{orderData.recipientName}</p>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed mt-1">{orderData.deliveryAddress}</p>
              <div className="mt-3 pt-3 border-t border-brand-border/60 space-y-1 text-xs text-brand-muted">
                <p className="flex items-center gap-1.5"><Phone size={13} className="text-brand-primary" /> {orderData.recipientPhone}</p>
                {orderData.recipientEmail && <p className="flex items-center gap-1.5"><Mail size={13} className="text-brand-primary" /> {orderData.recipientEmail}</p>}
              </div>
            </div>

            {/* Payment & Quality Assurance */}
            <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-brand-primary mb-3 flex items-center gap-2">
                  <CreditCard size={16} className="text-brand-primary" /> Payment Method
                </h3>
                <p className="text-sm font-semibold text-brand-charcoal">{orderData.paymentMethod}</p>
                <span className="inline-flex items-center gap-1 text-[11px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded mt-1.5">
                  <Check size={12} /> Status: Confirmed
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center gap-2 text-xs text-brand-muted">
                <ShieldCheck size={16} className="text-green-700 flex-shrink-0" />
                <span>100% Single-Origin & Vedic Quality Seal</span>
              </div>
            </div>

          </div>

        </div>
      </Container>
    </div>
  );
};

export default OrderSuccess;
