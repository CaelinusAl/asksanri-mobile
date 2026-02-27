import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function Rabbit() {
  useEffect(() => {
    const t = setTimeout(() => {
      // tavşandan sonra tab’lere ve Sanrı’ya geç
      router.replace("/(tabs)/sanri");
    }, 1400);

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.root}>
      <LinearGradient
        colors={["#05060a", "#0b0620", "#07080d"]}
        style={StyleSheet.absoluteFillObject}
      />
      <Text style={s.rabbit}>🐇</Text>
      <Text style={s.title}>FOLLOW THE RABBIT</Text>
      <Text style={s.sub}>Hologram Matrix Entry</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center" },
  rabbit: { fontSize: 74, marginBottom: 12 },
  title: { color: "white", fontSize: 18, letterSpacing: 3, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.55)", marginTop: 8 },
});
