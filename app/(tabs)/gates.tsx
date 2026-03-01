import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/hologram_gate_bg.jpg");

export default function GatesScreen() {
  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      
      {/* Matrix katmanı */}
      <MatrixRain opacity={0.18} />

      <View style={styles.overlay} />

      <View style={styles.container}>
        <Text style={styles.title}>Kapılar</Text>
        <Text style={styles.sub}>Hangi alana geçmek istiyorsun?</Text>

        <GateItem
          title="SANRI"
          sub="Kişisel yansıma alanı"
          onPress={() => router.push("/(tabs)/sanri_flow")}
        />

        <GateItem
          title="AWAKENED CITIES"
          sub="Şehrin kodunu seç"
          onPress={() => router.push("/(tabs)/awakenedCities")}
        />

        <GateItem
          title="MATRIX"
          sub="Akışı decode et"
          onPress={() => router.push("/(tabs)/matrix")}
        />

        <GateItem
          title="ÜST BİLİNÇ"
          sub="Seviye 1–5 katmanları"
          onPress={() => router.push("/(tabs)/ust")}
        />

        <GateItem
          title="DÜNYA OLAYLARI"
          sub="Haber → mesaj okuması"
          onPress={() => router.push("/(tabs)/world")}
        />
      </View>
    </ImageBackground>
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
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },

  sub: {
    color: "#aaa",
    marginBottom: 24,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },

  cardSub: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 4,
  },
});