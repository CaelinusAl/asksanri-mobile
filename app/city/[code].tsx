// app/city/[code].tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { logEvent } from "../../lib/LogEvent";
import { useLangStore } from "@/data/langStore";
import { CITY_NAMES, type CityCode } from "@/data/awakenedCities";
import { getCityContent, type Layer } from "@/data/awakenedContent";

export default function CityCodeScreen() {
  const router = useRouter();
  const appLang = useLangStore((s) => s.lang);
  const toggleLang = useLangStore((s) => s.toggle);

  const { code } = useLocalSearchParams<{ code?: string }>();
  const cityCode = (String(code || "01").padStart(2, "0")) as CityCode;

  const [layer, setLayer] = useState<Layer>("base");
  const [isPremium, setIsPremium] = useState(false);

  const cityName = CITY_NAMES?.[cityCode] ?? "Unknown";

  useEffect(() => {
  logEvent("screen_view", "awakened_cities", { screen: "city", code: cityCode });
}, [cityCode]);

  // ✅ backtick yok
  const headerTitle = useMemo(() => {
    return String(cityCode) + " · " + String(cityName);
  }, [cityCode, cityName]);

  const content = getCityContent(cityCode, appLang, layer);

  const deepenLabel = appLang === "en" ? "Deepen" : "Derinleş";
  const deepenSub =
    appLang === "en"
      ? "Go down one layer. The gate tells more."
      : "Alt katmana in. Kapi daha fazlasini soyluyor.";

  const labTitle = isPremium ? "LAB (Premium)" : "LAB (Locked)";
  const labSub =
    appLang === "en"
      ? isPremium
        ? "Code eye: symbol → role → system."
        : "Unlock Premium to activate code eye."
      : isPremium
      ? "Kod gözü: sembol → rol → sistem."
      : "Premium açılınca: kod gözü aktif olur.";

  const goTitle = "Ask Sanri Go";
  const goSub =
    appLang === "en"
      ? "Write one sentence. The system reflects meaning, not answers."
      : "Bir cümle yaz. Sistem cevap değil, anlam yansıtır.";

  const hint =
    appLang === "en"
      ? '"wake up" is not a command — it is a remembrance.'
      : '"wake up" bir komut değil — bir hatırlayış.';

  return (
    <View style={styles.root}>
      {/* TOP BAR sabit */}
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.topKicker}>SYSTEM TERMINAL</Text>

        <View style={styles.layerRow}>
          <View style={styles.layerChip}>
            <Text style={styles.layerChipTxt}>{layer.toUpperCase()}</Text>
          </View>

          <Pressable onPress={toggleLang} style={styles.langChip}>
            <Text style={styles.langChipTxt}>{appLang.toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>

      {/* ✅ SCROLL alanı */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>{headerTitle}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{content.title}</Text>
          <Text style={styles.story}>
  {content.story
    .split("\n")
    .filter((line) => !line.trim().startsWith("$"))
    .join("\n")}
</Text>
        </View>

        <View style={styles.actions}>
  <Pressable
    onPress={() => setLayer((p) => (p === "base" ? "deep" : "base"))}
    style={styles.deepBtn}
  >
    <Text style={styles.deepTitle}>{deepenLabel}</Text>
    <Text style={styles.deepSub}>{deepenSub}</Text>
  </Pressable>

  <Pressable
    onPress={() =>
      router.push({
        pathname: "/(tabs)/sanri_flow",
        params: {
          code: cityCode,
          city: cityName,
          layer: layer,
          lang: appLang,
        },
      })
    }
    style={styles.flowBtn}
  >
    <Text style={styles.flowTitle}>{goTitle}</Text>
    <Text style={styles.flowSub}>{goSub}</Text>
  </Pressable>
</View>
        <Text style={styles.hint}>{hint}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07080d",
    paddingTop: Platform.OS === "android" ? 14 : 0,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },

  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "800" },
  topKicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },

  layerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  layerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  layerChipTxt: { color: "#7ef9d6", fontWeight: "800", fontSize: 12, letterSpacing: 1 },

  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.4)",
  },
  langChipTxt: { color: "#bda8ff", fontWeight: "800", fontSize: 12, letterSpacing: 1 },

  h1: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 14,
  },

  card: {
    marginHorizontal: 18,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardTitle: { color: "#7cf7d8", fontSize: 20, fontWeight: "900", marginBottom: 12 },
  story: { color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 24 },
  reflection: { marginTop: 16, color: "white", fontSize: 18, fontWeight: "800", lineHeight: 26 },

  actions: { marginTop: 14, paddingHorizontal: 18, gap: 12 },

  deepBtn: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.55)",
  },
  deepTitle: { color: "white", fontSize: 26, fontWeight: "900" },
  deepSub: { color: "rgba(255,255,255,0.85)", marginTop: 6, fontSize: 14 },

  labBtn: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  labBtnLocked: { opacity: 0.55 },
  labTitle: { color: "#7cf7d8", fontSize: 20, fontWeight: "900" },
  labSub: { color: "rgba(255,255,255,0.70)", marginTop: 6, fontSize: 14 },

  flowBtn: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  flowTitle: { color: "white", fontSize: 20, fontWeight: "900" },
  flowSub: { color: "rgba(255,255,255,0.70)", marginTop: 6, fontSize: 14 },

  hint: {
    color: "rgba(180,255,230,0.6)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
    paddingHorizontal: 18,
  },
});
