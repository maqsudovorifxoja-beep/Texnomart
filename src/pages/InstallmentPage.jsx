import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateMonthly } from '../utils/formatters';
import { Zap, ShieldCheck, CheckCircle2, FileText, Smartphone, ArrowRight, Calculator } from 'lucide-react';

export const InstallmentPage = () => {
  const { lang, t } = useApp();
  const [calcPrice, setCalcPrice] = useState(12000000);
  const [calcMonths, setCalcMonths] = useState(12);

  const monthly = calculateMonthly(calcPrice, calcMonths);

  const steps = [
    {
      num: "01",
      title: "Tovarni tanlang",
      desc: "Katalogdan o'zingiz yoqtirgan smartfon, noutbuk yoki maishiy texnikani tanlang."
    },
    {
      num: "02",
      title: "Pasport yoki ID-kartangizni kiriting",
      desc: "Hech qanday ish joyidan ma'lumotnoma yoki kafillarsiz, faqat pasport kifoya."
    },
    {
      num: "03",
      title: "2 daqiqada tasdiqlash",
      desc: "Bank skoring tizimi orqali 2 daqiqa ichida arizangiz avtomatik tasdiqlanadi."
    },
    {
      num: "04",
      title: "Tovarni olib keting",
      desc: "Boshlang'ich to'lovsiz, darhol tovarni qabul qiling va to'lovni keyingi oydan boshlang!"
    }
  ];

  const partners = [
    { name: "Anorbank", desc: "0% ortiqcha to'lovsiz, 24 oygacha" },
    { name: "Alif Nasiya", desc: "Shariat talablariga mos halol nasiya" },
    { name: "Uzum Nasiya", desc: "Uzum ilovasi orqali 1 daqiqada" },
    { name: "Paymart", desc: "Eng tezkor skoring va qulay grafik" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 antialiased">
      
      {/* 1. Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-8 sm:p-14 text-black shadow-xl shadow-amber-400/10">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-amber-300 text-xs font-black uppercase tracking-wider">
            <Zap className="w-4 h-4 fill-amber-300" />
            <span>0% Ustamasiz Xarid</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            0-0-24 MUDDATLI TO'LOV: BOSHLANG'ICH TO'LOVSIZ VA ORTIQCHA FOIZSIZ
          </h1>

          <p className="text-sm sm:text-base font-semibold opacity-90 max-w-lg">
            Orzuingizdagi texnikani bugunoq oling, to'lovini esa 24 oygacha teng qismlarga bo'lib, oylik byudjetingizga mos tarzda to'lang!
          </p>

          <div className="pt-2">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-2xl bg-black hover:bg-neutral-900 text-white font-black text-xs transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <span>Katalogdagi tovarlarni ko'rish</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Interactive Calculator */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Calculator className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Oylik To'lovni Hisoblash Kalkulyatori
            </h2>
            <p className="text-xs text-gray-400">
              Tovar narxini va muddatini tanlab, oylik to'lovni ko'ring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">
                <span>Tovar narxi (so'm):</span>
                <span className="text-base font-black text-gray-900 dark:text-white">{formatPrice(calcPrice, lang)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="40000000"
                step="500000"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                <span>1 000 000 so'm</span>
                <span>40 000 000 so'm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-2">
                Muddatni tanlang:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 12, 24].map((m) => (
                  <button
                    key={m}
                    onClick={() => setCalcMonths(m)}
                    className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                      calcMonths === m
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 scale-105 ring-2 ring-amber-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {m} oy
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculator Result Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 text-center space-y-4">
            <span className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 tracking-wider block">
              Sizning taxminiy oylik to'lovingiz:
            </span>
            <div className="text-3xl sm:text-5xl font-black text-amber-950 dark:text-amber-200 tracking-tight">
              {formatPrice(monthly, lang)}
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400"> / oy</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Boshlang'ich to'lov: 0 so'm</span>
            </div>
            <p className="text-[11px] text-gray-500">
              * Yakuniy to'lov miqdori tanlangan mahsulot va bank hamkoringizga ko'ra shartnomada belgilanadi.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white text-center">
          Qanday Rasmiylashtiriladi?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((st, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-3 shadow-xs">
              <span className="text-2xl font-black text-amber-500 font-mono block">
                {st.num}
              </span>
              <h4 className="font-black text-base text-gray-900 dark:text-white">{st.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Partner Banks */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center">
          Bizning Ishonchli Hamkorlarimiz
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((p, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-center space-y-1 shadow-xs">
              <ShieldCheck className="w-6 h-6 mx-auto text-amber-500 mb-1" />
              <h4 className="font-black text-sm text-gray-900 dark:text-white">{p.name}</h4>
              <p className="text-xs text-gray-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default InstallmentPage;
