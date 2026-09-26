import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { Flame, Clock, Sparkles, Zap, Tag, Gift, Percent, ArrowRight } from 'lucide-react';

export const DealsPage = () => {
  const { products, lang, t } = useApp();
  const [selectedTag, setSelectedTag] = useState('all');

  // Filter deal products
  const dealProducts = products.filter(p => p.oldPrice && p.oldPrice > p.price);
  const hotDeals = products.filter(p => p.isDealOfTheDay || p.isHit);

  const filterDeals = () => {
    if (selectedTag === 'all') return dealProducts;
    if (selectedTag === 'day') return products.filter(p => p.isDealOfTheDay);
    if (selectedTag === 'hit') return products.filter(p => p.isHit);
    if (selectedTag === 'smartphones') return dealProducts.filter(p => p.category === 'smartphones');
    if (selectedTag === 'laptops') return dealProducts.filter(p => p.category === 'laptops');
    return dealProducts;
  };

  const displayedDeals = filterDeals();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 antialiased">
      
      {/* 1. Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 p-8 sm:p-12 text-black shadow-xl shadow-amber-500/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-amber-400 text-xs font-black uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Katta Bahorgi Chegirmalar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            70% GACHA CHEGIRMALAR VA 0-0-24 MUDDATLI TO'LOV
          </h1>

          <p className="text-sm sm:text-base font-semibold opacity-90 max-w-xl">
            Texnomart do'konlarida eng ommabop smartfonlar, noutbuklar va maishiy texnika vositalariga maxsus aksiya narxlari!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-2xl text-xs font-black">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Aksiya tugashiga: <b>04 kun 12:45:10</b></span>
            </div>
            <Link
              to="/catalog?deals=true"
              className="px-6 py-2.5 rounded-2xl bg-black hover:bg-neutral-900 text-white font-black text-xs transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <span>Katalogda ko'rish</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Ambient graphics */}
        <div className="absolute right-4 bottom-4 sm:right-12 sm:bottom-6 opacity-20 sm:opacity-30 pointer-events-none select-none">
          <Percent className="w-64 h-64 stroke-[3]" />
        </div>
      </div>

      {/* 2. Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: 'Barcha aksiyalar', icon: Tag },
          { id: 'day', label: 'Kunning taklifi', icon: Flame },
          { id: 'hit', label: 'Xit savdolar', icon: Zap },
          { id: 'smartphones', label: 'Smartfonlar', icon: Sparkles },
          { id: 'laptops', label: 'Noutbuklar', icon: Gift },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTag === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 scale-105'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-amber-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-400 rounded-full" />
            Aksiya tovarlari ({displayedDeals.length} ta)
          </h2>
          <span className="text-xs font-bold text-gray-400">
            Chegirmalar har kuni yangilanadi
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayedDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};
export default DealsPage;
