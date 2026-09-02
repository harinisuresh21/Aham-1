import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif text-brand-primary">My Wishlist</h1>
            <p className="text-sm text-brand-muted mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-brand-muted hover:text-red-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const productId = product.id || product.productId;
              const primaryImage =
                product.images?.find((img) => img.is_primary)?.url ||
                product.images?.[0]?.url ||
                product.image ||
                '';
              const isOutOfStock = product.stock_quantity === 0;

              return (
                <div
                  key={productId}
                  className="group flex flex-col bg-white border border-brand-border hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Image container */}
                  <Link
                    to={product.slug ? `/products/${product.slug}` : '/products'}
                    className="relative aspect-square overflow-hidden bg-brand-cream block"
                  >
                    {primaryImage ? (
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted">
                        No Image
                      </div>
                    )}

                    {product.compare_at_price && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="accent">Sale</Badge>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-red-600 text-white">
                          Out of Stock
                        </Badge>
                      </div>
                    )}

                    {/* Quick Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(productId);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow hover:bg-white text-red-500 hover:text-red-700 flex items-center justify-center transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
                      {product.category_id === 'cat-1'
                        ? 'Turmeric'
                        : product.category_id === 'cat-2'
                        ? 'Oils'
                        : 'Wellness'}
                    </p>

                    <Link to={product.slug ? `/products/${product.slug}` : '/products'}>
                      <h3 className="font-serif text-lg font-medium text-brand-charcoal hover:text-brand-primary mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {product.weight && (
                      <p className="text-xs text-brand-muted mb-4">{product.weight}</p>
                    )}

                    <div className="mt-auto pt-3 border-t border-brand-border/60 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-brand-charcoal">
                          ₹{product.price}
                        </span>
                        {product.compare_at_price && (
                          <span className="text-sm text-brand-muted line-through">
                            ₹{product.compare_at_price}
                          </span>
                        )}
                      </div>

                      {/* Move to Cart Action */}
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full gap-2"
                        disabled={isOutOfStock}
                        onClick={() => moveToCart(product)}
                      >
                        <ShoppingBag size={15} />
                        {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-brand-border p-16 text-center max-w-lg mx-auto shadow-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-accent mb-4">
              <Heart size={30} className="stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-serif text-brand-primary mb-2">Your Wishlist is Empty</h2>
            <p className="text-sm text-brand-muted mb-8">
              Save your favorite authentic natural turmeric, cold-pressed oils, and wellness essentials to buy them later.
            </p>
            <Link to="/products">
              <Button className="gap-2">
                <span>Discover Products</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
