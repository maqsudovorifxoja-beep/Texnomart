import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { User, Phone, ShoppingBag, ShieldCheck, LogOut, ArrowRight } from 'lucide-react';

export const ProfilePage = () => {
  const { user, orders, logout, t, lang } = useApp();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Iltimos, avval tizimga kiring</h2>
        <Link to="/login" className="inline-block px-6 py-3 bg-primary text-black font-extrabold rounded-xl">
          {t('login')}
        </Link>
      </div>
    );
  }

  // Find user's orders or show general orders
  const userOrders = orders;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center font-black text-2xl text-black shadow-md shadow-amber-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {user.name}
              </h1>
              {user.role === 'admin' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-black">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-mono">
              {user.phone || user.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('adminPanel')}</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Orders History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <span>{lang === 'uz' ? "Mening buyurtmalarim" : "Мои заказы"}</span>
        </h2>

        {userOrders.length > 0 ? (
          <div className="space-y-3">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                      #{ord.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {ord.status === 'completed' ? t('statusCompleted') : t('statusProcessing')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{ord.date} • {ord.items.length} ta mahsulot</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {ord.address} ({ord.paymentMethod.toUpperCase()})
                  </p>
                </div>

                <div className="text-right">
                  <span className="block text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                    {formatPrice(ord.totalAmount, lang)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-gray-400 text-xs">
            Hozircha buyurtmalar mavjud emas.
          </div>
        )}
      </div>

    </div>
  );
};
