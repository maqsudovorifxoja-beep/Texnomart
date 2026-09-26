import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const brands = [
  { name: 'Apple', logo: ' Apple' },
  { name: 'Samsung', logo: 'SAMSUNG' },
  { name: 'Xiaomi', logo: 'mi XIAOMI' },
  { name: 'Artel', logo: 'artel' },
  { name: 'LG', logo: 'LG' },
  { name: 'Sony', logo: 'SONY' },
  { name: 'Asus', logo: 'ASUS' },
  { name: 'Dyson', logo: 'dyson' },
  { name: 'Bosch', logo: 'BOSCH' }
];

export const BrandSlider = () => {
  const { lang } = useApp();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-primary rounded-full" />
          {lang === 'uz' ? "Ommabop brendlar" : lang === 'ru' ? "Популярные бренды" : "Popular Brands"}
        </h2>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.name}
            to={`/catalog?brand=${brand.name}`}
            className="group flex items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all duration-200"
          >
            <span className="font-black text-sm sm:text-base text-gray-500 dark:text-gray-400 group-hover:text-amber-500 group-hover:scale-105 transition-all tracking-wider">
              {brand.logo}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
