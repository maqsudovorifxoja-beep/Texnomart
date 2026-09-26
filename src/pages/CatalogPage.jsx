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
  Filter,
  ArrowUpDown
} from 'lucide-react';

export const CatalogPage = () => {
  const { products, t, lang } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Query params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const brandParam = searchParams.get('brand') || '';
  const hitParam = searchParams.get('hit') === 'true';
  const dealsParam = searchParams.get('deals') === 'true';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState(brandParam ? [brandParam] : []);
  const [onlyDiscounts, setOnlyDiscounts] = useState(dealsParam);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 40000000 });
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (brandParam) setSelectedBrands([brandParam]);
    if (dealsParam) setOnlyDiscounts(true);
  }, [categoryParam, brandParam, dealsParam]);

  // Unique brands
  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach(p => { if (p.brand) set.add(p.brand); });
    return Array.from(set).sort();
  }, [products]);

  const filteredBrandList = availableBrands.filter(b =>
    b.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setOnlyDiscounts(false);
    setOnlyInStock(false);
    setPriceRange({ min: 0, max: 40000000 });
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

      // 4. Hit / Deals filter
      if (hitParam && !product.isHit) {
        return false;
      }
      if (onlyDiscounts && (!product.oldPrice || product.oldPrice <= product.price)) {
        return false;
      }

      // 5. In stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // 6. Price range
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.reviewsCount - a.reviewsCount;
    });
  }, [products, searchParam, selectedCategory, selectedBrands, hitParam, onlyDiscounts, onlyInStock, priceRange, sortBy, lang]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Catalog Header with Breadcrumbs & Results Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {selectedCategory
              ? t(categories.find(c => c.slug === selectedCategory)?.nameKey || 'catalog')
              : searchParam
              ? `Qidiruv: "${searchParam}"`
              : "Mahsulotlar katalogi"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Topildi: <strong className="text-gray-900 dark:text-white">{filteredProducts.length}</strong> ta mahsulot
          </p>
        </div>

        {/* Sort & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 font-bold text-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-500" />
            <span>Filtrlar</span>
            {(selectedBrands.length > 0 || selectedCategory || onlyDiscounts) && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="catalog-sort-select" className="sr-only">Saralash</label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
            >
              <option value="popular">Ommabopligi bo'yicha</option>
              <option value="price-asc">Narx: arzon &rarr; qimmat</option>
              <option value="price-desc">Narx: qimmat &rarr; arzon</option>
              <option value="rating">Yuqori reytingli</option>
              <option value="new">Yangi kelganlar</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(selectedCategory || selectedBrands.length > 0 || onlyDiscounts || onlyInStock) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-gray-400">Tanlangan:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold">
              {t(selectedCategory)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
            </span>
          )}
          {selectedBrands.map(b => (
            <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold">
              {b}
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandToggle(b)} />
            </span>
          ))}
          {onlyDiscounts && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold">
              Faqat chegirma
              <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyDiscounts(false)} />
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-rose-500 font-bold hover:underline ml-2"
          >
            Barchasini tozalash
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar (3 cols) + Product Grid (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= DESKTOP STICKY SIDEBAR ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white dark:bg-[#1a1a1a] p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28">
          
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 font-black text-sm text-gray-900 dark:text-white">
              <Filter className="w-4 h-4 text-amber-500" />
              <span>Filtrlar</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Tozalash</span>
            </button>
          </div>

          {/* 1. Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Kategoriyalar
            </h3>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === ''
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Barchasi ({products.length})
              </button>
              {categories.map(c => {
                const count = products.filter(p => p.category === c.slug).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === c.slug
                        ? 'bg-amber-400 text-black font-black shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{t(c.nameKey)}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brand with Search */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Brend
            </h3>
            <div className="relative">
              <input
                type="text"
                value={brandSearchQuery}
                onChange={(e) => setBrandSearchQuery(e.target.value)}
                placeholder="Brendni qidirish..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:border-amber-400"
              />
              <SearchIcon className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredBrandList.map(b => (
                <label key={b} className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-amber-500">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => handleBrandToggle(b)}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
                    />
                    <span>{b}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    ({products.filter(p => p.brand === b).length})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Price Range Slider */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Narx (so'm)
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                className="w-1/2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono font-bold"
                placeholder="Min"
              />
              <span>—</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                className="w-1/2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono font-bold"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="0"
              max="40000000"
              step="500000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 4. Toggles */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDiscounts}
                onChange={(e) => setOnlyDiscounts(e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>Faqat chegirmadagi mahsulotlar</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-gray-300 text-amber-500 focus:ring-amber-400 h-4 w-4"
              />
              <span>Omborda bor tovarlar</span>
            </label>
          </div>

        </aside>

        {/* ================= PRODUCT GRID (9 Cols) ================= */}
        <main className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Hech qanday mahsulot topilmadi
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Tanlangan filtrlarga mos keluvchi tovar mavjud emas. Filtrlarni tozalab ko'ring.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                Filtrlarni tozalash
              </button>
            </div>
          )}
        </main>

      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                  Filtrlar
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
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Kategoriyalar</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      selectedCategory === '' ? 'bg-amber-400 text-black' : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    Barchasi
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        selectedCategory === c.slug ? 'bg-amber-400 text-black' : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {t(c.nameKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Brendlar</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
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

              {/* Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={onlyDiscounts}
                    onChange={(e) => setOnlyDiscounts(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Faqat chegirmadagi tovarlar</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Omborda bor tovarlar</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs font-bold"
              >
                Tozalash
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-2xl bg-primary font-black text-xs text-black"
              >
                Ko'rish ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
