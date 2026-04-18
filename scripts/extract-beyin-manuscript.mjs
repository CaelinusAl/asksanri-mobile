/**
 * Cursor agent-transcript JSONL içinden beyin_orgazm ham metnini çıkarır.
 * Kullanım: node scripts/extract-beyin-manuscript.mjs <yol.jsonl>
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(__dirname, "beyin_orgazm_raw.txt");

const jsonlPath = process.argv[2];
if (!jsonlPath || !fs.existsSync(jsonlPath)) {
  console.error("Kullanım: node scripts/extract-beyin-manuscript.mjs <transcript.jsonl>");
  process.exit(1);
}

const lines = fs.readFileSync(jsonlPath, "utf8").split("\n");
const needle = "kitap eksik 16 sayfa Derin bir nefes al";
let found = null;
for (const line of lines) {
  if (!line.includes(needle)) continue;
  try {
    const obj = JSON.parse(line);
    const text = obj?.message?.content?.[0]?.text;
    if (typeof text === "string" && text.includes("Derin bir nefes al")) {
      found = text;
      break;
    }
  } catch {
    /* */
  }
}

if (!found) {
  console.error("Uygun satır bulunamadı (içinde şu olmalı:", needle, ")");
  process.exit(1);
}

let t = found.replace(/^<user_query>\s*/i, "").trim();
t = t.replace(/\nistediğim kitap akışı bu\s*$/i, "").trim();
t = t.replace(/^kitap eksik\s+\d+\s+sayfa\s+/i, "");

fs.writeFileSync(outPath, t, "utf8");
console.log("Yazıldı:", outPath, "karakter:", t.length);
