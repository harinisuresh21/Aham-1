import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import Container from '../../components/layout/Container';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ProductAPI } from '../../services/api';

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const res = await ProductAPI.getProductBySlug(slug);
      if (res.success) {
        setProduct(res.data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20">
        <div className="animate-pulse flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 aspect-square bg-brand-cream/50 border border-brand-border"></div>
          <div className="w-full lg:w-1/2 flex flex-col space-y-6">
            <div className="h-10 bg-brand-cream/50 w-3/4"></div>
            <div className="h-6 bg-brand-cream/50 w-1/4"></div>
            <div className="h-32 bg-brand-cream/50 w-full"></div>
            <div className="h-12 bg-brand-cream/50 w-1/2"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h2 className="text-3xl font-serif text-brand-primary mb-4">Product Not Found</h2>
        <p className="text-brand-muted mb-8">We couldn't find the product you're looking for.</p>
        <Link to="/products">
          <Button>Back to Shop</Button>
        </Link>
      </Container>
    );
  }

  const primaryImage = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url;

  return (
    <div className="bg-white py-12 lg:py-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Images */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-brand-cream border border-brand-border overflow-hidden relative">
              {primaryImage ? (
                <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-muted">No Image</div>
              )}
              {product.compare_at_price && (
                <div className="absolute top-4 left-4">
                  <Badge variant="accent">Sale</Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery (Mock) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button key={i} className={`aspect-square border ${img.is_primary ? 'border-brand-primary' : 'border-brand-border opacity-70 hover:opacity-100'} overflow-hidden bg-brand-cream`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center gap-2 text-sm text-brand-muted">
              <Link to="/products" className="hover:text-brand-primary">Shop</Link>
              <span>/</span>
              <span className="uppercase">{product.category_id === 'cat-1' ? 'Turmeric' : 'Wellness'}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brand-primary mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-brand-accent text-brand-accent' : 'fill-brand-border text-brand-border'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-brand-charcoal">{product.rating}</span>
              <span className="text-sm text-brand-muted">({product.reviewCount} reviews)</span>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-medium text-brand-charcoal">₹{product.price}</span>
              {product.compare_at_price && (
                <span className="text-xl text-brand-muted line-through">₹{product.compare_at_price}</span>
              )}
            </div>
            
            <p className="text-lg text-brand-charcoal/80 mb-8 font-sans leading-relaxed">
              {product.description}
            </p>
            
            <div className="border-t border-b border-brand-border py-6 mb-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-brand-charcoal font-medium">Availability</span>
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={16}/> In Stock ({product.stock_quantity})</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-charcoal font-medium">Weight/Unit</span>
                <span className="text-brand-muted">{product.weight}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-brand-border h-14 w-full sm:w-32 bg-white">
                <button 
                  className="flex-1 flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock_quantity === 0}
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button 
                  className="flex-1 flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal disabled:opacity-50"
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  disabled={quantity >= product.stock_quantity || product.stock_quantity === 0}
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button size="lg" className="flex-1 text-lg gap-2" disabled={product.stock_quantity === 0}>
                <ShoppingCart size={20} />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-brand-muted bg-brand-cream-light p-4 border border-brand-border">
              <Truck size={20} className="text-brand-primary" />
              <span>Ships securely in traditional packaging. Cash on delivery available.</span>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;
