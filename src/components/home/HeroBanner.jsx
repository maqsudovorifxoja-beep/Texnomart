import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatPrice, calculateMonthly } from '../../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Flame
} from 'lucide-react';

const slides = [
  {
    id: 1,
    titleUz: "iPhone 16 Pro Max",
    subtitleUz: "0% Boshlang'ich to'lov bilan 24 oyga muddatli to'lov!",
    titleRu: "iPhone 16 Pro Max",
    subtitleRu: "Рассрочка на 24 месяца без первого взноса!",
    titleEn: "iPhone 16 Pro Max",
    subtitleEn: "0% Down payment with 24 months installment plan!",
    badge: "YILNING ENG KUCHLI SMARTFONI",
    link: "/product/1",
    bgGradient: "from-amber-400 via-amber-500 to-yellow-500 text-black",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    monthly: "729 000"
  },
  {
    id: 2,
    titleUz: "Samsung Galaxy S24 Ultra",
    subtitleUz: "Galaxy AI sun'iy intellekti va 200MP aql bovar qilmas kamera",
    titleRu: "Samsung Galaxy S24 Ultra",
    subtitleRu: "Искусственный интеллект Galaxy AI и камера 200МП",
    titleEn: "Samsung Galaxy S24 Ultra",
    subtitleEn: "Galaxy AI experience with 200MP flagship camera",
    badge: "GALAXY AI FLIP",
    link: "/product/2",
    bgGradient: "from-zinc-950 via-slate-900 to-neutral-900 text-white",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    monthly: "662 000"
  },
  {
    id: 3,
    titleUz: "MacBook Air 13\" M3",
    subtitleUz: "18 soatgacha batareya quvvati va Liquid Retina displey",
    titleRu: "MacBook Air 13\" M3",
    subtitleRu: "До 18 часов работы без подзарядки на чипе M3",
    titleEn: "MacBook Air 13\" M3",
    subtitleEn: "Up to 18 hours battery life on Apple M3 chip",
    badge: "PROFESSIONAL",
    link: "/product/3",
    bgGradient: "from-blue-600 via-indigo-600 to-slate-900 text-white",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    monthly: "583 000"
  }
];

export const HeroBanner = () => {
  const { lang, t, products, banners } = useApp();
  const [current, setCurrent] = useState(0);

  // Active slides from dynamic banners state or fallback
  const activeBanners = (banners && banners.length > 0) ? banners.filter(b => b.active) : [];
  const currentSlides = activeBanners.length > 0 ? activeBanners : slides;

  // Countdown timer for Flash Deal side card
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 28, seconds: 45 });

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

  useEffect(() => {
    if (currentSlides.length === 0) return;
    const slideTimer = setInterval(() => {
      setCurrent(prev => (prev + 1) % currentSlides.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, [currentSlides.length]);

  const safeIndex = currentSlides.length > 0 ? current % currentSlides.length : 0;
  const slide = currentSlides[safeIndex] || slides[0];
  const title = lang === 'ru' ? (slide.titleRu || slide.titleUz) : lang === 'en' ? (slide.titleEn || slide.titleUz) : slide.titleUz;
  const subtitle = lang === 'ru' ? (slide.subtitleRu || slide.subtitleUz) : lang === 'en' ? (slide.subtitleEn || slide.subtitleUz) : slide.subtitleUz;

  // Find flash deal product (Dyson or deal of day)
  const flashProduct = products.find(p => p.id === 15) || products[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4">
      
      {/* ================= 1. MAIN LARGE HERO CAROUSEL (8 Cols) ================= */}
      <div className="lg:col-span-8 relative overflow-hidden rounded-3xl shadow-lg min-h-[380px] sm:min-h-[440px] flex flex-col justify-center">
        
        {/* Slide Content */}
        <div className={`relative h-full p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-700`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 z-10">
            
            {/* Text & CTAs */}
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                {slide.badge}
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {title}
              </h2>

              <p className="text-xs sm:text-sm font-medium opacity-90 line-clamp-2 max-w-sm">
                {subtitle}
              </p>

              {/* Installment Badge Callout */}
              <div className="inline-block py-1 px-3 rounded-xl bg-black/10 backdrop-blur-md text-xs font-extrabold">
                ⚡️ Oyiga {slide.monthly} so'mdan / 24 oy
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to={slide.link}
                  className="px-6 py-3 bg-black text-white hover:bg-gray-900 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                >
                  <span>Batafsil</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <Link
                  to="/catalog"
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-bold text-xs sm:text-sm transition-colors"
                >
                  Katalog
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative flex justify-center items-center h-48 sm:h-64 lg:h-72">
              <img
                src={slide.image}
                alt={title}
                className="max-h-full object-contain rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrent(prev => (prev - 1 + currentSlides.length) % currentSlides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/80 backdrop-blur-md transition-all text-black dark:text-white"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={() => setCurrent(prev => (prev + 1) % currentSlides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/40 hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/80 backdrop-blur-md transition-all text-black dark:text-white"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {currentSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-7 bg-black dark:bg-white' : 'w-2 bg-black/30 dark:bg-white/30'
              }`}
            />
          ))}
        </div>

      </div>

      {/* ================= 2. RIGHT SIDE PROMO CARDS (4 Cols) ================= */}
      <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
        
        {/* Card A: Kunning taklifi with live countdown */}
        {flashProduct && (
          <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent border border-rose-200 dark:border-rose-900/40 relative overflow-hidden flex flex-col justify-between shadow-xs">
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white uppercase">
                <Flame className="w-3 h-3 fill-current" />
                KUNNING TAKLIFI
              </span>

              {/* Countdown timer */}
              <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-gray-700 dark:text-gray-300">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span className="px-1.5 py-0.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                :
                <span className="px-1.5 py-0.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                :
                <span className="px-1.5 py-0.5 bg-black text-white dark:bg-amber-400 dark:text-black rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 my-2">
              <img
                src={flashProduct.image}
                alt="Flash deal"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl bg-white dark:bg-[#1a1a1a] p-2 shadow-xs"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                  {flashProduct.brand}
                </span>
                <Link
                  to={`/product/${flashProduct.id}`}
                  className="block text-xs font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-amber-500"
                >
                  {typeof flashProduct.title === 'object' ? flashProduct.title.uz : flashProduct.title}
                </Link>
                <div className="pt-1">
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400 block">
                    {formatPrice(flashProduct.price, lang)}
                  </span>
                  {flashProduct.oldPrice && (
                    <span className="text-[11px] line-through text-gray-400 font-semibold">
                      {formatPrice(flashProduct.oldPrice, lang)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              to={`/product/${flashProduct.id}`}
              className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl text-center shadow-xs transition-colors"
            >
              Hoziroq xarid qilish &rarr;
            </Link>

          </div>
        )}

        {/* Card B: Texnomart Nasiya 0-0-24 */}
        <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-400 text-black shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-black text-white">
              0% MUDDATLI TO'LOV
            </span>
            <CreditCard className="w-5 h-5 text-black" />
          </div>

          <div>
            <h4 className="font-black text-base sm:text-lg leading-tight">
              Boshlang'ich to'lovsiz 24 oyga xarid qiling!
            </h4>
            <p className="text-[11px] text-black/80 mt-1 font-medium">
              Pasport bilan 5 daqiqada tasdiqlanadi. 0% ortiqcha to'lov.
            </p>
          </div>

          <Link
            to="/catalog"
            className="w-full py-2 bg-black hover:bg-gray-900 text-white font-black text-xs rounded-xl text-center shadow-xs transition-all active:scale-95"
          >
            Mahsulotlarni ko'rish &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
};
