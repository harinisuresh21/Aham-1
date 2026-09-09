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
  Filter, 
  ShieldCheck, 
  Leaf,
  ChevronDown,
  Tag,
  DollarSign
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

  // Collapsible Accordion States for Sidebar
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    quality: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    maxPrice < 800 ||
    selectedTags.length > 0 ||
    inStockOnly;

  const activeFilterCount =
    (searchQuery.trim() !== '' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (maxPrice < 800 ? 1 : 0) +
    selectedTags.length +
    (inStockOnly ? 1 : 0);

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
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
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
    <div className="space-y-6">
      {/* 1. Category Filter Accordion */}
      <div className="border-b border-[#243D2B]/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between font-serif text-base font-bold text-[#1B3022] hover:text-[#47623F] transition-colors mb-3 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <Leaf size={15} className="text-[#71835B]" /> Categories
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 text-gray-400 ${
              openSections.categories ? 'rotate-180 text-[#1B3022]' : ''
            }`}
          />
        </button>

        {openSections.categories && (
          <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#243D2B] text-white font-semibold shadow-xs'
                  : 'text-[#1B3022] hover:bg-[#FAF6EE] font-medium'
              }`}
            >
              <span>All Formulations</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  selectedCategory === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#FAF6EE] text-[#71835B]'
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
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[13px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#243D2B] text-white font-semibold shadow-xs'
                      : 'text-[#1B3022] hover:bg-[#FAF6EE] font-medium'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FAF6EE] text-[#71835B]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Range Slider Accordion */}
      <div className="border-b border-[#243D2B]/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between font-serif text-base font-bold text-[#1B3022] hover:text-[#47623F] transition-colors mb-3 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <DollarSign size={15} className="text-[#C2A573]" /> Price Range
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 text-gray-400 ${
              openSections.price ? 'rotate-180 text-[#1B3022]' : ''
            }`}
          />
        </button>

        {openSections.price && (
          <div className="pt-1 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Max Budget</span>
              <span className="text-xs font-bold text-[#1B3022] bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#243D2B]/10 font-serif">
                Up to ₹{maxPrice}
              </span>
            </div>

            <input
              type="range"
              min="200"
              max="800"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#243D2B] cursor-pointer h-2 bg-[#FAF6EE] rounded-lg border border-[#243D2B]/10"
            />

            <div className="flex justify-between text-[11px] text-gray-400 font-medium font-sans">
              <span>₹200</span>
              <span>₹500</span>
              <span>₹800</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Certifications & Quality Tags Accordion */}
      <div className="border-b border-[#243D2B]/10 pb-5">
        <button
          type="button"
          onClick={() => toggleSection('quality')}
          className="w-full flex items-center justify-between font-serif text-base font-bold text-[#1B3022] hover:text-[#47623F] transition-colors mb-3 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#71835B]" /> Quality Standards
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 text-gray-400 ${
              openSections.quality ? 'rotate-180 text-[#1B3022]' : ''
            }`}
          />
        </button>

        {openSections.quality && (
          <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
            {certificationTags.map((tag) => {
              const isChecked = selectedTags.includes(tag.id);

              return (
                <label
                  key={tag.id}
                  className="flex items-center gap-2.5 text-[13px] text-[#1B3022] cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleTag(tag.id)}
                    className="rounded-md border-[#243D2B]/20 text-[#243D2B] focus:ring-[#243D2B] accent-[#243D2B] w-4 h-4 cursor-pointer"
                  />
                  <span
                    className={`transition-colors ${
                      isChecked ? 'font-bold text-[#243D2B]' : 'group-hover:text-[#47623F]'
                    }`}
                  >
                    {tag.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Availability Toggle */}
      <div className="pt-1">
        <label className="flex items-center justify-between cursor-pointer select-none py-1">
          <span className="text-[13px] font-semibold text-[#1B3022]">In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded-md border-[#243D2B]/20 text-[#243D2B] focus:ring-[#243D2B] accent-[#243D2B] w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {/* 5. Reset Filter Button */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw size={13} /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#FDFAF5] min-h-screen pb-16 lg:pb-24">
      {/* ======================================================== */}
      {/* 1. HERO HEADER: "Our Sacred Apothecary & Essentials" */}
      {/* ======================================================== */}
      <div className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-b from-[#FAF6EE] via-[#F6F0E4]/60 to-[#FDFAF5] overflow-hidden border-b border-[#243D2B]/8">
        {/* Subtle Ambient Herbal Glow & Watermark Motifs */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#E5A93B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 left-10 w-[400px] h-[300px] bg-[#71835B]/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 text-center max-w-3xl mx-auto px-4 sm:px-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md mb-4 border border-[#243D2B]/12 shadow-xs">
            <Leaf size={12} className="text-[#71835B]" />
            <span className="text-[#1B3022] text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
              PURE HERBAL HARVEST • AYURVEDIC MASTERY
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#1B3022] font-semibold tracking-tight mb-3 sm:mb-4 leading-tight">
            Our Sacred Apothecary & Essentials
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#1E2D24]/80 leading-relaxed max-w-2xl mx-auto font-sans">
            Hand-harvested botanicals, wooden cold-pressed oils, and traditional adaptogenic remedies crafted with zero compromises for your everyday wellness rituals.
          </p>

          {/* Integrated Luxury Search Bar */}
          <div className="mt-7 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search herbal powder, oils, honey, ashwagandha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-md border border-[#243D2B]/15 rounded-2xl py-3 pl-11 pr-10 text-sm sm:text-[15px] text-[#1B3022] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#243D2B]/30 focus:border-[#243D2B] shadow-sm transition-all"
              />
              <Search size={18} className="absolute left-4 text-[#71835B]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-gray-400 hover:text-[#1B3022] p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* ======================================================== */}
      {/* 2. MAIN CATALOG LAYOUT */}
      {/* ======================================================== */}
      <Container className="pt-8 sm:pt-10">
        {/* Top Control Bar: Mobile Filter Toggle, Count, Sort */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#243D2B]/10 p-3.5 sm:p-4 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Results Count & Mobile Filter Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 text-xs font-bold text-[#1B3022] border border-[#243D2B]/20 px-3.5 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#243D2B] hover:text-white transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={15} />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>

            <span className="text-xs sm:text-sm font-medium text-gray-600">
              Showing <strong className="text-[#1B3022] font-serif font-bold">{filteredProducts.length}</strong> of{' '}
              {allProducts.length} sacred items
            </span>
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto border border-[#243D2B]/15 bg-white px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-[#1B3022] rounded-xl hover:border-[#243D2B]/40 focus:outline-none focus:ring-1 focus:ring-[#243D2B] cursor-pointer appearance-none shadow-xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="newest">Most Popular</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Pill Counter Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-[#243D2B]/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#71835B] mr-1 flex items-center gap-1">
              <Tag size={12} /> Active Filters ({activeFilterCount}):
            </span>

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#243D2B] text-white px-3 py-1 rounded-full font-medium shadow-xs">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="cursor-pointer ml-1">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#243D2B] text-white px-3 py-1 rounded-full font-medium shadow-xs">
                Category: {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="cursor-pointer ml-1">
                  <X size={12} />
                </button>
              </span>
            )}

            {maxPrice < 800 && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#243D2B] text-white px-3 py-1 rounded-full font-medium shadow-xs">
                Under ₹{maxPrice}
                <button onClick={() => setMaxPrice(800)} className="cursor-pointer ml-1">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-[#C2A573] text-[#1B3022] px-3 py-1 rounded-full font-bold shadow-xs"
              >
                {tag}
                <button onClick={() => toggleTag(tag)} className="cursor-pointer ml-1">
                  <X size={12} />
                </button>
              </span>
            ))}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 text-xs bg-[#243D2B] text-white px-3 py-1 rounded-full font-medium shadow-xs">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="cursor-pointer ml-1">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 font-bold ml-auto cursor-pointer underline px-2 py-0.5"
            >
              Clear All
            </button>
          </div>
        )}

        {/* 2-Column Desktop Layout: Sidebar + 3-Col Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-[#243D2B]/10 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-[#243D2B]/10 mb-5">
                <h2 className="font-serif text-lg font-bold text-[#1B3022] flex items-center gap-2">
                  <Filter size={17} className="text-[#71835B]" /> Refine Apothecary
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs font-bold text-[#C2A573] hover:text-[#1B3022] transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {renderFilterContent()}
            </div>
          </aside>

          {/* Product Grid: 3 per row on desktop, 2 on tablet, 1 on mobile */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse flex flex-col h-[430px] bg-white/70 border border-[#243D2B]/10 rounded-2xl p-4"
                  >
                    <div className="aspect-square bg-gray-200/60 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200/60 rounded w-1/3 mb-2" />
                    <div className="h-5 bg-gray-200/60 rounded w-3/4 mb-4" />
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div className="h-6 bg-gray-200/60 rounded w-1/4" />
                      <div className="h-9 bg-gray-200/60 rounded-xl w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter Fallback State */
              <div className="bg-white rounded-2xl border border-[#243D2B]/10 p-12 sm:p-16 text-center shadow-xs max-w-lg mx-auto my-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6EE] border border-[#243D2B]/10 flex items-center justify-center text-[#71835B] mb-4">
                  <Search size={26} />
                </div>
                <h3 className="text-2xl font-serif text-[#1B3022] font-bold mb-2">
                  No Formulations Found
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 font-sans">
                  We couldn't find any natural herbal items matching your criteria. Try adjusting your search term or clearing the active filters.
                </p>
                <Button onClick={resetFilters} className="gap-2 rounded-xl">
                  <RotateCcw size={15} /> Reset All Filters
                </Button>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer Slide-Out Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-5 border-b border-[#243D2B]/10 bg-[#FAF6EE]">
                <h3 className="font-serif text-lg font-bold text-[#1B3022] flex items-center gap-2">
                  <Filter size={18} className="text-[#71835B]" /> Filter Products
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full text-[#1B3022] hover:bg-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                {renderFilterContent()}
              </div>

              <div className="p-4 border-t border-[#243D2B]/10 bg-[#FAF6EE]/50 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-[#243D2B]/20"
                  onClick={() => {
                    resetFilters();
                    setMobileFilterOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 rounded-xl"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Apply ({filteredProducts.length})
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
