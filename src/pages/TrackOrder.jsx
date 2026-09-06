import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Download, 
  Phone, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { products } from '../data/products';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

// Mock order database for demo
const mockOrders = {
  'AHM-10023': {
    id: 'AHM-10023',
    trackingNumber: 'BLUEDART-849204128IN',
    courier: 'Blue Dart Express',
    date: 'Aug 15, 2026',
    estimatedDelivery: 'Aug 19, 2026',
    currentStep: 4,
    status: 'OUT_FOR_DELIVERY',
    statusText: 'Out for Delivery',
    recipientName: 'Priya Sundaram',
    recipientPhone: '+91 98765 43210',
    deliveryAddress: 'No. 42, 3rd Cross, Indiranagar, Bengaluru, Karnataka - 560038',
    paymentMethod: 'Google Pay / UPI',
    total: 849,
    subtotal: 849,
    shipping: 0,
    items: [
      { product: products[0], quantity: 1, price: 399 },
      { product: products[1], quantity: 1, price: 450 },
    ],
    timeline: [
      { title: 'Out for Delivery', time: 'Today, 09:30 AM', location: 'Indiranagar Hub, Bengaluru', description: 'Courier agent is on the way.', completed: true, current: true },
      { title: 'Arrived at Local Sorting Hub', time: 'Today, 06:15 AM', location: 'Bengaluru Central Distribution Centre', description: 'Package sorted.', completed: true, current: false },
      { title: 'Shipped / In Transit', time: 'Yesterday, 08:45 PM', location: 'Salem Gateway Hub', description: 'Package departed facility.', completed: true, current: false },
      { title: 'Order Placed', time: 'Aug 15, 2026, 11:20 AM', location: 'Online Store', description: 'Payment verified.', completed: true, current: false },
    ],
  },
};

const steps = [
  { id: 1, name: 'Order Placed' },
  { id: 2, name: 'Processing' },
  { id: 3, name: 'Shipped' },
  { id: 4, name: 'Out for Delivery' },
  { id: 5, name: 'Delivered' },
];

const TrackOrder = () => {
  const { id } = useParams();
  const toast = useToast();
  const { user } = useAuth();

  const [orderIdInput, setOrderIdInput] = useState(id || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [activeOrderId, setActiveOrderId] = useState(id || '');

  const userOrder = activeOrderId ? orderService.getOrderById(user?.email, activeOrderId) : null;
  const sampleOrder = mockOrders[activeOrderId];

  const order = userOrder || sampleOrder || null;

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      toast.error('Please enter a valid Order ID (e.g. AHM-10023)', 'Order ID Required');
      return;
    }

    const cleanId = orderIdInput.trim().toUpperCase();
    setActiveOrderId(cleanId);
    
    const found = orderService.getOrderById(user?.email, cleanId) || mockOrders[cleanId];
    if (found) {
      toast.success(`Tracking details loaded for Order #${cleanId}`, 'Tracking Updated');
    } else {
      toast.info(`No order found matching #${cleanId} under your account.`, 'Tracking Search');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <Badge variant="primary" className="bg-green-700 text-white font-medium px-3 py-1 flex items-center gap-1">
            <CheckCircle2 size={13} /> Delivered
          </Badge>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <Badge variant="accent" className="bg-brand-accent text-white font-medium px-3 py-1 animate-pulse flex items-center gap-1">
            <Truck size={13} /> Out for Delivery
          </Badge>
        );
      case 'IN_TRANSIT':
      case 'SHIPPED':
        return (
          <Badge variant="secondary" className="bg-blue-600 text-white font-medium px-3 py-1 flex items-center gap-1">
            <Truck size={13} /> Shipped / In Transit
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-brand-secondary text-white font-medium px-3 py-1 flex items-center gap-1">
            <Clock size={13} /> Processing Order
          </Badge>
        );
    }
  };

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-accent block mb-2">
            Live Shipment Monitoring
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-primary font-bold mb-3">
            Track Your Order
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed">
            Enter your Order ID to inspect real-time tracking milestones.
          </p>
        </div>

        {/* Top Search Bar */}
        <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm max-w-3xl mx-auto mb-12">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1.5 flex items-center gap-1.5">
                  <Package size={14} className="text-brand-primary" /> Order ID / Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. AHM-10023"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="w-full border border-brand-border bg-white px-3 py-2.5 pl-9 text-sm text-brand-charcoal font-mono uppercase focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
                    required
                  />
                  <Search size={15} className="absolute left-3 top-3 text-brand-muted" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-brand-primary" /> Registered Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full border border-brand-border bg-white px-3 py-2.5 pl-9 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
                  />
                  <Phone size={15} className="absolute left-3 top-3 text-brand-muted" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="md" className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md">
                <Truck size={16} /> Track Status
              </Button>
            </div>
          </form>
        </div>

        {/* Main Order Card */}
        {order ? (
          <div className="space-y-8">
            <div className="bg-white border border-brand-border shadow-sm rounded-sm overflow-hidden">
              <div className="p-6 lg:p-8 bg-brand-cream/40 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-2xl lg:text-3xl font-serif text-brand-primary font-bold">
                      Order #{order.id || order.orderId}
                    </h2>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-muted">
                    Placed on <strong className="text-brand-charcoal font-semibold">{order.date}</strong> • Total:{' '}
                    <strong className="text-brand-primary font-bold">₹{order.total}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream transition-colors rounded shadow-2xs"
                  >
                    <Download size={14} /> Download Receipt
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 lg:p-8">
                <h3 className="text-lg font-serif text-brand-primary font-bold mb-4">Ordered Items</h3>
                <div className="divide-y divide-brand-border border-t border-b border-brand-border">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-brand-charcoal">{item.name || item.product?.name || 'Organic Item'}</p>
                        <p className="text-xs text-brand-muted">Quantity: {item.quantity || item.qty || 1}</p>
                      </div>
                      <span className="font-bold text-brand-primary">₹{(item.price || 0) * (item.quantity || item.qty || 1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-brand-border p-12 text-center rounded-sm mb-12 shadow-sm max-w-2xl mx-auto">
            <Package className="w-16 h-16 text-brand-muted mx-auto mb-4 opacity-40" />
            <h3 className="text-xl font-serif font-bold text-brand-primary mb-2">No Order Found</h3>
            <p className="text-sm text-brand-muted max-w-md mx-auto mb-6">
              {activeOrderId
                ? `We could not find any active shipment matching #${activeOrderId} under your account (${user?.email || 'Guest'}).`
                : 'Enter your Order ID above to check live shipment tracking.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/orders">
                <Button variant="outline" className="w-full sm:w-auto">View My Orders</Button>
              </Link>
              <Link to="/products">
                <Button className="w-full sm:w-auto">Discover Products</Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default TrackOrder;
