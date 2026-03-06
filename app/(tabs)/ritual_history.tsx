import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function RitualHistoryScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.title}>Ritüel Geçmişim</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sanrı Ritüelleri</Text>
          <Text style={styles.cardText}>
            Sana önerilen ritüeller burada görünecek.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ses + Metin Akışları</Text>
          <Text style={styles.cardText}>
            Geçmiş ritüel kayıtların bu alanda tutulacak.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07080d",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  topbar: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

  backTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
  },

  container: {
    padding: 18,
    gap: 14,
  },

  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardTitle: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  cardText: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 22,
  },
});