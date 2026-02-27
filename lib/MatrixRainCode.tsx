import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomTail(len: number) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[randInt(0, chars.length - 1)];
  return s;
}

type Props = {
  code: string; // "01".." 81"
  onPress?: () => void;
};

export default function MatrixRainCode({ code, onPress }: Props) {
  const drift = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  //Each code should have its own "seed" (not appear synchronous)
  const seed = useMemo(() => randInt(0, 9999), []);
  const [tail, setTail] = useState(() => randomTail(randInt(4, 10)));

  useEffect(() => {
    //Drift: Up-Down Small Flow
    const driftAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: -6,
          duration: 900 + (seed % 400),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 6,
          duration: 900 + (seed % 500),
          useNativeDriver: true,
        }),
      ]),
    );

    // glow: titreme
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 220 + (seed % 120),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 380 + (seed % 180),
          useNativeDriver: true,
        }),
      ]),
    );

    driftAnim.start();
    glowAnim.start();

    const interval = setInterval(
      () => {
        setTail(randomTail(randInt(4, 12)));
      },
      130 + (seed % 80),
    );

    return () => {
      driftAnim.stop();
      glowAnim.stop();
      clearInterval(interval);
    };
  }, [drift, glow, seed]);

  const opacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1],
  });
  const tailOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.22],
  });

  return (
    <Pressable onPress={onPress} style={styles.hitbox}>
      <Animated.View style={{ transform: [{ translateY: drift }] }}>
        <View style={styles.stack}>
          <Animated.Text style={[styles.code, { opacity }]}>
            {code}
          </Animated.Text>
          <Animated.Text style={[styles.tail, { opacity: tailOpacity }]}>
            {tail}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    width: "18%",
    paddingVertical: 10,
    alignItems: "center",
  },
  stack: {
    alignItems: "center",
  },
  code: {
    fontSize: 18,
    letterSpacing: 3,
    fontFamily: "monospace",
    color: "rgba(120,255,230,0.98)",
    textShadowColor: "rgba(120,255,230,0.55)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  tail: {
    marginTop: 2,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: "monospace",
    color: "rgba(120,255,230,1)",
    textShadowColor: "rgba(120,255,230,0.25)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
