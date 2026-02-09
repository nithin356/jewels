import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              {/* <Gem className="h-6 w-6 text-gold-400" /> */}
              <span className="text-xl font-cinzel font-bold text-white tracking-wider">HAY.LUXURY</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Timeless elegance for the modern soul. Discover our exclusive collection of handcrafted jewelry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition-colors">Collection</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gold-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-semibold mb-4">Contact</h3>
            <p className="text-sm text-stone-400 mb-2">hay.luxury</p>
            <p className="text-sm text-stone-400 mb-4">789 909 0083</p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-xs text-stone-500">
          <p>&copy; {new Date().getFullYear()} Hay.Luxury. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;