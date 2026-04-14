import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { MODULES, ALL_LESSONS, type Module, type Lesson } from "../../lib/kodOkumaData";
import {
  getProgress,
  countCompleted,
  getPercentage,
  getActiveModuleId,
  getNextIncompleteLesson,
  getModuleProgress,
  type ProgressMap,
} from "../../lib/kodOkumaProgress";
import { hasCodeTrainingAccess } from "../../lib/premium";
import VipWall from "../../components/VipWall";

type Lang = "tr" | "en";

const T = {
  tr: {
    back: "Kapılar",
    header: "SANRI",
    headerSub: "Kod Okuma Sistemi™",
    resumeKicker: "KALDIĞIN YERDEN",
    resumeBtn: "Devam et",
    activeModule: "Aktif modül:",
    completed: "tamamlandı",
    lesson: "DERS",
    lessons: "DERS",
    done: "TAMAMLANDI",
    open: "AÇIK",
    locked: "KİLİTLİ",
    enterLesson: "Derse Gir",
    vipRequired: "VIP gerekli",
  },
  en: {
    back: "Gates",
    header: "SANRI",
    headerSub: "Code Reading System™",
    resumeKicker: "CONTINUE WHERE YOU LEFT",
    resumeBtn: "Continue",
    activeModule: "Active module:",
    completed: "completed",
    lesson: "LESSON",
    lessons: "LESSONS",
    done: "COMPLETED",
    open: "OPEN",
    locked: "LOCKED",
    enterLesson: "Enter Lesson",
    vipRequired: "VIP required",
  },
} as const;

export default function KodOkumaScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isVip, setIsVip] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const t = T[lang];

  const [vipChecked, setVipChecked] = useState(false);

  useEffect(() => {
    getProgress().then(setProgress);
    hasCodeTrainingAccess()
      .then((v) => { setIsVip(Boolean(v)); setVipChecked(true); })
      .catch(() => setVipChecked(true));
  }, []);

  const refreshProgress = useCallback(async () => {
    const p = await getProgress();
    setProgress(p);
  }, []);

  const totalCompleted = countCompleted(progress);
  const totalPercent = getPercentage(progress);
  const activeModuleId = getActiveModuleId(progress);
  const nextLesson = getNextIncompleteLesson(progress);
  const activeModule = MODULES.find((m) => m.id === activeModuleId);

  const onOpenLesson = (lesson: Lesson) => {
    if (!lesson.isFree && !isVip) {
      router.push({ pathname: "/(tabs)/vip", params: { entitlement: "code_training_access", target: "/(tabs)/ust_bilinc" } } as any);
      return;
    }
    router.push({
      pathname: "/(tabs)/kod_ders",
      params: { lessonId: lesson.id, lang },
    } as any);
  };

  const onResume = () => {
    if (nextLesson) onOpenLesson(nextLesson);
  };

  const toggleModule = (modId: number) => {
    setExpandedModule((prev) => (prev === modId ? null : modId));
  };

  const getLessonStatus = (lesson: Lesson): "done" | "open" | "locked" => {
    if (progress[lesson.id]) return "done";
    if (lesson.isFree || isVip) return "open";
    return "locked";
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar */}
      <View style={styles.topbar}>
        <Pressable
          onPress={() => router.replace("/(tabs)/gates")}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLbl}>{t.back}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.langRow}>
          {(["tr", "en"] as const).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLang(l)}
              style={[styles.langChip, lang === l && styles.langChipActive]}
              hitSlop={10}
            >
              <Text style={[styles.langTxt, lang === l && styles.langTxtActive]}>
                {l.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {vipChecked && !isVip ? (
        <View style={{ flex: 1 }}>
          <VipWall
            title="Kod Okuma Sistemi"
            message={"Bu alan Kod Eğitimi erişimi gerektirir.\nTüm derslere ve modüllere erişmek için Kod Eğitimi'ni aç."}
            entitlement="code_training_access"
            targetAfterPurchase="/(tabs)/ust_bilinc"
          />
        </View>
      ) : (
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{t.header}</Text>
          <Text style={styles.headerSub}>{t.headerSub}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.max(totalPercent, 2)}%` }]} />
          </View>
          <View style={styles.progressInfoRow}>
            <Text style={styles.progressText}>
              {totalCompleted}/{ALL_LESSONS.length} {t.completed} · %{totalPercent}
            </Text>
            <View style={styles.activeModuleBadge}>
              <Text style={styles.activeModuleText}>
                {t.activeModule}{" "}
                <Text style={styles.activeModuleName}>
                  {lang === "tr" ? activeModule?.titleTR.split(" — ")[1] : activeModule?.titleEN.split(" — ")[1]}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Resume Card */}
        {nextLesson && (
          <Pressable onPress={onResume} style={styles.resumeCard}>
            <Text style={styles.resumeKicker}>{t.resumeKicker}</Text>
            <Text style={styles.resumeTitle}>
              {t.lesson} {ALL_LESSONS.indexOf(nextLesson) + 1}: {nextLesson.title}
            </Text>
            <Text style={styles.resumeDesc}>{nextLesson.shortDescription}</Text>
            <View style={styles.resumeBtnWrap}>
              <Text style={styles.resumeBtnText}>{t.resumeBtn}</Text>
            </View>
          </Pressable>
        )}

        {/* Module Cards */}
        <View style={styles.modulesRow}>
          {MODULES.map((mod) => {
            const mp = getModuleProgress(mod.id, progress);
            const isActive = mod.id === activeModuleId;
            return (
              <Pressable
                key={mod.id}
                onPress={() => toggleModule(mod.id)}
                style={[styles.moduleCard, isActive && styles.moduleCardActive]}
              >
                <Text style={styles.moduleIcon}>{mod.icon}</Text>
                <Text style={styles.moduleTitle} numberOfLines={2}>
                  {lang === "tr" ? mod.titleTR : mod.titleEN}
                </Text>
                <Text style={styles.moduleSub} numberOfLines={3}>
                  {lang === "tr" ? mod.subtitleTR : mod.subtitleEN}
                </Text>
                <Text style={styles.moduleLessonCount}>
                  {mod.lessons.length} {t.lessons}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Expanded Module — Lesson List */}
        {MODULES.map((mod) => {
          if (expandedModule !== mod.id && mod.id !== activeModuleId) return null;
          const mp = getModuleProgress(mod.id, progress);

          return (
            <View key={`list-${mod.id}`} style={styles.lessonSection}>
              <View style={styles.lessonSectionHeader}>
                <View style={styles.lessonSectionIconWrap}>
                  <Text style={styles.lessonSectionIcon}>{mod.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lessonSectionTitle}>
                    {lang === "tr" ? mod.titleTR : mod.titleEN}
                  </Text>
                  <Text style={styles.lessonSectionSub}>
                    {lang === "tr" ? mod.subtitleTR : mod.subtitleEN}
                  </Text>
                </View>
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{mp.percent}%</Text>
                </View>
              </View>

              <View style={styles.lessonGrid}>
                {mod.lessons.map((lesson, idx) => {
                  const status = getLessonStatus(lesson);
                  const globalIdx = ALL_LESSONS.indexOf(lesson) + 1;
                  return (
                    <Pressable
                      key={lesson.id}
                      onPress={() => onOpenLesson(lesson)}
                      style={styles.lessonCard}
                    >
                      <View style={styles.lessonTopRow}>
                        <Text style={styles.lessonNumber}>
                          {String(globalIdx).padStart(2, "0")}
                        </Text>
                        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                      </View>
                      <Text style={styles.lessonTitle} numberOfLines={2}>
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonDesc} numberOfLines={2}>
                        {lesson.shortDescription}
                      </Text>
                      <View style={styles.lessonFooter}>
                        <Text
                          style={[
                            styles.lessonStatus,
                            status === "done" && styles.statusDone,
                            status === "open" && styles.statusOpen,
                            status === "locked" && styles.statusLocked,
                          ]}
                        >
                          {status === "done" ? t.done : status === "open" ? t.open : t.locked}
                        </Text>
                        {status !== "locked" && (
                          <View style={styles.lessonEnterBtn}>
                            <Text style={styles.lessonEnterText}>{t.enterLesson}</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

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
  backArrow: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  backLbl: { color: "rgba(255,255,255,0.75)", fontWeight: "800" },
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
  langTxt: { color: "rgba(255,255,255,0.7)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  content: { padding: 16, paddingTop: 4 },

  /* Header */
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginBottom: 16,
  },
  headerTitle: { color: "#7cf7d8", fontSize: 22, fontWeight: "900", letterSpacing: 2 },
  headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: "700" },

  /* Progress */
  progressSection: { marginBottom: 16 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#7cf7d8",
  },
  progressInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  progressText: { color: "rgba(255,255,255,0.60)", fontSize: 13 },
  activeModuleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  activeModuleText: { color: "rgba(255,255,255,0.60)", fontSize: 12 },
  activeModuleName: { color: "#7cf7d8", fontWeight: "900" },

  /* Resume Card */
  resumeCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    backgroundColor: "rgba(94,59,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  resumeKicker: {
    color: "#7cf7d8",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  resumeTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginBottom: 6 },
  resumeDesc: { color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 20, marginBottom: 14 },
  resumeBtnWrap: {
    alignSelf: "flex-end",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  resumeBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },

  /* Module Cards Row */
  modulesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  moduleCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    minHeight: 150,
  },
  moduleCardActive: {
    borderColor: "rgba(124,247,216,0.30)",
    backgroundColor: "rgba(94,59,255,0.12)",
  },
  moduleIcon: { color: "#7cf7d8", fontSize: 22, marginBottom: 10 },
  moduleTitle: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", marginBottom: 6, lineHeight: 17 },
  moduleSub: { color: "rgba(255,255,255,0.55)", fontSize: 11, lineHeight: 15, marginBottom: 8 },
  moduleLessonCount: { color: "#7cf7d8", fontSize: 12, fontWeight: "900", letterSpacing: 1 },

  /* Lesson Section */
  lessonSection: { marginBottom: 20 },
  lessonSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  lessonSectionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.10)",
  },
  lessonSectionIcon: { color: "#7cf7d8", fontSize: 20 },
  lessonSectionTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  lessonSectionSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2, lineHeight: 16 },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(124,247,216,0.10)",
  },
  percentText: { color: "#7cf7d8", fontSize: 13, fontWeight: "900" },

  /* Lesson Cards Grid */
  lessonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  lessonCard: {
    width: "48%" as any,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    minHeight: 160,
    justifyContent: "space-between",
  },
  lessonTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lessonNumber: { color: "#7cf7d8", fontSize: 22, fontWeight: "900" },
  lessonDuration: { color: "rgba(255,255,255,0.45)", fontSize: 12 },
  lessonTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 4, lineHeight: 20 },
  lessonDesc: { color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 16, marginBottom: 10 },
  lessonFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonStatus: { fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  statusDone: { color: "#7cf7d8" },
  statusOpen: { color: "rgba(203,188,255,0.90)" },
  statusLocked: { color: "rgba(255,255,255,0.30)" },
  lessonEnterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  lessonEnterText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});
