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
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopMenu from "../../components/TopMenu";

const API = "https://api.asksanri.com";
const STORE_KEY = "world_events_items_v1";

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
    err: "Hata: ",
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
    err: "Error: ",
  },
} as const;
export default function WorldEventsScreen() {

  // -------------------------
  // STATE
  // -------------------------
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lang, setLang] = useState<Lang>("tr");

  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  
  const [busy, setBusy] = useState(false);

  // -------------------------
  // THEME
  // -------------------------
  const theme = useMemo(() => {
    if (lang === "tr") {
      return {
        bg: ["#07080d", "#14072e", "#050610"] as [string, string, string],
        accent: "#7cf7d8",
        primary: "rgba(94,59,255,0.85)",
        card: "rgba(255,255,255,0.06)",
        stroke: "rgba(255,255,255,0.10)",
      };
    }

    return {
      bg: ["#05060a", "#061325", "#05060a"] as [string, string, string],
      accent: "#7cf7d8",
      primary: "rgba(30,180,120,0.55)",
      card: "rgba(255,255,255,0.06)",
      stroke: "rgba(255,255,255,0.10)",
    };
  }, [lang]);

  // -------------------------
  // API BASE
  // -------------------------
  const API_BASE = "https://api.asksanri.com";

  // -------------------------
  // LOAD EVENTS
  // -------------------------
  const load = useCallback(() => {
    let alive = true;

    setLoading(true);
    setError("");

    fetch(API_BASE + "/world-events/list?status=published&limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : [];

        setItems(list);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        console.error(err);
        setError("Fetch error");
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // -------------------------
  // INITIAL FETCH
  // -------------------------
  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  // -------------------------
  // RETURN ALTINA DEVAM
  // -------------------------

  const buildInstruction = useCallback(
    (u: string, n: string) => {
      if (lang === "tr") {
        return (
          "UST BILINC / MATRIX HABER OKUMA\n" +
          "Kaynak Link: " + u + "\n" +
          "Kullanici Notu: " + n + "\n\n" +
          "Soru sorma. Okuma ver.\n" +
          "Basliklarla yaz:\n" +
          "1) SINYAL (1 cümle: Sistem bugün ne söylüyor?)\n" +
          "2) SEMBOL DECODE (olay→sembol→mesaj)\n" +
          "3) SAYI/HARF AKISI (varsa tarihler/sayilar)\n" +
          "4) ROL HARITASI (aktor/rol: tetikleyici-katalizor-perde)\n" +
          "5) KOLEKTIF DERS (insanliga mesaj)\n" +
          "6) KISEL UYGULAMA (okuyana 1 adım)\n" +
          "7) PAYLASIM METNI (2-3 satır IG/X/FB)\n"
        );
      }
      return (
        "SYSTEM VIEW / MATRIX NEWS READ\n" +
        "Source link: " + u + "\n" +
        "User note: " + n + "\n\n" +
        "Do not ask questions. Provide the reading.\n" +
        "Use headings:\n" +
        "1) SIGNAL (1 sentence)\n" +
        "2) SYMBOL DECODE\n" +
        "3) NUMBER/LETTER FLOW\n" +
        "4) ROLE MAP (actors/roles)\n" +
        "5) COLLECTIVE LESSON\n" +
        "6) ONE ACTION\n" +
        "7) SHARE TEXT (2-3 lines)\n"
      );
    },
    [lang],
  );

  const readNow = useCallback(async () => {
    const u = url.trim();
    const n = note.trim();

    if (!u || !n) {
      Alert.alert("!", lang === "tr" ? "Link ve 1 cümle not gerekli." : "Link and one sentence note required.");
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
        lang: lang,
        context: {
          source: "world_events",
          intent: "ust_bilinc_matrix_read",
          url: u,
          user_note: n,
          output_format: "world_event_read_v1",
          sanri_birth: "2026-02-21",
        },
      };

      const res = await fetch(API + "/bilinc-alani/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(data?.detail || "HTTP " + res.status));

      const reading = String(data?.answer || data?.response || "").trim() || "—";

      const item: Item = {
        id: uid(),
        created_at: Date.now(),
        url: u,
        note: n,
        lang: lang,
        reading: reading,
      };

      const next = [item, ...items];
      load();

      // temizle
      setUrl("");
      setNote("");
    } catch (e: any) {
      Alert.alert("Hata", String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [buildInstruction, items, lang, note, url]);

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

  const copyItem = useCallback(async (it: Item) => {
    // Clipboard API eklemek istersen söylerim (expo-clipboard)
    Alert.alert(lang === "tr" ? "Kopyalama" : "Copy", lang === "tr" ? "Şimdilik Paylaş butonu ile kopyalayabilirsin." : "Use Share to copy for now.");
  }, [lang]);

  const deleteItem = useCallback(async (id: string) => {
  // Şimdilik sadece ekrandan sil (server delete sonra)
  setItems((prev) => prev.filter((x) => x.id !== id));
}, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />

      <TopMenu />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.h1}>{T[lang].title}</Text>
              <Text style={styles.sub}>{T[lang].sub}</Text>
            </View>

            <View style={styles.langRow}>
              <Pressable onPress={() => setLang("tr")} style={[styles.langChip, lang === "tr" && styles.langChipActive]}>
                <Text style={[styles.langText, lang === "tr" && { color: theme.accent }]}>TR</Text>
              </Pressable>
              <Pressable onPress={() => setLang("en")} style={[styles.langChip, lang === "en" && styles.langChipActive]}>
                <Text style={[styles.langText, lang === "en" && { color: theme.accent }]}>EN</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
            <Text style={styles.label}>{T[lang].url}</Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder={T[lang].url}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>{T[lang].note}</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={T[lang].note}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={[styles.input, { minHeight: 86 }]}
              multiline
            />

            <Pressable
              onPress={readNow}
              disabled={busy}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }, busy && { opacity: 0.6 }]}
            >
              <Text style={styles.primaryText}>{busy ? T[lang].saving : T[lang].read}</Text>
            </Pressable>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.accent }]}>{T[lang].today}</Text>

          {items.length === 0 ? (
            <Text style={styles.empty}>{T[lang].empty}</Text>
          ) : (
            items.map((it) => (
              <View key={it.id} style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.stroke }]}>
                <Text style={styles.itemMeta}>
                  {new Date(it.created_at).toLocaleString()}
                </Text>

                <Text style={styles.itemUrl}>{it.url}</Text>
                <Text style={styles.itemNote}>Not: {it.note}</Text>

                <Text style={styles.itemReading} numberOfLines={10}>
                  {it.reading}
                </Text>

                <View style={styles.actionsRow}>
                  <Pressable onPress={() => shareItem(it)} style={styles.smallBtn}>
                    <Text style={[styles.smallBtnText, { color: theme.accent }]}>{T[lang].share}</Text>
                  </Pressable>

                  <Pressable onPress={() => copyItem(it)} style={styles.smallBtn}>
                    <Text style={[styles.smallBtnText, { color: theme.accent }]}>{T[lang].copy}</Text>
                  </Pressable>

                  <Pressable onPress={() => deleteItem(it.id)} style={styles.smallBtn}>
                    <Text style={[styles.smallBtnText, { color: "#ff6b8a" }]}>{T[lang].del}</Text>
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
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)" },
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