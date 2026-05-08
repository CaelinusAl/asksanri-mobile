import React, { useEffect, useState } from "react";
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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import {
  getOnboarding,
  updateTone,
  updateTime,
  updateLang,
  resetOnboarding,
  type OnboardingState,
  type ReminderTime,
  type Lang,
} from "../../lib/onboardingStore";
import { TONE_META, type ReminderTone } from "../../lib/dailyReminders";
import { clearArchive } from "../../lib/archiveStore";
import { scheduleDaily, cancelDaily } from "../../lib/notificationScheduler";

const BG = "#07080d";

export default function SilenceScreen() {
  const [ob, setOb] = useState<OnboardingState | null>(null);
  const [notifStatus, setNotifStatus] =
    useState<Notifications.PermissionStatus | "unknown">("unknown");

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await getOnboarding();
      if (!alive) return;
      setOb(data);
      try {
        if (Platform.OS !== "web") {
          const perm = await Notifications.getPermissionsAsync();
          setNotifStatus(perm.status);
        }
      } catch {
        setNotifStatus("unknown");
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!ob) {
    return <View style={st.root}><StatusBar barStyle="light-content" /></View>;
  }

  const tr = ob.lang === "tr";

  const T = {
    back: tr ? "← Bugün" : "← Today",
    title: tr ? "Sessizlik & Ayarlar" : "Silence & Settings",
    sub: tr
      ? "Sanrı'nın seninle nasıl konuştuğunu sen seçersin."
      : "You decide how Sanrı speaks with you.",

    sectionTone: tr ? "TON" : "TONE",
    sectionTime: tr ? "ZAMAN" : "TIME",
    sectionLang: tr ? "DİL" : "LANGUAGE",
    sectionNotif: tr ? "BİLDİRİM" : "NOTIFICATIONS",
    sectionReset: tr ? "TEKRAR BAŞLA" : "RESET",

    timeMorning: tr ? "Sabah · 07–10" : "Morning · 07–10",
    timeNoon: tr ? "Öğle · 12–14" : "Noon · 12–14",
    timeEvening: tr ? "Akşam · 20–22" : "Evening · 20–22",

    notifGranted: tr ? "Bildirimler açık." : "Notifications enabled.",
    notifDenied: tr
      ? "Bildirimler kapalı. Telefon ayarlarından açabilirsin."
      : "Notifications off. Open in system settings.",
    notifAsk: tr ? "Bildirimleri Aç" : "Enable Notifications",
    notifOpenSettings: tr ? "Ayarları Aç" : "Open Settings",

    resetOnboarding: tr ? "Onboarding'i tekrar başlat" : "Restart onboarding",
    clearArchive: tr ? "Tüm yankıları sil" : "Clear all echoes",
    clearArchiveConfirm: tr ? "Tüm yankılar silinsin mi?" : "Delete all echoes?",
    clearArchiveDone: tr ? "Arşiv temizlendi." : "Archive cleared.",
    cancel: tr ? "Vazgeç" : "Cancel",
    confirm: tr ? "Sil" : "Delete",
  };

  const tap = () => Haptics.selectionAsync().catch(() => {});

  const reschedule = (next: { tone?: ReminderTone; time?: ReminderTime; lang?: Lang }) => {
    if (!ob) return;
    const time = next.time ?? ob.time;
    const lang = next.lang ?? ob.lang;
    if (notifStatus === "granted") {
      scheduleDaily(time, lang).catch(() => {});
    }
  };

  const onSetTone = async (t: ReminderTone) => {
    tap();
    await updateTone(t);
    setOb({ ...ob, tone: t });
    // Ton bildirimin saatini etkilemez ama dil/copy ileride tona bağlanırsa
    // tek noktadan yeniden planlamak güvenli kalır.
    reschedule({ tone: t });
  };
  const onSetTime = async (t: ReminderTime) => {
    tap();
    await updateTime(t);
    setOb({ ...ob, time: t });
    reschedule({ time: t });
  };
  const onSetLang = async (l: Lang) => {
    tap();
    await updateLang(l);
    setOb({ ...ob, lang: l });
    reschedule({ lang: l });
  };
  const onAskNotif = async () => {
    tap();
    try {
      const res = await Notifications.requestPermissionsAsync();
      setNotifStatus(res.status);
      if (res.status === "granted" && ob) {
        scheduleDaily(ob.time, ob.lang).catch(() => {});
      } else if (res.status !== "granted") {
        cancelDaily().catch(() => {});
      }
    } catch {
      /* noop */
    }
  };
  const onResetOb = async () => {
    Alert.alert(
      T.resetOnboarding,
      tr ? "Tekrar başlatmak istediğine emin misin?" : "Are you sure?",
      [
        { text: T.cancel, style: "cancel" },
        {
          text: tr ? "Başlat" : "Restart",
          style: "destructive",
          onPress: async () => {
            await resetOnboarding();
            router.replace("/(tabs)/" as any);
          },
        },
      ]
    );
  };
  const onClearArch = async () => {
    Alert.alert(T.clearArchiveConfirm, "", [
      { text: T.cancel, style: "cancel" },
      {
        text: T.confirm,
        style: "destructive",
        onPress: async () => {
          await clearArchive();
          Alert.alert(T.clearArchiveDone);
        },
      },
    ]);
  };

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />

      <View style={st.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={st.topBtn}>
          <Text style={st.topBtnTxt}>{T.back}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={st.body}>
        <Text style={st.title}>{T.title}</Text>
        <Text style={st.sub}>{T.sub}</Text>

        {/* TON */}
        <Text style={st.section}>{T.sectionTone}</Text>
        <View style={st.list}>
          {(["durulma", "hareket", "derinlesme"] as ReminderTone[]).map((t) => {
            const meta = TONE_META[t];
            const active = ob.tone === t;
            return (
              <Pressable
                key={t}
                onPress={() => onSetTone(t)}
                style={[
                  st.row,
                  {
                    borderColor: active ? `${meta.color}55` : "rgba(255,255,255,0.08)",
                    backgroundColor: active ? `${meta.color}10` : "rgba(255,255,255,0.03)",
                  },
                ]}
              >
                <Text style={[st.rowGlyph, { color: meta.color }]}>{meta.glyph}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[st.rowLabel, { color: active ? meta.color : "#fff" }]}>
                    {tr ? meta.labelTr : meta.labelEn}
                  </Text>
                  <Text style={st.rowSub}>{tr ? meta.descTr : meta.descEn}</Text>
                </View>
                {active && <Text style={[st.check, { color: meta.color }]}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* ZAMAN */}
        <Text style={st.section}>{T.sectionTime}</Text>
        <View style={st.list}>
          {(
            [
              { id: "morning" as ReminderTime, label: T.timeMorning, glyph: "☀" },
              { id: "noon" as ReminderTime, label: T.timeNoon, glyph: "✦" },
              { id: "evening" as ReminderTime, label: T.timeEvening, glyph: "☽" },
            ]
          ).map((opt) => {
            const active = ob.time === opt.id;
            const accent = TONE_META[ob.tone].color;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onSetTime(opt.id)}
                style={[
                  st.row,
                  {
                    borderColor: active ? `${accent}55` : "rgba(255,255,255,0.08)",
                    backgroundColor: active ? `${accent}10` : "rgba(255,255,255,0.03)",
                  },
                ]}
              >
                <Text style={[st.rowGlyph, { color: accent }]}>{opt.glyph}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[st.rowLabel, { color: active ? accent : "#fff" }]}>
                    {opt.label}
                  </Text>
                </View>
                {active && <Text style={[st.check, { color: accent }]}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* DİL */}
        <Text style={st.section}>{T.sectionLang}</Text>
        <View style={st.langRow}>
          {(
            [
              { id: "tr" as Lang, label: "Türkçe" },
              { id: "en" as Lang, label: "English" },
            ]
          ).map((l) => {
            const active = ob.lang === l.id;
            return (
              <Pressable
                key={l.id}
                onPress={() => onSetLang(l.id)}
                style={[
                  st.langBtn,
                  active && st.langBtnActive,
                ]}
              >
                <Text style={[st.langTxt, active && st.langTxtActive]}>{l.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* BİLDİRİM */}
        <Text style={st.section}>{T.sectionNotif}</Text>
        <View style={st.notifBox}>
          <Text style={st.notifTxt}>
            {notifStatus === "granted" ? T.notifGranted : T.notifDenied}
          </Text>
          {notifStatus !== "granted" && (
            <Pressable onPress={onAskNotif} style={st.notifBtn}>
              <Text style={st.notifBtnTxt}>{T.notifAsk}</Text>
            </Pressable>
          )}
        </View>

        {/* RESET */}
        <Text style={st.section}>{T.sectionReset}</Text>
        <Pressable onPress={onClearArch} style={st.resetBtn}>
          <Text style={st.resetTxt}>{T.clearArchive}</Text>
        </Pressable>
        <Pressable onPress={onResetOb} style={st.resetBtn}>
          <Text style={st.resetTxt}>{T.resetOnboarding}</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 8,
  },
  topBtn: { padding: 6 },
  topBtnTxt: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "700" },

  body: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 0.3 },
  sub: { color: "rgba(255,255,255,0.50)", fontSize: 13, marginTop: 6, marginBottom: 22 },

  section: {
    color: "rgba(255,255,255,0.40)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.5,
    marginTop: 22,
    marginBottom: 10,
  },

  list: { gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowGlyph: {
    fontSize: 22,
    width: 28,
    textAlign: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  rowSub: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    marginTop: 3,
  },
  check: { fontSize: 16, fontWeight: "900" },

  langRow: { flexDirection: "row", gap: 10 },
  langBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  langBtnActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.40)",
  },
  langTxt: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "800" },
  langTxtActive: { color: "#7cf7d8" },

  notifBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    gap: 12,
  },
  notifTxt: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 20 },
  notifBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.30)",
    alignSelf: "flex-start",
  },
  notifBtnTxt: { color: "#7cf7d8", fontSize: 13, fontWeight: "800", letterSpacing: 0.4 },

  resetBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.02)",
    marginTop: 8,
  },
  resetTxt: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontWeight: "700",
  },
});
