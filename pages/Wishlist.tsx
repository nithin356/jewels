import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { MessageCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8 text-center">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-stone-500 mb-6">Your wishlist is currently empty.</p>
            <Link 
              to="/shop" 
              className="inline-block bg-stone-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col group">
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image'; }}
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-stone-400 hover:text-red-500 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{product.name}</h3>
                  <p className="text-gold-600 font-bold text-lg mb-4">AED {product.price.toLocaleString()}</p>
                  
                  <div className="mt-auto">
                    <button 
                      className="w-full flex items-center justify-center space-x-2 bg-stone-900 text-white py-3 px-4 rounded-none hover:bg-gold-500 transition-colors text-sm font-bold uppercase tracking-wide"
                      onClick={() => {
                        window.open(`https://wa.me/7899090083?text=${encodeURIComponent(`Hello, I am interested in purchasing the ${product.name} (AED ${product.price.toLocaleString()}) from my wishlist. Kindly confirm availability. Thank you!`)}`, '_blank');
                      }}
                    >
                      <MessageCircle size={18} />
                      <span>Inquire Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
