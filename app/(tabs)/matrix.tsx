// app/(tabs)/matrix.tsx
import React, { useMemo, useState, useCallback, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://api.asksanri.com";

type Lang = "tr" | "en";
type Target = "self" | "other";

const CYCLE_DAY = 21; // Sanrı günü
const QUOTA_CYCLE_KEY = "matrix_quota_cycle";
const QUOTA_USED_OTHER_KEY = "matrix_quota_used_other";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function currentCycleStartISO(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();

  let cy = y;
  let cm = m;

  if (d < CYCLE_DAY) {
    cm = m - 1;
    if (cm === 0) {
      cm = 12;
      cy = y - 1;
    }
  }

  return String(cy) + "-" + pad2(cm) + "-" + pad2(CYCLE_DAY);
}

async function ensureCycleReset() {
  const nowKey = currentCycleStartISO();
  const saved = await AsyncStorage.getItem(QUOTA_CYCLE_KEY);

  if (saved !== nowKey) {
    await AsyncStorage.setItem(QUOTA_CYCLE_KEY, nowKey);
    await AsyncStorage.setItem(QUOTA_USED_OTHER_KEY, "0");
  }
}

async function canReadOtherThisCycle(): Promise<boolean> {
  await ensureCycleReset();
  const used = await AsyncStorage.getItem(QUOTA_USED_OTHER_KEY);
  return used !== "1";
}

async function markOtherUsedThisCycle() {
  await ensureCycleReset();
  await AsyncStorage.setItem(QUOTA_USED_OTHER_KEY, "1");
}

async function getCycleStart(): Promise<string> {
  await ensureCycleReset();
  return (await AsyncStorage.getItem(QUOTA_CYCLE_KEY)) || currentCycleStartISO();
}

function parseTRDateToISO(tr: string) {
  // "DD.MM.YYYY" -> "YYYY-MM-DD"
  const s = tr.trim();
  const parts = s.split(".");
  if (parts.length !== 3) return "";
  const dd = Number(parts[0]);
  const mm = Number(parts[1]);
  const yyyy = Number(parts[2]);
  if (!dd || !mm || !yyyy) return "";
  if (yyyy < 1900 || yyyy > 2100) return "";
  if (mm < 1 || mm > 12) return "";
  if (dd < 1 || dd > 31) return "";
  return String(yyyy) + "-" + pad2(mm) + "-" + pad2(dd);
}

function buildMatrixInstruction(lang: Lang, target: Target, name: string, birthTR: string, birthISO: string) {
  if (lang === "tr") {
    return (
      "MATRIX OKUMA KOMUTU (SANRI DILI)\n" +
      "KISI: " + (target === "self" ? "KENDIM" : "BASKA KISI") + "\n" +
      "AD: " + name + "\n" +
      "DOGUM: " + birthTR + " (ISO " + birthISO + ")\n\n" +
      "Soru sorma. Sadece okuma ver.\n" +
      "Basliklarla yaz:\n" +
      "1) MATRIX FREKANSI (3 satır)\n" +
      "2) SAYI AKISI (doğum tarihi parçala + toplamlar + kök sayı)\n" +
      "3) HARF/ISIM FREKANSI (harf->sayı->tema, maddeli)\n" +
      "4) ARKETIP (tek isim + 2 satır)\n" +
      "5) MATRIX ROLU (1 cümle)\n" +
      "6) PARA KODU (1 risk + 1 anahtar)\n" +
      "7) ILISKI KODU (1 tetik + 1 çözüm)\n" +
      "8) TEK AKSIYON (bugün 1 adım)\n" +
      "9) TEK SORU (1 net soru)\n"
    );
  }

  return (
    "MATRIX READING COMMAND\n" +
    "PERSON: " + (target === "self" ? "SELF" : "OTHER") + "\n" +
    "NAME: " + name + "\n" +
    "BIRTH: " + birthTR + " (ISO " + birthISO + ")\n\n" +
    "Do not ask questions. Only provide a reading.\n" +
    "Use headings:\n" +
    "1) MATRIX FREQUENCY\n" +
    "2) NUMBER FLOW (split + sums + root)\n" +
    "3) LETTER/NAME FREQUENCY (bullets)\n" +
    "4) ARCHETYPE\n" +
    "5) MATRIX ROLE\n" +
    "6) MONEY CODE (1 risk + 1 key)\n" +
    "7) RELATIONSHIP CODE (1 trigger + 1 solution)\n" +
    "8) ONE ACTION (one step today)\n" +
    "9) ONE QUESTION\n"
  );
}

const T = {
  tr: {
    title: "MATRIX OKUMA",
    sub: "Ad Soyad + Doğum Tarihi gir. Sistem frekansını, arketipini ve rolünü okur.",
    self: "Kendim",
    other: "Başka Biri",
    name: "Ad Soyad",
    birth: "Doğum Tarihi (GG.AA.YYYY)",
    quick: "Ücretsiz Hızlı Okuma",
    quotaUsed: "Bu döngüde 1 kişi hakkın doldu. Yeni hak 21’inde yenilenir.",
    quotaOk: "Bu döngüde 1 kişi hakkın var.",
    invalid: "Lütfen Ad Soyad ve Doğum Tarihi gir.",
    invalidDate: "Tarih formatı GG.AA.YYYY olmalı.",
    sending: "Gönderiliyor…",
    resultTitle: "Okuma",
    vipTitle: "VIP / Derin Okuma",
    vipSub: "İlişki • Para • Kader Rotası • Derin rol (yakında)",
    vipBtn: "VIP Deep Read (Yakında)",
  },
  en: {
    title: "MATRIX READ",
    sub: "Enter full name + birthdate. The system reads frequency, archetype and role.",
    self: "Self",
    other: "Other",
    name: "Full name",
    birth: "Birthdate (DD.MM.YYYY)",
    quick: "Free Quick Read",
    quotaUsed: "Your 1-person quota is used for this cycle. It renews on the 21st.",
    quotaOk: "You have 1 other-person read available in this cycle.",
    invalid: "Please enter name and birthdate.",
    invalidDate: "Date must be DD.MM.YYYY",
    sending: "Sending…",
    resultTitle: "Reading",
    vipTitle: "VIP / Deep Read",
    vipSub: "Relationship • Money • Destiny Route • Deep role (soon)",
    vipBtn: "VIP Deep Read (Soon)",
  },
} as const;

export default function MatrixScreen() {
  // ✅ 1) STATE (ÖNCE)
  const [lang, setLang] = useState<Lang>("tr");
  const [target, setTarget] = useState<Target>("self");

  const [name, setName] = useState("");
  const [birthTR, setBirthTR] = useState("");

  const [quotaMsg, setQuotaMsg] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");

  // ✅ 2) THEME (SONRA)
  const theme = useMemo(() => {
    if (lang === "tr") {
      return {
        bg: ["#07080d", "#14072e", "#050610"] as [string, string, string],
        accent: "#7cf7d8",
        primary: "rgba(94,59,255,0.85)",
        chipActive: "rgba(124,247,216,0.25)",
        chipBorder: "rgba(124,247,216,0.28)",
      };
    }
    return {
      bg: ["#05060a", "#061325", "#05060a"] as [string, string, string],
      accent: "#7cf7d8",
      primary: "rgba(30,180,120,0.55)",
      chipActive: "rgba(120,255,220,0.22)",
      chipBorder: "rgba(120,255,220,0.30)",
    };
  }, [lang]);

  const refreshQuota = useCallback(async () => {
    const cycle = await getCycleStart();
    if (target === "self") {
      setQuotaMsg("Cycle: " + cycle);
      return;
    }
    const ok = await canReadOtherThisCycle();
    setQuotaMsg((ok ? T[lang].quotaOk : T[lang].quotaUsed) + " (Cycle: " + cycle + ")");
  }, [lang, target]);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  const ask = useCallback(async () => {
    const n = name.trim();
    const b = birthTR.trim();

    if (!n || !b) {
      Alert.alert("!", T[lang].invalid);
      return;
    }
    const iso = parseTRDateToISO(b);
    if (!iso) {
      Alert.alert("!", T[lang].invalidDate);
      return;
    }

    if (target === "other") {
      const ok = await canReadOtherThisCycle();
      if (!ok) {
        Alert.alert("VIP", T[lang].quotaUsed);
        return;
      }
    }

    setBusy(true);
    setResult("");

    const cycle = await getCycleStart();

    try {
      const instruction = buildMatrixInstruction(lang, target, n, b, iso);

      const payload: any = {
        message: instruction,
        session_id: "mobile-default",
        domain: "matrix",
        gate_mode: "mirror",
        persona: "user",
        lang: lang,
        context: {
          matrix_intent: "quick_profile",
          target: target,
          name: n,
          birthdate: iso,
          birthdate_raw: b,
          cycle_start: cycle,
          vip: false,
          sanri_birth: "2026-02-21",
          output_format: "matrix_read_v1",
        },
      };

      const res = await fetch(API + "/bilinc-alani/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String(data?.detail || "HTTP " + res.status));

      const answer = String(data?.answer || data?.response || "").trim() || "—";
      setResult(answer);

      if (target === "other") {
        await markOtherUsedThisCycle();
      }
      await refreshQuota();
    } catch (e: any) {
      Alert.alert("Hata", String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [birthTR, lang, name, refreshQuota, target]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFillObject} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.kicker}>CAELINUS AI • BİLİNÇ AYNASI</Text>
            <Text style={styles.title}>{T[lang].title}</Text>

            {/* TR/EN Segment */}
            <View style={[styles.segmentWrap, { borderColor: theme.chipBorder }]}>
              <Pressable
                onPress={() => setLang("tr")}
                style={[styles.segmentBtn, lang === "tr" && { backgroundColor: theme.chipActive }]}
              >
                <Text style={[styles.segmentText, lang === "tr" && { color: theme.accent }]}>TR</Text>
              </Pressable>

              <Pressable
                onPress={() => setLang("en")}
                style={[styles.segmentBtn, lang === "en" && { backgroundColor: theme.chipActive }]}
              >
                <Text style={[styles.segmentText, lang === "en" && { color: theme.accent }]}>EN</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.sub}>{T[lang].sub}</Text>

          {/* Target toggle */}
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setTarget("self")}
              style={[styles.toggle, target === "self" && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, target === "self" && styles.toggleTextActive]}>{T[lang].self}</Text>
            </Pressable>

            <Pressable
              onPress={() => setTarget("other")}
              style={[styles.toggle, target === "other" && styles.toggleActive]}
            >
              <Text style={[styles.toggleText, target === "other" && styles.toggleTextActive]}>{T[lang].other}</Text>
            </Pressable>
          </View>

          <Text style={[styles.quota, { color: theme.accent }]}>{quotaMsg}</Text>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.label}>{T[lang].name}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={T[lang].name}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>{T[lang].birth}</Text>
            <TextInput
              value={birthTR}
              onChangeText={setBirthTR}
              placeholder={T[lang].birth}
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.input}
              keyboardType="numeric"
            />

            <Pressable
              onPress={ask}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }, busy && { opacity: 0.6 }]}
              disabled={busy}
            >
              <Text style={styles.primaryText}>{busy ? T[lang].sending : T[lang].quick}</Text>
            </Pressable>
          </View>

          {/* Result */}
          {result ? (
            <View style={styles.resultCard}>
              <Text style={[styles.resultTitle, { color: theme.accent }]}>{T[lang].resultTitle}</Text>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          ) : null}

          {/* VIP */}
          <View style={styles.card}>
            <Text style={styles.vipTitle}>{T[lang].vipTitle}</Text>
            <Text style={styles.vipSub}>{T[lang].vipSub}</Text>
            <Pressable style={styles.secondaryBtn} onPress={() => Alert.alert("VIP", "Yakında")}>
              <Text style={[styles.secondaryText, { color: theme.accent }]}>{T[lang].vipBtn}</Text>
            </Pressable>
          </View>

          <View style={{ height: 180 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  container: { paddingTop: 18, paddingHorizontal: 18 },

  headerBlock: { alignItems: "center", marginBottom: 16 },
  kicker: { color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 2, marginBottom: 8 },
  title: { color: "white", fontWeight: "900", fontSize: 26, letterSpacing: 1 },
  sub: { color: "rgba(255,255,255,0.65)", marginTop: 8, lineHeight: 20 },

  segmentWrap: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  segmentBtn: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 999 },
  segmentText: { color: "rgba(255,255,255,0.6)", fontWeight: "800" },

  toggleRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  toggleActive: { backgroundColor: "rgba(94,59,255,0.35)", borderColor: "rgba(94,59,255,0.55)" },
  toggleText: { color: "rgba(255,255,255,0.75)", fontWeight: "900" },
  toggleTextActive: { color: "white" },

  quota: { marginTop: 10, fontWeight: "700" },

  card: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  label: { color: "rgba(255,255,255,0.75)", marginBottom: 6, fontWeight: "800" },
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

  resultCard: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  resultTitle: { fontWeight: "900", marginBottom: 8 },
  resultText: { color: "rgba(255,255,255,0.88)", lineHeight: 22 },

  vipTitle: { color: "white", fontWeight: "900", fontSize: 18 },
  vipSub: { color: "rgba(255,255,255,0.65)", marginTop: 6, lineHeight: 20 },

  secondaryBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.35)",
    backgroundColor: "rgba(124,247,216,0.06)",
  },
  secondaryText: { fontWeight: "900" },
});