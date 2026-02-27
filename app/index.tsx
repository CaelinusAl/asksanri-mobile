import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Image,
  Easing,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

import MatrixRain from "../lib/MatrixRain";
import StarTrailOverlay from "../lib/StarTrailOverlay";
import { useFonts, Inter_700Bold, Inter_900Black } from "@expo-google-fonts/inter";
import { CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond"

const RABBIT = require("../assets/rabbit.jpg");

export default function HomeScreen() {
  // Entrance / exit
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Premium motion layers
  const breathe = useRef(new Animated.Value(0)).current;     // glow pulse
  const scan = useRef(new Animated.Value(0)).current;        // scanline
  const shimmer = useRef(new Animated.Value(0)).current;     // holo sheen
  const glitch = useRef(new Animated.Value(0)).current;      // micro glitch on press
  

  // Tap star trail
  const [lastTap, setLastTap] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const loop2 = Animated.loop(
      Animated.timing(scan, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })
    );

    const loop3 = Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 3400, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    );

    loop1.start();
    loop2.start();
    loop3.start();

    return () => {
      loop1.stop();
      loop2.stop();
      loop3.stop();
    };
  }, [breathe, scan, shimmer]);

  const enter = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    glitch.setValue(0);
    Animated.sequence([
      Animated.timing(glitch, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(glitch, { toValue: 0, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.965, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => router.push("/(tabs)/sanri_flow"));
  };

  const onTouchStart = (e: any) => {
    const t = e?.nativeEvent?.touches?.[0];
    if (!t) return;
    setLastTap({ x: t.pageX, y: t.pageY });
  };

  const glowScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const glowOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.65] });

  const scanY = scan.interpolate({ inputRange: [0, 1], outputRange: [-240, 240] });
  const sheenX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-220, 220] });

  const glitchX = glitch.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const glitchY = glitch.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  const bg = useMemo(() => ["#07080d", "#0b0620", "#050610"] as const, []);
  const [fontsLoaded] = useFonts({
  Inter_700Bold,
  Inter_900Black,
  CormorantGaramond_600SemiBold,
});

if (!fontsLoaded) return null;

  return (
    <View style={styles.root} onTouchStart={onTouchStart}>
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* Matrix Rain layer (subtle, premium) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.18} speedMs={8200} />
      </View>

      {/* Dark veil for readability */}
      <View pointerEvents="none" style={styles.topLight} />

      {/* Star trail */}
      {lastTap && (
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <StarTrailOverlay x={lastTap.x} y={lastTap.y} active={true} />
        </View>
      )}

      <Animated.View
        style={[
          styles.center,
          {
            opacity: fade,
            transform: [{ scale }, { translateX: glitchX }, { translateY: glitchY }],
          },
        ]}
      >
        {/* SANRI PORTAL CARD */}
        <View style={styles.portalWrap}>
          {/* breathing glow */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.portalGlow,
              { opacity: glowOpacity, transform: [{ scale: glowScale }] },
            ]}
          />

          {/* glass card */}
          <View style={styles.portalCard}>
            {/* scanline */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.scanline,
                { transform: [{ translateY: scanY }] },
              ]}
            />

            {/* holo sheen */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.sheen,
                { transform: [{ translateX: sheenX }, { rotate: "-18deg" }] },
              ]}
            />

            {/* rabbit */}
            <View style={styles.rabbitFrame}>
              <Image source={RABBIT} style={styles.rabbitImg} resizeMode="contain" />
              <View pointerEvents="none" style={styles.rabbitTint} />
            </View>

            {/* micro brand */}
            <Text style={styles.micro}>SANRI • SYSTEM GATE</Text>
            <Text style={styles.rabbitTag}>FOLLOW THE RABBIT</Text>
<Text style={styles.rabbitSub}>You’re not here by accident.</Text>
          </View>
        </View>

        {/* COPY */}
        <Text style={styles.title}>Kapı açılmıyor—</Text>
        <Text style={styles.title}>hatırlanıyor.</Text>

        <Text style={styles.sub}>Bir cümle bırak.</Text>
        <Text style={styles.sub}>Gerisi seni bulur.</Text>

        {/* CTA */}
        <Pressable style={styles.btn} onPress={enter} hitSlop={16}>
  <LinearGradient
    colors={["rgba(94,59,255,0.85)", "rgba(124,247,216,0.20)", "rgba(94,59,255,0.65)"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.btnInner}
  >
    <View style={styles.btnRow}>
  <Text style={styles.btnIcon}>⟡</Text>
  <Text style={styles.btnMain}>KAPIYI AÇ</Text>
  <Text style={styles.btnIcon}>🗝</Text>
</View>

<Text style={styles.btnSub}>ENTER THE FIELD</Text>
  </LinearGradient>
</Pressable>


        <Text style={styles.hint}>Soru değil. Tek cümle.</Text>

        <Text style={styles.footer}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  
  
rabbitTag: {
  marginTop: 10,
  color: "rgba(124,247,216,0.75)",
  letterSpacing: 4,
  fontSize: 12,
  fontWeight: "900",
  textAlign: "center",
},
rabbitSub: {
  marginTop: 6,
  color: "rgba(255,255,255,0.45)",
  letterSpacing: 1.5,
  fontSize: 11,
  fontWeight: "700",
  textAlign: "center",
},

  topLight: {
    position: "absolute",
    top: -120,
    width: 520,
    height: 520,
    borderRadius: 520,
    backgroundColor: "rgba(124,247,216,0.06)",
    alignSelf: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 26,
  },

  portalWrap: {
    width: 280,
    height: 280,
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  portalGlow: {
    position: "absolute",
    width: 290,
    height: 290,
    borderRadius: 290,
    backgroundColor: "rgba(124,247,216,0.10)",
  },

  portalCard: {
    width: 250,
    height: 250,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  scanline: {
    position: "absolute",
    left: -40,
    right: -40,
    height: 70,
    backgroundColor: "rgba(124,247,216,0.07)",
  },

  sheen: {
    position: "absolute",
    width: 140,
    height: 340,
    backgroundColor: "rgba(255,255,255,0.06)",
    left: 0,
    top: -60,
  },

  rabbitFrame: {
    width: 190,
    height: 190,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  rabbitImg: { width: 170, height: 170 },

  rabbitTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(94,59,255,0.10)",
  },

  micro: {
    position: "absolute",
    bottom: 14,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "900",
  },

  // ✅ Typography (fontFamily'leri fontlar yüklenince çalışır)
  title: {
    fontFamily: "CormorantGaramond_600SemiBold",
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1.2,
    lineHeight: 36,
  },

  sub: {
    fontFamily: "Inter_700Bold",
    marginTop: 10,
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  btn: {
    marginTop: 28,
    width: 260,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.45)",
  },

  btnInner: {
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
  },

  btnText: {
    fontFamily: "Inter_900Black",
    color: "white",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 14,
  },

  btnSub: {
  marginTop: 6,
  color: "rgba(255,255,255,0.55)",
  fontSize: 11,
  letterSpacing: 2,
  textAlign: "center",
},
  
btnRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
},

btnIcon: {
  color: "rgba(124,247,216,0.95)",
  fontSize: 16,
  fontWeight: "900",
},

btnMain: {
  color: "white",
  fontSize: 18,
  fontWeight: "900",
  letterSpacing: 3,
},

hint: {
  fontFamily: "Inter_700Bold",
  marginTop: 16,
  fontSize: 12,
  color: "rgba(255,255,255,0.42)",
  letterSpacing: 0.6,
},

footer: {
  position: "absolute",
  bottom: Platform.OS === "ios" ? 28 : 24,
  color: "rgba(255,255,255,0.22)",
  letterSpacing: 2,
  fontSize: 11,
  fontWeight: "800",
  },
});