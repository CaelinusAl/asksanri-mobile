// data/langStore.ts
import { create } from "zustand";

export type Lang = "tr" | "en";

type LangState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

export const useLangStore = create<LangState>((set, get) => ({
  lang: "tr",
  setLang: (lang) => set({ lang }),
  toggle: () => set({ lang: get().lang === "tr" ? "en" : "tr" }),
}));