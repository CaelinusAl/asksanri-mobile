import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { getOnboarding } from "../lib/onboardingStore";
import { ConsciousnessCore } from "../components/ConsciousnessCore";
import { SanctumBackground } from "../components/SanctumBackground";
import { COLORS, FONTS } from "../lib/theme";

/**
 * Root entry — sadeleştirilmiş açılış.
 *
 * Eski ezoterik "matrix + tavşan" (rabbit) giriş ekranı akıştan çıkarıldı
 * (rabbit.tsx dosyası duruyor ama artık launch'ta değil). Apple 4.3(b) +
 * "3 saniyede anla" hedefi.
 *
 * Akış:
 *   onboarding tamamlanmamış → /onboarding (tek seferlik)
 *   tamamlanmış              → /(tabs)      (Ana Sayfa: "Bugün aklından ne geçiyor?")
 *
 * Login zorlaması yok (5.1.1(v)).
 */
export default function IndexScreen() {
  const [target, setTarget] = useState<string | null>(null);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const name = "Selin";
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ob = await getOnboarding();
        if (!alive) return;
        setTarget(ob.completed ? "/(tabs)" : "/onboarding");
      } catch {
        if (alive) setTarget("/onboarding");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 5500),
      setTimeout(() => setPhase(2), 7500),
      setTimeout(() => setPhase(3), 9500),
      setTimeout(() => {
        if (target) router.replace(target as any);
      }, 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [target]);

  useEffect(() => {
    textOpacity.setValue(0);
    if (phase > 0) {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [phase, textOpacity]);

  return (
    <View style={styles.root}>
      <SanctumBackground showRing={false}>
        <View style={styles.center}>
          <ConsciousnessCore />
          <Animated.View style={[styles.message, { opacity: textOpacity }]}>
            {phase === 1 && <Text style={styles.line}>Merhaba {name}.</Text>}
            {phase === 2 && <Text style={styles.line}>Ben AURA.</Text>}
            {phase === 3 && <Text style={styles.line}>Bugün birlikte ne inşa ediyoruz?</Text>}
          </Animated.View>
        </View>
      </SanctumBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgDeep },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  message: {
    position: "absolute",
    bottom: "22%",
    paddingHorizontal: 24,
  },
  line: {
    color: COLORS.white,
    fontFamily: FONTS.serif,
    fontSize: 30,
    lineHeight: 38,
    textAlign: "center",
  },
});
