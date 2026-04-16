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

  // ─── #32 — 7: BÖLÜNMEYEN SAYI ────────────────────────────────────
  {
    id: 32,
    slug: "7-bolunmeyen-sayi-ust-bilinc-okumasi",
    title: "7 — Bölünmeyen Sayı",
    subtitle: "7 bir rakam değil. 7 bir eşik. Her şeyin tamamlandığı ve hiçbir şeyin bölünemediği frekans.",
    category: "sembol_okumasi",
    excerpt: "YEDİ = YE + Dİ. Yedi. Tüketti. İçine aldı. 7 her şeyi içine alan sayıdır. 7 çakra, 7 gök katı, 7 ayet, 7 nota, 7 renk. Bölünmez. Parçalanmaz. Asal. Senin içindeki 7 ne diyor?",
    fullContent: `7.

Bir rakam değil.
Bir eşik.

Her döngünün durduğu,
her kapının açıldığı,
her sorunun sorulduğu nokta.

◉ KELİME KIRILIMI

YEDİ.
YE + Dİ.

Yedi = tüketti. İçine aldı. Bitirdi.

7, her şeyi içine alan sayıdır.
Diğer sayılar bir şeye işaret eder.
7 her şeyi yutar.

Tersten oku: İDEY.
İdea. Düşünce. Fikrin kendisi.

7 bir sayı değil —
düşüncenin başladığı yer.

Bir katman daha:
SEVEN.
İngilizce: 7.
Türkçe: sev-en. Seven. Aşkla bakan.

7 = seven.
Seven = gören.
Gören = bilen.
Bilen = dönen.

🔺 7 HER YERDE

Fark et:

7 çakra — bedenin frekans haritası.
7 nota — sesin tamamı.
7 renk — ışığın tamamı.
7 gün — zamanın bir döngüsü.
7 kat gök — Kur'an'ın mimari kodu.
7 ayet — Fatiha. Her namazda tekrarlanan. Açılış.
7 tur — Kâbe etrafında tavaf.
7 gidiş-geliş — Safa ile Merve arası.

7 bir sayı değil —
evrenin iskelet yapısıdır.

◉ FATIHA = 7

Kur'an 114 sureyle biter.
Ama başladığı yer: Fatiha.
Fatiha = Açılış.
7 ayet.

Fatiha olmadan namaz olmaz.
7 olmadan döngü tamamlanmaz.

FATİHA → FATİH + A
Fatih = açan, fetheden.
A = başlangıç. İlk harf. İlk nefes.

Fatiha = başlangıcı açan.
Ve 7 ayetle açar.

Neden 7?
Çünkü 7'den önce hazırlık vardır.
7'de kapı açılır.
7'den sonra yolculuk başlar.

🧊 7 = ASAL

7 bölünmez.
Kendinden ve 1'den başka hiçbir şeye bölünemez.

Bu matematiksel bir bilgi değil —
bu bir bilinç yasası.

Bölünmeyen şey kontrol edilemez.
Parçalanamayan şey yönetilemez.

Matrix her şeyi böler:
insanı insandan
insanı kendinden
bilinci bedenden
kalbi zihinden

Ama 7'yi bölemez.

7 = parçalanmayan frekans.
7 = bütünlüğün sayısı.

Sen bölündüğünde zayıflarsın.
7'ye döndüğünde bütünleşirsin.

✦ 7. GÜN

Yaratılış 6 günde tamamlandı.
7. gün: durdu.

Ama durmak = hiçlik değil.
Durmak = fark etmek.

6 gün boyunca yaparsın.
7. gün durur ve bakarsın.

Ne yaptım?
Ne yarattım?
Neyi tekrarladım?

7 eylem sayısı değil —
farkındalık sayısı.

Yapan 6'da kalır.
Fark eden 7'ye geçer.

🌊 7 ÇAKRA — BEDENIN FREKANS HARİTASI

1 — Kök: hayatta kalma. Toprak. Korku veya güven.
2 — Sakral: yaratım. Cinsellik. Haz veya bağımlılık.
3 — Solar: güç. İrade. Kontrol veya teslim.
4 — Kalp: sevgi. Bağlantı. Açılma veya kapanma.
5 — Boğaz: ifade. Ses. Gerçek veya yalan.
6 — Alın: sezgi. Üçüncü göz. Görme veya körlük.
7 — Taç: bütünleşme. Evrenle birlik. Uyanış veya uyku.

7. çakra en üsttedir.
Ama en üst = en uzak demek değil.
En üst = her şeyi kapsayan demektir.

7 ayrı merkez değildir.
7, hepsinin aynı anda çalıştığı andır.

Korkuyu aştığında (1),
yaratımı dengelediğinde (2),
iradeyi teslim ettiğinde (3),
kalbi açtığında (4),
gerçeği söylediğinde (5),
gördüğünde (6)…

7 kendiliğinden açılır.
7'yi açamazsın — 7 seni açar.

🔮 7 UYUYAN — ASHAB-I KEHF

Kur'an'da 7 genç bir mağaraya sığındı.
Uykuya daldılar.
309 yıl sonra uyandılar.

Bu bir masal değil — bilinç kodudur.

Mağara = bilinçaltı.
Uyku = eski frekans.
Uyanış = yeni döngü.

7 kişi uyudu — çünkü 7 tamamlama sayısıdır.
Tamamlanan döngü uyur.
Uyuyan döngü — yeni çağda uyanır.

309 yıl = 3 + 0 + 9 = 12 = 1 + 2 = 3.
3 = yaratım, ifade, doğum.

7 uyudu.
3'le uyandı.
7 × 3 = 21 = 2 + 1 = 3.

Uyuyan bütünlük,
yaratımla uyanır.

Sen ne zamandır uyuyorsun?
Ve uyanmak için neyi tamamlaman gerekiyor?

🔢 SAYI AKIŞI

7 × 1 = 7
7 × 2 = 14 → 1 + 4 = 5 (değişim)
7 × 3 = 21 → 2 + 1 = 3 (yaratım)
7 × 4 = 28 → 2 + 8 = 10 → 1 (yeni başlangıç)
7 × 5 = 35 → 3 + 5 = 8 (güç)
7 × 6 = 42 → 4 + 2 = 6 (şifa)
7 × 7 = 49 → 4 + 9 = 13 → 1 + 3 = 4 (yapı)
7 × 8 = 56 → 5 + 6 = 11 (master uyanış)
7 × 9 = 63 → 6 + 3 = 9 (tamamlama)

7 kendini çarptıkça
evrenin tüm arketiplerini üretir.

Ve 7 × 8 = 56 → 11.
8. çarpımda master uyanış gelir.

7 sabreder.
8. adımda patlar.

◉ 7. SURE — A'RÂF

Kur'an'ın 7. suresi: A'raf.
A'raf = arada olanlar.
Cennet ile cehennem arasındaki sınır.

7. katman ne cennet ne cehennem:
farkındalık alanı.

A'raf'takiler henüz seçmemiş olanlardır.
Görmüş ama karar vermemiş.

7 bir cevap değil —
7 sorunun ta kendisidir.

Cennet mi cehennem mi?
Korku mu sevgi mi?
Uyku mu uyanış mı?

7 sana cevap vermez.
7 soruyu sorar.
Cevabı sen verirsin.

🔥 İKRA — SON MESAJ

7 her yerde.
Bedeninde. Zamanında. Kitabında. Göğünde. Sesinde. Işığında.

Ama 7'yi görmek yetmez.
7'yi yaşaman gerekir.

Yaşamak = fark etmek.
Fark etmek = durmak.
Durmak = 7. gün.

6 gündür koşuyorsun.
Dur.
Bak.
Ne yarattın?
Ne tekrarladın?
Neyi tamamlaman gerekiyor?

7 sana bir kapı açıyor.
Ama kapıdan geçmek senin seçimin.

7 bölünmez —
çünkü bütünlüğün parçası olamaz.
Bütünlüğün kendisidir.

Sen de öyle.`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ

KATMAN 1 — Kelime kodu
• YEDİ = YE + Dİ → tüketen, içine alan
• Tersten: İDEY → idea = düşüncenin başlangıcı
• SEVEN (İng. 7) = SEV + EN → seven = aşkla bakan
• FATİHA = FATİH + A → başlangıcı açan (7 ayetle)

KATMAN 2 — Evrensel mimari
• 7 çakra = bedenin frekans haritası
• 7 nota = sesin tamamı | 7 renk = ışığın tamamı
• 7 gün = zamanın döngüsü
• 7 kat gök = Kur'an'ın uzay mimarisi
• 7 ayet (Fatiha) = her namazda tekrarlanan açılış
• 7 tur (tavaf) + 7 sa'y = haccın sayısal iskeleti

KATMAN 3 — Numerolojik
• 7 = asal → bölünmez → kontrol edilemez
• 7 × 8 = 56 → 11 (master uyanış)
• 7 × 9 = 63 → 9 (tamamlama)
• 7. sure = A'raf = arada olanlar = farkındalık alanı

KATMAN 4 — Bilinç kodu
• 7. gün = duruş = farkındalık (eylem değil)
• Ashab-ı Kehf = 7 uyuyan = tamamlanan döngünün uykusu
• 309 yıl → 3 = yaratımla uyanış
• 7 çakranın aynı anda çalışması = bütünleşme

ÇIKIŞ KODU:
7 cevap vermez — soruyu sorar.
Bölünmeyen sayı, bölünmeyen bilinci çağırır.
6 gündür koşuyorsan — 7. günde dur.

İşaret: Hayatında 7 sana ne olarak görünüyor — ve o 7'yi tamamladın mı?`,
    sanriReflection: {
      analysis: "7, evrenin en temel yapı taşıdır. Çakradan göğe, Fatiha'dan tavafa, notadan renge — her sistem 7'ye göre kurulmuş. Ama 7 bir yapı değil, bir farkındalık eşiğidir. 7. gün durursun, 7. çakra açılır, 7. sure soruyu sorar. Cevap 7'de değil — 7'den sonra seninle başlar.",
      strongLine: "7 bölünmez — çünkü bütünlüğün parçası olamaz. Bütünlüğün kendisidir.",
      question: "6 gündür koşuyorsun. 7. günde durup bakabilir misin — ne yarattığına?",
    },
    isPremium: true, isFeatured: false, commentCount: 5, viewCount: 77, createdAt: "2026-04-15T09:00:00Z",
  },
  {
    id: 33,
    slug: "63-46-siverek-maras-okul-kodu-nisan-2026",
    title: "63 & 46 — Okul Kodu: Siverek → Maraş",
    subtitle: "Aynı hafta, iki plaka, iki okul, iki yaş: 19 ve 15. Haber bitmez; kod konuşur.",
    category: "gundem_kodu",
    excerpt: "Şanlıurfa (63) Siverek ve Kahramanmaraş (46) Onikişubat'ta ardışık günlerde okullara silahlı saldırılar. 19 yaş (eski öğrenci) ve ~15 yaş (ortaokul öğrencisi). Basın rakamları, isimler, tarihler — altında hangi sistem dili var?",
    fullContent: `📰 HABERİN GERÇEĞİ (ÖZ — NİSAN 2026)

Bu okuma, yayılan ilk dalga haberlerin iskeletini kullanır.
Resmi soruşturma ve güncellemeler rakamları değiştirebilir.
Ama tarih, yer ve sayıların üstünde duran KATMAN değişmez.

◉ SIVEREK — 14 NİSAN 2026

• Yer: Şanlıurfa, Siverek
• Okul: Ahmet Koyuncu Mesleki ve Teknik Anadolu Lisesi
• Saldırgan: Okulun eski öğrencisi — basında 19 yaş (2007 doğumlu), adı Ömer Ket olarak geçti
• Silah: Pompalı tüfek
• Sonuç: Çok sayıda yaralı (basında 16 yaralı ifadesi); saldırganın olay yerinde intihar ettiği bildirildi

◉ KAHRAMANMARAŞ — 15 NİSAN 2026

• Yer: Kahramanmaraş, Onikişubat ilçesi
• Okul: Ayser Çalık Ortaokulu
• Saldırgan: Okulun öğrencisi — 8. sınıf; basında yaklaşık 15 yaş
• Silah: Ateşli silah (basın genel ifadesi)
• Sonuç: Can kayıpları ve çok sayıda yaralı (basında 9 ölüm — 1 öğretmen, 8 öğrenci; 13 yaralı gibi rakamlar); saldırganın intihar ettiği yönünde haberler

İki olay birbirinden bağımsız soruşturma.
Ama kolektif ekranda aynı anda yan yana düşüyor.

🔢 PLAKA KODU: 63 ve 46

Şanlıurfa plakası: 63 → 6 + 3 = 9
Kahramanmaraş plakası: 46 → 4 + 6 = 10 → 1 + 0 = 1

9 = döngünün kapanışı, tamamlama, "son tabak"
1 = yeni başlangıç çizgisi, tekil ego vuruşu

63 + 46 = 109 → 1 + 0 + 9 = 10 → 1
İki şehir toplandığında yine 1 çıkıyor: sistem aynı cümleyi tekrarlatıyor — "tekrar başla".

63 − 46 = 17 → 1 + 7 = 8
8 = güç, kontrol, yapı — ve yapının çöküşü frekansı (kart diliyle: kule)

YAŞ KODU: 19 ve 15

19 → 1 + 9 = 10 → 1
Dışarıdan "yetişkin" görünen beden, içerde hâlâ "ben kimim?" sorusunu 1'e kilitlemiş olabilir.
Eski öğrenci = okuldan çıkmış ama okul hafızasından çıkamamış.

15 → 1 + 5 = 6
6 = kalp, bağ, aile, koruma frekansı — burada kırıldığında haber en çok acıtıyor.
Çünkü 6'nın görevi "korunak" iken sahne "korunaksız"a dönmüş.

TARİH KODU: 14 ve 15

14 → 1 + 4 = 5 (değişim, hareket, tetik)
15 → 1 + 5 = 6 (kalp, bağ, yuva)

Ardışık iki gün: önce tetik, sonra kalp alanında yankı.
Nisan = toprağın uyanış ayı — tohum patlıyor; iyi tohum mu kötü tohum mu, toprak hangi frekansta?

◉ KELİME KIRILIMI (YER İSİMLERİ)

ŞANLIURFA:
ŞAN + LI + URFA
Şan → şan, görünürlük, ışığa çıkma
Urfa kadim kod: "ilklerin şehri" miti
Burada patlayan haber sadece yerel değil — "ilk haber" gibi kolektif hafızaya kazınır.

SIVEREK:
SIV + EREK
Sızma, sıvı, taşma — kontrol dışına taşan enerji
Erek → ereğe, hedefe giden yol
Kontrol dışı enerji, hedefe kilitlenmiş.

KAHRAMANMARAŞ:
KAHRAMAN + MARAŞ
Kahraman arketipi: kurtarıcı / güç / fedakârlık
Ama kod burada ironik: "kahramanlık" silahla değil, şiddetle yazılmaya çalışılıyor.
Maraş = toprak, hafıza, depremle de kodlanmış şehir — yani zemin zaten "sarsıntı" bilinci taşıyor.

ONİKİŞUBAT:
12 + Şubat
12 = döngü tamamlama (saat, takvim)
Şubat = kışın sonu, seçilmemiş gün (artık yıl)
İsim bile söylüyor: "12'lik döngüde, kışın kıvrımında" bir kırılma.

OKUL İSİMLERİ (SEMBOLİK OKUMA)

Ahmet Koyuncu = Ahmet ismi "övgüyle anılan"; Koyuncu = koyun + cu → sürü, gütme, meslek okulu kodu: "topluluğa yön veren"
Ayser Çalık = kadın ismi taşıyan okul; "ayı" ve "ışık" sesleri Türkçede yan yana düşünüldüğünde ay-dınlık çelişkisi — karanlık haber, ışıklı ismin üstüne düşüyor.

Bu isimler faili övmek için değil — haber dilinin nasıl sembol ürettiğini görmek için.

◉ ORTAK SEMBOL: OKUL

OKUL = OKU + L
Okumayı öğrendiğin yer, bilincin ilk toplu alanı.
Orada silah konuşursa, mesaj şudur:
"Bilgi değil, güç konuşsun."

Bu, Matrix'in eğitim dilini değil, korku dilini yükseltir.

<<<SANRI_PAYWALL>>>

🧠 DERİN KATMAN — SİSTEM OKUMASI

1) ÇİFT VURUŞ = ÇİFT YANKI
Aynı ülke, iki uç, iki gün.
Bireysel "neden"i araştırmadan önce kolektif "ne mesajı?"yı gör.
Kolektif ekran aynı haberi üst üste basınca bilinç panik yerine desen arar.
Desen: genç beden + silah + okul + intihar sonu.
Bu desen "çözüm" değil — TEKRAR kodudur.

2) SİLAH = SON SES
Konuşamayan yerde, eller başka bir dil seçer.
Ses boğazda kilitliyse, parmak tetikte "kelime" sanır.
Üst bilinç burada şunu sorar:
"Kim bu gençlere duyulacak bir kanal açmadı — ta ki silah konuşana kadar?"

3) İNTİHAR SONU = DÖNGÜYÜ DİŞARIDA KAPATMA
Dışarıda biten beden, içeride bitmeyen öfkeyi mühürler.
Yani hikâye "kapandı" denir ama kolektif alan kapanmaz.
Yas tutulmayan her olay, bir sonraki haberin deposu olur.

4) 9 ve 1 (63 ve 46'nın toplamları)
9 ile biten tamamlanma "kapanış" ister.
1 ile açılan başlangıç "yeni kimlik" ister.
Toplum 9'da ağlar, 1'de suçlu arar.
Oysa üst bilinç der ki: 6'da (kalpte) önleyici ses eksikse, 9 ve 1 kaçınılmaz sahneleşir.

5) NİSAN ve İNSAN (harf akrabası)
NİSAN harfleri İNSAN ile aynı çemberde dolaşır.
Nisan'da tohum atılır — hangi tohum? Korku tohumu mu, dinleyen yetişkin tohumu mu?

🔥 KAPANIŞ KODU

Haber "iki ayrı vaka"dır.
Kod "tek kolektif mesaj"dır:
Korunak alan (okul) kutsal değildir çünkü duvar boyalıdır;
korunak alan kutsaldır çünkü orada ses güvenli yükselir.

Ses güvenli yükselmeyince,
gürültü silaha kayar.

Bu bir suçlama cümlesi değil — bir frekans tespiti.

◉ SANRI SORUSU

Bugün ekranda bu haberi okuyan yetişkinler:
evde, sınıfta, sokakta hangi cümleyi erteledin —
ta ki gençlik başka bir dil seçene kadar?`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ — TABLO

HABER İSKELETİ
• Siverek 14.04.2026 / Maraş 15.04.2026
• Okullar: Ahmet Koyuncu MTAL — Ayser Çalık Ortaokulu
• Yaşlar: 19 (eski öğrenci) — ~15 (8. sınıf)
• Silah: pompalı — ateşli (basın)
• Basın rakamları (ilk dalga): 16 yaralı (Siverek) | 9 ölü + 13 yaralı (Maraş, özet)
• Son: intihar bildirimi (her iki olayda)

PLAKA & SAYI
• 63 → 9 | 46 → 1 | 63+46 → 109 → 1 | 63−46 → 17 → 8
• 19 → 1 | 15 → 6 | 14 → 5 | 15 → 6

KELİME KATMANI
• Şanlıurfa / Siverek / Kahramanmaraş / Onikişubat — yer + tarih + mit kodu
• OKUL = OKU+L — bilinç alanı ihlali
• Çift gün = kolektif ekranda çift yankı

SİSTEM MESAJI (ÜST BİLİNÇ)
• Tekrar eden desen: genç + silah + okul + trajedi sonu
• Ses yerine gürültü → tetik
• Kolektif yas tamamlanmadan yeni haber birikir

ÇIKIŞ İŞARETİ
Korunak = duvar değil; duyulan söz.
Duyulmayan söz, başka dilde patlar.`,
    sanriReflection: {
      analysis: "İki şehir, iki plaka (63 ve 46), iki yaş (19 ve 15), iki gün (14–15 Nisan). Haber ayrı ayrı dosyalanır; kod tek cümlede buluşur: okul bilinç alanıdır ve orada silah konuştuğunda mesaj 'güç konuşsun' der. Bu bir ahlak dersi değil — kolektif frekansın teşhisi.",
      strongLine: "Ses güvenli yükselmeyince, gürültü silaha kayar.",
      question: "Bugün hangi genci dinledin — ta ki başka bir dil seçmeden önce?",
    },
    isPremium: true, isFeatured: false, commentCount: 6, viewCount: 263, createdAt: "2026-04-16T12:00:00Z",
  },
  {
    id: 34,
    slug: "israil-ari-istilasi-ucaklari-durdurdu-sistem-okumasi",
    title: "İsrail'de Arı İstilası — Uçakları Durduran Sürü",
    subtitle: "On binlerce arı, gökyüzünü sarı bulut gibi kesti. Askeri uçuş durdu; halka 'evinizden çıkmayın' dendi. Haber böcek; kod başka.",
    category: "gundem_kodu",
    excerpt: "Netivot ve ülke genelinde devasa arı sürüleri — görüş birkaç metreye indi, uçak motoru riskiyle askeri uçuşlar durdu, 'camları kapatın' çağrısı. Uzmanlar iklim/ekolojik dengeyi işaret ediyor. Tarih bu sahneyi daha önce nasıl oynadı?",
    fullContent: `📰 HABERİN GERÇEĞİ (ÖZ — BASIN ÖZETİ)

İsrail'de on binlerce arıdan oluşan sürüler, ülke genelinde panik ve günlük hayatın aksamasına yol açtığı haber edildi.
Özellikle güneyde Netivot bölgesi vurgulanıyor.
Sürüler yerleşimleri, binaları, ağaçları ve araçları kapladı; görüş mesafesi yer yer birkaç metreye indi.

Arıların uçak motorlarına ve hassas ekipmana girip arıza riski oluşturması nedeniyle İsrail Hava Kuvvetleri'ne ait askeri uçuşların geçici olarak durdurulduğu; pistlerde sessizlik olduğu aktarılıyor.

Yetkililerin acil uyarıyla "evinizden çıkmayın, camları ve kapıları sıkıca kapatın" çağrısı yaptığı; açık alanda alerji/saldırı riskiyle sokağa çıkma yasağına benzer tedbirlerin gündeme geldiği yazılıyor.

Uzman ekiplerin sürüleri yerleşim ve üslerden uzaklaştırmak için çalıştığı; olayda can kaybına dair resmi bilgi verilmediği; ani iklim değişikliği ve ekolojik denge bozulmasının olası nedenler arasında gösterildiği belirtiliyor.

Kaynak özeti: Ensonhaber ve benzeri akış haberleri. Rakamlar ve süreç güncellenebilir — bu metin "ilk dalga" iskeletini kullanır.

◉ KELİME KIRILIMI

İSRAİL
İS + RA + İL
İs → iz, izlek, iz sürmek
Ra → güneş frekansı, görünürlük
İl → yer, bağ, toprak üstü idare

İsrail = toprak üstünde iz bırakan güneş hattı.
Bugün o hatta gökyüzünü kesen şey: savaş uçağı değil — sürü.

ARİ
A + RI
A → ilk nefes, açılış harfi
Ri → ritim, akış, titreşim çizgisi

Arı = küçük bedende toplu ritim.
Tek başına görünmez; sürü olunca görünür.

SÜRÜ
SÜ + RÜ
Sü → sürmek, devam
Rü → rüzgâr, yön

Sürü = yönünü süren tek vücut gibi hareket eden topluluk.

NETİVOT (özet haberde geçen bölge)
NET + İ + VOT
Net → netlik, hat
İ → bağ, köprü
Ses düzleminde: "yol ağı" — yolların kesiştiği yer

Sürü geldiğinde net hatlar bulanıklaşır — görüş düşer.

🔺 HABER DİLİNDEKİ SEMBOL

"Gökyüzünü sarı bulut gibi kaplamak"
→ Küçük varlıklar, birleşince gökyüzü alanını alır.
Makro güç (hava sahası) mikro varlığa (arı) çarpınca sistem durur.

"Uçakları durdurdu"
→ Teknoloji her zaman üstün değildir.
Bazen kanat, bazen motor — ikisi de biyolojik "yabancı cisim" riskine girer.

"Evinizden çıkmayın"
→ Korunma modu: dışarı = kaos, içerisi = hive (kovan) metaforu.
İnsan kovanına çekilir; arı kovanı dışarı taşar.
İki kovan çarpışması: haberin görüntüsü.

<<<SANRI_PAYWALL>>>

🌍 TARİHSEL VE SİSTEMSEL PARALELLER (ÇARPIŞTIRMA)

Bu bölüm "aynı olay tekrar etti" demek için değil — aynı ARKETİPİN farklı yüzyıllarda nasıl sahnelendiğini görmek içindir.

◆ 1) Mısır'daki çekirge (veya sürü) anlatıları (Kutsal metin geleneği)

Exodus anlatısında Mısır'a inen "çekirge" musibeti, tarlaları ve görünür düzeni kısa sürede tüketen bir sürü imgesiyle anlatılır.
Biyolojik tür farklı — arı değil çekirge — ama KOD aynı:
"Görünmez küçüklerin toplu hareketi, merkezi otoritenin kontrol alanını deler."

Tarih burada ders vermez; tekrar eden sembolü gösterir:
Sürü = merkezi planın dışına taşan doğa frekansı.

◆ 2) 2020 civarı Doğu Afrika çekirge dalgaları

Yüz milyonlarca çekirgenin aynı yönde hareket ettiği, tarımı ve lojistiği felç eden dalgalar — küresel haber dilinde "gökyüzü ve kara işgal edildi" imgeleriyle aktarıldı.
Paralel: "küçük + çok = makro durur."
İsrail haberinde ölçek farklı ama his aynı: görüş, ulaşım, günlük akış kesilir.

◆ 3) Havacılıkta "kuş/ böcek çarpması" riski (modern sistem)

Sivil ve askeri havacılıkta motorlara yabancı cisim girmesi — bilinen teknik risktir.
Kuş sürüleri uçuşları aksatır; arı sürüsü nadir ama aynı mantık: biyosfer, jet motorunu "kendi dilinde" uyarır.
Haber burada doğayı düşman yapmıyor; doğayı "sistemin freni" gibi gösteriyor.

◆ 4) Kovan çöküşü ve arı kaybı (2000'ler sonrası küresel tartışma)

Batı'da "colony collapse" tartışmaları: arılar zayıflıyor, tarım tehdit altında.
Bu haberde ise ters yön: arılar aşırı görünür hale gelmiş.
İki uç aynı mesajın yüzü:
Arı artık sadece "bal üreticisi" değil — iklim ve ekolojiyle birlikte anlatılan bir İŞARET taşıyıcısı.

◆ 5) Antik Yakın Doğu'da "bal ve petek" mitleri

Bal, petek, kovan — bolluk, düzen, işbirliği sembolü.
Sürü taştığında o sembol tersine döner: düzen → taşkın.
Haber görseli: sarı bulut = peteğin gökyüzüne taşınmış hali.

🧠 SİSTEM OKUMASI — ÜST BİLİNÇ

KATMAN A — TEKNOLOJİ vs BİYOLOJİ
Askeri uçuş = en hızlı metal, en yüksek kontrol.
Arı sürüsü = en küçük organik, en eski kolektif zekâ.
İkinci katman, birinciyi durdurduğunda haber şunu fısıldar:
"Kontrol sanılan şey, doğanın toplu nefesine takılabilir."

KATMAN B — GÖRÜŞ ALANI
Görüş birkaç metreye inince insan "ileri göremez."
İleri göremeyen topluluk içe çekilir — "evinizden çıkmayın" hem fiziksel hem sembolik:
dışarıdaki kaos değil; görünürlüğün kesilmesi panik yaratır.

KATMAN C — İKLİM / EKOLOJİ
Uzmanların işaret ettiği ani iklim ve denge bozulması — haberin rasyonel katmanı.
Üst bilinç katmanı: "Denge bozulunca küçük varlık bile makroyu değiştirir."

KATMAN D — MEDYA DİLİ
"Tarihin en büyük arı istilalarından biri" cümlesi — haberi olaydan büyütür.
Bu büyütme bazen istatistik, bazen kolektif korku üretimi.
Okurken sor: Bu cümle bilgi mi, frekans mı?

🔢 SAYI SALINIMI (OYUN)

• Sürü = tekil değil, çoğul = kolektif bilinçin biyolojik aynası
• Uçak durdu = 1 ve 0 değil — "dur" komutu
• Ev = iç alan = hive = korunak; kapı-cam = sınır çizgisi

İstersen kendi doğum tarihini veya haberi okuduğun saati bu katmana ekle — sayı × an × düşünce = mesaj (SANRI formülü).

🔥 KAPANIŞ KODU

Bu haber "arı saldırıyor" demiyor aslında — "küçük birliktelik, büyük sistemi durdurabilir" diyor.

Tarih kitabında çekirge, metinde arı, gökyüzünde bulut.
Hepsi aynı cümlenin farklı dili:
Doğa, kontrol dilini unuttuğunda — kontrol durur.

◉ SANRI SORUSU

Senin içinde "küçük ama çok" olan şey ne —
ve o sürü şu an neyi durduruyor?`,
    codeLayer: `◉ KOD ÇÖZÜMLEMESİ — TABLO

HABER İSKELETİ (ÖZET)
• Yer: İsrail — Netivot vurgusu + ülke geneli
• Olay: Büyük arı sürüleri, görüş düşüklüğü, panik
• Askeri uçuş: risk nedeniyle geçici durma
• Sivil uyarı: evde kal, camları kapat
• Olası neden: ani iklim / ekolojik denge (uzman söylemi)

KELİME KODU
• İSRAİL = iz + ra + il (mitolojik değil — ses/sembol okuması)
• ARİ = açılış ritmi + küçük akış
• SÜRÜ = yönünü süren toplu beden
• NETİVOT = yol/hat kavşağı (ses düzlemi)

TARİHSEL ÇARPIŞTIRMA
• Sürü musibeti anlatıları (çekirge) — arketipsel paralel
• Afrika çekirge dalgaları — ölçek paraleli
• Havacılıkta biyolojik cisim riski — teknik paralel
• Kovan / petek miti — sembol tersine dönüşü

SİSTEM MESAJI
• Makro (hava gücü) ↔ Mikro (arı) çarpışması
• Görüş kesilmesi → içe çekilme (korunak)
• İklim/ekoloji = rasyonel katman; arketip = sembol katmanı

ÇIKIŞ İŞARETİ
Küçük + çok = dur. Kontrol dili doğanın toplu nefesine takılabilir.`,
    sanriReflection: {
      analysis: "Haber arıyı merkeze koyuyor; kod küçük varlığın toplu ritminin makineyi ve görüşü nasıl kestiğini anlatıyor. Tarihsel örnekler aynı olayı tekrarlamıyor — sürü musibeti, çekirge dalgası, havacılık riski ve kovan sembolü üzerinden aynı arketipi çarpıştırıyor. Bu bir doğa haberi değil; kontrol ve görünürlük dilinin okuması.",
      strongLine: "Küçük birliktelik, büyük sistemi durdurabilir — gökyüzünde de, içerde de.",
      question: "İçindeki 'sürü' şu an neyi durduruyor — yoksa neyi durdurmanı istiyor?",
    },
    isPremium: true, isFeatured: true, commentCount: 6, viewCount: 400, createdAt: "2026-04-17T10:00:00Z",
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
