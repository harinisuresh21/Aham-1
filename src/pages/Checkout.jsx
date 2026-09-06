import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  ShieldCheck, 
  Truck, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Lock, 
  MapPin, 
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 50;
const COD_FEE = 40;

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Derive initial first/last name from user.name if available
  const nameParts = (user?.name || 'Priya Sundaram').split(' ');
  const userFirstName = nameParts[0] || '';
  const userLastName = nameParts.slice(1).join(' ') || '';

  // Left Column: Shipping & Contact Form State
  const [formData, setFormData] = useState({
    firstName: userFirstName,
    lastName: userLastName,
    email: user?.email || 'priya.sundaram@example.com',
    phone: user?.phone || '+91 98765 43210',
    street: 'No. 42, 3rd Cross, 100ft Road, Indiranagar',
    landmark: 'Near Defence Colony Ground',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
    saveAddress: true,
  });

  // Right Column: Payment Method State ('upi' | 'card' | 'cod')
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: `${userFirstName} ${userLastName}`.trim(),
    expiry: '',
    cvv: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const codHandlingFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const total = subtotal + shipping + codHandlingFee;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      toast.error('Please complete all required shipping fields.', 'Missing Information');
      return;
    }

    setIsSubmitting(true);

    // Simulate payment authorization
    setTimeout(() => {
      const generatedOrderId = `AHM-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        id: generatedOrderId,
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'PROCESSING',
        statusLabel: 'Processing Order',
        recipientName: `${formData.firstName} ${formData.lastName}`.trim(),
        recipientPhone: formData.phone,
        recipientEmail: formData.email,
        deliveryAddress: `${formData.street}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}, ${formData.state} - ${formData.pincode}`,
        paymentMethod:
          paymentMethod === 'upi'
            ? 'Google Pay / PhonePe / UPI'
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : 'Cash on Delivery (COD)',
        total,
        subtotal,
        shipping,
        codHandlingFee,
        itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
        items: [...cartItems],
      };

      // Save order associated with user account
      orderService.saveOrder(user?.email || formData.email, orderData);

      setConfirmedOrder(orderData);
      setOrderPlaced(true);
      clearCart();
      setIsSubmitting(false);
      toast.success('Your order has been placed successfully!', 'Order Confirmed');
      navigate('/order-success', { state: { order: orderData } });
    }, 800);
  };

  // If cart is empty and order not placed yet
  if (!orderPlaced && cartItems.length === 0) {
    return (
      <div className="bg-brand-cream-light py-20 min-h-[calc(100vh-80px)]">
        <Container className="max-w-lg text-center mx-auto">
          <div className="bg-white border border-brand-border p-12 shadow-sm rounded-sm">
            <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary mx-auto mb-4">
              <ShoppingBag size={30} />
            </div>
            <h2 className="text-2xl font-serif text-brand-primary font-bold mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed mb-8">
              Please add your desired natural essentials to the cart before checking out.
            </p>
            <Link to="/products">
              <Button className="gap-2 font-semibold shadow-md">
                <span>Discover Products</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Order Success Screen
  if (orderPlaced && confirmedOrder) {
    return (
      <div className="bg-brand-cream-light py-16 lg:py-24 min-h-[calc(100vh-80px)]">
        <Container className="max-w-2xl mx-auto text-center">
          <div className="bg-white border border-brand-border p-8 sm:p-12 shadow-md rounded-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} className="text-green-700" />
            </div>
            
            <span className="text-xs uppercase tracking-widest text-brand-accent font-bold block mb-1">
              Thank You for Ordering
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-3">
              Order Confirmed!
            </h1>
            <p className="text-sm text-brand-muted leading-relaxed mb-8">
              We have received your order. A confirmation receipt has been sent to <strong className="text-brand-charcoal">{confirmedOrder.recipientEmail}</strong>.
            </p>

            <div className="bg-brand-cream/40 border border-brand-border p-6 rounded mb-8 text-left space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-brand-border text-xs">
                <div>
                  <span className="text-brand-muted uppercase font-bold block mb-0.5">Order ID</span>
                  <span className="font-bold text-brand-primary text-sm">#{confirmedOrder.orderId}</span>
                </div>
                <div>
                  <span className="text-brand-muted uppercase font-bold block mb-0.5">Order Date</span>
                  <span className="font-semibold text-brand-charcoal">{confirmedOrder.date}</span>
                </div>
                <div>
                  <span className="text-brand-muted uppercase font-bold block mb-0.5">Payment</span>
                  <span className="font-semibold text-brand-charcoal">{confirmedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-brand-muted uppercase font-bold block mb-0.5">Total Paid</span>
                  <span className="font-bold text-brand-primary text-sm">₹{confirmedOrder.total}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-brand-muted uppercase font-bold block mb-1">Shipping Destination</span>
                <p className="text-sm font-semibold text-brand-charcoal">{confirmedOrder.recipientName}</p>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed">{confirmedOrder.deliveryAddress}</p>
                <p className="text-xs text-brand-muted mt-1">Phone: {confirmedOrder.recipientPhone}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={`/orders/${confirmedOrder.orderId}`}>
                <Button variant="accent" className="w-full sm:w-auto gap-2 font-semibold shadow-sm">
                  <Truck size={16} /> Track Order
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Header with Security Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-border">
          <div>
            <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-primary mb-1">
              <ArrowLeft size={14} /> Return to Cart
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold">
              Secure Checkout
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 px-3 py-1.5 rounded text-xs font-semibold self-start sm:self-auto shadow-2xs">
            <Lock size={14} className="text-green-700" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Two-Column Checkout Form */}
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* 1. LEFT COLUMN: Shipping Address Form Fields */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Contact Information */}
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <h2 className="text-xl font-serif text-brand-primary font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address (for order receipts)"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                  />
                  <Input
                    label="Phone Number (for delivery updates)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <h2 className="text-xl font-serif text-brand-primary font-bold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Priya"
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Sundaram"
                      required
                    />
                  </div>

                  <Input
                    label="Street Address / Flat / Building No."
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Apartment, Street name"
                    required
                  />

                  <Input
                    label="Landmark / Area (Optional)"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Indiranagar Metro Station"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru"
                      required
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Karnataka"
                      required
                    />
                    <Input
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Input
                    label="Country / Region"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-brand-cream/40 cursor-not-allowed"
                  />

                  <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="saveAddress"
                      checked={formData.saveAddress}
                      onChange={handleInputChange}
                      className="accent-brand-primary w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-xs font-medium text-brand-charcoal">
                      Save this address to my profile for future orders
                    </span>
                  </label>
                </div>
              </div>

              {/* Delivery Assurance Note */}
              <div className="p-4 bg-brand-cream border border-brand-border rounded flex items-center gap-3 text-xs text-brand-charcoal">
                <Truck size={20} className="text-brand-primary flex-shrink-0" />
                <span>
                  <strong>Standard Carbon-Neutral Delivery:</strong> Expected within 3-5 business days. Safe, eco-protective traditional packaging directly from native farms.
                </span>
              </div>
            </div>

            {/* 2. RIGHT COLUMN: Payment Method Selector + Order Summary Box */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Payment Method Selector */}
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif text-brand-primary font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
                    Payment Method
                  </h2>
                  <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-semibold">
                    100% Secure
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Option 1: UPI */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-brand-primary bg-brand-cream/50 ring-1 ring-brand-primary shadow-xs'
                        : 'border-brand-border hover:border-brand-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="pay-upi"
                        name="paymentGroup"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 accent-brand-primary cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor="pay-upi" className="font-semibold text-sm text-brand-charcoal flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2">
                            <Smartphone size={16} className="text-brand-primary" />
                            Google Pay / PhonePe / UPI
                          </span>
                          <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                            FREE
                          </span>
                        </label>
                        <p className="text-xs text-brand-muted mt-0.5">
                          Pay instantly via any UPI app (GPay, PhonePe, Paytm, BHIM, CRED).
                        </p>

                        {paymentMethod === 'upi' && (
                          <div className="mt-3 pt-3 border-t border-brand-border/60">
                            <Input
                              label="UPI ID / VPA (Optional)"
                              placeholder="e.g. mobile@upi or username@okaxis"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                            <p className="text-[11px] text-brand-muted mt-1">
                              You will see a payment QR & prompt on your UPI app after placing the order.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-brand-primary bg-brand-cream/50 ring-1 ring-brand-primary shadow-xs'
                        : 'border-brand-border hover:border-brand-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="pay-card"
                        name="paymentGroup"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 accent-brand-primary cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor="pay-card" className="font-semibold text-sm text-brand-charcoal flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2">
                            <CreditCard size={16} className="text-brand-primary" />
                            Credit / Debit Card
                          </span>
                          <span className="text-[10px] text-brand-muted">
                            Visa, MC, RuPay
                          </span>
                        </label>
                        <p className="text-xs text-brand-muted mt-0.5">
                          Safe & encrypted checkout for all domestic & international cards.
                        </p>

                        {paymentMethod === 'card' && (
                          <div className="mt-3 pt-3 border-t border-brand-border/60 space-y-3">
                            <Input
                              label="Card Number"
                              placeholder="4111 2222 3333 4444"
                              maxLength={19}
                              value={cardDetails.cardNumber}
                              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Expiry (MM/YY)"
                                placeholder="MM/YY"
                                maxLength={5}
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              />
                              <Input
                                label="CVV"
                                placeholder="123"
                                maxLength={4}
                                type="password"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border rounded cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-primary bg-brand-cream/50 ring-1 ring-brand-primary shadow-xs'
                        : 'border-brand-border hover:border-brand-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="pay-cod"
                        name="paymentGroup"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 accent-brand-primary cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor="pay-cod" className="font-semibold text-sm text-brand-charcoal flex items-center justify-between cursor-pointer">
                          <span className="flex items-center gap-2">
                            <Banknote size={16} className="text-brand-primary" />
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            +₹40 Fee
                          </span>
                        </label>
                        <p className="text-xs text-brand-muted mt-0.5">
                          Pay with cash or UPI directly to the courier agent at delivery.
                        </p>
                        {paymentMethod === 'cod' && (
                          <p className="text-[11px] text-amber-900 bg-amber-50 p-2 border border-amber-200 rounded mt-2.5">
                            A nominal handling fee of ₹40 is added for Cash on Delivery orders.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm space-y-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary pb-3 border-b border-brand-border">
                  Order Summary
                </h2>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.productId || item.id} className="flex gap-3 items-center text-xs">
                      <div className="w-12 h-12 bg-brand-cream border border-brand-border flex-shrink-0 rounded overflow-hidden relative">
                        <img
                          src={item.image || item.images?.[0]?.url || ''}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-brand-charcoal truncate">{item.name}</h4>
                        {item.weight && <p className="text-[11px] text-brand-muted">{item.weight}</p>}
                      </div>
                      <span className="font-bold text-brand-primary whitespace-nowrap">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown */}
                <div className="border-t border-brand-border pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-brand-charcoal">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-brand-charcoal">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-700 font-bold">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                      <span>COD Handling Fee</span>
                      <span className="font-bold">+₹40</span>
                    </div>
                  )}

                  <div className="border-t border-brand-border pt-3 mt-3 flex justify-between items-baseline text-brand-primary">
                    <span className="font-serif text-base font-bold">Grand Total</span>
                    <span className="text-2xl font-bold">₹{total}</span>
                  </div>
                </div>

                {/* Place Order Submit Button */}
                <Button
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="w-full text-base font-semibold shadow-md h-14"
                >
                  Place Order (₹{total})
                </Button>

                <p className="text-[11px] text-center text-brand-muted leading-relaxed">
                  By clicking Place Order, you agree to AHAM's Terms of Service & Privacy Policy.
                </p>
              </div>

            </div>

          </div>
        </form>
      </Container>
    </div>
  );
};

export default Checkout;
