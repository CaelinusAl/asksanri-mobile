import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiPostJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

type DailyResult = {
  title: string;
  body: string;
};

export default function DailyStreamScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<DailyResult | null>(null);

  const t = useMemo(
    () =>
      lang === "tr"
        ? {
            kicker: "☀️ GÜNLÜK AKIŞ",
            title: "DAILY STREAM",
            subtitle: "Bugünün frekansını Sanrı'dan al.",
            loading: "Sanrı günlük akışı açıyor...",
            retry: "Tekrar Dene",
            back: "Geri",
            error: "Günlük akış alınamadı.",
          }
        : {
            kicker: "☀️ DAILY STREAM",
            title: "DAILY STREAM",
            subtitle: "Receive today's frequency from Sanri.",
            loading: "Sanri is opening the daily stream...",
            retry: "Try Again",
            back: "Back",
            error: "Daily stream could not be generated.",
          },
    [lang]
  );

  const requestIdRef = useRef(0);

  const loadDaily = useCallback(async () => {
    const myRequestId = ++requestIdRef.current;

    setBusy(true);
    setErr("");
    setResult(null);

    try {
      const instruction =
        lang === "tr"
          ? `GÜNLÜK AKIŞ / DAILY STREAM

Bugün için kısa ama derin bir günlük bilinç akışı üret.

Şu yapıda yaz:
1) BUGÜNÜN FREKANSI
2) ANA DERS
3) GÖLGE / DİKKAT
4) TEK EYLEM
5) KAPANIŞ CÜMLESİ

Ton:
- sakin
- net
- derin
- sembolik ama anlaşılır

Türkçe yaz.`
          : `DAILY STREAM

Generate a short but deep daily consciousness stream for today.

Use this structure:
1) TODAY'S FREQUENCY
2) MAIN LESSON
3) SHADOW / ATTENTION
4) ONE ACTION
5) CLOSING LINE

Tone:
- calm
- clear
- deep
- symbolic but understandable

Write in English.`;

      const payload = {
        message: instruction,
        session_id: "daily-stream-mobile",
        domain: "daily_stream",
        gate_mode: "mirror",
        persona: "user",
        lang,
        context: {
          source: "daily_stream",
          intent: "daily_stream_live_v1",
        },
      };

      const data: any = await apiPostJson(API.ask, payload, 60000);

      const raw =
        data?.answer ??
        data?.response ??
        data?.text ??
        data?.body ??
        "";

      const body = String(raw || "").trim();

      if (!body) {
        throw new Error(lang === "tr" ? "Boş cevap geldi." : "Empty response.");
      }

      if (requestIdRef.current !== myRequestId) return;

      setResult({
        title: lang === "tr" ? "Bugünün Akışı" : "Today's Stream",
        body,
      });
    } catch (e: any) {
      if (requestIdRef.current !== myRequestId) return;
      setErr(String(e?.message || e || t.error));
      setResult(null);
    } finally {
      if (requestIdRef.current === myRequestId) {
        setBusy(false);
      }
    }
  }, [lang, t.error]);

  useEffect(() => {
    loadDaily();
  }, [loadDaily]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
          <Text style={styles.backLbl}>{t.back}</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
          >
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>
              TR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>
              EN
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{t.kicker}</Text>
        <Text style={styles.h1}>{t.title}</Text>
        <Text style={styles.sub}>{t.subtitle}</Text>

        {busy ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator />
            <Text style={styles.loadingTxt}>{t.loading}</Text>
          </View>
        ) : err ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTxt}>{err || t.error}</Text>

            <Pressable onPress={loadDaily} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>{t.retry}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{result?.title || "-"}</Text>
            <Text style={styles.resultBody}>{result?.body || "-"}</Text>

            <Pressable onPress={loadDaily} style={styles.retryBtnAlt}>
              <Text style={styles.retryTxt}>{t.retry}</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  topbar: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  backLbl: { color: "rgba(255,255,255,0.78)", fontWeight: "800" },

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },
  langTxt: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "900",
    letterSpacing: 1,
  },
  langTxtActive: { color: "#7cf7d8" },

  container: { padding: 18, paddingTop: 6 },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },
  h1: { color: "white", fontSize: 32, fontWeight: "900", lineHeight: 38 },
  sub: {
    color: "rgba(255,255,255,0.72)",
    marginTop: 10,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
  },

  loadingCard: {
    borderRadius: 22,
    padding: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingTxt: {
    marginTop: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },

  errorCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,80,120,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  errorTxt: {
    color: "#ffd5df",
    lineHeight: 22,
  },

  resultCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  resultTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 18,
  },
  resultBody: {
    color: "white",
    marginTop: 12,
    lineHeight: 24,
    fontSize: 15,
  },

  retryBtn: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(94,59,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  retryBtnAlt: {
    marginTop: 18,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  retryTxt: {
    color: "white",
    fontWeight: "900",
  },
});