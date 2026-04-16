// app/(tabs)/symbol.tsx
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
    title: "Modül 3 — Matrix Oku",
    sub: "Olayı değil, matrixteki mesajı oku.",
    event: "Olay (kısa açıklama)",
    symbol: "Sembol / imge (rüyada, haberde, hayatta gördüğün)",
    emotion: "Ana duygu (tek kelime)",
    optional: "Opsiyonel: Link",
    go: "Matrixi Oku",
    back: "←",
    hint:
      "Çıktı 6 parçalı gelir: (1) Sembolün Özü (2) Arketip (3) Matrix Mesajı (4) Kolektif Yansıma (5) Kişisel Sorumluluk (6) Mini Ritüel",
    errFill: "Lütfen Olay, Sembol ve Duygu alanlarını doldur.",
    empty: "Cevap boş döndü.",
  },
  en: {
    title: "Module 3 — Read the Matrix",
    sub: "Not the event — the message in the matrix.",
    event: "Event (short description)",
    symbol: "Symbol / image (seen in a dream, news, or life)",
    emotion: "Core emotion (one word)",
    optional: "Optional: Link",
    go: "Read the Matrix",
    back: "←",
    hint:
      "Output has 6 parts: (1) Symbol Essence (2) Archetype (3) Matrix Message (4) Collective Reflection (5) Personal Responsibility (6) Mini Ritual",
    errFill: "Please fill Event, Symbol and Emotion.",
    empty: "Empty response.",
  },
} as const;

export default function SymbolScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";

  const [lang, setLang] = useState<Lang>(initialLang);

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

  const [event, setEvent] = useState("");
  const [symbolWord, setSymbolWord] = useState("");
  const [emotion, setEmotion] = useState("");
  const [link, setLink] = useState("");

  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#0b0620", "#050610"], []);

  const buildMessage = useCallback(() => {
    const ev = event.trim();
    const sym = symbolWord.trim();
    const emo = emotion.trim();
    const u = link.trim();

    if (lang === "tr") {
      return (
        "[SANRI_MODE=mirror]\n" +
        "INTENT: SYMBOL_LEVEL_3\n" +
        "LANG: TR\n" +
        "KİŞİ: " + (nameForPrompt || "Anonim") + " (" + (userEmail || "mail yok") + ")\n" +
        "NOT: Bu kişiyi tanı, ismini kullan, kişisel hitap et.\n" +
        (u ? "LINK: " + u + "\n" : "") +
        "EVENT: " + ev + "\n" +
        "SYMBOL: " + sym + "\n" +
        "EMOTION: " + emo + "\n\n" +
        "FORMAT ZORUNLU (Sembol katmanı, bilinç dili):\n" +
        "1) SEMBOLÜN ÖZÜ (sembol neyi temsil eder?)\n" +
        "2) ARKETİP (hangi bilinç rolü çalışıyor?)\n" +
        "3) OLAYIN SEMBOLİK MESAJI\n" +
        "4) KOLEKTİF YANSIMA (toplumsal katman)\n" +
        "5) KİŞİSEL SORUMLULUK CÜMLESİ\n" +
        "6) MİNİ RİTÜEL (sembolik ama uygulanabilir)\n" +
        "KURAL: Yüzeysel koçluk yazma. Derin ama net yaz.\n"
      );
    }

    return (
      "[SANRI_MODE=mirror]\n" +
      "INTENT: SYMBOL_LEVEL_3\n" +
      "LANG: EN\n" +
      "PERSON: " + (nameForPrompt || "Anonymous") + " (" + (userEmail || "no email") + ")\n" +
      "NOTE: Recognize this person, address them by name, make it personal.\n" +
      (u ? "LINK: " + u + "\n" : "") +
      "EVENT: " + ev + "\n" +
      "SYMBOL: " + sym + "\n" +
      "EMOTION: " + emo + "\n\n" +
      "REQUIRED FORMAT (Symbol layer, consciousness language):\n" +
      "1) SYMBOL ESSENCE (what does the symbol represent?)\n" +
      "2) ARCHETYPE (which consciousness role is active?)\n" +
      "3) SYMBOLIC MESSAGE OF THE EVENT\n" +
      "4) COLLECTIVE REFLECTION (societal layer)\n" +
      "5) PERSONAL RESPONSIBILITY STATEMENT\n" +
      "6) MINI RITUAL (symbolic yet actionable)\n" +
      "RULE: No surface-level coaching. Deep but clear.\n"
    );
  }, [emotion, event, lang, link, symbolWord]);

  const run = useCallback(async () => {
    if (busy) return;

    const ev = event.trim();
    const sym = symbolWord.trim();
    const emo = emotion.trim();

    if (!ev || !sym || !emo) {
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
  }, [buildMessage, busy, emotion, event, lang, symbolWord]);

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

          <Text style={styles.label}>{T[lang].event}</Text>
          <TextInput
            value={event}
            onChangeText={setEvent}
            maxLength={500}
            placeholder={T[lang].event}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <Text style={styles.label}>{T[lang].symbol}</Text>
          <TextInput
            value={symbolWord}
            onChangeText={setSymbolWord}
            maxLength={300}
            placeholder={T[lang].symbol}
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
            style={[styles.btn, (busy || !event.trim() || !symbolWord.trim() || !emotion.trim()) && { opacity: 0.6 }]}
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
