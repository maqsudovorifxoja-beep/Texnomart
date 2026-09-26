// Format numbers as currency in UZS
export const formatPrice = (amount, lang = 'uz') => {
  if (amount === undefined || amount === null) return '0';
  const formatted = new Intl.NumberFormat('ru-RU').format(Math.round(amount));
  
  if (lang === 'ru') return `${formatted} сум`;
  if (lang === 'en') return `${formatted} UZS`;
  return `${formatted} so'm`;
};

// Calculate monthly installment (muddatli to'lov)
export const calculateMonthly = (price, months = 12) => {
  if (!price) return 0;
  // Margin for installment (approx 15% mark up over 12 months in retail or 0% promotion)
  const coefficient = months === 24 ? 1.25 : months === 12 ? 1.15 : months === 6 ? 1.08 : 1.0;
  return Math.round((price * coefficient) / months);
};
