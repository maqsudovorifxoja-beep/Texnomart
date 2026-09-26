import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/common/ProductCard';
import { categories } from '../data/categories';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  Search as SearchIcon,
  Filter
} from 'lucide-react';

export const CatalogPage = () => {
  const { products, t, lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const brandParam = searchParams.get('brand') || '';
  const hitParam = searchParams.get('hit') === 'true';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState(brandParam ? [brandParam] : []);
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 25000000 });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync when URL params change
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (brandParam) setSelectedBrands([brandParam]);
  }, [categoryParam, brandParam]);

  // Unique brands from product list
  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [products]);

  // Toggle brand selection
  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setOnlyDiscounts(false);
    setOnlyInStock(false);
    setPriceRange({ min: 0, max: 25000000 });
    setSortBy('popular');
    setSearchParams({});
  };

  // Filter and Sort Engine
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;

      // 1. Text Search filter
      if (searchParam && !title.toLowerCase().includes(searchParam.toLowerCase()) &&
          !product.brand.toLowerCase().includes(searchParam.toLowerCase())) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // 3. Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // 4. Hit / Deal filter
      if (hitParam && !product.isHit && !product.isDealOfTheDay) {
        return false;
      }

      // 5. Discount filter
      if (onlyDiscounts && (!product.oldPrice || product.oldPrice <= product.price)) {
        return false;
      }

      // 6. In stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // 7. Price range
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // default: popular (hits and reviews)
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, searchParam, selectedCategory, selectedBrands, hitParam, onlyDiscounts, onlyInStock, priceRange, sortBy, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Breadcrumb & Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {selectedCategory
              ? t(categories.find(c => c.slug === selectedCategory)?.nameKey || 'catalog')
              : searchParam
              ? `${lang === 'uz' ? "Qidiruv natijalari:" : "Результаты поиска:"} "${searchParam}"`
              : t('catalog')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredProducts.length} {t('foundProducts')}
          </p>
        </div>

        {/* Sort Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>{t('filters')}</span>
            {(selectedBrands.length > 0 || selectedCategory || onlyDiscounts) && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="catalog-sort" className="sr-only">{t('sortBy')}</label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
            >
              <option value="popular">{t('sortPopular')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
              <option value="new">{t('sortNew')}</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ===================== SIDEBAR FILTERS (DESKTOP) ===================== */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-fit sticky top-28">
          
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>{t('filters')}</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              {t('clearFilters')}
            </button>
          </div>

          {/* 1. Category Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
              {t('productCategory')}
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {t('allCategories')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t(cat.nameKey)}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Brand Filter */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
              {t('brand')}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableBrands.map(brand => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-amber-500"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Price Range Slider */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3">
              {t('priceRange')}
            </h3>
            <div className="flex items-center gap-2 mb-2 text-xs">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-1/2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-1/2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="0"
              max="25000000"
              step="500000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 4. Special Toggles */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
            <label className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDiscounts}
                onChange={(e) => setOnlyDiscounts(e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>{t('onlyDiscounts')}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>{t('inStock')}</span>
            </label>
          </div>

        </aside>

        {/* ===================== PRODUCTS GRID ===================== */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('emptySearch')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                {lang === 'uz'
                  ? "Boshqa kalit so'zlarni kiritib ko'ring yoki filtrlarni tozalang."
                  : "Попробуйте ввести другие ключевые слова или сбросить фильтры."}
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-black font-bold text-xs shadow-md transition-all"
              >
                {t('clearFilters')}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ===================== MOBILE FILTER MODAL ===================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                  {t('filters')}
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">{t('productCategory')}</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedCategory === '' ? 'bg-amber-400 text-black font-bold' : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {t('allCategories')}
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategory === c.slug ? 'bg-amber-400 text-black font-bold' : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {t(c.nameKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">{t('brand')}</h4>
                <div className="space-y-2">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => handleBrandToggle(b)}
                        className="rounded text-amber-500"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discounts & Stock */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={onlyDiscounts}
                    onChange={(e) => setOnlyDiscounts(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>{t('onlyDiscounts')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>{t('inStock')}</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold"
              >
                {t('clearFilters')}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-primary font-bold text-xs text-black"
              >
                {t('confirmOrder')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
