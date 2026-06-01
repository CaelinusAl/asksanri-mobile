/**
 * Sanrı yanıtını "dergi" hareketlerine ayırır.
 *
 * Sunucu yanıtı şu biçimde gelir:
 *   [ILK YANKI]    ...
 *   [DERIN KATMAN] ...
 *   [HATIRLATMA]   ...
 *
 * Köşeli parantezli etiketleri tanır, başlıkları editöryel adlara çevirir
 * ve metni temizler. Etiket yoksa tek bir gövde olarak döner.
 */
export type Movement = { label?: string; body: string };

const LABELS: Record<string, { tr: string; en: string }> = {
  "ILK YANKI": { tr: "İlk Yankı", en: "First Echo" },
  "ILKYANKI": { tr: "İlk Yankı", en: "First Echo" },
  "DERIN KATMAN": { tr: "Derin Katman", en: "Deeper Layer" },
  "HATIRLATMA": { tr: "Hatırlatma", en: "A Reminder" },
  "KAPANIS": { tr: "Kapanış", en: "Closing" },
};

function normalizeKey(s: string): string {
  return s
    .toUpperCase()
    .replace(/İ/g, "I")
    .replace(/Ş/g, "S")
    .replace(/Ğ/g, "G")
    .replace(/Ü/g, "U")
    .replace(/Ö/g, "O")
    .replace(/Ç/g, "C")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(s: string): string {
  const lower = s.toLocaleLowerCase("tr");
  return lower.charAt(0).toLocaleUpperCase("tr") + lower.slice(1);
}

export function parseReading(raw: string, tr: boolean): Movement[] {
  const text = (raw || "").replace(/\r/g, "").trim();
  if (!text) return [];

  const re = /\[([^\]]+)\]/g;
  const matches = [...text.matchAll(re)];
  if (matches.length === 0) return [{ body: text }];

  const out: Movement[] = [];

  // İlk etiketten önce serbest metin varsa onu da al.
  const firstIdx = matches[0].index ?? 0;
  if (firstIdx > 0) {
    const pre = text.slice(0, firstIdx).trim();
    if (pre) out.push({ body: pre });
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    const body = text.slice(start, end).trim();
    if (!body) continue;

    const key = normalizeKey(m[1]);
    const known = LABELS[key];
    const label = known ? (tr ? known.tr : known.en) : titleCase(m[1].trim());
    out.push({ label, body });
  }

  return out.length ? out : [{ body: text }];
}
