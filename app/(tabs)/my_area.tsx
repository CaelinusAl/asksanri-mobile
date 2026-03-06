// app/(tabs)/my_area.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function MyAreaScreen() {
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

        <View style={{ flex: 1 }} />

        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeTxt}>◎</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>MY AREA</Text>
        <Text style={styles.title}>Benim Alanım</Text>
        <Text style={styles.sub}>
          Sanrı burada seni hatırlamaya başlayacak.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profil</Text>
          <Text style={styles.cardText}>İsim, e-posta, dil, üyelik durumu</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hafızam</Text>
          <Text style={styles.cardText}>Kaydedilen temalar, semboller, notlar</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ritüel Geçmişim</Text>
          <Text style={styles.cardText}>Sanrı’nın sana önerdiği ritüeller</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Okumalarım</Text>
          <Text style={styles.cardText}>System feed, dünya olayları, üst bilinç kayıtları</Text>
        </View>

        <Pressable style={styles.actionBtn}>
          <Text style={styles.actionTxt}>Yakında aktif olacak</Text>
        </Pressable>

        <View style={{ height: 120 }} />
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
    backgroundColor: "rgba(0,0,0,0.36)",
  },

  topbar: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  backTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  profileBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.28)",
  },

  profileBadgeTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
  },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 8,
  },

  sub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 22,
  },

  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardTitle: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  cardText: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 15,
    lineHeight: 22,
  },

  actionBtn: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.80)",
  },

  actionTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
});