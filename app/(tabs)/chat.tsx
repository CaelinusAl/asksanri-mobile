import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiPostJson } from "../../lib/apiClient";
import { API } from "../../lib/apiClient";
import {
  getOnboarding,
  type OnboardingState,
} from "../../lib/onboardingStore";
import { TONE_META, type ReminderTone } from "../../lib/dailyReminders";
import {
  appendArchive,
  updateArchiveReply,
} from "../../lib/archiveStore";

const BG = "#07080d";

type Msg = {
  id: string;
  who: "sanri" | "user";
  text: string;
};

export default function ChatScreen() {
  const params = useLocalSearchParams<{ prompt?: string; tone?: string }>();
  const initialPrompt = String(params.prompt || "").trim();
  const incomingTone = (params.tone as ReminderTone) || "durulma";
  const insets = useSafeAreaInsets();

  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const archiveIdRef = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getOnboarding();
      if (!alive) return;
      setOb(data);

      // İlk Sanrı bubble'ı (daily'den gelen prompt veya genel açılış)
      if (initialPrompt) {
        setMsgs([
          {
            id: `m_open_${Date.now()}`,
            who: "sanri",
            text: initialPrompt,
          },
        ]);
      } else {
        const opening =
          data.lang === "tr"
            ? "Buradayım. Şu an ne hissediyorsun?"
            : "I am here. What do you feel right now?";
        setMsgs([
          { id: `m_open_${Date.now()}`, who: "sanri", text: opening },
        ]);
      }
    })();
    return () => { alive = false; };
  }, [initialPrompt]);

  if (!ob) {
    return <View style={st.root}><StatusBar barStyle="light-content" /></View>;
  }

  const tr = ob.lang === "tr";
  const tone = (incomingTone || ob.tone) as ReminderTone;
  const meta = TONE_META[tone] || TONE_META.durulma;

  const T = {
    placeholder: tr ? "Yankını yaz…" : "Write your echo…",
    send: tr ? "Gönder" : "Send",
    backToDaily: tr ? "← Bugün" : "← Today",
    sanriThinking: tr ? "Sanrı dinliyor…" : "Sanrı is listening…",
    error: tr
      ? "Sanrı şu an sessiz. Biraz sonra tekrar dener misin?"
      : "Sanrı is silent now. Try again in a moment?",
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setDraft("");
    Haptics.selectionAsync().catch(() => {});

    const userMsg: Msg = {
      id: `m_u_${Date.now()}`,
      who: "user",
      text,
    };
    setMsgs((m) => [...m, userMsg]);

    // Yerel arşive yaz (kullanıcı yazısı kaybolmasın). Sanrı cevabı gelince
    // aynı kayıt güncellenir.
    try {
      if (!archiveIdRef.current) {
        const promptText = msgs[0]?.text || "";
        const entry = await appendArchive({
          prompt: promptText,
          userText: text,
          tone,
          lang: ob.lang,
        });
        archiveIdRef.current = entry.id;
      } else {
        // İkinci+ mesajda mevcut kayda eklemek yerine yeni kayıt aç
        const promptText = msgs[msgs.length - 1]?.text || "";
        const entry = await appendArchive({
          prompt: promptText,
          userText: text,
          tone,
          lang: ob.lang,
        });
        archiveIdRef.current = entry.id;
      }
    } catch {
      /* ignore archive failures */
    }

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const data: any = await apiPostJson(
        API.ask,
        {
          // sanri_flow ve tone gönderilmez. Backend default konuşma
          // akışına düşer — tek paragraf, yargısız, doğal yansıma.
          // (Eski "okuma_derinles" 3-katman şablonu yalnızca okuma
          // alanı içindir, hatırlatıcı sohbete uygun değil.)
          message: text,
          session_id: `anon_${ob.deviceUuid}`,
          lang: ob.lang,
        },
        45000
      );

      const reply =
        (typeof data === "string"
          ? data
          : data?.answer || data?.response || data?.reply || data?.message ||
            (tr ? "Seni duyuyorum." : "I hear you.")
        ).toString().trim();

      const sanriMsg: Msg = {
        id: `m_s_${Date.now()}`,
        who: "sanri",
        text: reply,
      };
      setMsgs((m) => [...m, sanriMsg]);

      if (archiveIdRef.current) {
        await updateArchiveReply(archiveIdRef.current, reply);
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    } catch {
      setMsgs((m) => [
        ...m,
        { id: `m_err_${Date.now()}`, who: "sanri", text: T.error },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={st.root}
      keyboardVerticalOffset={0}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG}
        translucent={false}
      />

      <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={st.topBtn}>
          <Text style={st.topBtnTxt}>{T.backToDaily}</Text>
        </Pressable>
        <View style={[st.toneChip, { borderColor: `${meta.color}55` }]}>
          <Text style={[st.toneChipGlyph, { color: meta.color }]}>{meta.glyph}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={st.thread}
        keyboardShouldPersistTaps="handled"
      >
        {msgs.map((m) => (
          <View
            key={m.id}
            style={[
              st.bubbleRow,
              m.who === "user" ? st.bubbleRowR : st.bubbleRowL,
            ]}
          >
            {m.who === "sanri" && (
              <Text style={[st.glyph, { color: meta.color }]}>{meta.glyph}</Text>
            )}
            <View
              style={[
                st.bubble,
                m.who === "user"
                  ? st.bubbleUser
                  : { ...st.bubbleSanri, borderColor: `${meta.color}33` },
              ]}
            >
              <Text style={st.bubbleTxt}>{m.text}</Text>
            </View>
          </View>
        ))}

        {busy && (
          <View style={st.thinking}>
            <ActivityIndicator size="small" color={meta.color} />
            <Text style={[st.thinkingTxt, { color: meta.color }]}>
              {T.sanriThinking}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          st.inputRow,
          { paddingBottom: Math.max(insets.bottom, 10) },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onFocus={() => {
            // Klavye açıldığında son mesaj görünür kalsın.
            setTimeout(
              () => scrollRef.current?.scrollToEnd({ animated: true }),
              250
            );
          }}
          placeholder={T.placeholder}
          placeholderTextColor="rgba(255,255,255,0.34)"
          style={st.input}
          multiline
          editable={!busy}
        />
        <Pressable
          onPress={send}
          disabled={busy || !draft.trim()}
          style={[st.sendBtn, (busy || !draft.trim()) && st.sendBtnOff]}
        >
          <LinearGradient
            colors={[meta.color, "#5e3bff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={st.sendGrad}
          >
            <Text style={st.sendTxt}>{T.send}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    // paddingTop dinamik olarak inline (safe area inset).
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  topBtn: { padding: 6 },
  topBtnTxt: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "700" },

  toneChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  toneChipGlyph: { fontSize: 16 },

  thread: { padding: 18, gap: 12, paddingBottom: 20 },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    maxWidth: "100%",
  },
  bubbleRowL: { justifyContent: "flex-start" },
  bubbleRowR: { justifyContent: "flex-end" },
  glyph: {
    fontSize: 18,
    width: 22,
    textAlign: "center",
    marginBottom: 6,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    maxWidth: "82%",
  },
  bubbleSanri: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
  },
  bubbleUser: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.25)",
  },
  bubbleTxt: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },

  thinking: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    paddingLeft: 8,
  },
  thinkingTxt: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    // paddingBottom dinamik olarak inline'da set edilir (safe area inset).
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.04)",
    backgroundColor: BG,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sendBtn: { borderRadius: 18, overflow: "hidden" },
  sendBtnOff: { opacity: 0.4 },
  sendGrad: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sendTxt: {
    color: BG,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
