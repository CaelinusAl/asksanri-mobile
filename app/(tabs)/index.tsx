import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function EntryScreen() {
  const opacity = useSharedValue(0.8);
  const [glitchText, setGlitchText] = useState("FOLLOW THE RABBIT");

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);

    const interval = setInterval(() => {
      setGlitchText((prev) =>
        prev.replace(/O|E/g, (c) => (Math.random() > 0.5 ? "0" : c))
      );
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const enter = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)/sanri_flow");
  };

  return (
    <Pressable style={styles.root} onPress={enter}>
      <LinearGradient
        colors={["#050510", "#0b0020", "#000000"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.center}>
        <Animated.Text style={[styles.rabbit, animatedStyle]}>
          🐇
        </Animated.Text>

        <Text style={styles.follow}>{glitchText}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
  },
  rabbit: {
    fontSize: 120,
    color: "#ffffff",
    textShadowColor: "#8a5cff",
    textShadowRadius: 40,
  },
  follow: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 16,
    letterSpacing: 3,
    opacity: 0.8,
  },
});