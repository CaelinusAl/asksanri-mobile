// data/awakened/deep.ts

import { CityCode, Lang, CityBlock } from "./types";

export function deepLayer(
  code: CityCode,
  city: string,
  lang: Lang
): CityBlock | null {

  if (code === "51" && lang === "tr") {
    return {
      title: "51 · Matrix Derin İfşa",
      story:
        "5 duyudan 1'e yolculuk.\n" +
        "Yer altı şehirleri → bilinçaltı.\n" +
        "Aladağlar → zirveye yükseliş.\n\n" +
        "Niğde küçük görünür ama özün kapısını tutar.",
      reflection:
        "Duyulardan çıkıp özüne inmeye hazır mısın?",
    };
  }

  if (code === "51" && lang === "en") {
    return {
      title: "51 · Deep Matrix Reveal",
      story:
        "From five senses to one core.\n" +
        "Underground cities → subconscious.\n" +
        "Mountains → ascension.\n\n" +
        "Small outside. Gatekeeper within.",
      reflection:
        "Are you ready to descend into your core?",
    };
  }

  return null;
}