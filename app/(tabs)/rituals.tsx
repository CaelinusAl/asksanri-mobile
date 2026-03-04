// app/(tabs)/rituals.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

type Lang = "tr" | "en";

type RitualPackListItem = {
  ritual_pack_id: string;
  title?: string;
  description?: string;
  mode?: string;
};

const BG = require("../../assets/sanri_glass_bg.jpg");

const FALLBACK: RitualPackListItem[] = [
  {
    ritual_pack_id: "tanricanin_hatirlayisi",
    title: "Tanrıça’nın Hatırlayışı",
    description: "Bu ritüeller yorumlanmaz. Okunur ve hissedilir.",
    mode: "read_only",
  },
];

export default function RitualsScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const lang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";

  const [items, setItems] = useState<RitualPackListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const title = useMemo(() => (lang === "tr" ? "RİTÜEL ALANI" : "RITUAL SPACE"), [lang]);
  const sub = useMemo(
    () =>
      lang === "tr"
        ? "Okunur ve hissedilir. Açıklama yok. Soru yok."
        : "Read and feel. No explanation. No questions.",
    [lang]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // ✅ endpoint: /content/rituals
        const data: any = await apiGetJson(API.ritualPacks, 30000);

        const list: RitualPackListItem[] = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : [];

        const cleaned = list
          .map((x) => ({
            ritual_pack_id: String(x?.ritual_pack_id || ""),
            title: x?.title,
            description: x?.description,
            mode: x?.mode,
          }))
          .filter((x) => x.ritual_pack_id);

        if (!alive) return;
        setItems(cleaned.length ? cleaned : FALLBACK);
      } catch (e: any) {
        if (!alive) return;
        setItems(FALLBACK);
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

  const openPack = (packId: string) => {
    // ✅ KRİTİK: route + param adı "id"
    router.push({
      pathname: "/(tabs)/ritual_pack",
      params: { id: packId, lang },
    } as any);
  };

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
        <View style={{ flex: 1 }} />
        <View style={styles.langPill}>
          <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>

        {loading ? <Text style={styles.note}>{lang === "tr" ? "Yükleniyor…" : "Loading…"}</Text> : null}
        {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

        <View style={{ height: 14 }} />

        {items.map((it) => (
          <Pressable
            key={it.ritual_pack_id}
            onPress={() => openPack(it.ritual_pack_id)}
            style={styles.card}
            hitSlop={12}
          >
            <BlurView intensity={22} tint="dark" style={styles.cardInner}>
              <Text style={styles.cardTitle}>{it.title || it.ritual_pack_id}</Text>
              <Text style={styles.cardSub}>{it.description || ""}</Text>
              <Text style={styles.cardHint}>
                {lang === "tr" ? "Aç →" : "Open →"}
              </Text>
            </BlurView>
          </Pressable>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

  topbar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  langTxt: { color: "#cbbcff", fontWeight: "900", letterSpacing: 1 },

  content: { padding: 18, paddingTop: 8 },
  h1: { color: "white", fontSize: 36, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 8, lineHeight: 22 },

  note: { color: "rgba(255,255,255,0.55)", marginTop: 10 },
  err: { color: "#ff6b8a", marginTop: 10 },

  card: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  cardInner: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.14)",
  },
  cardTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 18 },
  cardSub: { color: "rgba(255,255,255,0.82)", marginTop: 8, lineHeight: 20 },
  cardHint: { color: "rgba(255,255,255,0.65)", marginTop: 10, fontWeight: "800" },
});