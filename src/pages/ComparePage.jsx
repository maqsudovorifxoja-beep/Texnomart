import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateMonthly } from '../utils/formatters';
import { 
  BarChart2, 
  Trash2, 
  ShoppingCart, 
  Zap, 
  Star, 
  Check, 
  X, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ComparePage = () => {
  const { 
    compareList, 
    toggleCompare, 
    clearCompare, 
    products, 
    addToCart, 
    cart, 
    openQuickBuy, 
    lang, 
    t 
  } = useApp();

  const comparedProducts = products.filter(p => compareList.includes(p.id));

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/40 text-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <BarChart2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {lang === 'uz' ? "Taqqoslash ro'yxati bo'sh" : "Список сравнения пуст"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            {lang === 'uz'
              ? "Mahsulot kartasidagi taqqoslash belgisini bosib, texnik xususiyatlarni yonma-yon solishtirishingiz mumkin."
              : "Нажмите иконку сравнения на карточке товара, чтобы сравнить характеристики side-by-side."}
          </p>
        </div>

        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <span>{t('catalog')}ga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary text-black rounded-2xl shadow-xs">
            <BarChart2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {lang === 'uz' ? "Mahsulotlarni taqqoslash" : "Сравнение товаров"}
            </h1>
            <p className="text-xs text-gray-500">
              {comparedProducts.length} {t('productCount')} ({lang === 'uz' ? "maksimal 4 tagacha" : "до 4 товаров"})
            </p>
          </div>
        </div>

        <button
          onClick={clearCompare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{lang === 'uz' ? "Barchasini tozalash" : "Очистить список"}</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[700px] grid grid-cols-5 gap-4">
          
          {/* Column 1: Feature Labels */}
          <div className="space-y-6 pt-52 text-xs font-bold text-gray-500 dark:text-gray-400">
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Narxi</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Muddatli to'lov (24 oy)</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Brend</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Reyting</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Mavjudligi</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Kafolat</div>
            <div className="h-10 flex items-center border-b border-gray-100 dark:border-gray-800">Yetkazib berish</div>
          </div>

          {/* Columns 2-5: Products */}
          {comparedProducts.map(product => {
            const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
            const isInCart = cart.some(item => item.id === product.id);
            const monthly = calculateMonthly(product.price, 24);

            return (
              <div 
                key={product.id} 
                className="bg-white dark:bg-[#1a1a1c] rounded-3xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col justify-between shadow-xs relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => toggleCompare(product.id)}
                  aria-label="Remove from compare"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-rose-100 hover:text-rose-500 text-gray-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Top Image & Title */}
                <div className="space-y-3">
                  <div className="h-36 flex items-center justify-center p-2 rounded-2xl bg-gray-50 dark:bg-[#121214]">
                    <img
                      src={product.image}
                      alt={title}
                      className="max-h-full object-contain"
                    />
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="block text-xs font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-amber-500 min-h-[32px]"
                  >
                    {title}
                  </Link>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                        isInCart
                          ? 'bg-emerald-500 text-white'
                          : 'bg-primary hover:bg-primary-hover text-black'
                      }`}
                    >
                      {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                      <span>{isInCart ? "Savatda" : "Savatga"}</span>
                    </button>

                    <button
                      onClick={() => openQuickBuy(product)}
                      className="py-2 px-2 rounded-xl text-[11px] font-bold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3 fill-current text-amber-400" />
                      <span>1 bosishda</span>
                    </button>
                  </div>
                </div>

                {/* Specs Values */}
                <div className="space-y-6 pt-6 text-xs text-gray-800 dark:text-gray-200">
                  <div className="h-10 flex items-center font-black text-amber-600 dark:text-amber-400 border-b border-gray-100 dark:border-gray-800">
                    {formatPrice(product.price, lang)}
                  </div>
                  <div className="h-10 flex items-center font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
                    {formatPrice(monthly, lang)} / oy
                  </div>
                  <div className="h-10 flex items-center font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    {product.brand}
                  </div>
                  <div className="h-10 flex items-center gap-1 font-bold border-b border-gray-100 dark:border-gray-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                  </div>
                  <div className="h-10 flex items-center font-bold border-b border-gray-100 dark:border-gray-800">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Omborda bor</span>
                    </span>
                  </div>
                  <div className="h-10 flex items-center font-medium border-b border-gray-100 dark:border-gray-800">
                    <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>1 yil rasmiy kafolat</span>
                    </span>
                  </div>
                  <div className="h-10 flex items-center font-medium border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                    Ertaga bepul yetkazish
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
};
