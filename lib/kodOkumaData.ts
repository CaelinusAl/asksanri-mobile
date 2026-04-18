import { KOD_MODULLERI } from "./kodOkumaSistemiData.js";
import { MOBILE_LESSON_TITLE_SUFFIX } from "./kodOkumaTrFromCanonical";

export type Lesson = {
  id: string;
  moduleId: number;
  order: number;
  /** Türkçe liste / kart başlığı */
  title: string;
  /** İngilizce modda gösterim */
  titleEN: string;
  shortDescription: string;
  shortDescriptionEN: string;
  duration: string;
  isFree: boolean;
};

/** Web’deki ders başlığına karşılık gelen kısa İngilizce başlık (liste + ders ekranı). */
const LESSON_TITLE_EN: Record<string, string> = {
  "kod-nedir": "What Is Code? — Number rhythm",
  "insan-kod": "Human = Code — Letter and pattern",
  "kelimeyi-parcalamak": "Splitting the Word — Two mirrors",
  "anlam-katmanlari": "Layers of Meaning",
  "tekrar-eden-kelimeler": "Repeating Words",
  "ic-ses-ayrimi": "Inner Voice — Yours or Carried",
  "ilk-okuma-pratigi": "First Reading Practice",
  "donguler-tekrar": "Loops and Repetition",
  "karmik-bag-nedir": "What Is a Karmic Bond?",
  "ruhsal-bag-travma-bagi": "Soul Tie and Trauma Bond",
  "neden-aldatiliriz": "Why We Get Betrayed",
  "neden-kandiriliriz": "Why We Get Fooled",
  "disil-eril-kodlar": "Feminine and Masculine Codes",
  "duygu-kodlari-kritik": "Emotion Codes",
  "olay-kodlama": "Event Coding",
  "sistem-mesajlari": "System Messages",
  "kisisel-matrix": "Personal Matrix",
  "kor-noktalar": "Blind Spots",
  "kirilma-noktalari": "Breaking Points",
  "kendi-kodunu-yaz": "Write Your Own Code",
  "final-hatirlama": "Finale — Remembrance",
};

export function getLessonDisplayTitle(lesson: Lesson, lang: "tr" | "en"): string {
  return lang === "en" ? lesson.titleEN : lesson.title;
}

/** Canonical TR kısa açıklamaya paralel İngilizce özet (liste, meta, EN API). */
const LESSON_SHORT_DESC_EN: Record<string, string> = {
  "kod-nedir": "Notice another layer beneath what you see.",
  "insan-kod": "Names, meaning-pieces, building blocks of your story.",
  "kelimeyi-parcalamak": "Split the word into letters and syllables; hear what the root whispers.",
  "anlam-katmanlari": "Surface, sub-layer, deep layer — reading on three levels.",
  "tekrar-eden-kelimeler": "The same word from different mouths — a theme that insists.",
  "ic-ses-ayrimi": "Which thought is yours, which is carried?",
  "ilk-okuma-pratigi": "Read a short text as code; process, not verdict.",
  "donguler-tekrar":
    "Same feeling, different faces; family origin and body; what you cannot drop is often a feeling.",
  "karmik-bag-nedir": "Irresistible pull: intense closeness, intense wreck, unfinished loop.",
  "ruhsal-bag-travma-bagi": "Real bond vs dependency — who speaks the «can't live without» code?",
  "neden-aldatiliriz":
    "Not only worth: role rupture, ignored signals, where you abandoned yourself.",
  "neden-kandiriliriz":
    "You do not see what you refuse to see; intuition muted, story chosen over truth.",
  "disil-eril-kodlar": "Connection and flow; direction and edge — imbalance breaks the bond.",
  "duygu-kodlari-kritik":
    "Abandonment, worthlessness, control, invisibility — four motors under the bond.",
  "olay-kodlama": "Read an event in three lines: what happened, what it felt like, what it evoked.",
  "sistem-mesajlari": "Spot repeating themes in the collective feed.",
  "kisisel-matrix": "Your life's «rules»: where do you play the same move?",
  "kor-noktalar": "Strategies not to see: busyness, humor, delay.",
  "kirilma-noktalari": "In crisis, what was lost and what was gained: old role or new direction?",
  "kendi-kodunu-yaz": "Your own system: rules, signs, language.",
  "final-hatirlama": "Closing: you did not learn — you remembered.",
};

export function getLessonShortDescription(lesson: Lesson, lang: "tr" | "en"): string {
  return lang === "en" ? lesson.shortDescriptionEN : lesson.shortDescription;
}

export type Module = {
  id: number;
  titleTR: string;
  titleEN: string;
  subtitleTR: string;
  subtitleEN: string;
  icon: string;
  lessons: Lesson[];
};

const EN_MODULE_META: { titleEN: string; subtitleEN: string }[] = [
  {
    titleEN: "MODULE 1 — SEE THE CODE",
    subtitleEN:
      "Past the surface: number rhythm first, then letter, then the word’s two mirrors (reversal + anagram).",
  },
  {
    titleEN: "MODULE 2 — RELATIONSHIP CODES",
    subtitleEN:
      "Cycles and repeats, origins and karmic bonds, soul–trauma ties, betrayal and self-deception, feminine–masculine codes, emotion drivers.",
  },
  {
    titleEN: "MODULE 3 — READ THE MATRIX",
    subtitleEN: "Events, systems, and personal life read as message — the board and your move.",
  },
];

function displayLessonTitle(les: { id: string; title: string }): string {
  const s = MOBILE_LESSON_TITLE_SUFFIX[les.id];
  return s ? `${les.title}${s}` : les.title;
}

function buildModules(): Module[] {
  return KOD_MODULLERI.map((mod, i) => {
    const mid = i + 1;
    const en = EN_MODULE_META[i];
    if (!en) throw new Error("kodOkumaData: EN_MODULE_META length mismatch");

    return {
      id: mid,
      titleTR: mod.title,
      titleEN: en.titleEN,
      subtitleTR: mod.subtitle,
      subtitleEN: en.subtitleEN,
      icon: mod.icon,
      lessons: mod.lessons.map((les: any, j: number) => {
        const trTitle = displayLessonTitle(les);
        const trShort = String(les.shortDescription ?? "");
        return {
          id: les.id,
          moduleId: mid,
          order: j + 1,
          title: trTitle,
          titleEN: LESSON_TITLE_EN[les.id] ?? trTitle,
          shortDescription: trShort,
          shortDescriptionEN: LESSON_SHORT_DESC_EN[les.id] ?? trShort,
          duration: String(les.duration ?? "10 dk"),
          isFree: Boolean(les.isFree),
        };
      }),
    };
  });
}

export const MODULES: Module[] = buildModules();

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export function getModuleForLesson(lessonId: string): Module | undefined {
  return MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === lessonId);
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  if (idx < 0 || idx >= ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[idx + 1];
}
