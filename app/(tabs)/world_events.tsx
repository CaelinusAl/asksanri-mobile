import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiPostJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

type ReadingItem = {
  id: string;
  created_at: number;
  url: string;
  note: string;
  lang: Lang;
  reading: string;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function WorldEventsScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<ReadingItem[]>([]);

  const t = useMemo(
    () =>
      lang === "tr"
        ? {
            title: "DÜNYA OLAYLARI",
            subtitle: "Haberleri üst bilinç okumasıyla yorumla.",
            urlLabel: "Haber Linki",
            urlPlaceholder: "https://...",
            noteLabel: "1 Cümlelik Not",
            notePlaceholder: "Bu olay sana neyi düşündürdü?",
            readNow: "Haberi Yorumla",
            empty: "Henüz yorum yok.",
            back: "Geri",
            loading: "Sanrı okuyor...",
            needFields: "Link ve 1 cümle not gerekli.",
            result: "Yorum",
          }
        : {
            title: "WORLD EVENTS",
            subtitle: "Interpret news through system consciousness.",
            urlLabel: "News Link",
            urlPlaceholder: "https://...",
            noteLabel: "One-line Note",
            notePlaceholder: "What does this event make you think of?",
            readNow: "Read the News",
            empty: "No readings yet.",
            back: "Back",
            loading: "Sanri is reading...",
            needFields: "Link and one sentence note are required.",
            result: "Reading",
          },
    [lang]
  );

  const readNow = useCallback(async () => {
    const u = url.trim();
    const n = note.trim();

    if (!u || !n) {
      Alert.alert("!", t.needFields);
      return;
    }

    setBusy(true);
    try {
      const instruction =
        lang === "tr"
          ? `ÜST BİLİNÇ / MATRIX HABER OKUMA

Kaynak Link: ${u}
Kullanıcı Notu: ${n}

Soru sorma. Direkt okuma ver.
Şu başlıklarla yaz:

1) SİNYAL
2) SEMBOL DECODE
3) SAYI / HARF AKIŞI
4) ROL HARİTASI
5) KOLEKTİF DERS
6) KİŞİSEL UYGULAMA
7) PAYLAŞIM METNİ`
          : `SYSTEM VIEW / MATRIX NEWS READ

Source Link: ${u}
User Note: ${n}

Do not ask questions. Provide a direct reading.
Use these headings:

1) SIGNAL
2) SYMBOL DECODE
3) NUMBER / LETTER FLOW
4) ROLE MAP
5) COLLECTIVE LESSON
6) ONE PERSONAL ACTION
7) SHARE TEXT`;

      const payload = {
        message: instruction,
        session_id: "mobile-default",
        domain: "auto",
        gate_mode: "mirror",
        persona: "user",
        lang,
        context: {
          source: "world_events",
          url: u,
          user_note: n,
          intent: "world_event_read_v1",
        },
      };

      const data: any = await apiPostJson(API.ask, payload, 60000);

      const reading =
        String(data?.answer || data?.response || data?.text || "").trim() || "-";

      const item: ReadingItem = {
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
  }, [url, note, lang, t.needFields]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

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
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>SYSTEM TERMINAL</Text>
        <Text style={styles.h1}>{t.title}</Text>
        <Text style={styles.sub}>{t.subtitle}</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>{t.urlLabel}</Text>
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder={t.urlPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.38)"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>{t.noteLabel}</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t.notePlaceholder}
            placeholderTextColor="rgba(255,255,255,0.38)"
            multiline
            style={[styles.input, styles.textarea]}
          />

          <Pressable onPress={readNow} style={styles.submitBtn} disabled={busy}>
            {busy ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text style={styles.submitTxt}>{t.loading}</Text>
              </View>
            ) : (
              <Text style={styles.submitTxt}>{t.readNow}</Text>
            )}
          </Pressable>
        </View>

        <View style={{ height: 10 }} />

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTxt}>{t.empty}</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.resultCard}>
              <Text style={styles.resultTitle}>{t.result}</Text>

              <Text style={styles.metaLine}>
                {new Date(item.created_at).toLocaleString()}
              </Text>

              <Text style={styles.linkText}>{item.url}</Text>

              <Text style={styles.noteText}>{item.note}</Text>

              <Text style={styles.resultBody}>{item.reading}</Text>
            </View>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.38)" },

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
  langTxt: { color: "rgba(255,255,255,0.72)", fontWeight: "900", letterSpacing: 1 },
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

  formCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  label: {
    color: "#7cf7d8",
    fontWeight: "900",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  submitBtn: {
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  submitTxt: {
    color: "white",
    fontWeight: "900",
    fontSize: 15,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  emptyCard: {
    borderRadius: 22,
    padding: 18,
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  emptyTxt: {
    color: "rgba(255,255,255,0.62)",
  },

  resultCard: {
    borderRadius: 22,
    padding: 18,
    marginTop: 12,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  resultTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 16,
  },
  metaLine: {
    color: "rgba(255,255,255,0.48)",
    marginTop: 8,
    fontSize: 12,
  },
  linkText: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 10,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  noteText: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 10,
    fontStyle: "italic",
  },
  resultBody: {
    color: "white",
    marginTop: 14,
    lineHeight: 22,
    fontSize: 14,
  },
});