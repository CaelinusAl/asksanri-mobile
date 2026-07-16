import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { COLORS } from "../lib/theme";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
};

const SIZE = 220;

export function ConsciousnessCore({ compact = false }: { compact?: boolean }) {
  const breath = useRef(new Animated.Value(0.9)).current;
  const glow = useRef(new Animated.Value(0.48)).current;
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 42 }, (_, id) => ({
        id,
        x: 28 + ((id * 47) % 164),
        y: 26 + ((id * 73) % 168),
        size: id % 7 === 0 ? 4 : id % 3 === 0 ? 3 : 2,
        color: [COLORS.cyan, COLORS.indigo, COLORS.white][id % 3],
        delay: (id * 91) % 1800,
      })),
    []
  );

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(breath, { toValue: 1.08, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(breath, { toValue: 0.9, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glow, { toValue: 0.9, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.48, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breath, glow]);

  const scale = compact ? 0.7 : 1;
  return (
    <Animated.View style={[styles.core, { transform: [{ scale: Animated.multiply(breath, scale) }], opacity: glow }]}>
      <View style={styles.haze} />
      {particles.map((particle) => (
        <View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size,
              backgroundColor: particle.color,
              shadowColor: particle.color,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  core: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  haze: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 50,
    backgroundColor: "rgba(142, 157, 255, 0.08)",
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.45,
    shadowRadius: 48,
    shadowOffset: { width: 0, height: 0 },
  },
  particle: {
    position: "absolute",
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
