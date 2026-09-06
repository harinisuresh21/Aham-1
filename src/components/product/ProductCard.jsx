import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus, Trash2, Heart, Check, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { slug, name, price, compare_at_price, category_id, category_name, images, rating, reviewCount, stock_quantity, tags } = product;
  const primaryImage = images?.find(img => img.is_primary)?.url || images?.[0]?.url;

  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isUpdating, setIsUpdating] = useState(false);

  const productId = product.id || product.productId;
  const cartItem = cartItems.find((item) => (item.productId || item.id) === productId);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = stock_quantity === 0;
  const wishlisted = isInWishlist(productId);

  const discountPercent = compare_at_price
    ? Math.round(((compare_at_price - price) / compare_at_price) * 100)
    : 0;

  const categoryLabel = category_name || (category_id === 'cat-1' ? 'Turmeric' : category_id === 'cat-2' ? 'Traditional Oils' : category_id === 'cat-3' ? 'Natural Food' : 'Wellness');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isUpdating) return;
    setIsUpdating(true);
    await addToCart(product, 1);
    setIsUpdating(false);
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
    <div className="group flex flex-col h-full bg-white border border-brand-border hover:shadow-lg transition-all duration-300 rounded-sm overflow-hidden relative">
      {/* Image Section */}
      <Link to={`/products/${slug}`} className="relative aspect-square overflow-hidden bg-brand-cream block">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted">No Image</div>
        )}

        {/* Sale / Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent" className="bg-brand-accent text-white shadow-md font-bold text-[10px] px-2.5 py-0.5">
              Save {discountPercent}%
            </Badge>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-brand-charcoal text-xs font-bold px-4 py-2 uppercase tracking-wider rounded shadow-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Floating Wishlist Heart Button */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md z-10 ${
          wishlisted
            ? 'bg-white text-red-500 scale-105'
            : 'bg-white/80 text-brand-charcoal opacity-0 group-hover:opacity-100 hover:text-red-500'
        }`}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart
          size={16}
          className={`transition-transform duration-200 ${
            wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-[1.8]'
          }`}
        />
      </button>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating & Category */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-brand-accent text-brand-accent" />
            <span className="text-xs font-bold text-brand-charcoal">{rating}</span>
            <span className="text-xs text-brand-muted">({reviewCount})</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent">
            {categoryLabel}
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/products/${slug}`}>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-brand-charcoal hover:text-brand-primary mb-1.5 line-clamp-2 leading-snug transition-colors">
            {name}
          </h3>
        </Link>

        {/* Tags Preview */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[9px] font-semibold text-brand-primary bg-brand-cream px-1.5 py-0.5 border border-brand-border/60 flex items-center gap-0.5"
              >
                <Sparkles size={8} className="text-brand-accent" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-primary">₹{price}</span>
            {compare_at_price && (
              <span className="text-xs text-brand-muted line-through">₹{compare_at_price}</span>
            )}
          </div>

          {/* Cart Action Button / Quantity Controls */}
          {inCartQty > 0 ? (
            /* In-Cart Quantity Widget */
            <div className="flex items-center border border-brand-primary bg-brand-cream-light rounded overflow-hidden shadow-xs h-8">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isUpdating}
                className="px-2 h-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50"
                title={inCartQty === 1 ? 'Remove' : 'Decrease'}
              >
                {inCartQty === 1 ? <Trash2 size={12} className="text-red-500 hover:text-white" /> : <Minus size={12} />}
              </button>
              <span className="px-2 text-xs font-bold text-brand-charcoal min-w-5 text-center select-none">
                {inCartQty}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating || inCartQty >= (stock_quantity || 999)}
                className="px-2 h-full flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-40"
                title="Increase"
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            /* Initial Add Button */
            <Button
              size="sm"
              variant="primary"
              disabled={isOutOfStock || isUpdating}
              isLoading={isUpdating}
              onClick={handleAddToCart}
              className="gap-1.5 text-xs font-semibold h-8 px-3 shadow-xs"
            >
              <ShoppingCart size={13} />
              {isOutOfStock ? 'Sold Out' : 'Add'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
