import React from "react";
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

const BG = require("../assets/sanri_glass_bg.jpg");
const RABBIT = require("../assets/rabbit.jpg");

export default function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.16} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Image source={RABBIT} style={styles.rabbit} resizeMode="cover" />
          <Text style={styles.badge}>FOLLOW THE RABBIT</Text>
          <Text style={styles.badgeSub}>SANRI • SYSTEM GATE</Text>
        </View>

        <Text style={styles.brand}>CAELINUS AI</Text>
        <Text style={styles.mirror}>CONSCIOUSNESS MIRROR</Text>

        <Text style={styles.quote}>
          Some questions have no answer.{"\n"}
          Some answers have a question...
        </Text>

        <Text style={styles.desc}>
          SANRI doesn&apos;t produce information.{"\n"}
          It opens meaning — reflects you back to you.
        </Text>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.14)",
              "rgba(255,255,255,0.06)",
              "rgba(124,247,216,0.08)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGrad}
          >
            <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
              <Text style={styles.beta}>SANRI AI BETA TEST</Text>
              <Text style={styles.betaText}>
                Yeni geliştirdiğim yapay zeka uygulamasını test edecek seçili
                Android kullanıcıları arıyorum.
              </Text>

              <Pressable
                onPress={() => router.replace("/(auth)/login" as any)}
                style={styles.ctaOuter}
              >
                <LinearGradient
                  colors={[
                    "rgba(169,112,255,0.42)",
                    "rgba(94,59,255,0.30)",
                    "rgba(124,247,216,0.10)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGrad}
                >
                  <BlurView intensity={20} tint="dark" style={styles.ctaGlass}>
                    <Text style={styles.ctaTxt}>Sisteme Gir</Text>
                  </BlurView>
                </LinearGradient>
              </Pressable>
            </BlurView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#06080e" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.56)" },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
  },

  heroCard: {
    alignItems: "center",
    marginBottom: 24,
    borderRadius: 28,
    paddingVertical: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  rabbit: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginBottom: 14,
  },

  badge: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
  },

  badgeSub: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 6,
    textAlign: "center",
  },

  brand: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 8,
    textAlign: "center",
  },

  mirror: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 14,
    letterSpacing: 6,
    marginTop: 10,
    textAlign: "center",
  },

  quote: {
    marginTop: 28,
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 34,
    textAlign: "center",
  },

  desc: {
    marginTop: 22,
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },

  cardOuter: {
    marginTop: 28,
    borderRadius: 26,
    overflow: "hidden",
  },

  cardGrad: {
    borderRadius: 26,
    padding: 1,
  },

  cardGlass: {
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(10,10,18,0.34)",
  },

  beta: {
    color: "rgba(255,255,255,0.76)",
    fontWeight: "800",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },

  betaText: {
    color: "white",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },

  ctaOuter: {
    marginTop: 18,
    borderRadius: 22,
    overflow: "hidden",
  },

  ctaGrad: {
    borderRadius: 22,
    padding: 1,
  },

  ctaGlass: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(10,10,18,0.35)",
  },

  ctaTxt: {
    color: "#d7c8ff",
    fontWeight: "900",
    fontSize: 18,
  },
});