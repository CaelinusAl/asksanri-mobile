// app/(tabs)/explore.tsx
import React, { useMemo, useState } from "react";
import TopMenu from "../../components/TopMenu";
import { useEffect } from "react";
import { logEvent } from "../../lib/LogEvent";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { CODES, type CityCode } from "../../data/awakenedCities";

const TURKEY_BG = require("../../assets/turkiye_hologram.png");

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
      <TopMenu />
      {/* ✅ Background katmanları dokunma yakalamaz (tabbar sorununu çözer) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <ImageBackground
          source={TURKEY_BG}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.h1}>AWAKENED{"\n"}CITIES</Text>
        <Text style={styles.sub}>Choose your code. The city speaks.</Text>

        {/* SYSTEM HEADER */}
  <View style={styles.systemBox}>
  <Text style={styles.systemLine}>$ field.ready</Text>
  <Text style={styles.systemLine}>$ region: TR</Text>
  <Text style={styles.systemLineAccent}>$ gate_status: open</Text>
</View>

        <View style={styles.grid}>
          {codes.map((code) => {
            const active = code === selected;
            return (
              <Pressable
                key={code}
                onPress={() => {
                  setSelected(code);
                  router.push("/city/" + code); // ✅ backtick yok
                }}
                style={[styles.cell, active && styles.cellActive]}
                hitSlop={10}
              >
                <Text style={styles.num}>{code}</Text>
                <Text style={styles.nano}>{noise(code)}</Text>
                {miniTag(code) ? <Text style={styles.tag}>{miniTag(code)}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        {/* ✅ tabbar/gesture güvenli boşluk */}
        <View style={{ height: 180 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#05060a" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  container: { paddingTop: 18, paddingHorizontal: 18 },
  systemBox: {
  marginTop: 18,
  marginBottom: 22,
  padding: 16,
  borderRadius: 16,
  backgroundColor: "rgba(124,247,216,0.05)",
  borderWidth: 1,
  borderColor: "rgba(124,247,216,0.18)",
},

systemLine: {
  color: "rgba(124,247,216,0.65)",
  fontFamily: "monospace",
  fontSize: 13,
  letterSpacing: 1.5,
  marginBottom: 6,
},

systemLineAccent: {
  color: "#7cf7d8",
  fontFamily: "monospace",
  fontSize: 13,
  letterSpacing: 1.5,
},

  h1: {
    color: "white",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 6,
  },
  sub: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 8,
    marginBottom: 14,
    fontSize: 16,
  },

  terminal: {
    marginTop: 8,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(120,255,240,0.18)",
    backgroundColor: "rgba(0,0,0,0.40)",
  },
  termLine: {
    color: "rgba(120,255,240,0.9)",
    fontFamily: "monospace",
    fontSize: 14,
    marginBottom: 4,
  },
  termHint: { color: "rgba(255,255,255,0.6)", marginTop: 6 },

  grid: {
    paddingTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  cell: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(120,255,220,0.22)",
    backgroundColor: "rgba(0,0,0,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  cellActive: {
    borderColor: "rgba(120,255,220,0.55)",
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  num: {
    color: "rgba(120,255,220,0.95)",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2,
  },
  nano: {
    marginTop: 4,
    color: "rgba(255,255,255,0.30)",
    fontFamily: "monospace",
    fontSize: 11,
  },
  tag: {
    marginTop: 6,
    color: "rgba(120,255,220,0.55)",
    fontFamily: "monospace",
    fontSize: 11,
  },
});
