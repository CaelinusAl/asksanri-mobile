// app/(tabs)/matrix_mini.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Lang = "tr" | "en";
type Mode = "name" | "dob";

function s(x: any) {
  return String(x == null ? "" : x);
}

function onlyDigits(x: string) {
  return (x || "").replace(/[^\d]/g, "");
}

function normalizeName(x: string) {
  return (x || "")
    .toUpperCase()
    .replace(/\u0130/g, "I")
    .replace(/\u0130/g, "I")
    .replace(/\u011e/g, "G")
    .replace(/\u00dc/g, "U")
    .replace(/\u015e/g, "S")
    .replace(/\u00d6/g, "O")
    .replace(/\u00c7/g, "C")
    .replace(/[^A-Z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function digitalRoot(n: number) {
  let x = Math.abs(n);
  while (x > 9) {
    let sum = 0;
    for (const ch of String(x)) sum += Number(ch);
    x = sum;
  }
  return x === 0 ? 0 : x;
}

function nameNumber(fullName: string) {
  const name = normalizeName(fullName);
  let sum = 0;
  for (const ch of name) {
    if (ch === " ") continue;
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) sum += code - 64;
  }
  return { sum, root: digitalRoot(sum) };
}

function dobNumber(dob: string) {
  const digits = onlyDigits(dob);
  let sum = 0;
  for (const ch of digits) sum += Number(ch);
  return { sum, root: digitalRoot(sum), digits };
}

function archetypeTR(n: number) {
  switch (n) {
    case 1: return { title: "Ba\u015flatan", keys: ["in\u015fa", "karar", "y\u00f6n"] };
    case 2: return { title: "Ayna", keys: ["uyum", "ba\u011f", "duyarl\u0131l\u0131k"] };
    case 3: return { title: "\u0130fade", keys: ["yarat\u0131c\u0131l\u0131k", "s\u00f6z", "ne\u015fe"] };
    case 4: return { title: "Sistem", keys: ["d\u00fczen", "emek", "istikrar"] };
    case 5: return { title: "Kap\u0131", keys: ["de\u011fi\u015fim", "\u00f6zg\u00fcrl\u00fck", "deneyim"] };
    case 6: return { title: "\u015eifa", keys: ["sorumluluk", "kalp", "denge"] };
    case 7: return { title: "G\u00f6z", keys: ["analiz", "i\u00e7g\u00f6r\u00fc", "derinlik"] };
    case 8: return { title: "G\u00fc\u00e7", keys: ["etki", "para", "otorite"] };
    case 9: return { title: "Tamamlama", keys: ["bilgelik", "hizmet", "kapan\u0131\u015f"] };
    default: return { title: "N\u00f6tr", keys: ["s\u0131f\u0131r", "ba\u015flang\u0131\u00e7", "potansiyel"] };
  }
}

function archetypeEN(n: number) {
  switch (n) {
    case 1: return { title: "Initiator", keys: ["build", "decide", "direction"] };
    case 2: return { title: "Mirror", keys: ["harmony", "bond", "sensitivity"] };
    case 3: return { title: "Expression", keys: ["creativity", "voice", "joy"] };
    case 4: return { title: "System", keys: ["order", "effort", "stability"] };
    case 5: return { title: "Gate", keys: ["change", "freedom", "experience"] };
    case 6: return { title: "Healing", keys: ["care", "heart", "balance"] };
    case 7: return { title: "Eye", keys: ["analysis", "insight", "depth"] };
    case 8: return { title: "Power", keys: ["impact", "money", "authority"] };
    case 9: return { title: "Completion", keys: ["wisdom", "service", "closure"] };
    default: return { title: "Neutral", keys: ["zero", "reset", "potential"] };
  }
}

export default function MatrixMiniScreen() {
  const router = useRouter();
  const p = useLocalSearchParams<{
    lang?: string;
    mode?: Mode;
    name?: string;
    dob?: string;
  }>();

  const lang: Lang = s(p.lang).toLowerCase() === "en" ? "en" : "tr";
  const mode: Mode = (s(p.mode) === "dob" ? "dob" : "name") as Mode;

  const name = s(p.name);
  const dob = s(p.dob);

  const calc = useMemo(() => {
    if (mode === "dob") {
      const r = dobNumber(dob);
      const a = lang === "tr" ? archetypeTR(r.root) : archetypeEN(r.root);
      return {
        label: lang === "tr" ? "Do\u011fum Tarihi Kodu" : "Birth Date Code",
        input: dob,
        sum: r.sum,
        root: r.root,
        archeTitle: a.title,
        archeKeys: a.keys,
        hint:
          lang === "tr"
            ? "Bu h\u0131zl\u0131 okuma bir ilk izdir. Derin katmanlara ge\u00e7mek i\u00e7in devam et."
            : "This is a quick imprint. Continue for deeper layers.",
      };
    }

    const r = nameNumber(name);
    const a = lang === "tr" ? archetypeTR(r.root) : archetypeEN(r.root);
    return {
      label: lang === "tr" ? "\u0130sim Kodu" : "Name Code",
      input: name,
      sum: r.sum,
      root: r.root,
      archeTitle: a.title,
      archeKeys: a.keys,
      hint:
        lang === "tr"
          ? "Bu h\u0131zl\u0131 okuma bir ilk izdir. Derin katmanlara ge\u00e7mek i\u00e7in devam et."
          : "This is a quick imprint. Continue for deeper layers.",
    };
  }, [mode, name, dob, lang]);

  const goBack = () => router.back();

  const goDeep = () => {
    router.push({
      pathname: "/(tabs)/deep_reading",
      params: {
        lang,
        name: name || "",
        dob: dob || "",
      },
    } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topbar}>
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{"\u2190"}</Text>
        </Pressable>
        <Text style={styles.kicker}>{lang === "tr" ? "MATRIX \u00b7 HIZLI OKUMA" : "MATRIX \u00b7 QUICK READING"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{calc.label}</Text>
        <Text style={styles.sub}>{calc.input || "\u2014"}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.k}>Root</Text>
            <Text style={styles.v}>{String(calc.root)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.k}>{lang === "tr" ? "Toplam" : "Sum"}</Text>
            <Text style={styles.v}>{String(calc.sum)}</Text>
          </View>

          <View style={styles.sep} />

          <Text style={styles.big}>{calc.archeTitle}</Text>
          <Text style={styles.keys}>
            {calc.archeKeys.map((x) => "\u2022 " + x).join("\n")}
          </Text>

          <Text style={styles.hint}>{calc.hint}</Text>
        </View>

        <Pressable onPress={goDeep} style={styles.primaryBtn} hitSlop={12}>
          <Text style={styles.primaryTxt}>{lang === "tr" ? "Derin Okumaya Ge\u00e7" : "Go Deeper"}</Text>
          <Text style={styles.primaryArrow}>{"\u203a"}</Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  kicker: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },

  container: { padding: 18, paddingTop: 8 },
  h1: { color: "white", fontSize: 28, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 10, fontSize: 16 },

  card: {
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  k: { color: "rgba(255,255,255,0.65)", fontWeight: "800" },
  v: { color: "#7cf7d8", fontWeight: "900", fontSize: 16 },

  sep: { height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginVertical: 12 },

  big: { color: "white", fontWeight: "900", fontSize: 22 },
  keys: { color: "rgba(255,255,255,0.85)", marginTop: 10, lineHeight: 22 },

  hint: { color: "rgba(180,255,230,0.55)", marginTop: 12, fontStyle: "italic" },

  primaryBtn: {
    marginTop: 14,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(94,59,255,0.70)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryTxt: { color: "white", fontWeight: "900", fontSize: 16 },
  primaryArrow: { color: "#7cf7d8", fontWeight: "900", fontSize: 24 },
});
