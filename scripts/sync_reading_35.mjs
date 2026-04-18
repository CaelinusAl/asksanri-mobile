import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const okPath = path.join(root, "..", "src", "data", "okumaData.js");
const tsPath = path.join(root, "lib", "okumaAlaniData.ts");

const mod = await import(pathToFileURL(okPath).href);
const p35 = mod.OKUMA_POSTS.find((p) => p.id === 35);
if (!p35) throw new Error("post 35 not found in okumaData.js");

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const { coverImage, hasEarlyPaywall, previewContent, deepReaderComments, ...rest } = p35;

const block = `  {
    id: ${rest.id},
    slug: ${JSON.stringify(rest.slug)},
    title: ${JSON.stringify(rest.title)},
    subtitle: ${JSON.stringify(rest.subtitle)},
    category: ${JSON.stringify(rest.category)},
    excerpt: ${JSON.stringify(rest.excerpt)},
    fullContent: \`${esc(rest.fullContent)}\`,
    codeLayer: \`${esc(rest.codeLayer)}\`,
    sanriReflection: {
      analysis: ${JSON.stringify(rest.sanriReflection.analysis)},
      strongLine: ${JSON.stringify(rest.sanriReflection.strongLine)},
      question: ${JSON.stringify(rest.sanriReflection.question)},
    },
    isPremium: ${rest.isPremium}, isFeatured: ${rest.isFeatured}, commentCount: ${rest.commentCount}, viewCount: ${rest.viewCount}, createdAt: ${JSON.stringify(rest.createdAt)},
  },`;

let ts = fs.readFileSync(tsPath, "utf8");
if (ts.includes("trump-iran-bogazi-hurmuz-gorunmeyen-hikaye-sistem-okumasi")) {
  console.log("mobile: post 35 already present");
  process.exit(0);
}

ts = ts.replace(
  '    isPremium: true, isFeatured: true, commentCount: 6, viewCount: 400, createdAt: "2026-04-17T10:00:00Z",',
  '    isPremium: true, isFeatured: false, commentCount: 6, viewCount: 400, createdAt: "2026-04-17T10:00:00Z",'
);

const marker = "export function getCategoryMeta(catId: string): CategoryMeta {";
const expIdx = ts.indexOf(marker);
if (expIdx < 0) throw new Error("getCategoryMeta not found");
const head = ts.slice(0, expIdx);
const tail = ts.slice(expIdx);
const closeIdx = head.lastIndexOf("];");
if (closeIdx < 0) throw new Error("]; not found before export");
const inner = head.slice(0, closeIdx).replace(/\s+$/, "");

ts =
  inner +
  "\r\n" +
  block.replace(/\n/g, "\r\n") +
  "\r\n];\r\n\r\n" +
  tail;

fs.writeFileSync(tsPath, ts, "utf8");
console.log("ok:", tsPath);
