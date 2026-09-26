import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice, calculateMonthly } from '../utils/formatters';
import { categories } from '../data/categories';
import {
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage,
  formatOrderForTelegram
} from '../utils/telegram';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
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
  Sparkles,
  DollarSign,
  Clock,
  ShieldCheck,
  Check,
  Flame
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
    orders,
    updateOrderStatus,
    deleteOrder,
    t,
    lang,
    showToast
  } = useApp();

  // Active Main Tab: 'dashboard' | 'products' | 'orders' | 'promos' | 'telegram'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Products Management Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all' | 'inStock' | 'outOfStock'
  const [productSort, setProductSort] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc' | 'name'

  // Orders Management Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

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

  // Telegram Config State
  const [tgConfig, setTgConfig] = useState(getTelegramConfig());
  const [testSending, setTestSending] = useState(false);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
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

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
      const matchesSearch = title.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.brand.toLowerCase().includes(productSearch.toLowerCase());
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

  // Preset Sample Images for fast creation
  const presetImages = [
    { label: 'iPhone', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
    { label: 'Samsung', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80' },
    { label: 'MacBook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
    { label: 'TV', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80' },
    { label: 'Muzlatgich', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Watch', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80' }
  ];

  // Open Add Product Modal
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

  // Open Edit Product Modal
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

  // Save Add/Edit Product
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.titleUz || !productForm.price) {
      alert("Iltimos, mahsulot nomi va narxini to'ldiring!");
      return;
    }

    // Parse specs
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

  // Delete product with confirm
  const handleDeleteProduct = (id) => {
    if (window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      deleteProduct(id);
    }
  };

  // Save Telegram Config
  const handleSaveTelegramConfig = (e) => {
    e.preventDefault();
    saveTelegramConfig(tgConfig);
    showToast("Telegram sozlamalari saqlandi!");
  };

  // Send Test Telegram Message
  const handleSendTestTelegram = async () => {
    setTestSending(true);
    const testMessage = `
🔔 <b>TEXNOMART TEST BILDIRISHNOMASI</b>
━━━━━━━━━━━━━━━━━━━
Sizning Telegram botingiz muvaffaqiyatli ulandi!
Vaqt: ${new Date().toLocaleString('uz-UZ')}
Status: Ishlamoqda ✅
Do'kon tovarlari: ${products.length} ta
Jami buyurtmalar: ${orders.length} ta
    `;
    const res = await sendTelegramMessage(testMessage, tgConfig);
    setTestSending(false);

    if (res.success) {
      showToast("Telegram botga test xabari yuborildi!", 'success');
    } else {
      showToast(res.message || "Telegramga jo'natib bo'lmadi. Token yoki Chat ID ni tekshiring.", 'error');
    }
  };

  // Resend specific order to Telegram
  const handleResendOrderToTelegram = async (order) => {
    const text = formatOrderForTelegram(order);
    const res = await sendTelegramMessage(text, tgConfig);
    if (res.success) {
      showToast(`Buyurtma #${order.id} Telegramga yuborildi!`, 'success');
    } else {
      showToast(res.message || "Xatolik yuz berdi", 'error');
    }
  };

  // Export Products to JSON
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ================= ADMIN TOP NAVIGATION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-9 bg-primary rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {t('adminDashboard')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400 text-black">
              PRO v2.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Texnomart boshqaruv markazi: Mahsulotlar, Buyurtmalar, Tahlillar va Telegram Bot
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Mahsulotlar ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buyurtmalar ({orders.length})</span>
            {orderCounts.new > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'promos'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promokodlar</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Telegram Bot</span>
            <span className={`w-2 h-2 rounded-full ${tgConfig.botToken ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* ================= TAB 1: DASHBOARD & ANALYTICS ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('totalRevenue')}</span>
                <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {formatPrice(totalRevenue, lang)}
              </p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% o'tgan haftaga nisbatan</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('totalOrders')}</span>
                <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {totalOrdersCount} ta
              </p>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>O'rtacha chek: {formatPrice(avgOrderValue, lang)}</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('totalProducts')}</span>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {totalProductsCount} ta
              </p>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{inStockCount} ta sotuvda mavjud</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telegram Status</span>
                <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${tgConfig.botToken ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {tgConfig.botToken ? "Faol (Online)" : "Ulanmagan"}
              </p>
              <div className="text-xs text-gray-400">
                {tgConfig.chatId ? `Chat: ${tgConfig.chatId}` : "ID kiritilmagan"}
              </div>
            </div>
          </div>

          {/* Quick Order Status Cards (Click to filter) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'new', label: 'Yangi buyurtmalar', count: orderCounts.new, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300' },
              { id: 'processing', label: 'Jarayonda', count: orderCounts.processing, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-300' },
              { id: 'delivering', label: 'Yetkazilmoqda', count: orderCounts.delivering, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-300' },
              { id: 'completed', label: 'Yakunlangan', count: orderCounts.completed, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' },
              { id: 'cancelled', label: 'Bekor qilingan', count: orderCounts.cancelled, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-300' },
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
                <span className="text-2xl font-black">{st.count} ta</span>
              </button>
            ))}
          </div>

          {/* Monthly Revenue Chart Simulation */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  Oylik savdo tushumlari tahlili (2026)
                </h3>
                <p className="text-xs text-gray-400">Har oylik xaridlar hajmi dinamikasi</p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
                Yillik o'sish: +34%
              </span>
            </div>

            {/* Simulated Bar Visual */}
            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end h-44 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
              {[
                { month: 'Yan', height: '40%' },
                { month: 'Fev', height: '52%' },
                { month: 'Mar', height: '65%' },
                { month: 'Apr', height: '48%' },
                { month: 'May', height: '70%' },
                { month: 'Iyun', height: '85%' },
                { month: 'Iyul', height: '78%' },
                { month: 'Avg', height: '90%' },
                { month: 'Sen', height: '100%', highlight: true },
                { month: 'Okt', height: '72%' },
                { month: 'Noy', height: '80%' },
                { month: 'Dek', height: '95%' }
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div
                    style={{ height: b.height }}
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                      b.highlight ? 'bg-primary shadow-md shadow-amber-500/30' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-gray-400">{b.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Nomi yoki brend bo'yicha..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="all">Barcha toifalar</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{t(c.nameKey)}</option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={productStockFilter}
                onChange={(e) => setProductStockFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="all">Barcha holatlar</option>
                <option value="inStock">Faqat omborda bor</option>
                <option value="outOfStock">Tugaganlar</option>
              </select>

              {/* Sort Selector */}
              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="newest">Yangi qo'shilganlar</option>
                <option value="price-asc">Narx: arzon &rarr; qimmat</option>
                <option value="price-desc">Narx: qimmat &rarr; arzon</option>
                <option value="name">Nomi bo'yicha (A-Z)</option>
              </select>
            </div>

            {/* Action Buttons: Add, Reset, Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportProductsJSON}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 text-gray-700 dark:text-gray-300"
                title="JSON formatda eksport qilish"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={resetProductsToDefault}
                className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                title="Barcha boshlang'ich tovarlarni qayta tiklash"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Qayta tiklash</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t('addProduct')}</span>
              </button>
            </div>

          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4">Tovar</th>
                  <th className="p-4">Kategoriya & Brend</th>
                  <th className="p-4">Narxi & Muddatli</th>
                  <th className="p-4">Teglar</th>
                  <th className="p-4">Ombor holati</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredProducts.map((p) => {
                  const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
                  const monthly = calculateMonthly(p.price, 24);
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={title}
                          className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-gray-800 p-1 flex-shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{title}</p>
                          <span className="text-[10px] text-gray-400 font-mono">ID: #{p.id}</span>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="p-4">
                        <span className="font-bold text-gray-800 dark:text-gray-200 block">{p.brand}</span>
                        <span className="text-[11px] text-gray-400 capitalize">{p.category}</span>
                      </td>

                      {/* Price & Monthly */}
                      <td className="p-4">
                        <span className="font-extrabold text-gray-900 dark:text-white block">
                          {formatPrice(p.price, lang)}
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                          ~{formatPrice(monthly, lang)}/oy
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isHit && <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">HIT</span>}
                          {p.isNew && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[9px]">NEW</span>}
                          {p.isDealOfTheDay && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[9px]">AKSIYA</span>}
                        </div>
                      </td>

                      {/* In Stock Inline Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleProductStock(p.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.inStock
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-rose-100 hover:text-rose-700'
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                          title="Holatni almashtirish uchun bosing"
                        >
                          {p.inStock ? "✓ Mavjud" : "✕ Tugagan"}
                        </button>
                      </td>

                      {/* Action Buttons: Duplicate, Edit, Delete */}
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 hover:text-amber-700 transition-colors text-gray-600 dark:text-gray-300"
                          title="Nusxa olish"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 hover:text-amber-700 transition-colors text-gray-600 dark:text-gray-300"
                          title="Tahrirlash"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-100 hover:text-rose-700 transition-colors text-gray-600 dark:text-gray-300"
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

          <div className="text-xs text-gray-400 text-right pr-2">
            Jami ko'rsatildi: {filteredProducts.length} ta mahsulot
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Order Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {/* Status Filter Tabs */}
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
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Search by Order ID or Phone */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="ID, ism yoki telefon..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4">Buyurtma №</th>
                  <th className="p-4">Mijoz</th>
                  <th className="p-4">Manzil & To'lov</th>
                  <th className="p-4">Mahsulotlar</th>
                  <th className="p-4">Jami</th>
                  <th className="p-4">Holat</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-black text-sm text-gray-900 dark:text-white block">
                        #{ord.id}
                      </span>
                      <span className="text-[10px] text-gray-400">{ord.date}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-gray-900 dark:text-white block">{ord.customerName}</span>
                      <a href={`tel:${ord.phone}`} className="font-mono text-amber-600 dark:text-amber-400 hover:underline">
                        {ord.phone}
                      </a>
                    </td>

                    <td className="p-4">
                      <span className="block text-gray-700 dark:text-gray-300 max-w-[180px] truncate">{ord.address}</span>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] uppercase font-bold text-amber-600">
                        {ord.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      {ord.items.map((it, i) => {
                        const itemTitle = typeof it.title === 'object' ? (it.title[lang] || it.title.uz) : it.title;
                        return (
                          <div key={i} className="truncate text-gray-600 dark:text-gray-400">
                            • {it.quantity}x {itemTitle}
                          </div>
                        );
                      })}
                    </td>

                    <td className="p-4 font-black text-base text-gray-900 dark:text-white">
                      {formatPrice(ord.totalAmount, lang)}
                    </td>

                    {/* Status Changer */}
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                          ord.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40'
                            : ord.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40'
                            : ord.status === 'delivering'
                            ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40'
                        }`}
                      >
                        <option value="new">Yangi</option>
                        <option value="processing">Jarayonda</option>
                        <option value="delivering">Yetkazilmoqda</option>
                        <option value="completed">Yakunlangan</option>
                        <option value="cancelled">Bekor qilingan</option>
                      </select>
                    </td>

                    {/* Actions: View Details, Telegram Resend, Delete */}
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 hover:text-amber-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Batafsil ma'lumot"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleResendOrderToTelegram(ord)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 hover:text-blue-700 text-gray-600 dark:text-gray-300 transition-colors"
                        title="Telegramga qayta jo'natish"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Buyurtma #${ord.id} ni o'chirmoqchimisiz?`)) {
                            deleteOrder(ord.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-rose-100 hover:text-rose-700 text-gray-600 dark:text-gray-300 transition-colors"
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

      {/* ================= TAB 4: PROMO CODES MANAGEMENT ================= */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-500" />
                Faol Promokodlar
              </h3>
              <p className="text-xs text-gray-400">Xaridorlar savatda qo'llashi mumkin bo'lgan chegirma kodlari</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { code: 'TEXNO2026', discount: '10% Chegirma', desc: 'Barcha tovarlar uchun', type: 'Foizli', active: true },
              { code: 'TEXNOMART', discount: '15% Chegirma', desc: 'Maxsus yozgi aksiya', type: 'Foizli', active: true },
              { code: 'YANGI', discount: '100 000 so\'m', desc: 'Birinchi xarid uchun', type: 'Fiksirlangan', active: true },
              { code: 'SUPER', discount: '20% Chegirma', desc: 'Katta buyurtmalar uchun', type: 'VIP', active: true },
            ].map((pr, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-amber-300 dark:border-amber-700/60 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base px-3 py-1 rounded-xl bg-amber-400 text-black">
                    {pr.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
                <div>
                  <p className="font-extrabold text-lg text-gray-900 dark:text-white">{pr.discount}</p>
                  <p className="text-xs text-gray-400">{pr.desc}</p>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex justify-between">
                  <span>Turi: {pr.type}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(pr.code);
                      showToast(`Promokod nusxalandi: ${pr.code}`);
                    }}
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Nusxa olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: TELEGRAM BOT SETTINGS ================= */}
      {activeTab === 'telegram' && (
        <div className="max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-400 text-black rounded-2xl shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">
                  Telegram Bot Integratsiyasi
                </h3>
                <p className="text-xs text-gray-400">
                  Har bir yangi buyurtma avtomatik Telegram guruhingizga tushadi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{tgConfig.botToken ? "Faol" : "Kutilmoqda"}</span>
            </div>
          </div>

          <form onSubmit={handleSaveTelegramConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={tgConfig.botToken}
                onChange={(e) => setTgConfig({ ...tgConfig, botToken: e.target.value })}
                placeholder="742189412:AAH9fklmN284..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                Telegramda @BotFather orqali yaratilgan botingiz API tokeni.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Telegram Chat ID (yoki Guruh ID)
              </label>
              <input
                type="text"
                value={tgConfig.chatId}
                onChange={(e) => setTgConfig({ ...tgConfig, chatId: e.target.value })}
                placeholder="-1001928374829 yoki 54918239"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                Sizning shaxsiy Chat ID yoki Telegram guruhingiz ID si (masalan: @userinfobot orqali olish mumkin).
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Sozlamalarni saqlash</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestTelegram}
                disabled={testSending}
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{testSending ? 'Yuborilmoqda...' : 'Test xabar jo\'natish'}</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ================= ORDER DETAILS MODAL / DRAWER ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Buyurtma #{selectedOrderDetails.id}
                </h3>
                <span className="text-xs text-gray-400">{selectedOrderDetails.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Mijoz:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedOrderDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Telefon:</span>
                <a href={`tel:${selectedOrderDetails.phone}`} className="font-mono font-bold text-amber-600 hover:underline">
                  {selectedOrderDetails.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Yetkazish manzili:</span>
                <span className="font-medium text-gray-900 dark:text-white text-right">{selectedOrderDetails.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">To'lov turi:</span>
                <span className="font-bold uppercase text-amber-600">{selectedOrderDetails.paymentMethod}</span>
              </div>
              {selectedOrderDetails.comment && (
                <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-400">Izoh:</span>
                  <span className="text-gray-700 dark:text-gray-300 italic">{selectedOrderDetails.comment}</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-gray-400">Buyurtma tovarlari:</h4>
              {selectedOrderDetails.items.map((it, idx) => {
                const title = typeof it.title === 'object' ? (it.title[lang] || it.title.uz) : it.title;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={title} className="w-10 h-10 object-contain rounded-lg" />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{title}</p>
                        <p className="text-gray-400">{it.quantity} x {formatPrice(it.price, lang)}</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white">
                      {formatPrice(it.price * it.quantity, lang)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-sm font-bold text-gray-500">Jami to'lov:</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {formatPrice(selectedOrderDetails.totalAmount, lang)}
              </span>
            </div>

            {/* Buttons: Print, Telegram resend */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Chop etish</span>
              </button>

              <button
                onClick={() => handleResendOrderToTelegram(selectedOrderDetails)}
                className="flex-1 py-3 bg-primary hover:bg-primary-hover rounded-xl font-bold text-xs text-black flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Telegramga jo'natish</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                {editingProductId ? t('editProduct') : t('addProduct')}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 mt-6">
              
              {/* Product Titles */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Mahsulot nomi (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.titleUz}
                  onChange={(e) => setProductForm({ ...productForm, titleUz: e.target.value })}
                  placeholder="Apple iPhone 16 Pro Max..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nomi (Русский)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleRu}
                    onChange={(e) => setProductForm({ ...productForm, titleRu: e.target.value })}
                    placeholder="Смартфон iPhone 16 Pro..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Nomi (English)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleEn}
                    onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                    placeholder="Smartphone iPhone 16 Pro..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{t(c.nameKey)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Brend
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Apple, Samsung, Artel..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Narxi (so'm) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="12000000"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Eski narxi (chegirma uchun)
                  </label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    placeholder="13500000"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Badges / Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isHit}
                    onChange={(e) => setProductForm({ ...productForm, isHit: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>🔥 HIT tovar</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="rounded text-blue-500"
                  />
                  <span>⚡️ Yangi (NEW)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isDealOfTheDay}
                    onChange={(e) => setProductForm({ ...productForm, isDealOfTheDay: e.target.checked })}
                    className="rounded text-rose-500"
                  />
                  <span>🎁 Kunning taklifi</span>
                </label>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Rasm havolasi (URL)
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />

                {/* Preset quick images */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-gray-400 font-semibold">Tezkor namunalar:</span>
                  {presetImages.map((pr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, image: pr.url })}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-100 font-semibold"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Xususiyatlari (Kalit: Qiymat)
                </label>
                <textarea
                  rows="3"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Ekran: 6.7 OLED&#10;Batareya: 5000 mAh&#10;Kafolat: 1 yil"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs shadow-md transition-all active:scale-95"
                >
                  Saqlash
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
