// data/awakened/lab.ts

import { CityCode, Lang, CityBlock } from "./types";

export function labLayer(
  code: CityCode,
  city: string,
  lang: Lang
): CityBlock | null {

  if (code === "51" && lang === "tr") {
    return {
      title: "LAB · İç Kod",
      story:
        "Kod gözü aktif.\n" +
        "Şehir artık dış değil.\n" +
        "Bu senin bilinçaltı haritan.",
      reflection:
        "Bugün hangi iç kuralı yeniden yazıyorsun?",
    };
  }

  if (code === "51" && lang === "en") {
    return {
      title: "LAB · Inner Code",
      story:
        "Code eye activated.\n" +
        "The city is no longer outside.\n" +
        "This is your inner map.",
      reflection:
        "Which inner rule are you rewriting today?",
    };
  }

  return null;
}