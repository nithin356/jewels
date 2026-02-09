import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Product } from '../types';
import { Phone, MapPin, User, Share2, Package, RefreshCw, MessageCircle } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customSize, setCustomSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<{[key: string | number]: boolean}>({});

  const handleImageError = (index: string | number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await db.getProduct(id);
        setProduct(data);
        
        // Fetch products from the same collection
        if (data.collection) {
          const allProducts = await db.getProducts();
          const related = allProducts.filter(p => 
            p.collection === data.collection && p.id !== data.id
          );
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[11px] text-stone-500 uppercase tracking-[0.2em] mb-4">Product not found</p>
          <Link to="/shop" className="text-[10px] underline hover:no-underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="text-[10px] text-stone-600 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-black transition-colors">HOME</Link>
            {' / '}
            <Link to="/shop" className="hover:text-black transition-colors">SHOP</Link>
            {product.category && <> / {product.category.toUpperCase()}</>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-stone-50 overflow-hidden flex items-center justify-center">
              {imageErrors[selectedImage] || !product.images?.[selectedImage] ? (
                <div className="flex items-center justify-center w-full h-full bg-stone-100">
                  <span className="text-stone-400 text-sm">Image unavailable</span>
                </div>
              ) : (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  onError={() => handleImageError(selectedImage)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-stone-50 overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-black'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    {imageErrors[index] ? (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <span className="text-[10px] text-stone-400">Error</span>
                      </div>
                    ) : (
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        onError={() => handleImageError(index)}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            {/* Product Name */}
            <div>
              <h1 
                className="text-2xl font-bold uppercase tracking-[0.15em] text-black mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {product.name}
              </h1>
              {product.brand && (
                <p 
                  className="text-[15px] text-[#C00000] mb-4 tracking-wide"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {product.brand} collection
                </p>
              )}
              <p 
                className="text-[17px] text-stone-900 leading-relaxed"
                style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.01em' }}
              >
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="text-2xl font-semibold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              AED {product.price.toLocaleString()}
              {product.max_price ? ` - ${product.max_price.toLocaleString()}` : ''}
            </div>

            {/* Size Selection for Rings */}
            {(product.category === 'Rings' || product.category === 'Engagement Rings' || product.category === 'Wedding Bands') && (
              <div className="pt-6 border-t border-stone-200">
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.2em]">Select Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full border border-stone-300 rounded-none p-3 text-xs font-medium uppercase tracking-widest text-stone-900 focus:outline-none focus:border-stone-900 appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center'
                    }}
                  >
                    <option value="">Select Size</option>
                    {[45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>

                  {selectedSize === 'Other' && (
                    <input
                      type="text"
                      placeholder="ENTER YOUR SIZE"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      className="w-full border border-stone-300 rounded-none p-3 text-xs font-medium uppercase tracking-widest text-stone-900 focus:outline-none focus:border-stone-900 placeholder:text-stone-400"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            <div className="space-y-3 py-6 border-y border-stone-200">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-stone-600" />
                <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Complimentary Shipping
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Package size={18} className="text-stone-600" />
                <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  1 Day Shipping
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Package size={18} className="text-stone-600" />
                <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Same Day Shipping in dubai
                </span>
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="space-y-3">
              {(() => {
                const isRingCategory = product.category === 'Rings' || product.category === 'Engagement Rings' || product.category === 'Wedding Bands';
                const missingSize = isRingCategory && (!selectedSize || (selectedSize === 'Other' && !customSize.trim()));
                
                const sizeText = selectedSize 
                  ? (selectedSize === 'Other' ? ` (Size: ${customSize})` : ` (Size: ${selectedSize})`) 
                  : '';
                const priceDisplay = product.max_price 
                  ? `AED ${product.price.toLocaleString()} - ${product.max_price.toLocaleString()}`
                  : `AED ${product.price.toLocaleString()}`;
                const whatsappMessage = encodeURIComponent(`Hello, I am interested in purchasing the ${product.name}${sizeText} (${priceDisplay}). Kindly confirm availability. Thank you!`);
                const whatsappUrl = `https://wa.me/7899090083?text=${whatsappMessage}`;

                return (
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => {
                      if (missingSize) {
                        e.preventDefault();
                        alert('Please select or enter a size first.');
                      }
                    }}
                    className={`flex items-center justify-center gap-3 w-full py-4 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                      missingSize
                       ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                       : 'bg-[#C00000] hover:bg-[#990000] text-white'
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>Contact on WhatsApp</span>
                  </a>
                );
              })()}
              <p className="text-[10px] text-stone-400 text-center uppercase tracking-wider">
                Directly chat with our sales team to finalize your order.
              </p>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4 pt-6">
              {/* Order by Phone */}
              <div className="border-b border-stone-200 pb-4">
                <button
                  onClick={() => toggleSection('phone')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-stone-600" />
                    <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Order by Phone: +1-800-CARTIER
                    </span>
                  </div>
                </button>
              </div>

              {/* Find in Boutique */}
              <div className="border-b border-stone-200 pb-4">
                <button
                  onClick={() => toggleSection('boutique')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-stone-600" />
                    <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Find in Boutique
                    </span>
                  </div>
                </button>
              </div>

              {/* Contact Ambassador */}
              <div className="border-b border-stone-200 pb-4">
                <button
                  onClick={() => toggleSection('ambassador')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-stone-600" />
                    <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Contact an Ambassador
                    </span>
                  </div>
                </button>
              </div>

              {/* Share */}
              <div className="border-b border-stone-200 pb-4">
                <button
                  onClick={() => toggleSection('share')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <Share2 size={16} className="text-stone-600" />
                    <span className="text-[11px] uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Share • Ref: {product.id}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-stone-100">
          <h2 
            className="text-2xl font-bold uppercase tracking-[0.15em] text-black mb-12"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {product.collection} collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((related) => (
              <Link 
                key={related.id}
                to={`/product/${related.id}`}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setLoading(true);
                }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square bg-stone-50 mb-6 overflow-hidden">
                  {imageErrors[`related-${related.id}`] || !related.images?.[0] ? (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100">
                      <span className="text-stone-400 text-sm">Image unavailable</span>
                    </div>
                  ) : (
                    <img
                      src={related.images[0]}
                      alt={related.name}
                      onError={() => handleImageError(`related-${related.id}`)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  
                  {/* New Tag */}
                  {related.is_new === 1 && (
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 border border-stone-100 shadow-sm">
                      <span className="text-[10px] font-bold tracking-[0.1em] text-black">NEW</span>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white text-center py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">VIEW DETAILS</span>
                  </div>
                </div>

                <div className="text-center px-4">
                  <h3 className="text-product-name mb-1">
                    {related.name}
                  </h3>
                  <p className="text-product-brand-collection mb-2">
                    {related.collection || related.brand}
                  </p>
                  <p className="text-product-price">
                    AED {related.price.toLocaleString()}
                    {related.max_price ? ` - ${related.max_price.toLocaleString()}` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
