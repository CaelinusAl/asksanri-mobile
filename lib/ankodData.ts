export type AnkodCategoryId = "ruhsal" | "duygu" | "para" | "iliski";
export type AnkodStepId = "renk" | "sayi" | "hayvan" | "kelime" | "his";

export type AnkodCategory = {
  id: AnkodCategoryId;
  title: string;
  blurb: string;
  glyph: string;
  accent: string;
  glow: string;
};

export type AnkodOption = {
  id: string;
  label: string;
  icon?: string;
  color?: string;
};

export const CATEGORIES: AnkodCategory[] = [
  { id: "ruhsal", title: "Ruh", blurb: "Anlam, boşluk, sessizlik", glyph: "☽", accent: "rgba(168,85,247,0.85)", glow: "rgba(168,85,247,0.35)" },
  { id: "duygu", title: "Duygu", blurb: "Akış, bastırılan, derin su", glyph: "◇", accent: "rgba(236,72,153,0.85)", glow: "rgba(236,72,153,0.35)" },
  { id: "para", title: "Para", blurb: "Değer, güven, alışveriş içinizle", glyph: "◈", accent: "rgba(234,179,8,0.9)", glow: "rgba(234,179,8,0.32)" },
  { id: "iliski", title: "İlişki", blurb: "Sınır, yakınlık, ayna", glyph: "✦", accent: "rgba(120,247,216,0.85)", glow: "rgba(120,247,216,0.32)" },
];

export const STEP_ORDER: AnkodStepId[] = ["renk", "sayi", "hayvan", "kelime", "his"];

const RENK_OPTIONS: AnkodOption[] = [
  { id: "mavi", label: "Mavi", color: "#4a8fe7" },
  { id: "kirmizi", label: "Kırmızı", color: "#e74a5a" },
  { id: "siyah", label: "Siyah", color: "#2a2a2f" },
  { id: "yesil", label: "Yeşil", color: "#4ae78a" },
  { id: "mor", label: "Mor", color: "#a855f7" },
];

const SAYI_OPTIONS: AnkodOption[] = [
  { id: "1", label: "1", icon: "①" },
  { id: "3", label: "3", icon: "③" },
  { id: "6", label: "6", icon: "⑥" },
  { id: "7", label: "7", icon: "⑦" },
  { id: "9", label: "9", icon: "⑨" },
];

const HAYVAN_OPTIONS: AnkodOption[] = [
  { id: "kurt", label: "Kurt", icon: "🐺" },
  { id: "kus", label: "Kuş", icon: "🦅" },
  { id: "yilan", label: "Yılan", icon: "🐍" },
  { id: "kedi", label: "Kedi", icon: "🐈‍⬛" },
  { id: "balina", label: "Balina", icon: "🐋" },
];

const KELIME_OPTIONS: Record<AnkodCategoryId, AnkodOption[]> = {
  ruhsal: [
    { id: "sessizlik", label: "Sessizlik" },
    { id: "yol", label: "Yol" },
    { id: "isik", label: "Işık" },
    { id: "derinlik", label: "Derinlik" },
    { id: "sure", label: "Süre" },
  ],
  duygu: [
    { id: "ozlem", label: "Özlem" },
    { id: "ofke", label: "Öfke" },
    { id: "utanc", label: "Utanç" },
    { id: "sefkat", label: "Şefkat" },
    { id: "kayip", label: "Kayıp" },
  ],
  para: [
    { id: "guven", label: "Güven" },
    { id: "kaygi", label: "Kaygı" },
    { id: "ozgurluk", label: "Özgürlük" },
    { id: "borc", label: "Borç" },
    { id: "deger", label: "Değer" },
  ],
  iliski: [
    { id: "sinir", label: "Sınır" },
    { id: "yakinlik", label: "Yakınlık" },
    { id: "ayna", label: "Ayna" },
    { id: "terk", label: "Terk" },
    { id: "sadakat", label: "Sadakat" },
  ],
};

const HIS_OPTIONS: Record<AnkodCategoryId, AnkodOption[]> = {
  ruhsal: [
    { id: "yalniz", label: "Yalnız", icon: "◌" },
    { id: "merak", label: "Merak", icon: "✦" },
    { id: "yorgun", label: "Yorgun", icon: "—" },
    { id: "sakin", label: "Sakin", icon: "○" },
    { id: "gergin", label: "Gergin", icon: "△" },
  ],
  duygu: [
    { id: "bogucu", label: "Boğucu", icon: "◼" },
    { id: "tatli", label: "Tatlı-acı", icon: "◇" },
    { id: "durgun", label: "Durgun", icon: "～" },
    { id: "dalgali", label: "Dalgalı", icon: "≈" },
    { id: "bos", label: "Boş", icon: "◯" },
  ],
  para: [
    { id: "yetersiz", label: "Yetersiz", icon: "↓" },
    { id: "tutkulu", label: "Tutkulu", icon: "↑" },
    { id: "kisitli", label: "Kısıtlı", icon: "⊓" },
    { id: "rahat", label: "Rahat", icon: "○" },
    { id: "karmasa", label: "Karmaşa", icon: "※" },
  ],
  iliski: [
    { id: "cekilmek", label: "Çekilmek", icon: "←" },
    { id: "yaklasmak", label: "Yaklaşmak", icon: "→" },
    { id: "kiskanclik", label: "Kıskançlık", icon: "◆" },
    { id: "guvenli", label: "Güvenli", icon: "◎" },
    { id: "belirsiz", label: "Belirsiz", icon: "◈" },
  ],
};

const QUESTION_TEXTS: Record<AnkodCategoryId, Record<string, string>> = {
  ruhsal: {
    renk: "Ruhunun tonu bugün hangi renkle konuşuyor?",
    sayi: "İçinde en çok titreşen sayı?",
    hayvan: "Ruhsal yolunda sana eşlik eden hayvan?",
  },
  duygu: {
    renk: "Duygun şu an hangi renge bürünmüş?",
    sayi: "Duygusal döngünde tekrar eden rakam?",
    hayvan: "Duygularını taşıyan hayvan?",
  },
  para: {
    renk: "Para konusunda içini hangi renk temsil ediyor?",
    sayi: "Maddi alanda seni en çok çağıran sayı?",
    hayvan: "Değer ve kaynak enerjinde hangi hayvan?",
  },
  iliski: {
    renk: "İlişkilerde şu an baskın renk?",
    sayi: "Bağlantı alanında tekrar eden sayı?",
    hayvan: "İlişki dinamiğinde sana benzeyen hayvan?",
  },
};

export function getQuestionText(cat: AnkodCategoryId, step: AnkodStepId): string {
  if (step === "kelime") return "Sana çarpan kelime?";
  if (step === "his") return "Şu an en baskın his?";
  return QUESTION_TEXTS[cat]?.[step] || "";
}

export function getStepOptions(cat: AnkodCategoryId, step: AnkodStepId): AnkodOption[] {
  switch (step) {
    case "renk": return RENK_OPTIONS;
    case "sayi": return SAYI_OPTIONS;
    case "hayvan": return HAYVAN_OPTIONS;
    case "kelime": return KELIME_OPTIONS[cat] || [];
    case "his": return HIS_OPTIONS[cat] || [];
  }
}

// --- Readable labels ---

const RENK_LABEL: Record<string, string> = {
  mavi: "derin bir sakinlik ve arayış",
  kirmizi: "bastırılmamış enerji ve tutku",
  siyah: "sınır çizme ve kontrol ihtiyacı",
  yesil: "iyileşme ve yenilenme arzusu",
  mor: "sezgisel uyanış ve gizem",
};

const HAYVAN_LABEL: Record<string, string> = {
  kurt: "sadakat ve yalnız yürüyebilme",
  kus: "perspektif ve özgürlük",
  yilan: "dönüşüm ve eskiyi bırakma",
  kedi: "sınır ve seçici yakınlık",
  balina: "derin hafıza ve duygusal okyanus",
};

const SAYI_LABEL: Record<string, string> = {
  "1": "yeni bir başlangıç çizgisi",
  "3": "ifade, yaratım ve tekrarlayan ritim",
  "6": "denge, sorumluluk ve şifa arayışı",
  "7": "sorgulama ve yüzeyin altını görme",
  "9": "tamamlanma ve eski döngüyü kapatma",
};

const KELIME_SNIPPET: Record<AnkodCategoryId, Record<string, string>> = {
  ruhsal: { sessizlik: "konuşulmayanı dinleme ihtiyacı", yol: "henüz adı konmamış bir yön", isik: "görünmek isteyen bir parça", derinlik: "yüzeysel cevaplardan kaçış", sure: "zamanın seninle ilişkisi" },
  duygu: { ozlem: "geri çağrılan ama yerleşmeyen bir yer", ofke: "söylenmemiş bir sınır", utanc: "görünür olmaktan çekinme", sefkat: "hem kendine hem ötekine açılan kapı", kayip: "boşluğun doldurulmasını bekleme" },
  para: { guven: "maddi güvenlik ile özsaygı iç içe", kaygi: "yetersizlik korkusunun nabzı", ozgurluk: "seçim alanı genişletme arzusu", borc: "geçmişten gelen yük hissi", deger: "ne kadar \"hak ettiğin\" sorusu" },
  iliski: { sinir: "nerede bittiğin ve başladığın", yakinlik: "yakın olma biçimin", ayna: "karşıdakinde gördüğün sen", terk: "bırakılma veya bırakma korkusu", sadakat: "bağlılık ve sadakat gerilimi" },
};

const HIS_SNIPPET: Record<AnkodCategoryId, Record<string, string>> = {
  ruhsal: { yalniz: "içsel alanda yalnız hissetme", merak: "henüz adı konmamış bir soru", yorgun: "ruhsal yorgunluk", sakin: "durgun ama farkında olma", gergin: "içte gerilmiş bir tel" },
  duygu: { bogucu: "taşıması zor bir yoğunluk", tatli: "karışık ve tanıdık bir tat", durgun: "donmuş veya uyuşmuş his", dalgali: "iniş çıkışlı bir akış", bos: "dolu olmayı bekleyen boşluk" },
  para: { yetersiz: "yetmezlik hissi", tutkulu: "kazanma veya kanıtlama ateşi", kisitli: "daralan seçenekler", rahat: "nadir bir nefes alanı", karmasa: "net olmayan maddi tablo" },
  iliski: { cekilmek: "mesafe alma ihtiyacı", yaklasmak: "birine veya bir şeye yakınlaşma", kiskanclik: "kaybetme korkusunun yüzü", guvenli: "tanıdık liman arayışı", belirsiz: "konumlandıramadığın bir ara durum" },
};

const NARRATIVES: Record<AnkodCategoryId, { hook: string; mid: string; cliff: string }> = {
  ruhsal: {
    hook: "Seçtiklerin rastgele değil; iç sesin hızlı bir taraması.",
    mid: "Bu dörtlü (renk, sayı, hayvan, kelime) bir desen çizmeye başlıyor — ama desen henüz tam görünmüyor.",
    cliff: "Üçüncü katmanda, kelime ile his birleştiğinde ortaya çıkan şey… burada açıklanmıyor. Derine indiğinde hem bağlantılar hem de \"neden şimdi?\" sorusu netleşir.",
  },
  duygu: {
    hook: "Duygu katmanında zihin yavaş, beden hızlı konuşur.",
    mid: "Aynı seçimler başka bir gün farklı anlam taşırdı; bugünkü kombinasyon sana özel bir anlık fotoğraf.",
    cliff: "Hangi duygunun maskelendiği ve hangi kelimenin aslında başka bir şeye işaret ettiği… yüzeyde kalırsa sadece rahatlatır, derinde ise dönüştürür. Devamı kilitli.",
  },
  para: {
    hook: "Para hikâyesi çoğu zaman değer hikâyesidir — rakamlar bunun dilidir.",
    mid: "Seçtiğin sayı ve kelime, kaynak korkusu ile özgürlük arzusu arasındaki gerilimi işaret ediyor olabilir.",
    cliff: "Gerçek blokajın ne \"kazanamamak\" ne de \"harcamak\" — çoğu zaman görünmeyen bir anlaşma. Tam harita, derin okumada açılır.",
  },
  iliski: {
    hook: "İlişkilerde tekrar eden sahne, genelde tesadüf değildir.",
    mid: "Hayvan ve his seçimin, yakınlık biçimini ve çekildiğin mesafeyi aynı cümlede anlatıyor — henüz son cümlesi yazılmadı.",
    cliff: "Ayna dediğin kelime bazen karşıyı, bazen kendini gösterir; hangisi olduğu burada söylenmez. Derine inince sınır ve ihtiyaç ayrı ayrı konuşur.",
  },
};

// --- Deep reading section labels ---

export const DEEP_SECTIONS = [
  { key: "ana_tema", title: "Ana Tema", icon: "◉" },
  { key: "guc_alani", title: "Güç Alanı", icon: "✦" },
  { key: "zorlayan_dongu", title: "Zorlayan Döngü", icon: "∞" },
  { key: "kor_nokta", title: "Kör Nokta", icon: "☽" },
  { key: "sanri_mesaji", title: "SANRI Mesajı", icon: "✧" },
] as const;

// --- Deep reading phrase maps ---

const KELIME_DEEP: Record<AnkodCategoryId, Record<string, string>> = {
  ruhsal: { sessizlik: "iç sessizliğe güven veya kaçış", yol: "yön arayışı — henüz seçilmemiş", isik: "görünür olma cesareti", derinlik: "yüzeyin altına inme ihtiyacı", sure: "zamanla barışık olmama" },
  duygu: { ozlem: "geri dönüş arzusu", ofke: "sınır ihlali algısı", utanc: "değersizlik korkusu", sefkat: "yumuşama ve kabul kapısı", kayip: "tamamlanmamış bir ayrılık" },
  para: { guven: "istikrar ihtiyacı", kaygi: "kaybetme senaryoları", ozgurluk: "kısıtlardan çıkma arzusu", borc: "geçmiş yükü", deger: "hak ediş inancı" },
  iliski: { sinir: "nerede durduğun", yakinlik: "ne kadar yakın olabileceğin", ayna: "yansıma ve projeksiyon", terk: "bağ kopma korkusu", sadakat: "sadakat beklentisi ve testi" },
};

const HIS_DEEP: Record<string, string> = {
  yalniz: "içsel yalnızlık frekansı", merak: "açık uçlu merak", yorgun: "tükenmişlik sinyali",
  sakin: "durgun ama bilinçli alan", gergin: "yüksek tansiyonlu iç alan",
  bogucu: "nefes aldırmayan yoğunluk", tatli: "karışık duygusal tat", durgun: "donuk veya uyuşuk tabaka",
  dalgali: "dalgalı duygusal spektrum", bos: "boşluk — doldurulmayı bekleyen",
  yetersiz: "yetersizlik titreşimi", tutkulu: "yüksek sürüşlü arzu", kisitli: "daralmış seçenek hissi",
  rahat: "nadir rahatlama", karmasa: "parçalı maddi-duygusal tablo",
  cekilmek: "mesafe alma ihtiyacı", yaklasmak: "yakınlaşma çekimi", kiskanclik: "kaybetme kaygısı",
  guvenli: "tanıdıklık arayışı", belirsiz: "konum belirsizliği",
};

// --- Build lines for API ---

export function buildLines(cat: AnkodCategoryId, answers: Record<AnkodStepId, string>): string[] {
  return STEP_ORDER.map((step) => {
    const opts = getStepOptions(cat, step);
    const sel = opts.find((o) => o.id === answers[step]);
    const q = getQuestionText(cat, step);
    return `${q} → ${sel?.label || "—"}`;
  });
}

// --- Build local "ön okuma" ---

export function buildLocalReading(cat: AnkodCategoryId, answers: Record<AnkodStepId, string>): string {
  const n = NARRATIVES[cat];
  const renkSnip = RENK_LABEL[answers.renk] || "";
  const hayvanSnip = HAYVAN_LABEL[answers.hayvan] || "";
  const sayiSnip = SAYI_LABEL[answers.sayi] || "";
  const kelimeSnip = KELIME_SNIPPET[cat]?.[answers.kelime] || "";
  const hisSnip = HIS_SNIPPET[cat]?.[answers.his] || "";

  const p1 = `${n.hook}\n\nSeçtiğin renk (${renkSnip}) ile içinden gelen hayvan (${hayvanSnip}) yan yana gelince, ${n.mid.toLowerCase()}`;
  const p2 = `Sayının söylediği (${sayiSnip}) ve çarpan kelimenin gölgesi (${kelimeSnip}) birbirine yaklaşıyor. Şu an baskın his (${hisSnip}) bu tabloyu ya netleştirir ya da bilinçaltında ikinci bir hikâye açar.`;
  const p3 = n.cliff;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

// --- Build local deep sections ---

export function buildLocalDeep(cat: AnkodCategoryId, answers: Record<AnkodStepId, string>): Record<string, string> {
  const kDeep = KELIME_DEEP[cat]?.[answers.kelime] || "";
  const hDeep = HIS_DEEP[answers.his] || "";
  const rLabel = RENK_LABEL[answers.renk] || "";
  const hLabel = HAYVAN_LABEL[answers.hayvan] || "";
  const sLabel = SAYI_LABEL[answers.sayi] || "";

  return {
    ana_tema: `Seçimlerinde beliren ana tema: ${kDeep}. Bu alan, ${rLabel} ile birlikte seni tanımlamaya başlıyor.`,
    guc_alani: `Güç kaynağın: ${hLabel}. Sayının (${sLabel}) işaret ettiği enerji, bu güçle kesişiyor.`,
    zorlayan_dongu: `Tekrar eden döngü: ${hDeep}. Bu his, kelime seçiminin (${kDeep}) altında yatan asıl gerilimi işaret ediyor.`,
    kor_nokta: `Görmediğin alan: kelime ile his arasındaki boşluk. ${kDeep} ve ${hDeep} — ikisi yan yana geldiğinde fark edilmeyen bir desen ortaya çıkıyor.`,
    sanri_mesaji: `Bu okuma bir teşhis değil, bir ayna. Seçimlerin sana bir şey söylüyor — ama bunu duymak için yüzeyin altına inmen gerekiyor. Derine inmeye hazırsan, bu desen seni bekliyor.`,
  };
}

export const ANKOD_API_BASE = "https://sanri-api-production-4a7b.up.railway.app";
export const ANKOD_COMMENTARY_URL = `${ANKOD_API_BASE}/sanri/ankod-commentary`;
export const MATRIX_ROL_URL = `${ANKOD_API_BASE}/matrix-rol`;
export const MATRIX_DEEP_URL = `${ANKOD_API_BASE}/matrix-rol/deep`;
