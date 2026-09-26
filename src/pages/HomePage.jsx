import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryPills } from '../components/home/CategoryPills';
import { DealOfTheDay } from '../components/home/DealOfTheDay';
import { BrandSlider } from '../components/home/BrandSlider';
import { FeaturesBanner } from '../components/home/FeaturesBanner';
import { ProductCard } from '../components/common/ProductCard';
import { Sparkles, ArrowRight, Zap, TrendingUp } from 'lucide-react';

export const HomePage = () => {
  const { products, t, lang } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.category === activeTab).slice(0, 8);

  const hitProducts = products.filter(p => p.isHit).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. Quick Category Icons */}
      <CategoryPills />

      {/* 3. Deal of the day (Flash sale with countdown) */}
      <DealOfTheDay />

      {/* 4. Popular Products Section with category tabs */}
      <section className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {t('popularProducts')}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', labelUz: "Barchasi", labelRu: "Все", labelEn: "All" },
              { id: 'smartphones', labelUz: "Smartfonlar", labelRu: "Смартфоны", labelEn: "Smartphones" },
              { id: 'laptops', labelUz: "Noutbuklar", labelRu: "Ноутбуки", labelEn: "Laptops" },
              { id: 'appliances', labelUz: "Maishiy texnika", labelRu: "Бытовая техника", labelEn: "Appliances" },
              { id: 'gadgets', labelUz: "Gadjetlar", labelRu: "Гаджеты", labelEn: "Gadgets" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white dark:bg-amber-400 dark:text-black shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {lang === 'ru' ? tab.labelRu : lang === 'en' ? tab.labelEn : tab.labelUz}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All link */}
        <div className="text-center mt-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm transition-colors"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </section>

      {/* 5. Promotional Promo Banner (Texnomart Nasiya 0-0-24) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 p-6 sm:p-10 text-black shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black rounded-lg">
              0-0-24 MUDDATLI TO'LOV
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight">
              {lang === 'uz' ? "Texnomart Nasiya: Istalgan texnikani oling!" : "Техномарт Рассрочка: Забирайте любую технику!"}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-black/80 max-w-md">
              {lang === 'uz'
                ? "Boshlang'ich to'lov 0%, ortiqcha hujjatlarsiz, pasportingiz bilan 5 daqiqada rasmiylashtiring."
                : "0% первый взнос, без справок и поручителей, оформление за 5 минут по паспорту."}
            </p>
            <div className="pt-2">
              <Link
                to="/catalog"
                className="px-6 py-3 bg-black text-white hover:bg-gray-900 rounded-xl font-bold text-xs sm:text-sm inline-block shadow-md transition-all active:scale-95"
              >
                {t('viewAll')} &rarr;
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 gap-3 text-center w-full max-w-sm">
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl">
                <span className="block text-2xl sm:text-3xl font-black">0%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'uz' ? "Boshlang'ich to'lov" : "Первый взнос"}</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl">
                <span className="block text-2xl sm:text-3xl font-black">0%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'uz' ? "Ustama foiz" : "Переплата"}</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl">
                <span className="block text-2xl sm:text-3xl font-black">24 oy</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'uz' ? "Muddat" : "Срок"}</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl">
                <span className="block text-2xl sm:text-3xl font-black">5 daqiqa</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">{lang === 'uz' ? "Tasdiqlash" : "Одобрение"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Hit Sales Carousel */}
      <section className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {t('hitDeals')}
            </h2>
          </div>
          <Link to="/catalog?hit=true" className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline">
            {t('viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {hitProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Brands */}
      <BrandSlider />

      {/* 8. Benefits & Features */}
      <FeaturesBanner />
    </div>
  );
};
