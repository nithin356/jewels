import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronRight, MapPin, Phone, MessageCircle, ChevronLeft } from 'lucide-react';

const MEGA_MENU_DATA: Record<string, {
  categories: string[];
  collections: {
    category: string;
    label: string;
    href: string;
    image: string;
  }[];
}> = {
  'Bulgari': {
    categories: ['BRACELETS', 'RINGS', 'NECKLACES', 'EARRINGS'],
    collections: [
      // Bracelets
      { category: 'BRACELETS', label: 'SERPENTI', href: '/shop?brand=Bulgari&category=Bracelets&collection=Serpenti', image: '/bulgari/bracelete/SERPENTI.jpg' },
      { category: 'BRACELETS', label: 'B.ZERO1', href: '/shop?brand=Bulgari&category=Bracelets&collection=B.zero1', image: '/bulgari/bracelete/B.ZERO1.jpg' },
      { category: 'BRACELETS', label: 'BVLGARI BVLGARI', href: '/shop?brand=Bulgari&category=Bracelets&collection=Bvlgari Bvlgari', image: '/bulgari/bracelete/BVLGARI BVLGARI.jpg' },
      { category: 'BRACELETS', label: 'DIVAS\' DREAM', href: '/shop?brand=Bulgari&category=Bracelets&collection=Divas Dream', image: '/bulgari/bracelete/DIVAS\' DREAM.jpg' },
      { category: 'BRACELETS', label: 'FIOREVER', href: '/shop?brand=Bulgari&category=Bracelets&collection=Fiorever', image: '/bulgari/bracelete/FIOREVER.jpg' },
      // Rings
      { category: 'RINGS', label: 'SERPENTI', href: '/shop?brand=Bulgari&category=Rings&collection=Serpenti', image: '/bulgari/ring/SERPENTI.jpg' },
      { category: 'RINGS', label: 'B.ZERO1', href: '/shop?brand=Bulgari&category=Rings&collection=B.zero1', image: '/bulgari/ring/B.ZERO1.jpg' },
      { category: 'RINGS', label: 'BVLGARI BVLGARI', href: '/shop?brand=Bulgari&category=Rings&collection=Bvlgari Bvlgari', image: '/bulgari/ring/BVLGARI BVLGARI.jpg' },
      { category: 'RINGS', label: 'DIVAS\' DREAM', href: '/shop?brand=Bulgari&category=Rings&collection=Divas Dream', image: '/bulgari/ring/DIVAS\' DREAM.jpg' },
      { category: 'RINGS', label: 'FIOREVER', href: '/shop?brand=Bulgari&category=Rings&collection=Fiorever', image: '/bulgari/ring/FIOREVER.jpg' },
      // Necklaces
      { category: 'NECKLACES', label: 'SERPENTI', href: '/shop?brand=Bulgari&category=Necklaces&collection=Serpenti', image: '/bulgari/necklace/SERPENTI.jpg' },
      { category: 'NECKLACES', label: 'B.ZERO1', href: '/shop?brand=Bulgari&category=Necklaces&collection=B.zero1', image: '/bulgari/necklace/B.ZERO1.jpg' },
      { category: 'NECKLACES', label: 'BVLGARI BVLGARI', href: '/shop?brand=Bulgari&category=Necklaces&collection=Bvlgari Bvlgari', image: '/bulgari/necklace/BVLGARI BVLGARI.jpg' },
      { category: 'NECKLACES', label: 'DIVAS\' DREAM', href: '/shop?brand=Bulgari&category=Necklaces&collection=Divas Dream', image: '/bulgari/necklace/DIVAS\' DREAM.jpg' },
      { category: 'NECKLACES', label: 'FIOREVER', href: '/shop?brand=Bulgari&category=Necklaces&collection=Fiorever', image: '/bulgari/necklace/FIOREVER.png' },
      // Earrings
      { category: 'EARRINGS', label: 'SERPENTI', href: '/shop?brand=Bulgari&category=Earrings&collection=Serpenti', image: '/bulgari/earings/SERPENTI.jpg' },
      { category: 'EARRINGS', label: 'B.ZERO1', href: '/shop?brand=Bulgari&category=Earrings&collection=B.zero1', image: '/bulgari/earings/B.ZERO1.jpg' },
      { category: 'EARRINGS', label: 'BVLGARI BVLGARI', href: '/shop?brand=Bulgari&category=Earrings&collection=Bvlgari Bvlgari', image: '/bulgari/earings/BVLGARI BVLGARI.jpg' },
      { category: 'EARRINGS', label: 'DIVAS\' DREAM', href: '/shop?brand=Bulgari&category=Earrings&collection=Divas Dream', image: '/bulgari/earings/DIVAS\' DREAM.jpg' },
      { category: 'EARRINGS', label: 'FIOREVER', href: '/shop?brand=Bulgari&category=Earrings&collection=Fiorever', image: '/bulgari/earings/FIOREVER.jpg' },
    ]
  },
  'Cartier': {
    categories: ['BRACELETS', 'RINGS', 'NECKLACES', 'EARRINGS'],
    collections: [
      // Bracelets
      { category: 'BRACELETS', label: 'LOVE', href: '/shop?brand=Cartier&category=Bracelets&collection=Love', image: '/cartier/bracelete/LOVE.jpg' },
      { category: 'BRACELETS', label: 'JUSTE UN CLOU', href: '/shop?brand=Cartier&category=Bracelets&collection=Juste un Clou', image: '/cartier/bracelete/JUSTE UN CLOU.jpg' },
      { category: 'BRACELETS', label: 'TRINITY', href: '/shop?brand=Cartier&category=Bracelets&collection=Trinity', image: '/cartier/bracelete/TRINITY.jpg' },
      { category: 'BRACELETS', label: 'PANTHÈRE DE CARTIER', href: '/shop?brand=Cartier&category=Bracelets&collection=Panthère de Cartier', image: '/cartier/bracelete/PANTHÈRE DE CARTIER.jpg' },
      { category: 'BRACELETS', label: 'CLASH DE CARTIER', href: '/shop?brand=Cartier&category=Bracelets&collection=Clash de Cartier', image: '/cartier/bracelete/CLASH DE CARTIER.jpg' },
      { category: 'BRACELETS', label: 'DIAMOND COLLECTION', href: '/shop?brand=Cartier&category=Bracelets&collection=Diamond Collection', image: '/cartier/bracelete/Diamond collection.jpg' },
      // Rings
      { category: 'RINGS', label: 'LOVE', href: '/shop?brand=Cartier&category=Rings&collection=Love', image: '/cartier/ring/love.jpg' },
      { category: 'RINGS', label: 'JUSTE UN CLOU', href: '/shop?brand=Cartier&category=Rings&collection=Juste un Clou', image: '/cartier/ring/JUSTE UN CLOU.jpg' },
      { category: 'RINGS', label: 'TRINITY', href: '/shop?brand=Cartier&category=Rings&collection=Trinity', image: '/cartier/ring/TRINITY.jpg' },
      { category: 'RINGS', label: 'PANTHÈRE DE CARTIER', href: '/shop?brand=Cartier&category=Rings&collection=Panthère de Cartier', image: '/cartier/ring/PANTHÈRE DE CARTIER.jpg' },
      { category: 'RINGS', label: 'CLASH DE CARTIER', href: '/shop?brand=Cartier&category=Rings&collection=Clash de Cartier', image: '/cartier/ring/CLASH DE CARTIER.jpg' },
      { category: 'RINGS', label: 'GRAIN DE CAFÉ', href: '/shop?brand=Cartier&category=Rings&collection=Grain de Café', image: '/cartier/ring/GRAIN DE CAFÉ.jpg' },
      // Necklaces
      { category: 'NECKLACES', label: 'LOVE', href: '/shop?brand=Cartier&category=Necklaces&collection=Love', image: '/cartier/necklace/LOVE.jpg' },
      { category: 'NECKLACES', label: 'JUSTE UN CLOU', href: '/shop?brand=Cartier&category=Necklaces&collection=Juste un Clou', image: '/cartier/necklace/JUSTE UN CLOU.jpg' },
      { category: 'NECKLACES', label: 'CLASH DE CARTIER', href: '/shop?brand=Cartier&category=Necklaces&collection=Clash de Cartier', image: '/cartier/necklace/CLASH DE CARTIER.jpg' },
      { category: 'NECKLACES', label: 'GRAIN DE CAFÉ', href: '/shop?brand=Cartier&category=Necklaces&collection=Grain de Café', image: '/cartier/necklace/GRAIN DE CAFÉ.jpg' },
      { category: 'NECKLACES', label: 'TRINITY', href: '/shop?brand=Cartier&category=Necklaces&collection=Trinity', image: '/cartier/necklace/TRINITY.jpg' },
      { category: 'NECKLACES', label: 'PANTHÈRE DE CARTIER', href: '/shop?brand=Cartier&category=Necklaces&collection=Panthère de Cartier', image: '/cartier/necklace/PANTHÈRE DE CARTIER.jpg' },
      // Earrings
      { category: 'EARRINGS', label: 'LOVE', href: '/shop?brand=Cartier&category=Earrings&collection=Love', image: '/cartier/earings/LOVE.jpg' },
      { category: 'EARRINGS', label: 'JUSTE UN CLOU', href: '/shop?brand=Cartier&category=Earrings&collection=Juste un Clou', image: '/cartier/earings/JUSTE UN CLOU.jpg' },
      { category: 'EARRINGS', label: 'TRINITY', href: '/shop?brand=Cartier&category=Earrings&collection=Trinity', image: '/cartier/earings/TRINITY.jpg' },
      { category: 'EARRINGS', label: 'PANTHÈRE DE CARTIER', href: '/shop?brand=Cartier&category=Earrings&collection=Panthère de Cartier', image: '/cartier/earings/PANTHÈRE DE CARTIER.jpg' },
      { category: 'EARRINGS', label: 'CLASH DE CARTIER', href: '/shop?brand=Cartier&category=Earrings&collection=Clash de Cartier', image: '/cartier/earings/CLASH DE CARTIER.jpg' },
      { category: 'EARRINGS', label: 'GRAIN DE CAFÉ', href: '/shop?brand=Cartier&category=Earrings&collection=Grain de Café', image: '/cartier/earings/GRAIN DE CAFÉ.jpg' },
    ]
  }
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandMenuOpen, setBrandMenuOpen] = useState<string | null>(null);
  const [mobileBrandOpen, setMobileBrandOpen] = useState<string | null>(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
  const [activeSubMenuTab, setActiveSubMenuTab] = useState('ALL COLLECTIONS');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setBrandMenuOpen(label);
    const brandData = MEGA_MENU_DATA[label];
    if (brandData && brandData.categories.length > 0) {
      setActiveSubMenuTab(brandData.categories[0]);
    } else {
      setActiveSubMenuTab('ALL COLLECTIONS');
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setBrandMenuOpen(null);
    }, 100); // 100ms delay to allow moving to dropdown
  };

  const navs = [
    {
      label: 'Bulgari',
      href: '/shop?brand=Bulgari',
    },
    {
      label: 'Cartier',
      href: '/shop?brand=Cartier',
    },
    {
      label: 'Messika',
      href: '/shop?brand=Messika',
      submenu: [
        { label: 'BRACELETS', href: '/shop?brand=Messika&collection=Move', image: '/messika/MOVE.jpg' },
        { label: 'RINGS', href: '/shop?brand=Messika&collection=My Twin', image: '/messika/MY TWIN.jpg' },
        { label: 'NECKLACES', href: '/shop?brand=Messika&collection=Gatsby', image: '/messika/GATSBY.jpg' },
        { label: 'EARRINGS', href: '/shop?brand=Messika&collection=Joy', image: '/messika/JOY.jpg' },
      ]
    },
    {
      label: 'Van Cleef',
      href: '/shop?brand=Van+Cleef',
      submenu: [
        { label: 'BRACELETS', href: '/shop?brand=Van+Cleef&collection=Alhambra', image: '/vancleef/ALHAMBRA.png' },
        { label: 'RINGS', href: '/shop?brand=Van+Cleef&collection=Perlée', image: '/vancleef/PERLÉE.jpg' },
        { label: 'NECKLACES', href: '/shop?brand=Van+Cleef&collection=Frivole', image: '/vancleef/FRIVOLE.jpg' },
        { label: 'EARRINGS', href: '/shop?brand=Van+Cleef&collection=Socrate', image: '/vancleef/SOCRATE.jpg' },
      ]
    },
    {
      label: 'Others',
      href: '/shop?brand=Other',
      submenu: [
        { label: 'Boucheron - Quatre', href: '/shop?brand=Boucheron&collection=Quatre', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
        { label: 'Chaumet - Joséphine', href: '/shop?brand=Chaumet&collection=Joséphine', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
        { label: 'Chopard - Happy Diamonds', href: '/shop?brand=Chopard&collection=Happy Diamonds', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop' },
      ]
    },
    { label: 'Customised Name Pendant', href: '/shop?brand=Customised' },
  ];

  const utilityLinks = [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Closable Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-stone-50 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex-1 text-center">
              <p className="text-xs text-stone-700 leading-relaxed">
                <span className="font-semibold">QUALITY ASSURANCE:</span> All products <span className="font-bold text-[#C00000]">18 karat gold and diamond</span> •
                In Dubai: <span className="font-bold text-[#C00000]">COD available</span> - Check, examine, and purchase with confidence
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="ml-4 text-stone-400 hover:text-stone-600 transition-colors"
              aria-label="Close disclaimer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Header Layout */}
      <div className="hidden md:block">


        {/* Row 2: Central Logo */}
        <div className="flex justify-center py-6 relative">
          <Link to="/" className="flex items-center relative">
            <span className="text-4xl font-cinzel font-bold text-stone-900 tracking-wider">HAY.LUXURY</span>
            {/* Animated Penguin */}
            <img
              src="/assets/penguin-joypixels-ezgif.com-webp-to-gif-converter.gif"
              alt="Penguin Mascot"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10"
              style={{ animation: 'penguinTravelAcross 8s ease-in-out infinite' }}
            />
          </Link>
        </div>

        {/* Row 3: Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 relative">
          <div className="flex justify-center items-center">
            <div className="flex space-x-8">
              {navs.map((nav) => (
                <div
                  key={nav.label}
                  className="relative"
                  onMouseEnter={() => (nav.submenu || MEGA_MENU_DATA[nav.label]) && handleMouseEnter(nav.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={nav.href}
                    className={`text-[15px] font-medium tracking-[0.2em] uppercase text-black hover:text-[#C00000] transition-colors duration-200 pb-1 relative inline-block ${brandMenuOpen === nav.label ? 'text-[#C00000]' : ''}`}
                  >
                    {nav.label}
                    {/* Animated Red Underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#C00000] transition-all duration-300 ${brandMenuOpen === nav.label || nav.label === 'hover' ? 'w-full' : 'w-0'}`}
                      style={{
                        width: brandMenuOpen === nav.label ? '100%' : '0%',
                        transition: 'width 0.3s ease-in-out'
                      }}
                    />
                  </Link>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center border-b border-stone-300 pb-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="focus:outline-none text-xs w-32"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="ml-2">
                    <X className="h-3 w-3 text-stone-400" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setIsSearchOpen(true)} className="text-stone-600 hover:text-stone-900">
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dropdown Menu - Positioned relative to navigation container */}
          {brandMenuOpen && (navs.find(n => n.label === brandMenuOpen)?.submenu || MEGA_MENU_DATA[brandMenuOpen]) && (
            <div
              className="fixed left-0 right-0 z-50 bg-white shadow-lg border-t border-stone-200"
              style={{ top: showDisclaimer ? '172px' : '128px' }}
              onMouseEnter={() => {
                if (closeTimeoutRef.current) {
                  clearTimeout(closeTimeoutRef.current);
                  closeTimeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto">
                <div className="pt-8">
                  {/* Tabbed Navigation (Bvlgari / Cartier specific) */}
                  {MEGA_MENU_DATA[brandMenuOpen as string] ? (
                    <>
                      {/* Tabs Bar */}
                      <div className="flex justify-center border-b border-stone-100 mb-10 overflow-x-auto no-scrollbar">
                        <div className="flex space-x-10 px-4">
                          {MEGA_MENU_DATA[brandMenuOpen as string].categories.map((cat) => (
                            <button
                              key={cat}
                              onMouseEnter={() => setActiveSubMenuTab(cat)}
                              className={`pb-4 text-[15px] font-medium tracking-[0.2em] uppercase transition-all relative ${activeSubMenuTab === cat ? 'text-black' : 'text-stone-400 hover:text-stone-600'
                                }`}
                              style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                              {cat}
                              {activeSubMenuTab === cat && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C00000]"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Collection Cards Reveal */}
                      <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar">
                        {(activeSubMenuTab === 'ALL COLLECTIONS'
                          ? MEGA_MENU_DATA[brandMenuOpen as string].collections.slice(0, 6)
                          : MEGA_MENU_DATA[brandMenuOpen as string].collections.filter(c => c.category === activeSubMenuTab)
                        ).map((item, idx) => (
                          <Link
                            key={`${item.label}-${idx}`}
                            to={item.href}
                            onClick={() => setBrandMenuOpen(null)}
                            className="group/item flex-shrink-0 w-[180px]"
                          >
                            <div className="aspect-square bg-stone-50 mb-4 overflow-hidden relative">
                              <img
                                src={item.image}
                                alt={item.label}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/5 transition-colors duration-300"></div>
                            </div>
                            <h3 className="text-[15px] font-medium uppercase tracking-[0.2em] text-center text-black group-hover/item:text-stone-600 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {item.label}
                            </h3>
                          </Link>
                        ))}
                      </div>

                      <div className="text-center mt-12 pb-4">
                        <Link
                          to={navs.find(n => n.label === brandMenuOpen)?.href || '#'}
                          onClick={() => setBrandMenuOpen(null)}
                          className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-500 hover:text-black underline underline-offset-8 transition-colors"
                        >
                          View all
                        </Link>
                      </div>
                    </>
                  ) : (
                    /* Standard Submenu for other brands (Messika, Van Cleef) */
                    <>
                      <div className="flex gap-8 justify-center py-8">
                        {navs.find(n => n.label === brandMenuOpen)?.submenu?.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setBrandMenuOpen(null)}
                            className="group/item flex-shrink-0 w-[160px]"
                          >
                            <div className="aspect-square bg-stone-50 mb-4 overflow-hidden border border-stone-100">
                              <div className="w-full h-full flex items-center justify-center bg-white group-hover/item:bg-stone-50 transition-all">
                                {item.image ? (
                                  <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-5xl text-stone-200">💎</span>
                                )}
                              </div>
                            </div>
                            <h3 className="text-[15px] font-medium uppercase tracking-[0.2em] text-center text-black group-hover/item:text-stone-600 transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {item.label}
                            </h3>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header Layout */}
      <div className="md:hidden">
        <div className="flex justify-between items-center h-16 px-4 border-b border-stone-100">
          {/* Left: Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-800 hover:text-stone-600 focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="relative inline-block">
              <span className="text-2xl font-cinzel font-bold text-stone-900">HAY.LUXURY</span>
              {/* Animated Penguin */}
              <img
                src="/assets/penguin-joypixels-ezgif.com-webp-to-gif-converter.gif"
                alt="Penguin Mascot"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7"
                style={{ animation: 'penguinTravelAcross 8s ease-in-out infinite' }}
              />
            </Link>
          </div>

          {/* Right: Search */}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-stone-800">
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-3 pr-10 py-2 text-sm border border-stone-200 rounded-none focus:outline-none focus:border-stone-400"
                autoFocus
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3 text-stone-500">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer (Luxury Sidebar) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-left duration-300">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-5 border-b border-stone-100 bg-white min-h-[64px]">
            {mobileBrandOpen ? (
              <button onClick={() => {
                if (mobileCategoryOpen) {
                  setMobileCategoryOpen(null);
                } else {
                  setMobileBrandOpen(null);
                }
              }} className="text-black hover:text-[#C00000] transition-colors flex items-center gap-2 text-[15px] font-medium tracking-[0.2em]">
                <ChevronLeft className="h-5 w-5" />
                {mobileCategoryOpen ? mobileCategoryOpen : 'BACK'}
              </button>
            ) : (
              <button onClick={() => setIsOpen(false)} className="text-stone-800 hover:text-gold-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            )}

            {!mobileCategoryOpen && (
              <span className="text-xl font-cinzel font-bold text-stone-900 tracking-wider absolute left-1/2 transform -translate-x-1/2">
                {mobileBrandOpen ? mobileBrandOpen.toUpperCase() : 'HAY.LUXURY'}
              </span>
            )}
            <div className="w-10"></div>
          </div>

          {/* Scrollable Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col">
              {!mobileBrandOpen ? (
                /* Level 1: Main Brand List */
                navs.map((nav) => (
                  <button
                    key={nav.label}
                    onClick={() => {
                      if (MEGA_MENU_DATA[nav.label] || nav.submenu) {
                        setMobileBrandOpen(nav.label);
                      } else {
                        navigate(nav.href);
                        setIsOpen(false);
                      }
                    }}
                    className="flex justify-between items-center w-full px-6 py-5 border-b border-stone-50 text-[14px] font-medium tracking-[0.2em] uppercase text-black hover:bg-stone-50 transition-all group"
                  >
                    <span>{nav.label}</span>
                    {(MEGA_MENU_DATA[nav.label] || nav.submenu) && <ChevronRight className="h-4 w-4 text-stone-300" />}
                  </button>
                ))
              ) : !mobileCategoryOpen ? (
                /* Level 2: Categories for selected Brand */
                <div className="p-4">
                  {MEGA_MENU_DATA[mobileBrandOpen] ? (
                    <div className="space-y-1">
                      {MEGA_MENU_DATA[mobileBrandOpen].categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setMobileCategoryOpen(cat)}
                          className="flex justify-between items-center w-full px-4 py-4 text-[14px] font-medium tracking-[0.2em] uppercase text-black border-b border-stone-50"
                        >
                          <span>{cat}</span>
                          <ChevronRight className="h-4 w-4 text-stone-300" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Submenu fallback (Messika, Van Cleef) */
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {navs.find(n => n.label === mobileBrandOpen)?.submenu?.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex flex-col items-center"
                        >
                          <div className="aspect-square w-full bg-stone-50 mb-3 overflow-hidden border border-stone-100 p-2">
                            <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[14px] font-medium uppercase tracking-[0.2em] text-center text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Level 3: Grid of Collections */
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                    {MEGA_MENU_DATA[mobileBrandOpen]?.collections
                      .filter(item => item.category === mobileCategoryOpen)
                      .map((item, idx) => (
                        <Link
                          key={`${item.label}-${idx}`}
                          to={item.href}
                          onClick={() => { setIsOpen(false); setMobileBrandOpen(null); setMobileCategoryOpen(null); }}
                          className="flex flex-col group"
                        >
                          <div className="aspect-square bg-stone-50 mb-4 overflow-hidden relative">
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-[14px] font-medium uppercase tracking-[0.2em] text-center text-black leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {item.label}
                          </h3>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;