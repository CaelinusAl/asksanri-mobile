/**
 * Ham metni assets/books/beyin_orgazm.json üretir.
 * Kullanım: node scripts/build-beyin-orgazm.mjs [girdi.txt]
 * Varsayılan girdi: scripts/beyin_orgazm_raw.txt
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const inputPath = process.argv[2] || path.join(__dirname, "beyin_orgazm_raw.txt");
const outPath = path.join(root, "assets", "books", "beyin_orgazm.json");

const MAX_CHUNK = 2800;

/**
 * Ham metinde çok fazla kısa paragraf olduğunda her biri ayrı "sayfa" oluyordu.
 * Ardışık içerik sayfalarını tek sayfada birleştirir (bölüm başlığından sonra sıfırlanır).
 */
function mergeAdjacentContentPages(pages, maxChunk = MAX_CHUNK) {
  const out = [];
  let buf = null;

  const flush = () => {
    if (buf) {
      out.push(buf);
      buf = null;
    }
  };

  for (const p of pages) {
    if (p.type !== "content") {
      flush();
      out.push(p);
      continue;
    }

    const body = (p.body || "").trim();
    if (!body) continue;

    if (!buf) {
      buf = { type: "content", title: p.title || "", body };
      continue;
    }

    const merged = `${buf.body}\n\n${body}`;
    if (merged.length <= maxChunk) {
      buf = { type: "content", title: "", body: merged };
    } else {
      out.push(buf);
      buf = { type: "content", title: "", body };
    }
  }
  flush();
  return out;
}

/** Okuyucuda paragraflara bölmek için: tek \n ile bitişik numaralı / sembol satırlarını \n\n yap */
function expandSoftBreaksForLayout(body) {
  if (!body) return body;
  return body
    .replace(/([^\n])\n(?=\d+\.\s)/g, "$1\n\n")
    .replace(/([^\n])\n(?=[🔹🔸🔮🌀⚡🌬])/g, "$1\n\n");
}

function expandContentBodies(pages) {
  return pages.map((p) => {
    if (p.type !== "content" || !p.body) return p;
    return { ...p, body: expandSoftBreaksForLayout(p.body) };
  });
}

/** Okuyucuda yatay 3→4: maddeler 1–3 / 4–5 ayrı sayfa (tek JSON sayfasında dikey kaydırma kopukluğu olmasın) */
function splitIntroGerçeklerBlock(pages) {
  const needle = "BEYİN ORGAZMI BAŞLATAN GERÇEKLER";
  const marker = "\n\n4. 💓 Kalp";
  const out = [];
  let done = false;
  for (const p of pages) {
    if (
      done ||
      p.type !== "content" ||
      !p.body?.includes(needle) ||
      !p.body.includes(marker)
    ) {
      out.push(p);
      continue;
    }
    const idx = p.body.indexOf(marker);
    if (idx < 0) {
      out.push(p);
      continue;
    }
    const a = p.body.slice(0, idx).trimEnd();
    const b = p.body.slice(idx + 2).trimStart();
    out.push({ ...p, body: a });
    out.push({ type: "content", title: "", body: b });
    done = true;
  }
  return out;
}

/**
 * Uzun bölüm gövdelerinde (ör. XI) tüm AŞAMA’lar tek content’ta kalıyordu;
 * yatay sayfa değişince bölüm bitmeden sonraki chapter’a geçilmiş gibi görünüyordu.
 * 🔹 AŞAMA … sınırlarında birden çok yatay sayfa.
 */
function splitContentAtAşamaStages(pages) {
  const out = [];
  const re = /\n\n(?=🔹\s*AŞAMA\b)/i;
  for (const p of pages) {
    if (p.type !== "content" || !p.body || !p.body.includes("🔹 AŞAMA")) {
      out.push(p);
      continue;
    }
    const body = p.body;
    const n = (body.match(/🔹\s*AŞAMA\b/gi) || []).length;
    if (n < 2 || body.length < 1100) {
      out.push(p);
      continue;
    }
    const parts = body
      .split(re)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length < 2) {
      out.push(p);
      continue;
    }
    for (const part of parts) {
      out.push({ type: "content", title: "", body: part });
    }
  }
  return out;
}

function chunkText(text) {
  const paragraphs = text.split(/\n\n+/);
  const pages = [];
  let buf = "";
  for (const p of paragraphs) {
    const t = p.trim();
    if (!t) continue;
    if (buf.length + t.length + 2 > MAX_CHUNK && buf.length > 0) {
      pages.push(buf.trim());
      buf = t;
    } else {
      buf += (buf ? "\n\n" : "") + t;
    }
  }
  if (buf) pages.push(buf.trim());
  return pages;
}

function stripLeadingEmoji(s) {
  return s.replace(/^[\s\uFE0F\u200d]*([\u{1F300}-\u{1FAFF}\u2600-\u27BF]\s*)+/u, "").trim();
}

/** Roma (XI., XLII., …) + sayılı BÖLÜM başlıkları */
function isChapterLine(line) {
  const t = stripLeadingEmoji(line).replace(/^\*\*|\*\*$/g, "").trim();
  if (!t || t.length > 220) return false;
  if (/^[IVXLCDM]{1,12}\.\s+.+/.test(t)) return true;
  if (/^\d+\.\s+BÖLÜM/i.test(t)) return true;
  if (/^\d+\.\s+Bölüm/i.test(t)) return true;
  if (/^📖\s*[IVXLCDM\d]{1,12}\.\s*Bölüm/i.test(line)) return true;
  if (/^BÖLÜM\s+\d+/i.test(t)) return true;
  return false;
}

function parseChapterHeader(line) {
  const t = stripLeadingEmoji(line).replace(/^\*\*|\*\*$/g, "").trim();
  const m = t.match(/^([IVXLCDM]{1,12}\.|\d+\.\s*)\s*(.+)$/);
  if (m) return { number: m[1].trim(), title: m[2].trim().slice(0, 200) };
  return { number: "•", title: t.slice(0, 200) };
}

function buildPages(raw) {
  const pages = [];
  const chapterTitles = [];

  pages.push({
    type: "cover",
    title: "Beyin Orgazmı",
    subtitle: "Bilgelik, hatırlayış ve bilinç titreşimi",
    author: "Celine River",
  });
  pages.push({
    type: "dedication",
    title: "",
    body:
      "Derin bir nefes al.\nÇünkü bu bilgi değil, bilgelik.\nBu öğrenmek değil, hatırlamak.\nBu okşamak değil, uyanmak.",
  });

  const paras = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const p of paras) {
    const lines = p.split("\n");
    const firstLine = lines[0]?.trim() || "";
    if (isChapterLine(firstLine)) {
      const { number, title } = parseChapterHeader(firstLine);
      chapterTitles.push(title);
      pages.push({ type: "chapter", number, title, epigraph: "" });
      const rest = lines.slice(1).join("\n").trim();
      if (rest) {
        for (const c of chunkText(rest)) {
          pages.push({ type: "content", title: "", body: c });
        }
      }
    } else {
      for (const c of chunkText(p)) {
        pages.push({ type: "content", title: "", body: c });
      }
    }
  }

  const merged = expandContentBodies(mergeAdjacentContentPages(pages));
  const withIntro = splitIntroGerçeklerBlock(merged);
  return { pages: splitContentAtAşamaStages(withIntro), chapterTitles };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error("Dosya yok:", inputPath);
    process.exit(1);
  }
  let raw = fs
    .readFileSync(inputPath, "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/^---+$/gm, "")
    .replace(/^—$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  raw = raw.replace(
    /^Derin bir nefes al\.\s*\nÇünkü bu bilgi değil, bilgelik\.\s*\nBu öğrenmek değil, hatırlamak\.\s*\nBu okşamak değil, uyanmak\.\s*\n+/,
    ""
  );
  const { pages, chapterTitles } = buildPages(raw);
  fs.writeFileSync(outPath, JSON.stringify(pages, null, 2), "utf8");
  console.log("Sayfa:", pages.length, "→", outPath);
  console.log("Bölüm başlığı sayısı:", chapterTitles.length);
  if (chapterTitles.length && chapterTitles.length <= 40) {
    console.log(JSON.stringify(chapterTitles, null, 2));
  }
}

main();
