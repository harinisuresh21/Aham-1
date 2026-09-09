import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Check, 
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Heart
} from 'lucide-react';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import turmericEssenceImg from '../assets/turmeric-essence.jpeg';
import forestHoneyImg from '../assets/forest-honey.jpeg';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 50;

const Cart = () => {
  const { cartItems, subtotal, cartCount, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { wishlistItems, moveToCart } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'AHAM10', discountPercent: 10, discountAmount: ... }
  const [promoError, setPromoError] = useState('');

  // Shipping & Discount Calculations
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Promo Code Calculation
  const discountAmount = appliedPromo
    ? appliedPromo.discountPercent
      ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
      : appliedPromo.flatAmount || 0
    : 0;

  const total = Math.max(0, subtotal - discountAmount + shipping);

  // Apply Coupon Handler
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'AHAM10') {
      setAppliedPromo({ code: 'AHAM10', discountPercent: 10, label: '10% Vedic Wellness Discount' });
      toast.success('Coupon AHAM10 applied! You saved 10% on this order.', 'Promo Applied');
      setPromoCode('');
    } else if (code === 'PURE50') {
      setAppliedPromo({ code: 'PURE50', flatAmount: 50, label: '₹50 Purity Savings' });
      toast.success('Coupon PURE50 applied! ₹50 deducted.', 'Promo Applied');
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try AHAM10 for 10% off.');
      toast.error('Invalid coupon code. Try AHAM10', 'Coupon Error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.info('Coupon code removed.', 'Coupon Removed');
  };

  // Quantity modification
  const handleQtyChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQty);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="bg-brand-cream-light py-16 min-h-screen">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-brand-cream/60 w-48 rounded"></div>
            <div className="h-64 bg-brand-cream/60 w-full rounded"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold">
              Shopping Cart
            </h1>
            <p className="text-sm text-brand-muted mt-1">
              {cartCount > 0 ? (
                <span>
                  You have <strong className="text-brand-charcoal">{cartCount}</strong> {cartCount === 1 ? 'item' : 'items'} in your cart
                </span>
              ) : (
                'Your cart is currently empty'
              )}
            </p>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
              >
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-red-600 transition-colors"
              >
                <RotateCcw size={13} /> Clear Cart
              </button>
            </div>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* 1. Left Side: Itemized Cart Table / List */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {/* Free Shipping Progress Meter */}
              <div className="bg-white border border-brand-border p-5 rounded-sm shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-brand-primary" />
                    <span className="text-sm font-semibold text-brand-charcoal">
                      {isFreeShipping ? (
                        <span className="text-green-700 font-bold flex items-center gap-1">
                          <Check size={16} /> Congratulations! You unlocked FREE Standard Delivery
                        </span>
                      ) : (
                        <span>
                          Add <strong className="text-brand-primary">₹{amountNeededForFreeShipping}</strong> more to unlock <strong className="text-brand-accent">FREE Delivery</strong>
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-brand-muted">{freeShippingProgress}%</span>
                </div>

                <div className="w-full h-2 bg-brand-cream rounded-full overflow-hidden border border-brand-border/60">
                  <div
                    className="h-full bg-brand-accent transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Items Card Container */}
              <div className="bg-white border border-brand-border shadow-sm rounded-sm overflow-hidden">
                {/* Table Header (Desktop) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-5 border-b border-brand-border bg-brand-cream/40 text-xs font-bold uppercase tracking-wider text-brand-muted">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Unit Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-brand-border">
                  {cartItems.map((item) => {
                    const productId = item.productId || item.id;
                    const itemImg = item.image || item.images?.[0]?.url || (item.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg);

                    return (
                      <div
                        key={productId}
                        className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center hover:bg-brand-cream-light/40 transition-colors"
                      >
                        {/* Column 1: Thumbnail & Info */}
                        <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                          <Link
                            to={item.slug ? `/products/${item.slug}` : '/products'}
                            className="w-20 h-20 bg-brand-cream border border-brand-border flex-shrink-0 overflow-hidden rounded-xl group block"
                          >
                            <img
                              src={itemImg}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = item.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg;
                              }}
                              className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link
                              to={item.slug ? `/products/${item.slug}` : '/products'}
                              className="font-serif text-base font-semibold text-brand-charcoal hover:text-brand-primary line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            {item.weight && (
                              <p className="text-xs text-brand-muted mt-0.5">Pack Size: {item.weight}</p>
                            )}

                            {/* Mobile Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(productId)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-2.5 sm:hidden font-medium"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Column 2: Unit Price */}
                        <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                          <span className="sm:hidden text-xs text-brand-muted">Unit Price:</span>
                          <span className="text-sm font-medium text-brand-charcoal">₹{item.price}</span>
                        </div>

                        {/* Column 3: Quantity Controls */}
                        <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-center items-center">
                          <span className="sm:hidden text-xs text-brand-muted">Quantity:</span>
                          <div className="flex items-center border border-brand-primary bg-brand-cream-light rounded overflow-hidden shadow-xs h-9">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(productId, item.quantity, -1)}
                              className="px-2.5 h-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                              title={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 size={13} className="text-red-500 hover:text-white" />
                              ) : (
                                <Minus size={13} />
                              )}
                            </button>
                            <span className="px-2.5 text-xs font-bold text-brand-charcoal min-w-6 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(productId, item.quantity, 1)}
                              className="px-2.5 h-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                              title="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Column 4: Line Item Total & Desktop Remove */}
                        <div className="col-span-1 sm:col-span-2 flex justify-between sm:justify-end items-center">
                          <span className="sm:hidden text-xs text-brand-muted">Item Total:</span>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="font-bold text-base text-brand-primary">
                              ₹{item.price * item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(productId)}
                              className="hidden sm:inline-flex text-xs text-brand-muted hover:text-red-600 items-center gap-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trust Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white border border-brand-border p-4 rounded text-center flex flex-col items-center">
                  <ShieldCheck size={20} className="text-green-700 mb-1.5" />
                  <h4 className="text-xs font-bold text-brand-charcoal">100% Certified Organic</h4>
                  <p className="text-[11px] text-brand-muted">Pure single-origin harvest</p>
                </div>
                <div className="bg-white border border-brand-border p-4 rounded text-center flex flex-col items-center">
                  <Truck size={20} className="text-brand-primary mb-1.5" />
                  <h4 className="text-xs font-bold text-brand-charcoal">Secure Eco-Packaging</h4>
                  <p className="text-[11px] text-brand-muted">Amber glass & traditional seals</p>
                </div>
                <div className="bg-white border border-brand-border p-4 rounded text-center flex flex-col items-center">
                  <Sparkles size={20} className="text-brand-accent mb-1.5" />
                  <h4 className="text-xs font-bold text-brand-charcoal">Easy Returns</h4>
                  <p className="text-[11px] text-brand-muted">Hassle-free 7-day guarantee</p>
                </div>
              </div>
            </div>

            {/* 2. Right Side: Order Summary Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white border border-brand-border p-6 sm:p-8 sticky top-24 shadow-sm rounded-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-brand-primary pb-4 border-b border-brand-border">
                  Order Summary
                </h2>

                {/* Pricing Line Items */}
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-brand-charcoal">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-brand-charcoal">
                    <span>Estimated Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-700 font-bold">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {/* Applied Discount Line */}
                  {appliedPromo && (
                    <div className="flex justify-between items-center bg-green-50 p-2.5 rounded border border-green-200 text-xs">
                      <div>
                        <span className="font-bold text-green-800 block">{appliedPromo.code}</span>
                        <span className="text-green-700">{appliedPromo.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-800">-₹{discountAmount}</span>
                        <button
                          onClick={handleRemovePromo}
                          className="text-red-500 hover:text-red-700 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-brand-border pt-4 mt-4 flex justify-between items-baseline text-brand-primary">
                    <span className="font-serif text-lg font-bold">Estimated Total</span>
                    <span className="text-2xl font-bold">₹{total}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <label className="text-xs font-semibold text-brand-charcoal block mb-1.5 flex items-center gap-1">
                    <Tag size={13} className="text-brand-accent" /> Have a Coupon Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AHAM10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 border border-brand-border bg-white px-3 py-2 text-xs uppercase font-medium text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
                    />
                    <Button type="submit" size="sm" variant="outline" className="px-4 text-xs font-semibold">
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                </form>

                {/* Proceed to Checkout CTA */}
                <Link to="/checkout" className="block w-full">
                  <Button size="lg" className="w-full text-base font-semibold justify-between px-6 shadow-md">
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>

                <p className="text-[11px] text-center text-brand-muted leading-relaxed">
                  Taxes calculated at checkout. Safe and encrypted 256-bit payment gateway.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart View */
          <div className="bg-white border border-brand-border p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm rounded-sm">
            <div className="mx-auto w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center text-brand-primary mb-6 shadow-inner">
              <ShoppingBag size={36} className="text-brand-primary opacity-80" />
            </div>
            <h2 className="text-3xl font-serif text-brand-primary font-bold mb-3">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto mb-8">
              Explore our collection of authentic single-origin turmeric, wooden cold-pressed oils, raw forest honey, and restorative adaptogens.
            </p>
            <Link to="/products">
              <Button size="lg" className="gap-2 font-semibold shadow-md">
                <span>Start Shopping</span>
                <ArrowRight size={18} />
              </Button>
            </Link>

            {/* Quick Wishlist Callout if items exist in Wishlist */}
            {wishlistItems.length > 0 && (
              <div className="mt-12 pt-8 border-t border-brand-border text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-bold text-brand-primary flex items-center gap-1.5">
                    <Heart size={16} className="text-red-500 fill-red-500" /> Saved in Your Wishlist ({wishlistItems.length})
                  </h3>
                  <Link to="/wishlist" className="text-xs text-brand-primary font-semibold underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {wishlistItems.slice(0, 2).map((item) => (
                    <div
                      key={item.id || item.productId}
                      className="p-3 border border-brand-border rounded flex items-center justify-between gap-4 bg-brand-cream-light"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-cream rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.images?.[0]?.url || item.image || ''}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-brand-charcoal line-clamp-1">{item.name}</p>
                          <p className="font-bold text-xs text-brand-primary">₹{item.price}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8 px-3 gap-1"
                        onClick={() => moveToCart(item)}
                      >
                        <Plus size={13} /> Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
