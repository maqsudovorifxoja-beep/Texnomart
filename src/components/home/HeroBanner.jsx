import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const slides = [
  {
    id: 1,
    titleUz: "iPhone 16 Pro Max",
    subtitleUz: "0% Boshlang'ich to'lov bilan 24 oyga muddatli to'lov!",
    titleRu: "iPhone 16 Pro Max",
    subtitleRu: "Рассрочка на 24 месяца без первого взноса!",
    titleEn: "iPhone 16 Pro Max",
    subtitleEn: "0% Down payment with 24 months installment plan!",
    badge: "SUPER HIT 2026",
    link: "/product/1",
    bgGradient: "from-amber-400 via-amber-500 to-yellow-500",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    titleUz: "Samsung Galaxy S24 Ultra",
    subtitleUz: "Galaxy AI imkoniyatlari va maxsus sovg'a bilan xarid qiling",
    titleRu: "Samsung Galaxy S24 Ultra",
    subtitleRu: "Возможности Galaxy AI и специальный подарок при покупке",
    titleEn: "Samsung Galaxy S24 Ultra",
    subtitleEn: "Galaxy AI experience with exclusive bundle gift",
    badge: "GALAXY AI",
    link: "/product/2",
    bgGradient: "from-slate-900 via-gray-900 to-zinc-900 text-white",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    titleUz: "Dyson Airwrap Complete",
    subtitleUz: "Sochlarni haddan tashqari issiqliksiz ajoyib turmaklang",
    titleRu: "Dyson Airwrap Complete",
    subtitleRu: "Идеальная укладка без экстремального перегрева",
    titleEn: "Dyson Airwrap Complete",
    subtitleEn: "Style without extreme heat damage",
    badge: "PREMIUM",
    link: "/product/15",
    bgGradient: "from-rose-500 via-purple-600 to-indigo-700 text-white",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
  }
];

export const HeroBanner = () => {
  const { lang, t } = useApp();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  const title = lang === 'ru' ? slide.titleRu : lang === 'en' ? slide.titleEn : slide.titleUz;
  const subtitle = lang === 'ru' ? slide.subtitleRu : lang === 'en' ? slide.subtitleEn : slide.subtitleUz;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl mt-4">
      {/* Background slide */}
      <div className={`relative min-h-[340px] sm:min-h-[420px] p-6 sm:p-12 flex flex-col justify-center bg-gradient-to-r ${slide.bgGradient} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          
          {/* Text Content */}
          <div className="space-y-4 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-black dark:text-white">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {slide.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {title}
            </h1>

            <p className="text-sm sm:text-lg font-medium opacity-90 max-w-md">
              {subtitle}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to={slide.link}
                className="px-6 py-3.5 bg-black text-white hover:bg-gray-900 rounded-2xl font-bold text-sm sm:text-base transition-transform active:scale-95 shadow-lg inline-block"
              >
                {t('buyNow')} &rarr;
              </Link>
              <Link
                to="/catalog"
                className="px-5 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-semibold text-sm sm:text-base transition-colors inline-block"
              >
                {t('viewAll')}
              </Link>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative flex justify-center items-center h-56 sm:h-72 lg:h-80">
            <img
              src={slide.image}
              alt={title}
              className="max-h-full object-contain rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/40 hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/80 backdrop-blur-md transition-all text-black dark:text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={() => setCurrent(prev => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/40 hover:bg-white/80 dark:bg-black/40 dark:hover:bg-black/80 backdrop-blur-md transition-all text-black dark:text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              current === idx ? 'w-8 bg-black dark:bg-white' : 'w-2.5 bg-black/30 dark:bg-white/30'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
