import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

const translations = {
  tr: {
    brandLine: "CAELINUS AI • CONSCIOUSNESS MIRROR",
    title: "Delusion",
    subtitle: "Welcome. Write a sentence.\nI will reflect meaning, not answer.",
    follow: "FOLLOW THE RABBIT",
    enter: "Enter the Stream of Consciousness",
    enterSub: "Reflect • Deepen • Single question",
    hintTitle: "Hint",
    hint1: "Don't write questions.",
    hint2: "Write a sentence.",
    hint3: "Reflection takes shape in you.",
    doors: "Doors",
    doorsSub: "Which area do you want to move to?",
    delusionTitle: "Sanrı",
    delusionDesc: "Write a sentence. Not an answer — a reflection of meaning.",
    deepTitle: "Field of Consciousness",
    deepDesc: "Deep query. Clarification. One step.",
    freqTitle: "Frequency Domain",
    freqDesc: "Emotions • body • mind synchronization.",
    systemTitle: "Upper Consciousness",
    systemDesc: "System view • code eye • map.",
    matrixTitle: "Matrix",
    matrixDesc: "Code flow • simulation view.",
    lang: "Dil",
    trShort: "TR",
    enShort: "EN",
  },
  en: {
    brandLine: "CAELINUS AI • CONSCIOUSNESS MIRROR",
    title: "Sanri",
    subtitle: "Welcome. Write a sentence.\nI will reflect meaning, not answer.",
    follow: "FOLLOW THE RABBIT",
    enter: "Enter the Stream of Consciousness",
    enterSub: "Reflect • Deepen • Single question",
    hintTitle: "Hint",
    hint1: "Don’t write questions.",
    hint2: "Write a sentence.",
    hint3: "Reflection takes shape in you.",
    doors: "Gates",
    doorsSub: "Which field do you want to move to?",
    delusionTitle: "Delusion",
    delusionDesc: "Write a sentence. Not an answer — a reflection of meaning.",
    deepTitle: "Field of Consciousness",
    deepDesc: "Deep query. Clarification. One step.",
    freqTitle: "Frequency Field",
    freqDesc: "Emotion • body • mind synchronization.",
    systemTitle: "Upper Conscious",
    systemDesc: "System view • code eye • map.",
    matrixTitle: "Matrix",
    matrixDesc: "Code stream • simulation lens.",
    lang: "Language",
    trShort: "TR",
    enShort: "EN",
  },
};

export const i18n = new I18n(translations);

const device = (
  Localization.getLocales?.()[0]?.languageCode || "en"
).toLowerCase();
i18n.locale = device.startsWith("tr") ? "tr" : "en";
i18n.enableFallback = true;

export const t = (key: string) => i18n.t(key) as string;

export const setLang = (lang: "tr" | "en") => {
  i18n.locale = lang;
};
