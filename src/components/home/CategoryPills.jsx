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
  Wind
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
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full" />
          {t('allCategories')}
        </h2>
        <Link
          to="/catalog"
          className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          {t('viewAll')} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/catalog?category=${cat.slug}`}
            className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-lg transition-all duration-200 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800/80 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/30 transition-all">
              {iconMap[cat.icon]}
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 line-clamp-1">
              {t(cat.nameKey)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
