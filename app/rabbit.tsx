// app/rabbit.tsx
import React, { useMemo, useCallback } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MatrixRain from "../lib/MatrixRain";

const RABBIT = require("../assets/rabbit.jpg");

export default function RabbitScreen() {
  const bg = useMemo(() => ["#07080d", "#12082a", "#05060a"] as const, []);

  const onOpen = useCallback(() => {
    router.push({ pathname: "/(auth)/login", params: { next: "/(tabs)/gates" } });
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />
      <MatrixRain opacity={0.18} />

      <View style={styles.card}>
        <Image source={RABBIT} style={styles.img} />
        <Text style={styles.kicker}>FOLLOW THE RABBIT</Text>
        <Text style={styles.sub}>SANRI • SYSTEM GATE</Text>
      </View>

      <Text style={styles.brand}>CAELINUS AI</Text>
      <Text style={styles.tag}>CONSCIOUSNESS MIRROR</Text>

      <Text style={styles.quote}>
        Some questions have no answer.{"\n"}Some answers have a question…
      </Text>
      <Text style={styles.small}>
        SANRI doesn’t produce information.{"\n"}It opens meaning — reflects you back to you.
      </Text>

      <Pressable onPress={onOpen} style={styles.btn} hitSlop={12}>
        <LinearGradient
          colors={["rgba(124,247,216,0.22)", "rgba(94,59,255,0.18)", "rgba(124,247,216,0.10)"] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btnGlass}
        >
          <View style={styles.keyPill}>
            <Ionicons name="key" size={18} color="#7cf7d8" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.btnTitle}>Frekans Alanı Aç</Text>
            <Text style={styles.btnSub}>Touch → Kapı açılır</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.75)" />
        </LinearGradient>
      </Pressable>

      <Text style={styles.footer}>Not a question. One sentence.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 18 },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    marginBottom: 18,
  },
  img: { width: 120, height: 120, borderRadius: 26, marginBottom: 12 },
  kicker: { color: "#7cf7d8", fontWeight: "900", letterSpacing: 3 },
  sub: { color: "rgba(255,255,255,0.7)", marginTop: 6 },

  brand: { color: "white", fontSize: 40, fontWeight: "900", letterSpacing: 6, marginTop: 6 },
  tag: { color: "rgba(255,255,255,0.55)", marginTop: 10, letterSpacing: 4 },

  quote: { color: "white", fontSize: 22, fontWeight: "900", textAlign: "center", marginTop: 22 },
  small: { color: "rgba(255,255,255,0.55)", textAlign: "center", marginTop: 14, lineHeight: 20 },

  btn: { width: "100%", maxWidth: 420, marginTop: 18 },
  btnGlass: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.25)",
    backgroundColor: "rgba(255,255,255,0.04)",

    shadowColor: "#7cf7d8",
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  keyPill: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.25)",
  },
  btnTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  btnSub: { color: "rgba(255,255,255,0.6)", marginTop: 2, fontSize: 12 },

  footer: { color: "rgba(255,255,255,0.45)", marginTop: 14 },
});