// app/(tabs)/gates.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";

type Lang = "tr" | "en";

const HOLOGRAM_BG = require("../../assets/hologram_gate_bg.jpg");

// 81 il (plaka sırasına göre)
const TR_CITIES_81 = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
  "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri",
  "Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir",
  "Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
  "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
  "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye",
  "Düzce",
];

function codeToCity(code: string) {
  const n = Number(code);
  if (!Number.isFinite(n) || n < 1 || n > 81) return "";
  return TR_CITIES_81[n - 1] || "";
}

// “Yaşayan kapı” hissi için 12’li döngü (81’e otomatik yayılır)
const ARCHETYPES_TR = [
  { name: "Ateş Kapısı", line: "Erteleme yanar." },
  { name: "Su Kapısı", line: "Akışın yön verir." },
  { name: "Rüzgâr Kapısı", line: "Söz titreşimdir." },
  { name: "Toprak Kapısı", line: "Köklen ve tamamla." },
  { name: "Güneş Kapısı", line: "Görün ve parılda." },
  { name: "Ay Kapısı", line: "Sezgi konuşur." },
  { name: "Ayna Kapısı", line: "Ne isen onu görürsün." },
  { name: "Kod Kapısı", line: "Deseni fark et." },
  { name: "Eşik Kapısı", line: "Bir adım, bir dünya." },
  { name: "Sır Kapısı", line: "Saklı olan açılır." },
  { name: "Kader Kapısı", line: "Seçim çizgiyi değiştirir." },
  { name: "Birlik Kapısı", line: "Birlik hatırlanınca oyun biter." },
];

const ARCHETYPES_EN = [
  { name: "Fire Gate", line: "Delay burns." },
  { name: "Water Gate", line: "Flow gives direction." },
  { name: "Wind Gate", line: "Words are vibration." },
  { name: "Earth Gate", line: "Root and complete." },
  { name: "Sun Gate", line: "Be seen. Shine." },
  { name: "Moon Gate", line: "Intuition speaks." },
  { name: "Mirror Gate", line: "You see what you are." },
  { name: "Code Gate", line: "Notice the pattern." },
  { name: "Threshold Gate", line: "One step, a new world." },
  { name: "Secret Gate", line: "What’s hidden opens." },
  { name: "Fate Gate", line: "Choice changes the line." },
  { name: "Unity Gate", line: "When unity is remembered, the game ends." },
];

function gateForCode(code: string, lang: Lang) {
  const n = Number(code);
  const idx = Number.isFinite(n) ? (n - 1) % 12 : 0;
  const arr = lang === "tr" ? ARCHETYPES_TR : ARCHETYPES_EN;
  return arr[idx] || arr[0];
}

const COPY = {
  tr: {
    title: "Awakened Cities",
    sub: "01–81 | Şehrin kodunu seç. Kapı “plaka” ile açılır.",
    search: "Plaka ara… (örn 34) / şehir adı",
    back: "Geri",
    locked: "KİLİTLİ",
    hint: "Tap → City Detail",
    open: "Aç",
    needLoginTitle: "Frekansın kilitli.",
    needLoginSub: "Devam etmek için Frekansını Aç.",
    openFreq: "Frekansını Aç",
  },
  en: {
    title: "Awakened Cities",
    sub: "01–81 | Choose a city code. The gate opens with the plate.",
    search: "Search… (e.g. 34) / city name",
    back: "Back",
    locked: "LOCKED",
    hint: "Tap → City Detail",
    open: "Open",
    needLoginTitle: "Your frequency is locked.",
    needLoginSub: "To continue, activate your frequency.",
    openFreq: "Activate Frequency",
  },
} as const;

export default function GatesScreen() {
  const { user } = useAuth();
  const [lang, setLang] = useState<Lang>("tr");
  const t = COPY[lang];

  const [q, setQ] = useState("");

  // ✅ Login yoksa login’e gönder (RootLayout mount sonrası)
  useEffect(() => {
    if (user) return;
    const id = setTimeout(() => {
      router.replace({
        pathname: "/(auth)/login",
        params: { next: "/(tabs)/gates" },
      } as any);
    }, 0);
    return () => clearTimeout(id);
  }, [user]);

  const items = useMemo(() => {
    const all = Array.from({ length: 81 }, (_, i) => String(i + 1).padStart(2, "0"));
    const query = q.trim().toLowerCase();

    if (!query) return all;

    return all.filter((code) => {
      const city = codeToCity(code).toLowerCase();
      return code.includes(query) || city.includes(query);
    });
  }, [q]);

  const onPressCity = (code: string) => {
    // City detail route: app/city/[code].tsx (Stack)
    router.push({ pathname: "/city/[code]", params: { code } } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={HOLOGRAM_BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={styles.veil} />

      {/* Matrix Rain */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.16}  />
      </View>

      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/home"))}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={18} color="#7cf7d8" />
          <Text style={styles.backTxt}>{t.back}</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </Pressable>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>{t.title}</Text>
        <Text style={styles.h2}>{t.sub}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="rgba(124,247,216,0.9)" />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={t.search}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {items.map((code) => {
          const city = codeToCity(code) || code;
          const gate = gateForCode(code, lang);

          return (
            <Pressable key={code} style={styles.card} onPress={() => onPressCity(code)} hitSlop={8}>
              <LinearGradient
                colors={["rgba(124,247,216,0.10)", "rgba(94,59,255,0.10)", "rgba(0,0,0,0.00)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGlow}
              />

              <View style={styles.row}>
                {/* Plate (hologram) */}
                <View style={styles.plateBox}>
                  <Text style={[styles.plate, styles.platePurpleGlow]}>{code}</Text>
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.city}>{city}</Text>

                  <View style={styles.gateLineRow}>
                    <View style={styles.keyPill}>
                      <Ionicons name="key" size={14} color="#7cf7d8" />
                    </View>
                    <Text style={styles.gateTitle}>{gate.name}</Text>
                  </View>

                  <Text style={styles.gateHint} numberOfLines={1}>
                    {gate.line}
                  </Text>

                  <Text style={styles.tap}>{t.hint}</Text>
                </View>

                {/* Arrow */}
                <View style={styles.arrow}>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.75)" />
                </View>
              </View>
            </Pressable>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.58)" },

  topbar: {
    paddingTop: Platform.OS === "ios" ? 52 : 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontWeight: "800" },

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.28)" },
  langTxt: { color: "rgba(255,255,255,0.72)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  header: { paddingHorizontal: 16, paddingBottom: 12 },
  h1: { color: "white", fontSize: 30, fontWeight: "900", letterSpacing: 0.3 },
  h2: { marginTop: 8, color: "rgba(255,255,255,0.70)" },

  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
  },
  search: { flex: 1, color: "white" },

  list: { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
    overflow: "hidden",
  },
  cardGlow: { ...StyleSheet.absoluteFillObject },

  row: { flexDirection: "row", gap: 14, alignItems: "center" },

  plateBox: { width: 58, alignItems: "center", justifyContent: "center" },
  plate: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#7cf7d8",
    textShadowColor: "rgba(124,247,216,0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  platePurpleGlow: {
    textShadowColor: "rgba(94,59,255,0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },

  city: { color: "white", fontSize: 18, fontWeight: "900" },

  gateLineRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  keyPill: {
    width: 26,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
    shadowColor: "#7cf7d8",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  gateTitle: { color: "rgba(255,255,255,0.92)", fontWeight: "800" },
  gateHint: { marginTop: 6, color: "rgba(255,255,255,0.65)" },
  tap: { marginTop: 10, color: "rgba(124,247,216,0.90)", fontWeight: "800" },

  arrow: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
});