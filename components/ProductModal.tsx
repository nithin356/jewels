import React, { useState } from 'react';
import { Product } from '../types';
import { X, MessageCircle, ChevronLeft, ChevronRight, Share2, Heart, Shield, Truck, RotateCcw } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customSize, setCustomSize] = useState('');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  
  const sizeText = selectedSize 
    ? (selectedSize === 'Other' ? ` (Size: ${customSize})` : ` (Size: ${selectedSize})`) 
    : '';
  const priceDisplay = product.max_price 
    ? `AED ${product.price.toLocaleString()} - ${product.max_price.toLocaleString()}`
    : `AED ${product.price.toLocaleString()}`;
  const whatsappMessage = encodeURIComponent(`Hello, I am interested in purchasing the ${product.name}${sizeText} (${priceDisplay}). Kindly confirm availability. Thank you!`);
  const whatsappUrl = `https://wa.me/7899090083?text=${whatsappMessage}`;

  const handleShare = async () => {
    // ... share logic same ...
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name} from Jewels!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] md:max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Always visible */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-md"
        >
          <X size={18} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-stone-100 relative flex flex-col shrink-0">
          {/* Main Image */}
          <div className="relative h-64 md:h-auto md:flex-1 md:min-h-[500px]">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name}
              className="w-full h-full object-contain bg-gradient-to-br from-stone-50 to-stone-100"
            />
            {/* ... Badges and Arrows ... */}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-stone-900/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {product.category || 'Jewelry'}
              </span>
            </div>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                >
                  <ChevronLeft size={24} className="text-stone-700" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                >
                  <ChevronRight size={24} className="text-stone-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex justify-center gap-2 p-2 bg-white border-t border-stone-100">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex 
                      ? 'border-gold-500 ring-2 ring-gold-500/30 scale-105' 
                      : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 p-4 md:p-8 overflow-y-auto bg-white flex flex-col md:justify-center">
          {/* Header - Compact on mobile */}
          <div className="mb-4">
            <h2 className="text-xl md:text-3xl font-serif font-bold text-stone-900 mb-2 leading-tight">{product.name}</h2>
            <div className="flex items-center justify-between mb-3">
            <p className="text-2xl md:text-3xl text-gold-500 font-bold">
              AED {product.price.toLocaleString()}
              {product.max_price ? ` - ${product.max_price.toLocaleString()}` : ''}
            </p>
              
               {/* Share Button (moved next to price for compactness) */}
               <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 border border-stone-200 rounded-lg text-stone-600 hover:border-stone-400 hover:text-stone-900 transition-all text-xs font-bold"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>

          {/* Description - Collapsible on mobile, full on desktop */}
          <div className="mb-4 md:mb-8">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Description</h3>
             <div className="relative">
              <p className={`text-stone-600 text-sm md:text-base leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-2 md:line-clamp-none' : ''}`}>
                {product.description}
              </p>
              {/* Show toggle only on mobile if long */}
              {product.description && product.description.length > 100 && (
                <button 
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-gold-600 text-xs font-bold mt-1 hover:underline focus:outline-none md:hidden"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
          </div>

          {/* Trust Badges - Desktop Only */}
          <div className="hidden md:grid grid-cols-3 gap-3 mb-6 py-5 border-y border-stone-100">
            <div className="text-center">
              <Shield size={20} className="mx-auto mb-1 text-gold-500" />
              <p className="text-xs text-stone-500 font-medium">Authentic</p>
            </div>
            <div className="text-center">
              <Truck size={20} className="mx-auto mb-1 text-gold-500" />
              <p className="text-xs text-stone-500 font-medium">Free Shipping</p>
            </div>
            <div className="text-center">
              <RotateCcw size={20} className="mx-auto mb-1 text-gold-500" />
              <p className="text-xs text-stone-500 font-medium">7-Day Return</p>
            </div>
          </div>

          {/* Size Selection for Rings */}
          {(product.category === 'Rings' || product.category === 'Engagement Rings' || product.category === 'Wedding Bands') && (
            <div className="mb-6 border-t border-stone-100 pt-6">
                <div className="space-y-3">
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full border border-stone-300 rounded-none p-4 text-xs font-medium uppercase tracking-widest text-stone-900 focus:outline-none focus:border-stone-900 appearance-none bg-white cursor-pointer text-center"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center'
                        }}
                    >
                        <option value="">SELECT SIZE</option>
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
                            className="w-full border border-stone-300 rounded-none p-4 text-xs font-medium uppercase tracking-widest text-stone-900 focus:outline-none focus:border-stone-900 placeholder:text-stone-400"
                        />
                    )}
                </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="space-y-3 md:mt-4">
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center space-x-3 w-full py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg text-lg bg-[#C00000] hover:bg-[#990000] text-white"
            >
              <MessageCircle size={24} />
              <span>Contact on WhatsApp</span>
            </a>
            <p className="text-xs text-stone-400 text-center">
              Directly chat with our sales team to finalize your order.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;