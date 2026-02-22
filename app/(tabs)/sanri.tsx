import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function SanriTab() {
  const bg = useMemo(() => ["#07080d", "#0b0620", "#050610"] as const, []);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* Soft glow blobs */}
      <View style={[styles.glow, styles.glowA]} />
      <View style={[styles.glow, styles.glowB]} />
      <View style={[styles.glow, styles.glowC]} />

      <View style={styles.card}>
        <Text style={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>

        <Text style={styles.title}>Sanrı</Text>
        <Text style={styles.subtitle}>
          Hoş geldin. Bir cümle yaz. Ben cevap değil, anlam yansıtacağım.
        </Text>

        <View style={styles.divider} />

        <Pressable
          onPress={() => router.push("/(tabs)/sanri_flow")}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { transform: [{ scale: 0.99 }], opacity: 0.95 },
          ]}
        >
          <Text style={styles.primaryBtnText}>Bilinç Akışına Gir</Text>
          <Text style={styles.primaryBtnSub}>Yansıt • Derinleş • Tek soru</Text>
        </Pressable>

        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>İpucu</Text>
          <Text style={styles.hintText}>
            “Soru yazma.”{`\n`}
            “Bir cümle yaz.”{`\n`}
            “Yansıma sende şekillenir.”
          </Text>
        </View>

        <Text style={styles.footer}>
          Bu alan bir “cevap makinesi” değil. Bir fark ediş alanı.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d", justifyContent: "center", padding: 18 },
  glow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 420,
    opacity: 0.18,
  },
  glowA: { backgroundColor: "#7c4dff", top: -140, left: -160 },
  glowB: { backgroundColor: "#5aa0ff", top: 80, right: -180, opacity: 0.14 },
  glowC: { backgroundColor: "#a066ff", bottom: -180, left: 20, opacity: 0.12 },

  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 18,
  },
  kicker: { color: "rgba(255,255,255,0.65)", fontWeight: "900", letterSpacing: 2, fontSize: 11 },
  title: { color: "white", fontSize: 44, fontWeight: "900", marginTop: 10, letterSpacing: -0.5 },
  subtitle: { color: "rgba(255,255,255,0.82)", marginTop: 8, lineHeight: 20 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginVertical: 14 },

  primaryBtn: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(124,77,255,0.30)",
    borderWidth: 1,
    borderColor: "rgba(124,77,255,0.45)",
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "900", fontSize: 16, letterSpacing: 0.2 },
  primaryBtnSub: { marginTop: 6, color: "rgba(255,255,255,0.72)", fontSize: 12 },

  hintBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  hintTitle: { color: "rgba(255,255,255,0.85)", fontWeight: "900", marginBottom: 6 },
  hintText: { color: "rgba(255,255,255,0.72)", lineHeight: 18 },
  footer: { marginTop: 12, color: "rgba(255,255,255,0.55)", textAlign: "center", fontSize: 12 },
});