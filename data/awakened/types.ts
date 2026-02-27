// data/awakened/types.ts

export type Lang = "tr" | "en";
export type Layer = "base" | "deep" | "lab";

export type CityCode = string;

export type CityBlock = {
  title: string;
  story: string;
  reflection: string;
};

export type CityEntry = {
  city: string;
  tr: CityBlock;
  en: CityBlock;
};