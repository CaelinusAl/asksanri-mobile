import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

const HINTS_TR = [
  "Soruyu büyütme. Cümleyi sadeleştir.",
  "Bir kelime seç. Bedenine indir.",
  "Bugün en çok kaçtığın şey ne?",
  "Kendini ikna etme. Kendini duy.",
];

export default function SanriScreen() {
  const hint = useMemo(() => HINTS_TR[Math.floor(Math.random() * HINTS_TR.length)], []);
  const [busy, setBusy] = useState(false);

  const goFlow = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    // küçük “kapı açılıyor” hissi
    setTimeout(() => {
      router.push("/(tabs)/sanri_flow");
      setBusy(false);
    }, 220);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#05010c", "#070012", "#070018"]} style={StyleSheet.absoluteFillObject} />
      <View style={styles.glowA} />
      <View style={styles.glowB} />

      <View style={styles.card}>
        <Text style={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>
        <Text style={styles.title}>Sanrı</Text>
        <Text style={styles.sub}>
          Hoş geldin. Bir cümle yaz. Ben cevap değil,{"\n"}anlam yansıtacağım.
        </Text>

        <Pressable onPress={goFlow} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}>
          <Text style={styles.primaryBtnText}>Bilinç Akışına Gir</Text>
          <Text style={styles.primaryBtnSub}>Yansıt • Derinleş • Tek soru</Text>
        </Pressable>

        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>İpucu</Text>
          <Text style={styles.hintText}>“{hint}”</Text>
        </View>

        <Text style={styles.foot}>
          Bu alan bir “cevap makinesi” değil. Bir fark ediş alanı.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 18, justifyContent: "center", backgroundColor: "#07080d" },
  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 420,
    left: -120,
    top: 60,
    backgroundColor: "rgba(94,59,255,0.18)",
  },
  glowB: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    right: -160,
    bottom: -40,
    backgroundColor: "rgba(140,100,255,0.12)",
  },
  card: {
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  kicker: { color: "rgba(255,255,255,0.60)", letterSpacing: 2, fontWeight: "800", fontSize: 11 },
  title: { color: "white", fontSize: 44, fontWeight: "900", marginTop: 10 },
  sub: { color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 22, fontSize: 14 },
  primaryBtn: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(94,59,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.40)",
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
  primaryBtnSub: { color: "rgba(255,255,255,0.70)", marginTop: 6 },
  hintBox: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  hintTitle: { color: "rgba(255,255,255,0.70)", fontWeight: "900", marginBottom: 6 },
  hintText: { color: "rgba(255,255,255,0.88)", lineHeight: 20 },
  foot: { marginTop: 14, color: "rgba(255,255,255,0.55)" },
});