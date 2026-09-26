export const categories = [
  {
    id: 'smartphones',
    slug: 'smartphones',
    nameKey: 'smartphones',
    title: { uz: 'Smartfonlar va gadjetlar', ru: 'Смартфоны и гаджеты', en: 'Smartphones & Gadgets' },
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80',
    count: 42,
    banner: {
      title: "iPhone 16 Pro Max",
      subtitle: "0-0-24 muddatli to'lov bilan!",
      link: "/catalog?category=smartphones&brand=Apple"
    },
    subcategories: [
      {
        title: { uz: 'Smartfonlar', ru: 'Смартфоны', en: 'Smartphones' },
        items: [
          { name: 'Apple iPhone', query: 'brand=Apple' },
          { name: 'Samsung Galaxy', query: 'brand=Samsung' },
          { name: 'Xiaomi / Redmi', query: 'brand=Xiaomi' },
          { name: 'Honor', query: 'brand=Honor' },
          { name: 'Realme', query: 'brand=Realme' },
          { name: 'Vivo', query: 'brand=Vivo' },
        ]
      },
      {
        title: { uz: 'Planshetlar', ru: 'Планшеты', en: 'Tablets' },
        items: [
          { name: 'Apple iPad', query: 'search=iPad' },
          { name: 'Samsung Tab', query: 'search=Galaxy+Tab' },
          { name: 'Xiaomi Pad', query: 'search=Xiaomi+Pad' },
          { name: 'Grafik planshetlar', query: 'search=planshet' }
        ]
      },
      {
        title: { uz: 'Aksessuarlar', ru: 'Аксессуары', en: 'Accessories' },
        items: [
          { name: 'Chexol va g\'iloflar', query: 'search=chexol' },
          { name: 'Himoya oynalari', query: 'search=oyna' },
          { name: 'Quvvatlash qurilmalari', query: 'search=adapter' },
          { name: 'Powerbanklar', query: 'search=powerbank' },
          { name: 'Avto ushlagichlar', query: 'search=avto' }
        ]
      }
    ],
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Honor', 'Realme', 'Vivo', 'Infinix']
  },
  {
    id: 'laptops',
    slug: 'laptops',
    nameKey: 'laptops',
    title: { uz: 'Noutbuklar va kompyuterlar', ru: 'Ноутбуки и компьютеры', en: 'Laptops & Computers' },
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
    count: 28,
    banner: {
      title: "MacBook Air M3",
      subtitle: "Yengil, qudratli va jimjit!",
      link: "/catalog?category=laptops&brand=Apple"
    },
    subcategories: [
      {
        title: { uz: 'Noutbuklar turi', ru: 'Типы ноутбуков', en: 'Laptop types' },
        items: [
          { name: 'O\'yin noutbuklari (Gaming)', query: 'search=Gaming' },
          { name: 'Ultrabuklar va ofis uchun', query: 'search=ultrabook' },
          { name: 'Apple MacBook', query: 'brand=Apple' },
          { name: 'Dasturchilar uchun', query: 'search=Pro' }
        ]
      },
      {
        title: { uz: 'Kompyuter texnikasi', ru: 'Компьютерная техника', en: 'Computer hardware' },
        items: [
          { name: 'Monitorlar', query: 'search=monitor' },
          { name: 'Monobloklar', query: 'search=monoblok' },
          { name: 'Printer va MFU', query: 'search=printer' },
          { name: 'Tizim bloklari', query: 'search=PC' }
        ]
      },
      {
        title: { uz: 'Periferiya va jihozlar', ru: 'Периферия', en: 'Peripherals' },
        items: [
          { name: 'Sichqonchalar (Mishka)', query: 'search=mouse' },
          { name: 'Klaviaturalar', query: 'search=keyboard' },
          { name: 'Veb-kameralar', query: 'search=webcam' },
          { name: 'Quloqchin va mikrofonlar', query: 'search=headset' }
        ]
      }
    ],
    brands: ['Apple', 'Asus', 'Lenovo', 'HP', 'Acer', 'Dell', 'MSI']
  },
  {
    id: 'tvs',
    slug: 'tvs',
    nameKey: 'tvs',
    title: { uz: 'Televizorlar va audio', ru: 'Телевизоры и аудио', en: 'TV & Audio' },
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80',
    count: 19,
    banner: {
      title: "Samsung OLED 4K",
      subtitle: "Chegirma 2 500 000 so'm!",
      link: "/catalog?category=tvs&brand=Samsung"
    },
    subcategories: [
      {
        title: { uz: 'Televizorlar', ru: 'Телевизоры', en: 'Televisions' },
        items: [
          { name: 'Smart TV 32"', query: 'search=32' },
          { name: '4K Ultra HD 43" - 55"', query: 'search=55' },
          { name: 'Katta ekran 65" - 85"', query: 'search=65' },
          { name: 'OLED va QLED', query: 'search=OLED' }
        ]
      },
      {
        title: { uz: 'Audio va akustika', ru: 'Аудио и акустика', en: 'Audio & Acoustics' },
        items: [
          { name: 'Soundbarlar', query: 'search=soundbar' },
          { name: 'Portativ kolonka', query: 'search=kolonka' },
          { name: 'Musiqa markazlari', query: 'search=akustika' },
          { name: 'Uy kinoteatri', query: 'search=kinoteatr' }
        ]
      },
      {
        title: { uz: 'Aksessuarlar', ru: 'Аксессуары для ТВ', en: 'TV Accessories' },
        items: [
          { name: 'Kronshteynlar (Devorga)', query: 'search=kronshteyn' },
          { name: 'TV pristavkalar (Mi Box)', query: 'search=tv-box' },
          { name: 'HDMI kabellar', query: 'search=hdmi' }
        ]
      }
    ],
    brands: ['Samsung', 'LG', 'Artel', 'Sony', 'Xiaomi', 'TCL', 'Shivaki']
  },
  {
    id: 'appliances',
    slug: 'appliances',
    nameKey: 'appliances',
    title: { uz: 'Katta maishiy texnika', ru: 'Крупная бытовая техника', en: 'Large Appliances' },
    icon: 'Refrigerator',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=400&auto=format&fit=crop&q=80',
    count: 35,
    banner: {
      title: "LG Inverter Muzlatgich",
      subtitle: "10 yil kompressor kafolati bilan",
      link: "/catalog?category=appliances&brand=LG"
    },
    subcategories: [
      {
        title: { uz: 'Muzlatgichlar', ru: 'Холодильники', en: 'Refrigerators' },
        items: [
          { name: 'No Frost muzlatgichlar', query: 'search=No+Frost' },
          { name: 'Side-by-Side katta', query: 'search=Side-by-side' },
          { name: 'Muzlatish kameralari', query: 'search=kamera' }
        ]
      },
      {
        title: { uz: 'Kir yuvish mashinalari', ru: 'Стиральные машины', en: 'Washing machines' },
        items: [
          { name: 'Avtomat 6-8 kg', query: 'search=kir+yuvish' },
          { name: 'Quritgichli mashinalar', query: 'search=quritgich' },
          { name: 'Idish yuvish mashinalari', query: 'search=idish+yuvish' }
        ]
      },
      {
        title: { uz: 'Gaz va elektr plitalar', ru: 'Плиты', en: 'Cookers & Ovens' },
        items: [
          { name: 'Kombinatsiyalangan plitalar', query: 'search=plita' },
          { name: 'O\'rnatiladigan duxovkalar', query: 'search=duxovka' },
          { name: 'Tutun tortgichlar (Vityajka)', query: 'search=vityajka' }
        ]
      }
    ],
    brands: ['LG', 'Samsung', 'Artel', 'Bosch', 'Beko', 'Haier', 'Gorenje']
  },
  {
    id: 'kitchen',
    slug: 'kitchen',
    nameKey: 'kitchen',
    title: { uz: 'Oshxona texnikasi', ru: 'Техника для кухни', en: 'Kitchen Appliances' },
    icon: 'Microwave',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
    count: 44,
    banner: {
      title: "Oshxona festivali",
      subtitle: "30% gacha keshbek bilan!",
      link: "/catalog?category=kitchen"
    },
    subcategories: [
      {
        title: { uz: 'Pishirish jihozlari', ru: 'Для приготовления', en: 'Cooking' },
        items: [
          { name: 'Mikroto\'lqinli pechlar', query: 'search=mikrotolqinli' },
          { name: 'Multivarkalar', query: 'search=multivarka' },
          { name: 'Aerogrillar', query: 'search=aerogril' },
          { name: 'Tosterlar', query: 'search=toster' }
        ]
      },
      {
        title: { uz: 'Ichimliklar uchun', ru: 'Для напитков', en: 'For beverages' },
        items: [
          { name: 'Kofe mashinalar', query: 'search=kofemashina' },
          { name: 'Elektr choynaklar', query: 'search=choynak' },
          { name: 'Sharbat chiqargichlar', query: 'search=sharbat' },
          { name: 'Blenderlar', query: 'search=blender' }
        ]
      },
      {
        title: { uz: 'Maydalash va qorishtirish', ru: 'Измельчение', en: 'Food prep' },
        items: [
          { name: 'Go\'sht qiymalagichlar', query: 'search=gosht' },
          { name: 'Oshxona kombaynlari', query: 'search=kombayn' },
          { name: 'Mikserlar', query: 'search=mikser' }
        ]
      }
    ],
    brands: ['Philips', 'Bosch', 'Artel', 'Tefal', 'Moulinex', 'Braun', 'DeLonghi']
  },
  {
    id: 'gadgets',
    slug: 'gadgets',
    nameKey: 'gadgets',
    title: { uz: 'Aqlli gadjetlar va soatlar', ru: 'Умные гаджеты и часы', en: 'Smart Gadgets & Watches' },
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    count: 22,
    banner: {
      title: "Apple Watch Ultra 2",
      subtitle: "Eng ekstremal sharoitlar uchun",
      link: "/catalog?category=gadgets&brand=Apple"
    },
    subcategories: [
      {
        title: { uz: 'Aqlli soatlar', ru: 'Смарт-часы', en: 'Smartwatches' },
        items: [
          { name: 'Apple Watch', query: 'search=Apple+Watch' },
          { name: 'Samsung Galaxy Watch', query: 'search=Galaxy+Watch' },
          { name: 'Fitness brasletlar', query: 'search=fitnes' },
          { name: 'Bolalar aqlli soatlari', query: 'search=bolalar' }
        ]
      },
      {
        title: { uz: 'Simsiz quloqchinlar', ru: 'Беспроводные наушники', en: 'Wireless Earbuds' },
        items: [
          { name: 'Apple AirPods Pro', query: 'search=AirPods' },
          { name: 'Samsung Buds', query: 'search=Buds' },
          { name: 'Marshall Major / Motif', query: 'search=Marshall' },
          { name: 'Shovqin so\'ndiruvchi (ANC)', query: 'search=ANC' }
        ]
      },
      {
        title: { uz: 'Aqlli uy texnikasi', ru: 'Умный дом', en: 'Smart Home' },
        items: [
          { name: 'Robot changyutgichlar', query: 'search=robot' },
          { name: 'Aqlli lampalar va rozetkalar', query: 'search=aqlli+rozetka' },
          { name: 'Kuzatuv kameralari', query: 'search=kamera' }
        ]
      }
    ],
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Marshall', 'JBL', 'Garmin', 'Roborock']
  },
  {
    id: 'beauty',
    slug: 'beauty',
    nameKey: 'beauty',
    title: { uz: 'Go\'zallik va salomatlik', ru: 'Красота и здоровье', en: 'Beauty & Health' },
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    count: 16,
    banner: {
      title: "Dyson Airwrap",
      subtitle: "Sochlaringiz uchun afsonaviy parvarish",
      link: "/catalog?category=beauty&brand=Dyson"
    },
    subcategories: [
      {
        title: { uz: 'Soch parvarishi', ru: 'Уход за волосами', en: 'Hair care' },
        items: [
          { name: 'Dyson stayler va fenlar', query: 'brand=Dyson' },
          { name: 'Professional fenlar', query: 'search=fen' },
          { name: 'Soch to\'g\'rilagichlar (Dazmol)', query: 'search=stayler' },
          { name: 'Soch jingalaklagichlar', query: 'search=jingalak' }
        ]
      },
      {
        title: { uz: 'Erkaklar parvarishi', ru: 'Для мужчин', en: 'Men care' },
        items: [
          { name: 'Elektr soqol olgichlar (Britva)', query: 'search=britva' },
          { name: 'Trimmerlar', query: 'search=trimmer' },
          { name: 'Soch olish mashinalari', query: 'search=mashinka' }
        ]
      },
      {
        title: { uz: 'Salomatlik', ru: 'Здоровье', en: 'Health' },
        items: [
          { name: 'Elektr tish cho\'tkalari', query: 'search=tish' },
          { name: 'Massajyorlar', query: 'search=massaj' },
          { name: 'Aqlli tarozilar', query: 'search=tarozi' }
        ]
      }
    ],
    brands: ['Dyson', 'Philips', 'Braun', 'Panasonic', 'Xiaomi', 'Remington', 'Rowenta']
  },
  {
    id: 'airConditioners',
    slug: 'airConditioners',
    nameKey: 'airConditioners',
    title: { uz: 'Konditsionerlar va iqlim', ru: 'Кондиционеры и климат', en: 'Air Conditioners & Climate' },
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&auto=format&fit=crop&q=80',
    count: 12,
    banner: {
      title: "Inverter konditsionerlar",
      subtitle: "Qishda isitadi, yozda sovutadi!",
      link: "/catalog?category=airConditioners"
    },
    subcategories: [
      {
        title: { uz: 'Konditsionerlar', ru: 'Кондиционеры', en: 'Air conditioners' },
        items: [
          { name: 'Inverter 09 (25 kv.m gacha)', query: 'search=09' },
          { name: 'Inverter 12 (35 kv.m gacha)', query: 'search=12' },
          { name: 'Inverter 18 (50 kv.m gacha)', query: 'search=18' },
          { name: 'Ustunli (Kolonniy) konditsioner', query: 'search=kolonniy' }
        ]
      },
      {
        title: { uz: 'Iqlim texnikasi', ru: 'Климатическая техника', en: 'Climate' },
        items: [
          { name: 'Havoni tozalagichlar', query: 'search=tozalagich' },
          { name: 'Havoni namlagichlar', query: 'search=namlagich' },
          { name: 'Suv isitgichlar (Ariston)', query: 'search=ariston' },
          { name: 'Isitgichlar (Konvektor)', query: 'search=isitgich' }
        ]
      }
    ],
    brands: ['Artel', 'LG', 'Samsung', 'Midea', 'AUX', 'Gree', 'Shivaki']
  },
];
