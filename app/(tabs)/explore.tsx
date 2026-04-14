
// app/(tabs)/explore.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { CODES, type CityCode } from "../../data/awakenedCities";
import { logEvent } from "../../lib/LogEvent";

function miniTag(code: CityCode) {
  if (code === "34") return "wake up";
  if (code === "47") return "layer";
  if (code === "81") return "create";
  return "";
}

function noise(code: string) {
  const a = "abcdefghijklmnopqrstuvwxyz0123456789";
  const seed = Number(code);
  let out = "";
  for (let i = 0; i < 6; i++) out += a[(seed * 17 + i * 13) % a.length];
  return out;
}

export default function ExploreScreen() {
  const [selected, setSelected] = useState<CityCode | null>(null);
  const codes = useMemo(() => CODES, []);

  useEffect(() => {
    logEvent("screen_view", "awakened_cities", { screen: "explore" });
  }, []);

  return (
    <View style={styles.root} pointerEvents="box-none">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h1}>AWAKENED{"\n"}CITIES</Text>
        <Text style={styles.sub}>Choose your code. The city speaks.</Text>

        <View style={styles.systemBox}>
          <Text style={styles.systemLine}>$ field.ready</Text>
          <Text style={styles.systemLine}>$ region: TR</Text>
          <Text style={styles.systemLineAccent}>$ gate_status: open</Text>
        </View>

        <View style={styles.grid}>
          {codes.map((code) => {
            const active = code === selected;
            const tag = miniTag(code);
            return (
              <Pressable
                key={code}
                onPress={() => router.push(`/city/${code}`)}
                style={[styles.cell, active && styles.cellActive]}
                hitSlop={10}
              >
                <Text style={styles.num}>{code}</Text>
                <Text style={styles.nano}>{noise(code)}</Text>
                {tag ? <Text style={styles.tag}>{tag}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  container: { paddingTop: 22, paddingHorizontal: 18, paddingBottom: 24 },

  h1: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
    lineHeight: 46,
  },

  sub: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 10,
    marginBottom: 18,
    fontSize: 16,
  },

  systemBox: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 18,
  },

  systemLine: {
    color: "rgba(124,247,216,0.75)",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 6,
  },

  systemLineAccent: {
    color: "rgba(124,247,216,0.95)",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  cell: {
    width: "30.5%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  cellActive: {
    borderColor: "rgba(124,247,216,0.45)",
    backgroundColor: "rgba(124,247,216,0.08)",
  },

  num: {
    color: "#7cf7d8",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 1,
  },

  nano: {
    marginTop: 6,
    color: "rgba(255,255,255,0.35)",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
  },

  tag: {
    marginTop: 6,
    color: "rgba(255,255,255,0.60)",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});