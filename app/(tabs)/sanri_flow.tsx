// app/(tabs)/sanri_flow.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { router } from "expo-router";

const API = "https://api.asksanri.com";

type Mode = "mirror" | "dream" | "divine" | "shadow" | "light";

// ✅ AUTO should definitely be here (because of the red "auto" problem in you)
type Domain =
  | "auto"
  | "awakened_cities"
  | "consciousness_field"
  | "frequency_field"
  | "ritual_space"
  | "library";

type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

function uid() {
return "m_" + Math.random().toString(16). slice(2) + "_" + Date.now().toString(16);
}

const MODE_CHIPS: { id: Mode; label: string }[] = [
  { id: "mirror", label: "Ayna" },
{ id: "dream", label: "dream" },
  { id: "shadow", label: "Gölge" },
  { id: "light", label: "Işık" },
  { id: "divine", label: "İlahi" },
];

const DOMAIN_CHIPS: { id: Domain; label: string }[] = [
{ id: "auto", label: "auto" },
{ id: "consciousness_field", label: "Consciousness" },
  { id: "frequency_field", label: "Frekans" },
  { id: "ritual_space", label: "Ritüel" },
  { id: "library", label: "Kütüphane" },
{ id: "awakened_cities", label: "Cities" },
];

export default function SanriFlowScreen() {
  const bg = useMemo<[string, string, string]>(() => ["#07080d", "#0b0620", "#050610"], []);

  // ✅ Correct use that finishes ref reds
  const scrollRef = useRef<ScrollView>(null);

  const [mode, setMode] = useState<Mode>("mirror");
  const [domain, setDomain] = useState<Domain>("auto");

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Msg[]>([
{ id: uid(), role: "assistant", text: "Welcome. Write a sentence. I will reflect meaning, not answer." },
  ]);

  const scrollToEnd = useCallback(() => {
requestAnimationFrame(() => scrollRef.current?. scrollToEnd({ animated: true }));
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  const typeIn = useCallback(async (fullText: string) => {
    setTyping(true);
    const id = uid();
setMessages((prev) => [... prev, { id, role: "assistant", text: "" }]);

    let i = 0;
    const step = () => {
      i = Math.min(i + 1, fullText.length);
      const part = fullText.slice(0, i);

setMessages((prev) => prev.map((m) => (m.id === id ? { ... m, text: part } : m)));

      const ch = fullText[i - 1] || "";
      const pause = ch === "\n" ? 70 : ch === "." || ch === "!" || ch === "?" ? 90 : 0;
      const delay = 10 + Math.floor(Math.random() * 18) + pause;

      if (i < fullText.length) setTimeout(step, delay);
      else setTyping(false);
    };

    setTimeout(step, 120);
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending || typing) return;

    setError("");
    setInput("");
    setIsSending(true);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

setMessages((prev) => [... prev, { id: uid(), role: "user", text }]);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${API}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: "mobile-default",
          domain,
          gate_mode: mode,
          persona: "user",
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      const data = await res.json().catch(() => ({}));
if (!res.ok) throw new Error(data?. detail || 'HTTP ${res.status}');

const answer = String(data?. answer || data?. response || "").trim() || " Buradayım.";
      await typeIn(answer);
    } catch (e: any) {
setError(String(e?. message || e));
    } finally {
      setIsSending(false);
      scrollToEnd();
    }
  }, [domain, input, isSending, mode, scrollToEnd, typeIn, typing]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      <View style={styles.glowA} />
      <View style={styles.glowB} />

      <View style={styles.topbar}>
        <View>
          <Text style={styles.topTitle}>Sanrı</Text>
          <Text style={styles.topMeta}>Mod: {mode} • Alan: {domain}</Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {MODE_CHIPS.map((m) => {
          const active = m.id === mode;
          return (
            <Pressable key={m.id} onPress={() => setMode(m.id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {DOMAIN_CHIPS.map((d) => {
          const active = d.id === domain;
          return (
            <Pressable key={d.id} onPress={() => setDomain(d.id)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{d.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          ref={scrollRef}
contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <View key={m.id} style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
              </View>
            );
          })}

          {error ? <Text style={styles.errorText}>Hata: {error}</Text> : null}
{isSending || typing ? <Text style={styles.thinking}>… </Text> : null}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Bir cümle yaz…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={send}
            style={[styles.sendBtn, (!input.trim() || isSending || typing) && { opacity: 0.5 }]}
          >
            <Text style={styles.sendText}>Gönder</Text>
          </Pressable>
        </View>

<Text style={styles.hintBottom}>Tip: Writing a question; Write a sentence. Reflection takes shape in you.</Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  glowA: {
    position: "absolute",
    width: 480,
    height: 480,
    borderRadius: 480,
    left: -160,
    top: 40,
    backgroundColor: "rgba(94,59,255,0.18)",
  },
  glowB: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    right: -180,
    bottom: -60,
    backgroundColor: "rgba(140,100,255,0.12)",
  },

  topbar: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitle: { color: "white", fontWeight: "900", fontSize: 20 },
  topMeta: { color: "rgba(255,255,255,0.60)", marginTop: 4 },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backBtnText: { color: "white", fontWeight: "900", fontSize: 18 },

  chipsRow: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  chipActive: {
    backgroundColor: "rgba(94,59,255,0.30)",
    borderColor: "rgba(94,59,255,0.45)",
  },
  chipText: { color: "rgba(255,255,255,0.75)", fontWeight: "800" },
  chipTextActive: { color: "white" },

  scroll: { padding: 16, paddingBottom: 18 },

  bubbleRow: { marginBottom: 10, flexDirection: "row" },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },

  bubble: {
    maxWidth: "92%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  bubbleUser: {
    backgroundColor: "rgba(94,59,255,0.70)",
    borderColor: "rgba(94,59,255,0.55)",
  },
  bubbleText: { color: "white", lineHeight: 20 },

  errorText: { color: "#ff6b8a", marginTop: 6 },
  thinking: { color: "rgba(255,255,255,0.55)", marginTop: 6 },

  inputBar: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "white",
  },
  sendBtn: {
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5e3bff",
  },
  sendText: { color: "white", fontWeight: "900" },

  hintBottom: {
    color: "rgba(255,255,255,0.45)",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
});
