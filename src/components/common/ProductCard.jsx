import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, calculateMonthly } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { lang, t, addToCart, cart, toggleFavorite, isFavorite } = useApp();

  const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
  const isInCart = cart.some(item => item.id === product.id);
  const isFav = isFavorite(product.id);
  const monthly = calculateMonthly(product.price, 24);

  // Discount percentage if old price exists
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500/50">
      
      {/* Top Badges & Favorite Button */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.isHit && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              HIT
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label="Add to favorites"
          className={`p-2 rounded-full transition-colors ${
            isFav
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
              : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform ${isFav ? 'fill-rose-500 scale-110' : ''}`} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="block relative w-full h-44 sm:h-52 mb-3 overflow-hidden rounded-xl bg-gray-50 dark:bg-[#141414] flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-amber-500 dark:hover:text-amber-400 transition-colors leading-snug mb-2"
            title={title}
          >
            {title}
          </Link>
        </div>

        <div>
          {/* Monthly Installment Badge (Texnomart signature) */}
          <div className="mb-2.5 inline-block w-full">
            <span className="inline-block w-full py-1 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-[11px] sm:text-xs font-semibold text-amber-900 dark:text-amber-300">
              {formatPrice(monthly, lang)} / {t('fromMonth')}
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/80">
            <div>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="block text-[11px] sm:text-xs line-through text-gray-400">
                  {formatPrice(product.oldPrice, lang)}
                </span>
              )}
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className={`p-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 flex items-center justify-center ${
                isInCart
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-primary hover:bg-primary-hover text-black shadow-amber-500/20'
              }`}
              title={isInCart ? t('inCart') : t('addToCart')}
            >
              {isInCart ? (
                <Check className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <ShoppingCart className="w-5 h-5 stroke-[2]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
