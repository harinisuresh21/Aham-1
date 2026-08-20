import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { slug, name, price, compare_at_price, category_id, images, rating, reviewCount } = product;
  const primaryImage = images?.find(img => img.is_primary)?.url || images?.[0]?.url;

  return (
    <div className="group flex flex-col h-full bg-white border border-brand-border hover:shadow-lg transition-shadow duration-300">
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
        
        {compare_at_price && (
          <div className="absolute top-3 left-3">
            <Badge variant="accent">Sale</Badge>
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
          <span className="text-sm font-medium text-brand-charcoal">{rating}</span>
          <span className="text-sm text-brand-muted">({reviewCount})</span>
        </div>
        
        <Link to={`/products/${slug}`}>
          <h3 className="font-serif text-lg font-medium text-brand-charcoal hover:text-brand-primary mb-1 line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <p className="text-xs text-brand-muted uppercase tracking-wider mb-4">
          {category_id === 'cat-1' ? 'Turmeric' : category_id === 'cat-2' ? 'Oils' : 'Wellness'}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-brand-charcoal">₹{price}</span>
            {compare_at_price && (
              <span className="text-sm text-brand-muted line-through">₹{compare_at_price}</span>
            )}
          </div>
          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
