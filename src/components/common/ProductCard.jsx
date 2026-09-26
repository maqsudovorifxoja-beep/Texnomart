import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Check, BarChart2, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice, calculateMonthly } from '../../utils/formatters';

export const ProductCard = ({ product }) => {
  const { 
    lang, 
    t, 
    addToCart, 
    cart, 
    toggleFavorite, 
    isFavorite,
    toggleCompare,
    isCompared,
    openQuickBuy
  } = useApp();

  const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
  const isInCart = cart.some(item => item.id === product.id);
  const isFav = isFavorite(product.id);
  const isComp = isCompared(product.id);
  const monthly = calculateMonthly(product.price, 24);

  // Discount percentage
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-[#18181b] rounded-3xl border border-gray-100 dark:border-gray-800/80 p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-amber-400 dark:hover:border-amber-500/60 hover:-translate-y-1">
      
      {/* Top Floating Badges & Action Buttons */}
      <div className="flex items-start justify-between gap-1 mb-2 z-10">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black bg-rose-500 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isHit && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-400 text-black shadow-xs">
              XIT SAVDO
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
              YANGILIK
            </span>
          )}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            0-0-24
          </span>
        </div>

        {/* Favorite & Compare Action Icons */}
        <div className="flex items-center gap-1">
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            aria-label="Compare product"
            title="Taqqoslash"
            className={`p-1.5 rounded-xl transition-all ${
              isComp
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 shadow-xs'
                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart2 className={`w-4 h-4 transition-transform ${isComp ? 'scale-110' : ''}`} />
          </button>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label="Add to favorites"
            title="Sevimlilar"
            className={`p-1.5 rounded-xl transition-all ${
              isFav
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 shadow-xs'
                : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isFav ? 'fill-rose-500 scale-110' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative w-full h-44 sm:h-48 mb-3 overflow-hidden rounded-2xl bg-gray-50/60 dark:bg-[#121214] flex items-center justify-center p-3"
      >
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80";
          }}
        />
      </Link>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 hover:text-amber-500 dark:hover:text-amber-400 transition-colors leading-snug mb-2.5 min-h-[34px]"
            title={title}
          >
            {title}
          </Link>
        </div>

        <div>
          {/* Signature Texnomart Installment Pill */}
          <div className="mb-2.5">
            <div className="w-full py-1.5 px-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 text-[11px] sm:text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{formatPrice(monthly, lang)}</span>
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">x 24 oy</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="block text-[11px] sm:text-xs line-through text-gray-400 font-medium">
                {formatPrice(product.oldPrice, lang)}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight">
              {formatPrice(product.price, lang)}
            </span>
          </div>

          {/* Dual Action Buttons: Big Yellow Cart + Quick 1-Click Buy */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className={`py-2 px-2 rounded-xl font-extrabold text-xs transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 ${
                isInCart
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-primary hover:bg-primary-hover text-black shadow-amber-500/20'
              }`}
              title={isInCart ? t('inCart') : t('addToCart')}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{t('inCart')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('addToCart')}</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickBuy(product);
              }}
              className="py-2 px-2 rounded-xl font-bold text-xs bg-gray-100 dark:bg-gray-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-gray-800 dark:text-gray-200 transition-all flex items-center justify-center gap-1 active:scale-95"
              title="1 bosishda tezkor xarid qilish"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>1 bosishda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
