import React, { useState, useEffect } from 'react';
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
  FileText
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
      { name: products[0]?.name || 'Aham Natural Turmeric Powder', quantity: 1, price: 399 },
      { name: products[1]?.name || 'Cold-Pressed Sesame Oil (Mara Chekku)', quantity: 1, price: 450 },
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
  const [liveOrder, setLiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (activeOrderId) {
      setLoading(true);
      orderService.fetchOrderByNumber(activeOrderId, user?.email).then((res) => {
        if (isMounted) {
          setLiveOrder(res);
          setLoading(false);
        }
      });
    } else {
      setLiveOrder(null);
    }
    return () => { isMounted = false; };
  }, [activeOrderId, user?.email]);

  const sampleOrder = mockOrders[activeOrderId];
  const order = liveOrder || sampleOrder || null;

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      toast.error('Please enter a valid Order ID (e.g. AHM-10023)', 'Order ID Required');
      return;
    }

    setLoading(true);
    const found = await orderService.fetchOrderByNumber(orderIdInput.trim(), user?.email);
    setLoading(false);

    if (found) {
      setActiveOrderId(found.id || found.orderId);
      setLiveOrder(found);
      toast.success(`Found live shipment details for order #${found.id || found.orderId}`);
    } else if (mockOrders[orderIdInput.trim().toUpperCase()]) {
      const cleanId = orderIdInput.trim().toUpperCase();
      setActiveOrderId(cleanId);
      setLiveOrder(mockOrders[cleanId]);
      toast.success(`Found shipment details for order #${cleanId}`);
    } else {
      setActiveOrderId(orderIdInput.trim());
      setLiveOrder(null);
      toast.error(`No order found matching "${orderIdInput}". Please check the ID or contact support.`, 'Not Found');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="success" className="gap-1 bg-green-100 text-green-800 border-green-200"><CheckCircle2 size={12} /> Delivered</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="warning" className="gap-1 bg-amber-100 text-amber-800 border-amber-300"><Truck size={12} /> Out for Delivery</Badge>;
      case 'IN_TRANSIT':
      case 'SHIPPED':
        return <Badge variant="info" className="gap-1 bg-blue-100 text-blue-800 border-blue-200"><Truck size={12} /> In Transit</Badge>;
      case 'PROCESSING':
        return <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-800 border-purple-200"><Clock size={12} /> Processing</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Processing'}</Badge>;
    }
  };

  const getStepNumber = (status) => {
    switch (status) {
      case 'DELIVERED': return 5;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'IN_TRANSIT':
      case 'SHIPPED': return 3;
      case 'PROCESSING': return 2;
      default: return 1;
    }
  };

  const currentStep = order?.currentStep || getStepNumber(order?.status);

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <Container>
        {/* Header Title */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-2 block">
            Shipment Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-3">
            Track Your Sacred Delivery
          </h1>
          <p className="text-sm sm:text-base text-brand-muted font-sans leading-relaxed">
            Monitor the real-time journey of your handcrafted Ayurvedic essentials from our sacred soil to your doorstep.
          </p>
        </div>

        {/* 1. Track Search Input Card */}
        <div className="bg-white border border-brand-border p-6 sm:p-8 max-w-2xl mx-auto shadow-sm mb-12 rounded-sm">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. AHM-10023"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-cream-light border border-brand-border text-brand-charcoal text-sm rounded-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal uppercase tracking-wider mb-2">
                  Phone or Email (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
                  <input
                    type="text"
                    placeholder="Mobile or email"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-brand-cream-light border border-brand-border text-brand-charcoal text-sm rounded-sm focus:outline-none focus:border-brand-primary focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="md" disabled={loading} className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md">
                <Truck size={16} /> {loading ? 'Tracking...' : 'Track Status'}
              </Button>
            </div>
          </form>
        </div>

        {/* 2. Main Tracking Card */}
        {order ? (
          <div className="bg-white border border-brand-border shadow-sm mb-12 rounded-sm overflow-hidden">
            
            {/* Header Banner */}
            <div className="p-6 lg:p-8 bg-brand-cream/40 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl lg:text-3xl font-serif text-brand-primary font-bold">
                    Order #{order.id || order.orderId}
                  </h2>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-xs sm:text-sm text-brand-muted">
                  Order Placed on <strong className="text-brand-charcoal font-semibold">{order.date}</strong> • Courier:{' '}
                  <strong className="text-brand-charcoal font-semibold">{order.courier || 'Blue Dart Express'}</strong> {order.trackingNumber ? `(AWB: ${order.trackingNumber})` : ''}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/orders/${order.id || order.orderId}/invoice`}
                  className="inline-flex items-center gap-2 border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream hover:border-brand-primary transition-colors rounded shadow-2xs"
                >
                  <FileText size={14} className="text-brand-primary" /> View Invoice
                </Link>
                <a
                  href={`https://www.google.com/search?q=${order.trackingNumber || order.id || order.orderId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 text-xs font-semibold hover:bg-opacity-90 transition-colors rounded shadow-xs"
                >
                  <ExternalLink size={14} /> Live Courier Link
                </a>
              </div>
            </div>

            {/* 3. STEP-BY-STEP VISUAL STATUS TRACKER BAR */}
            <div className="p-6 lg:p-10 border-b border-brand-border bg-white">
              <h3 className="text-xs uppercase tracking-widest text-brand-muted font-bold mb-8">
                Live Shipment Milestones
              </h3>

              <div className="relative">
                {/* Progress Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-brand-cream z-0">
                  <div
                    className="h-full bg-brand-primary transition-all duration-700"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>
                </div>

                {/* 5-Step Visual Stepper Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {steps.map((step) => {
                    const isCompleted = step.id <= currentStep;
                    const isCurrent = step.id === currentStep;

                    return (
                      <div
                        key={step.id}
                        className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3"
                      >
                        {/* Step Circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                            isCompleted
                              ? 'bg-brand-primary text-white shadow-md'
                              : 'bg-brand-cream border-2 border-brand-border text-brand-muted'
                          } ${isCurrent ? 'ring-4 ring-brand-accent/50 scale-110 shadow-lg' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 size={20} /> : step.id}
                        </div>

                        {/* Step Label */}
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              isCurrent
                                ? 'text-brand-primary font-bold'
                                : isCompleted
                                ? 'text-brand-charcoal'
                                : 'text-brand-muted'
                            }`}
                          >
                            {step.name}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-brand-accent/20 text-brand-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Delivery Information Box */}
              <div className="mt-8 p-4 bg-brand-cream-light/80 border border-brand-border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-muted font-medium">Estimated Arrival</p>
                    <p className="text-sm font-bold text-brand-primary">{order.estimatedDelivery || 'Within 2-4 business days'}</p>
                  </div>
                </div>
                <div className="text-xs text-brand-charcoal/80 flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={16} className="text-brand-primary" /> Tamper-Evident Vedic Packaging
                </div>
              </div>
            </div>

            {/* 4. Details Grid: Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8 bg-white border-b border-brand-border">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-brand-muted font-bold mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-brand-primary" /> Delivery Destination
                </h4>
                <p className="font-semibold text-brand-charcoal text-sm">{order.recipientName || user?.name || 'Valued Customer'}</p>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{order.deliveryAddress || 'Address on file'}</p>
                {order.recipientPhone && (
                  <p className="text-xs text-brand-muted mt-1 font-mono">Contact: {order.recipientPhone}</p>
                )}
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest text-brand-muted font-bold mb-3 flex items-center gap-2">
                  <CreditCard size={14} className="text-brand-primary" /> Payment & Billing
                </h4>
                <p className="font-semibold text-brand-charcoal text-sm">{order.paymentMethod || 'Prepaid Online (Razorpay / UPI)'}</p>
                <p className="text-xs text-brand-muted mt-1">Status: Paid in Full</p>
                <p className="text-xs font-bold text-brand-primary mt-1">Total Paid: ₹{order.total}</p>
              </div>
            </div>

            {/* 5. Ordered Items List */}
            <div className="p-6 lg:p-8 bg-brand-cream/20">
              <h4 className="text-xs uppercase tracking-widest text-brand-muted font-bold mb-4">
                Items in This Shipment ({order.items?.length || 1})
              </h4>
              <div className="divide-y divide-brand-border border-t border-b border-brand-border bg-white rounded-sm">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center text-sm">
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
