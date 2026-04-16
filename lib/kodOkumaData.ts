export type Lesson = {
  id: string;
  moduleId: number;
  order: number;
  title: string;
  shortDescription: string;
  duration: string;
  isFree: boolean;
};

export type Module = {
  id: number;
  titleTR: string;
  titleEN: string;
  subtitleTR: string;
  subtitleEN: string;
  icon: string;
  lessons: Lesson[];
};

const M1_LESSONS: Lesson[] = [
  { id: "kod-nedir", moduleId: 1, order: 1, title: "Kod Nedir?", shortDescription: "Gördüğün şeyin altında başka bir katman olduğunu fark et.", duration: "8 dk", isFree: true },
  { id: "insan-kod", moduleId: 1, order: 2, title: "İnsan = Kod", shortDescription: "İsim, anlam parçaları ve senin hikâyenin yapı taşları.", duration: "9 dk", isFree: true },
  { id: "kelimeyi-parcalamak", moduleId: 1, order: 3, title: "Kelimeyi Parçalamak", shortDescription: "Kelimeyi harf ve heceye bölmek; kökün sana fısıldadığını duymak.", duration: "9 dk", isFree: false },
  { id: "anlam-katmanlari", moduleId: 1, order: 4, title: "Anlam Katmanları", shortDescription: "Yüzey, alt katman, derin katman — üç seviyede okuma.", duration: "10 dk", isFree: false },
  { id: "tekrar-eden-kelimeler", moduleId: 1, order: 5, title: "Tekrar Eden Kelimeler", shortDescription: "Aynı kelimenin farklı ağızlardan gelmesi — dikkat çeken tema.", duration: "10 dk", isFree: false },
  { id: "ic-ses-ayrimi", moduleId: 1, order: 6, title: "Sana Ait Olan / Olmayan İç Ses", shortDescription: "Hangi düşünce senin, hangisi taşınan?", duration: "11 dk", isFree: false },
  { id: "ilk-okuma-pratigi", moduleId: 1, order: 7, title: "İlk Okuma Pratiği", shortDescription: "Kısa bir metni kod gibi oku; sonuç değil süreç.", duration: "12 dk", isFree: false },
];

const M2_LESSONS: Lesson[] = [
  { id: "donguler-tekrar", moduleId: 2, order: 1, title: "Döngüler ve Tekrar", shortDescription: "Aynı his, farklı yüzler; köken aile ve bedende.", duration: "14 dk", isFree: false },
  { id: "karmik-bag-nedir", moduleId: 2, order: 2, title: "Karmik Bağ Nedir?", shortDescription: "Bırakılamayan çekim: yoğun yakınlık, yoğun yıkım.", duration: "15 dk", isFree: false },
  { id: "ruhsal-bag-travma-bagi", moduleId: 2, order: 3, title: "Ruhsal Bağ ve Travma Bağı", shortDescription: "Gerçek bağ ile bağımlılık: 'onsuz yapamam' hangi kodun dilidir?", duration: "14 dk", isFree: false },
  { id: "neden-aldatiliriz", moduleId: 2, order: 4, title: "Neden Aldatılırız?", shortDescription: "Rol kırılması, görmezden gelinen sinyaller, kendini terk ettiğin yer.", duration: "15 dk", isFree: false },
  { id: "neden-kandiriliriz", moduleId: 2, order: 5, title: "Neden Kandırılırız?", shortDescription: "Görmek istemediğin şeyi görmezsin; sezgi bastırılır.", duration: "14 dk", isFree: false },
  { id: "disil-eril-kodlar", moduleId: 2, order: 6, title: "Dişil ve Eril Kodlar", shortDescription: "Bağlanma ve akış; yön ve sınır — dengesizlikte ilişki kırılır.", duration: "14 dk", isFree: false },
  { id: "duygu-kodlari-kritik", moduleId: 2, order: 7, title: "Duygu Kodları", shortDescription: "Terk edilme, değersizlik, kontrol, görünmeme — ilişkinin motoru.", duration: "16 dk", isFree: false },
];

const M3_LESSONS: Lesson[] = [
  { id: "olay-kodlama", moduleId: 3, order: 1, title: "Olay Kodlama", shortDescription: "Haber ve olayı üç satırda okumak: ne oldu, ne hissettirdi, ne çağrıştırdı.", duration: "12 dk", isFree: false },
  { id: "sistem-mesajlari", moduleId: 3, order: 2, title: "Sistem Mesajları", shortDescription: "Kolektif gündemin tekrarlayan temalarını ayırt etmek.", duration: "13 dk", isFree: false },
  { id: "kisisel-matrix", moduleId: 3, order: 3, title: "Kişisel Matrix", shortDescription: "Hayatının 'kuralları': nerede aynı hamleyi yapıyorsun?", duration: "14 dk", isFree: false },
  { id: "kor-noktalar", moduleId: 3, order: 4, title: "Kör Noktalar", shortDescription: "Görmemek için kullandığın stratejiler: meşguliyet, şaka, erteleme.", duration: "12 dk", isFree: false },
  { id: "kirilma-noktalari", moduleId: 3, order: 5, title: "Kırılma Noktaları", shortDescription: "Kriz anında kaybedilen ve kazanılan: eski rol mü, yeni yön mü?", duration: "13 dk", isFree: false },
  { id: "kendi-kodunu-yaz", moduleId: 3, order: 6, title: "Kendi Kodunu Yaz", shortDescription: "Kendi sistemin: kuralların, işaretlerin, dilin.", duration: "14 dk", isFree: false },
  { id: "final-hatirlama", moduleId: 3, order: 7, title: "Final — Hatırlama", shortDescription: "Kapanış: öğrenmedin; hatırladın.", duration: "10 dk", isFree: false },
];

export const MODULES: Module[] = [
  {
    id: 1,
    titleTR: "MODÜL 1 — KODU GÖRMEK",
    titleEN: "MODULE 1 — SEE THE CODE",
    subtitleTR: "Gördüğün şeyin altında başka bir katman olduğunu fark et.",
    subtitleEN: "Realize there is another layer beneath what you see.",
    icon: "◇",
    lessons: M1_LESSONS,
  },
  {
    id: 2,
    titleTR: "MODÜL 2 — İLİŞKİ KODLARI",
    titleEN: "MODULE 2 — RELATIONSHIP CODES",
    subtitleTR: "Döngü ve tekrar, köken ve karmik bağ, dişil–eril kodlar, duygu motorları.",
    subtitleEN: "Cycles, origins, karmic bonds, feminine–masculine codes, emotion drivers.",
    icon: "☽",
    lessons: M2_LESSONS,
  },
  {
    id: 3,
    titleTR: "MODÜL 3 — MATRIX OKUMA",
    titleEN: "MODULE 3 — READ THE MATRIX",
    subtitleTR: "Olay, sistem ve kişisel hayatı mesaj olarak görmek.",
    subtitleEN: "See events, systems, and personal life as messages.",
    icon: "◉",
    lessons: M3_LESSONS,
  },
];

export const ALL_LESSONS: Lesson[] = [...M1_LESSONS, ...M2_LESSONS, ...M3_LESSONS];

export function getModuleForLesson(lessonId: string): Module | undefined {
  return MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx >= ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[idx + 1];
}
