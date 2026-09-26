import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Users, Award, Truck, HeartHandshake, MapPin, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const stats = [
    { value: "16+", label: "Yillik ishonchli tajriba" },
    { value: "50+", label: "O'zbekiston bo'ylab filiallar" },
    { value: "1M+", label: "Mamnun mijozlarimiz" },
    { value: "100%", label: "Rasmiy servis kafolati" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "100% Asl va Sifatli Texnika",
      desc: "Texnomart faqat jahonning yetakchi brendlarining sertifikatlangan original mahsulotlarini rasmiy kafolat bilan taqdim etadi."
    },
    {
      icon: HeartHandshake,
      title: "0% Ustamasiz Muddatli To'lov",
      desc: "Ortiqcha bosh og'riqsiz, boshlang'ich to'lovsiz va eng muhimi — foizlarsiz muddatli to'lov xizmatini yo'lga qo'yganmiz."
    },
    {
      icon: Truck,
      title: "Tezkor Yetkazib Berish",
      desc: "Toshkent shahri va viloyat markazlariga 1 kunda bepul yetkazib berish xizmati mavjud."
    },
    {
      icon: Award,
      title: "O'zbekistonda №1 Maishiy Texnika",
      desc: "Yillar davomida xalqimiz mehrini qozonib, sifat va qulaylik ramziga aylangan eng yirik riteylerlardan biri."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 antialiased">
      
      {/* 1. Header Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase">
          <Building2 className="w-3.5 h-3.5" />
          <span>Kompaniyamiz Haqida</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          Texnomart — Har Bir Xonadonda Qulaylik va Innovatsiya
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          2008-yildan buyon biz O'zbekiston bo'ylab millionlab insonlar hayotini zamonaviy, sifatli va qulay texnikalar bilan yengillashtirib kelmoqdamiz.
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-center space-y-2 shadow-xs">
            <span className="text-3xl sm:text-5xl font-black text-amber-500 tracking-tight block">
              {s.value}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Core Values */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Nega Aynan Texnomart?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Bizning bosh maqsadimiz — xaridorlarimizga eng qulay va ishonchli xarid tajribasini berishdir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CTA to Stores */}
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-black">Bizning Do'konlarimizga Tashrif Buyuring</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md">
            O'zingizga eng yaqin Texnomart do'konini xaritadan toping va tovarlarni bevosita sinab ko'ring.
          </p>
        </div>
        <Link
          to="/stores"
          className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-transform active:scale-95 flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 stroke-[2.5]" />
          <span>Do'konlar xaritasi</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
export default AboutPage;
