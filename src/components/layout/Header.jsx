import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  MapPin,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  X,
  LayoutDashboard,
  LogOut,
  Flame,
  CreditCard,
  Building,
  Smartphone,
  Laptop,
  Tv,
  Refrigerator,
  BarChart2
} from 'lucide-react';
import { CityModal } from '../common/CityModal';

export const Header = () => {
  const {
    lang,
    changeLang,
    t,
    isDark,
    toggleTheme,
    cartCount,
    cartTotal,
    favorites,
    compareList,
    selectedCity,
    isCatalogOpen,
    setIsCatalogOpen,
    searchQuery,
    setSearchQuery,
    products,
    user,
    logout
  } = useApp();

  const navigate = useNavigate();
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered live search results
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p => {
        const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
               p.category.toLowerCase().includes(searchQuery.toLowerCase());
      }).slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchDropdownOpen(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingTags = ["iPhone 16", "MacBook", "Samsung S24", "Dyson", "Televizor", "Muzlatgich"];

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800 transition-colors shadow-xs">
      
      {/* 1. Top Utility Header (City, Hotlines, Stores, Language, Theme) */}
      <div className="bg-[#f7f7f7] dark:bg-[#0d0d0d] text-xs text-gray-600 dark:text-gray-400 border-b border-gray-200/70 dark:border-gray-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* City Selector */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-semibold cursor-pointer hover:text-amber-500 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Quick Links */}
            <Link to="/stores" className="hover:text-amber-500 transition-colors font-medium">
              {t('ourStores')}
            </Link>
            <Link to="/catalog?deals=true" className="hover:text-amber-500 transition-colors font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-amber-500" />
              <span>{t('buyInInstallment')} 0-0-24</span>
            </Link>
            <Link to="/admin" className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('adminPanel')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            {/* Support Phone */}
            <a href="tel:+998712099944" className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white hover:text-amber-500 transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              <span>+998 (71) 209-99-44</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-200/80 dark:bg-gray-800 rounded-lg p-0.5 font-semibold text-[11px]">
              {[
                { code: 'uz', label: "O'zb" },
                { code: 'ru', label: "Рус" },
                { code: 'en', label: "Eng" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => changeLang(item.code)}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    lang === item.code
                      ? 'bg-amber-400 text-black font-extrabold shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-2xl text-black shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white leading-none">
              texnomart<span className="text-amber-500">*</span>
            </span>
          </div>
        </Link>

        {/* Big Yellow Catalog Button */}
        <button
          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
          className="flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-black font-black text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95 flex-shrink-0"
        >
          {isCatalogOpen ? (
            <X className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Menu className="w-5 h-5 stroke-[3]" />
          )}
          <span>{t('catalog')}</span>
        </button>

        {/* Live Search Input with Dropdown & Popular Chips */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchDropdownOpen(true);
              }}
              onFocus={() => setIsSearchDropdownOpen(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-4 pr-12 py-3 rounded-2xl border-2 border-primary/40 focus:border-primary dark:border-gray-700 dark:focus:border-primary bg-gray-50/70 dark:bg-gray-900/60 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-primary hover:bg-primary-hover text-black rounded-xl transition-all flex items-center justify-center font-bold"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Search Dropdown Results */}
          {isSearchDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              {searchQuery.trim().length === 0 ? (
                <div className="p-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Ommabop qidiruvlar:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag);
                          setIsSearchDropdownOpen(false);
                          navigate(`/catalog?search=${encodeURIComponent(tag)}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-amber-100 hover:text-black transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="p-2.5 border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {lang === 'uz' ? "Topilgan mahsulotlar" : "Найденные товары"}
                  </div>
                  {searchResults.map((item) => {
                    const itemTitle = typeof item.title === 'object' ? (item.title[lang] || item.title.uz) : item.title;
                    return (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setIsSearchDropdownOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-amber-50/70 dark:hover:bg-amber-950/20 transition-colors border-b last:border-0 border-gray-50 dark:border-gray-800/60"
                      >
                        <img
                          src={item.image}
                          alt={itemTitle}
                          className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-gray-900 p-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {itemTitle}
                          </p>
                          <p className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                            {formatPrice(item.price, lang)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="p-2.5 bg-gray-50 dark:bg-[#141414] text-center border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {t('viewAll')} ({searchResults.length}+) &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs sm:text-sm text-gray-500">
                  {t('emptySearch')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: Compare, Favorites, Cart, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Compare Button */}
          <Link
            to="/compare"
            className="relative flex flex-col items-center justify-center p-2 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Taqqoslash"
          >
            <div className="relative">
              <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6" />
              {compareList.length > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-amber-400 text-black rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                  {compareList.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold hidden lg:inline mt-1">Taqqoslash</span>
          </Link>

          {/* Favorites Button */}
          <Link
            to="/favorites"
            className="relative flex flex-col items-center justify-center p-2 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={t('favorites')}
          >
            <div className="relative">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold hidden lg:inline mt-1">{t('favorites')}</span>
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800/80 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 text-gray-900 dark:text-white transition-all shadow-xs"
            title={t('cart')}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-black rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                {t('cart')}
              </span>
              <span className="text-xs font-black text-gray-900 dark:text-white leading-tight mt-0.5">
                {formatPrice(cartTotal, lang)}
              </span>
            </div>
          </Link>

          {/* User Auth / Profile */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-colors text-xs font-bold"
                >
                  <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center font-black text-black text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-bold text-gray-800 dark:text-gray-200 max-w-[80px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate font-mono">{user.phone || user.username}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('profile')}</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('adminPanel')}</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-xs transition-colors"
                title={t('login')}
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="hidden md:inline">{t('login')}</span>
              </Link>
            )}
          </div>

          {/* Mobile Theme Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Sub-Category Navigation Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800/80 bg-white dark:bg-[#141414] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-6 text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
          <Link to="/catalog?deals=true" className="text-rose-500 hover:text-rose-600 flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-current animate-bounce" />
            <span>Aksiyalar</span>
          </Link>
          <Link to="/catalog?category=smartphones" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('smartphones')}</span>
          </Link>
          <Link to="/catalog?category=laptops" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-blue-500" />
            <span>{t('laptops')}</span>
          </Link>
          <Link to="/catalog?category=tvs" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-purple-500" />
            <span>{t('tvs')}</span>
          </Link>
          <Link to="/catalog?category=appliances" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <Refrigerator className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('appliances')}</span>
          </Link>
          <Link to="/catalog?deals=true" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            <span>0% Muddatli to'lov</span>
          </Link>
          <Link to="/stores" className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('ourStores')}</span>
          </Link>
        </div>
      </div>

      {/* Interactive City Selector Modal */}
      <CityModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
    </header>
  );
};
