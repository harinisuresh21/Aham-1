import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Plus, Minus, Trash2, Heart, Check, Sparkles, Leaf } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const {
    slug,
    name,
    price,
    compare_at_price,
    category_id,
    category_name,
    images,
    rating = 4.8,
    reviewCount = 50,
    stock_quantity = 10,
    tags = []
  } = product;

  const primaryImage = images?.find(img => img.is_primary)?.url || images?.[0]?.url;

  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddedSuccess, setShowAddedSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const productId = product.id || product.productId;
  const cartItem = cartItems.find((item) => (item.productId || item.id) === productId);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = stock_quantity === 0;
  const wishlisted = isInWishlist(productId);

  const discountPercent = compare_at_price && compare_at_price > price
    ? Math.round(((compare_at_price - price) / compare_at_price) * 100)
    : 0;

  const categoryLabel = category_name || (
    category_id === 'cat-1' ? 'Turmeric' :
    category_id === 'cat-2' ? 'Traditional Oils' :
    category_id === 'cat-3' ? 'Natural Food' : 'Wellness'
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isUpdating) return;
    setIsUpdating(true);
    await addToCart(product, 1);
    setIsUpdating(false);
    setShowAddedSuccess(true);
    setTimeout(() => {
      setShowAddedSuccess(false);
    }, 1500);
  };

  const handleIncrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating || inCartQty >= (stock_quantity || 999)) return;
    setIsUpdating(true);
    await updateQuantity(productId, inCartQty + 1);
    setIsUpdating(false);
  };

  const handleDecrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdating) return;
    setIsUpdating(true);
    if (inCartQty <= 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, inCartQty - 1);
    }
    setIsUpdating(false);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-[#243D2B]/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(36,61,43,0.12)] hover:-translate-y-1 transition-all duration-500 overflow-hidden relative select-none">
      
      {/* 1. Image Container with Zoom-on-Hover */}
      <Link to={`/products/${slug}`} className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-b from-[#FDFAF5] to-[#F5EFE4] block rounded-xl">
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={name}
            onError={() => setImageError(true)}
            className={`object-cover w-full h-full rounded-xl ${
              typeof primaryImage === 'string' &&
              (primaryImage.includes('.png') || primaryImage.includes('hero-product') || primaryImage.includes('section2-product'))
                ? '!object-contain p-3'
                : ''
            } group-hover:scale-108 transition-transform duration-700 ease-out`}
          />
        ) : (
          /* Ayurvedic Fallback Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF6EE] via-[#F4EDE0] to-[#EAE0CD]">
            <div className="w-14 h-14 rounded-full bg-white/80 shadow-xs flex items-center justify-center text-[#71835B] mb-2 border border-[#243D2B]/10">
              <Leaf size={24} className="animate-pulse" />
            </div>
            <span className="font-serif text-sm font-semibold text-[#1B3022]">AHAM Botanical</span>
            <span className="text-[11px] text-[#243D2B]/70 font-sans mt-0.5">100% Pure & Natural</span>
          </div>
        )}

        {/* Top-Left Badges Overlay (Glassmorphic) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#C2A573] text-[#1B3022] text-[10px] sm:text-[11px] font-bold shadow-sm tracking-wide">
              SAVE {discountPercent}%
            </span>
          )}
          {tags && tags.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1B3022] text-[9.5px] sm:text-[10.5px] font-semibold border border-white/60 shadow-xs">
              <Sparkles size={10} className="text-[#C2A573]" />
              {tags[0]}
            </span>
          )}
        </div>

        {/* Top-Right Floating Wishlist Button */}
        <motion.button
          type="button"
          onClick={handleToggleWishlist}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.15 }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm z-20 cursor-pointer backdrop-blur-md ${
            wishlisted
              ? 'bg-white text-red-500 shadow-red-500/20'
              : 'bg-white/85 text-[#1B3022] hover:text-red-500 hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={16}
            className={`transition-transform duration-200 ${
              wishlisted ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-[1.8]'
            }`}
          />
        </motion.button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#1B3022]/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white/95 text-[#1B3022] text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-xl shadow-lg border border-white">
              Currently Unavailable
            </span>
          </div>
        )}
      </Link>

      {/* 2. Content Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating & Category Line */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#71835B]">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-1 bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#243D2B]/5">
            <Star className="w-3 h-3 fill-[#C2A573] text-[#C2A573]" />
            <span className="text-[11px] font-bold text-[#1B3022]">{rating}</span>
            <span className="text-[10px] text-gray-500">({reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/products/${slug}`} className="group-hover:text-[#47623F] transition-colors">
          <h3 className="font-serif text-base sm:text-[17px] font-semibold text-[#1B3022] mb-2 line-clamp-2 leading-snug">
            {name}
          </h3>
        </Link>

        {/* Secondary Tag Highlights */}
        {tags && tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(1, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-medium text-[#243D2B]/85 bg-[#FDFAF5] px-2 py-0.5 rounded-md border border-[#243D2B]/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 3. Elevated Price & Action Footer */}
        <div className="mt-auto pt-3 border-t border-[#243D2B]/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#1B3022]">
                ₹{price}
              </span>
              {compare_at_price && compare_at_price > price && (
                <span className="text-xs text-gray-400 line-through font-sans">
                  ₹{compare_at_price}
                </span>
              )}
            </div>
            {compare_at_price && compare_at_price > price && (
              <span className="text-[10px] font-semibold text-[#47623F]">
                Save ₹{compare_at_price - price}
              </span>
            )}
          </div>

          {/* Cart Interaction / Quantity Controller */}
          <div className="shrink-0">
            <AnimatePresence mode="wait">
              {inCartQty > 0 ? (
                /* In-Cart Stepper Controls */
                <motion.div
                  key="in-cart"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center bg-[#FAF6EE] border border-[#243D2B]/20 rounded-xl overflow-hidden shadow-xs h-9"
                >
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={isUpdating}
                    className="px-2.5 h-full flex items-center justify-center text-[#1B3022] hover:bg-[#243D2B] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                    title={inCartQty === 1 ? 'Remove from Cart' : 'Decrease Quantity'}
                  >
                    {inCartQty === 1 ? (
                      <Trash2 size={13} className="text-red-500 hover:text-white" />
                    ) : (
                      <Minus size={13} />
                    )}
                  </button>
                  <span className="px-2 text-xs font-bold text-[#1B3022] min-w-5 text-center select-none font-sans">
                    {inCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={isUpdating || inCartQty >= (stock_quantity || 999)}
                    className="px-2.5 h-full flex items-center justify-center text-[#1B3022] hover:bg-[#243D2B] hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                    title="Increase Quantity"
                  >
                    <Plus size={13} />
                  </button>
                </motion.div>
              ) : (
                /* Initial Add-to-Cart Button with Success Feedback */
                <motion.button
                  key="add-btn"
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={isOutOfStock || isUpdating}
                  onClick={handleAddToCart}
                  className={`h-9 sm:h-10 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                    showAddedSuccess
                      ? 'bg-[#47623F] text-white'
                      : isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#243D2B] via-[#2C422F] to-[#1B3022] hover:from-[#1B3022] hover:to-[#243D2B] text-white hover:shadow-md'
                  }`}
                >
                  {showAddedSuccess ? (
                    <>
                      <Check size={14} className="animate-bounce" />
                      <span>Added!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out</span>
                  ) : (
                    <>
                      <ShoppingCart size={14} className="text-[#C2A573]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
