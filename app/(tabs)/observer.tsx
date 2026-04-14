import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";

import { API, apiPostJson } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
type Lang = "tr" | "en";

const T = {
  tr: {
    title: "Modül 1 — Kodu Gör",
    sub: "Ham veriyi ayır. Gürültüyü sil. Kodu gör.",
    e1: "Olay (tek cümle)",
    e2: "Kim / Ne / Nerede (3 madde, kısa)",
    e3: "Duygu (tek kelime)",
    optional: "Opsiyonel: Link",
    go: "Kodu Oku",
    back: "←",
    hint:
      "Çıktı 5 parçalı gelir: (1) Gözlem Özeti (2) Kök Neden (3) Gürültü vs Gerçek (4) Tek Adım (5) Mikro Ritüel",
  },
  en: {
    title: "Module 1 — See the Code",
    sub: "Separate raw data. Clear the noise. See the code.",
    e1: "Event (one sentence)",
    e2: "Who / What / Where (3 bullets, short)",
    e3: "Emotion (one word)",
    optional: "Optional: Link",
    go: "Read the Code",
    back: "←",
    hint:
      "Output has 5 parts: (1) Observation Summary (2) Root Cause (3) Noise vs Signal (4) One Action (5) Micro Ritual",
  },
} as const;

export default function ObserverScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";

  const [lang, setLang] = useState<Lang>(initialLang);

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

  const [eventLine, setEventLine] = useState("");
  const [whoWhatWhere, setWhoWhatWhere] = useState("");
  const [emotion, setEmotion] = useState("");
  const [link, setLink] = useState("");

  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#0b0620", "#050610"], []);

  const buildMessage = useCallback(() => {
  const e = eventLine.trim();
  const www = whoWhatWhere.trim();
  const emo = emotion.trim();
  const u = link.trim();

  if (lang === "tr") {
    return (
      "[SANRI_MODE=mirror]\n" +
      "INTENT: OBSERVER_LEVEL_1\n" +
      "LANG: TR\n" +
      "KİŞİ: " + (nameForPrompt || "Anonim") + " (" + (userEmail || "mail yok") + ")\n" +
      "NOT: Bu kişiyi tanı, ismini kullan, kişisel hitap et.\n" +
      (u ? "LINK: " + u + "\n" : "") +
      "EVENT: " + e + "\n" +
      "WHO_WHAT_WHERE:\n" + www + "\n" +
      "EMOTION: " + emo + "\n\n" +

      "FORMAT ZORUNLU (Sanrı dili, yüzeysel koçluk yasak):\n" +
      "1) GÖZLEM ÖZETİ (max 3 satır)\n" +
      "2) KÖK NEDEN (2 olası kök + kısa açıklama)\n" +
      "3) GÜRÜLTÜ vs GERÇEK (2 madde)\n" +
      "4) TEK ADIM (1 cümle)\n" +
      "5) MİKRO RİTÜEL (1-2 dk: nefes / cümle / sınır / kapanış)\n" +
      "KURAL: Genel koçluk cümleleri yazma. Net ve kısa yaz.\n"
    );
  }

  return (
    "[SANRI_MODE=mirror]\n" +
    "INTENT: OBSERVER_LEVEL_1\n" +
    "LANG: EN\n" +
    "PERSON: " + (nameForPrompt || "Anonymous") + " (" + (userEmail || "no email") + ")\n" +
    "NOTE: Recognize this person, address them by name, make it personal.\n" +
    (u ? "LINK: " + u + "\n" : "") +
    "EVENT: " + e + "\n" +
    "WHO_WHAT_WHERE:\n" + www + "\n" +
    "EMOTION: " + emo + "\n\n" +

    "REQUIRED FORMAT (Sanri voice, no generic coaching):\n" +
    "1) OBSERVATION SUMMARY (max 3 lines)\n" +
    "2) ROOT CAUSE (2 possible causes + brief)\n" +
    "3) NOISE vs SIGNAL (2 bullets)\n" +
    "4) ONE ACTION (one sentence)\n" +
    "5) MICRO RITUAL (1-2 min: breath / phrase / boundary / closure)\n" +
    "RULE: Be sharp and concrete.\n"
  );
}, [emotion, eventLine, lang, link, whoWhatWhere]);

  const run = useCallback(async () => {
    if (busy) return;

    const e = eventLine.trim();
    const www = whoWhatWhere.trim();
    const emo = emotion.trim();

    if (!e || !www || !emo) {
      setErr(lang === "tr" ? "Lütfen tüm alanları doldur." : "Please fill all fields.");
      return;
    }

    setErr("");
    setOut("");
    setBusy(true);

    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      const data: any = await apiPostJson(API.ask, {
        message: buildMessage(),
        session_id: "mobile-default",
        domain: "ust_bilinc",
        gate_mode: "mirror",
        persona: "user",
      }, 30000);

      const answer = String(data?.answer || data?.response || "").trim();
      setOut(answer || (lang === "tr" ? "Cevap boş döndü." : "Empty response."));
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [buildMessage, busy, emotion, eventLine, lang, whoWhatWhere]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{T[lang].back}</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{T[lang].title}</Text>
          <Text style={styles.sub}>{T[lang].sub}</Text>
        </View>

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>TR</Text>
          </Pressable>
          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>{T[lang].hint}</Text>

          <Text style={styles.label}>{T[lang].optional}</Text>
          <TextInput
            value={link}
            onChangeText={setLink}
            maxLength={2000}
            placeholder={T[lang].optional}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].e1}</Text>
          <TextInput
            value={eventLine}
            onChangeText={setEventLine}
            maxLength={200}
            placeholder={T[lang].e1}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].e2}</Text>
          <TextInput
            value={whoWhatWhere}
            onChangeText={setWhoWhatWhere}
            maxLength={200}
            placeholder={T[lang].e2}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={[styles.input, { minHeight: 90 }]}
            multiline
          />

          <Text style={styles.label}>{T[lang].e3}</Text>
          <TextInput
            value={emotion}
            onChangeText={setEmotion}
            maxLength={200}
            placeholder={T[lang].e3}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

          <Pressable
            onPress={run}
            style={[styles.btn, (busy || !eventLine.trim() || !whoWhatWhere.trim() || !emotion.trim()) && { opacity: 0.6 }]}
            disabled={busy}
          >
            <Text style={styles.btnTxt}>{busy ? (lang === "tr" ? "Okuyor…" : "Reading…") : T[lang].go}</Text>
          </Pressable>

          {out ? (
            <View style={styles.outCard}>
              <Text style={styles.outTitle}>{lang === "tr" ? "Çıktı" : "Output"}</Text>
              <Text style={styles.outText}>{out}</Text>
            </View>
          ) : null}

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
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

  title: { color: "white", fontWeight: "900", fontSize: 18 },
  sub: { color: "rgba(255,255,255,0.55)", marginTop: 4 },

  langRow: { flexDirection: "row", gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.25)" },
  langText: { color: "rgba(255,255,255,0.70)", fontWeight: "900" },
  langTextActive: { color: "#7cf7d8" },

  container: { padding: 16 },

  hint: {
    color: "rgba(255,255,255,0.55)",
    marginBottom: 14,
    lineHeight: 18,
  },

  label: { color: "rgba(124,247,216,0.85)", fontWeight: "900", marginTop: 12, marginBottom: 8 },

  input: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "white",
  },

  btn: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.85)",
  },
  btnTxt: { color: "white", fontWeight: "900", letterSpacing: 1 },

  err: { marginTop: 10, color: "#ff6b8a" },

  outCard: {
    marginTop: 18,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  outTitle: { color: "#7cf7d8", fontWeight: "900", marginBottom: 10, fontSize: 16 },
  outText: { color: "rgba(255,255,255,0.90)", lineHeight: 20 },
});