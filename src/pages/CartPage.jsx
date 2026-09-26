import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ShoppingBag,
  Send,
  X,
  CreditCard,
  Truck,
  Building
} from 'lucide-react';

export const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    addOrder,
    t,
    lang,
    user
  } = useApp();

  const navigate = useNavigate();

  // Promo code input state
  const [promoInput, setPromoInput] = useState('');

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user ? user.name : '',
    phone: user ? user.phone : '+998 ',
    deliveryMethod: 'courier', // 'courier' | 'pickup'
    address: '',
    paymentMethod: 'payme', // 'payme' | 'click' | 'uzum' | 'nasiya' | 'cash'
    comment: ''
  });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) setPromoInput('');
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      alert(lang === 'uz' ? "Iltimos, ismingiz va telefon raqamingizni to'ldiring!" : "Пожалуйста, заполните имя и номер телефона!");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
        address: formData.deliveryMethod === 'courier' ? formData.address : "Do'kondan olib ketish",
        paymentMethod: formData.paymentMethod,
        comment: formData.comment
      });

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore confetti error if any
      }

      setCompletedOrder({
        ...result.order,
        telegramSuccess: result.telegramResult?.success
      });
      setIsCheckoutOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Empty Cart State
  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {t('emptyCart')}
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {lang === 'uz'
            ? "Bosh sahifaga o'ting yoki qidiruv orqali o'zingizga kerakli mahsulotlarni toping."
            : "Перейдите на главную страницу или найдите нужные товары через поиск."}
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>{t('viewAll')}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <span className="w-3 h-8 bg-primary rounded-full" />
          {t('cartTitle')}
          <span className="text-base sm:text-lg font-normal text-gray-400">({cart.length} {t('productCount')})</span>
        </h1>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1.5 hover:underline"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearCart')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= 1. CART ITEMS LIST (8 Cols) ================= */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const itemTitle = typeof item.title === 'object' ? (item.title[lang] || item.title.uz) : item.title;
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
              >
                {/* Product Image & Title */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link
                    to={`/product/${item.id}`}
                    className="w-20 h-20 bg-gray-50 dark:bg-[#141414] rounded-xl p-2 flex items-center justify-center flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                      {item.brand}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      className="block text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:text-amber-500 line-clamp-2 max-w-md"
                    >
                      {itemTitle}
                    </Link>
                    <p className="text-xs text-gray-400">
                      1 dona: {formatPrice(item.price, lang)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Total & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[120px]">
                    <span className="block text-base sm:text-lg font-black text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity, lang)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 2. ORDER SUMMARY & PROMOCODE (4 Cols) ================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
              {t('orderSummary')}
            </h3>

            {/* Promocode Input Form */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                {t('enterPromo')}
              </label>

              {promoCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      {promoCode.code} (-{promoCode.type === 'percent' ? `${promoCode.value}%` : `${formatPrice(promoCode.value, lang)}`})
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-500 hover:underline font-semibold"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-black text-white hover:bg-gray-900 rounded-xl font-bold text-xs transition-colors"
                  >
                    {t('applyPromo')}
                  </button>
                </form>
              )}

              <p className="text-[11px] text-gray-400 mt-1.5">
                {lang === 'uz' ? "Sinab ko'ring: TEXNO2026, YANGI, SUPER" : "Попробуйте: TEXNO2026, YANGI, SUPER"}
              </p>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(cartSubtotal, lang)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('promocodeDiscount')}</span>
                  <span>-{formatPrice(discountAmount, lang)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('deliveryFee')}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('free')}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t('cartTotal')}</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {formatPrice(cartTotal, lang)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-black font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('proceedCheckout')}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Xavfsiz xarid va to'lov</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= CHECKOUT MODAL ================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                {t('checkoutTitle')}
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 mt-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('customerName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Ali Valiyev"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('deliveryMethod')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'courier' })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.deliveryMethod === 'courier'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 ring-2 ring-amber-400'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>{t('courierDelivery')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.deliveryMethod === 'pickup'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 ring-2 ring-amber-400'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>{t('storePickup')}</span>
                  </button>
                </div>
              </div>

              {/* Address (if courier) */}
              {formData.deliveryMethod === 'courier' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t('deliveryAddress')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Toshkent sh., Yunusobod tumani, 12-uy"
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t('paymentMethod')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                  {[
                    { id: 'payme', label: 'Payme' },
                    { id: 'click', label: 'Click' },
                    { id: 'uzum', label: 'Uzum' },
                    { id: 'nasiya', label: 'Nasiya 0%' },
                    { id: 'cash', label: 'Naqd' },
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                        formData.paymentMethod === pm.id
                          ? 'border-amber-400 bg-amber-400 text-black font-bold'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t('orderComment')}
                </label>
                <textarea
                  rows="2"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Domofon kodi yoki qo'ng'iroq uchun..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Total & Submit */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">{t('cartTotal')}</span>
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    {formatPrice(cartTotal, lang)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Yuborilmoqda...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t('confirmOrder')}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= ORDER SUCCESS RECEIPT MODAL ================= */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                {t('orderSuccessTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {t('orderSuccessDesc')}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-gray-800 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('orderNumber')}:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">#{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('customerName')}:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('phoneNumber')}:</span>
                <span className="font-mono text-gray-900 dark:text-white">{completedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('cartTotal')}:</span>
                <span className="font-black text-amber-600 dark:text-amber-400">{formatPrice(completedOrder.totalAmount, lang)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Send className="w-3.5 h-3.5" />
                <span>Telegram Botga buyurtma jo'natildi!</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedOrder(null);
                navigate('/');
              }}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl shadow-md transition-all"
            >
              {t('backToHome')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
