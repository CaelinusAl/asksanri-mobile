// app/(tabs)/ritual_pack.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

type Lang = "tr" | "en";

type Ritual = {
  ritual_id: string;
  title: string;
  steps: string[];
  note?: string;
};

type RitualPack = {
  ritual_pack_id: string;
  mode?: string;
  description?: string;
  rituals: Ritual[];
};

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function RitualPackScreen() {
  const params = useLocalSearchParams<{ id?: string; lang?: string }>();
  const lang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";
  const id = String(params.id || "").trim();

  const [pack, setPack] = useState<RitualPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const title = useMemo(() => (lang === "tr" ? "RİTÜEL" : "RITUAL"), [lang]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        if (!id) throw new Error(lang === "tr" ? "Pack ID boş geldi." : "Pack ID is empty.");

        // ✅ backend: GET /content/ritual-pack/{id}?lang=tr
        const url = API.ritualPack + "/" + encodeURIComponent(id) + "?lang=" + lang;
        const data: any = await apiGetJson(url, 30000);

        const normalized: RitualPack = {
          ritual_pack_id: String(data?.ritual_pack_id || data?.id || id),
          mode: data?.mode,
          description: data?.description,
          rituals: Array.isArray(data?.rituals) ? data.rituals : [],
        };

        if (!alive) return;
        setPack(normalized);
      } catch (e: any) {
        if (!alive) return;
        setPack(null);
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, lang]);

  const goBack = () => {
    if ((router as any).canGoBack?.()) router.back();
    else router.replace("/(tabs)/rituals" as any);
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
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
        <Text style={styles.topTitle}>{title}</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.langPill}>
          <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? <Text style={styles.note}>{lang === "tr" ? "Yükleniyor…" : "Loading…"}</Text> : null}
        {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

        {pack ? (
          <>
            <BlurView intensity={26} tint="dark" style={styles.headerCard}>
              <Text style={styles.h1}>{pack.ritual_pack_id}</Text>
              {pack.description ? <Text style={styles.desc}>{pack.description}</Text> : null}
            </BlurView>

            <View style={{ height: 14 }} />

            {pack.rituals?.length ? (
              pack.rituals.map((r) => (
                <BlurView key={r.ritual_id} intensity={20} tint="dark" style={styles.card}>
                  <Text style={styles.cardTitle}>{r.title}</Text>

                  {Array.isArray(r.steps) && r.steps.length ? (
                    <View style={{ marginTop: 10 }}>
                      {r.steps.map((s, idx) => (
                        <Text key={idx} style={styles.step}>
                          {idx + 1}. {s}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.note2}>
                      {lang === "tr" ? "Bu ritüelde adım bulunamadı." : "No steps found for this ritual."}
                    </Text>
                  )}

                  {r.note ? <Text style={styles.note2}>{r.note}</Text> : null}
                </BlurView>
              ))
            ) : (
              <Text style={styles.note}>
                {lang === "tr"
                  ? "Ritüel listesi boş geldi. (Backend ritual-pack/{id} rituals döndürmüyor.)"
                  : "Ritual list is empty. (Backend ritual-pack/{id} is not returning rituals.)"}
              </Text>
            )}
          </>
        ) : null}

        <View style={{ height: 140 }} />
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
  topTitle: { color: "white", fontWeight: "900", fontSize: 16 },
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
  note: { color: "rgba(255,255,255,0.55)", marginTop: 10 },
  err: { color: "#ff6b8a", marginTop: 10 },

  headerCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  h1: { color: "white", fontSize: 22, fontWeight: "900" },
  desc: { color: "rgba(255,255,255,0.82)", marginTop: 10, lineHeight: 22 },

  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 18 },
  step: { color: "rgba(255,255,255,0.9)", marginTop: 8, lineHeight: 22 },
  note2: { color: "rgba(255,255,255,0.65)", marginTop: 12, fontStyle: "italic" },
});