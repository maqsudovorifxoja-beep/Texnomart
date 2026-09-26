import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/categories';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Tv, 
  Refrigerator, 
  Microwave, 
  Watch, 
  Sparkles, 
  Wind,
  ChevronRight,
  Flame,
  Tag,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Smartphone: <Smartphone className="w-5 h-5 text-amber-500" />,
  Laptop: <Laptop className="w-5 h-5 text-blue-500" />,
  Tv: <Tv className="w-5 h-5 text-purple-500" />,
  Refrigerator: <Refrigerator className="w-5 h-5 text-emerald-500" />,
  Microwave: <Microwave className="w-5 h-5 text-orange-500" />,
  Watch: <Watch className="w-5 h-5 text-pink-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-rose-500" />,
  Wind: <Wind className="w-5 h-5 text-cyan-500" />,
};

export const CatalogModal = () => {
  const { isCatalogOpen, setIsCatalogOpen, t, lang } = useApp();
  const navigate = useNavigate();
  const [selectedCatId, setSelectedCatId] = useState('smartphones');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCatalogOpen(false);
    };
    if (isCatalogOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isCatalogOpen, setIsCatalogOpen]);

  if (!isCatalogOpen) return null;

  const activeCategory = categories.find(c => c.id === selectedCatId) || categories[0];

  const handleSubItemClick = (catSlug, query) => {
    setIsCatalogOpen(false);
    navigate(`/catalog?category=${catSlug}&${query}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm transition-all flex justify-center items-start pt-16 sm:pt-20 px-2 sm:px-4 pb-6">
      <div 
        className="relative bg-white dark:bg-[#141416] rounded-3xl max-w-6xl w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-[#111113]">
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-primary rounded-full shadow-xs" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('allCategories')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lang === 'uz' ? "Texnomartning barcha texnika va jihozlar bo'limi" : "Все отделы техники и электроники Texnomart"}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCatalogOpen(false)}
            aria-label="Close catalog"
            className="p-2 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Mega Menu Body */}
        <div className="flex flex-col lg:flex-row min-h-[520px]">
          
          {/* Left Column: Categories List */}
          <div className="w-full lg:w-72 border-r border-gray-100 dark:border-gray-800/80 py-3 bg-gray-50/40 dark:bg-[#111113]/50 overflow-y-auto max-h-[540px]">
            {categories.map((cat) => {
              const isSelected = cat.id === selectedCatId;
              const catTitle = typeof cat.title === 'object' ? (cat.title[lang] || cat.title.uz) : t(cat.nameKey);

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  onMouseEnter={() => setSelectedCatId(cat.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all relative ${
                    isSelected
                      ? 'bg-amber-400/15 dark:bg-amber-400/10 text-gray-950 dark:text-amber-400 font-bold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-primary text-black shadow-xs'
                        : 'bg-white dark:bg-gray-800 shadow-xs'
                    }`}>
                      {iconMap[cat.icon] || <Smartphone className="w-4 h-4" />}
                    </div>
                    <span className="text-xs sm:text-sm truncate">
                      {catTitle}
                    </span>
                  </div>

                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isSelected ? 'text-amber-500 translate-x-1' : 'text-gray-400 opacity-60'
                  }`} />

                  {/* Active indicator bar */}
                  {isSelected && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-400 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Center & Right Column: Subcategories & Brands & Featured Banner */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[540px]">
            <div>
              {/* Category Title & View All Link */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                    {typeof activeCategory.title === 'object' ? (activeCategory.title[lang] || activeCategory.title.uz) : t(activeCategory.nameKey)}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {activeCategory.count} {t('productCount')}
                  </span>
                </div>

                <Link
                  to={`/catalog?category=${activeCategory.slug}`}
                  onClick={() => setIsCatalogOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <span>{t('viewAll')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activeCategory.subcategories?.map((sub, idx) => {
                  const subTitle = typeof sub.title === 'object' ? (sub.title[lang] || sub.title.uz) : sub.title;
                  return (
                    <div key={idx} className="space-y-2.5">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        {subTitle}
                      </h4>
                      <ul className="space-y-1.5 text-xs">
                        {sub.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <button
                              type="button"
                              onClick={() => handleSubItemClick(activeCategory.slug, item.query)}
                              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:translate-x-1 transition-transform inline-block py-0.5 text-left"
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Popular Brands in this Category */}
              {activeCategory.brands && activeCategory.brands.length > 0 && (
                <div className="mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {lang === 'uz' ? "Ommabop brendlar:" : "Популярные бренды:"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.brands.map(brand => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleSubItemClick(activeCategory.slug, `brand=${encodeURIComponent(brand)}`)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-amber-400 hover:text-black transition-all shadow-xs"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Promo Ribbon inside Mega Menu */}
            <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-black text-amber-400 rounded-xl">
                  <Flame className="w-5 h-5 fill-current animate-bounce" />
                </div>
                <div>
                  <p className="font-extrabold text-sm sm:text-base leading-tight">
                    {activeCategory.banner?.title || "0-0-24 Muddatli to'lov aksiyasi!"}
                  </p>
                  <p className="text-xs text-black/80 font-medium">
                    {activeCategory.banner?.subtitle || "Texnomartda barcha tovarlar boshlang'ich to'lovsiz"}
                  </p>
                </div>
              </div>
              <Link
                to={activeCategory.banner?.link || `/catalog?category=${activeCategory.slug}`}
                onClick={() => setIsCatalogOpen(false)}
                className="px-5 py-2.5 bg-black text-white hover:bg-gray-900 font-extrabold text-xs rounded-xl transition-all whitespace-nowrap active:scale-95"
              >
                {lang === 'uz' ? "Xarid qilish" : "Купить сейчас"} &rarr;
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
