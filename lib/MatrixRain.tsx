import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

type Props = {
  opacity?: number;
  speedMs?: number;
};

export default function MatrixRain({ opacity = 0.9, speedMs = 9000 }: Props) {
  const { width, height } = Dimensions.get("window");
  const cols = Math.max(10, Math.floor(width / 18));

  const streams = useMemo(() => {
    return Array.from({ length: cols }).map((_, i) => {
      const left = Math.floor((i * width) / cols);
      const delay = Math.floor(Math.random() * 1200);
      const size = 12 + Math.floor(Math.random() * 6);
      return { left, delay, size, key: `c_${i}` };
    });
  }, [cols, width]);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      {streams.map((s) => (
        <Column
          key={s.key}
          left={s.left}
          delay={s.delay}
          size={s.size}
          height={height}
          speedMs={speedMs}
        />
      ))}
    </View>
  );
}

function Column({
  left,
  delay,
  size,
  height,
  speedMs,
}: {
  left: number;
  delay: number;
  size: number;
  height: number;
  speedMs: number;
}) {
  const y = useRef(new Animated.Value(-height)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(y, {
          toValue: height,
          duration: speedMs + Math.floor(Math.random() * 2500),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: -height,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, height, speedMs, y]);

  const lineCount = 28;
  const chars = "0123456789abcdefxyzqwerty";
  const text = Array.from({ length: lineCount })
    .map(() => {
      const len = 10 + Math.floor(Math.random() * 8);
      let out = "";
      for (let i = 0; i < len; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    })
    .join("\n");

  return (
    <Animated.Text
      style={[
        styles.col,
        {
          left,
          transform: [{ translateY: y }],
          fontSize: size,
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  col: {
    position: "absolute",
    top: 0,
    color: "rgba(60,255,180,0.55)",
    fontFamily: undefined,
    lineHeight: 16,
  },
});
