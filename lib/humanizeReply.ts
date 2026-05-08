// lib/humanizeReply.ts
//
// Sanrı'nın cevabını "robotik" tondan arındırıp insan-sohbeti ritmine
// döndüren yardımcılar. Backend cevabı her zaman saf konuşma değil — bazen
// markdown, numaralı liste, "Soru:", "Yansıma:" gibi etiketler içerebilir.
// Bunları kırpıyoruz ve metni 1-3 kısa baloncuğa bölerek "kısa kısa yazıyor"
// hissi yaratıyoruz.

/** Markdown / etiket kalıntılarını söker. Cümleyi kendine bırakır. */
export function stripRoboticMarkers(raw: string): string {
  if (!raw) return "";
  let s = String(raw);

  // Bold/italic markdown
  s = s.replace(/\*\*(.+?)\*\*/g, "$1");
  s = s.replace(/__(.+?)__/g, "$1");
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
  s = s.replace(/`{1,3}([^`]+)`{1,3}/g, "$1");

  // Başlık veya liste işaretleri (satır başında)
  s = s.replace(/^\s*#{1,6}\s+/gm, "");
  s = s.replace(/^\s*[-•·]\s+/gm, "");
  s = s.replace(/^\s*\d+[\.\)]\s+/gm, "");

  // "Sanrı:" / "Sanri:" / "Yanıt:" / "Cevap:" / "Yansıma:" / "Soru:" / "Reflection:" / "Question:" gibi etiketleri kaldır
  s = s.replace(
    /^(?:\s*)(?:sanrı|sanri|yanıt|cevap|yansıma|reflection|response|answer|question|soru)\s*[:：]\s*/gim,
    ""
  );

  // Çift boşluk / fazla newline
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/[ \t]{2,}/g, " ");

  return s.trim();
}

/**
 * Metni cümle/paragraf sınırlarında 1-3 kısa baloncuğa böler.
 * Hedef: her baloncuk ~120 karakter civarı, sınırı zorla aşma.
 *
 * 1 baloncuk:  metin <= 140 char
 * 2 baloncuk:  140 < metin <= 280
 * 3 baloncuk:  metin > 280   (üçten fazla parça olmaz, kalanı son baloncuğa kat)
 */
export function splitIntoBubbles(raw: string): string[] {
  const text = stripRoboticMarkers(raw);
  if (!text) return [];

  // Paragraflar zaten doğal sınır
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (text.length <= 140 && paragraphs.length <= 1) {
    return [text];
  }

  // Cümlelere böl — TR ve EN için yeterli regex
  const splitSentences = (s: string): string[] => {
    const parts = s
      .replace(/\n+/g, " ")
      .match(/[^.!?…]+[.!?…]+(?:\s|$)|[^.!?…]+$/g);
    if (!parts) return [s];
    return parts.map((p) => p.trim()).filter(Boolean);
  };

  // Tüm cümleleri sırayla çıkar (paragraf bağımsız)
  const sentences: string[] = [];
  for (const p of paragraphs.length ? paragraphs : [text]) {
    sentences.push(...splitSentences(p));
  }

  if (sentences.length === 0) return [text];
  if (sentences.length === 1) return [sentences[0]];

  // Hedef baloncuk sayısı
  let bubbleCount = 2;
  if (text.length > 280) bubbleCount = 3;
  if (sentences.length < bubbleCount) bubbleCount = sentences.length;

  // Cümleleri ~eşit ağırlıkta gruplara dağıt
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

  // Boş bucket olduysa düzelt
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
  // Temel hız 12-22ms arası rastgele
  return 12 + Math.floor(Math.random() * 11);
}

/** Yeni baloncuk açmadan önce "düşünme" duraklaması (typing dots süresi) */
export function gapBeforeBubble(index: number): number {
  // İlk baloncuk için biraz daha uzun (sanki düşünüyor),
  // sonraki baloncuklar için kısa (peş peşe atıyor hissi).
  if (index === 0) return 900 + Math.floor(Math.random() * 500); // 900-1400ms
  return 350 + Math.floor(Math.random() * 350); // 350-700ms
}
