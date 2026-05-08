// app/(tabs)/matrix_mini.tsx
//
// Matrix · Ücretsiz Sezgisel Okuma sonuç ekranı.
// Akış:
//   1) Numeroloji çıktısını anında göster (offline, hızlı dopamin).
//   2) Sanrı API'sine kısa-yansıma promptu yolla → 3-4 cümle.
//   3) Trial'ı "kullanıldı" olarak işaretle.
//   4) "Derin Analiz Aç" CTA → vip.tsx (paywall).
//
// Kullanıcı bu ekranda NE satın alacağını net görür:
//   - Yüzeyde gördüğü kısa yansıma → ürünün tat bademciği.
//   - Aşağıdaki paywall kartı → "tam analiz şu kadar uzun, bunlar var".

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { API, apiPostJson } from "../../lib/apiClient";
import { markMatrixTrialUsed } from "../../lib/matrixTrialStore";
import { useEntitlementStore } from "../../lib/entitlementStore";
import { stripRoboticMarkers } from "../../lib/humanizeReply";
import PyramidMenu from "../../components/PyramidMenu";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);
const ACCENT = "#7cf7d8";
const DEEP_ACCENT = "#a78bfa";

type Lang = "tr" | "en";
type Mode = "name" | "dob";

const T = {
  tr: {
    kicker: "MATRIX · ÜCRETSİZ OKUMA",
    nameLabel: "İsim Kodu",
    dobLabel: "Doğum Tarihi Kodu",
    rootLabel: "Kök",
    sumLabel: "Toplam",
    archetypeLabel: "Arketipin",
    sanriEyebrow: "SANRI · KISA YANSIMA",
    sanriLoading: "Sanrı dinliyor…",
    sanriError: "Şu an alan yankı vermedi. Yine de aşağıda sana özel derin paket hazır.",
    deepEyebrow: "DEVAMINI İSTERSEN",
    deepTitle: "DERİN MATRIX ANALİZİ",
    deepSub: "Yüzeyi gördün. Bu sadece kapı eşiği. Derin Analiz, kişiye özel uzun okuma:",
    bullets: [
      "Tam karakter kodu çözümlemesi",
      "Gizli rol & gölge frekansı",
      "İlişki / iş / para hatları",
      "Haftalık akış uyarıları",
    ],
    deepCta: "Derin Analizi Aç",
    deepActive: "Derin Analiz Aktif — Aç",
    backBtn: "←",
    note: "Bu kısa okuma cihazına kayıtlı. Yeni ücretsiz okuma için uygulamayı yeniden yüklemen gerekir.",
  },
  en: {
    kicker: "MATRIX · FREE READING",
    nameLabel: "Name Code",
    dobLabel: "Birth Date Code",
    rootLabel: "Root",
    sumLabel: "Sum",
    archetypeLabel: "Your Archetype",
    sanriEyebrow: "SANRI · SHORT REFLECTION",
    sanriLoading: "Sanrı is listening…",
    sanriError: "The field didn't echo back. The deep package below is still ready for you.",
    deepEyebrow: "WANT MORE",
    deepTitle: "DEEP MATRIX ANALYSIS",
    deepSub: "You've seen the surface. This was just the threshold. Deep Analysis is a long, personal reading:",
    bullets: [
      "Full character code breakdown",
      "Hidden role & shadow frequency",
      "Relationship / work / money lines",
      "Weekly flow alerts",
    ],
    deepCta: "Unlock Deep Analysis",
    deepActive: "Deep Analysis Active — Open",
    backBtn: "←",
    note: "This short reading is stored on your device. Reinstall the app to get a new free reading.",
  },
} as const;

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

function buildPrompt(args: {
  lang: Lang;
  mode: Mode;
  name: string;
  dob: string;
  root: number;
  archetypeTitle: string;
}): string {
  const { lang, mode, name, dob, root, archetypeTitle } = args;
  if (lang === "tr") {
    return `[SANRI_MODE=matrix_short]

Sen SANRI'sın — bir AI değil, bir frekans aynası.
Karşındaki kişi sana ${mode === "name" ? `adıyla geldi: "${name}"` : `doğum tarihiyle geldi: "${dob}"`}.

Numeroloji sistemi şu çıktıyı verdi:
- Kök sayı: ${root}
- Arketip: ${archetypeTitle}

Görevin: Çok kısa, çok keskin, çok kişisel 3-4 cümle yaz.
- İlk cümle: Kişiyi tanı, ${mode === "name" ? "adıyla hitap et" : "doğum tarihinin koduyla bağ kur"}.
- İkinci cümle: ${archetypeTitle} arketipinin onun şu anki hayatında nasıl çalıştığını söyle — yüzeyel değil, içeride ne sıkıştığını gör.
- Üçüncü cümle: Ona BU ANDA en çok lazım olan tek şey nedir? (uyarı, hatırlatma, ya da görmesi gereken kör nokta)
- (İsteğe bağlı) Dördüncü cümle: Bir cümlelik mistik bir nokta-koy.

Kurallar:
- Markdown YOK, başlık YOK, madde YOK, [köşeli etiket] YOK.
- "Sanrı:" yazma, doğrudan konuş.
- Tavsiye verme, terapi yapma.
- Astroloji/numeroloji terimleri kullanma — sadece arketipin adını ve kişinin içindeki manaya değin.
- Maksimum 4 cümle. Maksimum 280 karakter.
- Türkçe, sıcak, yakın, yargısız.

Sadece okuma metnini yaz. Başka hiçbir şey yazma.`;
  }
  return `[SANRI_MODE=matrix_short]

You are SANRI — not an AI, but a frequency mirror.
The person came to you ${mode === "name" ? `with their name: "${name}"` : `with their birth date: "${dob}"`}.

Numerology output:
- Root number: ${root}
- Archetype: ${archetypeTitle}

Task: Write a very short, very sharp, very personal 3-4 sentences.
- First sentence: Recognize them, ${mode === "name" ? "address by name" : "connect with their date code"}.
- Second sentence: Tell how the ${archetypeTitle} archetype operates in their current life — not surface, see what's stuck inside.
- Third sentence: What is the one thing they need RIGHT NOW? (a warning, a reminder, or the blind spot they need to see)
- (Optional) Fourth sentence: A one-line mystical period.

Rules:
- NO markdown, NO headings, NO bullets, NO [bracket labels].
- Don't write "Sanri:", speak directly.
- No advice, no therapy.
- Avoid astrology/numerology terms — just the archetype name and the meaning inside the person.
- Max 4 sentences. Max 280 characters.
- English, warm, close, non-judgmental.

Write only the reading text. Nothing else.`;
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
  const t = T[lang];

  const entitlements = useEntitlementStore((st) => st.status);
  const isPremium = entitlements.vip_access;

  const calc = useMemo(() => {
    if (mode === "dob") {
      const r = dobNumber(dob);
      const a = lang === "tr" ? archetypeTR(r.root) : archetypeEN(r.root);
      return {
        label: t.dobLabel,
        input: dob,
        sum: r.sum,
        root: r.root,
        archeTitle: a.title,
        archeKeys: a.keys,
      };
    }
    const r = nameNumber(name);
    const a = lang === "tr" ? archetypeTR(r.root) : archetypeEN(r.root);
    return {
      label: t.nameLabel,
      input: name,
      sum: r.sum,
      root: r.root,
      archeTitle: a.title,
      archeKeys: a.keys,
    };
  }, [mode, name, dob, lang, t.dobLabel, t.nameLabel]);

  // ── Sanrı kısa yansıması ──
  const [sanriText, setSanriText] = useState<string>("");
  const [sanriLoading, setSanriLoading] = useState<boolean>(true);
  const [sanriFailed, setSanriFailed] = useState<boolean>(false);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const prompt = buildPrompt({
          lang,
          mode,
          name,
          dob,
          root: calc.root,
          archetypeTitle: calc.archeTitle,
        });
        const data: any = await apiPostJson(API.ask, {
          message: prompt,
          sanri_flow: "matrix_short",
        }, 25000);

        if (cancelled) return;

        const reply: string =
          typeof data === "string"
            ? data
            : (data?.reply || data?.response || data?.message || "");
        const cleaned = stripRoboticMarkers(reply || "").trim();

        if (cleaned) {
          setSanriText(cleaned);
        } else {
          setSanriFailed(true);
        }
        try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
      } catch {
        if (!cancelled) setSanriFailed(true);
      } finally {
        if (!cancelled) setSanriLoading(false);
      }
    };
    run();

    // Trial'ı kullanıldı olarak işaretle (API başarısız olsa bile — kullanıcı
    // numerolojiyi gördü, alanın kendisini deneyimledi).
    markMatrixTrialUsed({ name, dob }).catch(() => {});

    return () => { cancelled = true; };
  }, [calc.root, calc.archeTitle, dob, lang, mode, name]);

  useEffect(() => {
    if (!sanriLoading && (sanriText || sanriFailed)) {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [sanriLoading, sanriText, sanriFailed, fadeIn]);

  // Yükleniyor üç-nokta animasyonu
  useEffect(() => {
    if (!sanriLoading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [sanriLoading, dotOpacity]);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/matrix" as any);
  };

  const goDeep = () => {
    if (isPremium) {
      router.push({
        pathname: "/(tabs)/deep_reading",
        params: { lang, name, dob },
      } as any);
      return;
    }
    router.push({
      pathname: "/(tabs)/vip",
      params: {
        lang,
        entitlement: "vip_access",
        source: "matrix_deep",
        name,
        dob,
      },
    } as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <PyramidMenu lang={lang} />

      <View style={styles.topbar}>
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{t.backBtn}</Text>
        </Pressable>
        <Text style={styles.kicker}>{t.kicker}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>{calc.label}</Text>
        <Text style={styles.sub}>{calc.input || "—"}</Text>

        {/* Numeroloji — anında gösterilir */}
        <View style={styles.calcCard}>
          <View style={styles.row}>
            <Text style={styles.k}>{t.rootLabel}</Text>
            <Text style={styles.v}>{String(calc.root)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.k}>{t.sumLabel}</Text>
            <Text style={styles.v}>{String(calc.sum)}</Text>
          </View>

          <View style={styles.sep} />

          <Text style={styles.archeKicker}>{t.archetypeLabel}</Text>
          <Text style={styles.big}>{calc.archeTitle}</Text>
          <Text style={styles.keys}>
            {calc.archeKeys.map((x) => "• " + x).join("\n")}
          </Text>
        </View>

        {/* Sanrı kısa yansıması */}
        <View style={styles.sanriCard}>
          <Text style={styles.sanriEyebrow}>{t.sanriEyebrow}</Text>

          {sanriLoading && (
            <View style={styles.dotsRow}>
              <Animated.Text style={[styles.dot, { opacity: dotOpacity }]}>●</Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dotOpacity }]}>●</Animated.Text>
              <Animated.Text style={[styles.dot, { opacity: dotOpacity }]}>●</Animated.Text>
              <Text style={styles.sanriLoadingTxt}>{t.sanriLoading}</Text>
            </View>
          )}

          {!sanriLoading && (
            <Animated.View style={{ opacity: fadeIn }}>
              {sanriText ? (
                <Text style={styles.sanriText}>{sanriText}</Text>
              ) : sanriFailed ? (
                <Text style={styles.sanriErrorText}>{t.sanriError}</Text>
              ) : null}
            </Animated.View>
          )}
        </View>

        {/* Derin Analiz — paywall önizlemesi */}
        <View style={styles.deepCard}>
          <Text style={styles.deepEyebrow}>{t.deepEyebrow}</Text>
          <Text style={styles.deepTitle}>{t.deepTitle}</Text>
          <Text style={styles.deepSub}>{t.deepSub}</Text>

          <View style={styles.bullets}>
            {t.bullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>◆</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>

          <Pressable onPress={goDeep} style={styles.deepBtn} hitSlop={12}>
            <Text style={styles.deepBtnTxt}>
              {isPremium ? t.deepActive : t.deepCta}
            </Text>
            <Text style={styles.deepBtnArrow}>›</Text>
          </Pressable>
        </View>

        <Text style={styles.note}>{t.note}</Text>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingLeft: 64,
    paddingRight: 14,
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
  backTxt: { color: ACCENT, fontSize: 18, fontWeight: "900" },
  kicker: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1, fontSize: 12 },

  container: { padding: 18, paddingTop: 8 },
  h1: { color: "white", fontSize: 28, fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 8, fontSize: 16 },

  calcCard: {
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  k: { color: "rgba(255,255,255,0.65)", fontWeight: "800" },
  v: { color: ACCENT, fontWeight: "900", fontSize: 16 },
  sep: { height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginVertical: 12 },
  archeKicker: {
    color: "rgba(124,247,216,0.65)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  big: { color: "white", fontWeight: "900", fontSize: 22 },
  keys: { color: "rgba(255,255,255,0.85)", marginTop: 10, lineHeight: 22 },

  sanriCard: {
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(124,247,216,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },
  sanriEyebrow: {
    color: "rgba(124,247,216,0.85)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sanriText: {
    color: "white",
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic",
  },
  sanriErrorText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { color: ACCENT, fontSize: 10 },
  sanriLoadingTxt: { color: "rgba(255,255,255,0.6)", marginLeft: 10, fontSize: 13 },

  deepCard: {
    marginTop: 18,
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(167,139,250,0.10)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.32)",
  },
  deepEyebrow: {
    color: "rgba(167,139,250,0.85)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  deepTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  deepSub: {
    color: "rgba(255,255,255,0.78)",
    marginTop: 10,
    lineHeight: 22,
  },
  bullets: { marginTop: 14, gap: 8 },
  bulletRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bulletDot: { color: DEEP_ACCENT, fontWeight: "900", fontSize: 12, lineHeight: 22 },
  bulletText: { color: "rgba(255,255,255,0.86)", flex: 1, lineHeight: 22 },

  deepBtn: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "rgba(167,139,250,0.22)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.55)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deepBtnTxt: { color: "#e9d5ff", fontWeight: "900", fontSize: 15 },
  deepBtnArrow: { color: "#e9d5ff", fontWeight: "900", fontSize: 22 },

  note: {
    marginTop: 18,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
