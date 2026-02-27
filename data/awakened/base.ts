// data/awakened/base.ts

import { CityEntry } from "./types";

export const AWAKENED_CITIES: {
  cities: Record<string, CityEntry>;
} = {
  cities: {
    "51": {
      city: "Niğde",
      tr: {
        title: "51 · Minimal Kod",
        story: "Az olan güçlüdür.",
        reflection: "Gerçeğin tek cümleyle ne?",
      },
      en: {
        title: "51 · Minimal Code",
        story: "Less is stronger.",
        reflection: "What is your truth in one sentence?",
      },
    },

    "74": {
      city: "Bartın",
      tr: {
        title: "74 · İnce Ayar",
        story: "Frekans milim oynar.",
        reflection: "Hangi kelime frekansını düşürüyor?",
      },
      en: {
        title: "74 · Fine Tuning",
        story: "Frequency shifts by millimeters.",
        reflection: "Which word lowers your frequency?",
      },
    },
  },
};