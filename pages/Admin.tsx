import React, { useState, useEffect } from 'react';
import { db, isRealApi } from '../services/db';
import { Product } from '../types';
import { Trash2, Plus, LogOut, Lock, Database, Upload, Edit3, X } from 'lucide-react';

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Other'];
const BRANDS = ['Bulgari', 'Cartier', 'Messika', 'Van Cleef', 'Boucheron', 'Chaumet', 'Chopard', 'Other'];

const BRAND_COLLECTIONS: Record<string, string[]> = {
  'Bulgari': ['Serpenti', 'B.zero1', 'Bvlgari Bvlgari', 'Fiorever', 'Divas\' Dream'],
  'Cartier': ['Love', 'Juste un Clou', 'Trinity', 'Panthère de Cartier', 'Clash de Cartier', 'Diamond Collection', 'Grain de Café'],
  'Messika': ['Move', 'My Twin', 'Gatsby', 'Joy'],
  'Van Cleef': ['Alhambra', 'Perlée', 'Frivole', 'Socrate'],
  'Boucheron': ['Quatre', 'Serpent Bohème'],
  'Chaumet': ['Joséphine', 'Bee My Love', 'Liens'],
  'Chopard': ['Happy Diamonds', 'Ice Cube'],
};

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState('Other');
  const [isNew, setIsNew] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [collection, setCollection] = useState('');
  
  // File Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Edit Mode State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  // Reset collection when brand changes to prevent cross-brand data entry
  useEffect(() => {
    if (!editingProduct) {
      setCollection('');
    }
  }, [brand]);

  // Admin Search/Filter State
  const [filterBrand, setFilterBrand] = useState('All Brands');

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await db.getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      const errorMsg = err.message || "Failed to connect to database";
      alert(`Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate inputs on frontend
      if (!username.trim() || !password.trim()) {
        alert('Please enter both username and password');
        setLoading(false);
        return;
      }

      // Use direct remote URL for login (bypass Vite proxy for this endpoint)
      const loginUrl = 'https://codersdek.com/jewels_api/api/login.php';
      
      const payload = { username: username.trim(), password: password.trim() };
      console.log('Sending login request:', payload);
        
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit' // Important: omit credentials for remote requests
      });
      
      const text = await response.text();
      console.log('Login response status:', response.status);
      console.log('Login response text:', text);
      
      const data = JSON.parse(text);
      
      if (response.ok && data.status === 'success') {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        fetchProducts();
      } else {
        alert(data.message || 'Invalid credentials');
        if (data.debug) {
          console.error('Server debug info:', data.debug);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      alert('Failed to connect to login server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file as File));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setMaxPrice('');
    setCategory(CATEGORIES[0]);
    setBrand('Other');
    setIsNew(false);
    setIsLimited(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingProduct(null);
    setExistingImages([]);
    setCollection('');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setMaxPrice(product.max_price?.toString() || '');
    setCategory(product.category || CATEGORIES[0]);
    setBrand(product.brand || 'Other');
    setIsNew(!!product.is_new);
    setIsLimited(!!product.is_limited);
    setExistingImages(product.images || []);
    setCollection(product.collection || '');
    setSelectedFiles([]);
    setPreviewUrls([]);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalImages = existingImages.length + selectedFiles.length;
    
    if (!name || !description || !price) {
      alert('Please fill all required fields.');
      return;
    }
    
    if (!editingProduct && selectedFiles.length === 0) {
      alert('Please upload at least one image for new products.');
      return;
    }
    
    if (editingProduct && totalImages === 0) {
      alert('Product must have at least one image.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update existing product
        await db.updateProduct(
          editingProduct.id,
          {
            name,
            description,
            price: parseFloat(price),
            max_price: maxPrice ? parseFloat(maxPrice) : undefined,
            category,
            brand: brand || undefined,
            is_new: isNew ? 1 : 0,
            is_limited: isLimited ? 1 : 0,
            collection: collection || undefined,
            images: existingImages,
          },
          selectedFiles,
          existingImages
        );
      } else {
        // Add new product
        await db.addProduct({
          name,
          description,
          price: parseFloat(price),
          max_price: maxPrice ? parseFloat(maxPrice) : undefined,
          category,
          brand: brand || undefined,
          collection: collection || undefined,
          is_new: isNew ? 1 : 0,
          is_limited: isLimited ? 1 : 0,
          images: [], 
        }, selectedFiles);
      }
      
      // Reset form and refresh
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      alert('Failed to save product: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await db.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (window.confirm(`Are you sure you want to delete ${count} selected product(s)?`)) {
      setLoading(true);
      try {
        await db.deleteProduct(Array.from(selectedIds));
        setSelectedIds(new Set());
        fetchProducts();
      } catch (err: any) {
        alert("Failed to bulk delete: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSelectAll = () => {
    const visibleProducts = products.filter(p => filterBrand === 'All Brands' || p.brand === filterBrand);
    if (selectedIds.size === visibleProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-stone-100 rounded-full">
              <Lock className="w-8 h-8 text-stone-600" />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center text-stone-900 mb-8">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all !text-stone-900"
                placeholder="Enter admin username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-all !text-stone-900"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full !bg-stone-900 !text-white py-3 rounded-lg font-bold hover:bg-gold-500 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-stone-900 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-serif font-bold !text-white">Jewels Admin Dashboard</h1>
            <span className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${isRealApi ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-gold-500/20 text-gold-400 border-gold-500/30'}`}>
              <Database size={12} />
              {isRealApi ? 'Connected: 118.139.183.180' : 'Demo Mode (Local)'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-stone-300 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add/Edit Product Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900 flex items-center">
                {editingProduct ? (
                  <><Edit3 className="mr-2 h-5 w-5 text-blue-500" /> Edit Product</>
                ) : (
                  <><Plus className="mr-2 h-5 w-5 text-gold-500" /> Add New Product</>
                )}
              </h2>
              {editingProduct && (
                <button
                  onClick={resetForm}
                  className="text-stone-400 hover:text-stone-600 p-1"
                  title="Cancel Edit"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 !text-stone-900"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price (AED)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 !text-stone-900"
                    placeholder="Min"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Max Price (AED)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 !text-stone-900"
                    placeholder="Max (Optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 bg-white !text-stone-900"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 bg-white !text-stone-900"
                >
                  {BRANDS.map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              {BRAND_COLLECTIONS[brand] && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Collection</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 bg-white !text-stone-900"
                  >
                    <option value="">Select Collection</option>
                    {BRAND_COLLECTIONS[brand].map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {!BRAND_COLLECTIONS[brand] && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Collection (Optional)</label>
                  <input
                    type="text"
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    placeholder="Enter collection name"
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 !text-stone-900"
                  />
                </div>
              )}

              <div className="flex gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
                  />
                  <span className="text-sm font-medium text-stone-700">New Arrival</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLimited}
                    onChange={(e) => setIsLimited(e.target.checked)}
                    className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500"
                  />
                  <span className="text-sm font-medium text-stone-700">Limited Edition</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-gold-500 resize-none !text-stone-900"
                  required
                />
              </div>

              {/* Existing Images (Edit Mode) */}
              {editingProduct && existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Current Photos</label>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square bg-stone-100 rounded-md overflow-hidden">
                        <img src={url} alt="existing" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(idx)}
                          className="absolute inset-0 bg-red-500/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {editingProduct ? 'Add More Photos' : 'Upload Photos'}
                </label>
                
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-stone-400" />
                      <p className="text-sm text-stone-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-stone-500">JPG, PNG, WebP, AVIF</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*,.avif" onChange={handleFileSelect} />
                  </label>
                </div>

                {/* New Image Previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square bg-stone-100 rounded-md overflow-hidden">
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-bold transition-colors disabled:opacity-50 mt-4 ${
                  editingProduct 
                    ? '!bg-blue-600 !text-white hover:!bg-blue-700' 
                    : '!bg-stone-900 !text-white hover:!bg-gold-600'
                }`}
              >
                {isSubmitting 
                  ? (editingProduct ? 'Saving...' : 'Uploading...') 
                  : (editingProduct ? 'Save Changes' : 'Publish Product')
                }
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={products.filter(p => filterBrand === 'All Brands' || p.brand === filterBrand).length > 0 && selectedIds.size === products.filter(p => filterBrand === 'All Brands' || p.brand === filterBrand).length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500 cursor-pointer"
                  title="Select All Visible"
                />
                <h2 className="text-xl font-bold text-stone-900">Inventory Management</h2>
              </div>
              
              <div className="flex items-center gap-4">
                {selectedIds.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete {selectedIds.size} Selected
                  </button>
                )}
                <div className="flex items-center gap-2 border-l border-stone-100 pl-4">
                  <span className="text-xs text-stone-500 uppercase font-semibold">Filter:</span>
                  <select
                    value={filterBrand}
                    onChange={(e) => {
                      setFilterBrand(e.target.value);
                      setSelectedIds(new Set()); // Reset selection when filter changes
                    }}
                    className="text-xs border border-stone-200 rounded px-2 py-1 bg-stone-50 focus:outline-none focus:border-gold-500 !text-stone-900"
                  >
                    <option value="All Brands">All Brands</option>
                    {BRANDS.map(br => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-stone-500">Loading inventory...</div>
            ) : products.filter(p => filterBrand === 'All Brands' || p.brand === filterBrand).length === 0 ? (
              <div className="p-12 text-center text-stone-500">No products found for {filterBrand}.</div>
            ) : (
              <div className="divide-y divide-stone-100">
                {products
                  .filter(p => filterBrand === 'All Brands' || p.brand === filterBrand)
                  .map((product) => (
                  <div key={product.id} className={`p-6 flex items-start space-x-4 hover:bg-stone-50 transition-colors ${selectedIds.has(product.id) ? 'bg-gold-50/30' : ''}`}>
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 text-gold-600 rounded border-stone-300 focus:ring-gold-500 cursor-pointer"
                      />
                    </div>
                    <div className="h-20 w-20 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100?text=No+Img'} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=Error'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold !text-stone-900 truncate">{product.name}</h3>
                        <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-2 py-1 rounded-full uppercase">{product.category || 'Other'}</span>
                      </div>
                      <p className="text-gold-600 font-medium mt-1">
                        AED {product.price.toLocaleString()}
                        {product.max_price ? ` - ${product.max_price.toLocaleString()}` : ''}
                      </p>
                      <p className="!text-stone-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                      <div className="mt-2 text-xs !text-stone-400">
                        ID: {product.id} • {product.images?.length || 0} photo(s) 
                        {product.brand && <span className="mx-1">•</span>}
                        {product.brand}
                        {product.collection && <span className="mx-1">•</span>}
                        {product.collection}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Product"
                      >
                        <Edit3 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;