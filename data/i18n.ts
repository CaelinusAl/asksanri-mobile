export type Lang = "tr" | "en";

export function detectLang(): Lang {
  // 1) expo-localization varsa onu dene
  try {
    // dynamic require → modül yoksa patlamasın
    const Localization = require("expo-localization");
    const locale: string =
      Localization.getLocales?.()?.[0]?.languageCode ||
      Localization.locale ||
      "en";
    return String(locale).toLowerCase().startsWith("tr") ? "tr" : "en";
  } catch {}

  // 2) Intl fallback
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "en";
    return String(locale).toLowerCase().startsWith("tr") ? "tr" : "en";
  } catch {}

  return "en";
}
