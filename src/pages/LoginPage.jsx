import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, User, Lock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, t, lang } = useApp();
  const navigate = useNavigate();

  const [authType, setAuthType] = useState('phone'); // 'phone' | 'username'
  const [isRegister, setIsRegister] = useState(false);

  const [phone, setPhone] = useState('+998 ');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameToUse = fullName.trim() || (authType === 'phone' ? `Mijoz (${phone.slice(-4)})` : username);
    
    // Check if demo admin
    const isAdmin = username.toLowerCase() === 'admin' || phone.includes('712099944');

    login({
      name: nameToUse,
      phone: authType === 'phone' ? phone : '+998 90 000 00 00',
      username: username || 'user',
      role: isAdmin ? 'admin' : 'customer'
    });

    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'admin') {
      login({
        name: 'Texnomart Bosh Administrator',
        phone: '+998 71 209 99 44',
        username: 'admin',
        role: 'admin'
      });
      navigate('/admin');
    } else {
      login({
        name: 'Azizbek Rahimov',
        phone: '+998 90 123 45 67',
        username: 'azizbek',
        role: 'customer'
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-2xl text-black mx-auto shadow-md shadow-amber-500/20">
            T
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isRegister ? t('registerButton') : t('authTitle')}
          </h2>
          <p className="text-xs text-gray-400">
            {lang === 'uz' ? "Texnomart oilasiga xush kelibsiz!" : "Добро пожаловать в Texnomart!"}
          </p>
        </div>

        {/* Auth Method Switcher (Phone vs Username) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setAuthType('phone')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authType === 'phone'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t('usePhone')}</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthType('username')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authType === 'username'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs'
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('useUsername')}</span>
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full name if register */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('customerName')}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ali Valiyev"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Phone or Username */}
          {authType === 'phone' ? (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('phoneNumber')}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('username')}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin yoki username"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              {t('password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl text-sm shadow-md transition-all active:scale-98"
          >
            {isRegister ? t('registerButton') : t('login')}
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
          >
            {isRegister ? t('haveAccount') : t('noAccount')}
          </button>
        </div>

        {/* Fast Demo One-Click Accounts */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <span className="block text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {lang === 'uz' ? "Tezkor sinov uchun kirish (1-klik):" : "Быстрый вход для теста (1 клик):"}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('demoAdmin')}</span>
            </button>

            <button
              onClick={() => handleDemoLogin('customer')}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('demoClient')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
