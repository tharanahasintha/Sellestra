import React from 'react';
import { ArrowDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-16 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="container mx-auto px-6">
          <div className="text-[0.85rem] tracking-[3px] text-primary uppercase mb-8 font-medium">
            NEW SEASON &middot; 2026 COLLECTION
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">
            Discover <i className="text-primary not-italic italic">Refined</i><br />Essentials
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Curated products with a focus on quality, design, and the everyday experience of living well.
          </p>
          <div className="flex gap-6 justify-center">
            <NavLink to="/products" className="px-8 py-3 rounded-xl border border-slate-300 text-slate-800 font-medium hover:border-primary hover:text-primary transition bg-white/50 backdrop-blur-sm">
              Explore Collection
            </NavLink>
            <NavLink to="/register" className="px-8 py-3 rounded-xl border border-slate-300 text-slate-800 font-medium hover:border-primary hover:text-primary transition bg-white/50 backdrop-blur-sm">
              Join Sellestra
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 relative items-center">
            
            <div className="bg-white border border-primary-light rounded-xl p-12 text-center hover:-translate-y-1 hover:shadow-lg transition hover:border-primary">
              <div className="text-5xl text-primary font-serif mb-2">12K+</div>
              <div className="text-xs tracking-[2px] uppercase text-slate-500 font-medium">PRODUCTS</div>
            </div>
            
            <div className="bg-white border border-primary-light rounded-xl p-12 text-center hover:-translate-y-1 hover:shadow-lg transition hover:border-primary">
              <div className="text-5xl text-primary font-serif mb-2">98%</div>
              <div className="text-xs tracking-[2px] uppercase text-slate-500 font-medium">SATISFACTION</div>
            </div>

            {/* Down Arrow separator spans both columns */}
            <div className="col-span-2 flex justify-center py-4">
              <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 shadow-sm hover:text-primary hover:border-primary transition cursor-default">
                <ArrowDown size={20} />
              </button>
            </div>

            <div className="bg-white border border-primary-light rounded-xl p-12 text-center hover:-translate-y-1 hover:shadow-lg transition hover:border-primary">
              <div className="text-5xl text-primary font-serif mb-2">48hr</div>
              <div className="text-xs tracking-[2px] uppercase text-slate-500 font-medium">DELIVERY</div>
            </div>
            
            <div className="bg-white border border-primary-light rounded-xl p-12 text-center hover:-translate-y-1 hover:shadow-lg transition hover:border-primary">
              <div className="text-5xl text-primary font-serif mb-2">24/7</div>
              <div className="text-xs tracking-[2px] uppercase text-slate-500 font-medium">SUPPORT</div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
