// app/system/weekly_symbol.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ImageBackground, StatusBar } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { apiGetJson, API } from "@/lib/apiClient";
import MatrixRain from "@/lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";
type Weekly = {
  week_key: string;
  title: string;
  subtitle?: string;
  reading_tr: string;
  reading_en?: string;
  tags?: string[];
  meta?: any;
};

export default function WeeklySymbolScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const lang: Lang = (String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr");

  const [data, setData] = useState<Weekly | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const text = useMemo(() => {
    if (!data) return "";
    return lang === "en" ? (data.reading_en || data.reading_tr) : data.reading_tr;
  }, [data, lang]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const json = await apiGetJson(API.base + "/content/weekly_symbol", 30000);
        if (!alive) return;
        setData(json);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>
      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
        <Text style={styles.topTitle}>{lang === "tr" ? "Haftanın Sembolü" : "Symbol of the Week"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? <Text style={styles.loading}>Yükleniyor…</Text> : null}
        {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

        {data ? (
          <>
            <Text style={styles.h1}>{data.title}</Text>
            {data.subtitle ? <Text style={styles.sub}>{data.subtitle}</Text> : null}
            <View style={styles.card}>
              <Text style={styles.body}>{text}</Text>
            </View>
            {data.week_key ? <Text style={styles.meta}>Week: {data.week_key}</Text> : null}
          </>
        ) : null}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

  topbar: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8, flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  topTitle: { color: "rgba(255,255,255,0.85)", fontWeight: "900", fontSize: 16 },

  container: { padding: 18, paddingTop: 6 },
  loading: { color: "rgba(255,255,255,0.6)" },
  err: { color: "#ff6b8a", fontWeight: "800" },

  h1: { color: "white", fontSize: 34, fontWeight: "900", marginTop: 10 },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 10, fontSize: 16, lineHeight: 22 },
  card: { marginTop: 14, borderRadius: 22, padding: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  body: { color: "rgba(255,255,255,0.92)", fontSize: 16, lineHeight: 24 },
  meta: { marginTop: 12, color: "rgba(180,255,230,0.55)", fontStyle: "italic" },
});