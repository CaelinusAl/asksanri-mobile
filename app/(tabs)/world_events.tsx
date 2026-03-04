// app/(tabs)/world_events.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { apiGetJson, apiPostJson, API } from "@/lib/apiClient";

type Lang = "tr" | "en";

type Item = {
  id: string;
  created_at: number;
  url: string;
  note: string;
  lang: Lang;
  reading: string;
};

function uid() {
  return "we_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

const T = {
  tr: {
    title: "DÜNYA OLAYLARI",
    sub: "Link + 1 cümle not. Sanrı üst bilinç / matrix diliyle okur.",
    url: "Haber Linki",
    note: "Senin 1 cümle yorumun",
    read: "Üst Bilinç Oku",
    saving: "Okunuyor…",
    today: "Kayıtlar",
    share: "Paylaş",
    copy: "Kopyala",
    del: "Sil",
    empty: "Henüz kayıt yok.",
  },
  en: {
    title: "WORLD EVENTS",
    sub: "Link + one sentence. Sanri reads with system / matrix language.",
    url: "News Link",
    note: "Your one-sentence note",
    read: "Read (System View)",
    saving: "Reading…",
    today: "Entries",
    share: "Share",
    copy: "Copy",
    del: "Delete",
    empty: "No entries yet.",
  },
} as const;

export default function WorldEventsScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const t = T[lang];

  const [items, setItems] = useState<Item[]>([]);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const theme = useMemo(() => {
    return {
      bg: ["#07080d", "#14072e", "#050610"] as [string, string, string],
      accent: "#7cf7d8",
      primary: "rgba(94,59,255,0.85)",
      card: "rgba(255,255,255,0.06)",
      stroke: "rgba(255,255,255,0.10)",
    };
  }, []);

  const buildInstruction = useCallback(
    (u: string, n: string) => {
      if (lang === "tr") {
        return (
          "UST BILINC / MATRIX HABER OKUMA\n" +
          "Kaynak Link: " + u + "\n" +
          "Kullanici Notu: " + n + "\n\n" +
          "Soru sorma. Okuma ver.\n" +
          "Basliklarla yaz:\n" +
          "1) SINYAL\n" +
          "2) SEMBOL DECODE\n" +
          "3) SAYI/HARF AKISI\n" +
          "4) ROL HARITASI\n" +
          "5) KOLEKTIF DERS\n" +
          "6) KISEL UYGULAMA\n" +
          "7) PAYLASIM METNI\n"
        );
      }
      return (
        "SYSTEM VIEW / MATRIX NEWS READ\n" +
        "Source link: " + u + "\n" +
        "User note: " + n + "\n\n" +
        "Do not ask questions. Provide the reading.\n" +
        "Use headings:\n" +
        "1) SIGNAL\n" +
        "2) SYMBOL DECODE\n" +
        "3) NUMBER/LETTER FLOW\n" +
        "4) ROLE MAP\n" +
        "5) COLLECTIVE LESSON\n" +
        "6) ONE ACTION\n" +
        "7) SHARE TEXT\n"
      );
    },
    [lang]
  );

  const loadList = useCallback(async () => {
    try {
      const qs = "?status=published&limit=50";
      const data: any = await apiGetJson(API.worldEventsList + qs, 30000);
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      // backend formatın farklıysa burada normalize edebilirsin
      // şimdilik: UI listesi serverdan değil localden de tutulabilir
    } catch {
      // liste fetch zorunlu değil
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const readNow = useCallback(async () => {
    const u = url.trim();
    const n = note.trim();
    if (!u || !n) {
      Alert.alert("!", lang === "tr" ? "Link ve 1 cümle not gerekli." : "Link and note required.");
      return;
    }

    setBusy(true);
    try {
      const instruction = buildInstruction(u, n);

      const payload: any = {
        message: instruction,
        session_id: "mobile-default",
        domain: "world_events",
        gate_mode: "mirror",
        persona: "user",
        lang,
        context: {
          source: "world_events",
          intent: "ust_bilinc_matrix_read",
          url: u,
          user_note: n,
          output_format: "world_event_read_v1",
        },
      };

      // ✅ kritik: apiPostJson headerları otomatik ekler (X-User-Id vs)
      const data: any = await apiPostJson(API.worldEventsCreate, payload, 60000);

      const reading = String(data?.answer || data?.response || "").trim() || "-";

      const item: Item = {
        id: uid(),
        created_at: Date.now(),
        url: u,
        note: n,
        lang,
        reading,
      };

      setItems((prev) => [item, ...prev]);
      setUrl("");
      setNote("");
    } catch (e: any) {
      Alert.alert("Hata", String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [buildInstruction, lang, note, url]);

  const shareItem = useCallback(async (it: Item) => {
    const text =
      (it.lang === "tr" ? "DÜNYA OLAYI (Üst Bilinç Okuma)\n" : "WORLD EVENT (System View)\n") +
      it.url +
      "\n\n" +
      "Not: " + it.note +
      "\n\n" +
      it.reading;

    try {
      await Share.share({ message: text });
    } catch {}
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.h1}>{t.title}</Text>
              <Text style={styles.sub}>{t.sub}</Text>
            </View>

            <View style={styles.langRow}>
              <Pressable onPress={() => setLang("tr")} style={styles.langChip}>
                <Text style={[styles.langText, lang === "tr" && { color: theme.accent }]}>TR</Text>
              </Pressable>
              <Pressable onPress={() => setLang("en")} style={styles.langChip}>
                <Text style={[styles.langText, lang === "en" && { color: theme.accent }]}>EN</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
            <Text style={styles.label}>{t.url}</Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder={t.url}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>{t.note}</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t.note}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={[styles.input, { minHeight: 86 }]}
              multiline
            />

            <Pressable
              onPress={readNow}
              disabled={busy}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }, busy && { opacity: 0.6 }]}
            >
              <Text style={styles.primaryText}>{busy ? t.saving : t.read}</Text>
            </Pressable>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.accent }]}>{t.today}</Text>

          {items.length === 0 ? (
            <Text style={styles.empty}>{t.empty}</Text>
          ) : (
            items.map((it) => (
              <View key={it.id} style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
                <Text style={styles.itemMeta}>{new Date(it.created_at).toLocaleString()}</Text>

                <Text style={styles.itemUrl}>{it.url}</Text>
                <Text style={styles.itemNote}>Not: {it.note}</Text>

                <Text style={styles.itemReading} numberOfLines={10}>
                  {it.reading}
                </Text>

                <View style={styles.actionsRow}>
                  <Pressable onPress={() => shareItem(it)} style={styles.smallBtn}>
                    <Text style={[styles.smallBtnText, { color: theme.accent }]}>{t.share}</Text>
                  </Pressable>
                  <Pressable onPress={() => deleteItem(it.id)} style={styles.smallBtn}>
                    <Text style={[styles.smallBtnText, { color: "#ff6b8a" }]}>{t.del}</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 180 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  container: { paddingTop: 18, paddingHorizontal: 18 },

  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  h1: { color: "white", fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  sub: { color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 20 },

  langRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },

  card: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  label: { color: "rgba(255,255,255,0.75)", fontWeight: "800", marginBottom: 6 },
  input: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "white",
  },
  primaryBtn: { marginTop: 14, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryText: { color: "white", fontWeight: "900" },

  sectionTitle: { marginTop: 18, fontWeight: "900", fontSize: 18 },
  empty: { color: "rgba(255,255,255,0.55)", marginTop: 10 },

  itemCard: {
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  itemMeta: { color: "rgba(255,255,255,0.45)", marginBottom: 8 },
  itemUrl: { color: "white", fontWeight: "900" },
  itemNote: { color: "rgba(255,255,255,0.70)", marginTop: 6 },
  itemReading: { color: "rgba(255,255,255,0.85)", marginTop: 10, lineHeight: 20 },

  actionsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  smallBtnText: { fontWeight: "900" },
});