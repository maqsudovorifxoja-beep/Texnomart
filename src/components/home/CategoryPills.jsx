import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/categories';
import {
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  Microwave,
  Watch,
  Sparkles,
  Wind,
  ChevronRight
} from 'lucide-react';

const iconMap = {
  Smartphone: <Smartphone className="w-6 h-6 text-amber-500" />,
  Laptop: <Laptop className="w-6 h-6 text-blue-500" />,
  Tv: <Tv className="w-6 h-6 text-purple-500" />,
  Refrigerator: <Refrigerator className="w-6 h-6 text-emerald-500" />,
  Microwave: <Microwave className="w-6 h-6 text-orange-500" />,
  Watch: <Watch className="w-6 h-6 text-pink-500" />,
  Sparkles: <Sparkles className="w-6 h-6 text-rose-500" />,
  Wind: <Wind className="w-6 h-6 text-cyan-500" />,
};

export const CategoryPills = () => {
  const { t } = useApp();

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-primary rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Ommabop kategoriyalar
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

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/catalog?category=${cat.slug}`}
            className="group flex flex-col items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#f8f8f8] dark:bg-gray-800/80 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition-all duration-300 shadow-inner">
              {iconMap[cat.icon]}
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 line-clamp-1">
                {t(cat.nameKey)}
              </h3>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                {cat.count} ta mahsulot
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
