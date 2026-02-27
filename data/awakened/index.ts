// data/awakened/index.ts

import { AWAKENED_CITIES } from "./base";
import { deepLayer } from "./deep";
import { labLayer } from "./lab";
import { CityCode, Lang, Layer, CityBlock } from "./types";

export function getCityContent(
  code: CityCode,
  lang: Lang,
  layer: Layer
): CityBlock | null {

  const entry = AWAKENED_CITIES.cities[code];
  if (!entry) return null;

  const base = lang === "tr" ? entry.tr : entry.en;

  if (layer === "base") return base;

  if (layer === "deep") {
    const deep = deepLayer(code, entry.city, lang);
    if (!deep) return base;

    return {
      title: deep.title,
      story: base.story + "\n\n" + deep.story,
      reflection: deep.reflection,
    };
  }

  if (layer === "lab") {
    const lab = labLayer(code, entry.city, lang);
    if (!lab) return base;

    return {
      title: lab.title,
      story: base.story + "\n\n" + lab.story,
      reflection: lab.reflection,
    };
  }

  return base;
}