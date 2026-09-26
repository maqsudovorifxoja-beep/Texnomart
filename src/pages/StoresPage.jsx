import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { storesData, storeCities } from '../data/storesData';
import L from 'leaflet';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Search,
  CheckCircle,
  Building2,
  ChevronRight
} from 'lucide-react';

export const StoresPage = () => {
  const { t, lang } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedCity, setSelectedCity] = useState("Barchasi");
  const [storeSearch, setStoreSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(storesData[0]);

  // Filtered stores
  const filteredStores = storesData.filter(store => {
    const matchesCity = selectedCity === "Barchasi" || store.city === selectedCity;
    const matchesQuery = store.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
                         store.address.toLowerCase().includes(storeSearch.toLowerCase());
    return matchesCity && matchesQuery;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create custom Texnomart marker icon
      const customIcon = L.divIcon({
        className: 'custom-texno-pin',
        html: `
          <div style="
            background-color: #fbc100;
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <span style="
              transform: rotate(45deg);
              font-weight: 900;
              font-size: 14px;
              color: #1a1a1a;
            ">T</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      // Initialize Leaflet map centered at Tashkent
      const map = L.map(mapContainerRef.current, {
        center: [41.2995, 69.2401],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      window.__texnoCustomIcon = customIcon;
    }

    const map = mapInstanceRef.current;
    const customIcon = window.__texnoCustomIcon;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers for filtered stores
    filteredStores.forEach(store => {
      const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px; font-weight: 800; font-size: 14px; color: #1a1a1a;">${store.name}</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #555;">${store.address}</p>
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #d97706;">🕒 ${store.hours}</p>
          <p style="margin: 4px 0 0; font-size: 12px; color: #2563eb;">📞 ${store.phone}</p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedStore(store);
      });

      markersRef.current.push(marker);
    });

    if (filteredStores.length > 0) {
      map.flyTo([filteredStores[0].lat, filteredStores[0].lng], 12, { duration: 1.2 });
    }

  }, [filteredStores]);

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <span className="w-3 h-8 bg-primary rounded-full" />
          {t('storesTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {t('storesSubtitle')}
        </p>
      </div>

      {/* City Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* City Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {storeCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-primary text-black shadow-sm'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:bg-gray-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Store Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
            placeholder="Do'kon nomi yoki ko'cha..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-xs focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Main Map + Store List Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= STORES LIST (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredStores.map(store => {
            const isSelected = selectedStore?.id === store.id;
            return (
              <div
                key={store.id}
                onClick={() => handleSelectStore(store)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/70 dark:bg-amber-950/30 shadow-md ring-1 ring-amber-400'
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                      {store.city}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      {store.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {store.address}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-amber-500 translate-x-1' : 'text-gray-400'}`} />
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {store.hours}
                  </span>
                  <a
                    href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {store.phone}
                  </a>
                </div>

                {store.features && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {store.features.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= LEAFLET INTERACTIVE MAP (8 Cols) ================= */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-2 shadow-sm relative overflow-hidden">
          <div
            ref={mapContainerRef}
            className="w-full h-[550px] rounded-2xl z-10"
            style={{ minHeight: '550px' }}
          />

          {/* Floating Selected Store Card Overlay */}
          {selectedStore && (
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-sm z-20 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400 text-black rounded-lg font-black text-xs">
                  T
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                    {selectedStore.name}
                  </h4>
                  <p className="text-[11px] text-gray-400">{selectedStore.address}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400 font-medium">🕒 {selectedStore.hours}</span>
                <a
                  href={`https://maps.google.com/?q=${selectedStore.lat},${selectedStore.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-black text-white dark:bg-amber-400 dark:text-black font-bold rounded-lg text-xs flex items-center gap-1 hover:opacity-90"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
