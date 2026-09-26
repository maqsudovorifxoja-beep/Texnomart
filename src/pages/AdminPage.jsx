import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { categories } from '../data/categories';
import {
  getTelegramConfig,
  saveTelegramConfig,
  sendTelegramMessage
} from '../utils/telegram';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Bot,
  ExternalLink
} from 'lucide-react';

export const AdminPage = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    t,
    lang,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'telegram'

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');

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
    specs: ''
  });

  // Telegram Config State
  const [tgConfig, setTgConfig] = useState(getTelegramConfig());
  const [testSending, setTestSending] = useState(false);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;

  // Filtered Products in Admin
  const adminFilteredProducts = products.filter(p => {
    const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
    return title.toLowerCase().includes(adminSearch.toLowerCase()) ||
           p.brand.toLowerCase().includes(adminSearch.toLowerCase());
  });

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
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&auto=format&fit=crop&q=80',
      description: 'Eng so\'nggi modeldagi mukammal texnika.',
      specs: 'Xotira: 256GB\nKafolat: 1 yil\nRang: Qora'
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
      image: product.image || '',
      description: product.description || '',
      specs: specsStr
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.titleUz || !productForm.price) {
      alert("Iltimos, mahsulot nomi va narxini to'ldiring!");
      return;
    }

    // Parse specs string into object
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
      image: productForm.image || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
      description: productForm.description,
      specs: specsObj
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      deleteProduct(id);
    }
  };

  // Telegram Settings Save
  const handleSaveTelegramConfig = (e) => {
    e.preventDefault();
    saveTelegramConfig(tgConfig);
    showToast(t('saveSettings'));
  };

  // Send Telegram Test Notification
  const handleSendTestTelegram = async () => {
    setTestSending(true);
    const testMessage = `
🔔 <b>TEXNOMART TEST BILDIRISHNOMASI</b>
━━━━━━━━━━━━━━━━━━━
Sizning Telegram botingiz muvaffaqiyatli ulandi!
Vaqt: ${new Date().toLocaleString('uz-UZ')}
Status: Ishlamoqda ✅
    `;
    const res = await sendTelegramMessage(testMessage, tgConfig);
    setTestSending(false);

    if (res.success) {
      showToast(t('testSuccess'), 'success');
    } else {
      showToast(res.message || t('testFailed'), 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-3 h-8 bg-primary rounded-full" />
            {t('adminDashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {lang === 'uz' ? "Mahsulotlar, buyurtmalar va Telegram botni to'liq boshqarish" : "Полное управление товарами, заказами и Telegram ботом"}
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('productsTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('ordersTab')} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'telegram'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Telegram Bot</span>
          </button>
        </div>
      </div>

      {/* ================= 1. ANALYTICS METRICS CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">{t('totalRevenue')}</span>
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {formatPrice(totalRevenue, lang)}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">{t('totalOrders')}</span>
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {totalOrdersCount} ta
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">{t('totalProducts')}</span>
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {totalProductsCount} ta
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-semibold block">{t('activeUsers')}</span>
            <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              1,248 ta
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. PRODUCTS MANAGEMENT TAB ================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Mahsulot nomi yoki brend bo'yicha..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-xs focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('addProduct')}</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4">Rasm & Nomi</th>
                  <th className="p-4">Kategoriya</th>
                  <th className="p-4">Brend</th>
                  <th className="p-4">Narxi</th>
                  <th className="p-4">Holat</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {adminFilteredProducts.map((p) => {
                  const title = typeof p.title === 'object' ? (p.title[lang] || p.title.uz) : p.title;
                  return (
                    <tr key={p.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={title}
                          className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-gray-800 p-1 flex-shrink-0"
                        />
                        <span className="font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                          {title}
                        </span>
                      </td>
                      <td className="p-4 capitalize text-gray-600 dark:text-gray-400">
                        {p.category}
                      </td>
                      <td className="p-4 font-bold text-gray-800 dark:text-gray-200">
                        {p.brand}
                      </td>
                      <td className="p-4 font-extrabold text-amber-600 dark:text-amber-400">
                        {formatPrice(p.price, lang)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                          {t('inStock')}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 hover:text-amber-600 transition-colors text-gray-600 dark:text-gray-300"
                          title={t('editProduct')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-rose-100 hover:text-rose-600 transition-colors text-gray-600 dark:text-gray-300"
                          title={t('deleteProduct')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 3. ORDERS MANAGEMENT TAB ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-4">ID & Sana</th>
                  <th className="p-4">Mijoz</th>
                  <th className="p-4">Manzil & To'lov</th>
                  <th className="p-4">Mahsulotlar</th>
                  <th className="p-4">Jami</th>
                  <th className="p-4">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">#{ord.id}</span>
                      <span className="block text-[10px] text-gray-400">{ord.date}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-900 dark:text-white block">{ord.customerName}</span>
                      <span className="font-mono text-gray-400 text-[11px]">{ord.phone}</span>
                    </td>
                    <td className="p-4">
                      <span className="block text-gray-700 dark:text-gray-300">{ord.address}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] uppercase font-bold text-amber-600">
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
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400">
                      {formatPrice(ord.totalAmount, lang)}
                    </td>
                    <td className="p-4">
                      <label htmlFor={`order-status-${ord.id}`} className="sr-only">{t('orderStatus')}</label>
                      <select
                        id={`order-status-${ord.id}`}
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                          ord.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40'
                            : ord.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40'
                            : ord.status === 'delivering'
                            ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40'
                        }`}
                      >
                        <option value="new">{t('statusNew')}</option>
                        <option value="processing">{t('statusProcessing')}</option>
                        <option value="delivering">{t('statusDelivering')}</option>
                        <option value="completed">{t('statusCompleted')}</option>
                        <option value="cancelled">{t('statusCancelled')}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 4. TELEGRAM BOT SETTINGS TAB ================= */}
      {activeTab === 'telegram' && (
        <div className="max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="p-3 bg-amber-400 text-black rounded-2xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900 dark:text-white">
                {t('telegramTab')}
              </h3>
              <p className="text-xs text-gray-500">
                Har bir yangi buyurtma avtomatik tarzda Telegram guruhingizga yoki botingizga yuboriladi.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveTelegramConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('telegramToken')}
              </label>
              <input
                type="text"
                value={tgConfig.botToken}
                onChange={(e) => setTgConfig({ ...tgConfig, botToken: e.target.value })}
                placeholder="masalan: 742189412:AAH9fklmN284..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                @BotFather orqali yaratilgan botingiz tokeni
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                {t('telegramChatId')}
              </label>
              <input
                type="text"
                value={tgConfig.chatId}
                onChange={(e) => setTgConfig({ ...tgConfig, chatId: e.target.value })}
                placeholder="masalan: -1001928374829 yoki 54918239"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <span className="text-[11px] text-gray-400 block mt-1">
                Sizning shaxsiy Chat ID yoki Telegram guruhingiz ID si (@userinfobot orqali olish mumkin)
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveSettings')}</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestTelegram}
                disabled={testSending}
                className="px-6 py-3 bg-black text-white hover:bg-gray-800 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{testSending ? 'Yuborilmoqda...' : t('sendTestMessage')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
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
              {/* Titles in UZ / RU / EN */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  {t('productTitle')} (O'zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.titleUz}
                  onChange={(e) => setProductForm({ ...productForm, titleUz: e.target.value })}
                  placeholder="Smartfon iPhone 16 Pro..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t('productTitle')} (Русский)
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
                    {t('productTitle')} (English)
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
                    {t('productCategory')}
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{t(c.nameKey)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t('productBrand')}
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Apple, Samsung, Artel..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t('productPrice')} *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="12000000"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t('productOldPrice')}
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

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('productImage')}
                </label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              {/* Specs (Key: Value) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('productSpecs')} (Format: Kalit: Qiymat)
                </label>
                <textarea
                  rows="3"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Ekran: 6.7 OLED&#10;Batareya: 5000 mAh"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mahsulot haqida qisqacha ma'lumot..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-xl text-xs"
                >
                  {t('save')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
