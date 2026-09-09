import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Check, 
  Trash2, 
  ArrowRight, 
  Heart, 
  Leaf, 
  Droplet, 
  Award, 
  Clock, 
  ThumbsUp, 
  MessageSquarePlus, 
  Share2,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import ProductCard from '../../components/product/ProductCard';
import turmericEssenceImg from '../../assets/turmeric-essence.jpeg';
import forestHoneyImg from '../../assets/forest-honey.jpeg';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

const ProductDetails = () => {
  const { slug, id } = useParams();
  const productIdOrSlug = slug || id;
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery Active Image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Quantity & Variant
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState('description');

  // Review Form Modal / Drawer
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    user_name: '',
  });

  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const res = await ProductAPI.getProductBySlug(productIdOrSlug);

      if (res.success && res.data) {
        setProduct(res.data);
        setSelectedWeight(res.data.weight || 'Standard');
        setSelectedImageIndex(0);

        // Fetch reviews & related items
        const [revRes, relRes] = await Promise.all([
          ReviewAPI.getProductReviews(res.data.id),
          ProductAPI.getRelatedProducts(res.data.category_id, res.data.id),
        ]);

        if (revRes.success) setReviews(revRes.data);
        if (relRes.success) setRelatedProducts(relRes.data);
      }
      setLoading(false);
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [productIdOrSlug]);

  // Derived Values
  const productId = product?.id || product?.productId;
  const cartItem = cartItems.find((item) => (item.productId || item.id) === productId);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product?.stock_quantity === 0;
  const wishlisted = isInWishlist(productId);

  const imagesList = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [{ id: 'img-1', url: product.image, is_primary: true }];
    return [{ id: 'img-default', url: product?.category_id === 'cat-3' || product?.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg, is_primary: true }];
  }, [product]);

  const activeImageUrl = imagesList[selectedImageIndex]?.url || imagesList[0]?.url;

  // Rating Statistics
  const ratingStats = useMemo(() => {
    if (!reviews.length) return { average: product?.rating || 4.8, total: product?.reviewCount || 0, counts: { 5: 85, 4: 12, 3: 2, 2: 1, 1: 0 } };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });

    return { average, total, counts };
  }, [reviews, product]);

  // Cart Actions
  const handleAddToCart = async () => {
    if (isOutOfStock || isUpdating) return;
    setIsUpdating(true);
    await addToCart(product, selectedQty);
    setIsUpdating(false);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 2000);
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product, selectedQty);
    navigate('/checkout');
  };

  const handleIncrement = async () => {
    if (isUpdating || inCartQty >= product.stock_quantity) return;
    setIsUpdating(true);
    await updateQuantity(productId, inCartQty + 1);
    setIsUpdating(false);
  };

  const handleDecrement = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    if (inCartQty <= 1) {
      await removeFromCart(productId);
      setSelectedQty(1);
    } else {
      await updateQuantity(productId, inCartQty - 1);
    }
    setIsUpdating(false);
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.user_name || !newReview.comment) {
      toast.error('Please enter your name and comments', 'Required Fields');
      return;
    }

    const res = await ReviewAPI.addReview({
      product_id: productId,
      ...newReview,
    });

    if (res.success) {
      setReviews((prev) => [res.data, ...prev]);
      setShowReviewForm(false);
      setNewReview({ rating: 5, title: '', comment: '', user_name: '' });
      toast.success('Thank you for sharing your genuine review!', 'Review Submitted');
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-brand-cream-light py-16 min-h-screen">
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-brand-cream/70 w-1/4 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-6 h-[480px] bg-brand-cream/70 rounded"></div>
              <div className="lg:col-span-6 space-y-4">
                <div className="h-10 bg-brand-cream/70 w-3/4 rounded"></div>
                <div className="h-6 bg-brand-cream/70 w-1/3 rounded"></div>
                <div className="h-32 bg-brand-cream/70 w-full rounded"></div>
                <div className="h-14 bg-brand-cream/70 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="bg-brand-cream-light py-24 min-h-screen">
        <Container className="text-center max-w-lg mx-auto">
          <h2 className="text-3xl font-serif text-brand-primary font-bold mb-3">Product Not Found</h2>
          <p className="text-sm text-brand-muted mb-8">
            We couldn't locate the essential you are looking for. It may have been relocated or is temporarily archived.
          </p>
          <Link to="/products">
            <Button className="gap-2">
              <span>Return to Shop</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const discountPercent = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brand-muted mb-8">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-brand-primary">Products</Link>
          <span>/</span>
          <span className="text-brand-accent uppercase">{product.category_name || 'Wellness'}</span>
          <span>/</span>
          <span className="text-brand-charcoal truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 1. Main Product Section (Gallery on Left, Details on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white border border-brand-border p-6 sm:p-10 shadow-sm mb-16 rounded-sm">
          
          {/* Left Column: Image Gallery with Vertical/Horizontal Thumbnails */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] flex-shrink-0">
                {imagesList.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-18 h-18 sm:w-20 sm:h-20 border-2 rounded-xl overflow-hidden flex-shrink-0 bg-brand-cream transition-all ${
                      selectedImageIndex === idx
                        ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                        : 'border-brand-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = product?.category_id === 'cat-3' || product?.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg;
                      }}
                      className={`object-cover w-full h-full rounded-xl ${
                        typeof img.url === 'string' && (img.url.includes('.png') || img.url.includes('hero-product'))
                          ? '!object-contain p-1'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square bg-brand-cream border border-brand-border overflow-hidden rounded-xl group flex items-center justify-center">
              <img
                src={activeImageUrl}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = product?.category_id === 'cat-3' || product?.slug?.includes('honey') ? forestHoneyImg : turmericEssenceImg;
                }}
                className={`object-cover w-full h-full rounded-xl ${
                  typeof activeImageUrl === 'string' && (activeImageUrl.includes('.png') || activeImageUrl.includes('hero-product'))
                    ? '!object-contain p-6'
                    : ''
                } transition-transform duration-500 group-hover:scale-105`}
              />

              {/* Discount / Sale Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="accent" className="bg-brand-accent text-white shadow-md font-bold text-xs px-3 py-1">
                    Save {discountPercent}%
                  </Badge>
                </div>
              )}

              {/* Quality Seal Tag */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-brand-border text-xs font-semibold text-brand-primary rounded shadow-sm">
                <ShieldCheck size={14} className="text-green-700" />
                <span>100% Authentic & Lab Tested</span>
              </div>

              {/* Floating Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                  wishlisted
                    ? 'bg-white text-red-500 scale-105 shadow-lg'
                    : 'bg-white/90 text-brand-charcoal hover:bg-white hover:text-red-500'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={20}
                  className={`transition-transform duration-200 ${
                    wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-[1.8]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                  {product.category_name || 'Ayurvedic Essentials'}
                </span>
                <span className="text-xs text-brand-muted font-mono">
                  SKU: {product.sku || 'AHM-001'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating Display */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(ratingStats.average)
                          ? 'fill-brand-accent text-brand-accent'
                          : 'fill-brand-border text-brand-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-brand-charcoal">{ratingStats.average}</span>
                <span className="text-xs text-brand-muted">
                  ({ratingStats.total} verified {ratingStats.total === 1 ? 'review' : 'reviews'})
                </span>
                <a
                  href="#customer-reviews"
                  className="text-xs font-semibold text-brand-primary underline ml-2 hover:text-brand-accent"
                >
                  Read Reviews
                </a>
              </div>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-brand-primary">
                  ₹{product.price}
                </span>
                {product.compare_at_price && (
                  <>
                    <span className="text-lg text-brand-muted line-through">
                      ₹{product.compare_at_price}
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200 rounded">
                      Save ₹{product.compare_at_price - product.price}
                    </span>
                  </>
                )}
                <span className="text-xs text-brand-muted ml-auto">Inclusive of all taxes</span>
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-brand-charcoal/80 font-sans leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock Status & Pack Size */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-brand-cream/50 border border-brand-border rounded mb-6 text-xs">
                <div>
                  <span className="text-brand-muted block mb-0.5">Availability</span>
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> In Stock ({product.stock_quantity} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">Out of Stock</span>
                  )}
                </div>

                <div>
                  <span className="text-brand-muted block mb-0.5">Net Weight / Unit</span>
                  <span className="font-bold text-brand-charcoal">{product.weight || 'Standard Pack'}</span>
                </div>
              </div>

              {/* Quality Highlights Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-brand-primary bg-brand-cream px-3 py-1 rounded-full border border-brand-border flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-brand-accent" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions: Quantity Selector, Add to Cart, Buy Now */}
            <div className="pt-6 border-t border-brand-border space-y-4">
              {inCartQty > 0 ? (
                /* Dynamic In-Cart Quantity Controls */
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border-2 border-brand-primary bg-brand-cream-light h-14 w-full sm:w-44 shadow-sm rounded">
                    <button
                      type="button"
                      className="flex-1 h-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors text-brand-primary disabled:opacity-50"
                      onClick={handleDecrement}
                      disabled={isUpdating}
                      title={inCartQty === 1 ? 'Remove from cart' : 'Decrease quantity'}
                    >
                      {inCartQty === 1 ? <Trash2 size={18} className="text-red-500 hover:text-white" /> : <Minus size={18} />}
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-brand-charcoal select-none">
                      {inCartQty}
                    </span>
                    <button
                      type="button"
                      className="flex-1 h-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors text-brand-primary disabled:opacity-40"
                      onClick={handleIncrement}
                      disabled={inCartQty >= product.stock_quantity || isUpdating}
                      title="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <Link to="/cart" className="flex-1 w-full">
                    <Button size="lg" variant="accent" className="w-full text-base gap-2 font-semibold shadow-md">
                      <span>View in Cart ({inCartQty})</span>
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              ) : (
                /* Pre-Add Quantity Picker + Add to Cart + Buy Now */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-brand-border h-14 w-full sm:w-36 bg-white rounded">
                      <button
                        type="button"
                        className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal disabled:opacity-40"
                        onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                        disabled={selectedQty <= 1 || isOutOfStock || isUpdating}
                        title="Decrease"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-bold text-base select-none">
                        {selectedQty}
                      </span>
                      <button
                        type="button"
                        className="flex-1 h-full flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal disabled:opacity-40"
                        onClick={() => setSelectedQty(Math.min(product.stock_quantity, selectedQty + 1))}
                        disabled={selectedQty >= product.stock_quantity || isOutOfStock || isUpdating}
                        title="Increase"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      size="lg"
                      className="flex-1 w-full text-base gap-2 font-semibold shadow-md"
                      variant={isAddedToast ? 'accent' : 'primary'}
                      disabled={isOutOfStock || isUpdating}
                      isLoading={isUpdating}
                      onClick={handleAddToCart}
                    >
                      {isAddedToast ? (
                        <>
                          <Check size={20} />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Buy Now Button */}
                  {!isOutOfStock && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full text-base font-semibold border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                      onClick={handleBuyNow}
                    >
                      Buy It Now (₹{product.price * selectedQty})
                    </Button>
                  )}
                </div>
              )}

              {/* Delivery Assurance Footer */}
              <div className="p-3.5 bg-brand-cream-light border border-brand-border/80 rounded flex items-center gap-3 text-xs text-brand-muted">
                <Truck size={18} className="text-brand-primary flex-shrink-0" />
                <span>
                  <strong>Fast & Secure Delivery:</strong> Ships within 24 hours in eco-protective glass/tin jars. Free shipping on orders over ₹999.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Detailed Information Tabs */}
        <div className="bg-white border border-brand-border p-6 sm:p-10 shadow-sm mb-16 rounded-sm">
          {/* Tab Navigation */}
          <div className="flex border-b border-brand-border gap-6 sm:gap-10 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-base font-serif font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'description'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Description & Benefits
            </button>
            <button
              onClick={() => setActiveTab('sourcing')}
              className={`pb-4 text-base font-serif font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'sourcing'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              Traditional Sourcing & Purity
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`pb-4 text-base font-serif font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'usage'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              How to Use & Recipes
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-sm text-brand-charcoal/85 leading-relaxed font-sans max-w-4xl space-y-4">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p>
                  Our <strong>{product.name}</strong> is crafted according to strict classical Ayurvedic principles, ensuring maximum preservation of the natural bioactive nutrients.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-brand-charcoal/80">
                  <li>100% pure single-origin harvest directly traceable to certified native organic farms.</li>
                  <li>Zero chemical solvents, preservatives, artificial colors, or stabilizing agents.</li>
                  <li>Tested by third-party FSSAI-accredited laboratories for purity and zero heavy metal residues.</li>
                </ul>
              </div>
            )}

            {activeTab === 'sourcing' && (
              <div className="space-y-4">
                <p>
                  We partner directly with sustainable grower cooperatives in the Western Ghats and Tamil Nadu fertile belts. Every harvest is timed with traditional seasonal lunar cycles to maximize therapeutic potency.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-brand-cream/40 border border-brand-border rounded">
                    <h4 className="font-serif font-bold text-brand-primary mb-1">Traditional Extraction</h4>
                    <p className="text-xs text-brand-muted">Slow wooden churners and granite millstones operating strictly below natural ambient heat.</p>
                  </div>
                  <div className="p-4 bg-brand-cream/40 border border-brand-border rounded">
                    <h4 className="font-serif font-bold text-brand-primary mb-1">Eco-Conscious Packaging</h4>
                    <p className="text-xs text-brand-muted">Food-grade amber jars protect active photo-compounds from UV degradation.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4">
                <p>
                  Incorporate <strong>{product.name}</strong> into your daily morning or evening wellness regimen:
                </p>
                <p className="text-xs bg-brand-cream p-4 border border-brand-border rounded">
                  <strong>Recommended Ritual:</strong> Consume 1/2 teaspoon daily mixed with warm grass-fed milk, herbal infusions, or use for daily traditional culinary preparations. Store in a cool, dry place away from direct sunlight.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Customer Reviews & Ratings Section */}
        <section id="customer-reviews" className="bg-white border border-brand-border p-6 sm:p-10 shadow-sm mb-16 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-brand-border mb-10">
            <div>
              <h2 className="text-3xl font-serif text-brand-primary font-bold mb-1">
                Customer Reviews & Ratings
              </h2>
              <p className="text-sm text-brand-muted">
                Genuine experiences shared by verified AHAM wellness community members.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="gap-2 self-start md:self-auto border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <MessageSquarePlus size={16} />
              {showReviewForm ? 'Close Form' : 'Write a Review'}
            </Button>
          </div>

          {/* Rating Summary Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 p-6 bg-brand-cream/40 border border-brand-border rounded">
            {/* Left Score */}
            <div className="md:col-span-4 text-center md:text-left flex flex-col justify-center border-b md:border-b-0 md:border-r border-brand-border pb-6 md:pb-0 md:pr-6">
              <span className="text-5xl font-serif font-bold text-brand-primary mb-2">
                {ratingStats.average}
              </span>
              <div className="flex justify-center md:justify-start gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(ratingStats.average)
                        ? 'fill-brand-accent text-brand-accent'
                        : 'fill-brand-border text-brand-border'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-brand-muted">Based on {ratingStats.total} customer ratings</p>
            </div>

            {/* Right Distribution Bars */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingStats.counts[stars] || 0;
                const percentage = ratingStats.total > 0 ? Math.round((count / ratingStats.total) * 100) : stars === 5 ? 85 : 10;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-brand-charcoal font-medium">{stars} Stars</span>
                    <div className="flex-1 h-2 bg-brand-border/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-brand-muted">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inline Write Review Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-brand-cream-light p-6 border border-brand-border rounded mb-12 space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xl font-serif font-bold text-brand-primary mb-2">Write Your Experience</h3>

              {/* Star Picker */}
              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: num })}
                      className="p-1 text-brand-accent hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        className={num <= newReview.rating ? 'fill-brand-accent text-brand-accent' : 'text-brand-border'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Radhika Sharma"
                  value={newReview.user_name}
                  onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
                  required
                />
                <Input
                  label="Review Title"
                  placeholder="e.g. Incomparable purity and aroma"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-charcoal block mb-1">Your Review</label>
                <textarea
                  rows={4}
                  className="w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
                  placeholder="Share details about flavor, quality, packaging, and your daily wellness ritual..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Publish Review
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-6 divide-y divide-brand-border">
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs uppercase">
                      {rev.user_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-brand-charcoal flex items-center gap-1.5">
                        {rev.user_name}
                        <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-normal flex items-center gap-0.5">
                          <CheckCircle2 size={10} /> Verified Buyer
                        </span>
                      </h4>
                      <p className="text-xs text-brand-muted">{rev.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={s <= rev.rating ? 'fill-brand-accent text-brand-accent' : 'fill-brand-border text-brand-border'}
                      />
                    ))}
                  </div>
                </div>

                {rev.title && (
                  <h5 className="font-semibold text-sm text-brand-charcoal mt-2 mb-1">{rev.title}</h5>
                )}

                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-brand-accent block mb-1">
                Complete Your Ayurvedic Regimen
              </span>
              <h2 className="text-3xl font-serif text-brand-primary font-bold">
                You May Also Love
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
};

export default ProductDetails;
