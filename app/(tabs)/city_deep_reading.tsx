import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function CityDeepReadingScreen() {
  const params = useLocalSearchParams<{
    code?: string;
    city?: string;
    lang?: string;
  }>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.1} />
      </View>
      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kicker}>DEEP READING</Text>
        <Text style={styles.title}>{params.city || "Şehir"}</Text>
        <Text style={styles.sub}>Kod: {params.code || "-"}</Text>

        {loading ? (
          <View style={styles.card}>
            <ActivityIndicator />
            <Text style={styles.body}>Derin okuma hazırlanıyor...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.section}>Derin Katman</Text>
            <Text style={styles.body}>
              Bu alanda şehrin sembolik yapısı, bilinç kodu, gölge katmanı ve yön mesajı gösterilecek.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.38)" },
  topbar: { paddingTop: 54, paddingHorizontal: 16, paddingBottom: 8 },
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
  container: { padding: 18, paddingBottom: 120 },
  kicker: { color: "rgba(255,255,255,0.5)", letterSpacing: 2, fontWeight: "800", marginBottom: 8 },
  title: { color: "white", fontSize: 38, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 6, marginBottom: 18 },
  card: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  section: { color: "#7cf7d8", fontSize: 18, fontWeight: "900", marginBottom: 10 },
  body: { color: "white", lineHeight: 24, fontSize: 15, marginTop: 10 },
});