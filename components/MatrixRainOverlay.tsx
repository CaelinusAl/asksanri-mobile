// components/MatrixRainOverlay.tsx
//
// Animasyonlu Matrix Rain efekti — yağar gibi düşen yeşil katakana zinciri.
// Rabbit, Kapılar (gates), Uyanmış Şehirler (awakenedCities) ve diğer
// hologram alanlarında ortak olarak kullanılır. Decorative, pointerEvents
// none — ekrandaki etkileşimi engellemez.

import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

type ColumnSpec = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  chars: string;
};

type Props = {
  /** Yağmurun en üst opaklığı. Default 0.25 — fazla bastırırsa içerik
   *  okunmaz olur. Ekran tipine göre 0.15-0.30 arası ayarla. */
  intensity?: number;
  /** Ana renk. Default yeşil (#7cf7d8). */
  color?: string;
};

export default function MatrixRainOverlay({
  intensity = 0.25,
  color = "#7cf7d8",
}: Props) {
  const { width: W, height: H } = useWindowDimensions();

  const cols = useMemo<ColumnSpec[]>(() => {
    const count = Math.max(6, Math.floor(W / 22));
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: i * 22 + Math.random() * 6,
      delay: Math.random() * 6000,
      duration: 4000 + Math.random() * 5000,
      chars: Array.from(
        { length: 8 + Math.floor(Math.random() * 12) },
        () => String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
      ).join("\n"),
    }));
  }, [W]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {cols.map((col) => (
        <RainColumn
          key={col.id}
          {...col}
          screenH={H}
          color={color}
          intensity={intensity}
        />
      ))}
    </View>
  );
}

function RainColumn({
  left,
  delay,
  duration,
  chars,
  screenH,
  color,
  intensity,
}: ColumnSpec & { screenH: number; color: string; intensity: number }) {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: intensity,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: screenH + 100,
              duration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: -200,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, duration, opacity, translateY, screenH, intensity]);

  return (
    <Animated.Text
      style={{
        position: "absolute",
        left,
        top: 0,
        color,
        fontSize: 13,
        lineHeight: 16,
        fontWeight: "300",
        opacity,
        transform: [{ translateY }],
      }}
    >
      {chars}
    </Animated.Text>
  );
}
