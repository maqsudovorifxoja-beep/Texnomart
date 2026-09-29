# Texnomart* Online Do'koni (Full Clone)

Ushbu loyiha [texnomart.uz](https://texnomart.uz/) rasmiy veb-saytining barcha 17 ta talab qilingan funksionalligi bilan to'liq yaratilgan zamonaviy kloni hisoblanadi.

---

## 🌟 Amalga oshirilgan 17 ta funksionallik

1. **Ko'p tillilik (uz, ru, en)**:
   - Sayt to'liq 3 ta tilda ishlaydi: O'zbekcha, Ruscha, Inglizcha.
   - Tanlangan til `localStorage` da avtomatik saqlanadi.
2. **Dark / Light mode (Tungi va Kunduzgi rejim)**:
   - Tungi va kunduzgi rejim o'tkazgichi yuqori qismda joylashgan va foydalanuvchi tanlovi saqlanadi.
3. **React + React Router**:
   - `/` - Asosiy sahifa (Landing)
   - `/catalog` - Filtrlash va saralash bilan mahsulotlar katalogi
   - `/product/:id` - Mahsulot tafsilotlari, xususiyatlari va bo'lib to'lash kalkulyatori
   - `/cart` - Savatcha va buyurtma rasmiylashtirish
   - `/favorites` - Sevimli mahsulotlar ro'yxati (Izbrannoe)
   - `/stores` - Do'konlar interaktiv xaritasi (Leaflet / OpenStreetMap)
   - `/admin` - Boshqaruv paneli (Dashboard, Mahsulotlar CRUD, Buyurtmalar, Telegram Bot)
   - `/login` - Tizimga kirish (Telefon yoki Login orqali)
   - `/profile` - Foydalanuvchi profili va buyurtmalar tarixi
4. **Tailwind CSS**:
   - Texnomartning o'ziga xos sariq (`#fbc100`) va qora brend uslubi bilan moslashtirilgan responsive dizayn.
5. **Landing page + 5 dan ortiq sahifalar**:
   - Bosh sahifa, Katalog, Mahsulot sahifasi, Savatcha, Sevimlilar, Do'konlar xaritasi, Admin panel, Login va Profil.
6. **Admin panel + Dashboard**:
   - Daromad, buyurtmalar, tovarlar va mijozlar statistikasi.
   - Buyurtmalar holatini o'zgartirish (Yangi, Jarayonda, Yetkazilmoqda, Yakunlangan).
7. **Telegram Bot integratsiyasi**:
   - Real Telegram Bot API orqali yangi buyurtma kelganda to'liq ma'lumotlar bilan bot yoki guruhga xabar jo'natish (`sendTelegramMessage`).
   - Admin panelda Bot Token va Chat ID kiritish hamda test xabar yuborish imkoniyati.
8. **LocalStorage ma'lumotlar bazasi**:
   - Barcha tovarlar, savat, sevimlilar, buyurtmalar, til va mavzu `localStorage` da saqlanadi.
9. **Mahsulotlarni qo'shish, tahrirlash, o'chirish (CRUD)**:
   - Admin paneli orqali yangi tovar qo'shish, tahrirlash va o'chirish.
10. **Sevimlilar (Izbrannoe / Wishlist)**:
    - Mahsulot kartasidagi yurakcha tugmasi, hisoblagich, sevimlilar sahifasi va bir bosishda barchasini savatga qo'shish.
11. **Savatga qo'shish + Promokod tizimi**:
    - Miqdor nazorati (`+` va `-`), promokodlar: `TEXNO2026` (10%), `TEXNOMART` (15%), `YANGI` (100 000 so'm), `SUPER` (20%).
12. **Login: Telefon + Parol yoki Username + Parol**:
    - Telefon yoki username orqali kirish va ro'yxatdan o'tish.
    - 1-bosishda tezkor "Demo Admin" va "Demo Mijoz" sifatida kirish tugmalari.
13. **Onlayn do'kon to'liq buyurtma jarayoni**:
    - Ism, telefon, yetkazish manzili, to'lov turlari (Payme, Click, Uzum, Nasiya 0%, Naqd).
    - Buyurtma qabul qilinganda konfetti animatsiyasi va chek.
14. **GitHub + Vercel tayyor**:
    - `vercel.json` SPA yo'naltiruvchi konfiguratsiyasi bilan to'liq xatosiz build (`npm run build`).
15. **Qidiruv (Live Search)**:
    - Real vaqtda takliflar va rasmlar bilan ochiladigan qidiruv menyusi.
16. **Saralash + Filtr + Sort**:
    - Brendlar, kategoriyalar, narx oralig'i (slider), faqat chegirmadagilar, mavjudligi bo'yicha filtrlash.
    - Narx bo'yicha (arzon / qimmat), reyting va yangiliklar bo'yicha saralash.
17. **Do'konlar interaktiv xaritasi (Leaflet Map)**:
    - Toshkent, Samarqand, Buxoro, Farg'ona, Namangan do'konlarining aniq koordinatalari, ish vaqti, telefon raqamlari va xaritada markerlar.

---

## 🚀 Ishga tushirish (Local Development)

```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturni ishga tushirish
npm run dev
```

Brauzerda oching: [http://localhost:5173/](http://localhost:5173/)

## 📦 Production Build (Vercel / GitHub)

```bash
npm run build
```

Natija `dist/` papkasida hosil bo'ladi va Vercel platformasiga to'g'ridan-to'g'ri ulanishga tayyor.

---

## 🤖 Telegram Botni ulash

1. Telegramda [@BotFather](https://t.me/BotFather) orqali yangi bot oching va tokenni oling.
2. Shaxsiy profilingiz yoki guruhingiz Chat ID sini aniqlang (masalan [@userinfobot](https://t.me/userinfobot) orqali).
3. Saytdagi **Admin Panel** (`/admin`) -> **Telegram Bot** bo'limiga kiring va ma'lumotlarni saqlang.
4. "Test xabar jo'natish" tugmasini bosing!
# eeee
# eeee
# cola
