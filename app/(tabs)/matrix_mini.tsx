// app/(tabs)/matrix_mini.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

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
    .replace(/İ/g, "I")
    .replace(/İ/g, "I")
    .replace(/Ğ/g, "G")
    .replace(/Ü/g, "U")
    .replace(/Ş/g, "S")
    .replace(/Ö/g, "O")
    .replace(/Ç/g, "C")
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

// Basit A1Z26 numerology (A=1..Z=26) -> toplam -> 1..9 kök
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

// DDMMYYYY -> toplam -> 1..9 kök
function dobNumber(dob: string) {
  const digits = onlyDigits(dob);
  let sum = 0;
  for (const ch of digits) sum += Number(ch);
  return { sum, root: digitalRoot(sum), digits };
}

function archetypeTR(n: number) {
  switch (n) {
    case 1: return { title: "Başlatan", keys: ["inşa", "karar", "yön"] };
    case 2: return { title: "Ayna", keys: ["uyum", "bağ", "duyarlılık"] };
    case 3: return { title: "İfade", keys: ["yaratıcılık", "söz", "neşe"] };
    case 4: return { title: "Sistem", keys: ["düzen", "emek", "istikrar"] };
    case 5: return { title: "Kapı", keys: ["değişim", "özgürlük", "deneyim"] };
    case 6: return { title: "Şifa", keys: ["sorumluluk", "kalp", "denge"] };
    case 7: return { title: "Göz", keys: ["analiz", "içgörü", "derinlik"] };
    case 8: return { title: "Güç", keys: ["etki", "para", "otorite"] };
    case 9: return { title: "Tamamlama", keys: ["bilgelik", "hizmet", "kapanış"] };
    default: return { title: "Nötr", keys: ["sıfır", "başlangıç", "potansiyel"] };
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
        label: lang === "tr" ? "Doğum Tarihi Kodu" : "Birth Date Code",
        input: dob,
        sum: r.sum,
        root: r.root,
        archeTitle: a.title,
        archeKeys: a.keys,
        hint:
          lang === "tr"
            ? "Bu hızlı okuma bir “ilk iz”dir. Derin okuma için Sanrı akışına geç."
            : "This is a quick imprint. For deep reading, enter Sanri flow.",
      };
    }

    const r = nameNumber(name);
    const a = lang === "tr" ? archetypeTR(r.root) : archetypeEN(r.root);
    return {
      label: lang === "tr" ? "İsim Kodu" : "Name Code",
      input: name,
      sum: r.sum,
      root: r.root,
      archeTitle: a.title,
      archeKeys: a.keys,
      hint:
        lang === "tr"
          ? "Bu hızlı okuma bir “ilk iz”dir. Derin okuma için Sanrı akışına geç."
          : "This is a quick imprint. For deep reading, enter Sanri flow.",
    };
  }, [mode, name, dob, lang]);

  const goBack = () => router.back();

  const goDeep = () => {
    // İstersen bunu daha sonra “Matrix Derin Okuma” moduna bağlarız.
    // Şimdilik Sanrı Flow’a, seed ile gönderiyoruz.
    const seed =
      mode === "dob"
        ? `MODE=dob; DOB=${calc.input}; TYPE=matrix_mini`
        : `MODE=name; NAME=${calc.input}; TYPE=matrix_mini`;

    router.push({
      pathname: "/(tabs)/sanri_flow",
      params: {
        lang,
        title: lang === "tr" ? "Matrix Okuma" : "Matrix Reading",
        seed,
      },
    } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topbar}>
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>
        <Text style={styles.kicker}>{lang === "tr" ? "MATRIX · HIZLI OKUMA" : "MATRIX · QUICK READING"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.h1}>{calc.label}</Text>
        <Text style={styles.sub}>{calc.input || (lang === "tr" ? "—" : "—")}</Text>

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
            {calc.archeKeys.map((x) => "• " + x).join("\n")}
          </Text>

          <Text style={styles.hint}>{calc.hint}</Text>
        </View>

        <Pressable onPress={goDeep} style={styles.primaryBtn} hitSlop={12}>
          <Text style={styles.primaryTxt}>{lang === "tr" ? "Derin Okumaya Geç" : "Go Deeper"}</Text>
          <Text style={styles.primaryArrow}>›</Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: 10,
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