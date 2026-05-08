import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getArchive,
  deleteArchiveEntry,
  type ArchiveEntry,
} from "../../lib/archiveStore";
import {
  getOnboarding,
  type OnboardingState,
} from "../../lib/onboardingStore";
import { TONE_META } from "../../lib/dailyReminders";

const BG = "#07080d";

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [data, all] = await Promise.all([getOnboarding(), getArchive()]);
    setOb(data);
    setEntries(all);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!ob) {
    return (
      <View style={st.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={BG}
          translucent={false}
        />
      </View>
    );
  }

  const tr = ob.lang === "tr";

  const T = {
    back: tr ? "← Bugün" : "← Today",
    title: tr ? "Yankı Arşivi" : "Echo Archive",
    sub: tr
      ? "Cihazına yazılır. Senin dışında kimse görmez."
      : "Stored on your device. No one else sees it.",
    empty: tr
      ? "Henüz yankı yok.\nBugün başla."
      : "No echoes yet.\nBegin today.",
    emptyCta: tr ? "Bugünün cümlesini aç" : "Open today's sentence",
    delete: tr ? "Sil" : "Delete",
    confirmTitle: tr ? "Bu yankıyı sil?" : "Delete this echo?",
    confirmMsg: tr ? "Geri alınamaz." : "This cannot be undone.",
    cancel: tr ? "Vazgeç" : "Cancel",
    sanriLabel: tr ? "Sanrı" : "Sanrı",
    youLabel: tr ? "Sen" : "You",
  };

  const onDelete = (entry: ArchiveEntry) => {
    Alert.alert(T.confirmTitle, T.confirmMsg, [
      { text: T.cancel, style: "cancel" },
      {
        text: T.delete,
        style: "destructive",
        onPress: async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          await deleteArchiveEntry(entry.id);
          load();
        },
      },
    ]);
  };

  const fmtDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const months = tr
        ? ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]
        : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const day = d.getDate();
      const m = months[d.getMonth()];
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${m} · ${hh}:${mm}`;
    } catch {
      return "";
    }
  };

  return (
    <View style={st.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG}
        translucent={false}
      />

      <View style={[st.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={st.topBtn}>
          <Text style={st.topBtnTxt}>{T.back}</Text>
        </Pressable>
      </View>

      <View style={st.header}>
        <Text style={st.title}>{T.title}</Text>
        <Text style={st.sub}>{T.sub}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1 }} />
      ) : entries.length === 0 ? (
        <View style={st.empty}>
          <Text style={st.emptyGlyph}>◯</Text>
          <Text style={st.emptyTxt}>{T.empty}</Text>
          <Pressable onPress={() => router.replace("/(tabs)/daily" as any)} style={st.emptyBtn}>
            <Text style={st.emptyBtnTxt}>{T.emptyCta}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            st.list,
            { paddingBottom: Math.max(insets.bottom + 16, 28) },
          ]}
        >
          {entries.map((e) => {
            const meta = TONE_META[e.tone] || TONE_META.durulma;
            return (
              <View key={e.id} style={[st.card, { borderColor: `${meta.color}22` }]}>
                <View style={st.cardTop}>
                  <Text style={[st.cardGlyph, { color: meta.color }]}>{meta.glyph}</Text>
                  <Text style={st.cardDate}>{fmtDate(e.createdAt)}</Text>
                  <View style={{ flex: 1 }} />
                  <Pressable onPress={() => onDelete(e)} hitSlop={12} style={st.delBtn}>
                    <Text style={st.delTxt}>×</Text>
                  </Pressable>
                </View>

                {!!e.prompt && (
                  <Text style={[st.promptTxt, { color: meta.color }]}>
                    {e.prompt}
                  </Text>
                )}

                <View style={st.line}>
                  <Text style={st.who}>{T.youLabel}</Text>
                  <Text style={st.body}>{e.userText}</Text>
                </View>

                {!!e.sanriReply && (
                  <View style={[st.line, st.lineSanri, { borderLeftColor: `${meta.color}55` }]}>
                    <Text style={[st.who, { color: meta.color }]}>{T.sanriLabel}</Text>
                    <Text style={st.body}>{e.sanriReply}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: "row",
    paddingHorizontal: 18,
    // paddingTop dinamik olarak inline (safe area inset).
    paddingBottom: 8,
  },
  topBtn: { padding: 6 },
  topBtnTxt: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "700" },

  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 0.3 },
  sub: { color: "rgba(255,255,255,0.50)", fontSize: 13, marginTop: 6, lineHeight: 18 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyGlyph: { color: "rgba(255,255,255,0.20)", fontSize: 64 },
  emptyTxt: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 18,
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.30)",
  },
  emptyBtnTxt: {
    color: "#7cf7d8",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  list: { paddingHorizontal: 18, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  cardGlyph: { fontSize: 16 },
  cardDate: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  delBtn: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  delTxt: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 22,
    fontWeight: "300",
    marginTop: -2,
  },

  promptTxt: {
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 10,
  },
  line: { marginTop: 6 },
  lineSanri: {
    marginTop: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
  },
  who: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  body: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
});
