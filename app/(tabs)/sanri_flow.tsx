
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
import { router } from "expo-router";


type Msg = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const API = "https://api.asksanri.com"; // ✅ sabit

function uid() {
  return "m_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export default function SanriFlowScreen() {
  const bg = useMemo(() => ["#07080d", "#0b0620", "#050610"] as const, []);
  const scrollRef = useRef<ScrollView | null>(null);

  const [mode, setMode] = useState<"mirror" | "dream" | "divine" | "shadow" | "light">("mirror");
  const [domain, setDomain] = useState<string>("auto");

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      role: "assistant",
      text: "Hoş geldin. Bir cümle yaz. Ben cevap değil, anlam yansıtacağım.",
    },
  ]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || isSending) return;

    setError("");
    setIsSending(true);

    const userMessage: Msg = { id: uid(), role: "user", text: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(`${API}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          session_id: "mobile",
          domain, // "auto" default
          gate_mode: mode, // mirror/dream...
          persona: "user",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || `HTTP ${res.status}`);

      const answer = String(data?.answer || data?.response || "").trim() || "…";

      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", text: answer },
      ]);
    } catch (e: any) {
      const m = String(e?.message || e || "Failed");
      setError(m);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          text: "Şu an bağlantı titriyor. Bir nefes al. Tekrar deneriz.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [domain, input, isSending, mode]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* Living field glows */}
      <View style={[styles.glow, styles.glowA]} />
      <View style={[styles.glow, styles.glowB]} />

      {/* Top bar */}
      <View style={styles.topbar}>
        <View>
          <Text style={styles.topTitle}>Sanrı</Text>
          <Text style={styles.topMeta}>Mod: {mode} • Alan: {domain}</Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
         ref={scrollRef}
         contentContainerStyle={styles.scroll}
         keyboardShouldPersistTaps="handled"
>
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <View key={m.id} style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
              </View>
            );
          })}

          {error ? <Text style={styles.errorText}>Hata: {error}</Text> : null}
          {isSending ? <Text style={styles.thinking}>… yansıtılıyor</Text> : null}
        </ScrollView>

        {/* Input bar */}
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
            disabled={isSending || !input.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              (isSending || !input.trim()) && { opacity: 0.5 },
              pressed && { transform: [{ scale: 0.99 }] },
            ]}
          >
            <Text style={styles.sendBtnText}>Gönder</Text>
          </Pressable>
        </View>

        <Text style={styles.footerHint}>
          İpucu: Soru yazma; bir cümle yaz. Yansıma sende şekillenir.
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  glow: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 520,
    opacity: 0.16,
  },
  glowA: { backgroundColor: "#7c4dff", top: -220, left: -220 },
  glowB: { backgroundColor: "#5aa0ff", bottom: -240, right: -240, opacity: 0.12 },

  topbar: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  topTitle: { color: "white", fontSize: 20, fontWeight: "900" },
  topMeta: { marginTop: 4, color: "rgba(255,255,255,0.60)", fontSize: 12 },

  backBtn: {
    position: "absolute",
    right: 12,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  backBtnText: { color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: "900" },

  scroll: { padding: 14, paddingBottom: 14 },
  bubbleRow: { marginBottom: 10, flexDirection: "row" },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },

  bubble: {
    maxWidth: "92%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  bubbleAi: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },
  bubbleUser: {
    backgroundColor: "rgba(124,77,255,0.75)",
    borderColor: "rgba(124,77,255,0.35)",
  },
  bubbleText: { color: "white", lineHeight: 20, fontSize: 14 },

  errorText: { marginTop: 6, color: "#ff6b8a" },
  thinking: { marginTop: 6, color: "rgba(255,255,255,0.55)" },

  inputBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(0,0,0,0.30)",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "white",
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,77,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(124,77,255,0.45)",
  },
  sendBtnText: { color: "white", fontWeight: "900" },

  footerHint: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },
});
