import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, X, Check } from 'lucide-react';

const CITIES = [
  { id: 'Toshkent', nameUz: 'Toshkent shahri', nameRu: 'г. Ташкент', stores: '18 ta do\'kon' },
  { id: 'Samarqand', nameUz: 'Samarqand', nameRu: 'г. Самарканд', stores: '4 ta do\'kon' },
  { id: 'Buxoro', nameUz: 'Buxoro', nameRu: 'г. Бухара', stores: '3 ta do\'kon' },
  { id: 'Farg\'ona', nameUz: 'Farg\'ona', nameRu: 'г. Фергана', stores: '3 ta do\'kon' },
  { id: 'Namangan', nameUz: 'Namangan', nameRu: 'г. Наманган', stores: '2 ta do\'kon' },
  { id: 'Andijon', nameUz: 'Andijon', nameRu: 'г. Андижан', stores: '3 ta do\'kon' },
  { id: 'Qarshi', nameUz: 'Qarshi', nameRu: 'г. Карши', stores: '2 ta do\'kon' },
  { id: 'Nukus', nameUz: 'Nukus', nameRu: 'г. Нукус', stores: '2 ta do\'kon' },
];

export const CityModal = ({ isOpen, onClose }) => {
  const { selectedCity, changeCity, lang } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity flex justify-center items-center p-4">
      <div 
        className="relative bg-white dark:bg-[#1a1a1c] rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-400 text-black rounded-xl">
              <MapPin className="w-4 h-4 fill-black" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                {lang === 'uz' ? "Shahringizni tanlang" : "Выберите ваш город"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === 'uz' ? "Yetkazib berish va narxlar shahar bo'yicha ko'rsatiladi" : "Для точных сроков доставки"}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-80 overflow-y-auto pr-1">
          {CITIES.map((city) => {
            const isSelected = selectedCity === city.id;
            return (
              <button
                key={city.id}
                onClick={() => {
                  changeCity(city.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-black dark:text-white font-black'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm">
                    {lang === 'ru' ? city.nameRu : city.nameUz}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">
                    {city.stores}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-500 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
