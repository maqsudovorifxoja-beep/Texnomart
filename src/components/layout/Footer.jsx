import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PhoneCall, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const { t, lang } = useApp();

  return (
    <footer className="bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 transition-colors mt-16">
      {/* Top Banner inside Footer */}
      <div className="bg-amber-500 text-black py-4 px-4 font-semibold text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">24/7</span>
            <span>{lang === 'uz' ? "Savollaringiz bormi? Bizning mutaxassislarimiz doimo yordamga tayyor!" : "Есть вопросы? Наши специалисты всегда готовы помочь!"}</span>
          </div>
          <a
            href="tel:+998712099944"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-xl text-xs font-bold transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            +998 (71) 209-99-44
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-lg text-black">
              T
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              texnomart<span className="text-amber-500">*</span>
            </span>
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-sm">
            {t('footerDesc')}
          </p>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>100% Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <Link to="/stores" className="hover:underline">{t('ourStores')}</Link>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            {t('company')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/stores" className="hover:text-amber-500 transition-colors">{t('ourStores')}</Link></li>
            <li><Link to="/catalog" className="hover:text-amber-500 transition-colors">{t('allCategories')}</Link></li>
            <li><Link to="/admin" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">{t('adminPanel')}</Link></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">{t('aboutUs')}</a></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">{t('career')}</a></li>
          </ul>
        </div>

        {/* For Buyers */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            {t('buyers')}
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/catalog" className="hover:text-amber-500 transition-colors">{t('buyInInstallment')} 0%</Link></li>
            <li><Link to="/cart" className="hover:text-amber-500 transition-colors">{t('cart')}</Link></li>
            <li><Link to="/favorites" className="hover:text-amber-500 transition-colors">{t('favorites')}</Link></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">{t('deliveryPayment')}</a></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">{t('returnPolicy')}</a></li>
          </ul>
        </div>

        {/* Payment Systems & Mobile Apps */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
            {t('paymentMethods')}
          </h4>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200">
              Payme
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200">
              Click
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200">
              Uzum Pay
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-800 dark:text-gray-200">
              Nasiya 0%
            </span>
          </div>

          <p className="text-[11px] text-gray-400">
            {lang === 'uz' ? "Xaridlar uchun qulay va xavfsiz to'lov tizimlari." : "Удобные и безопасные платежные системы."}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800/80 py-6 text-xs text-center text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Texnomart Clone. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-2">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for seamless shopping experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
