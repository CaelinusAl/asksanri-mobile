// app/(tabs)/gates.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  ScrollView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

const BG = require("../../assets/hologram_gate_bg.jpg");

const COPY = {
  tr: {
    title: "Kapılar",
    sub: "Hangi alana geçmek istiyorsun?",
    items: [
      { title: "SANRI", sub: "Kişisel yansıma alanı", route: "/(tabs)/sanri_flow" },
      { title: "AWAKENED CITIES", sub: "Şehrin kodunu seç", route: "/(tabs)/awakenedCities" },
      { title: "MATRIX", sub: "Akışı decode et", route: "/(tabs)/matrix" },
      { title: "ÜST BİLİNÇ", sub: "Seviye 1–5 katmanları", route: "/(tabs)/ust_bilinc" },
      { title: "RİTÜEL ALANI", sub: "Okunur ve hissedilir · ses + metin", route: "/(tabs)/rituals" },
      { title: "DÜNYA OLAYLARI", sub: "Haber → mesaj okuması", route: "/(tabs)/world" },
      { title: "SYSTEM FEED", sub: "Sanrı günlük bilinç akışı", route: "/(tabs)/system_feed" },
    ],
  },
  en: {
    title: "Gates",
    sub: "Which field do you want to enter?",
    items: [
      { title: "SANRI", sub: "Personal reflection field", route: "/(tabs)/sanri_flow" },
      { title: "AWAKENED CITIES", sub: "Choose a city code", route: "/(tabs)/awakenedCities" },
      { title: "MATRIX", sub: "Decode the stream", route: "/(tabs)/matrix" },
      { title: "HIGHER MIND", sub: "Levels 1–5 layers", route: "/(tabs)/ust_bilinc" },
      { title: "RITUAL SPACE", sub: "Read + feel · audio + text", route: "/(tabs)/rituals" },
      { title: "WORLD EVENTS", sub: "News → meaning reading", route: "/(tabs)/world" },
    ],
  },
} as const;

export default function GatesScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const t = useMemo(() => COPY[lang], [lang]);

  const toggleLang = () => setLang((p) => (p === "tr" ? "en" : "tr"));

  const onBack = () => {
    if ((router as any).canGoBack?.()) router.back();
    else router.replace("/(tabs)/index" as any);
  };

  const openProfile = () => {
    router.push("/(tabs)/my_area" as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" translucent={false} />

      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">

        {/* MATRIX EFFECT */}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <MatrixRain opacity={0.18} />
        </View>

        <View pointerEvents="none" style={styles.overlay} />

        {/* TOP BAR */}
        <View style={styles.topbar}>

          {/* PROFIL */}
          <Pressable onPress={openProfile} style={styles.profileBtn}>
            <Text style={styles.profileTxt}>◎</Text>
          </Pressable>

          {/* BACK */}
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backTxt}>←</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          {/* LANGUAGE */}
          <Pressable onPress={toggleLang} style={styles.langChip}>
            <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>

          <View style={{ height: 14 }} />

          {t.items.map((it) => (
            <GateItem
              key={it.route + it.title}
              title={it.title}
              sub={it.sub}
              onPress={() => router.push(it.route as any)}
            />
          ))}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

function GateItem({
  title,
  sub,
  onPress,
}: {
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.10)",
          "rgba(255,255,255,0.06)",
          "rgba(124,247,216,0.06)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGlass}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSub}>{sub}</Text>
        </View>

        <View style={styles.chevWrap}>
          <Text style={styles.chev}>›</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#07080d" },
  bg: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 8,
  },

  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.30)",
  },

  profileTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
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

  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },

  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },

  langTxt: { color: "#cbbcff", fontWeight: "900", letterSpacing: 1 },

  scroll: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 140,
  },

  title: { color: "white", fontSize: 40, fontWeight: "900", marginTop: 6 },

  sub: { color: "rgba(255,255,255,0.70)", marginTop: 6, fontSize: 16 },

  card: {
    borderRadius: 26,
    overflow: "hidden",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  cardGlass: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cardTitle: { color: "white", fontSize: 22, fontWeight: "900" },

  cardSub: { color: "rgba(255,255,255,0.68)", marginTop: 6, fontSize: 14 },

  chevWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  chev: { color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: "900" },
});