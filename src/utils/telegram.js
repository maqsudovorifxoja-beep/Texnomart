// Telegram Bot Service for Texnomart orders & alerts

export const DEFAULT_BOT_TOKEN = '8690944939:AAFAoy4ubx52L3BK5xM0p2IBSnBlwUd3qSY';
export const DEFAULT_BOT_USERNAME = 'orifxojabot';

export const getTelegramConfig = () => {
  const saved = localStorage.getItem('texnomart_telegram_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        botToken: parsed.botToken || DEFAULT_BOT_TOKEN,
        botUsername: parsed.botUsername || DEFAULT_BOT_USERNAME,
        chatId: parsed.chatId || '',
        enabled: parsed.enabled !== undefined ? parsed.enabled : true,
      };
    } catch {
      // ignore
    }
  }
  return {
    botToken: DEFAULT_BOT_TOKEN,
    botUsername: DEFAULT_BOT_USERNAME,
    chatId: '',
    enabled: true,
  };
};

export const saveTelegramConfig = (config) => {
  localStorage.setItem('texnomart_telegram_config', JSON.stringify(config));
};

export const fetchBotUpdates = async (botToken = DEFAULT_BOT_TOKEN) => {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const data = await res.json();
    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      const latest = data.result[data.result.length - 1];
      const chat = latest.message?.chat || latest.my_chat_member?.chat || latest.channel_post?.chat;
      if (chat) {
        return {
          success: true,
          chatId: String(chat.id),
          chatTitle: chat.title || chat.first_name || chat.username || 'Chat'
        };
      }
    }
    return {
      success: false,
      message: "Telegramda @orifxojabot botingizga kiring va /start tugmasini bosing, so'ngra qayta urinib ko'ring!"
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const sendTelegramMessage = async (text, customConfig = null) => {
  const config = customConfig || getTelegramConfig();
  
  if (!config.botToken) {
    return {
      success: false,
      simulated: true,
      message: "Telegram Bot Token mavjud emas!"
    };
  }

  if (!config.chatId) {
    return {
      success: false,
      simulated: true,
      message: "Telegram Chat ID kiritilmagan! Admin panelda Chat ID ni kiriting yoki 'Chat ID ni avtomatik aniqlash' tugmasini bosing."
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
💳 <b>To'lov turi:</b> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'NAQD'}
💬 <b>Izoh:</b> ${order.comment || "Mavjud emas"}

📦 <b>Mahsulotlar (${order.items.length} ta):</b>
${itemsText}
${discountFormatted}
━━━━━━━━━━━━━━━━━━━
💰 <b>JAMI TO'LOV: ${totalFormatted} so'm</b>
⚡️ <i>Status: Yangi buyurtma</i>
`;
};
