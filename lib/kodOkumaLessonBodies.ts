/**
 * İngilizce ders gövdeleri (elle). Türkçe metin `kodOkumaSistemiData.js` + `kodOkumaTrFromCanonical.ts` üzerinden üretilir.
 */
import { buildTrLessonBodyFromCanonical } from "./kodOkumaTrFromCanonical";

const EN_BODIES: Record<string, string> = {
  "kod-nedir":
    "What is code?\n\n" +
    "This lesson will not «teach» you something.\n\n" +
    "It will show you what you already know.\n\n" +
    "Code is not the program you write.\n\n" +
    "Code is the order laid over reality.\n\n" +
    "A sentence carries code.\n\n" +
    "A date carries code.\n\n" +
    "A repeating event is often the loudest code.\n\n" +
    "Most people seek meaning.\n\n" +
    "The code reader seeks direction:\n\n" +
    "Where is this calling me?\n\n" +
    "What does this repetition remind me of?\n\n" +
    "What you see is never only the visible.\n\n" +
    "The visible is often the top layer.\n\n" +
    "What you will learn in this module is simple:\n\n" +
    "To move past the surface.\n\n" +
    "Without panic, without woo — just one step down.\n\n" +
    "—\n\n" +
    "Code box — sample reading\n\n" +
    "Example (word split)\n\n" +
    "The Turkish lesson text shows «İnsan → in + san → içinden yaratan» as a gaze, not a verdict. In English you might play other hinges — the point is: listen for parts, not for one frozen definition.\n\n" +
    "(This is not one correct answer; it is a lens. The world does not change — your reading can.)\n\n" +
    "Some things are not learned. They become visible.\n\n" +
    "—\n\n" +
    "Practical exit from this lesson\n\n" +
    "Full mirroring and deep splitting come in lesson 3; single letters in lesson 2. Here, first, rhythm: NUMBERS.\n\n" +
    "A number (1–99) also speaks: odd/even, digit sum, repeats, reduction — often emphasis, not quantity.\n\n" +
    "Short list: say the digits; odd/even; sum digits; notice 11, 22…; ask where it calls you.\n\n" +
    "Below: enter a number that calls you, or one sentence from today — SANRI reads the layers.",

  "insan-kod":
    "Human = Code\n\n" +
    "This lesson will not «teach» you something.\n\n" +
    "It shows what you already know.\n\n" +
    "You think you own your thoughts — much is carried: fear, the «not enough» hum.\n\n" +
    "Human = code does not shrink you — it sees structure.\n\n" +
    "Names, nicknames, voices that call you — each a sign.\n\n" +
    "Practice: read yourself as pattern, not as a list of faults.\n\n" +
    "—\n\n" +
    "Code box — name sample\n\n" +
    "Example split (sound-play): listen for movable hinges in your own language; in Turkish the lesson uses «Selin → ses + lin» as a gaze, not a verdict.\n\n" +
    "—\n\n" +
    "Exit: here we do not reverse full words — that is lesson 3. Feel one letter, short cluster, the first tremor of your name; ask direction.\n\n" +
    "Some things are not learned — they become visible.\n\n" +
    "Below: your name, nickname, one letter or short calling word — stay two minutes with what it feels like.",

  "kelimeyi-parcalamak":
    "Splitting the word\n\n" +
    "This lesson will not teach you something.\n\n" +
    "It shows what you already know.\n\n" +
    "Language carries order before «communication». Words are not random — sounds and meaning-pieces assemble.\n\n" +
    "To split is not to erase the word. It is to see rhythm inside: where it cuts, where it joins, which syllable is stressed.\n\n" +
    "You syllabified as a child; then «correct spelling» and «speed reading» fused the pieces again. Code reading returns that slow attention — without haste.\n\n" +
    "Some words sit in the body: throat, chest, jaw. When you split, notice which syllable tightens — that bodily hint answers what your mind is doing with the word.\n\n" +
    "Goal is not etymology class. Goal is distance: with distance, the word stops steering you; you inspect the word.\n\n" +
    "—\n\n" +
    "Code box — sample\n\n" +
    "The Turkish text uses «Korku → kor + ku» as a gaze, not a dictionary proof. In English, invent your own gentle hinges — same patience, same distance.\n\n" +
    "One layer reading (parallel): mind fences the threat inward; breathing room shrinks.\n\n" +
    "Try another word — same method, different pattern.\n\n" +
    "—\n\n" +
    "Two mirrors — technical frame\n\n" +
    "Do not mix steps: syllables first; then character reversal; then anagram multiset.\n\n" +
    "Reversal ≠ anagram — see Turkish lesson for Mayıs / sıyam vs sayım calibration.\n\n" +
    "Some things are not learned — they become visible.\n\n" +
    "Below: a word you use often lately or that tightens you — syllables + layers; SANRI shows both mirrors.",

  "anlam-katmanlari":
    "Layers of meaning\n\n" +
    "No single correct gloss. Three depths: surface, sub-layer (vibration before words), deep layer (echo in your life).\n\n" +
    "The reader does not cling to surface or flee into mysticism — one step at a time.\n\n" +
    "Same word changes colour in another mouth — layer plays with intent.\n\n" +
    "Layers are noticed, not memorised.\n\n" +
    "Below: one word or short line.",

  "tekrar-eden-kelimeler":
    "Repeating words\n\n" +
    "If a word returns, what you call coincidence is often theme.\n\n" +
    "Who says it, in what tone? Do you choose the word or does it stick to you?\n\n" +
    "Ask first: what does this repetition remind me of?\n\n" +
    "Pattern: same word — different mouths, same hum. There is a door.\n\n" +
    "Below: a repeated word and who says it.",

  "ic-ses-ayrimi":
    "Yours / not-yours inner voice\n\n" +
    "Not every inner line is yours — family phrase, collective tone, old shame can wear your voice.\n\n" +
    "Separate without blame: whose breath started this sentence?\n\n" +
    "When you see the split, choice appears.\n\n" +
    "Below: one inner line — whose is it?",

  "ilk-okuma-pratigi":
    "First reading practice\n\n" +
    "No grade here. Process, not verdict.\n\n" +
    "Read a short line slowly — surface first, then one step down. Do not hack the word in haste.\n\n" +
    "Where does this text call me?\n\n" +
    "Below: up to 2–3 lines of quote or your note.",

  "donguler-tekrar":
    "Loops and repeats\n\n" +
    "Same story, new faces — a loop, not bad luck.\n\n" +
    "Name trigger → reaction → outcome without moral heat — pattern, not verdict.\n\n" +
    "Below: a loop you know.",

  "karmik-bag-nedir":
    "What is a «karmic» bond?\n\n" +
    "Not a moral label — observation: pull you cannot drop, intimacy and wreckage intertwined. What does the code say?\n\n" +
    "Here «karmic» means repeating lesson, not fate as punishment.\n\n" +
    "Does this tie grow you or shrink you?\n\n" +
    "Below: a bond you cannot release.",

  "ruhsal-bag-travma-bagi":
    "Soul tie and trauma bond\n\n" +
    "Real bond widens with breath. Trauma bond narrows — «can't live without» is sometimes loss-fear speaking.\n\n" +
    "Marks: control, no exit, forgotten boundary — clarity, not accusation.\n\n" +
    "When the two blur, your body often knows before your mind.\n\n" +
    "Below: a tie where you said you could not live without them.",

  "neden-aldatiliriz":
    "Why we get betrayed\n\n" +
    "Not a blame question — blind spot question.\n\n" +
    "The signal was often there; you chose not to see. Shock is the sound of what was not read.\n\n" +
    "Where did you abandon yourself?\n\n" +
    "Below: breach of trust in short lines.",

  "neden-kandiriliriz":
    "Why we get fooled\n\n" +
    "Fooling is also the layer you refuse to see.\n\n" +
    "Where intuition is muted, mind sells logic — sometimes denial in a suit.\n\n" +
    "What truth would cost your body most to admit?\n\n" +
    "Below: a situation where you were fooled.",

  "disil-eril-kodlar":
    "Feminine and masculine codes\n\n" +
    "Not identity debate — language of flow and edge.\n\n" +
    "Flow/reception vs direction/edge — not enemies; imbalance breaks the bond.\n\n" +
    "Below: where flow and edge jam in one relationship.",

  "duygu-kodlari-kritik":
    "Emotion codes\n\n" +
    "Four motors often under bonds: abandonment, worthlessness, control, invisibility.\n\n" +
    "Which is active reshapes dialogue — same line, different costume.\n\n" +
    "Name the motor, not the villain.\n\n" +
    "Below: the feeling that drives this bond most.",

  "olay-kodlama":
    "Event coding\n\n" +
    "News is an event; so is what happens at your door.\n\n" +
    "Three lines — then: what is this event telling me?\n\n" +
    "Hear message, not hot take.\n\n" +
    "Below: a recent event that shook you.",

  "sistem-mesajlari":
    "System messages\n\n" +
    "Collective feeds carry repeating themes — fear, longing, rage.\n\n" +
    "Is this social panic or a megaphone for a hum already in your matrix?\n\n" +
    "Separate collective from personal — where is the bridge?\n\n" +
    "Below: a headline tone that sticks.",

  "kisisel-matrix":
    "Personal matrix\n\n" +
    "Invisible rules: when X, I always Y.\n\n" +
    "Not evil — map of repeating move.\n\n" +
    "Notice the same square, same move — pause there.\n\n" +
    "Below: one rule you keep living.",

  "kor-noktalar":
    "Blind spots\n\n" +
    "Strategies not to see — busy, joke, delay, denial. Sometimes survival.\n\n" +
    "Does this strategy bring me closer to truth or further?\n\n" +
    "Blind spot is not sin — dark corner; bring a lamp.\n\n" +
    "Below: what you use not to look.",

  "kirilma-noktalari":
    "Breaking points\n\n" +
    "Crisis is not only betrayal — it can be the crack of an old role.\n\n" +
    "Loss and gain share the threshold: what dropped, what you chose?\n\n" +
    "Where did this break carry me?\n\n" +
    "Below: a recent break or turning edge.",

  "kendi-kodunu-yaz":
    "Write your own code\n\n" +
    "No borrowed lines — your language.\n\n" +
    "Three signs, three rules — your system, your contract.\n\n" +
    "Not perfection — honesty. Code as carrier, not cage.\n\n" +
    "Below: three lines of your code.",

  "final-hatirlama":
    "Final — remembrance\n\n" +
    "No exam. No certificate.\n\n" +
    "You did not «learn» — you gathered what you remembered.\n\n" +
    "Code reading is not an ending — it is sight, turned.\n\n" +
    "Last question: looking at yourself, what is clear for the first time?\n\n" +
    "Some things are not learned — they become visible.\n\n" +
    "Below: one sentence — what I remember…",
};

export function getLessonBody(lessonId: string, lang: "tr" | "en"): string | null {
  if (lang === "tr") return buildTrLessonBodyFromCanonical(lessonId);
  return EN_BODIES[lessonId] ?? null;
}
