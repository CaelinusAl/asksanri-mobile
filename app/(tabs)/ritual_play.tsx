// app/(tabs)/ritual_play.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import * as Speech from "expo-speech";

import MatrixRain from "@/lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Ritual = { ritual_id: string; title: string; steps: string[]; note?: string };
type RitualPack = { ritual_pack_id: string; description?: string; rituals: Ritual[] };

type Phase = "idle" | "running" | "paused" | "done";

export default function RitualPlayScreen() {
  const params = useLocalSearchParams<{ id?: string; ritual?: string; lang?: string }>();
  const lang = String(params.lang || "tr");
  const packId = String(params.id || "");
  const ritualId = String(params.ritual || "");

  const [pack, setPack] = useState<RitualPack | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const speakingRef = useRef(false);

  const ritual = useMemo(() => {
    const r = pack?.rituals?.find((x) => x.ritual_id === ritualId);
    return r || null;
  }, [pack, ritualId]);

  const steps = ritual?.steps || [];
  const stepText = steps[stepIndex] || "";

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await apiGetJson<RitualPack>(API.ritualPack + "/" + packId, 30000);
        if (!alive) return;
        setPack(data);
      } catch (e) {
        if (__DEV__) console.log("ritual_play fetch error", e);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      Speech.stop();
      deactivateKeepAwake();
    };
  }, [packId]);

  // Sacred Mode: ekran uyanık kalsın
  useEffect(() => {
    if (phase === "running") {
      activateKeepAwakeAsync("ritual-play").catch(() => {});
    } else {
      deactivateKeepAwake();
    }
  }, [phase]);

  const speak = async (text: string) => {
    if (!text) return;
    if (speakingRef.current) return;

    speakingRef.current = true;
    Speech.stop();

    // mini titreşim: “mühür”
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    Speech.speak(text, {
      language: lang === "tr" ? "tr-TR" : "en-US",
      rate: 0.95,
      pitch: 1.02,
      onDone: () => {
        speakingRef.current = false;
      },
      onStopped: () => {
        speakingRef.current = false;
      },
      onError: () => {
        speakingRef.current = false;
      },
    });
  };

  const start = async () => {
    setPhase("running");
    setStepIndex(0);
    await speak(steps[0] || "");
  };

  const pause = () => {
    Speech.stop();
    setPhase("paused");
  };

  const resume = async () => {
    setPhase("running");
    await speak(stepText);
  };

  const next = async () => {
    if (stepIndex >= steps.length - 1) {
      setPhase("done");
      Speech.stop();
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      return;
    }
    const ni = stepIndex + 1;
    setStepIndex(ni);
    await speak(steps[ni] || "");
  };

  const prev = async () => {
    const pi = Math.max(0, stepIndex - 1);
    setStepIndex(pi);
    if (phase === "running") await speak(steps[pi] || "");
  };

  if (loading) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loading}>Ritüel yükleniyor…</Text>
      </View>
    );
  }

  if (!ritual) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loading}>Ritüel bulunamadı.</Text>
        <Pressable onPress={() => router.back()} style={styles.btnGhost}>
          <Text style={styles.btnTxt}>Geri</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{ritual.title}</Text>
          <Text style={styles.sub}>
            {pack?.description ? String(pack.description).slice(0, 90) : "Ritüel alanı"}
          </Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <View style={styles.card}>
          <Text style={styles.kicker}>
            ADIM {stepIndex + 1}/{steps.length}
          </Text>
          <Text style={styles.stepText}>{stepText}</Text>
          {ritual.note ? <Text style={styles.note}>{ritual.note}</Text> : null}
        </View>

        <View style={styles.controls}>
          <Pressable onPress={prev} style={styles.btnGhost}>
            <Text style={styles.btnTxt}>←</Text>
          </Pressable>

          {phase === "idle" ? (
            <Pressable onPress={start} style={styles.btnMain}>
              <Text style={styles.btnMainTxt}>Başlat</Text>
            </Pressable>
          ) : phase === "paused" ? (
            <Pressable onPress={resume} style={styles.btnMain}>
              <Text style={styles.btnMainTxt}>Devam</Text>
            </Pressable>
          ) : phase === "running" ? (
            <Pressable onPress={pause} style={styles.btnMain}>
              <Text style={styles.btnMainTxt}>Duraklat</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => router.back()} style={styles.btnMain}>
              <Text style={styles.btnMainTxt}>Kapat</Text>
            </Pressable>
          )}

          <Pressable onPress={next} style={styles.btnGhost}>
            <Text style={styles.btnTxt}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  loading: { color: "white", marginTop: 80, textAlign: "center" },

  topbar: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: SAFE_TOP, paddingHorizontal: 14, paddingBottom: 14 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.10)"
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  title: { color: "white", fontSize: 18, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.6)", marginTop: 4 },

  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  kicker: { color: "#7cf7d8", fontWeight: "900", letterSpacing: 1, marginBottom: 10 },
  stepText: { color: "rgba(255,255,255,0.92)", fontSize: 18, lineHeight: 28 },
  note: { marginTop: 14, color: "rgba(255,255,255,0.6)", fontStyle: "italic" },

  controls: { flexDirection: "row", gap: 12, marginTop: 18, alignItems: "center", justifyContent: "center" },
  btnMain: {
    paddingHorizontal: 20, paddingVertical: 14, borderRadius: 18,
    backgroundColor: "rgba(94,59,255,0.78)",
    borderWidth: 1, borderColor: "rgba(94,59,255,0.35)"
  },
  btnMainTxt: { color: "white", fontWeight: "900" },
  btnGhost: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.12)"
  },
  btnTxt: { color: "white", fontWeight: "900", fontSize: 18 },
});