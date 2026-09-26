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

  // 3. Products State (LocalStorage + Seed)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('texnomart_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialProducts.length) return parsed;
      } catch (e) {
        console.error("Error reading saved products", e);
      }
    }
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

  // 5. Promo Code System
  const [promoCode, setPromoCode] = useState(null); // { code: 'TEXNO2026', discountPercent: 10, discountFixed: 0 }
  
  const validPromoCodes = {
    'TEXNO2026': { type: 'percent', value: 10 },
    'TEXNOMART': { type: 'percent', value: 15 },
    'YANGI': { type: 'fixed', value: 100000 },
    'SUPER': { type: 'percent', value: 20 },
  };

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (validPromoCodes[clean]) {
      setPromoCode({
        code: clean,
        ...validPromoCodes[clean],
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
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
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
