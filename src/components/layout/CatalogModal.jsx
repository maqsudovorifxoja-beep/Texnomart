import React from 'react';
import { Link } from 'react-router-dom';
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
  Flame
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

  if (!isCatalogOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity flex justify-center pt-20 px-4 pb-6">
      <div 
        className="relative bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-5xl w-full shadow-2xl border border-gray-100 dark:border-gray-800 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-primary rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {t('allCategories')}
            </h2>
          </div>
          <button
            onClick={() => setIsCatalogOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              onClick={() => setIsCatalogOpen(false)}
              className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500/50 bg-gray-50/50 dark:bg-gray-900/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform">
                  {iconMap[cat.icon] || <Smartphone className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 text-sm md:text-base">
                    {t(cat.nameKey)}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {cat.count} {t('productCount')}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Quick Promo Banner in Catalog */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
              <Flame className="w-6 h-6 text-black fill-current animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-base md:text-lg">
                {lang === 'uz' ? "Texnomart da 0-0-12 muddatli to'lov aksiyasi!" : "Рассрочка 0-0-12 в Texnomart без переплат!"}
              </p>
              <p className="text-xs md:text-sm text-black/80">
                {lang === 'uz' ? "Boshlang'ich to'lovsiz va 0% ustama bilan xarid qiling" : "Без первоначального взноса и переплат"}
              </p>
            </div>
          </div>
          <Link
            to="/catalog"
            onClick={() => setIsCatalogOpen(false)}
            className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </div>
  );
};
