import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { Product } from '../types';
import ProductModal from '../components/ProductModal';
import { LayoutGrid, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const FILTER_OPTIONS = [
  { value: 'available', label: 'Available Online' },
  { value: 'new', label: 'New' },
  { value: 'limited', label: 'Limited Edition' },
  { value: 'refillable', label: 'Refillable' },
];

const CATEGORIES = [
  { value: 'All', label: 'All Products' },
  { value: 'Rings', label: 'Rings' },
  { value: 'Necklaces', label: 'Necklaces' },
  { value: 'Earrings', label: 'Earrings' },
  { value: 'Bracelets', label: 'Bracelets' },
  { value: 'Other', label: 'Other' },
];

const BRANDS = ['Bulgari', 'Cartier', 'Messika', 'Van Cleef', 'Boucheron', 'Chaumet', 'Chopard', 'Other'];

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
  const [sortOption, setSortOption] = useState('featured');
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  const handleImageError = (productId: string | number) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await db.getProducts();
        console.log('Fetched products with image URLs:', data.slice(0, 3).map(p => ({ 
          id: p.id, 
          name: p.name, 
          firstImage: p.images?.[0] 
        })));
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const brandParam = params.get('brand');
    const collectionParam = params.get('collection');
    const searchParam = params.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    
    if (brandParam) {
      setSelectedBrand(brandParam);
    } else {
      setSelectedBrand(null);
    }

    if (collectionParam) {
      setSelectedCollection(collectionParam);
    } else {
      setSelectedCollection(null);
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredProducts = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesBrand = !selectedBrand || p.brand === selectedBrand;
      const matchesCollection = !selectedCollection || p.collection === selectedCollection;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
        if (filter === 'new') return p.is_new === 1;
        if (filter === 'limited') return p.is_limited === 1;
        if (filter === 'available') return true; // Assuming all displayed are available
        return true;
      });

      const matchesPrice = !priceRange || (
        (p.price >= priceRange[0] && p.price <= priceRange[1]) ||
        (p.max_price && p.max_price >= priceRange[0] && p.max_price <= priceRange[1]) ||
        (p.max_price && p.price <= priceRange[0] && p.max_price >= priceRange[1])
      );

      return matchesCategory && matchesBrand && matchesCollection && matchesSearch && matchesFilters && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
          <div className="text-breadcrumb">
            <Link to="/" className="hover:text-black transition-colors">HOME</Link>
            {selectedBrand && <> / {selectedBrand.toUpperCase()}</>}
            {selectedCategory !== 'All' && <> / {selectedCategory.toUpperCase()}</>}
            {selectedCollection ? <> / {selectedCollection.toUpperCase()}</> : <> / ALL COLLECTIONS</>}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button - Only visible on mobile */}
      <div className="lg:hidden border-b border-stone-200 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-filter-label text-black"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
            Filters
          </button>
          <span className="text-model-count">
            {filteredProducts.length} Models
          </span>
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.15em] text-stone-900">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="px-6 py-6">
              {/* Sort By Section */}
              <div className="mb-8">
                <h3 className="text-filter-label mb-4">
                  SORT BY
                </h3>
                <div className="space-y-3">
                  {SORT_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="sort-mobile"
                        value={option.value}
                        checked={sortOption === option.value}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="mr-3 w-4 h-4 text-black focus:ring-black"
                      />
                      <span className="text-filter-option group-hover:text-black transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter By Section */}
              <div className="mb-8">
                <h3 className="text-filter-label mb-4">
                  FILTER BY
                </h3>
                <div className="space-y-3">
                  {FILTER_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(option.value)}
                        onChange={() => toggleFilter(option.value)}
                        className="mr-3 w-4 h-4 text-black focus:ring-black rounded"
                      />
                      <span className="text-filter-option group-hover:text-black transition-colors">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Section */}
              <div className="mb-8 border-t border-stone-100 pt-8">
                <h3 className="text-filter-label mb-4">
                  BRAND
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedBrand(null);
                      setMobileFiltersOpen(false);
                    }}
                    className={`block w-full text-left text-filter-option transition-colors ${
                      !selectedBrand
                        ? 'text-black font-semibold'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    All Brands
                  </button>
                  {BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left text-filter-option transition-colors ${
                        selectedBrand === brand
                          ? 'text-black font-semibold'
                          : 'text-stone-700 hover:text-black'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter - Mobile */}
              <div className="mb-8 border-t border-stone-100 pt-8">
                <h3 className="text-filter-label mb-4">
                  PRICE (AED)
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'All Prices', value: null },
                    { label: 'Under 1,000', value: [0, 1000] },
                    { label: '1,000 - 5,000', value: [1000, 5000] },
                    { label: '5,000 - 10,000', value: [5000, 10000] },
                    { label: 'Over 10,000', value: [10000, 1000000] },
                  ].map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPriceRange(range.value as [number, number] | null);
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left text-filter-option transition-colors ${
                        JSON.stringify(priceRange) === JSON.stringify(range.value)
                          ? 'text-black font-semibold'
                          : 'text-stone-700 hover:text-black'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Section */}
              <div className="mb-8 border-t border-stone-100 pt-8">
                <h3 className="text-filter-label mb-4">
                  CATEGORY
                </h3>
                <div className="space-y-3">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left text-filter-option transition-colors ${
                        selectedCategory === category.value
                          ? 'text-black font-semibold'
                          : 'text-stone-700 hover:text-black'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-black text-white py-3 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-stone-900 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex gap-12">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          {/* Sort By Section */}
          <div className="mb-10">
            <h3 className="text-filter-label mb-4">
              SORT BY
            </h3>
            <div className="space-y-4">
              {SORT_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortOption === option.value}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="mr-3 w-4 h-4 text-black border-stone-300 focus:ring-black"
                  />
                  <span className="text-filter-option group-hover:text-black transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter By Section */}
          <div className="mb-10">
            <h3 className="text-filter-label mb-4">
              FILTER BY
            </h3>
            <div className="space-y-4">
              {FILTER_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(option.value)}
                    onChange={() => toggleFilter(option.value)}
                    className="mr-3 w-4 h-4 text-black border-stone-300 focus:ring-black rounded"
                  />
                  <span className="text-filter-option group-hover:text-black transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Section */}
          <div className="mb-10">
            <button
              onClick={() => setBrandOpen(!brandOpen)}
              className="flex items-center justify-between w-full text-filter-label mb-4"
            >
              BRAND
              {brandOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {brandOpen && (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className={`block w-full text-left text-filter-option transition-colors ${
                    !selectedBrand
                      ? 'text-black font-semibold'
                      : 'text-stone-700 hover:text-black'
                  }`}
                >
                  All Brands
                </button>
                {BRANDS.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`block w-full text-left text-filter-option transition-colors ${
                      selectedBrand === brand
                        ? 'text-black font-semibold'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="mb-10">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center justify-between w-full text-filter-label mb-4"
            >
              CATEGORY
              {categoryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {categoryOpen && (
              <div className="space-y-4">
                {CATEGORIES.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`block w-full text-left text-filter-option transition-colors ${
                      selectedCategory === category.value
                        ? 'text-black font-semibold'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="mb-10">
            <button
              onClick={() => setPriceOpen(!priceOpen)}
              className="flex items-center justify-between w-full text-filter-label mb-4"
            >
              PRICE
              {priceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {priceOpen && (
              <div className="space-y-4">
                {[
                  { label: 'All Prices', value: null },
                  { label: 'Under 1,000', value: [0, 1000] },
                  { label: '1,000 - 5,000', value: [1000, 5000] },
                  { label: '5,000 - 10,000', value: [5000, 10000] },
                  { label: 'Over 10,000', value: [10000, 1000000] },
                ].map((range, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPriceRange(range.value as [number, number] | null)}
                    className={`block w-full text-left text-filter-option transition-colors ${
                      JSON.stringify(priceRange) === JSON.stringify(range.value)
                        ? 'text-black font-semibold'
                        : 'text-stone-700 hover:text-black'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Loading...</div>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map(product => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-stone-50 mb-6 overflow-hidden">
                    {imageErrors[product.id] || !product.images?.[0] ? (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <span className="text-stone-400 text-sm">Image unavailable</span>
                      </div>
                    ) : (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={() => handleImageError(product.id)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* New Tag */}
                    {product.is_new === 1 && (
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 border border-stone-100 shadow-sm">
                        <span className="text-[10px] font-bold tracking-[0.1em] text-black">NEW</span>
                      </div>
                    )}

                    {/* Add to Bag Button */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-center py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">VIEW DETAILS</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="text-center px-4">
                    <h3 className="text-product-name mb-1">
                      {product.name}
                    </h3>
                    <p className="text-product-brand-collection mb-2">
                       {product.collection || product.brand}
                    </p>
                    <p className="text-product-price">
                      AED {product.price.toLocaleString()}
                      {product.max_price ? ` - ${product.max_price.toLocaleString()}` : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[11px] text-stone-500 uppercase tracking-[0.2em]">No products found</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;