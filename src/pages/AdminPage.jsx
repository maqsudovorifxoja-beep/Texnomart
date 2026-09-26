import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateMonthly } from '../utils/formatters';
import { categories } from '../data/categories';
import {
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage,
  formatOrderForTelegram,
  fetchBotUpdates
} from '../utils/telegram';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  User,
  Plus,
  Edit,
  Trash2,
  Copy,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Bot,
  ExternalLink,
  RotateCcw,
  Download,
  Eye,
  Filter,
  ArrowUpDown,
  Tag,
  Printer,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  DollarSign,
  Clock,
  ShieldCheck,
  Check,
  Flame,
  Store,
  Bell,
  Sun,
  Moon,
  Phone,
  MapPin,
  CreditCard,
  Layers,
  Settings,
  Menu,
  FileText,
  CheckSquare,
  Square,
  ArrowUpRight,
  MoreVertical,
  Percent,
  Lock,
  EyeOff,
  LogOut,
  ArrowRight,
  Key
} from 'lucide-react';

export const AdminPage = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    toggleProductStock,
    duplicateProduct,
    bulkDeleteProducts,
    bulkToggleStock,
    orders,
    updateOrderStatus,
    deleteOrder,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBanner,
    promoCodes,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    togglePromoCode,
    adminNotifications,
    dismissNotification,
    clearNotifications,
    isDark,
    toggleTheme,
    changeLang,
    t,
    lang,
    showToast
  } = useApp();

  // Admin Auth Credentials & Session State
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('texnomart_admin_creds');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return { username: 'admin', password: 'admin123' };
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('texnomart_admin_authenticated') === 'true';
  });

  // Purge any stale persistent auth on first load so user gets the login prompt
  React.useEffect(() => {
    localStorage.removeItem('texnomart_admin_authenticated');
  }, []);

  // Admin Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Change Password in Settings State
  const [changeUsernameInput, setChangeUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // Navigation & Shell State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | products | orders | customers | banners | promos | telegram | settings
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Products Management State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all' | 'inStock' | 'outOfStock'
  const [productSort, setProductSort] = useState('newest');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productPage, setProductPage] = useState(1);
  const itemsPerPage = 10;

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    titleUz: '',
    titleRu: '',
    titleEn: '',
    category: 'smartphones',
    brand: 'Apple',
    price: '',
    oldPrice: '',
    image: '',
    description: '',
    specs: '',
    isHit: false,
    isNew: true,
    isDealOfTheDay: false
  });

  // Orders Management State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Customers Management State
  const [customerSearch, setCustomerSearch] = useState('');

  // Banner Modal State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    titleUz: '',
    subtitleUz: '',
    titleRu: '',
    subtitleRu: '',
    titleEn: '',
    subtitleEn: '',
    badge: 'YANGI AKSIYA',
    link: '/catalog',
    bgGradient: 'from-amber-400 via-amber-500 to-yellow-500 text-black',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    monthly: '500 000'
  });

  // Promo Code Modal State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: '',
    type: 'percent', // percent | fixed
    value: '',
    minOrder: '',
    desc: ''
  });

  // Telegram Config State
  const [tgConfig, setTgConfig] = useState(getTelegramConfig());
  const [testSending, setTestSending] = useState(false);
  const [detectingChat, setDetectingChat] = useState(false);

  // Preset Sample Images for fast product creation
  const presetImages = [
    { label: 'iPhone', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
    { label: 'Samsung', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80' },
    { label: 'MacBook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Smart TV', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80' },
    { label: 'Muzlatgich', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Soat', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80' }
  ];

  // ================= METRICS & ANALYTICS =================
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = totalProductsCount - inStockCount;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Order Counts by Status
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      new: orders.filter(o => o.status === 'new').length,
      processing: orders.filter(o => o.status === 'processing').length,
      delivering: orders.filter(o => o.status === 'delivering').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders]);

  // Unique Customers Aggregation (CRM)
  const customersList = useMemo(() => {
    const map = new Map();
    orders.forEach(ord => {
      const key = ord.phone || ord.customerName;
      if (!map.has(key)) {
        map.set(key, {
          name: ord.customerName,
          phone: ord.phone,
          address: ord.address,
          totalSpent: 0,
          ordersCount: 0,
          lastOrderDate: ord.date,
          status: 'Oddiy'
        });
      }
      const existing = map.get(key);
      existing.totalSpent += ord.totalAmount || 0;
      existing.ordersCount += 1;
      if (new Date(ord.date) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.date;
      }
      if (existing.totalSpent >= 20000000) {
        existing.status = 'VIP';
      } else if (existing.ordersCount > 1) {
        existing.status = 'Doimiy';
      } else {
        existing.status = 'Yangi';
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customersList.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    );
  }, [customersList, customerSearch]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
      const matchesSearch = title.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
                            String(p.id).includes(productSearch);
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesStock = productStockFilter === 'all' ||
                           (productStockFilter === 'inStock' && p.inStock) ||
                           (productStockFilter === 'outOfStock' && !p.inStock);
      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      const titleA = typeof a.title === 'object' ? (a.title[lang] || a.title.uz) : a.title;
      const titleB = typeof b.title === 'object' ? (b.title[lang] || b.title.uz) : b.title;

      if (productSort === 'price-asc') return a.price - b.price;
      if (productSort === 'price-desc') return b.price - a.price;
      if (productSort === 'name') return titleA.localeCompare(titleB);
      return b.id - a.id; // newest
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter, productSort, lang]);

  // Pagination for products
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, productPage]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchesSearch = String(o.id).includes(orderSearch) ||
                            o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.phone.includes(orderSearch);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Top Categories Breakdown for Dashboard
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([cat, count]) => {
      const catData = categories.find(c => c.slug === cat);
      const name = catData?.title ? (catData.title[lang] || catData.title.uz) : cat;
      return {
        category: cat,
        name,
        count,
        percent: Math.round((count / (products.length || 1)) * 100)
      };
    }).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [products, lang]);

  // ================= ADMIN AUTHENTICATION HANDLERS =================
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    setTimeout(() => {
      const enteredUser = loginUsername.trim();
      const enteredPass = loginPassword.trim();

      if (enteredUser === adminCredentials.username && enteredPass === adminCredentials.password) {
        setIsAdminAuthenticated(true);
        if (rememberMe) {
          localStorage.setItem('texnomart_admin_authenticated', 'true');
        } else {
          sessionStorage.setItem('texnomart_admin_authenticated', 'true');
        }
        showToast(lang === 'uz' ? "Boshqaruv tizimiga xush kelibsiz!" : "Добро пожаловать в админ панель!", 'success');
      } else {
        setAuthError(lang === 'uz' ? "Login yoki parol noto'g'ri! Iltimos, qayta tekshiring." : "Неверный логин или пароль!");
        showToast(lang === 'uz' ? "Kirish ma'lumotlari xato!" : "Ошибка входа!", 'error');
      }
      setIsLoggingIn(false);
    }, 350);
  };

  const handleAdminLogout = () => {
    if (window.confirm("Boshqaruv panelidan chiqmoqchimisiz?")) {
      setIsAdminAuthenticated(false);
      localStorage.removeItem('texnomart_admin_authenticated');
      sessionStorage.removeItem('texnomart_admin_authenticated');
      setLoginPassword('');
      showToast(lang === 'uz' ? "Tizimdan muvaffaqiyatli chiqdingiz" : "Вы вышли из системы", 'info');
    }
  };

  const handleAutofillDemo = () => {
    setLoginUsername(adminCredentials.username);
    setLoginPassword(adminCredentials.password);
    setAuthError('');
  };

  const handleChangeCredentials = (e) => {
    e.preventDefault();
    if (!changeUsernameInput.trim() || !newPasswordInput.trim()) {
      showToast("Iltimos, yangi login va parolni kiriting!", 'error');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showToast("Parollar bir-biriga mos kelmadi!", 'error');
      return;
    }
    const updated = {
      username: changeUsernameInput.trim(),
      password: newPasswordInput.trim()
    };
    setAdminCredentials(updated);
    localStorage.setItem('texnomart_admin_creds', JSON.stringify(updated));
    setChangeUsernameInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showToast("Admin login va paroli muvaffaqiyatli o'zgartirildi!", 'success');
  };

  // ================= PRODUCT ACTIONS =================
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      titleUz: '',
      titleRu: '',
      titleEn: '',
      category: 'smartphones',
      brand: 'Apple',
      price: '',
      oldPrice: '',
      image: presetImages[0].url,
      description: 'Eng so\'nggi modeldagi texnika, rasmiy kafolat bilan.',
      specs: 'Xotira: 256GB\nKafolat: 1 yil\nRang: Qora\nIshlab chiqaruvchi: Original',
      isHit: false,
      isNew: true,
      isDealOfTheDay: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    const titleUz = typeof product.title === 'object' ? product.title.uz : product.title;
    const titleRu = typeof product.title === 'object' ? product.title.ru : product.title;
    const titleEn = typeof product.title === 'object' ? product.title.en : product.title;

    let specsStr = '';
    if (product.specs && typeof product.specs === 'object') {
      specsStr = Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n');
    }

    setProductForm({
      titleUz: titleUz || '',
      titleRu: titleRu || '',
      titleEn: titleEn || '',
      category: product.category || 'smartphones',
      brand: product.brand || 'Apple',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      image: product.image || presetImages[0].url,
      description: product.description || '',
      specs: specsStr,
      isHit: product.isHit || false,
      isNew: product.isNew || false,
      isDealOfTheDay: product.isDealOfTheDay || false
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.titleUz || !productForm.price) {
      showToast("Iltimos, mahsulot nomi va narxini kiriting!", 'error');
      return;
    }

    const specsObj = {};
    if (productForm.specs) {
      productForm.specs.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }

    const payload = {
      title: {
        uz: productForm.titleUz,
        ru: productForm.titleRu || productForm.titleUz,
        en: productForm.titleEn || productForm.titleUz
      },
      category: productForm.category,
      brand: productForm.brand,
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      image: productForm.image || presetImages[0].url,
      description: productForm.description,
      specs: specsObj,
      isHit: productForm.isHit,
      isNew: productForm.isNew,
      isDealOfTheDay: productForm.isDealOfTheDay
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      deleteProduct(id);
    }
  };

  // Bulk Product Selection
  const handleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProductIds(prev => [...prev, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (window.confirm(`Haqiqatan ham ${selectedProductIds.length} ta mahsulotni o'chirmoqchimisiz?`)) {
      bulkDeleteProducts(selectedProductIds);
      setSelectedProductIds([]);
    }
  };

  const handleBulkToggleStock = (status) => {
    if (selectedProductIds.length === 0) return;
    bulkToggleStock(selectedProductIds, status);
    setSelectedProductIds([]);
  };

  // ================= BANNER ACTIONS =================
  const handleAddBannerSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.titleUz) {
      showToast("Iltimos, banner nomini kiriting!", 'error');
      return;
    }
    addBanner({
      ...bannerForm,
      active: true
    });
    setIsBannerModalOpen(false);
    setBannerForm({
      titleUz: '',
      subtitleUz: '',
      titleRu: '',
      subtitleRu: '',
      titleEn: '',
      subtitleEn: '',
      badge: 'YANGI AKSIYA',
      link: '/catalog',
      bgGradient: 'from-amber-400 via-amber-500 to-yellow-500 text-black',
      image: presetImages[0].url,
      monthly: '500 000'
    });
  };

  // ================= PROMO CODE ACTIONS =================
  const handleAddPromoSubmit = (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.value) {
      showToast("Promokod kodi va qiymatini kiriting!", 'error');
      return;
    }
    addPromoCode(promoForm);
    setIsPromoModalOpen(false);
    setPromoForm({
      code: '',
      type: 'percent',
      value: '',
      minOrder: '',
      desc: ''
    });
  };

  // ================= TELEGRAM ACTIONS =================
  const handleSaveTelegramConfig = (e) => {
    e.preventDefault();
    saveTelegramConfig(tgConfig);
    showToast("Telegram sozlamalari muvaffaqiyatli saqlandi!", 'success');
  };

  const handleAutoDetectChatId = async () => {
    setDetectingChat(true);
    const res = await fetchBotUpdates(tgConfig.botToken);
    setDetectingChat(false);

    if (res.success && res.chatId) {
      const updated = { ...tgConfig, chatId: res.chatId };
      setTgConfig(updated);
      saveTelegramConfig(updated);
      showToast(`Muvaffaqiyatli ulandi: ${res.chatTitle} (ID: ${res.chatId})`, 'success');
      await sendTelegramMessage(`✅ <b>Texnomart do'koni boti ulandi!</b>\n\nChat: <b>${res.chatTitle}</b>\nChat ID: <code>${res.chatId}</code>\nEndi yangi buyurtmalar shu yerga avtomatik keladi! 🛍`, updated);
    } else {
      showToast(res.message || "Chat ID aniqlanmadi. Avval Telegramda @orifxojabot ga /start deb yozing!", 'info');
    }
  };

  const handleSendTestTelegram = async () => {
    setTestSending(true);
    const testMessage = `
🔔 <b>TEXNOMART PRO TEST BILDIRISHNOMASI</b>
━━━━━━━━━━━━━━━━━━━
Sizning Telegram botingiz a'lo darajada ishlamoqda!
Sana & Vaqt: ${new Date().toLocaleString('uz-UZ')}
Do'kon mahsulotlari: ${products.length} ta
Buyurtmalar soni: ${orders.length} ta
Jami tushum: ${formatPrice(totalRevenue, 'uz')}
━━━━━━━━━━━━━━━━━━━
Status: <b>Faol (Online) ✅</b>
    `;
    const res = await sendTelegramMessage(testMessage, tgConfig);
    setTestSending(false);

    if (res.success) {
      showToast("Telegram botga test xabari yuborildi!", 'success');
    } else {
      showToast(res.message || "Telegramga jo'natib bo'lmadi. Token yoki Chat ID ni tekshiring.", 'error');
    }
  };

  const handleResendOrderToTelegram = async (order) => {
    const text = formatOrderForTelegram(order);
    const res = await sendTelegramMessage(text, tgConfig);
    if (res.success) {
      showToast(`Buyurtma #${order.id} Telegramga yuborildi!`, 'success');
    } else {
      showToast(res.message || "Xatolik yuz berdi", 'error');
    }
  };

  // Export JSON and CSV
  const handleExportProductsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `texnomart_products_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Mahsulotlar JSON fayl sifatida yuklandi!", 'success');
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      showToast("Eksport qilish uchun buyurtmalar mavjud emas!", 'info');
      return;
    }
    const headers = ["Buyurtma_ID", "Sana", "Mijoz", "Telefon", "Manzil", "Yetkazish", "Tolov_turi", "Summa_som", "Status"];
    const rows = orders.map(o => [
      `#${o.id}`,
      `"${o.date}"`,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      o.deliveryMethod,
      o.paymentMethod,
      o.totalAmount,
      o.status
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `texnomart_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Buyurtmalar CSV fayli yuklandi!", 'success');
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Mahsulotlar', icon: Package, badge: products.length },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, badge: orderCounts.new > 0 ? `${orderCounts.new} yangi` : orders.length, isPulse: orderCounts.new > 0 },
    { id: 'customers', label: 'Mijozlar (CRM)', icon: Users, badge: customersList.length },
    { id: 'banners', label: 'Katta Bannerlar', icon: Sparkles, badge: banners.length },
    { id: 'promos', label: 'Promokodlar', icon: Tag, badge: promoCodes.length },
    { id: 'telegram', label: 'Telegram Bot', icon: Bot, badge: tgConfig.botToken ? 'Online' : 'Off' },
    { id: 'settings', label: 'Sozlamalar', icon: Settings, badge: null },
  ];

  // If not authenticated, render Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans antialiased">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Navbar on Login Screen: Logo, Storefront Link, Large Lang Switcher, Theme Switcher */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <span className="font-black text-base text-white tracking-wider flex items-center gap-1.5">
                TEXNOMART
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-black font-extrabold">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">Boshqaruv Tizimi</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Large Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-2xl shadow-inner">
              {[
                { code: 'uz', flag: "🇺🇿", label: "O'zbek" },
                { code: 'ru', flag: "🇷🇺", label: "Русский" },
                { code: 'en', flag: "🇬🇧", label: "English" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => changeLang(item.code)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer ${
                    lang === item.code
                      ? 'bg-amber-400 text-black font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{item.flag}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Large Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-white font-black text-xs transition-all shadow-xs active:scale-95 group cursor-pointer"
            >
              <div className={`p-1.5 rounded-xl transition-transform group-hover:rotate-12 ${
                isDark ? 'bg-amber-400 text-black shadow-sm' : 'bg-slate-800 text-amber-400'
              }`}>
                {isDark ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 fill-current" />}
              </div>
              <span className="font-extrabold tracking-wide hidden sm:inline">
                {isDark ? "Tungi" : "Kunduzgi"}
              </span>
            </button>
          </div>
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-[#0f141f]/95 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center mx-auto shadow-xl shadow-amber-400/25 ring-4 ring-amber-400/20">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {lang === 'uz' ? "Admin Tizimiga Kirish" : lang === 'ru' ? "Вход в панель управления" : "Admin Portal Sign In"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {lang === 'uz' ? "Texnomart do'koni boshqaruv tizimiga kirish uchun login va parolingizni kiriting" :
               lang === 'ru' ? "Введите свои учетные данные для управления интернет-магазином" :
               "Enter your administrative credentials to access the storefront dashboard"}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-bold text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Xavfsiz Administratsiya Tizimi</span>
            </div>
          </div>

          {/* Error Alert Banner */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span className="font-semibold">{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'uz' ? "Login / Foydalanuvchi nomi" : lang === 'ru' ? "Логин администратора" : "Admin Username"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {lang === 'uz' ? "Maxfiy parol" : lang === 'ru' ? "Пароль" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors"
                  title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-400 bg-slate-900 border-slate-700 focus:ring-0"
                />
                <span>{lang === 'uz' ? "Meni eslab qolish" : lang === 'ru' ? "Запомнить меня" : "Remember me"}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm shadow-lg shadow-amber-400/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoggingIn ? (lang === 'uz' ? "Tekshirilmoqda..." : "Проверка...") : (lang === 'uz' ? "Boshqaruv paneliga kirish" : lang === 'ru' ? "Войти в систему" : "Sign In to Dashboard")}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'uz' ? "Standart kirish ma'lumotlari:" : lang === 'ru' ? "Стандартный доступ:" : "Default Credentials:"}
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="Maydonlarni avtomatik to'ldirish"
              >
                <span>⚡️ 1 bosishda to'ldirish</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 flex flex-col">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Login</span>
                <b className="text-amber-300 font-bold select-all">{adminCredentials.username}</b>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 flex flex-col">
                <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Parol</span>
                <b className="text-amber-300 font-bold select-all">{adminCredentials.password}</b>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link
              to="/"
              className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>{lang === 'uz' ? "Do'kon bosh sahifasiga qaytish" : lang === 'ru' ? "Вернуться в интернет-магазин" : "Back to Texnomart Store"}</span>
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center py-2 text-slate-500 text-[11px] z-10">
          Texnomart Enterprise Admin System &bull; Barcha huquqlar himoyalangan
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0d14] text-slate-100 font-sans antialiased">
      
      {/* ================= 1. SIDEBAR (DESKTOP & COLLAPSED) ================= */}
      <aside className={`hidden md:flex flex-col border-r border-slate-800/80 bg-[#0d111a] transition-all duration-300 z-30 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-black shadow-lg shadow-amber-400/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-base tracking-wider text-white flex items-center gap-1.5">
                  TEXNOMART
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-extrabold">PRO</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">Enterprise Admin v3.2</span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-black mx-auto">
              <Store className="w-5 h-5" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={isSidebarCollapsed ? "Kengaytirish" : "Yig'ish"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-black text-amber-400'
                      : item.isPulse
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Storefront Link & Admin Profile */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all border border-slate-700/50 hover:border-amber-400/50 group"
          >
            <ExternalLink className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            {!isSidebarCollapsed && <span>Do'konni ochish (Sayt)</span>}
          </Link>

          {!isSidebarCollapsed && (
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-xs flex items-center justify-center shadow-xs uppercase">
                  {adminCredentials.username.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{adminCredentials.username}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">Super Admin</p>
                </div>
              </div>

              <button
                onClick={handleAdminLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Tizimdan chiqish (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative w-72 bg-[#0d111a] border-r border-slate-800 flex flex-col z-10 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-black">
                  <Store className="w-4 h-4" />
                </div>
                <span className="font-black text-sm text-white">TEXNOMART PRO</span>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-amber-400 text-black font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-black text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Do'konga o'tish</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleAdminLogout();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Tizimdan chiqish (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MAIN VIEWPORT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0d111a]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2 capitalize">
                <span>{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Texnomart boshqaruv paneli &bull; Tezkor operatsiyalar
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Add Product Button */}
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Yangi tovar</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                title="Bildirishnomalar"
              >
                <Bell className="w-4 h-4" />
                {adminNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#121722] border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs text-white">Bildirishnomalar ({adminNotifications.length})</span>
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-amber-400 hover:underline font-semibold"
                    >
                      Barchasini tozalash
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {adminNotifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">Yangi bildirishnomalar yo'q</p>
                    ) : (
                      adminNotifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs space-y-1 relative group">
                          <div className="flex items-center justify-between pr-4">
                            <span className="font-bold text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{n.desc}</p>
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="absolute top-2 right-2 text-slate-500 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Large Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-2xl shadow-inner">
              {[
                { code: 'uz', flag: "🇺🇿", label: "O'zb" },
                { code: 'ru', flag: "🇷🇺", label: "Рус" },
                { code: 'en', flag: "🇬🇧", label: "Eng" },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => changeLang(item.code)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer ${
                    lang === item.code
                      ? 'bg-amber-400 text-black font-black shadow-md scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{item.flag}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Live Storefront Link */}
            <Link
              to="/"
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all hidden lg:flex items-center gap-2 text-xs font-bold"
              title="Do'kon sahifasiga o'tish"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>Saytga o'tish</span>
            </Link>

            {/* Large Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-400/50 text-white font-black text-xs transition-all shadow-xs active:scale-95 group cursor-pointer"
              title={isDark ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
            >
              <div className={`p-1.5 rounded-xl transition-transform group-hover:rotate-12 ${
                isDark ? 'bg-amber-400 text-black shadow-sm' : 'bg-slate-800 text-amber-400'
              }`}>
                {isDark ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 fill-current" />}
              </div>
              <span className="font-extrabold tracking-wide hidden sm:inline">
                {isDark ? "Tungi" : "Kunduzgi"}
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 transition-all active:scale-95 text-xs font-black cursor-pointer shadow-xs"
              title="Tizimdan chiqish (Logout)"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>

        </header>

        {/* ================= 3. SCROLLABLE CONTENT VIEWPORT ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 custom-scrollbar bg-[#0a0d14]">
          
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Revenue */}
                <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/90 shadow-sm space-y-2 relative overflow-hidden group hover:border-amber-400/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami tushum</span>
                    <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {formatPrice(totalRevenue, lang)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+24.5% o'tgan haftaga nisbatan</span>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/5 rounded-full blur-xl group-hover:bg-amber-400/10 transition-all" />
                </div>

                {/* 2. Total Orders */}
                <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/90 shadow-sm space-y-2 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami buyurtmalar</span>
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {totalOrdersCount} ta
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-400 font-bold">
                    <span>O'rtacha chek: {formatPrice(avgOrderValue, lang)}</span>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
                </div>

                {/* 3. Products in stock */}
                <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/90 shadow-sm space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ombordagi tovarlar</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {inStockCount} / {totalProductsCount} ta
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{Math.round((inStockCount / (totalProductsCount || 1)) * 100)}% tovarlar sotuvda</span>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
                </div>

                {/* 4. Total Customers */}
                <div className="p-5 rounded-2xl bg-[#0f141f] border border-slate-800/90 shadow-sm space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faol mijozlar</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {customersList.length} nafar
                  </p>
                  <div className="flex items-center gap-1 text-xs text-purple-400 font-bold">
                    <span>Telegram bot: {tgConfig.chatId ? 'Uланган ✅' : 'Ulanmagan'}</span>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
                </div>

              </div>

              {/* Order Status Shortcut Buttons (Instant Filter & Switch) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'new', label: 'Yangi buyurtmalar', count: orderCounts.new, color: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
                  { id: 'processing', label: 'Jarayonda', count: orderCounts.processing, color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
                  { id: 'delivering', label: 'Yetkazilmoqda', count: orderCounts.delivering, color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
                  { id: 'completed', label: 'Yakunlangan', count: orderCounts.completed, color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
                  { id: 'cancelled', label: 'Bekor qilingan', count: orderCounts.cancelled, color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setOrderStatusFilter(st.id);
                      setActiveTab('orders');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] ${st.color}`}
                  >
                    <span className="block text-[11px] font-bold opacity-80">{st.label}</span>
                    <span className="text-2xl font-black mt-0.5 block">{st.count} ta</span>
                  </button>
                ))}
              </div>

              {/* Monthly Revenue Dynamic Chart & Order Status Donut */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 12 Months Revenue Dynamics (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0f141f] border border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">
                        Oylik savdo tushumlari dinamikasi (2026)
                      </h3>
                      <p className="text-xs text-slate-400">Har oylik xaridlar hajmi statistikasi</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-400/10 rounded-xl border border-amber-400/20">
                      O'sish: +34.2%
                    </span>
                  </div>

                  {/* Dynamic Bar Visual */}
                  <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end h-52 pt-6 pb-2 border-b border-slate-800">
                    {[
                      { month: 'Yan', height: '45%', amount: '18M' },
                      { month: 'Fev', height: '55%', amount: '22M' },
                      { month: 'Mar', height: '68%', amount: '31M' },
                      { month: 'Apr', height: '52%', amount: '24M' },
                      { month: 'May', height: '72%', amount: '36M' },
                      { month: 'Iyun', height: '88%', amount: '45M' },
                      { month: 'Iyul', height: '80%', amount: '41M' },
                      { month: 'Avg', height: '92%', amount: '48M' },
                      { month: 'Sen', height: '100%', amount: '56M', highlight: true },
                      { month: 'Okt', height: '75%', amount: '38M' },
                      { month: 'Noy', height: '82%', amount: '43M' },
                      { month: 'Dek', height: '95%', amount: '52M' }
                    ].map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group relative cursor-pointer">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[10px] text-amber-400 font-bold px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none whitespace-nowrap">
                          {b.amount}
                        </div>
                        <div
                          style={{ height: b.height }}
                          className={`w-full rounded-t-lg transition-all duration-300 group-hover:scale-y-105 ${
                            b.highlight
                              ? 'bg-gradient-to-t from-amber-500 to-yellow-300 shadow-lg shadow-amber-400/30'
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-slate-400">{b.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>Boshlang'ich: Yanvar 2026</span>
                    <span className="text-amber-400 font-bold">Eng yuqori oy: Sentabr (56 000 000 so'm)</span>
                  </div>
                </div>

                {/* Categories Breakdown (4 cols) */}
                <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0f141f] border border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">
                        Kategoriyalar ulushi
                      </h3>
                      <p className="text-xs text-slate-400">Tovarlar toifalari bo'yicha</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{products.length} ta tovar</span>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {categoryBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-200">{item.name}</span>
                          <span className="text-slate-400 font-mono">{item.count} ta ({item.percent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${item.percent}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0 ? 'bg-amber-400' :
                              idx === 1 ? 'bg-blue-500' :
                              idx === 2 ? 'bg-purple-500' :
                              idx === 3 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Orders Table */}
              <div className="p-6 rounded-3xl bg-[#0f141f] border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      So'nggi kelib tushgan buyurtmalar
                    </h3>
                    <p className="text-xs text-slate-400">Do'konga tushgan eng yangi buyurtmalar ro'yxati</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Barcha buyurtmalar ({orders.length})</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0b0e17] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">ID</th>
                        <th className="p-3.5">Mijoz</th>
                        <th className="p-3.5">Telefon</th>
                        <th className="p-3.5">Summa</th>
                        <th className="p-3.5">Holati</th>
                        <th className="p-3.5 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {orders.slice(0, 5).map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-amber-400">#{ord.id}</td>
                          <td className="p-3.5 font-semibold text-white">{ord.customerName}</td>
                          <td className="p-3.5 font-mono text-slate-400">{ord.phone}</td>
                          <td className="p-3.5 font-black text-white">{formatPrice(ord.totalAmount, lang)}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              ord.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              ord.status === 'delivering' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              ord.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {ord.status === 'completed' ? 'Yakunlangan' :
                               ord.status === 'processing' ? 'Jarayonda' :
                               ord.status === 'delivering' ? 'Yetkazilmoqda' :
                               ord.status === 'cancelled' ? 'Bekor qilingan' : 'Yangi'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(ord);
                                setIsInvoiceModalOpen(true);
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-amber-400 hover:text-black font-bold text-xs rounded-lg transition-colors"
                            >
                              Ko'rish & Chek
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Product Filters & Actions Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0f141f] p-4 rounded-2xl border border-slate-800 shadow-sm">
                
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductPage(1);
                    }}
                    placeholder="Nomi, ID yoki brend bo'yicha..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => {
                      setProductCategoryFilter(e.target.value);
                      setProductPage(1);
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Barcha toifalar</option>
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{t(c.nameKey)}</option>
                    ))}
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => {
                      setProductStockFilter(e.target.value);
                      setProductPage(1);
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">Barcha holatlar</option>
                    <option value="inStock">Omborda bor</option>
                    <option value="outOfStock">Tugaganlar</option>
                  </select>

                  <select
                    value={productSort}
                    onChange={(e) => setProductSort(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="newest">Yangi qo'shilganlar</option>
                    <option value="price-asc">Narx: arzon &rarr; qimmat</option>
                    <option value="price-desc">Narx: qimmat &rarr; arzon</option>
                    <option value="name">Nomi (A-Z)</option>
                  </select>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportProductsJSON}
                    className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300"
                    title="JSON formatda yuklab olish"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={resetProductsToDefault}
                    className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all border border-slate-700"
                    title="Barcha boshlang'ich tovarlarni qayta tiklash"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Katalogni tiklash</span>
                  </button>

                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Yangi tovar</span>
                  </button>
                </div>

              </div>

              {/* Bulk Actions Floating Bar (When items selected) */}
              {selectedProductIds.length > 0 && (
                <div className="flex items-center justify-between bg-amber-400/10 border border-amber-400/30 p-3 rounded-2xl animate-in fade-in">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    <span>{selectedProductIds.length} ta tovar tanlandi</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkToggleStock(true)}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40"
                    >
                      Mavjud qilish
                    </button>
                    <button
                      onClick={() => handleBulkToggleStock(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                    >
                      Tugadi qilish
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/40 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-[#0f141f] rounded-2xl border border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0e17] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                          onChange={handleSelectAllProducts}
                          className="rounded text-amber-400 focus:ring-0 bg-slate-900 border-slate-700"
                        />
                      </th>
                      <th className="p-4">Mahsulot</th>
                      <th className="p-4">Kategoriya & Brend</th>
                      <th className="p-4">Narxi & Muddatli to'lov</th>
                      <th className="p-4">Teglar</th>
                      <th className="p-4">Ombor holati</th>
                      <th className="p-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {paginatedProducts.map(p => {
                      const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
                      const monthly = calculateMonthly(p.price, 24);
                      const isSelected = selectedProductIds.includes(p.id);

                      return (
                        <tr key={p.id} className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-amber-400/5' : ''}`}>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectProduct(p.id)}
                              className="rounded text-amber-400 focus:ring-0 bg-slate-900 border-slate-700"
                            />
                          </td>

                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={title}
                              className="w-12 h-12 object-contain rounded-xl bg-slate-900 p-1 shrink-0 border border-slate-800"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = presetImages[0].url;
                              }}
                            />
                            <div className="max-w-xs">
                              <p className="font-bold text-white line-clamp-1">{title}</p>
                              <span className="text-[10px] text-slate-500 font-mono">ID: #{p.id}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-slate-200 block">{p.brand}</span>
                            <span className="text-[11px] text-slate-400 capitalize">{p.category}</span>
                          </td>

                          <td className="p-4">
                            <span className="font-black text-white block">
                              {formatPrice(p.price, lang)}
                            </span>
                            <span className="text-[10px] text-amber-400 font-semibold">
                              ~{formatPrice(monthly, lang)}/oy
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {p.isHit && <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[9px] border border-amber-400/30">HIT</span>}
                              {p.isNew && <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[9px] border border-blue-500/30">NEW</span>}
                              {p.isDealOfTheDay && <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px] border border-rose-500/30">AKSIYA</span>}
                            </div>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => toggleProductStock(p.id)}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                                p.inStock
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-400'
                                  : 'bg-slate-800 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400'
                              }`}
                              title="Holatni almashtirish uchun bosing"
                            >
                              {p.inStock ? "✓ Omborda bor" : "✕ Tugagan"}
                            </button>
                          </td>

                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => duplicateProduct(p.id)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-black transition-colors text-slate-300"
                              title="Nusxa ko'chirish"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-black transition-colors text-slate-300"
                              title="Tahrirlash"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white transition-colors text-slate-300"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between pt-2 px-1">
                <span className="text-xs text-slate-400">
                  Ko'rsatildi: <b>{paginatedProducts.length}</b> / <b>{filteredProducts.length}</b> ta tovar (Sahifa {productPage} / {totalProductPages})
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={productPage <= 1}
                    onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalProductPages }, (_, i) => i + 1).slice(0, 5).map(pg => (
                    <button
                      key={pg}
                      onClick={() => setProductPage(pg)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        productPage === pg
                          ? 'bg-amber-400 text-black font-extrabold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    disabled={productPage >= totalProductPages}
                    onClick={() => setProductPage(prev => Math.min(totalProductPages, prev + 1))}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Order Status Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f141f] p-4 rounded-2xl border border-slate-800 shadow-sm">
                
                {/* Status Badges */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: 'all', label: `Barchasi (${orderCounts.all})` },
                    { id: 'new', label: `Yangi (${orderCounts.new})` },
                    { id: 'processing', label: `Jarayonda (${orderCounts.processing})` },
                    { id: 'delivering', label: `Yetkazilmoqda (${orderCounts.delivering})` },
                    { id: 'completed', label: `Yakunlangan (${orderCounts.completed})` },
                    { id: 'cancelled', label: `Bekor qilingan (${orderCounts.cancelled})` }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setOrderStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        orderStatusFilter === st.id
                          ? 'bg-amber-400 text-black font-extrabold shadow-sm'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Search & CSV Export */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="ID, ism yoki telefon..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-700"
                    title="Buyurtmalar CSV fayli"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                </div>

              </div>

              {/* Orders Table */}
              <div className="bg-[#0f141f] rounded-2xl border border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0e17] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Buyurtma №</th>
                      <th className="p-4">Mijoz</th>
                      <th className="p-4">Manzil & To'lov</th>
                      <th className="p-4">Mahsulotlar</th>
                      <th className="p-4">Jami summa</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-sm text-white block">
                            #{ord.id}
                          </span>
                          <span className="text-[10px] text-slate-400">{ord.date}</span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-white block">{ord.customerName}</span>
                          <a href={`tel:${ord.phone}`} className="font-mono text-amber-400 hover:underline">
                            {ord.phone}
                          </a>
                        </td>

                        <td className="p-4">
                          <span className="block text-slate-300 max-w-[180px] truncate">{ord.address}</span>
                          <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-[10px] uppercase font-bold text-amber-400 mt-0.5">
                            {ord.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4 max-w-xs">
                          {ord.items.map((it, i) => {
                            const itemTitle = typeof it.title === 'object' ? (it.title[lang] || it.title.uz) : it.title;
                            return (
                              <div key={i} className="truncate text-slate-400">
                                • {it.quantity}x {itemTitle}
                              </div>
                            );
                          })}
                        </td>

                        <td className="p-4 font-black text-base text-white">
                          {formatPrice(ord.totalAmount, lang)}
                        </td>

                        {/* Interactive Status Selector */}
                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : ord.status === 'processing'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : ord.status === 'delivering'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            <option value="new">Yangi</option>
                            <option value="processing">Jarayonda</option>
                            <option value="delivering">Yetkazilmoqda</option>
                            <option value="completed">Yakunlangan</option>
                            <option value="cancelled">Bekor qilingan</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedOrderDetails(ord);
                              setIsInvoiceModalOpen(true);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-black text-slate-300 transition-colors"
                            title="Batafsil ma'lumot & Rasmiy Chek"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleResendOrderToTelegram(ord)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-blue-500 hover:text-white text-slate-300 transition-colors"
                            title="Telegram botga jo'natish"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Buyurtma #${ord.id} ni o'chirmoqchimisiz?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= TAB 4: CUSTOMERS CRM ================= */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f141f] p-4 rounded-2xl border border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    Mijozlar bazasi (CRM)
                  </h3>
                  <p className="text-xs text-slate-400">Do'kondan xarid qilgan barcha mijozlar tarixi va sadoqat darajasi</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Ism yoki telefon qidirish..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-[#0f141f] rounded-2xl border border-slate-800 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b0e17] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Mijoz</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Manzil</th>
                      <th className="p-4">Buyurtmalar</th>
                      <th className="p-4">Jami xarid</th>
                      <th className="p-4">Darajasi</th>
                      <th className="p-4 text-right">Aloqa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredCustomers.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-white block text-sm">{c.name}</span>
                          <span className="text-[10px] text-slate-500">So'nggi buyurtma: {c.lastOrderDate}</span>
                        </td>
                        <td className="p-4 font-mono text-amber-400 font-bold">{c.phone}</td>
                        <td className="p-4 text-slate-300 max-w-xs truncate">{c.address}</td>
                        <td className="p-4 font-bold text-slate-200">{c.ordersCount} ta</td>
                        <td className="p-4 font-black text-white">{formatPrice(c.totalSpent, lang)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            c.status === 'VIP'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : c.status === 'Doimiy'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Qo'ng'iroq</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= TAB 5: BANNERS MANAGEMENT ================= */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-black text-lg text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Bosh sahifa karusel slaydlari (Hero Banners)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Do'kon bosh sahifasida aylanuvchi barcha aksiya va chegirma bannerlari
                  </p>
                </div>

                <button
                  onClick={() => setIsBannerModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-2 shadow-md shadow-amber-400/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Yangi banner qo'shish</span>
                </button>
              </div>

              {/* Banners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map(b => (
                  <div
                    key={b.id}
                    className="p-5 rounded-3xl bg-[#0f141f] border border-slate-800 flex flex-col justify-between space-y-4 relative group hover:border-amber-400/40 transition-all shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase">
                          {b.badge || 'AKSIYA'}
                        </span>
                        <button
                          onClick={() => toggleBanner(b.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {b.active ? "✓ Faol" : "✕ O'chirilgan"}
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <img
                          src={b.image}
                          alt={b.titleUz}
                          className="w-20 h-20 object-contain rounded-xl bg-slate-900 p-1 shrink-0 border border-slate-800"
                        />
                        <div>
                          <h4 className="font-extrabold text-white text-sm line-clamp-1">{b.titleUz}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{b.subtitleUz}</p>
                          <span className="text-[11px] text-amber-400 font-bold block mt-1">
                            Oyiga: {b.monthly} so'm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Havola: {b.link}</span>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ================= TAB 6: PROMOS MANAGEMENT ================= */}
          {activeTab === 'promos' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-black text-lg text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-400" />
                    Chegirma Promokodlari
                  </h3>
                  <p className="text-xs text-slate-400">Xaridorlar savatchada qo'llashi mumkin bo'lgan barcha chegirma kodlari</p>
                </div>

                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-2 shadow-md shadow-amber-400/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Yangi promokod</span>
                </button>
              </div>

              {/* Promo Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {promoCodes.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-5 rounded-3xl bg-[#0f141f] border border-slate-800 shadow-sm space-y-3 relative group hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-base px-3 py-1 rounded-xl bg-amber-400 text-black shadow-xs">
                        {pr.code}
                      </span>
                      <button
                        onClick={() => togglePromoCode(pr.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pr.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {pr.active ? "Faol" : "Nofaol"}
                      </button>
                    </div>

                    <div>
                      <p className="font-extrabold text-lg text-white">
                        {pr.type === 'percent' ? `${pr.value}% Chegirma` : `${new Intl.NumberFormat('ru-RU').format(pr.value)} so'm`}
                      </p>
                      <p className="text-xs text-slate-400">{pr.desc}</p>
                      {pr.minOrder > 0 && (
                        <span className="text-[11px] text-amber-400/90 font-mono block mt-1">
                          Min. xarid: {new Intl.NumberFormat('ru-RU').format(pr.minOrder)} so'm
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(pr.code);
                          showToast(`Promokod nusxalandi: ${pr.code}`, 'success');
                        }}
                        className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nusxa olish</span>
                      </button>

                      <button
                        onClick={() => deletePromoCode(pr.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ================= TAB 7: TELEGRAM BOT SETTINGS ================= */}
          {activeTab === 'telegram' && (
            <div className="max-w-3xl bg-[#0f141f] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-400 text-black rounded-2xl shadow-lg shadow-amber-400/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">
                      Telegram Bot Integratsiyasi
                    </h3>
                    <p className="text-xs text-slate-400">
                      Har bir yangi buyurtma avtomatik Telegram guruhingizga tushadi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{tgConfig.botToken ? "Faol (Online)" : "Kutilmoqda"}</span>
                </div>
              </div>

              {/* Instructions Card */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Ulanayotgan Bot:</span>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-amber-400 text-black">
                      @{tgConfig.botUsername || 'orifxojabot'}
                    </span>
                  </div>
                  <a
                    href={`https://t.me/${tgConfig.botUsername || 'orifxojabot'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-300 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Telegramda ochish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1. Telegramda <a href={`https://t.me/${tgConfig.botUsername || 'orifxojabot'}`} target="_blank" rel="noreferrer" className="font-bold underline text-amber-400">@{tgConfig.botUsername || 'orifxojabot'}</a> ga kiring va <b>/start</b> deb yozing.<br />
                  2. So'ng quyidagi <b>"Chat ID ni avtomatik aniqlash"</b> tugmasini bosing — bot avtomatik ulanadi!
                </p>
              </div>

              <form onSubmit={handleSaveTelegramConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Telegram Bot Token
                  </label>
                  <input
                    type="text"
                    value={tgConfig.botToken}
                    onChange={(e) => setTgConfig({ ...tgConfig, botToken: e.target.value })}
                    placeholder="8690944939:AAFAoy4ubx52L3BK..."
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Telegramda @BotFather orqali yaratilgan botingiz API tokeni.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Telegram Chat ID (yoki Guruh ID)
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoDetectChatId}
                      disabled={detectingChat}
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>{detectingChat ? "Qidirilmoqda..." : "⚡️ Chat ID ni avtomatik aniqlash"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={tgConfig.chatId}
                    onChange={(e) => setTgConfig({ ...tgConfig, chatId: e.target.value })}
                    placeholder="-1001928374829 yoki 54918239"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Sizning shaxsiy Chat ID yoki Telegram guruhingiz ID si (yuqoridagi tugma orqali avtomatik topsa bo'ladi).
                  </span>
                </div>

                {/* Submit & Test Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sozlamalarni saqlash</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTestTelegram}
                    disabled={testSending}
                    className="px-6 py-3 bg-slate-800 text-white hover:bg-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{testSending ? 'Yuborilmoqda...' : 'Test xabar jo\'natish'}</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* ================= TAB 8: SYSTEM SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-[#0f141f] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-black text-lg text-white">Do'kon Tizim Sozlamalari</h3>
                <p className="text-xs text-slate-400">Texnomart platformasi asosiy parametrlari</p>
              </div>

              <div className="space-y-4">
                {/* Admin Login & Password Security Management */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        Admin Login va Parolini o'zgartirish
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Boshqaruv paneliga kirish ma'lumotlarini yangilang
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                      Hozirgi login: <b className="text-amber-400">{adminCredentials.username}</b>
                    </span>
                  </div>

                  <form onSubmit={handleChangeCredentials} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Yangi Login / Foydalanuvchi nomi
                      </label>
                      <input
                        type="text"
                        required
                        value={changeUsernameInput}
                        onChange={(e) => setChangeUsernameInput(e.target.value)}
                        placeholder={adminCredentials.username}
                        className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Yangi Parol
                        </label>
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Parolni tasdiqlang
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        O'zgartirilgandan so'ng yangi login/parol bilan kirasiz.
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl shadow-md shadow-amber-400/20 transition-all active:scale-95"
                      >
                        Yangi ma'lumotlarni saqlash
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Katalogni tiklash</span>
                    <span className="text-[11px] text-slate-400">Barcha tovarlarni asl nusxasiga qaytarish</span>
                  </div>
                  <button
                    onClick={resetProductsToDefault}
                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/40"
                  >
                    Katalogni qayta tiklash
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Tovarlar zaxirasini yuklab olish</span>
                    <span className="text-[11px] text-slate-400">JSON formatda to'liq backup fayl</span>
                  </div>
                  <button
                    onClick={handleExportProductsJSON}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                  >
                    JSON yuklash
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ================= MODAL 1: PRODUCT ADD / EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121722] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                {editingProductId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 mt-6">
              
              {/* Product Titles */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Mahsulot nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.titleUz}
                  onChange={(e) => setProductForm({ ...productForm, titleUz: e.target.value })}
                  placeholder="Apple iPhone 16 Pro Max 256GB Desert Titanium..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomi (Русский)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleRu}
                    onChange={(e) => setProductForm({ ...productForm, titleRu: e.target.value })}
                    placeholder="Смартфон Apple iPhone 16 Pro..."
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nomi (English)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    placeholder="Apple iPhone 16 Pro..."
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{t(c.nameKey)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Brend
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Apple, Samsung, Artel..."
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="17499000"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Eski narxi (chegirma uchun)
                  </label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="18999000"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Badges / Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isHit}
                    onChange={(e) => setProductForm({ ...productForm, isHit: e.target.checked })}
                    className="rounded text-amber-400 bg-slate-900 border-slate-700"
                  />
                  <span>🔥 HIT tovar</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="rounded text-blue-500 bg-slate-900 border-slate-700"
                  />
                  <span>⚡️ Yangi (NEW)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDealOfTheDay}
                    onChange={(e) => setProductForm({ ...productForm, isDealOfTheDay: e.target.checked })}
                    className="rounded text-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span>🎁 Kunning taklifi</span>
                </label>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Rasm havolasi (URL)
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-white"
                />

                {/* Presets */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-slate-500 font-semibold">Tezkor namunalar:</span>
                  {presetImages.map((pr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: pr.url })}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-400 hover:text-black font-semibold"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Xususiyatlari (Kalit: Qiymat)
                </label>
                <textarea
                  rows="3"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Ekran: 6.9 OLED&#10;Batareya: 4685 mAh&#10;Kafolat: 1 yil"
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-xs shadow-md shadow-amber-400/20 active:scale-95 transition-all"
                >
                  Saqlash
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL 2: OFFICIAL PRINTABLE INVOICE / CHEK ================= */}
      {isInvoiceModalOpen && selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black">
                  T
                </span>
                <div>
                  <h3 className="text-base font-black tracking-tight">TEXNOMART DO'KONI</h3>
                  <span className="text-[10px] text-gray-500 font-mono">Rasmiy xarid kvitansiyasi</span>
                </div>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Header Details */}
            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-gray-50 border border-gray-200">
              <div>
                <span className="text-gray-500 block">Buyurtma №:</span>
                <span className="font-mono font-black text-sm">#{selectedOrderDetails.id}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Sana & Vaqt:</span>
                <span className="font-semibold">{selectedOrderDetails.date}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Xaridor:</span>
                <span className="font-bold">{selectedOrderDetails.customerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Telefon:</span>
                <span className="font-mono font-bold">{selectedOrderDetails.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block">Yetkazish manzili:</span>
                <span className="font-medium">{selectedOrderDetails.address}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Xarid qilingan tovarlar:</h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs">
                {selectedOrderDetails.items.map((it, idx) => {
                  const title = typeof it.title === 'object' ? (it.title[lang] || it.title.uz) : it.title;
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">{title}</p>
                        <p className="text-[11px] text-gray-500">{it.quantity} x {formatPrice(it.price, 'uz')}</p>
                      </div>
                      <span className="font-black font-mono">
                        {formatPrice(it.price * it.quantity, 'uz')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total and Stamp */}
            <div className="flex justify-between items-baseline pt-4 border-t border-gray-200">
              <div>
                <span className="text-xs text-gray-500 block">To'lov usuli: <b>{selectedOrderDetails.paymentMethod?.toUpperCase()}</b></span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ To'lov tasdiqlangan</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Jami summa:</span>
                <span className="text-2xl font-black text-black">
                  {formatPrice(selectedOrderDetails.totalAmount, 'uz')}
                </span>
              </div>
            </div>

            {/* Barcode & Print Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Chekni chop etish (Print)</span>
              </button>

              <button
                onClick={() => handleResendOrderToTelegram(selectedOrderDetails)}
                className="py-3 px-5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Telegramga</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= MODAL 3: BANNER ADD MODAL ================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121722] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Yangi Aksiya Banneri
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBannerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Banner Sarlavhasi (O'zbekcha) *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.titleUz}
                  onChange={(e) => setBannerForm({ ...bannerForm, titleUz: e.target.value })}
                  placeholder="iPhone 16 Pro Max Aksiya..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Qisqacha tavsif (Subtitle)</label>
                <input
                  type="text"
                  value={bannerForm.subtitleUz}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitleUz: e.target.value })}
                  placeholder="0% Boshlang'ich to'lov bilan 24 oyga..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge matni</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="YANGI AKSIYA"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Oyiga to'lov</label>
                  <input
                    type="text"
                    value={bannerForm.monthly}
                    onChange={(e) => setBannerForm({ ...bannerForm, monthly: e.target.value })}
                    placeholder="729 000"
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Rasm havolasi (URL)</label>
                <input
                  type="url"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-black font-black"
                >
                  Banner qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PROMO CODE ADD MODAL ================= */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121722] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                Yangi Promokod Yaratish
              </h3>
              <button onClick={() => setIsPromoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPromoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Promokod Kodi *</label>
                <input
                  type="text"
                  required
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  placeholder="BAHOR2026"
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono uppercase font-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Chegirma turi</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) => setPromoForm({ ...promoForm, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-semibold"
                  >
                    <option value="percent">Foizli (%)</option>
                    <option value="fixed">Fiksirlangan (so'm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Miqdori *</label>
                  <input
                    type="number"
                    required
                    value={promoForm.value}
                    onChange={(e) => setPromoForm({ ...promoForm, value: e.target.value })}
                    placeholder={promoForm.type === 'percent' ? "15" : "100000"}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Minimal xarid summasi (so'm)</label>
                <input
                  type="number"
                  value={promoForm.minOrder}
                  onChange={(e) => setPromoForm({ ...promoForm, minOrder: e.target.value })}
                  placeholder="500000"
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tavsif</label>
                <input
                  type="text"
                  value={promoForm.desc}
                  onChange={(e) => setPromoForm({ ...promoForm, desc: e.target.value })}
                  placeholder="Maxsus bahorgi aksiya uchun..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-black font-black"
                >
                  Promokod yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminPage;
