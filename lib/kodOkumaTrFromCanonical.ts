import {
  KOD_MODULLERI,
  DEFAULT_LESSON_CLOSE,
} from "./kodOkumaSistemiData.js";

/** Web `kodOkumaSistemiData.js` ders nesnesi (mobilde sadece alan tüketimi). */
export type CanonicalLesson = {
  id: string;
  title: string;
  shortDescription?: string;
  introLine?: string;
  content: string;
  codeBox?: string | null;
  closingLine?: string;
  inputPrompt?: string;
};

function stripMdBold(s: string): string {
  return s.replace(/\*\*([\s\S]*?)\*\*/g, (_, inner: string) => inner.trim());
}

function normalizeBlock(s: string): string {
  let t = s.replace(/\n---\n/g, "\n\n—\n\n");
  t = stripMdBold(t);
  return t.trim();
}

function formatIntro(intro: string): string {
  return intro
    .split("\n")
    .map((ln) => ln.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function findCanonicalLesson(lessonId: string): CanonicalLesson | null {
  for (const mod of KOD_MODULLERI) {
    const L = mod.lessons.find((l: { id: string }) => l.id === lessonId);
    if (L) return L as CanonicalLesson;
  }
  return null;
}

/**
 * Mobil’e özel: canonical metinden sonra eklenen bloklar (web metniyle çakışmaz).
 */
const MOBILE_TR_SUFFIX: Partial<Record<string, string>> = {
  "kod-nedir":
    "—\n\n" +
    "Bu dersten pratik çıkış\n\n" +
    "Kelimenin tam aynalaması ve derin parçalanması üçüncü derste duralım. İkinci derste tek tek harfe ineceğiz. Bu ilk adımda — yüzeyi delmeden önce — ritme bak: RAKAMLAR.\n\n" +
    "Sayı (1–99) da cümle gibi konuşur: tek/çift, basamak toplamı, tekrar eden rakam, indirgeme. Miktar değil; vurgu. Bir yaş, bir saat, bir tutar seçildiğinde seçilen çoğu zaman rakamın kendisi değil — ritmidir.\n\n" +
    "Küçük liste (nefesle):\n" +
    "• Sayıyı rakam ve sözle duy.\n" +
    "• Tek mi çift mi?\n" +
    "• Basamakları topla; gerekirse tek haneye indir (yöntem değil; farkındalık).\n" +
    "• 11, 22 gibi tekrarlar neyi vurgular?\n" +
    "• Bu rakam / sayı seni nereye çağırıyor?",
  "insan-kod":
    "—\n\n" +
    "Bu dersten pratik çıkış\n\n" +
    "Burada tam kelimenin aynası yok — o üçüncü derste. Burada ise harfin ve kısa dizinin ardındaki desen: tek harfi sessizce dinle; ı ve İ farkını duy; ismini veya seni çağıran kelimenin ilk titreşimini yakala — yön sor: Bu ses beni nereye iter?",
  "kelimeyi-parcalamak":
    "—\n\n" +
    "İki ayna — teknik çerçeve (web Kod Eğitmeni ile aynı sıra)\n\n" +
    "Üç adımı karıştırma: önce hecele; sonra karakter karakter ters yazılış; sonra anagram (aynı harf çantası).\n\n" +
    "• Ters ayna: Unicode harf sırasını sondan başa — örn. «Mayıs» birleşik küçük harfle «sıyam» gibi bir dize verir; bu anlamlı başka kelime olmak zorunda değildir.\n\n" +
    "• Anagram: aynı harfler, farklı sıra — «mayıs» ile «sayım» aynı çantayı paylaşır; ters yazılış değildir.\n\n" +
    "• Hece: MA–yıs — nefes kırılımı ritmi değiştirir.\n\n" +
    "Bu bir doğruluk yarışı değil; dürüstlük: harfi atlama, tersi anagram sanma.",
};

/** Canonical `inputPrompt` yerine mobilde kullanılan uzatılmış yönerge (ders bazlı). */
const MOBILE_INPUT_TAIL: Partial<Record<string, string>> = {
  "kod-nedir":
    "Aşağıda: önce bir sayı (1–99) veya seni çağıran bir rakam yazabilirsin — dilersen bugün içinden geçen tek bir cümleyi de ekleyebilirsin; SANRI ikisini katmanlarıyla okur.",
  "insan-kod":
    "Aşağıda: adın, lakabın, tek harf veya seni çağıran kısa kelime — üzerinde iki dakika kalıp ne hissettirdiğini yaz; SANRI katmanlarıyla okur.",
  "kelimeyi-parcalamak":
    "Aşağıda: son günlerde sık kullandığın veya içini sıkıştıran bir kelime — hecelere böl; SANRI her parçaya katman ve iki aynayı atlamadan okur.",
};

/** Liste / kart başlığı: canonical başlığa odak etiketi. */
export const MOBILE_LESSON_TITLE_SUFFIX: Partial<Record<string, string>> = {
  "kod-nedir": " — Sayıların ritmi",
  "insan-kod": " — Harf ve desen",
  "kelimeyi-parcalamak": " — İki ayna",
};

function displayTitle(les: CanonicalLesson): string {
  const sx = MOBILE_LESSON_TITLE_SUFFIX[les.id];
  return sx ? `${les.title}${sx}` : les.title;
}

/** Tüm Türkçe ders gövdesi: canonical + isteğe bağlı mobil suffix + giriş yönergesi. */
export function buildTrLessonBodyFromCanonical(lessonId: string): string | null {
  const les = findCanonicalLesson(lessonId);
  if (!les) return null;

  const segments: string[] = [];

  segments.push(displayTitle(les));

  const intro = (les.introLine ?? "").trim();
  if (intro) segments.push(formatIntro(intro));

  segments.push(normalizeBlock(les.content));

  if (les.codeBox) {
    segments.push(
      `—\n\nKod kutusu — örnek çözüm\n\n${normalizeBlock(les.codeBox)}`
    );
  }

  segments.push((les.closingLine ?? DEFAULT_LESSON_CLOSE).trim());

  const suffix = MOBILE_TR_SUFFIX[lessonId];
  if (suffix) segments.push(suffix.trim());

  const tail =
    (MOBILE_INPUT_TAIL[lessonId] ?? `Aşağıda\n\n${(les.inputPrompt ?? "").trim()}`).trim();
  segments.push(`—\n\n${tail}`);

  return segments.join("\n\n");
}
