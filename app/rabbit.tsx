import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MatrixRain from "../lib/MatrixRain";
import { useAuth } from "../context/AuthContext";

const BG = require("../assets/sanri_glass_bg.jpg");
const RABBIT = require("../assets/rabbit.jpg");

function getDisplayName(user: any) {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email?.includes("@")) return user.email.split("@")[0];
  return "Selin";
}

export default function RabbitScreen() {
  const { user, logout } = useAuth();
  const displayName = useMemo(() => getDisplayName(user), [user]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.16} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.container}>
        <View style={styles.hero}>
          <Image source={RABBIT} style={styles.rabbit} resizeMode="cover" />
          <Text style={styles.badge}>SANRI ELITE</Text>
          <Text style={styles.subtitle}>WHITE RABBIT PROTOCOL</Text>
        </View>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.14)",
              "rgba(255,255,255,0.06)",
              "rgba(124,247,216,0.06)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGrad}
          >
            <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
              <Text style={styles.welcome}>Hoş geldin,</Text>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.desc}>
                SANRI alanı seni tanıdı. Şimdi kapılar açılabilir.
              </Text>

              <Pressable onPress={() => router.replace("/(tabs)/gates" as any)} style={styles.btnOuter}>
                <LinearGradient
                  colors={[
                    "rgba(169,112,255,0.42)",
                    "rgba(94,59,255,0.30)",
                    "rgba(124,247,216,0.10)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGrad}
                >
                  <BlurView intensity={22} tint="dark" style={styles.btnGlass}>
                    <Text style={styles.btnTxt}>Kapıları Aç</Text>
                  </BlurView>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await logout();
                  router.replace("/(auth)/login" as any);
                }}
                style={styles.logoutBtn}
              >
                <Text style={styles.logoutTxt}>Çıkış Yap</Text>
              </Pressable>
            </BlurView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.58)" },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  hero: {
    alignItems: "center",
    marginBottom: 20,
  },

  rabbit: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 14,
  },

  badge: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 4,
  },

  subtitle: {
    marginTop: 6,
    color: "rgba(255,255,255,0.62)",
    fontWeight: "700",
    letterSpacing: 2,
  },

  cardOuter: {
    borderRadius: 26,
    overflow: "hidden",
  },

  cardGrad: {
    borderRadius: 26,
    padding: 1,
  },

  cardGlass: {
    borderRadius: 26,
    padding: 20,
    backgroundColor: "rgba(10,10,18,0.40)",
  },

  welcome: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 18,
  },

  name: {
    marginTop: 4,
    color: "#d7c8ff",
    fontSize: 34,
    fontWeight: "900",
  },

  desc: {
    marginTop: 12,
    color: "rgba(255,255,255,0.76)",
    lineHeight: 23,
    fontSize: 16,
  },

  btnOuter: {
    marginTop: 20,
    borderRadius: 22,
    overflow: "hidden",
  },

  btnGrad: {
    borderRadius: 22,
    padding: 1,
  },

  btnGlass: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(10,10,18,0.35)",
  },

  btnTxt: {
    color: "#d7c8ff",
    fontWeight: "900",
    fontSize: 18,
  },

  logoutBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 10,
  },

  logoutTxt: {
    color: "rgba(255,255,255,0.68)",
    fontWeight: "700",
  },
});