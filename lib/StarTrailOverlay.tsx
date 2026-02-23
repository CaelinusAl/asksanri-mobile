// lib/StarTrailOverlay.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

type Spark = { id: string; x: number; y: number; t: number; life: number; s: number };

const { width, height } = Dimensions.get("window");

function uid() {
  return "s_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export default function StarTrailOverlay({
  x,
  y,
  active = true,
}: {
  x: number | null;
  y: number | null;
  active?: boolean;
}) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastRef = useRef<{ x: number; y: number; at: number } | null>(null);

  const spawn = (sx: number, sy: number) => {
    const now = Date.now();
    const base: Spark[] = Array.from({ length: 10 }).map(() => ({
      id: uid(),
      x: sx + (Math.random() - 0.5) * 18,
      y: sy + (Math.random() - 0.5) * 18,
      t: now,
      life: 650 + Math.random() * 350,
      s: 2 + Math.random() * 3.5,
    }));
    setSparks((prev) => [...prev, ...base].slice(-90));
  };

  useEffect(() => {
    if (!active) return;
    if (x == null || y == null) return;

    const now = Date.now();
    const last = lastRef.current;

    // aynı yere 30ms içinde spamleme
    if (last && Math.abs(last.x - x) < 6 && Math.abs(last.y - y) < 6 && now - last.at < 30) return;

    lastRef.current = { x, y, at: now };
    spawn(x, y);
  }, [x, y, active]);

  // animasyon döngüsü
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = Date.now();
      setSparks((prev) => prev.filter((s) => now - s.t < s.life));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const now = Date.now();
  const dots = useMemo(() => {
    return sparks.map((s) => {
      const age = now - s.t;
      const p = Math.min(1, age / s.life);
      const a = 1 - p;
      const scale = 1 - p * 0.4;

      return (
        <View
          key={s.id}
          pointerEvents="none"
          style={[
            styles.dot,
            {
              left: s.x,
              top: s.y,
              opacity: a,
              transform: [{ scale }],
              width: s.s,
              height: s.s,
              borderRadius: 999,
            },
          ]}
        />
      );
    });
  }, [sparks, now]);

  return <View pointerEvents="none" style={styles.overlay}>{dots}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width,
    height,
  },
  dot: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#7c5cff",
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
});