// app/(tabs)/pattern.tsx
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
type Lang = "tr" | "en";

const T = {
  tr: {
    title: "Level 2 — Örüntü",
    sub: "Tek olayı değil, tekrar eden kodu yakala.",
    e1: "Olay 1 (kısa)",
    e2: "Olay 2 (kısa)",
    e3: "Olay 3 (kısa)",
    theme: "Ortak tema / kelime (örn: para, güven, güç)",
    emotion: "Ortak duygu (tek kelime)",
    optional: "Opsiyonel: Link",
    go: "Oku",
    back: "←",
    hint:
      "Çıktı 5 parçalı gelir: (1) Ortak Motif (2) Gizli Kod (3) Döngü (4) Kırılma Noktası (5) Mikro Ritüel",
    errFill: "Lütfen Olay 1–3, Tema ve Duygu alanlarını doldur.",
    empty: "Cevap boş döndü.",
  },
  en: {
    title: "Level 2 — Pattern",
    sub: "Not one event — the repeating code.",
    e1: "Event 1 (short)",
    e2: "Event 2 (short)",
    e3: "Event 3 (short)",
    theme: "Common theme / word (e.g., money, trust, power)",
    emotion: "Common emotion (one word)",
    optional: "Optional: Link",
    go: "Read",
    back: "←",
    hint:
      "Output has 5 parts: (1) Common Motif (2) Hidden Code (3) Loop (4) Breakpoint (5) Micro Ritual",
    errFill: "Please fill Event 1–3, Theme and Emotion.",
    empty: "Empty response.",
  },
} as const;

export default function PatternScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";

  const [lang, setLang] = useState<Lang>(initialLang);

  const [event1, setEvent1] = useState("");
  const [event2, setEvent2] = useState("");
  const [event3, setEvent3] = useState("");
  const [themeWord, setThemeWord] = useState("");
  const [emotion, setEmotion] = useState("");
  const [link, setLink] = useState("");

  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#0b0620", "#050610"], []);

  const buildMessage = useCallback(() => {
    const e1 = event1.trim();
    const e2 = event2.trim();
    const e3 = event3.trim();
    const th = themeWord.trim();
    const emo = emotion.trim();
    const u = link.trim();

    if (lang === "tr") {
      return (
        "[SANRI_MODE=mirror]\n" +
        "INTENT: PATTERN_LEVEL_2\n" +
        "LANG: TR\n" +
        (u ? "LINK: " + u + "\n" : "") +
        "EVENTS:\n" +
        "- " + e1 + "\n" +
        "- " + e2 + "\n" +
        "- " + e3 + "\n" +
        "THEME: " + th + "\n" +
        "EMOTION: " + emo + "\n\n" +

        "FORMAT ZORUNLU (Örüntü dili, yüzeysel koçluk yasak):\n" +
        "1) ORTAK MOTİF (tek cümle)\n" +
        "2) GİZLİ KOD (hangi arketip/koruma mekanizması çalışıyor?)\n" +
        "3) DÖNGÜ (tetik → tepki → sonuç zinciri, 3 satır max)\n" +
        "4) KIRILMA NOKTASI (döngüyü kıran tek müdahale)\n" +
        "5) MİKRO RİTÜEL (1–2 dk: nefes / cümle / sınır / kapanış)\n" +
        "KURAL: Genel öneri verme. Net, kısa, keskin yaz.\n"
      );
    }

    return (
      "[SANRI_MODE=mirror]\n" +
      "INTENT: PATTERN_LEVEL_2\n" +
      "LANG: EN\n" +
      (u ? "LINK: " + u + "\n" : "") +
      "EVENTS:\n" +
      "- " + e1 + "\n" +
      "- " + e2 + "\n" +
      "- " + e3 + "\n" +
      "THEME: " + th + "\n" +
      "EMOTION: " + emo + "\n\n" +

      "REQUIRED FORMAT (Pattern voice, no generic coaching):\n" +
      "1) COMMON MOTIF (one sentence)\n" +
      "2) HIDDEN CODE (archetype / defense mechanism)\n" +
      "3) LOOP (trigger → reaction → outcome, max 3 lines)\n" +
      "4) BREAKPOINT (one intervention that breaks the loop)\n" +
      "5) MICRO RITUAL (1–2 min: breath / phrase / boundary / closure)\n" +
      "RULE: Be sharp and concrete.\n"
    );
  }, [emotion, event1, event2, event3, lang, link, themeWord]);

  const run = useCallback(async () => {
    if (busy) return;

    const e1 = event1.trim();
    const e2 = event2.trim();
    const e3 = event3.trim();
    const th = themeWord.trim();
    const emo = emotion.trim();

    if (!e1 || !e2 || !e3 || !th || !emo) {
      setErr(T[lang].errFill);
      return;
    }

    setErr("");
    setOut("");
    setBusy(true);

    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}

      const data = await apiPostJson(API.ask, {
        message: buildMessage(),
        session_id: "mobile-default",
        domain: "ust_bilinc",
        gate_mode: "mirror",
        persona: "user",
      }, 30000);

      const answer = String(data?.answer || data?.response || "").trim();
      setOut(answer || T[lang].empty);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [buildMessage, busy, emotion, event1, event2, event3, lang, themeWord]);

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
            value={event1}
            onChangeText={setEvent1}
            maxLength={200}
            placeholder={T[lang].e1}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].e2}</Text>
          <TextInput
            value={event2}
            onChangeText={setEvent2}
            maxLength={200}
            placeholder={T[lang].e2}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].e3}</Text>
          <TextInput
            value={event3}
            onChangeText={setEvent3}
            maxLength={200}
            placeholder={T[lang].e3}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].theme}</Text>
          <TextInput
            value={themeWord}
            onChangeText={setThemeWord}
            maxLength={200}
            placeholder={T[lang].theme}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].emotion}</Text>
          <TextInput
            value={emotion}
            onChangeText={setEmotion}
            maxLength={200}
            placeholder={T[lang].emotion}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

          <Pressable
            onPress={run}
            style={[styles.btn, (busy || !event1.trim() || !event2.trim() || !event3.trim() || !themeWord.trim() || !emotion.trim()) && { opacity: 0.6 }]}
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
  root: { flex: 1, backgroundColor: "#07080d" },

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