import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { initialProducts } from '../data/initialProducts';
import { sendTelegramMessage, formatOrderForTelegram } from '../utils/telegram';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Language state
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('texnomart_lang') || 'uz';
  });

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('texnomart_lang', newLang);
  };

  const t = (key) => {
    if (!translations[lang]) return translations['uz'][key] || key;
    return translations[lang][key] || translations['uz'][key] || key;
  };

  // 2. Dark/Light Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('texnomart_theme');
    if (saved) return saved === 'dark';
    return false; // Default light for vibrant Texnomart yellow look
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('texnomart_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('texnomart_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // 3. Products State (LocalStorage + Seed with auto-repair)
  const [products, setProducts] = useState(() => {
    const CURRENT_CATALOG_VERSION = 'v3_50_products';
    const savedVersion = localStorage.getItem('texnomart_catalog_version');
    const saved = localStorage.getItem('texnomart_products');

    if (saved && savedVersion === CURRENT_CATALOG_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) {
          // Double check if any product has the broken URL
          return parsed.map(p => {
            if (p.image && p.image.includes('photo-1511707171634-5f897ff02560')) {
              return { 
                ...p, 
                image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
                images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80"]
              };
            }
            return p;
          });
        }
      } catch (e) {
        console.error("Error reading saved products", e);
      }
    }

    // Refresh localStorage with verified initialProducts
    localStorage.setItem('texnomart_catalog_version', CURRENT_CATALOG_VERSION);
    localStorage.setItem('texnomart_products', JSON.stringify(initialProducts));
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('texnomart_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      images: [newProduct.image],
    };
    setProducts(prev => [productWithId, ...prev]);
    showToast(lang === 'uz' ? "Mahsulot muvaffaqiyatli qo'shildi!" : "Товар успешно добавлен!");
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p)));
    showToast(lang === 'uz' ? "Mahsulot yangilandi!" : "Товар обновлен!");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also remove from cart and favorites
    setCart(prev => prev.filter(item => item.id !== id));
    setFavorites(prev => prev.filter(fId => fId !== id));
    showToast(lang === 'uz' ? "Mahsulot o'chirildi!" : "Товар удален!");
  };

  const resetProductsToDefault = () => {
    setProducts(initialProducts);
    localStorage.setItem('texnomart_products', JSON.stringify(initialProducts));
    showToast(lang === 'uz' ? "Barcha mahsulotlar to'liq yangilandi!" : "Все товары полностью обновлены!", 'info');
  };

  const toggleProductStock = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.inStock;
        showToast(nextState ? (lang === 'uz' ? "Omborda mavjud qilindi!" : "Отмечен в наличии!") : (lang === 'uz' ? "Omborda tugadi qilindi!" : "Отмечен нет в наличии!"), 'info');
        return { ...p, inStock: nextState };
      }
      return p;
    }));
  };

  const duplicateProduct = (id) => {
    const existing = products.find(p => p.id === id);
    if (!existing) return;
    const duplicated = {
      ...existing,
      id: Date.now(),
      title: typeof existing.title === 'object'
        ? {
            uz: `${existing.title.uz} (Nusxa)`,
            ru: `${existing.title.ru} (Копия)`,
            en: `${existing.title.en} (Copy)`,
          }
        : `${existing.title} (Nusxa)`
    };
    setProducts(prev => [duplicated, ...prev]);
    showToast(lang === 'uz' ? "Mahsulotdan nusxa olindi!" : "Создана копия товара!", 'success');
  };

  const bulkDeleteProducts = (ids) => {
    if (!ids || ids.length === 0) return;
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    setCart(prev => prev.filter(item => !ids.includes(item.id)));
    setFavorites(prev => prev.filter(fId => !ids.includes(fId)));
    showToast(lang === 'uz' ? `${ids.length} ta mahsulot o'chirildi!` : `${ids.length} товаров удалено!`, 'info');
  };

  const bulkToggleStock = (ids, inStock) => {
    if (!ids || ids.length === 0) return;
    setProducts(prev => prev.map(p => ids.includes(p.id) ? { ...p, inStock } : p));
    showToast(lang === 'uz' ? `${ids.length} ta mahsulot holati yangilandi!` : `${ids.length} товаров обновлено!`, 'success');
  };

  // 4. Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('texnomart_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('texnomart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
    showToast(`${title} - ${t('addToCart')}!`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 5. Promo Code System (Dynamic List + Application)
  const defaultPromoCodes = [
    { id: 1, code: 'TEXNO2026', type: 'percent', value: 10, desc: "Barcha tovarlar uchun 10% chegirma", minOrder: 0, active: true },
    { id: 2, code: 'TEXNOMART', type: 'percent', value: 15, desc: "Maxsus aksiyali 15% chegirma", minOrder: 500000, active: true },
    { id: 3, code: 'YANGI', type: 'fixed', value: 100000, desc: "Birinchi xarid uchun 100 000 so'm chegirma", minOrder: 1000000, active: true },
    { id: 4, code: 'SUPER', type: 'percent', value: 20, desc: "VIP mijozlar uchun 20% maxsus chegirma", minOrder: 5000000, active: true },
    { id: 5, code: 'BAHOR', type: 'fixed', value: 50000, desc: "Mavsumiy 50 000 so'm chegirma", minOrder: 300000, active: true },
  ];

  const [promoCodes, setPromoCodes] = useState(() => {
    const saved = localStorage.getItem('texnomart_promos');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultPromoCodes;
  });

  useEffect(() => {
    localStorage.setItem('texnomart_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  const addPromoCode = (newPromo) => {
    const item = {
      ...newPromo,
      id: Date.now(),
      code: newPromo.code.trim().toUpperCase(),
      active: true,
      minOrder: Number(newPromo.minOrder) || 0,
      value: Number(newPromo.value) || 0,
    };
    setPromoCodes(prev => [item, ...prev]);
    showToast("Yangi promokod yaratildi!", 'success');
  };

  const updatePromoCode = (id, fields) => {
    setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p));
    showToast("Promokod yangilandi!", 'success');
  };

  const deletePromoCode = (id) => {
    setPromoCodes(prev => prev.filter(p => p.id !== id));
    showToast("Promokod o'chirildi!", 'info');
  };

  const togglePromoCode = (id) => {
    setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const [promoCode, setPromoCode] = useState(null);

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    const found = promoCodes.find(p => p.code === clean && p.active);
    if (found) {
      if (found.minOrder && cartSubtotal < found.minOrder) {
        showToast(lang === 'uz' ? `Promokod uchun minimal xarid: ${new Intl.NumberFormat('ru-RU').format(found.minOrder)} so'm` : `Мин. заказ: ${new Intl.NumberFormat('ru-RU').format(found.minOrder)} сум`, 'error');
        return false;
      }
      setPromoCode({
        code: clean,
        type: found.type,
        value: found.value,
        desc: found.desc
      });
      showToast(t('promoApplied'), 'success');
      return true;
    } else {
      showToast(t('promoInvalid'), 'error');
      return false;
    }
  };

  const removePromoCode = () => setPromoCode(null);

  const discountAmount = promoCode
    ? promoCode.type === 'percent'
      ? Math.round(cartSubtotal * (promoCode.value / 100))
      : Math.min(cartSubtotal, promoCode.value)
    : 0;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // 5.1 Hero Banners Management
  const defaultBanners = [
    {
      id: 1,
      titleUz: "iPhone 16 Pro Max",
      subtitleUz: "0% Boshlang'ich to'lov bilan 24 oyga muddatli to'lov!",
      titleRu: "iPhone 16 Pro Max",
      subtitleRu: "Рассрочка на 24 месяца без первого взноса!",
      titleEn: "iPhone 16 Pro Max",
      subtitleEn: "0% Down payment with 24 months installment plan!",
      badge: "YILNING ENG KUCHLI SMARTFONI",
      link: "/product/1",
      bgGradient: "from-amber-400 via-amber-500 to-yellow-500 text-black",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      monthly: "729 000",
      active: true
    },
    {
      id: 2,
      titleUz: "Samsung Galaxy S24 Ultra",
      subtitleUz: "Galaxy AI sun'iy intellekti va 200MP aql bovar qilmas kamera",
      titleRu: "Samsung Galaxy S24 Ultra",
      subtitleRu: "Искусственный интеллект Galaxy AI и камера 200МП",
      titleEn: "Samsung Galaxy S24 Ultra",
      subtitleEn: "Galaxy AI experience with 200MP flagship camera",
      badge: "GALAXY AI FLIP",
      link: "/product/2",
      bgGradient: "from-zinc-950 via-slate-900 to-neutral-900 text-white",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      monthly: "662 000",
      active: true
    },
    {
      id: 3,
      titleUz: "MacBook Air 13\" M3",
      subtitleUz: "18 soatgacha batareya quvvati va Liquid Retina displey",
      titleRu: "MacBook Air 13\" M3",
      subtitleRu: "До 18 часов работы без подзарядки на чипе M3",
      titleEn: "MacBook Air 13\" M3",
      subtitleEn: "Up to 18 hours battery life on Apple M3 chip",
      badge: "PROFESSIONAL",
      link: "/product/3",
      bgGradient: "from-blue-600 via-indigo-600 to-slate-900 text-white",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      monthly: "583 000",
      active: true
    }
  ];

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('texnomart_banners');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultBanners;
  });

  useEffect(() => {
    localStorage.setItem('texnomart_banners', JSON.stringify(banners));
  }, [banners]);

  const addBanner = (bannerData) => {
    const newBanner = {
      ...bannerData,
      id: Date.now(),
      active: true
    };
    setBanners(prev => [newBanner, ...prev]);
    showToast("Yangi banner qo'shildi!", 'success');
  };

  const updateBanner = (id, fields) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b));
    showToast("Banner yangilandi!", 'success');
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast("Banner o'chirildi!", 'info');
  };

  const toggleBanner = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  // 5.2 Admin Notification System
  const [adminNotifications, setAdminNotifications] = useState([
    { id: 1, title: "Yangi buyurtma #78922", desc: "Malika Karimova - Apple Watch Series 10", time: "10 daqiqa oldin", type: "order", read: false },
    { id: 2, title: "Telegram bot faol", desc: "@orifxojabot buyurtmalarni qabul qilishga tayyor", time: "1 soat oldin", type: "system", read: false },
    { id: 3, title: "Ombor ogohlantirishi", desc: "Dyson Supersonic zaxirasi kam qoldi", time: "Bugun", type: "warning", read: false }
  ]);

  const dismissNotification = (id) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setAdminNotifications([]);
  };

  // 6. Favorites State (Wishlist)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('texnomart_favorites');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [1, 3]; // default initial favorites
  });

  useEffect(() => {
    localStorage.setItem('texnomart_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(lang === 'uz' ? "Sevimlilardan o'chirildi" : "Удалено из избранного", 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast(lang === 'uz' ? "Sevimlilarga qo'shildi!" : "Добавлено в избранное!", 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);
  const clearFavorites = () => setFavorites([]);

  // 6.2 Comparison State
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('texnomart_compare');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [1, 2]; // default comparison between iPhone 16 Pro Max and S24 Ultra
  });

  useEffect(() => {
    localStorage.setItem('texnomart_compare', JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (productId) => {
    setCompareList(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(lang === 'uz' ? "Taqqoslashdan chiqarildi" : "Удалено из сравнения", 'info');
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast(lang === 'uz' ? "Maksimal 4 ta mahsulotni taqqoslash mumkin!" : "Можно сравнивать до 4 товаров!", 'error');
          return prev;
        }
        showToast(lang === 'uz' ? "Taqqoslashga qo'shildi!" : "Добавлено к сравнению!", 'success');
        return [...prev, productId];
      }
    });
  };

  const isCompared = (productId) => compareList.includes(productId);
  const clearCompare = () => setCompareList([]);

  // 6.3 Quick Buy State (1-Click Order)
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const openQuickBuy = (product) => setQuickBuyProduct(product);
  const closeQuickBuy = () => setQuickBuyProduct(null);

  const submitQuickOrder = async ({ product, quantity = 1, customerName, phone, deliveryMethod, paymentMethod, address, comment }) => {
    const price = product.price;
    const totalAmount = price * quantity;
    const newOrder = {
      id: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new',
      customerName,
      phone,
      deliveryMethod: deliveryMethod || 'courier',
      paymentMethod: paymentMethod || 'cash',
      address: address || "Toshkent shahar",
      comment: comment || "1 bosishda tezkor xarid",
      items: [
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: quantity,
          image: product.image
        }
      ],
      totalAmount,
      subtotal: totalAmount,
      discountAmount: 0,
      isQuickBuy: true
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send to Telegram
    const telegramMessage = formatOrderForTelegram(newOrder);
    const tgResult = await sendTelegramMessage(telegramMessage);

    showToast(lang === 'uz' ? `Buyurtma #${newOrder.id} qabul qilindi!` : `Заказ #${newOrder.id} оформлен!`, 'success');
    return { order: newOrder, telegramResult: tgResult };
  };

  // 6.4 Selected City State
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('texnomart_city') || 'Toshkent';
  });

  const changeCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem('texnomart_city', city);
  };

  // 7. Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('texnomart_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    // Seed with 2 demo orders
    return [
      {
        id: 78921,
        date: "2026-09-25 14:30",
        customerName: "Azizbek Rahimov",
        phone: "+998 90 123 45 67",
        address: "Toshkent sh., Yunusobod 4-mavze 12-uy",
        deliveryMethod: "courier",
        paymentMethod: "payme",
        items: [
          { id: 1, title: { uz: "Apple iPhone 16 Pro Max 256GB" }, price: 17499000, quantity: 1 }
        ],
        totalAmount: 17499000,
        discountAmount: 0,
        status: "completed", // 'new', 'processing', 'delivering', 'completed', 'cancelled'
        comment: "Kodni SMS orqali yuboring"
      },
      {
        id: 78922,
        date: "2026-09-26 10:15",
        customerName: "Malika Karimova",
        phone: "+998 93 987 65 43",
        address: "Texnomart Beruniy do'koni",
        deliveryMethod: "pickup",
        paymentMethod: "click",
        items: [
          { id: 11, title: { uz: "Apple Watch Series 10 GPS 46mm" }, price: 5800000, quantity: 1 }
        ],
        totalAmount: 5800000,
        discountAmount: 0,
        status: "processing",
        comment: "Bugun soat 17:00 dan keyin olib ketaman"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('texnomart_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = async (orderData) => {
    const newOrder = {
      id: Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'new',
      items: [...cart],
      totalAmount: cartTotal,
      subtotal: cartSubtotal,
      discountAmount: discountAmount,
      promoCodeApplied: promoCode ? promoCode.code : null,
      ...orderData,
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send Telegram Notification
    const telegramMessage = formatOrderForTelegram(newOrder);
    const tgResult = await sendTelegramMessage(telegramMessage);

    // Clear cart and promo
    clearCart();
    removePromoCode();

    return { order: newOrder, telegramResult: tgResult };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(lang === 'uz' ? `Buyurtma #${orderId} holati o'zgartirildi!` : `Статус заказа #${orderId} изменен!`);
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(lang === 'uz' ? `Buyurtma #${orderId} o'chirildi!` : `Заказ #${orderId} удален!`, 'info');
  };

  // 8. Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('texnomart_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null; // Guest by default
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('texnomart_user', JSON.stringify(userData));
    showToast(lang === 'uz' ? `Xush kelibsiz, ${userData.name}!` : `Добро пожаловать, ${userData.name}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('texnomart_user');
    showToast(lang === 'uz' ? "Tizimdan chiqdingiz" : "Вы вышли из системы", 'info');
  };

  // 9. UI Helpers (Toast notification & Catalog Mega Menu)
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppContext.Provider
      value={{
        lang,
        changeLang,
        t,
        isDark,
        toggleTheme,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        toggleProductStock,
        duplicateProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        discountAmount,
        bulkDeleteProducts,
        bulkToggleStock,
        promoCodes,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        togglePromoCode,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBanner,
        adminNotifications,
        dismissNotification,
        clearNotifications,
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        compareList,
        toggleCompare,
        isCompared,
        clearCompare,
        quickBuyProduct,
        openQuickBuy,
        closeQuickBuy,
        submitQuickOrder,
        selectedCity,
        changeCity,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        user,
        login,
        logout,
        toast,
        showToast,
        isCatalogOpen,
        setIsCatalogOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
