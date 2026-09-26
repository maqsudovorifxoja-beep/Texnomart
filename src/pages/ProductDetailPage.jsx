import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateMonthly } from '../utils/formatters';
import { ProductCard } from '../components/common/ProductCard';
import {
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Zap,
  CheckCircle2,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, lang, t, addToCart, cart, toggleFavorite, isFavorite, showToast } = useApp();

  const product = products.find(p => p.id === Number(id));

  // Installment month selector: 3, 6, 12, 24 months
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mahsulot topilmadi</h2>
        <Link to="/catalog" className="mt-4 inline-block px-6 py-2.5 bg-primary text-black font-bold rounded-xl">
          {t('viewAll')}
        </Link>
      </div>
    );
  }

  const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
  const isFav = isFavorite(product.id);
  const isInCart = cart.some(item => item.id === product.id);
  const monthlyPayment = calculateMonthly(product.price, selectedMonths);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Related products from the same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(lang === 'uz' ? "Havola nusxalandi!" : "Ссылка скопирована!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Product Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* ================= 1. GALLERY (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-center shadow-sm">
            <img
              src={images[selectedImage] || product.image}
              alt={title}
              className="max-h-full max-w-full object-contain transition-all duration-300"
            />
            {product.isDealOfTheDay && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full">
                AKSIYA
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-white dark:bg-[#1a1a1a] flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-amber-500 shadow-md' : 'border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= 2. PRODUCT INFO & BUY (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            {/* Brand, Rating, Code, Share */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} {t('reviewsCount')})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                {formatPrice(product.price, lang)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-base sm:text-lg line-through text-gray-400 font-semibold">
                  {formatPrice(product.oldPrice, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('inStock')} — {t('fastDelivery')}</span>
            </div>
          </div>

          {/* Installment Calculator Widget */}
          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                {t('installmentOptions')} (0% ustama)
              </span>
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                {formatPrice(monthlyPayment, lang)} / {t('fromMonth')}
              </span>
            </div>

            {/* Months Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonths(m)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedMonths === m
                      ? 'bg-amber-400 text-black shadow-sm ring-2 ring-amber-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {m} {t('months')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-primary hover:bg-primary-hover text-black shadow-amber-500/20'
              }`}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              <span>{isInCart ? t('inCart') : t('addToCart')}</span>
            </button>

            <Link
              to="/cart"
              onClick={() => {
                if (!isInCart) addToCart(product, 1);
              }}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-black text-white hover:bg-gray-900 font-bold text-sm sm:text-base text-center transition-all whitespace-nowrap"
            >
              {t('buyNow')}
            </Link>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-center border-t border-gray-100 dark:border-gray-800">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a]">
              <Truck className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">{t('fastDelivery')}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a]">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
              <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">{t('warranty')}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a]">
              <RotateCcw className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">{t('returnPolicy')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3. SPECIFICATIONS & DESCRIPTION TABS ================= */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full" />
          {t('characteristics')}
        </h2>

        {/* Specs Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-[#141414] text-xs sm:text-sm border border-gray-100 dark:border-gray-800/60"
            >
              <span className="text-gray-500 dark:text-gray-400 font-medium">{key}</span>
              <span className="text-gray-900 dark:text-white font-semibold text-right">{val}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{t('description')}</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* ================= 4. RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full" />
            {t('recommended')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
