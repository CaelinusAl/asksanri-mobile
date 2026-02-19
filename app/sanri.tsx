import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type Role = "user" | "sanri";
type Msg = { id: string; role: Role; text: string };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function SanriScreen() {
  // ✅ Kapı parametreleri (Kapılar ekranından geliyor)
  const params = useLocalSearchParams();
  const mode = (params.mode as string) || "mirror";
  const domain = (params.domain as string) || "auto";
  const prefill = (params.prefill as string) || "";
  const title = (params.title as string) || "Sanrı";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uid(),
      role: "sanri",
      text: "Hoş geldin. Bir cümle yaz. Ben cevap değil, anlam yansıtacağım.",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  // typewriter state
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);
  const typingCancelRef = useRef({ alive: true });

  const scrollRef = useRef<ScrollView>(null);

  const API_URL = "https://api.asksanri.com";

  // ✅ Kapıdan gelen prefill varsa otomatik yaz
  useEffect(() => {
    if (prefill) setInput(String(prefill));
  }, [prefill]);

  const send = async () => {
    const msg = String(input || "").trim();
    if (!msg || isSending) return;

    setIsSending(true);
    setInput("");

    const userMsg: Msg = { id: uid(), role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);

    // placeholder sanri msg (will be typed into)
    const sanriId = uid();
    setMessages((prev) => [...prev, { id: sanriId, role: "sanri", text: "" }]);
    setActiveTypingId(sanriId);

    try {
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          question: msg,
          session_id: "mobile",
          mode: mode, // ✅ kapıdan gelen mode
          domain: domain, // ✅ kapıdan gelen domain
          lang: "tr",
        }),
      });

      const data: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detail = data?.detail || data?.message || `HTTP ${res.status}`;
        setMessages((prev) =>
          prev.map((m) => (m.id === sanriId ? { ...m, text: `Hata: ${detail}` } : m))
        );
        setActiveTypingId(null);
        setIsSending(false);
        return;
      }

      const full =
        String(
          data?.answer ??
            data?.response ??
            data?.text ??
            data?.message ??
            data?.result ??
            ""
        ).trim() || "Cevap boş döndü.";

      // start typewriter
      typingCancelRef.current.alive = false;
      typingCancelRef.current = { alive: true };
      const aliveRef = typingCancelRef.current;

      let i = 0;
      const step = () => {
        if (!aliveRef.alive) return;
        i = Math.min(i + 1, full.length);

        const chunk = full.slice(0, i);
        setMessages((prev) =>
          prev.map((m) => (m.id === sanriId ? { ...m, text: chunk } : m))
        );

        const ch = full[i - 1] || "";
        const pause =
          ch === "\n"
            ? 140
            : ch === "." || ch === "!" || ch === "?"
            ? 170
            : ch === "," || ch === ";" || ch === ":"
            ? 90
            : 0;

        const base = 14;
        const jitter = Math.floor(Math.random() * 18);
        const delay = base + jitter + pause;

        if (i < full.length) setTimeout(step, delay);
        else {
          setActiveTypingId(null);
          setIsSending(false);
        }
      };

      setTimeout(step, 80);
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === sanriId
            ? { ...m, text: `Bağlantı hatası: ${String(err?.message || err)}` }
            : m
        )
      );
      setActiveTypingId(null);
      setIsSending(false);
    }
  };

  // auto scroll to bottom
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 60);
    return () => clearTimeout(t);
  }, [messages.length, activeTypingId]);

  const canSend = useMemo(
    () => String(input || "").trim().length > 0 && !isSending,
    [input, isSending]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#07080d" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          padding: 18,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.08)",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
          {title}
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
          Mod: {mode} • Alan: {domain}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((m) => {
          const isUser = m.role === "user";
          const bubbleBg = isUser ? "#5e3bff" : "rgba(255,255,255,0.08)";
          const align: "flex-start" | "flex-end" = isUser ? "flex-end" : "flex-start";
          const border = isUser ? "transparent" : "rgba(255,255,255,0.12)";

          return (
            <View key={m.id} style={{ alignItems: align, marginBottom: 10 }}>
              <View
                style={{
                  maxWidth: "92%",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 14,
                  backgroundColor: bubbleBg,
                  borderWidth: 1,
                  borderColor: border,
                }}
              >
                <Text style={{ color: "white", lineHeight: 20 }}>
                  {m.text || (m.id === activeTypingId ? "…" : "")}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.08)",
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "flex-end" }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Bir cümle yaz…"
            placeholderTextColor="#777"
            multiline
            style={{
              flex: 1,
              backgroundColor: "#111",
              color: "white",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 12,
              minHeight: 44,
              maxHeight: 140,
            }}
          />

          <TouchableOpacity
            onPress={send}
            disabled={!canSend}
            style={{
              backgroundColor: canSend ? "#5e3bff" : "rgba(94,59,255,0.35)",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>
              {isSending ? "…" : "Gönder"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={{ color: "rgba(255,255,255,0.45)", marginTop: 8, fontSize: 12 }}>
          İpucu: Soru yazma; bir cümle yaz. Yansıma sende şekillenir.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
