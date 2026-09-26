import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';

export const FeaturesBanner = () => {
  const { lang } = useApp();

  const features = [
    {
      icon: <CreditCard className="w-6 h-6 text-amber-500" />,
      titleUz: "0% Muddatli to'lov",
      descUz: "Boshlang'ich to'lovsiz 24 oygacha qulay to'lov",
      titleRu: "Рассрочка 0%",
      descRu: "Без первого взноса до 24 месяцев",
      titleEn: "0% Installment",
      descEn: "No down payment up to 24 months"
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" />,
      titleUz: "Bepul yetkazib berish",
      descUz: "O'zbekiston bo'ylab tez va bepul yetkazish",
      titleRu: "Бесплатная доставка",
      descRu: "Быстрая и бесплатная доставка по Узбекистану",
      titleEn: "Free Delivery",
      descEn: "Fast & free delivery across Uzbekistan"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      titleUz: "Rasmiy kafolat",
      descUz: "Barcha tovarlar 100% original va kafolatlangan",
      titleRu: "Официальная гарантия",
      descRu: "100% оригинальная продукция с гарантией",
      titleEn: "Official Warranty",
      descEn: "100% genuine products with warranty"
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-rose-500" />,
      titleUz: "14 kun qaytarish",
      descUz: "Tovarni hech qanday qiyinchiliksiz qaytarish",
      titleRu: "Возврат 14 дней",
      descRu: "Легкий и быстрый возврат товара",
      titleEn: "14 Days Return",
      descEn: "Hassle-free return policy within 14 days"
    }
  ];

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item, idx) => {
          const title = lang === 'ru' ? item.titleRu : lang === 'en' ? item.titleEn : item.titleUz;
          const desc = lang === 'ru' ? item.descRu : lang === 'en' ? item.descEn : item.descUz;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                  {title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
