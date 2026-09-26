import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatPrice, calculateMonthly } from '../../utils/formatters';
import { Flame, Clock, ShoppingCart, Heart, ShieldCheck } from 'lucide-react';

export const DealOfTheDay = () => {
  const { products, lang, t, addToCart, toggleFavorite, isFavorite } = useApp();

  // Find deal of the day product or first product
  const dealProduct = products.find(p => p.isDealOfTheDay) || products[0];

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!dealProduct) return null;

  const title = typeof dealProduct.title === 'object' ? (dealProduct.title[lang] || dealProduct.title.uz) : dealProduct.title;
  const monthly = calculateMonthly(dealProduct.price, 24);
  const isFav = isFavorite(dealProduct.id);

  return (
    <section className="py-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 dark:border-amber-500/30 p-6 sm:p-8">
        
        {/* Section Title & Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 dark:border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary text-black">
              <Flame className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {t('dealOfTheDay')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lang === 'uz' ? "Eng yaxshi narxda cheklangan miqdordagi mahsulot" : "Ограниченное количество по суперцене"}
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-500" />
              {t('endsIn')}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold">
              <span className="px-2.5 py-1.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-2.5 py-1.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="px-2.5 py-1.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Showcase Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
          {/* Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-center">
              <img
                src={dealProduct.image}
                alt={title}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full shadow-md">
                -15% AKSIYA
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                {dealProduct.brand}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {t('inStock')}
              </span>
            </div>

            <Link
              to={`/product/${dealProduct.id}`}
              className="block text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-amber-500 transition-colors"
            >
              {title}
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {dealProduct.description}
            </p>

            {/* Installment Badge */}
            <div className="p-3 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/50 dark:border-amber-800/40 max-w-md">
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                {t('buyInInstallment')} 0% ustama bilan:
              </p>
              <p className="text-base font-extrabold text-amber-900 dark:text-amber-200">
                {formatPrice(monthly, lang)} / {t('fromMonth')} (24 {t('months')})
              </p>
            </div>

            {/* Price & Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div>
                {dealProduct.oldPrice && (
                  <span className="block text-xs sm:text-sm line-through text-gray-400">
                    {formatPrice(dealProduct.oldPrice, lang)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {formatPrice(dealProduct.price, lang)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => addToCart(dealProduct, 1)}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  {t('addToCart')}
                </button>

                <button
                  onClick={() => toggleFavorite(dealProduct.id)}
                  className={`p-3 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors ${
                    isFav ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-200' : 'text-gray-400 hover:text-rose-500'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
