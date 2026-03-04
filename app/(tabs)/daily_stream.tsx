// app/(tabs)/daily_stream.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

function s(x: any) {
  return String(x == null ? "" : x);
}

export default function DailyStreamScreen() {
  const router = useRouter();
  const p = useLocalSearchParams<{ lang?: string; day?: string; title?: string; body?: string; tags?: string }>();

  const lang: Lang = s(p.lang).toLowerCase() === "en" ? "en" : "tr";
  const day = s(p.day);
  const title = s(p.title) || (lang === "tr" ? "Günün Akışı" : "Daily Stream");
  const body = s(p.body);
  const tags = s(p.tags);

  const tagArr = useMemo(() => tags.split(",").map((x) => x.trim()).filter(Boolean), [tags]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.10} />
      </View>
      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
        <Text style={styles.kicker}>{lang === "tr" ? "☀️ Günün Akışı" : "☀️ Daily Stream"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{title}</Text>
        {day ? <Text style={styles.meta}>{(lang === "tr" ? "Tarih: " : "Date: ") + day}</Text> : null}

        <View style={styles.card}>
          <Text style={styles.body}>{body}</Text>
        </View>

        {tagArr.length ? (
          <View style={styles.tagsRow}>
            {tagArr.map((t, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.44)" },

  topbar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  kicker: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  container: { padding: 18, paddingTop: 6 },
  h1: { color: "white", fontSize: 28, fontWeight: "900", lineHeight: 34 },
  meta: { color: "rgba(255,255,255,0.55)", marginTop: 8 },

  card: {
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(140,100,255,0.28)",
  },
  body: { color: "rgba(255,255,255,0.9)", fontSize: 16, lineHeight: 24 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  tagTxt: { color: "#7cf7d8", fontWeight: "900", fontSize: 12 },
});