import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export const FavoritesPage = () => {
  const { favorites, products, clearFavorites, addToCart, t, lang, showToast } = useApp();

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach(p => addToCart(p, 1));
    showToast(lang === 'uz' ? "Barcha sevimlilar savatga qo'shildi!" : "Все товары добавлены в корзину!");
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {t('emptyFavorites')}
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {lang === 'uz'
            ? "O'zingizga yoqqan mahsulotlarni keyinroq xarid qilish uchun yurakcha belgisini bosing."
            : "Нажмите на иконку сердечка, чтобы сохранить понравившиеся товары на потом."}
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>{t('viewAll')}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-3 h-8 bg-primary rounded-full" />
            {t('favorites')}
            <span className="text-base sm:text-lg font-normal text-gray-400">
              ({favoriteProducts.length} {t('productCount')})
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{lang === 'uz' ? "Barchasini savatga qo'shish" : "Добавить все в корзину"}</span>
          </button>

          <button
            onClick={clearFavorites}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearCart')}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {favoriteProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
};
