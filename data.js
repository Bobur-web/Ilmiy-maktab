// ===== SAMPLE DATA FOR THE PLATFORM =====

const SCHOLARS_DATA = [
  {
    id: 1,
    name: "Prof. Abdullayev Sherzod Karimovich",
    title: "Fizika-matematika fanlari doktori",
    department: "Nazariy fizika kafedrasi",
    image: "",
    bio: "30 yildan ortiq ilmiy tajribaga ega. Kvant mexanikasi va statistik fizika bo'yicha 150 dan ortiq ilmiy maqola muallifi.",
    publications: 156,
    hIndex: 24,
    email: "abdullayev@uzresearch.uz",
    fields: ["Kvant mexanikasi", "Statistik fizika", "Nazariy fizika"]
  },
  {
    id: 2,
    name: "Prof. Karimova Nilufar Rashidovna",
    title: "Biologiya fanlari doktori",
    department: "Molekulyar biologiya kafedrasi",
    image: "",
    bio: "Genetika va molekulyar biologiya sohasida xalqaro miqyosda tan olingan olim. 5 ta xalqaro patent egasi.",
    publications: 98,
    hIndex: 19,
    email: "karimova@uzresearch.uz",
    fields: ["Genetika", "Molekulyar biologiya", "Biotexnologiya"]
  },
  {
    id: 3,
    name: "Prof. Rahimov Jasur Bahodirovich",
    title: "Kimyo fanlari doktori",
    department: "Organik kimyo kafedrasi",
    image: "",
    bio: "Organik kimyo va farmatsevtika sohasida yetakchi mutaxassis. Yangi dori vositalarini ishlab chiqish bo'yicha ko'plab loyihalarda qatnashgan.",
    publications: 124,
    hIndex: 21,
    email: "rahimov@uzresearch.uz",
    fields: ["Organik kimyo", "Farmatsevtika", "Dori kimyosi"]
  },
  {
    id: 4,
    name: "Prof. Toshmatov Alisher Nuriddinovich",
    title: "Texnika fanlari doktori",
    department: "Axborot texnologiyalari kafedrasi",
    image: "",
    bio: "Sun'iy intellekt va mashinali o'rganish sohasida 20 yillik tajribaga ega. O'zbekistonda AI tadqiqotlarining asoschisi.",
    publications: 87,
    hIndex: 17,
    email: "toshmatov@uzresearch.uz",
    fields: ["Sun'iy intellekt", "Mashinali o'rganish", "Ma'lumotlar ilmi"]
  },
  {
    id: 5,
    name: "Prof. Mirzayeva Dildora Anvarovna",
    title: "Filologiya fanlari doktori",
    department: "Tilshunoslik kafedrasi",
    image: "",
    bio: "O'zbek tili tarixi va dialektologiyasi bo'yicha taniqli olim. 10 ta monografiya va 200 dan ortiq ilmiy maqola muallifi.",
    publications: 213,
    hIndex: 15,
    email: "mirzayeva@uzresearch.uz",
    fields: ["Tilshunoslik", "Dialektologiya", "Turkiy tillar"]
  },
  {
    id: 6,
    name: "Prof. Nazarov Bobur Erkinovich",
    title: "Iqtisodiyot fanlari doktori",
    department: "Iqtisodiy nazariya kafedrasi",
    image: "",
    bio: "Makroiqtisodiyot va moliyaviy bozorlar sohasida ko'plab tadqiqotlar olib borgan. Xalqaro valyuta jamg'armasi maslahatchisi.",
    publications: 145,
    hIndex: 22,
    email: "nazarov@uzresearch.uz",
    fields: ["Makroiqtisodiyot", "Moliyaviy bozorlar", "Ekonometrika"]
  }
];

const NEWS_DATA = [
  {
    id: 1,
    title: "Xalqaro ilmiy konferensiya — 2026",
    date: "2026-03-10",
    category: "Konferensiya",
    image: "",
    summary: "Ilmiy maktabimiz tomonidan tashkil etilgan xalqaro konferensiyada 30 dan ortiq mamlakatdan olimlar ishtirok etdi.",
    content: "2026-yil 10-mart kuni ilmiy maktabimiz tomonidan \"Zamonaviy fan va texnologiyalar\" mavzusida xalqaro ilmiy konferensiya tashkil etildi. Konferensiyada 30 dan ortiq mamlakatdan 500 ga yaqin olim va tadqiqotchi ishtirok etdi. Konferensiya davomida kvant hisoblash, sun'iy intellekt, biotexnologiya va boshqa yo'nalishlarda eng so'nggi tadqiqot natijalari muhokama qilindi."
  },
  {
    id: 2,
    title: "Yangi laboratoriya ochildi",
    date: "2026-03-05",
    category: "Yangilik",
    image: "",
    summary: "Zamonaviy nanotexnologiya laboratoriyasi rasmiy ravishda foydalanishga topshirildi.",
    content: "Ilmiy maktabimizda zamonaviy Nanotexnologiya laboratoriyasi rasmiy ravishda ochildi. Laboratoriya eng zamonaviy uskunalar bilan jihozlangan bo'lib, nanomateriallar sintezi, tahlili va sinovdan o'tkazish imkoniyatini beradi."
  },
  {
    id: 3,
    title: "Grant dasturi e'lon qilindi",
    date: "2026-02-28",
    category: "Grant",
    image: "",
    summary: "Yosh olimlar uchun maxsus ilmiy grant dasturi e'lon qilindi. Muddati: 2026-yil 1-may.",
    content: "Ilmiy maktabimiz yosh olimlar va tadqiqotchilar uchun maxsus grant dasturini e'lon qildi. Grant miqdori har bir loyiha uchun 50 million so'mgacha bo'lib, fizika, kimyo, biologiya va IT yo'nalishlari bo'yicha loyihalar qabul qilinadi."
  },
  {
    id: 4,
    title: "Xalqaro hamkorlik shartnomasi imzolandi",
    date: "2026-02-20",
    category: "Hamkorlik",
    image: "",
    summary: "MIT universiteti bilan ilmiy hamkorlik shartnomasi imzolandi.",
    content: "Ilmiy maktabimiz va Massachusetts texnologiya instituti (MIT) o'rtasida ilmiy hamkorlik shartnomasi imzolandi. Shartnoma doirasida qo'shma tadqiqotlar, professor-o'qituvchilar almashinuvi va talabalar uchun stajirovka dasturlari amalga oshiriladi."
  },
  {
    id: 5,
    title: "Ilmiy maqola eng yaxshi deb topildi",
    date: "2026-02-15",
    category: "Yutuq",
    image: "",
    summary: "Prof. Abdullayevning maqolasi Nature jurnalida yilning eng yaxshi maqolasi deb topildi.",
    content: "Ilmiy maktabimiz professori Abdullayev Sherzod Karimovichning kvant mexanikasi bo'yicha maqolasi nufuzli Nature jurnalida 2025-yilning eng yaxshi maqolalaridan biri deb tan olindi."
  },
  {
    id: 6,
    title: "Talabalar olimpiadada g'olib bo'ldi",
    date: "2026-02-10",
    category: "Yutuq",
    image: "",
    summary: "Ilmiy maktab talabalari xalqaro matematika olimpiadasida oltin medal qo'lga kiritdi.",
    content: "Xalqaro matematika olimpiadasida ilmiy maktabimiz talabalari 3 ta oltin va 2 ta kumush medal qo'lga kiritdi. Bu natija maktabimiz tarixidagi eng yaxshi ko'rsatkich hisoblanadi."
  }
];

const BOOKS_DATA = [
  {
    id: 1,
    title: "Kvant mexanikasi asoslari",
    author: "Prof. Abdullayev Sh.K.",
    price: 85000,
    category: "Fizika",
    type: "paid",
    format: "online",
    cover: "",
    description: "Kvant mexanikasining fundamental tushunchalari, Shryodinger tenglamasi, kvant holatlari va o'lchov nazariyasi haqida to'liq qo'llanma.",
    pages: 420,
    year: 2025,
    isbn: "978-9943-01-001-1",
    rating: 4.8,
    reviews: 45,
    sampleContent: "Kvant mexanikasi — fizikaning subatomik zarralar xatti-harakatlarini o'rganadigan sohasi. Bu fanning asosiy tamoyillari klassik mexanikadan tubdan farq qiladi.\n\n1-bob: Kvant nazariyasiga kirish\n\nKvant nazariyasi XX asr boshlarida paydo bo'lgan. Maks Plank energiyaning uzlukli miqdorlarda — kvantlarda chiqarilishini kashf etdi.\n\nPlankning kvant gipotezasi:\nE = hν\n\nbu yerda:\n- E — energiya\n- h — Plank doimiysi (6.626 × 10⁻³⁴ J·s)\n- ν — chastota\n\n2-bob: To'lqin-zarracha dualizmı\n\nLui de Broyl 1924-yilda barcha moddiy zarralar to'lqin xususiyatlariga ega ekanligini taklif qildi."
  },
  {
    id: 2,
    title: "Molekulyar biologiya",
    author: "Prof. Karimova N.R.",
    price: 0,
    category: "Biologiya",
    type: "free",
    format: "online",
    cover: "",
    description: "Molekulyar biologiyaning zamonaviy usullari va genlar ifodasi mexanizmlari haqida batafsil ma'lumot.",
    pages: 350,
    year: 2024,
    isbn: "978-9943-01-002-8",
    rating: 4.6,
    reviews: 32,
    sampleContent: "Molekulyar biologiya — tirik organizmlarning molekulyar darajadagi tuzilishi va funksiyalarini o'rganadigan fan.\n\n1-bob: DNK tuzilishi\n\nDezoksiribonuklein kislotasi (DNK) — barcha tirik organizmlarning irsiy ma'lumotini saqlovchi molekula. Watson va Krik 1953-yilda DNKning ikki spiralli tuzilishini kashf etdilar.\n\nDNK tarkibi:\n- Adenin (A)\n- Timin (T)\n- Guanin (G)\n- Sitozin (C)\n\n2-bob: Genlar ifodasi\n\nGen — DNKning ma'lum bir oqsilni kodlovchi qismi. Genlar ifodasi jarayoni ikki bosqichdan iborat:\n1. Transkripsiya — DNKdan mRNK sintezi\n2. Translyatsiya — mRNKdan oqsil sintezi"
  },
  {
    id: 3,
    title: "Organik kimyo praktikumi",
    author: "Prof. Rahimov J.B.",
    price: 65000,
    category: "Kimyo",
    type: "paid",
    format: "offline",
    cover: "",
    description: "Organik kimyo laboratoriya ishlari va amaliy mashg'ulotlar uchun qo'llanma. Barcha tajribalar batafsil tushuntirilgan.",
    pages: 280,
    year: 2025,
    isbn: "978-9943-01-003-5",
    rating: 4.5,
    reviews: 28,
    sampleContent: ""
  },
  {
    id: 4,
    title: "Sun'iy intellektga kirish",
    author: "Prof. Toshmatov A.N.",
    price: 0,
    category: "IT",
    type: "free",
    format: "online",
    cover: "",
    description: "Sun'iy intellekt, mashinali o'rganish va chuqur o'rganish texnologiyalari haqida boshlang'ich qo'llanma.",
    pages: 380,
    year: 2026,
    isbn: "978-9943-01-004-2",
    rating: 4.9,
    reviews: 67,
    sampleContent: "Sun'iy intellekt (AI) — kompyuter tizimlariga inson kabi fikrlash va qaror qabul qilish qobiliyatini berishga qaratilgan fan sohasi.\n\n1-bob: AI tarixi\n\nSun'iy intellekt atamasi birinchi marta 1956-yilda Dartmut konferensiyasida ishlatilgan. O'shandan beri AI bir necha rivojlanish bosqichlarini boshdan kechirdi.\n\nAI rivojlanish bosqichlari:\n- 1950-1970: Dastlabki AI tizimlari\n- 1970-1990: Ekspert tizimlar davri\n- 1990-2010: Mashinali o'rganish\n- 2010-hozir: Chuqur o'rganish inqilobi\n\n2-bob: Mashinali o'rganish\n\nMashinali o'rganish — kompyuter tizimlarining ma'lumotlardan o'rganish va tajriba asosida yaxshilanish qobiliyati.\n\nTurlari:\n1. Nazorat ostida o'rganish\n2. Nazoratsiz o'rganish\n3. Mustahkamlash orqali o'rganish"
  },
  {
    id: 5,
    title: "O'zbek tilining tarixi",
    author: "Prof. Mirzayeva D.A.",
    price: 55000,
    category: "Filologiya",
    type: "paid",
    format: "online",
    cover: "",
    description: "O'zbek tilining shakllanishi, taraqqiyoti va zamonaviy holatini o'rganish uchun fundamental asar.",
    pages: 460,
    year: 2024,
    isbn: "978-9943-01-005-9",
    rating: 4.7,
    reviews: 39,
    sampleContent: "O'zbek tili — turkiy tillar oilasiga mansub bo'lib, O'zbekiston Respublikasining davlat tilidir.\n\n1-bob: Turkiy tillar oilasi\n\nTurkiy tillar oilasi dunyodagi eng katta til oilalaridan biri bo'lib, Turkiyadan Sibgirgacha cho'zilgan hududda tarqalgan.\n\nAsosiy turkiy tillar:\n- O'zbek tili\n- Turkman tili\n- Qozoq tili\n- Qirg'iz tili\n- Turk tili\n- Ozarbayjon tili\n\n2-bob: O'zbek tilining shakllanishi\n\nO'zbek tili qadimgi turkiy tildan ajralib chiqqan. Uning shakllanishida bir necha bosqichlar ajratiladi."
  },
  {
    id: 6,
    title: "Makroiqtisodiyot nazariyasi",
    author: "Prof. Nazarov B.E.",
    price: 72000,
    category: "Iqtisodiyot",
    type: "paid",
    format: "offline",
    cover: "",
    description: "Makroiqtisodiy tahlil usullari, milliy hisoblar tizimi va iqtisodiy o'sish modellari.",
    pages: 340,
    year: 2025,
    isbn: "978-9943-01-006-6",
    rating: 4.4,
    reviews: 22,
    sampleContent: ""
  },
  {
    id: 7,
    title: "Differensial tenglamalar",
    author: "Prof. Abdullayev Sh.K.",
    price: 0,
    category: "Matematika",
    type: "free",
    format: "online",
    cover: "",
    description: "Oddiy va xususiy hosilali differensial tenglamalarning yechish usullari va tatbiqlari.",
    pages: 300,
    year: 2025,
    isbn: "978-9943-01-007-3",
    rating: 4.7,
    reviews: 51,
    sampleContent: "Differensial tenglamalar — noma'lum funksiya va uning hosilalari orasidagi munosabatni ifodalovchi tenglamalar.\n\n1-bob: Asosiy tushunchalar\n\nDifferensial tenglama — bir yoki bir nechta noma'lum funksiyani, ularning hosilalarini va mustaqil o'zgaruvchini o'z ichiga olgan tenglama.\n\nMisol:\ndy/dx + 2y = 0\n\nBu birinchi tartibli chiziqli oddiy differensial tenglama.\n\n2-bob: Ajratiladigan o'zgaruvchili tenglamalar\n\nAgar differensial tenglamani quyidagi ko'rinishga keltirish mumkin bo'lsa:\nf(y)dy = g(x)dx\n\nu holda tenglama ajratiladigan o'zgaruvchili deyiladi."
  },
  {
    id: 8,
    title: "Biotexnologiya asoslari",
    author: "Prof. Karimova N.R.",
    price: 48000,
    category: "Biologiya",
    type: "paid",
    format: "online",
    cover: "",
    description: "Zamonaviy biotexnologiya usullari: gen muhandisligi, klonlash va tibbiy biotexnologiya.",
    pages: 320,
    year: 2026,
    isbn: "978-9943-01-008-0",
    rating: 4.5,
    reviews: 18,
    sampleContent: "Biotexnologiya — tirik organizmlar yoki ularning qismlarini ishlab chiqarish jarayonlarida qo'llash fani.\n\n1-bob: Biotexnologiyaning tarixi\n\nBiotexnologiya atamasini birinchi marta 1919-yilda venger muhandisi Karl Ereki ishlatgan.\n\nBiotexnologiya avlodlari:\n- 1-avlod: An'anaviy biotexnologiya (non pishirish, pivo tayyorlash)\n- 2-avlod: Klassik biotexnologiya (antibiotiklar ishlab chiqarish)\n- 3-avlod: Zamonaviy biotexnologiya (gen muhandisligi)"
  }
];

// Default admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@uzresearch.uz",
  password: "admin123"
};

// Default normal users
const DEFAULT_USERS = [
  {
    id: 1,
    name: "Demo Foydalanuvchi",
    email: "user@uzresearch.uz",
    phone: "+998 90 123 45 67",
    password: "user123",
    registeredAt: "2026-03-01T10:00:00.000Z"
  }
];

// Default site settings
const DEFAULT_SITE_SETTINGS = {
  heroTitle: "Ilm-fan kelajakni yaratadi",
  heroSubtitle: "Zamonaviy tadqiqotlar, ilmiy maqolalar va ta'lim resurslari — barchasi bir joyda. Bilim olishning yangi bosqichi shu yerdan boshlanadi.",
  stat1Title: "Ilmiy maqolalar",
  stat1Value: 2500,
  stat2Title: "Faol a'zolar",
  stat2Value: 1200,
  stat3Title: "Xalqaro hamkorlar",
  stat3Value: 45,
  stat4Title: "O'quv adabiyotlar",
  stat4Value: 350,
  contactPhone: "+998 71 234 56 78",
  contactEmail: "info@uzresearch.uz",
  contactAddress: "Toshkent sh., Universitet ko'chasi, 4",
  facebookUrl: "#",
  telegramUrl: "#",
  instagramUrl: "#"
};

// Default Theme Settings (Academic Nexus - Lighter Variant)
const DEFAULT_THEME = {
  bgPrimary: "#f8f9fa",
  bgSecondary: "#ffffff",
  accentGold: "#c5a059",
  accentTeal: "#2f6f88",
  accentPurple: "#8e9aaf"
};

// Force apply new theme on next load if this script gets updated
localStorage.removeItem('uzr_theme');

// Default Menus
const DEFAULT_MENUS = [
  { id: 1, text: "Bosh sahifa", url: "index.html" },
  { id: 2, text: "Yangiliklar", url: "news.html" },
  { id: 3, text: "Olimlar", url: "scholars.html" },
  { id: 4, text: "Adabiyotlar", url: "books.html" },
  { id: 5, text: "Bog'lanish", url: "contact.html" }
];

// Initialize data in localStorage if not exists
function initializeData() {
  if (!localStorage.getItem('uzr_books')) {
    localStorage.setItem('uzr_books', JSON.stringify(BOOKS_DATA));
  }
  if (!localStorage.getItem('uzr_scholars')) {
    localStorage.setItem('uzr_scholars', JSON.stringify(SCHOLARS_DATA));
  }
  if (!localStorage.getItem('uzr_news')) {
    localStorage.setItem('uzr_news', JSON.stringify(NEWS_DATA));
  }
  let existingUsers = localStorage.getItem('uzr_users');
  if (!existingUsers || existingUsers === '[]') {
    localStorage.setItem('uzr_users', JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem('uzr_orders')) {
    localStorage.setItem('uzr_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('uzr_cart')) {
    localStorage.setItem('uzr_cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('uzr_site_settings')) {
    localStorage.setItem('uzr_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
  }
  if (!localStorage.getItem('uzr_theme')) {
    localStorage.setItem('uzr_theme', JSON.stringify(DEFAULT_THEME));
  }
  if (!localStorage.getItem('uzr_menus')) {
    localStorage.setItem('uzr_menus', JSON.stringify(DEFAULT_MENUS));
  }
}

// Data access helpers
function getData(key) {
  return JSON.parse(localStorage.getItem('uzr_' + key) || '[]');
}

function setData(key, data) {
  localStorage.setItem('uzr_' + key, JSON.stringify(data));
}

initializeData();
