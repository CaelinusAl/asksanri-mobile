import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import {
  ANKOD_COMMENTARY_URL,
  AnkodCategoryId,
  AnkodStepId,
  CATEGORIES,
  DEEP_SECTIONS,
  STEP_ORDER,
  buildLines,
  buildLocalDeep,
  buildLocalReading,
  getQuestionText,
  getStepOptions,
} from "../../lib/ankodData";
import { storageGet, storageSet } from "../../lib/storage";
import { hasVipEntitlement } from "../../lib/premium";
import VipWall from "../../components/VipWall";

const ACCENT = "#7cf7d8";
const BG = "#0a0b10";
const COMPLETED_KEY = "sanri_ankod_completed_quizzes";
const SNAPSHOT_KEY = "sanri_ankod_snapshot";

type FlowState = "categories" | "questions" | "loading" | "result";

export default function AnkodScreen() {
  const { user } = useAuth();

  const [flow, setFlow] = useState<FlowState>("categories");
  const [category, setCategory] = useState<AnkodCategoryId | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reading, setReading] = useState("");
  const [deepSections, setDeepSections] = useState<Record<string, string>>({});
  const [completedCats, setCompletedCats] = useState<string[]>([]);
  const [teaserLocal, setTeaserLocal] = useState(false);
  const [isVip, setIsVip] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await storageGet(COMPLETED_KEY);
        if (raw) setCompletedCats(JSON.parse(raw));
      } catch { /* ignore */ }
    })();
    hasVipEntitlement().then((v) => setIsVip(Boolean(v))).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (flow === "loading") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [flow, pulseAnim]);

  const currentStep = useMemo(() => STEP_ORDER[stepIdx] as AnkodStepId, [stepIdx]);
  const currentCat = useMemo(() => CATEGORIES.find((c) => c.id === category), [category]);
  const options = useMemo(
    () => (category ? getStepOptions(category, currentStep) : []),
    [category, currentStep]
  );
  const questionText = useMemo(
    () => (category ? getQuestionText(category, currentStep) : ""),
    [category, currentStep]
  );

  const pickCategory = useCallback((id: AnkodCategoryId) => {
    setCategory(id);
    setStepIdx(0);
    setAnswers({});
    setReading("");
    setDeepSections({});
    setTeaserLocal(false);
    setFlow("questions");
  }, []);

  const pickOption = useCallback(
    async (optionId: string) => {
      const next = { ...answers, [currentStep]: optionId };
      setAnswers(next);

      if (stepIdx < STEP_ORDER.length - 1) {
        setStepIdx(stepIdx + 1);
        return;
      }

      if (!category) return;
      setFlow("loading");

      const lines = buildLines(category, next as Record<AnkodStepId, string>);
      let localReading = buildLocalReading(category, next as Record<AnkodStepId, string>);
      let usedLocal = true;

      try {
        const res = await fetch(ANKOD_COMMENTARY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines, mode: "teaser" }),
        });
        if (res.ok) {
          const json = await res.json();
          const parts: string[] = [];
          if (json?.an_kod) parts.push(String(json.an_kod).trim());
          if (json?.yansitma) parts.push(String(json.yansitma).trim());
          if (parts.length > 0) {
            localReading = parts.join("\n\n");
            usedLocal = false;
          }
        }
      } catch { /* fall back to local */ }

      setReading(localReading);
      setTeaserLocal(usedLocal);

      const localDeep = buildLocalDeep(category, next as Record<AnkodStepId, string>);
      setDeepSections(localDeep);

      try {
        const res = await fetch(ANKOD_COMMENTARY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines, mode: "deep" }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.sections?.ana_tema) {
            const mapped: Record<string, string> = {};
            for (const s of DEEP_SECTIONS) {
              if (json.sections[s.key]) mapped[s.key] = String(json.sections[s.key]).trim();
            }
            if (Object.keys(mapped).length > 0) setDeepSections((prev) => ({ ...prev, ...mapped }));
          }
        }
      } catch { /* keep local deep */ }

      const updated = [...completedCats.filter((c) => c !== category), category];
      setCompletedCats(updated);
      await storageSet(COMPLETED_KEY, JSON.stringify(updated));
      await storageSet(
        SNAPSHOT_KEY,
        JSON.stringify({ categoryId: category, answers: next, lines, reading: localReading, ts: Date.now() })
      );

      setFlow("result");
    },
    [answers, currentStep, stepIdx, category, completedCats]
  );

  const goBack = useCallback(() => {
    if (flow === "questions" && stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else {
      setFlow("categories");
      setCategory(null);
      setStepIdx(0);
      setAnswers({});
    }
  }, [flow, stepIdx]);

  const backLabel = useMemo(() => {
    if (flow === "categories") return "← Kapılar";
    if (flow === "questions" && stepIdx === 0) return "← Kategoriler";
    if (flow === "questions") return "← Önceki soru";
    return "← Kategoriler";
  }, [flow, stepIdx]);

  const handleBack = useCallback(() => {
    if (flow === "categories") router.back();
    else goBack();
  }, [flow, goBack]);

  // ─── CATEGORIES ───
  if (flow === "categories") {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={s.scroll} contentContainerStyle={s.pad}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Text style={s.back}>{backLabel}</Text>
          </Pressable>

          <Text style={s.eyebrow}>AN-KOD</Text>
          <Text style={s.heroTitle}>Anın kodunu seç</Text>
          <Text style={s.heroSub}>
            Dört alan. Beş hızlı soru. Sana özel bir yansıma — tamamı değil, bir giriş.
          </Text>

          {CATEGORIES.map((cat) => {
            const done = completedCats.includes(cat.id);
            return (
              <Pressable
                key={cat.id}
                style={[s.catCard, { borderColor: cat.accent }]}
                onPress={() => pickCategory(cat.id)}
              >
                <View style={s.catTop}>
                  <Text style={[s.catGlyph, { color: cat.accent }]}>{cat.glyph}</Text>
                  <Text style={[s.catTitle, { color: cat.accent }]}>{cat.title}</Text>
                  {done && <Text style={s.catDone}>Yapıldı</Text>}
                </View>
                <Text style={s.catBlurb}>{cat.blurb}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // ─── QUESTIONS ───
  if (flow === "questions") {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={s.scroll} contentContainerStyle={s.pad}>
          <Pressable onPress={handleBack} hitSlop={12}>
            <Text style={s.back}>{backLabel}</Text>
          </Pressable>

          <Text style={s.eyebrow}>
            {currentCat?.glyph} {currentCat?.title?.toUpperCase()}
          </Text>
          <Text style={s.stepCounter}>
            {stepIdx + 1} / {STEP_ORDER.length}
          </Text>

          <Text style={s.qText}>{questionText}</Text>

          {options.map((opt) => {
            const selected = answers[currentStep] === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={[
                  s.optBtn,
                  selected && { borderColor: currentCat?.accent || ACCENT },
                  opt.color ? { borderLeftWidth: 4, borderLeftColor: opt.color } : undefined,
                ]}
                onPress={() => pickOption(opt.id)}
              >
                {opt.icon ? <Text style={s.optIcon}>{opt.icon}</Text> : null}
                <Text style={s.optLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  // ─── LOADING ───
  if (flow === "loading") {
    return (
      <View style={[s.screen, s.center]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Animated.Text style={[s.loadGlyph, { opacity: pulseAnim }]}>
          {currentCat?.glyph || "✧"}
        </Animated.Text>
        <ActivityIndicator color={ACCENT} style={{ marginTop: 18 }} />
        <Text style={s.loadText}>SANRI kodunu yazıyor…</Text>
      </View>
    );
  }

  // ─── RESULT ───
  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={s.scroll} contentContainerStyle={s.pad}>
        <Pressable onPress={() => { setFlow("categories"); setCategory(null); }} hitSlop={12}>
          <Text style={s.back}>← Kategoriler</Text>
        </Pressable>

        <Text style={s.resultTag}>
          SANRI · {currentCat?.title} · ön okuma
        </Text>

        {teaserLocal && (
          <View style={s.localBanner}>
            <Text style={s.localBannerTitle}>SANRI İNZİVADA</Text>
            <Text style={s.localBannerText}>
              Sunucu yorumu şimdilik gelmedi; aşağıdaki ön okuma yerelde üretildi.
            </Text>
          </View>
        )}

        <View style={s.readingCard}>
          <Text style={s.readingText}>{reading}</Text>
        </View>

        <Text style={s.sectionDivider}>Derin Okuma</Text>

        {isVip ? (
          DEEP_SECTIONS.map((sec) => (
            <View key={sec.key} style={s.deepCard}>
              <Text style={s.deepIcon}>{sec.icon}</Text>
              <Text style={s.deepTitle}>{sec.title}</Text>
              <Text style={s.deepText}>{deepSections[sec.key] || "—"}</Text>
            </View>
          ))
        ) : (
          <VipWall
            title="Derin Okuma — VIP"
            message={"Ön okumayı gördün.\nDerin katmanlara inmek için VIP erişim gerekli."}
            entitlement="vip_access"
            targetAfterPurchase="/(tabs)/ankod"
          />
        )}

        <Pressable
          style={s.ctaBtn}
          onPress={() => { setFlow("categories"); setCategory(null); }}
        >
          <Text style={s.ctaText}>Başka bir alanı tara</Text>
        </Pressable>

        <Pressable style={s.secondaryBtn} onPress={() => router.back()}>
          <Text style={s.secondaryText}>Kütüphane'ye dön</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  pad: { padding: 18, paddingTop: 28, paddingBottom: 80 },
  center: { alignItems: "center", justifyContent: "center" },
  back: { color: ACCENT, fontSize: 15, fontWeight: "700", marginBottom: 20 },
  eyebrow: { color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: 2.5, marginBottom: 6 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 8 },
  heroSub: { color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 20, marginBottom: 24 },

  catCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
  },
  catTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  catGlyph: { fontSize: 22 },
  catTitle: { fontSize: 18, fontWeight: "800" },
  catDone: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: "auto" },
  catBlurb: { color: "rgba(255,255,255,0.5)", fontSize: 13 },

  stepCounter: { color: ACCENT, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  qText: { color: "#fff", fontSize: 22, fontWeight: "800", lineHeight: 30, marginBottom: 24 },

  optBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optIcon: { fontSize: 22 },
  optLabel: { color: "#fff", fontSize: 16, fontWeight: "700" },

  loadGlyph: { color: ACCENT, fontSize: 48, textAlign: "center" },
  loadText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 14, textAlign: "center" },

  resultTag: { color: ACCENT, fontSize: 12, letterSpacing: 1.5, fontWeight: "700", marginBottom: 16 },

  localBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "rgba(234,179,8,0.12)",
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.3)",
  },
  localBannerTitle: { color: "#eab308", fontSize: 13, fontWeight: "800", marginBottom: 4 },
  localBannerText: { color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 17 },

  readingCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  readingText: { color: "#fff", fontSize: 15, lineHeight: 24, fontWeight: "500" },

  sectionDivider: { color: ACCENT, fontSize: 14, fontWeight: "800", letterSpacing: 1.5, marginBottom: 14 },

  deepCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  deepIcon: { fontSize: 18, marginBottom: 4 },
  deepTitle: { color: ACCENT, fontSize: 13, fontWeight: "800", letterSpacing: 1, marginBottom: 6 },
  deepText: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 21 },

  ctaBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: ACCENT,
  },
  ctaText: { color: BG, fontSize: 15, fontWeight: "900" },

  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  secondaryText: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "700" },
});
