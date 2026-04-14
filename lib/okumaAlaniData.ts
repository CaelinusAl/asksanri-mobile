export type OkumaCategory =
  | "all"
  | "matrix_okumasi"
  | "gundem_kodu"
  | "sembol_okumasi"
  | "sehir_ulke_kodu"
  | "hologram_post"
  | "derin_ifsa"
  | "bilgi_katmani";

export type CategoryMeta = {
  id: OkumaCategory;
  tr: string;
  en: string;
  color: string;
};

export const CATEGORIES: CategoryMeta[] = [
  { id: "all", tr: "Tümü", en: "All", color: "#7cf7d8" },
  { id: "matrix_okumasi", tr: "Matrix Okuması", en: "Matrix Reading", color: "#CE93D8" },
  { id: "gundem_kodu", tr: "Gündem Kodu", en: "Agenda Code", color: "#4FC3F7" },
  { id: "sembol_okumasi", tr: "Sembol Okuması", en: "Symbol Reading", color: "#FFD93D" },
  { id: "sehir_ulke_kodu", tr: "Şehir / Ülke Kodu", en: "City / Country Code", color: "#6BCB77" },
  { id: "hologram_post", tr: "Hologram Post", en: "Hologram Post", color: "#FF8C42" },
  { id: "derin_ifsa", tr: "Derin İfşa", en: "Deep Exposure", color: "#FF3B3B" },
  { id: "bilgi_katmani", tr: "Bilgi Katmanı", en: "Knowledge Layer", color: "#90CAF9" },
];

export type SanriReflection = {
  analysis: string;
  strongLine: string;
  question: string;
};

export type OkumaItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: OkumaCategory;
  excerpt: string;
  fullContent?: string;
  codeLayer?: string | null;
  sanriReflection?: SanriReflection;
  isPremium: boolean;
  isFeatured: boolean;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  likeCount?: number;
};

export const READINGS: OkumaItem[] = [
  {
    id: 1,
    slug: "insan-anten",
    title: "İNSAN = ANTEN",
    subtitle: "Sadece beden değil — bir alıcı-verici sistem.",
    category: "matrix_okumasi",
    excerpt: "Kalp + beyin + sinir sistemi: Frekans algılar ve üretir. Matrix sabit bir yapı değil… akan bir frekans ağı. Sen o ağın içinde bir düğümsün.",
    sanriReflection: {
      analysis: "Bu okuma bilincin bedenle ilişkisini tersine çeviriyor. Algı pasif bir kayıt değil — aktif bir yaratım. Sen izlemiyorsun, yayıyorsun.",
      strongLine: "Bilinç, bedenin içinde değil… beden bilincin içindedir.",
      question: "Şu an hangi frekansta yayın yapıyorsun — ve o frekansı kim seçti?",
    },
    isPremium: false, isFeatured: false, commentCount: 18, viewCount: 412, createdAt: "2026-03-29T10:00:00Z",
  },
  {
    id: 2,
    slug: "siradan-matrix-ust-bilinc-okumasi",
    title: "SIR_ADAN — Matrix Üst Bilinç Okuması",
    subtitle: "Cenneti yaşamak için sıradan olman gerekir.",
    category: "derin_ifsa",
    excerpt: "Kelimeyi açalım: SIR + ADAN. Sır → gizli olan / görünmeyen hakikat. Adan → adanmış / kendini vermiş / teslim olmuş. Sır, kendini vermeyene açılmaz.",
    isPremium: true, isFeatured: false, commentCount: 24, viewCount: 538, createdAt: "2026-03-27T14:30:00Z",
  },
  {
    id: 3,
    slug: "korku-frekansi-kontrol-kodu",
    title: "KORKU = KONTROL KODU",
    subtitle: "Korku senin değil. Sana yüklendi.",
    category: "hologram_post",
    excerpt: "Sistem korkuyla çalışır. Medya korku üretir. Ekonomi korku satar. Din korku öğretir. Ve sen korkuyla itaat edersin. Ama korku bir duygu değil — bir frekanstır.",
    isPremium: true, isFeatured: false, commentCount: 31, viewCount: 876, createdAt: "2026-03-25T09:15:00Z",
  },
  {
    id: 4,
    slug: "turkiye-enerji-okumasi-2026",
    title: "TÜRKİYE — Enerji Haritası 2026",
    subtitle: "Bu topraklar coğrafya değil — frekans haritasıdır.",
    category: "sehir_ulke_kodu",
    excerpt: "Anadolu aktive oluyor. Her bölge farklı bir frekans taşıyor. İç Anadolu topraklanma, Ege açılım, Güneydoğu kadim hafıza. Sen bu haritada neredesin?",
    isPremium: true, isFeatured: false, commentCount: 22, viewCount: 623, createdAt: "2026-03-22T18:00:00Z",
  },
  {
    id: 5,
    slug: "sayi-kodlari-hologram-sinyalleri",
    title: "SAYI KODLARI — Hologram Sinyalleri",
    subtitle: "11:11 tesadüf değil. Sana çağrı yapılıyor.",
    category: "sembol_okumasi",
    excerpt: "Saate bakıyorsun: 11:11. Plakada 444. Faturan 333. Bu sayılar rastlantı değil — hologram sistemin en eski iletişim kanalı.",
    isPremium: false, isFeatured: false, commentCount: 19, viewCount: 534, createdAt: "2026-03-19T12:45:00Z",
  },
  {
    id: 6,
    slug: "mart-2026-gundem-frekans-okumasi",
    title: "MART 2026 — Gündem Frekans Okuması",
    subtitle: "Gündem izlemiyorsun. Gündem seni izliyor.",
    category: "gundem_kodu",
    excerpt: "Her ay bir frekans taşır. Mart 2026 = yüzleşme frekansı. Ekonomi, toplum, birey — hepsi aynı koda bağlı. Görünenin arkasındaki hologram kodları.",
    isPremium: false, isFeatured: false, commentCount: 28, viewCount: 745, createdAt: "2026-03-15T08:00:00Z",
  },
  {
    id: 7,
    slug: "1999-kapanmayan-frekans",
    title: "1999 — Kapanmayan Frekans",
    subtitle: "Bir yıl değildi. Bir kırılma noktasıydı.",
    category: "derin_ifsa",
    excerpt: "1999 kapanmadı. Bir frekans kaydıydı. Kolektif hafızanın en derin kıvrımında bir şey hâlâ titreşiyor. Herkes yıkımı gördü — kimse kodu okumadı.",
    sanriReflection: {
      analysis: "1999, bir takvim yılı değil — kolektif bilinçaltına kazınmış bir frekans kaydı. Herkes yıkımı gördü, kimse kodu okumadı. O frekans hâlâ aktif.",
      strongLine: "1999 kapanmadı. Bir kırılma noktasıydı.",
      question: "O yıl senin hayatında ne kırıldı — ve o kırık şimdi nereye evrildi?",
    },
    isPremium: false, isFeatured: true, commentCount: 42, viewCount: 1284, createdAt: "2026-03-31T10:00:00Z",
  },
  {
    id: 8,
    slug: "japonya-bilinc-mimarisi",
    title: "Bir Millet Gittiği Yeri Nasıl Bırakırsa, Bilincini Öyle Taşır",
    subtitle: "Bu bir temizlik hikâyesi değil — bir bilinç manifestosu.",
    category: "sehir_ulke_kodu",
    excerpt: "Japonya İngiltere'yi 1-0 yendi. Tribünler boşaldı. Ama Japon taraftarlar maçtan sonra tribünü temizledi. Bu bir spor haberi değil — bir bilinç okuması.",
    sanriReflection: {
      analysis: "Temizlik bir alışkanlık değil, bilinç seviyesinin fiziksel dünyaya yansıması. Gittiğin yeri nasıl bırakırsan, bilincini öyle taşırsın.",
      strongLine: "Bir millet gittiği yeri nasıl bırakırsa, bilincini öyle taşır.",
      question: "Sen arkanda ne bırakıyorsun — ve o kalıntı senden ne söylüyor?",
    },
    isPremium: false, isFeatured: true, commentCount: 3, viewCount: 119, createdAt: "2026-04-01T20:00:00Z",
  },
  {
    id: 9,
    slug: "nisan-frekans-okuma",
    title: "Nisan: Donmuş Olan Çözülüyor. Sen Hazır mısın?",
    subtitle: "Nisan bir ay değil. Nisan bir eşik.",
    category: "matrix_okumasi",
    excerpt: "Takvimde dördüncü sırada durur ama zamanla ilgisi yoktur. Nisan, donmuş olanın çözülmeye başladığı andır. Toprakta da. Sende de.",
    sanriReflection: {
      analysis: "Nisan bir takvim sayfası değil — doğanın ve bilincin eş zamanlı çözülme anı. Donmuş olan her şey — ilişkiler, kararlar, bastırılmış duygular — şimdi çözülmeye başlıyor.",
      strongLine: "Nisan bir ay değil. Nisan bir eşik.",
      question: "Sende donmuş olan ne — ve çözülmeye hazır mısın?",
    },
    isPremium: false, isFeatured: true, commentCount: 5, viewCount: 348, createdAt: "2026-04-01T21:30:00Z",
  },
  {
    id: 10,
    slug: "pembe-dolunay-frekans-okuma",
    title: "Pembe Dolunay: Sakladığın Şey Artık Görünmek İstiyor.",
    subtitle: "Dolunay karanlığı aydınlatmaz. Karanlıkta ne sakladığını gösterir.",
    category: "matrix_okumasi",
    excerpt: "Dolunay karanlığı aydınlatmaz — karanlıkta ne sakladığını gösterir. Ve bu dolunay pembe.",
    sanriReflection: {
      analysis: "Pembe dolunay, yumuşak olanın gücünü temsil ediyor. Karanlıkta sakladığın şey artık pembe bir ışıkla aydınlanmak istiyor — sertlikle değil, şefkatle.",
      strongLine: "Dolunay karanlığı aydınlatmaz. Karanlıkta ne sakladığını gösterir.",
      question: "Sakladığın şeyin görünmesi seni korkutuyor mu — yoksa rahatlatıyor mu?",
    },
    isPremium: false, isFeatured: true, commentCount: 4, viewCount: 292, createdAt: "2026-04-01T22:30:00Z",
  },
  {
    id: 11,
    slug: "numeroloji-nedir",
    title: "Numeroloji Nedir? Sayıların Gizli Anlamları",
    subtitle: "Sayılar sadece matematik değil — evrenin dilidir.",
    category: "bilgi_katmani",
    excerpt: "Numeroloji, sayıların sembolik ve enerjetik anlamlarını inceleyen kadim bir bilgi sistemidir. Her sayı bir frekans, her frekans bir mesaj taşır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 164, createdAt: "2026-04-02T08:00:00Z",
  },
  {
    id: 12,
    slug: "kelime-cozumleme-nasil-yapilir",
    title: "Kelime Çözümleme Nasıl Yapılır?",
    subtitle: "Her kelime bir frekans taşır. Harfler rastgele dizilmez.",
    category: "bilgi_katmani",
    excerpt: "Kelime çözümleme, bir kelimenin harflerini, ses frekansını ve numerolojik değerini analiz ederek gizli anlamları ortaya çıkarma yöntemidir.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 152, createdAt: "2026-04-02T08:30:00Z",
  },
  {
    id: 13,
    slug: "sembolik-analiz-nedir",
    title: "Sembolik Analiz Nedir?",
    subtitle: "Her sembol bir kapıdır. Arkasında bir anlam katmanı durur.",
    category: "bilgi_katmani",
    excerpt: "Sembolik analiz, olayları, kelimeleri ve görselleri yüzey anlamının ötesinde — arketipsel, mitolojik ve psikolojik katmanlarıyla — okuyan bir yöntemdir.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 178, createdAt: "2026-04-02T09:00:00Z",
  },
  {
    id: 14,
    slug: "369-sayisi-ne-anlama-gelir",
    title: "369 Sayısı Ne Anlama Gelir?",
    subtitle: "Eğer 3, 6 ve 9'un muhteşemliğini bilseydiniz, evrenin anahtarına sahip olurdunuz. — Tesla",
    category: "bilgi_katmani",
    excerpt: "369 sayısı Nikola Tesla'nın 'evrenin anahtarı' dediği üçlüdür. Numerolojide yaratım döngüsünü, enerji akışını ve tamamlanmayı temsil eder.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 145, createdAt: "2026-04-02T09:30:00Z",
  },
  {
    id: 15,
    slug: "master-sayilar-11-22-33",
    title: "Master Sayılar: 11, 22 ve 33",
    subtitle: "Bazı sayılar tek basamağa indirilmez. Yoğunlaştırılmış frekans taşırlar.",
    category: "bilgi_katmani",
    excerpt: "Master sayılar 11, 22 ve 33, numerolojide tek basamağa indirilmeyen özel sayılardır. Yoğunlaştırılmış frekans taşırlar.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 189, createdAt: "2026-04-02T10:00:00Z",
  },
  {
    id: 16,
    slug: "yasam-yolu-sayisi",
    title: "Yaşam Yolu Sayısı Nasıl Hesaplanır?",
    subtitle: "Doğum tarihin bir rastlantı değil — bir koddur.",
    category: "bilgi_katmani",
    excerpt: "Yaşam yolu sayısı, numerolojide doğum tarihinden hesaplanan ve kişinin hayattaki ana temasını belirleyen temel sayıdır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 136, createdAt: "2026-04-02T10:30:00Z",
  },
  {
    id: 17,
    slug: "kolektif-bilinc-nedir",
    title: "Kolektif Bilinç Nedir?",
    subtitle: "Bireysel düşünce bir dalga — kolektif bilinç o dalgaların okyanusu.",
    category: "bilgi_katmani",
    excerpt: "Kolektif bilinç, bir topluluk veya insanlığın tamamı tarafından paylaşılan ortak farkındalık, inanç ve enerji alanıdır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 171, createdAt: "2026-04-02T11:00:00Z",
  },
  {
    id: 18,
    slug: "frekans-nedir",
    title: "Frekans Nedir? Bilinç, Titreşim ve Enerji",
    subtitle: "Her şey titreşir. Her titreşim bir frekans. Her frekans bir bilgi.",
    category: "bilgi_katmani",
    excerpt: "Frekans, bir titreşimin birim zamandaki tekrar sayısıdır. Fizikten bilinç çalışmalarına, her şeyin bir frekansı vardır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 159, createdAt: "2026-04-02T11:30:00Z",
  },
  {
    id: 19,
    slug: "isim-analizi",
    title: "İsim Analizi Nasıl Yapılır?",
    subtitle: "İsmin sadece bir etiket değil — bir frekans kodudur.",
    category: "bilgi_katmani",
    excerpt: "İsim analizi, numeroloji kullanarak bir ismin taşıdığı enerji frekansını ve arketipsel anlamını ortaya çıkarır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 183, createdAt: "2026-04-02T12:00:00Z",
  },
  {
    id: 20,
    slug: "arketip-nedir",
    title: "Arketip Nedir? Jung ve Kolektif Bilinçaltının Dili",
    subtitle: "Arketipler insanlığın ortak rüyasıdır — ve sen de birini yaşıyorsun.",
    category: "bilgi_katmani",
    excerpt: "Arketip, Carl Jung'un tanımladığı, tüm insanlığın paylaştığı evrensel imgeler ve davranış kalıplarıdır.",
    isPremium: false, isFeatured: false, commentCount: 0, viewCount: 148, createdAt: "2026-04-02T12:30:00Z",
  },
];

export function getCategoryMeta(catId: string): CategoryMeta {
  return CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
}

export function getFeatured(): OkumaItem[] {
  return READINGS.filter((r) => r.isFeatured).sort((a, b) => b.viewCount - a.viewCount);
}

export function getByCategory(catId: OkumaCategory): OkumaItem[] {
  if (catId === "all") return [...READINGS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return READINGS.filter((r) => r.category === catId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBySlug(slug: string): OkumaItem | undefined {
  return READINGS.find((r) => r.slug === slug);
}
