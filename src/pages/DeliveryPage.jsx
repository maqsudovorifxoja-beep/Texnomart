import React from 'react';
import { Truck, CreditCard, ShieldCheck, Clock, CheckCircle2, MapPin, PhoneCall, HelpCircle } from 'lucide-react';

export const DeliveryPage = () => {
  const deliveryOptions = [
    {
      title: "Toshkent shahri bo'ylab Express Yetkazish",
      badge: "1 KUN (TEZ VA BEPUL)",
      price: "0 so'm (Bepul)",
      time: "24 soat ichida eshikkacha",
      desc: "Soat 17:00 gacha buyurtma berilgan barcha tovarlar Toshkent shahri ichida o'sha kunning o'zidayoq yoki ertasi kuni eshigingizgacha yetkazib beriladi."
    },
    {
      title: "O'zbekistonning barcha viloyatlariga",
      badge: "IShonchli va xavfsiz",
      price: "Standart tarif bo'yicha",
      time: "2 — 3 ish kuni",
      desc: "Samarqand, Buxoro, Andijon, Farg'ona, Namangan, Xorazm, Qashqadaryo, Surxondaryo, Navoiy, Jizzax, Sirdaryo va Qoraqalpog'iston Respublikasining barcha tumanlariga xavfsiz yetkaziladi."
    },
    {
      title: "Texnomart do'konlaridan olib ketish",
      badge: "Eng tezkor (Samovyvoz)",
      price: "Mutlaqo bepul",
      time: "15 daqiqada tayyor",
      desc: "O'zingizga yaqin Texnomart filialini tanlang, buyurtma qiling va atigi 15 daqiqadan so'ng navbatsiz qabul qilib oling."
    }
  ];

  const paymentMethods = [
    { name: "Payme", desc: "Ilova orqali bir lahzada to'lash" },
    { name: "Click Up", desc: "QR kod yoki Click ilovasi orqali" },
    { name: "Uzum Pay", desc: "Uzum ilovasi va keshbeklar bilan" },
    { name: "Naqd pul yoki Karta", desc: "Tovar yetkazilganda kurerga to'lash" },
    { name: "0% Muddatli to'lov", desc: "Boshlang'ich to'lovsiz 24 oygacha" },
    { name: "Bank o'tkazmasi", desc: "Yuridik shaxslar uchun shartnoma asosida" },
  ];

  const faqs = [
    {
      q: "Yetkazib berish narxi qancha?",
      a: "Toshkent shahri bo'ylab 500 000 so'mdan yuqori barcha buyurtmalar mutlaqo bepul yetkazib beriladi."
    },
    {
      q: "Tovarni qabul qilayotganda tekshirib ko'rsam bo'ladimi?",
      a: "Albatta! Kurer huzurida qutini ochib, tovar butunligi va ishlashini to'liq tekshirish huquqiga egasiz."
    },
    {
      q: "Tovarni qaytarish yoki almashtirish shartlari qanday?",
      a: "Agar tovar zavod nuqsoniga ega bo'lsa yoki sizga mos kelmasa, 14 kun ichida rasmiy chek bilan qaytarishingiz yoki almashtirishingiz mumkin."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 antialiased">
      
      {/* 1. Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase">
          <Truck className="w-3.5 h-3.5" />
          <span>Xizmat Shartlari</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Yetkazib Berish va To'lov Shartlari
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          Biz sizning xaridingiz imkon qadar tez, xavfsiz va qulay yetib borishini ta'minlaymiz.
        </p>
      </div>

      {/* 2. Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deliveryOptions.map((opt, idx) => (
          <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                {opt.badge}
              </span>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                {opt.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {opt.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1.5 text-xs font-bold">
              <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                <span>Narxi:</span>
                <span className="text-emerald-500 font-black">{opt.price}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Muddat:</span>
                <span>{opt.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Payment Methods */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Qulay To'lov Usullari
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Siz xohlagan usulda — naqd, karta yoki muddatli to'lov orqali xarid qiling.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {paymentMethods.map((p, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-center space-y-1 shadow-xs">
              <CreditCard className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <h4 className="font-black text-xs sm:text-sm text-gray-900 dark:text-white">{p.name}</h4>
              <p className="text-[10px] text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FAQ Accordion-like cards */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">
          Ko'p Beriladigan Savollar (FAQ)
        </h2>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-2 shadow-xs">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{f.q}</span>
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default DeliveryPage;
