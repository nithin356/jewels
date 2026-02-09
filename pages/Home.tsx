import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const categories = [
      { name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop' },
      { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
      { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
      { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
      { name: 'Charms & Dangles', image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=600&auto=format&fit=crop' }
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Search Result: Theme v2.1 - Sexy Upgrade */}
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full bg-stone-50 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1588444968576-f8fe92ce56fd?q=80&w=1170&auto=format&fit=crop" 
            alt="Luxury Jewelry" 
            className="w-full h-full object-cover animate-scale-slow"
          />
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          <ScrollReveal>
            <span className="text-gold-400 tracking-[0.4em] uppercase text-sm md:text-base mb-6 font-bold block">Welcome to Hay.Luxury</span>
            <h1 className="text-6xl md:text-8xl font-serif text-stone-900 mb-8 font-bold leading-tight mix-blend-multiply">
              Redefining <span className="italic text-gold-600">Elegance</span>
            </h1>
            <p className="text-stone-700 max-w-2xl text-lg md:text-xl mb-12 leading-relaxed font-light mx-auto">
              Discover our curated collection of exquisite handcrafted jewelry, designed to make every moment unforgettable.
            </p>
            <Link 
              to="/shop" 
              className="group inline-flex items-center px-10 py-4 bg-gold-400 text-white font-bold tracking-widest uppercase hover:bg-gold-500 transition-all duration-300 shadow-lg hover:shadow-gold-200/50 hover:-translate-y-1 rounded-sm"
            >
                Explore Collection <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Luxury Marquee */}
      <div className="bg-stone-900 py-4 overflow-hidden whitespace-nowrap border-y border-red-900/30">
        <div className="inline-block animate-marquee">
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Timeless Elegance</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Handcrafted Perfection</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Authentic Luxury</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Hay.Luxury Exclusive</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Timeless Elegance</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Handcrafted Perfection</span> •
            <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Authentic Luxury</span> •
             <span className="text-white text-sm tracking-[0.3em] uppercase mx-8 font-bold">Hay.Luxury Exclusive</span> •
        </div>
      </div>

      {/* Categories Section (Reference Design) */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-light text-stone-900 mb-6">Popular Categories</h2>
                <div className="h-[1px] w-24 bg-stone-300 mx-auto"></div>
            </ScrollReveal>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                {categories.map((cat, idx) => (
                    <ScrollReveal key={cat.name} className="flex flex-col items-center group cursor-pointer w-[140px] md:w-[180px]">
                         <Link to="/shop" className="block text-center w-full">
                            <div className="aspect-square rounded-full overflow-hidden mb-6 bg-stone-50 border border-stone-100 flex items-center justify-center transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-xl group-hover:border-stone-200">
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-stone-800 group-hover:text-[#C00000] transition-colors duration-300 relative inline-block">
                                {cat.name}
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#C00000] transition-all duration-300 group-hover:w-full"></span>
                            </h3>
                         </Link>
                    </ScrollReveal>
                ))}
            </div>
          </div>
      </section>

      {/* Features Section (Glassmorphism) */}
      <section className="py-24 relative bg-stone-100 overflow-hidden" id="about">
         {/* Abstract Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">The Hay.Luxury Promise</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Experience the epitome of luxury with our commitment to excellence, authenticity, and service.</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Uncompromised Quality", desc: "Meticulously sourced gemstones and precious metals, crafted to perfection." },
              { icon: Shield, title: "Lifetime Authenticity", desc: "Every piece comes with a lifetime guarantee of authenticity and heritage." },
              { icon: Truck, title: "White Glove Delivery", desc: "Secure, insured, and personalized delivery service to your doorstep." }
            ].map((feature, idx) => (
               <ScrollReveal key={idx} className="delay-100">
                  <div className="group p-10 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl shadow-[0_10px_40px_rgba(220,38,38,0.2)] hover:shadow-[0_20px_60px_rgba(220,38,38,0.3)] hover:bg-white/80 transition-all duration-500 text-center hover:-translate-y-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold-50 to-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="h-8 w-8 text-[#C00000]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-stone-900">{feature.title}</h3>
                    <p className="text-stone-600 leading-relaxed font-light">{feature.desc}</p>
                  </div>
               </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
           <ScrollReveal className="w-full md:w-1/2">
             <div className="relative">
                 <div className="absolute inset-0 bg-gold-600 transform translate-x-4 translate-y-4 rounded-lg"></div>
                 <img 
                  src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?q=80&w=1200&auto=format&fit=crop" 
                  alt="Jewelry Making" 
                  className="rounded-lg shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                 />
             </div>
           </ScrollReveal>
           <ScrollReveal className="w-full md:w-1/2 delay-200">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">Our Craft,<br/><span className="text-gold-400 italic">Your Legacy</span></h2>
             <p className="text-stone-400 text-lg leading-relaxed mb-8 font-light">
               At <span className="text-white font-medium">Hay.Luxury</span>, we don't just sell jewelry; we curate heirlooms. Born in the heart of the Emirates, our pieces are a testament to a rich heritage of craftsmanship merged with avant-garde design.
             </p>
             <p className="text-stone-400 text-lg leading-relaxed mb-10 font-light">
               From the initial sketch to the final master polish, every step is a labor of love, passion, and uncompromising precision.
             </p>
             <Link to="/shop" className="inline-block text-white border-b border-gold-400 pb-1 hover:text-gold-400 transition-all uppercase tracking-widest text-sm font-bold">
               Discover Our Story
             </Link>
           </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
export default Home;