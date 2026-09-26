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
  Sparkles,
  Building,
  Check,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    id 
  } = useParams();
  const { 
    products, 
    lang, 
    t, 
    addToCart, 
    cart, 
    toggleFavorite, 
    isFavorite, 
    showToast,
    openQuickBuy,
    toggleCompare,
    isCompared
  } = useApp();

  const product = products.find(p => p.id === Number(id));

  // Installment month selector: 3, 6, 12, 24 months
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState('256 GB');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Mahsulot topilmadi</h2>
        <Link to="/catalog" className="inline-block px-6 py-3 bg-primary text-black font-extrabold rounded-2xl">
          {t('viewAll')}
        </Link>
      </div>
    );
  }

  const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
  const isFav = isFavorite(product.id);
  const isComp = isCompared(product.id);
  const isInCart = cart.some(item => item.id === product.id);
  const monthlyPayment = calculateMonthly(product.price, selectedMonths);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Havola buferga nusxalandi!", 'success');
  };

  const colors = [
    { name: 'Natural Titanium', hex: '#8c857b' },
    { name: 'Desert Titanium', hex: '#cbb69d' },
    { name: 'Space Black', hex: '#2e2e30' },
    { name: 'White Titanium', hex: '#e3e4e5' },
  ];

  const storages = ['128 GB', '256 GB', '512 GB', '1 TB'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-amber-500 transition-colors">Bosh sahifa</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/catalog?category=${product.category}`} className="hover:text-amber-500 capitalize transition-colors">
          {t(product.category) || product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-white truncate max-w-xs">{title}</span>
      </div>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* ================= 1. GALLERY (5 Cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-square w-full bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-center shadow-sm">
            <img
              src={images[selectedImage] || product.image}
              alt={title}
              className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
            />
            {product.isDealOfTheDay && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full shadow-md">
                AKSIYA
              </span>
            )}
            {product.isHit && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-amber-400 text-black font-black text-xs rounded-full shadow-md">
                HIT SAVDO
              </span>
            )}
          </div>

          {/* Thumbnails rail */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-18 h-18 rounded-2xl border-2 p-1.5 bg-white dark:bg-[#1a1a1a] flex-shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'border-amber-500 shadow-md ring-2 ring-amber-400/20'
                      : 'border-gray-200 dark:border-gray-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= 2. PRODUCT INFO & BUY (7 Cols) ================= */}
        <div className="lg:col-span-7 space-y-6">
          
          <div>
            {/* Top Brand, Stars, Actions */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 uppercase">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-gray-900 dark:text-white font-extrabold">{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} {t('reviewsCount')})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Compare Button */}
                <button
                  onClick={() => toggleCompare(product.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isComp
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500'
                  }`}
                  title="Taqqoslash"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title="Ulashish"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isFav
                      ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-rose-500'
                  }`}
                  title="Sevimlilarga qo'shish"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>
          </div>

          {/* Color Selector Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Rang: <strong className="text-gray-900 dark:text-white">{colors[selectedColor].name}</strong>
            </span>
            <div className="flex items-center gap-2">
              {colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedColor === idx ? 'border-amber-500 scale-110 shadow-md ring-2 ring-amber-400/40' : 'border-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Storage Options */}
          {product.category === 'smartphones' && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Xotira:</span>
              <div className="flex items-center gap-2">
                {storages.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedStorage === st
                        ? 'bg-black text-white dark:bg-amber-400 dark:text-black shadow-xs'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-3 shadow-xs">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {formatPrice(product.price, lang)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-base sm:text-lg line-through text-gray-400 font-bold">
                  {formatPrice(product.oldPrice, lang)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Omborda mavjud — Bepul yetkazib berish (1 kun)</span>
            </div>
          </div>

          {/* Muddatli to'lov kalkulyatori */}
          <div className="p-5 rounded-3xl bg-[#fff8d6] dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                MUDDATLI TO'LOV (0% USTAMA)
              </span>
              <span className="text-sm font-black text-amber-900 dark:text-amber-200">
                {formatPrice(monthlyPayment, lang)} / oy
              </span>
            </div>

            {/* Months Selector Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonths(m)}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    selectedMonths === m
                      ? 'bg-amber-400 text-black shadow-md ring-2 ring-amber-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100'
                  }`}
                >
                  {m} oy
                </button>
              ))}
            </div>
          </div>

          {/* Action Buy Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              className={`w-full sm:flex-1 py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-primary hover:bg-primary-hover text-black shadow-amber-500/20'
              }`}
            >
              <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
              <span>{isInCart ? t('inCart') : t('addToCart')}</span>
            </button>

            <button
              onClick={() => openQuickBuy(product)}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-black text-sm sm:text-base text-center transition-all whitespace-nowrap active:scale-98 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-current text-amber-400" />
              <span>1 bosishda xarid</span>
            </button>
          </div>

          {/* Guarantees Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-center border-t border-gray-100 dark:border-gray-800">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a]">
              <Truck className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{t('fastDelivery')}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a]">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200">100% Rasmiy kafolat</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a]">
              <RotateCcw className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200">14 kun qaytarish</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3. SPECIFICATIONS & DESCRIPTION ================= */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-primary rounded-full" />
          Texnik xususiyatlari
        </h2>

        {/* Specs Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 px-4 rounded-2xl bg-gray-50 dark:bg-[#141414] text-xs sm:text-sm border border-gray-100 dark:border-gray-800/60"
            >
              <span className="text-gray-500 dark:text-gray-400 font-medium">{key}</span>
              <span className="text-gray-900 dark:text-white font-bold text-right">{val}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Mahsulot tavsifi</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
            {product.description}
          </p>
        </div>
      </div>

      {/* ================= 4. RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              O'xshash mahsulotlar
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
