import React, { useState, useEffect, useMemo } from 'react';
import Container from '../../components/layout/Container';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import { ProductAPI, CategoryAPI } from '../../services/api';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Leaf,
  ChevronDown
} from 'lucide-react';

const certificationTags = [
  { id: '100% Organic', label: '100% Organic' },
  { id: 'FSSAI Certified', label: 'FSSAI Certified' },
  { id: 'Single Origin', label: 'Single Origin' },
  { id: 'Cold Pressed', label: 'Cold Pressed' },
  { id: 'No Preservatives', label: 'No Preservatives' },
];

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(800);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        ProductAPI.getProducts(),
        CategoryAPI.getCategories(),
      ]);

      if (prodRes.success) setAllProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
      setLoading(false);
    };
    loadData();
  }, []);

  // Tag selection toggle
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(800);
    setSelectedTags([]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    maxPrice < 800 ||
    selectedTags.length > 0 ||
    inStockOnly;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // 1. Search Query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchDesc = product.description.toLowerCase().includes(query);
          const matchCat = product.category_name?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
          if (product.category_id !== selectedCategory && product.slug !== selectedCategory) {
            return false;
          }
        }

        // 3. Price Filter
        if (product.price > maxPrice) {
          return false;
        }

        // 4. Tags / Certifications Filter
        if (selectedTags.length > 0) {
          const productTags = product.tags || [];
          const hasAllTags = selectedTags.every((t) => productTags.includes(t));
          if (!hasAllTags) return false;
        }

        // 5. In Stock Only
        if (inStockOnly && product.stock_quantity === 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.reviewCount || 0) - (a.reviewCount || 0);
        // Default: featured
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      });
  }, [allProducts, searchQuery, selectedCategory, maxPrice, selectedTags, inStockOnly, sortBy]);

  // Count items per category helper
  const getCategoryCount = (catId) => {
    if (catId === 'all') return allProducts.length;
    return allProducts.filter((p) => p.category_id === catId).length;
  };

  // Reusable Filter Sidebar Content
  const renderFilterContent = () => (
    <div className="space-y-8">
      {/* 1. Category Filter */}
      <div>
        <h3 className="font-serif text-lg font-bold text-brand-primary mb-4 flex items-center gap-2">
          <Leaf size={16} className="text-brand-accent" /> Categories
        </h3>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-brand-primary text-white font-medium'
                : 'text-brand-charcoal hover:bg-brand-cream'
            }`}
          >
            <span>All Products</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-brand-cream text-brand-muted'
              }`}
            >
              {getCategoryCount('all')}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors ${
                  isSelected
                    ? 'bg-brand-primary text-white font-medium'
                    : 'text-brand-charcoal hover:bg-brand-cream'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-cream text-brand-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Slider */}
      <div className="pt-6 border-t border-brand-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-brand-primary">Price Range</h3>
          <span className="text-sm font-bold text-brand-primary bg-brand-cream px-2.5 py-1 rounded border border-brand-border">
            Up to ₹{maxPrice}
          </span>
        </div>
        <p className="text-xs text-brand-muted mb-4">Showing items between ₹0 – ₹{maxPrice}</p>

        <input
          type="range"
          min="200"
          max="800"
          step="25"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-primary cursor-pointer h-2 bg-brand-cream rounded-lg"
        />

        <div className="flex justify-between text-xs text-brand-muted mt-2 font-medium">
          <span>₹200</span>
          <span>₹500</span>
          <span>₹800</span>
        </div>
      </div>

      {/* 3. Certifications & Quality Tags */}
      <div className="pt-6 border-t border-brand-border">
        <h3 className="font-serif text-lg font-bold text-brand-primary mb-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand-accent" /> Quality & Tags
        </h3>

        <div className="space-y-2.5">
          {certificationTags.map((tag) => {
            const isChecked = selectedTags.includes(tag.id);

            return (
              <label
                key={tag.id}
                className="flex items-center gap-3 text-sm text-brand-charcoal cursor-pointer group select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTag(tag.id)}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary accent-brand-primary w-4 h-4 cursor-pointer"
                />
                <span
                  className={`transition-colors ${
                    isChecked ? 'font-semibold text-brand-primary' : 'group-hover:text-brand-primary'
                  }`}
                >
                  {tag.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Availability Toggle */}
      <div className="pt-6 border-t border-brand-border">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-sm font-medium text-brand-charcoal">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-brand-border text-brand-primary focus:ring-brand-primary accent-brand-primary w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {/* 5. Clear All Button */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-brand-border">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/70 border border-red-200 py-2.5 rounded transition-colors"
          >
            <RotateCcw size={14} /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-accent block mb-2">
            The AHAM Collection
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif text-brand-primary font-bold mb-3">
            Pure Wellness Essentials
          </h1>
          <p className="text-base text-brand-muted leading-relaxed">
            Discover authentic single-origin turmeric, wooden cold-pressed oils, raw forest honey, and restorative adaptogens.
          </p>
        </div>

        {/* Top Control Bar: Mobile Filter Button, Search Bar, Sort */}
        <div className="bg-white border border-brand-border p-4 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Mobile Filter Toggle & Results Count */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold text-brand-primary border border-brand-primary px-3.5 py-2 rounded bg-brand-cream hover:bg-brand-primary hover:text-white transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filters {hasActiveFilters ? `(${selectedTags.length + (selectedCategory !== 'all' ? 1 : 0)})` : ''}</span>
            </button>

            <span className="text-sm font-medium text-brand-muted">
              Showing <strong className="text-brand-charcoal">{filteredProducts.length}</strong> of{' '}
              {allProducts.length} products
            </span>
          </div>

          {/* Right: Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-brand-border bg-white px-3 py-2 pl-9 pr-8 text-sm text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-brand-muted" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-brand-muted hover:text-brand-charcoal"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-brand-border bg-white px-3.5 py-2 pr-8 text-sm font-medium text-brand-charcoal hover:bg-brand-cream focus:outline-none focus:ring-1 focus:ring-brand-primary rounded-sm cursor-pointer appearance-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Most Popular</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-3 text-brand-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-brand-cream/60 p-3 rounded border border-brand-border">
            <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-brand-primary text-white px-3 py-1 rounded-full font-medium shadow-sm">
                Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X size={12} />
                </button>
              </span>
            )}

            {maxPrice < 800 && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-brand-primary text-white px-3 py-1 rounded-full font-medium shadow-sm">
                Max ₹{maxPrice}
                <button onClick={() => setMaxPrice(800)}>
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-xs bg-brand-accent text-white px-3 py-1 rounded-full font-medium shadow-sm"
              >
                {tag}
                <button onClick={() => toggleTag(tag)}>
                  <X size={12} />
                </button>
              </span>
            ))}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-brand-primary text-white px-3 py-1 rounded-full font-medium shadow-sm">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}>
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-semibold underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Left Sidebar Filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white border border-brand-border p-6 shadow-sm sticky top-24 rounded-sm">
              <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                <h2 className="font-serif text-xl font-bold text-brand-primary flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-brand-muted hover:text-red-600 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {renderFilterContent()}
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse flex flex-col h-[420px] bg-brand-cream/60 border border-brand-border rounded-sm"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white border border-brand-border p-16 text-center shadow-sm rounded-sm max-w-lg mx-auto my-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-muted mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-2xl font-serif text-brand-primary font-bold mb-2">
                  No Products Found
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-6">
                  We couldn't find any natural essentials matching your selected filters. Try broadening your criteria or search term.
                </p>
                <Button onClick={resetFilters} className="gap-2">
                  <RotateCcw size={16} /> Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            ></div>

            {/* Slide-out Drawer */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-cream/40">
                <h3 className="font-serif text-lg font-bold text-brand-primary flex items-center gap-2">
                  <Filter size={18} /> Filter Products
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-brand-charcoal hover:bg-brand-cream"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {renderFilterContent()}
              </div>

              <div className="p-4 border-t border-brand-border bg-brand-cream/20 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply Filters ({filteredProducts.length})
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;
