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
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  CreditCard,
  Check,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { products } from '../data/products';
import { useToast } from '../context/ToastContext';

// Mock order database
const mockOrders = {
  'AHM-10023': {
    id: 'AHM-10023',
    trackingNumber: 'BLUEDART-849204128IN',
    courier: 'Blue Dart Express',
    date: 'Aug 15, 2026',
    estimatedDelivery: 'Aug 19, 2026',
    currentStep: 4, // 1 to 5
    status: 'OUT_FOR_DELIVERY',
    statusText: 'Out for Delivery',
    recipient: {
      name: 'Priya Sundaram',
      phone: '+91 98765 43210',
      address: 'No. 42, 3rd Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    payment: {
      method: 'Google Pay / UPI',
      status: 'Paid',
      subtotal: 849,
      shipping: 0,
      discount: 0,
      total: 849,
    },
    items: [
      {
        product: products[0], // Turmeric
        quantity: 1,
        price: 399,
      },
      {
        product: products[1], // Sesame oil
        quantity: 1,
        price: 450,
      },
    ],
    timeline: [
      {
        title: 'Out for Delivery',
        time: 'Today, 09:30 AM',
        location: 'Indiranagar Hub, Bengaluru',
        description: 'Courier agent (Ramesh K. +91 98450 11223) is on the way to your delivery address.',
        completed: true,
        current: true,
      },
      {
        title: 'Arrived at Local Sorting Hub',
        time: 'Today, 06:15 AM',
        location: 'Bengaluru Central Distribution Centre',
        description: 'Package sorted and assigned to last-mile delivery route.',
        completed: true,
        current: false,
      },
      {
        title: 'Shipped / In Transit',
        time: 'Yesterday, 08:45 PM',
        location: 'Salem Gateway Hub, Tamil Nadu',
        description: 'Package departed facility in temperature-controlled transit vehicle.',
        completed: true,
        current: false,
      },
      {
        title: 'Processing & Quality Verification',
        time: 'Aug 16, 2026, 02:00 PM',
        location: 'AHAM Organic Farm Processing Unit, Erode',
        description: 'Packed securely in eco-friendly amber glass protective packaging.',
        completed: true,
        current: false,
      },
      {
        title: 'Order Placed',
        time: 'Aug 15, 2026, 11:20 AM',
        location: 'Online Store',
        description: 'Your payment was verified and order sent to our dispatch facility.',
        completed: true,
        current: false,
      },
    ],
  },
  'AHM-10018': {
    id: 'AHM-10018',
    trackingNumber: 'DELHIVERY-992104812IN',
    courier: 'Delhivery Surface',
    date: 'Jul 02, 2026',
    estimatedDelivery: 'Jul 06, 2026',
    currentStep: 5,
    status: 'DELIVERED',
    statusText: 'Delivered Successfully',
    recipient: {
      name: 'Priya Sundaram',
      phone: '+91 98765 43210',
      address: 'No. 42, 3rd Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    payment: {
      method: 'Cash on Delivery (COD)',
      status: 'Paid on Delivery',
      subtotal: 450,
      shipping: 50,
      codFee: 40,
      total: 540,
    },
    items: [
      {
        product: products[1],
        quantity: 1,
        price: 450,
      },
    ],
    timeline: [
      {
        title: 'Delivered',
        time: 'Jul 06, 2026, 03:45 PM',
        location: 'Delivered to recipient',
        description: 'Package safely handed over and signed by Priya S.',
        completed: true,
        current: true,
      },
      {
        title: 'Out for Delivery',
        time: 'Jul 06, 2026, 09:10 AM',
        location: 'Bengaluru Indiranagar Hub',
        description: 'Out for delivery with delivery associate.',
        completed: true,
        current: false,
      },
      {
        title: 'Shipped',
        time: 'Jul 04, 2026, 07:30 PM',
        location: 'Erode Central Hub',
        description: 'Package in transit via Delhivery Express.',
        completed: true,
        current: false,
      },
      {
        title: 'Processing',
        time: 'Jul 03, 2026, 11:00 AM',
        location: 'AHAM Farm Hub',
        description: 'Traditional wood-pressed packaging completed.',
        completed: true,
        current: false,
      },
      {
        title: 'Order Placed',
        time: 'Jul 02, 2026, 10:15 AM',
        location: 'Online Store',
        description: 'Order confirmed with Cash on Delivery.',
        completed: true,
        current: false,
      },
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

  // Search Fields
  const [orderIdInput, setOrderIdInput] = useState(id || 'AHM-10023');
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');
  const [activeOrderId, setActiveOrderId] = useState(id || 'AHM-10023');

  const order = mockOrders[activeOrderId] || mockOrders['AHM-10023'];

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      toast.error('Please enter a valid Order ID (e.g. AHM-10023)', 'Order ID Required');
      return;
    }

    const cleanId = orderIdInput.trim().toUpperCase();
    if (mockOrders[cleanId]) {
      setActiveOrderId(cleanId);
      toast.success(`Tracking details loaded for Order #${cleanId}`, 'Tracking Updated');
    } else {
      setActiveOrderId(cleanId);
      toast.info(`Showing latest dispatch records for #${cleanId}`, 'Tracking Lookup');
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
            <Clock size={13} /> Processing
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
            Enter your Order ID and registered contact number to get real-time tracking milestones.
          </p>
        </div>

        {/* 1. TOP SEARCH BAR: Order ID & Phone Number Input Fields */}
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
                    required
                  />
                  <Phone size={15} className="absolute left-3 top-3 text-brand-muted" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                <span>Try sample orders:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrderIdInput('AHM-10023');
                    setActiveOrderId('AHM-10023');
                  }}
                  className="bg-brand-cream text-brand-primary px-2.5 py-1 rounded font-mono font-semibold hover:bg-brand-primary hover:text-white transition-colors border border-brand-border"
                >
                  AHM-10023 (Out for Delivery)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderIdInput('AHM-10018');
                    setActiveOrderId('AHM-10018');
                  }}
                  className="bg-brand-cream text-brand-primary px-2.5 py-1 rounded font-mono font-semibold hover:bg-brand-primary hover:text-white transition-colors border border-brand-border"
                >
                  AHM-10018 (Delivered)
                </button>
              </div>

              <Button type="submit" size="md" className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md">
                <Truck size={16} /> Track Status
              </Button>
            </div>
          </form>
        </div>

        {/* 2. Main Tracking Card */}
        <div className="bg-white border border-brand-border shadow-sm mb-12 rounded-sm overflow-hidden">
          
          {/* Header Banner */}
          <div className="p-6 lg:p-8 bg-brand-cream/40 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-2xl lg:text-3xl font-serif text-brand-primary font-bold">
                  Order #{order.id}
                </h2>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs sm:text-sm text-brand-muted">
                Order Placed on <strong className="text-brand-charcoal font-semibold">{order.date}</strong> • Courier:{' '}
                <strong className="text-brand-charcoal font-semibold">{order.courier}</strong> (AWB: {order.trackingNumber})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-cream transition-colors rounded shadow-2xs"
              >
                <Download size={14} /> Download Invoice
              </button>
              <a
                href={`https://www.google.com/search?q=${order.trackingNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 text-xs font-semibold hover:bg-opacity-90 transition-colors rounded shadow-xs"
              >
                <ExternalLink size={14} /> Live Courier Link
              </a>
            </div>
          </div>

          {/* 3. STEP-BY-STEP VISUAL STATUS TRACKER BAR: (Order Placed ➔ Processing ➔ Shipped ➔ Out for Delivery ➔ Delivered) */}
          <div className="p-6 lg:p-10 border-b border-brand-border bg-white">
            <h3 className="text-xs uppercase tracking-widest text-brand-muted font-bold mb-8">
              Live Shipment Milestones
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-brand-cream z-0">
                <div
                  className="h-full bg-brand-primary transition-all duration-700"
                  style={{ width: `${((order.currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>

              {/* 5-Step Visual Stepper Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                {steps.map((step) => {
                  const isCompleted = step.id <= order.currentStep;
                  const isCurrent = step.id === order.currentStep;

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
                          className={`text-sm font-semibold ${
                            isCompleted ? 'text-brand-primary' : 'text-brand-muted'
                          }`}
                        >
                          {step.name}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block mt-0.5 animate-pulse">
                            ● Current Stage
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
                  <p className="text-xs text-brand-muted uppercase font-bold">Estimated Delivery</p>
                  <p className="text-base font-bold text-brand-primary">{order.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <ShieldCheck size={16} className="text-green-700" />
                <span>Zero Contact Delivery with Quality Seal</span>
              </div>
            </div>
          </div>

          {/* 4. Live Activity Milestones */}
          <div className="p-6 lg:p-10 bg-brand-cream-light/30">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6">
              Activity History & Scan Log
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border">
              {order.timeline.map((event, index) => (
                <div key={index} className="relative group">
                  {/* Milestone Marker Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                      event.current
                        ? 'border-brand-accent bg-brand-accent text-white'
                        : event.completed
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-border'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  </div>

                  <div className="bg-white p-4 border border-brand-border rounded shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className="font-semibold text-brand-charcoal text-sm">{event.title}</h4>
                      <span className="text-xs text-brand-muted flex items-center gap-1">
                        <Clock size={12} /> {event.time}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-primary mb-2 flex items-center gap-1">
                      <MapPin size={12} /> {event.location}
                    </p>
                    <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Package Items Breakdown & Delivery Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items Purchased (2 Cols) */}
          <div className="lg:col-span-2 bg-white border border-brand-border p-6 lg:p-8 shadow-sm rounded-sm">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6">
              Package Contents ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="divide-y divide-brand-border">
              {order.items.map((item, idx) => {
                const productImg = item.product?.images?.[0]?.url || item.product?.image || '';

                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                    <div className="w-18 h-18 bg-brand-cream border border-brand-border flex-shrink-0 rounded overflow-hidden">
                      {productImg ? (
                        <img
                          src={productImg}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-brand-muted">
                          Item
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={item.product?.slug ? `/products/${item.product.slug}` : '/products'}
                        className="font-semibold text-brand-charcoal hover:text-brand-primary line-clamp-1 text-sm sm:text-base font-serif"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-xs text-brand-muted mt-0.5">{item.product?.weight || 'Standard Pack'}</p>
                      <p className="text-xs font-semibold text-brand-charcoal mt-1">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-base text-brand-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Payment Info (1 Col) */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
              <h3 className="font-serif text-lg text-brand-primary font-bold mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-brand-primary" /> Delivery Destination
              </h3>
              <p className="text-sm font-semibold text-brand-charcoal">{order.recipient.name}</p>
              <p className="text-xs text-brand-muted leading-relaxed mt-1">{order.recipient.address}</p>
              <p className="text-xs text-brand-muted">
                {order.recipient.city}, {order.recipient.state} - {order.recipient.postalCode}
              </p>
              <p className="text-xs text-brand-charcoal font-medium mt-3 pt-3 border-t border-brand-border flex items-center gap-2">
                <Phone size={14} className="text-brand-primary" /> {order.recipient.phone}
              </p>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
              <h3 className="font-serif text-lg text-brand-primary font-bold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-brand-primary" /> Payment Breakdown
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-brand-charcoal">
                  <span>Payment Mode</span>
                  <span className="font-semibold">{order.payment.method}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{order.payment.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-700">
                    {order.payment.shipping === 0 ? 'FREE' : `₹${order.payment.shipping}`}
                  </span>
                </div>
                {order.payment.codFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>COD Handling Fee</span>
                    <span className="font-medium">₹{order.payment.codFee}</span>
                  </div>
                )}
                <div className="border-t border-brand-border pt-3 mt-3 flex justify-between text-base font-bold text-brand-primary">
                  <span>Total Paid</span>
                  <span>₹{order.payment.total}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default TrackOrder;
