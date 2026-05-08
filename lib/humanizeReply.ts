// lib/humanizeReply.ts
//
// Sanrı'nın cevabını "robotik" tondan arındırıp insan-sohbeti ritmine
// döndüren yardımcılar. Backend bazen şablonlu cevaplar gönderir:
//
//   [İLK YANKI] ... [DERİN KATMAN] ... [HATIRLATMA] ...
//
// veya markdown / numaralı liste / "Soru:" gibi etiketler. Bu kalıntılar
// kullanıcının "biri yazıyor" hissini öldürür. Aşağıdaki fonksiyonlar
// metni temizler ve 1-3 kısa baloncuğa böler.

/** Köşeli parantezli ALL-CAPS etiket: [İLK YANKI], [DERİN KATMAN], [REMINDER], vs. */
const BRACKET_LABEL_RE = /\[[A-ZÜĞŞÇÖİ\s\-]{2,40}\]/g;

/** Markdown / etiket kalıntılarını söker. Cümleyi kendine bırakır. */
export function stripRoboticMarkers(raw: string): string {
  if (!raw) return "";
  let s = String(raw);

  // Köşeli parantez ALL-CAPS etiketler
  s = s.replace(BRACKET_LABEL_RE, "");

  // Bold/italic markdown
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
  s = s.replace(/`{1,3}([^`]+)`{1,3}/g, "$1");

  // Başlık veya liste işaretleri (satır başında)
  s = s.replace(/^\s*#{1,6}\s+/gm, "");
  s = s.replace(/^\s*[-•·]\s+/gm, "");
  s = s.replace(/^\s*\d+[\.\)]\s+/gm, "");

  // "Sanrı:" / "Sanri:" / "Yanıt:" / "Cevap:" / "Yansıma:" / "Soru:" /
  // "Reflection:" / "Question:" / "İlk yankı:" / "Derin katman:" /
  // "Hatırlatma:" gibi etiketleri kaldır
  s = s.replace(
    /^(?:\s*)(?:sanrı|sanri|yanıt|cevap|yansıma|reflection|response|answer|question|soru|ilk\s*yankı|derin\s*katman|hatırlatma|reminder|first\s*echo|deep\s*layer)\s*[:：]\s*/gim,
    ""
  );

  // Çift boşluk / fazla newline
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/[ \t]{2,}/g, " ");

  return s.trim();
}

/**
 * Metni 1-3 kısa baloncuğa böler. İki strateji:
 *
 * 1. Eğer cevap [İLK YANKI] / [DERİN KATMAN] / [HATIRLATMA] gibi köşeli
 *    parantezli etiketler içeriyorsa — o etiketleri sınır kabul edip
 *    her segmenti bir baloncuk yapar (çünkü içerik zaten 3 katmana
 *    bölünmüş, biz de görsel olarak takip ederiz).
 *
 * 2. Aksi halde cümle/paragraf sınırlarında ~eşit ağırlıkla 1-3 baloncuğa
 *    böler.
 */
export function splitIntoBubbles(raw: string): string[] {
  if (!raw) return [];

  // 1) Köşeli parantezli etiketleri sınır kabul et
  const labelMatches = String(raw).match(BRACKET_LABEL_RE) || [];
  if (labelMatches.length >= 2) {
    const segments = String(raw)
      .split(BRACKET_LABEL_RE)
      .map((seg) => stripRoboticMarkers(seg))
      .filter((s) => s.length > 0);
    if (segments.length > 0) return segments;
  }

  // 2) Aksi halde cümle bazlı bölme
  const text = stripRoboticMarkers(raw);
  if (!text) return [];

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (text.length <= 140 && paragraphs.length <= 1) {
    return [text];
  }

  const splitSentences = (s: string): string[] => {
    const parts = s
      .replace(/\n+/g, " ")
      .match(/[^.!?…]+[.!?…]+(?:\s|$)|[^.!?…]+$/g);
    if (!parts) return [s];
    return parts.map((p) => p.trim()).filter(Boolean);
  };

  const sentences: string[] = [];
  for (const p of paragraphs.length ? paragraphs : [text]) {
    sentences.push(...splitSentences(p));
  }

  if (sentences.length === 0) return [text];
  if (sentences.length === 1) return [sentences[0]];

  let bubbleCount = 2;
  if (text.length > 280) bubbleCount = 3;
  if (sentences.length < bubbleCount) bubbleCount = sentences.length;

  const total = text.length;
  const target = total / bubbleCount;
  const buckets: string[][] = Array.from({ length: bubbleCount }, () => []);
  let idx = 0;
  let acc = 0;

  for (const sent of sentences) {
    if (idx < bubbleCount - 1 && acc >= target * (idx + 1)) {
      idx += 1;
    }
    buckets[idx].push(sent);
    acc += sent.length;
  }

  const result = buckets
    .map((b) => b.join(" ").trim())
    .filter((b) => b.length > 0);

  return result.length ? result : [text];
}

/** Karakter başına gecikme — yazma hızı ~50 wpm hissi (insan ritmi) */
export function charDelay(ch: string): number {
  if (ch === "\n") return 50;
  if (ch === "." || ch === "!" || ch === "?" || ch === "…") return 80;
  if (ch === "," || ch === ";" || ch === ":") return 40;
  return 12 + Math.floor(Math.random() * 11);
}

/** Yeni baloncuk açmadan önce "düşünme" duraklaması */
export function gapBeforeBubble(index: number): number {
  if (index === 0) return 900 + Math.floor(Math.random() * 500); // 900-1400ms
  return 350 + Math.floor(Math.random() * 350); // 350-700ms
}
