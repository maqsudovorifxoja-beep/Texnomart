// Telegram Bot Service for Texnomart orders & alerts

export const getTelegramConfig = () => {
  const saved = localStorage.getItem('texnomart_telegram_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return {
    botToken: '', // User can provide real bot token in admin panel
    chatId: '',   // User can provide real chat ID
    enabled: true,
  };
};

export const saveTelegramConfig = (config) => {
  localStorage.setItem('texnomart_telegram_config', JSON.stringify(config));
};

export const sendTelegramMessage = async (text, customConfig = null) => {
  const config = customConfig || getTelegramConfig();
  
  if (!config.botToken || !config.chatId) {
    console.warn("Telegram bot token or chat ID is not configured. Saving order locally.");
    return {
      success: false,
      simulated: true,
      message: "Telegram Bot Token va Chat ID sozlanmagan. Buyurtma lokal saqlandi!"
    };
  }

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.description || 'Unknown Telegram API error' };
    }
  } catch (error) {
    console.error("Telegram dispatch error:", error);
    return { success: false, error: error.message };
  }
};

export const formatOrderForTelegram = (order) => {
  const itemsText = order.items.map((item, idx) => {
    const title = typeof item.title === 'object' ? (item.title.uz || item.title.ru) : item.title;
    const priceFormatted = new Intl.NumberFormat('ru-RU').format(item.price);
    return `${idx + 1}. <b>${title}</b>\n   └ ${item.quantity} x ${priceFormatted} so'm`;
  }).join('\n');

  const totalFormatted = new Intl.NumberFormat('ru-RU').format(order.totalAmount);
  const discountFormatted = order.discountAmount ? `\n🏷 <b>Promokod chegirmasi:</b> -${new Intl.NumberFormat('ru-RU').format(order.discountAmount)} so'm` : '';

  return `
🛍 <b>YANGI TEXNOMART BUYURTMASI!</b>
━━━━━━━━━━━━━━━━━━━
🆔 <b>Buyurtma №:</b> <code>#${order.id}</code>
📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}

👤 <b>Mijoz:</b> ${order.customerName}
📞 <b>Telefon:</b> ${order.phone}
📍 <b>Manzil:</b> ${order.address || "Do'kondan olib ketish"}
🚚 <b>Yetkazish turi:</b> ${order.deliveryMethod === 'courier' ? 'Kuryer orqali' : "Do'kondan olib ketish"}
💳 <b>To'lov turi:</b> ${order.paymentMethod.toUpperCase()}
💬 <b>Izoh:</b> ${order.comment || "Mavjud emas"}

📦 <b>Mahsulotlar (${order.items.length} ta):</b>
${itemsText}
${discountFormatted}
━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI TO'LOV: ${totalFormatted} so'm</b>
⚡️ <i>Status: Yangi buyurtma</i>
`;
};
