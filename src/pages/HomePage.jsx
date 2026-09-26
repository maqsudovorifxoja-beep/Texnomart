import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryPills } from '../components/home/CategoryPills';
import { DealOfTheDay } from '../components/home/DealOfTheDay';
import { BrandSlider } from '../components/home/BrandSlider';
import { FeaturesBanner } from '../components/home/FeaturesBanner';
import { ProductCard } from '../components/common/ProductCard';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const HomePage = () => {
  const { products, t, lang } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  // Filter products by active tab
  const filteredProducts = activeTab === 'all'
    ? products.slice(0, 10)
    : products.filter(p => p.category === activeTab).slice(0, 10);

  // Hit products
  const hitProducts = products.filter(p => p.isHit).slice(0, 5);

  // New arrivals
  const newProducts = products.filter(p => p.isNew).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* 1. Hero Multi-Banner Section */}
      <HeroBanner />

      {/* 2. Category Shortcuts */}
      <CategoryPills />

      {/* 3. Deal of the Day (Countdown Flash Sale) */}
      <DealOfTheDay />

      {/* 4. Popular Products Section with Category Selector Tabs */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('popularProducts')}
            </h2>
          </div>

          {/* Category Filter Tabs */}
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
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
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

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-gray-900 dark:text-white font-extrabold text-xs sm:text-sm transition-all"
          >
            <span>{t('viewAll')} ({products.length} ta mahsulot)</span>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </section>

      {/* 5. Texnomart Nasiya 0-0-24 Promotional Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 p-6 sm:p-10 text-black shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black rounded-lg">
              TEXNOMART NASIYA
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight">
              {lang === 'uz' ? "0% Boshlang'ich to'lov, 0% Ustama bilan 24 oyga!" : "Рассрочка 0-0-24 без переплат и взносов!"}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-black/80 max-w-md leading-relaxed">
              {lang === 'uz'
                ? "Hech qanday ma'lumotnoma va kafillarsiz, pasportingiz bilan 5 daqiqada onlayn rasmiylashtiring."
                : "Оформление онлайн за 5 минут по паспорту, без справок и поручителей."}
            </p>
            <div className="pt-2">
              <Link
                to="/catalog"
                className="px-6 py-3.5 bg-black text-white hover:bg-gray-900 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <span>Shartlarni ko'rish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 gap-3 text-center w-full max-w-sm">
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl border border-white/40">
                <span className="block text-3xl font-black">0%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Boshlang'ich to'lov</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl border border-white/40">
                <span className="block text-3xl font-black">0%</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Ustama foiz</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl border border-white/40">
                <span className="block text-3xl font-black">24 oy</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Maksimal muddat</span>
              </div>
              <div className="p-4 bg-white/30 backdrop-blur rounded-2xl border border-white/40">
                <span className="block text-3xl font-black">5 daqiqa</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Tezkor tasdiqlash</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Hit Sales Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('hitDeals')}
            </h2>
          </div>
          <Link
            to="/catalog?hit=true"
            className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {hitProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. New Arrivals Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('newArrivals')}
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Mobile App Download Promo Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gray-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-400 flex items-center justify-center font-black text-4xl text-black shadow-lg shadow-amber-500/30 flex-shrink-0">
            T
          </div>
          <div className="space-y-1">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Smartfoningizda yanada qulay
            </span>
            <h4 className="text-xl sm:text-2xl font-black">
              Texnomart mobil ilovasini yuklab oling
            </h4>
            <p className="text-xs text-gray-400 max-w-md">
              Eksklyuziv chegirmalar, tezkor buyurtma va keshbeklar faqat mobil ilovamizda!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl flex items-center gap-2 border border-white/20">
            <QrCode className="w-10 h-10 text-amber-400" />
            <span className="text-[11px] font-bold text-gray-300">Kamerani qarating<br />va yuklang</span>
          </div>

          <div className="flex flex-col gap-2">
            <a href="#" className="px-4 py-2 bg-white text-black font-extrabold rounded-xl text-xs hover:bg-gray-100 transition-colors">
              App Store
            </a>
            <a href="#" className="px-4 py-2 bg-white/20 text-white font-extrabold rounded-xl text-xs hover:bg-white/30 transition-colors">
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* 9. Brand Slider */}
      <BrandSlider />

      {/* 10. Benefits & Guarantees */}
      <FeaturesBanner />

    </div>
  );
};
