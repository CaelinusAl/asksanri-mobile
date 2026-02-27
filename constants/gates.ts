export type Gate = {
  id: string;
  title: string;
  subtitle: string;
  mode: "mirror" | "dream" | "divine" | "shadow" | "light";
  domain:
    | "auto"
    | "awakened_cities"
    | "consciousness_field"
    | "frequency_field"
    | "ritual_space"
    | "library";
  prefill: string;
};

export const GATES = [
  {
    id: "sanri",
    title: "Sanrı",
    subtitle: "Yansıma Akışı",
    mode: "mirror",
    domain: "auto",
    prefill: "",
  },

  {
    id: "cities",
    title: "Uyanmış Şehirler",
    subtitle: "Plaka ile Harita",
    mode: "mirror",
    domain: "awakened_cities",
    prefill: "34",
  },

  {
    id: "dream",
    title: "Rüya",
    subtitle: "Sembol Çözümü",
    mode: "dream",
    domain: "auto",
    prefill: "",
  },

  {
    id: "shadow",
    title: "Gölge",
    subtitle: "Yüzleşme",
    mode: "shadow",
    domain: "auto",
    prefill: "",
  },
];
