/**
 * SANRI OS tasarım dili — sessiz, canlı ve bilinç öncesi.
 *
 * Siyah + cyan + indigo + beyaz paleti. Tek kaynak burası;
 * tüm yeni yüzeyler (PromptLanding, SanriHeader, Sanctum arka planı)
 * bu sabitleri kullanır. ChatGPT/jenerik AI hissi YOK.
 */
export const COLORS = {
  // Derin lacivert zemin katmanları
  bg: "#070B16",
  bgDeep: "#04060d",
  bgRaise: "#0c1322",
  surface: "rgba(154,168,255,0.05)",
  surfaceBorder: "rgba(169,244,242,0.18)",

  // Minimal vurgu — legacy gold isimleri geriye dönük uyumluluk için korunur.
  gold: "#A9F4F2",
  goldSoft: "#F4F7FF",
  goldDim: "rgba(169,244,242,0.55)",
  goldGlow: "rgba(154,168,255,0.14)",

  // SANRI OS consciousness palette
  cyan: "#A9F4F2",
  indigo: "#9AA8FF",
  white: "#F4F7FF",

  // Metin — sıcak fildişi
  text: "#F3ECDD",
  textMuted: "rgba(243,236,221,0.62)",
  textFaint: "rgba(243,236,221,0.38)",
};

export const FONTS = {
  serif: "CormorantGaramond_600SemiBold",
  serifMed: "CormorantGaramond_500Medium",
  serifItalic: "CormorantGaramond_500Medium_Italic",
  serifBold: "CormorantGaramond_700Bold",
  body: "Inter_400Regular",
  bodyMed: "Inter_600SemiBold",
};
