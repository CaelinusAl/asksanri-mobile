import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../lib/theme";

/**
 * SanctumBackground — SANRI'nın "bilinç alanı" atmosferi.
 *
 * Derin lacivert gradient + altın yıldız partikülleri + (opsiyonel)
 * merkezde nefes alan altın ışık halkası. ChatGPT/jenerik AI değil;
 * premium, sakin, editöryel bir alana girmiş hissi.
 */

type StarSpec = {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
  baseOpacity: number;
};

function Star({ spec }: { spec: StarSpec }) {
  const op = useRef(new Animated.Value(spec.baseOpacity * 0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(spec.delay),
        Animated.timing(op, {
          toValue: spec.baseOpacity,
          duration: spec.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(op, {
          toValue: spec.baseOpacity * 0.3,
          duration: spec.duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [op, spec]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: spec.top as any,
        left: spec.left as any,
        width: spec.size,
        height: spec.size,
        borderRadius: spec.size / 2,
        backgroundColor: COLORS.gold,
        opacity: op,
        shadowColor: COLORS.gold,
        shadowOpacity: 0.8,
        shadowRadius: spec.size,
        shadowOffset: { width: 0, height: 0 },
      }}
    />
  );
}

/** Merkezde nefes alan altın halka — birden çok eş-merkezli çember. */
function BreathingRing() {
  const scale = useRef(new Animated.Value(0.92)).current;
  const glow = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.06,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 1,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.92,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0.5,
            duration: 4200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, glow]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.ringWrap, { transform: [{ scale }], opacity: glow }]}
    >
      <View style={[styles.ring, styles.ringOuter]} />
      <View style={[styles.ring, styles.ringMid]} />
      <View style={[styles.ring, styles.ringInner]} />
      <View style={styles.ringCore} />
    </Animated.View>
  );
}

export function SanctumBackground({
  showRing = true,
  children,
}: {
  showRing?: boolean;
  children?: React.ReactNode;
}) {
  const stars = useMemo<StarSpec[]>(() => {
    const arr: StarSpec[] = [];
    for (let i = 0; i < 46; i++) {
      arr.push({
        id: i,
        top: `${Math.round(Math.random() * 96)}%`,
        left: `${Math.round(Math.random() * 96)}%`,
        size: Math.random() < 0.18 ? 2.6 : 1.4,
        delay: Math.random() * 4000,
        duration: 2200 + Math.random() * 2600,
        baseOpacity: 0.35 + Math.random() * 0.5,
      });
    }
    return arr;
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[COLORS.bgDeep, COLORS.bg, "#0a1126"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Üstten inen yumuşak altın hâle */}
      <LinearGradient
        colors={[COLORS.goldGlow, "transparent"]}
        style={styles.topGlow}
        pointerEvents="none"
      />

      {stars.map((s) => (
        <Star key={s.id} spec={s} />
      ))}

      {showRing && (
        <View style={styles.ringCenter} pointerEvents="none">
          <BreathingRing />
        </View>
      )}

      {children}
    </View>
  );
}

const RING = 300;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: RING,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
  },
  ringOuter: { width: RING, height: RING, borderColor: "rgba(212,178,106,0.18)" },
  ringMid: { width: RING * 0.72, height: RING * 0.72, borderColor: "rgba(212,178,106,0.3)" },
  ringInner: { width: RING * 0.46, height: RING * 0.46, borderColor: "rgba(212,178,106,0.45)" },
  ringCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.9,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
});
