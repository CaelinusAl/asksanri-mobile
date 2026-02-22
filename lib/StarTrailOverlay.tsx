// lib/StarTrailOverlay.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type Spark = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  opacity: Animated.Value;
  scale: Animated.Value;
};

function uid() {
  return "s_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

type Props = {
  trigger?: { x: number; y: number } | null;
};

export default function StarTrailOverlay({ trigger }: Props) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const spawn = useCallback((x: number, y: number) => {
    const count = 7 + Math.floor(Math.random() * 5); // 7-11

    const created: Spark[] = Array.from({ length: count }).map(() => {
      const id = uid();
      const size = 12 + Math.floor(Math.random() * 14); // 12-25
      const opacity = new Animated.Value(0);
      const scale = new Animated.Value(0.6);

      const angle = Math.random() * Math.PI * 2;
      const dist = 10 + Math.random() * 42;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const rotate = Math.floor(Math.random() * 80) - 40;

      return { id, x, y, dx, dy, size, rotate, opacity, scale };
    });

    setSparks((prev) => [...prev, ...created]);

    created.forEach((s) => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(s.opacity, {
            toValue: 1,
            duration: 90,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(s.scale, {
            toValue: 1.15,
            duration: 220,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
        ]),
        Animated.parallel([
          Animated.timing(s.opacity, {
            toValue: 0,
            duration: 520,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
          Animated.timing(s.scale, {
            toValue: 0.85,
            duration: 520,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
        ]),
      ]).start(() => {
        if (!mountedRef.current) return;
        setSparks((prev) => prev.filter((p) => p.id !== s.id));
      });
    });
  }, []);

  // trigger gelince spawn et
  useEffect(() => {
    if (!trigger) return;
    spawn(trigger.x, trigger.y);
  }, [trigger, spawn]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sparks.map((s) => (
        <Animated.View
          key={s.id}
          style={[
            styles.sparkWrap,
            {
              left: s.x + s.dx,
              top: s.y + s.dy,
              opacity: s.opacity,
              transform: [{ scale: s.scale }, { rotate: `${s.rotate}deg` }],
            },
          ]}
        >
          <Text
            style={[
              styles.spark,
              {
                fontSize: s.size,
              },
            ]}
          >
            ✦
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sparkWrap: {
    position: "absolute",
  },
  spark: {
    color: "rgba(255,255,255,0.92)",
    textShadowColor: "rgba(124,77,255,0.55)",
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
});