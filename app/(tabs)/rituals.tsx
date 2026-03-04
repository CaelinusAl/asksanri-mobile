// app/(tabs)/rituals.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, ImageBackground } from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiGetJson } from "@/lib/apiClient";

type Lang = "tr" | "en";
type PackItem = { ritual_pack_id: string; mode: string; description: string; count: number };

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function RitualsScreen() {
  const [lang] = useState<Lang>("tr");
  const [items, setItems] = useState<PackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiGetJson<{ items: PackItem[] }>(API.ritualPacks, 30000);
        if (!alive) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const title = useMemo(() => (lang === "tr" ? "RİTÜEL ALANI" : "RITUAL SPACE"), [lang]);

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
        <Text style={styles.topTitle}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.note}>
          {lang === "tr"
            ? "Bu alan konuşmaz. Açıklamaz. Yorumlamaz.\nSadece okunur ve hissedilir."
            : "This space does not explain. It does not interpret.\nIt is read — and felt."}
        </Text>

        {loading ? <Text style={styles.dim}>{lang === "tr" ? "Yükleniyor…" : "Loading…"}</Text> : null}

        {items.map((p) => (
          <Pressable
            key={p.ritual_pack_id}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/ritual_pack",
                params: { id: p.ritual_pack_id, lang },
              } as any)
            }
            style={styles.card}
            hitSlop={10}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{p.ritual_pack_id}</Text>
              <Text style={styles.cardSub}>{p.description}</Text>
              <Text style={styles.cardMeta}>• {p.count} ritüel • {p.mode}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.40)" },

  topbar: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  backTxt: { color: "#7cf7d8", fontWeight: "900", fontSize: 18 },
  topTitle: { color: "white", fontWeight: "900", fontSize: 18 },

  container: { padding: 18, paddingTop: 6 },
  note: { color: "rgba(255,255,255,0.75)", lineHeight: 20, marginBottom: 14 },
  dim: { color: "rgba(255,255,255,0.55)" },

  card: {
    marginTop: 12,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  cardSub: { color: "rgba(255,255,255,0.72)", marginTop: 8, lineHeight: 20 },
  cardMeta: { color: "rgba(124,247,216,0.75)", marginTop: 10, fontWeight: "800" },
  arrow: { color: "#7cf7d8", fontSize: 26, fontWeight: "900" },
});