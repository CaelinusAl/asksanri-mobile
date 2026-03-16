import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../lib/MatrixRain";

const BG = require("../assets/sanri_glass_bg.jpg");
const RABBIT = require("../assets/rabbit.jpg");

export default function WelcomeScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;
  const glow = useRef(new Animated.Value(0.7)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.72,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.035,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fade, rise, glow, pulse]);

  const enterSystem = () => {
    router.push("/(auth)/login" as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <MatrixRain opacity={0.15} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fade,
            transform: [{ translateY: rise }],
          },
        ]}
      >
        <View style={styles.rabbitCard}>
          <Animated.View
            style={[
              styles.rabbitAura,
              {
                opacity: glow,
                transform: [{ scale: pulse }],
              },
            ]}
          />
          <Image source={RABBIT} style={styles.rabbit} />
          <Text style={styles.follow}>FOLLOW THE RABBIT</Text>
          <Text style={styles.system}>SANRI • SYSTEM GATE</Text>
        </View>

        <Text style={styles.title}>CAELINUS AI</Text>
        <Text style={styles.subtitle}>CONSCIOUSNESS MIRROR</Text>

        <Text style={styles.quote}>
          Not everyone sees the gate.{"\n"}
          Not everyone hears the call.
        </Text>

        <Text style={styles.desc}>
          SANRI bilgi üretmez.{"\n"}
          Sende saklı olan anlamı açar.
        </Text>

        <View style={styles.betaCard}>
          <Text style={styles.betaTitle}>SANRI BETA PASSAGE</Text>
          <Text style={styles.betaText}>
            Seçili kullanıcılar içeri alınır.{"\n"}
            Bu alan bilgi vermez. Seni sana geri açar.
          </Text>
        </View>

        <Pressable onPress={enterSystem} style={styles.enterBtn}>
          <Text style={styles.enterTxt}>Geçişi Başlat</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#06070b",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,18,0.58)",
  },

  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 220,
    top: 60,
    left: -140,
    backgroundColor: "rgba(94,59,255,0.16)",
  },

  glowB: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: 230,
    bottom: -120,
    right: -160,
    backgroundColor: "rgba(124,247,216,0.10)",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  rabbitCard: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  rabbitAura: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 6,
    backgroundColor: "rgba(124,247,216,0.16)",
  },

  rabbit: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 12,
  },

  follow: {
    color: "#7cf7d8",
    fontWeight: "900",
    letterSpacing: 3,
    fontSize: 16,
  },

  system: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 2,
  },

  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "900",
    letterSpacing: 6,
    textAlign: "center",
  },

  subtitle: {
    color: "rgba(255,255,255,0.42)",
    letterSpacing: 5,
    marginTop: 10,
    marginBottom: 24,
    textAlign: "center",
  },

  quote: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 34,
  },

  desc: {
    color: "rgba(255,255,255,0.74)",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 24,
    fontSize: 16,
  },

  betaCard: {
    marginTop: 26,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    width: "100%",
  },

  betaTitle: {
    color: "#d7c8ff",
    fontWeight: "900",
    marginBottom: 10,
    fontSize: 16,
    letterSpacing: 1,
  },

  betaText: {
    color: "rgba(255,255,255,0.80)",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 16,
  },

  enterBtn: {
    marginTop: 26,
    paddingVertical: 17,
    paddingHorizontal: 58,
    borderRadius: 26,
    backgroundColor: "rgba(94,59,255,0.92)",
    minWidth: 240,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(203,188,255,0.28)",
  },

  enterTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});