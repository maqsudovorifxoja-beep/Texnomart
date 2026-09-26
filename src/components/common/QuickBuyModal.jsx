import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice, calculateMonthly } from '../../utils/formatters';
import { 
  X, 
  Zap, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  Store, 
  Send,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const QuickBuyModal = () => {
  const { 
    quickBuyProduct, 
    closeQuickBuy, 
    submitQuickOrder, 
    lang, 
    user 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+998 ');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('Toshkent sh., Yunusobod tumani');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!quickBuyProduct) return null;

  const product = quickBuyProduct;
  const title = typeof product.title === 'object' ? (product.title[lang] || product.title.uz) : product.title;
  const totalPrice = product.price * quantity;
  const monthly = calculateMonthly(totalPrice, 24);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || phone.trim().length < 9) {
      alert(lang === 'uz' ? "Iltimos, ismingiz va telefon raqamingizni to'liq kiriting!" : "Пожалуйста, укажите имя и номер телефона!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuickOrder({
        product,
        quantity,
        customerName,
        phone,
        deliveryMethod,
        paymentMethod,
        address: deliveryMethod === 'courier' ? address : "Texnomart Beruniy filiali (Do'kondan olib ketish)",
        comment,
      });

      setCreatedOrder(res.order);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreatedOrder(null);
    closeQuickBuy();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity flex justify-center items-center p-3 sm:p-4">
      <div 
        className="relative bg-white dark:bg-[#1a1a1c] rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/60 dark:bg-[#141416]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-400 text-black rounded-lg">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
              {lang === 'uz' ? "1 bosishda tezkor xarid" : "Быстрая покупка в 1 клик"}
            </h3>
          </div>
          
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {createdOrder ? (
          /* SUCCESS STATE */
          <div className="p-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold rounded-lg mb-2">
                Buyurtma #{createdOrder.id}
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {lang === 'uz' ? "Buyurtmangiz qabul qilindi!" : "Ваш заказ успешно принят!"}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                {lang === 'uz'
                  ? "Tez orada operatorimiz siz bilan bog'lanadi va yetkazib berish tafsilotlarini tasdiqlaydi."
                  : "Наш оператор свяжется с вами в течение 10 минут для подтверждения заказа."}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-gray-50 dark:bg-[#121214] rounded-2xl border border-gray-100 dark:border-gray-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Mahsulot:</span>
                <span className="font-bold text-gray-900 dark:text-white max-w-[180px] truncate">{title}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Mijoz:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{createdOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Telefon:</span>
                <span className="font-mono text-gray-900 dark:text-white">{createdOrder.phone}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>To'lov usuli:</span>
                <span className="font-semibold uppercase text-gray-900 dark:text-white">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 text-sm font-black text-amber-600 dark:text-amber-400">
                <span>Jami to'lov:</span>
                <span>{formatPrice(createdOrder.totalAmount, lang)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center justify-center gap-2 font-medium">
              <Send className="w-4 h-4" />
              <span>Telegram botga (@orifxojabot) buyurtma yuborildi!</span>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              {lang === 'uz' ? "Xaridni davom ettirish" : "Продолжить покупки"}
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Product Snapshot */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50 dark:bg-[#141416] border border-gray-100 dark:border-gray-800">
              <img
                src={product.image}
                alt={title}
                className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-gray-800 p-1 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                  {title}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                    {formatPrice(product.price, lang)}
                  </span>
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-1">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Installment Badge */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-bold">
              <span>{lang === 'uz' ? "Muddatli to'lov (24 oy):" : "Рассрочка (24 мес):"}</span>
              <span className="text-black dark:text-white font-black">{formatPrice(monthly, lang)} / oy</span>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {lang === 'uz' ? "Ismingiz *" : "Ваше имя *"}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'uz' ? "Masalan: Alisher Vohidov" : "Например: Алишер Вохидов"}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {lang === 'uz' ? "Telefon raqamingiz *" : "Номер телефона *"}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Delivery method tabs */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {lang === 'uz' ? "Yetkazib berish usuli" : "Способ доставки"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryMethod === 'courier'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-black dark:text-white'
                        : 'border-gray-200 dark:border-gray-800 text-gray-500'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'uz' ? "Kuryer (Bepul)" : "Курьер (Бесплатно)"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-black dark:text-white'
                        : 'border-gray-200 dark:border-gray-800 text-gray-500'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-500" />
                    <span>{lang === 'uz' ? "Do'kondan olish" : "Самовывоз"}</span>
                  </button>
                </div>
              </div>

              {/* Address input if courier */}
              {deliveryMethod === 'courier' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {lang === 'uz' ? "Yetkazish manzili" : "Адрес доставки"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={lang === 'uz' ? "Shahar, ko'cha, uy raqami" : "Город, улица, дом"}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#141416] border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {lang === 'uz' ? "To'lov turi" : "Способ оплаты"}
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                  {[
                    { id: 'cash', label: 'Naqd pul' },
                    { id: 'card', label: 'Payme/Click' },
                    { id: 'nasiya', label: '0-0-24 Nasiya' },
                  ].map(pm => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === pm.id
                          ? 'border-amber-400 bg-amber-400/20 text-black dark:text-white font-black'
                          : 'border-gray-200 dark:border-gray-800 text-gray-500'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Total & Submit Button */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-gray-500 font-bold">{lang === 'uz' ? "Jami to'lov miqdori:" : "Итоговая сумма:"}</span>
                <span className="text-base font-black text-gray-900 dark:text-white">
                  {formatPrice(totalPrice, lang)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-black font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{lang === 'uz' ? "Yuborilmoqda..." : "Отправка..."}</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    <span>{lang === 'uz' ? "Buyurtmani tasdiqlash" : "Подтвердить заказ"}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>1 yil kafolat</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>10 daqiqada aloqa</span>
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
