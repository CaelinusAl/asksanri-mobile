import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { getLessonById, getNextLesson, getModuleForLesson, ALL_LESSONS } from "../../lib/kodOkumaData";
import { markComplete } from "../../lib/kodOkumaProgress";
import { API, apiPostJson } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";

type Lang = "tr" | "en";

const MODULE_HINTS: Record<number, { tr: { sub: string; placeholder: string }; en: { sub: string; placeholder: string } }> = {
  1: {
    tr: { sub: "Bir kelime, isim veya kavram gir — SANRI kodu okusun.", placeholder: "Bir kelime veya isim yaz… (örn: Titanic, Selin, Özgürlük)" },
    en: { sub: "Enter a word, name or concept — let SANRI read its code.", placeholder: "Write a word or name… (e.g. Titanic, your name, Freedom)" },
  },
  2: {
    tr: { sub: "Bir ilişki, durum veya kişi yaz — SANRI ilişki kodunu okusun.", placeholder: "Bir ilişki veya durumu anlat… (örn: annemle ilişkim, terk edilme korkum)" },
    en: { sub: "Describe a relationship or situation — let SANRI read the code.", placeholder: "Describe a relationship… (e.g. my relationship with my mother)" },
  },
  3: {
    tr: { sub: "Bir olay, haber veya hayat durumu yaz — SANRI matrixi okusun.", placeholder: "Bir olay veya durum yaz… (örn: iş değişikliği, bir haber, tekrarlayan rüya)" },
    en: { sub: "Enter an event or life situation — let SANRI read the matrix.", placeholder: "Describe an event… (e.g. career change, a recurring dream)" },
  },
};

const T = {
  tr: {
    back: "← Modüller",
    lesson: "DERS",
    duration: "Süre:",
    markDone: "Dersi Tamamla ✓",
    marked: "Tamamlandı ✓",
    nextLesson: "Sonraki Ders →",
    sanriTitle: "SANRI ile Çöz",
    sanriSend: "Kodu Oku",
    sanriReading: "SANRI kod okuyor…",
    output: "KOD OKUMASI",
    backToModules: "Modüllere Dön",
  },
  en: {
    back: "← Modules",
    lesson: "LESSON",
    duration: "Duration:",
    markDone: "Complete Lesson ✓",
    marked: "Completed ✓",
    nextLesson: "Next Lesson →",
    sanriTitle: "Solve with SANRI",
    sanriSend: "Read the Code",
    sanriReading: "SANRI is reading the code…",
    output: "CODE READING",
    backToModules: "Back to Modules",
  },
} as const;

export default function KodDersScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ lessonId?: string; lang?: string }>();
  const lessonId = params.lessonId || "";
  const [lang] = useState<Lang>(params.lang === "en" ? "en" : "tr");

  const lesson = getLessonById(lessonId);
  const mod = getModuleForLesson(lessonId);
  const next = getNextLesson(lessonId);
  const globalIndex = ALL_LESSONS.findIndex((l) => l.id === lessonId) + 1;

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

  const [completed, setCompleted] = useState(false);
  const [sanriInput, setSanriInput] = useState("");
  const [sanriBusy, setSanriBusy] = useState(false);
  const [sanriOutput, setSanriOutput] = useState("");

  const t = T[lang];

  const onMarkDone = useCallback(async () => {
    if (!lesson) return;
    await markComplete(lesson.id);
    setCompleted(true);
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
  }, [lesson]);

  const onNext = () => {
    if (!next) return;
    router.replace({
      pathname: "/(tabs)/kod_ders",
      params: { lessonId: next.id, lang },
    } as any);
  };

  const buildPrompt = useCallback((input: string): string => {
    if (!lesson || !mod) return input;

    const moduleId = mod.id;

    if (lang === "tr") {
      const header =
        `[SANRI_MODE=kod_egitmeni]\n` +
        `INTENT: KOD_OKUMA_DERS_${moduleId}\n` +
        `LANG: TR\n` +
        `ROL: Sen SANRI Kod Eğitmeni'sin. Bilgi vermezsin — kodu okutur, katmanı gösterirsin.\n` +
        `KİŞİ: ${nameForPrompt || "Anonim"} (${userEmail || "mail yok"})\n` +
        `NOT: Bu kişiyi tanı ve cevabında ismini kullan. Kişisel hitap et.\n` +
        `MODÜL: ${mod.titleTR}\n` +
        `DERS: ${lesson.title}\n` +
        `DERS_AÇIKLAMA: ${lesson.shortDescription}\n` +
        `KULLANICI_GİRDİSİ: ${input}\n\n`;

      if (moduleId === 1) {
        return header +
          `GÖREV: Kullanıcının girdiği kelime/isim/kavramı KOD OLARAK OKU.\n` +
          `Kelimeyi parçala. Hecelere böl. Her hecenin kökenini, fonetik titreşimini ve anlam katmanını aç.\n` +
          `Yüzey anlamı, alt katman ve derin katmanı ayrı ayrı göster.\n\n` +
          `FORMAT ZORUNLU:\n` +
          `[YÜZEY OKUMA]\nKelimenin/kavramın görünen anlamı. Herkesin bildiği. 2-3 satır.\n\n` +
          `[KOD ÇÖZÜMÜ]\nHecelere ayrılmış hali. Her parçanın kökeni ve taşıdığı anlam.\n` +
          `Fonetik yapı, etimoloji, sayısal karşılık (varsa). Derinlemesine.\n\n` +
          `[DERİN KATMAN]\nBu kodun kişisel yansıması. Kullanıcının girdisiyle bağlantı.\n` +
          `Bu kelime/kavram sana ne anlatıyor? Altında hangi mesaj saklı?\n\n` +
          `[HATIRLATMA]\nTek cümle. Keskin. Dersin özünü veren kapanış.\n\n` +
          `KURAL: Koçluk yapma. Kod oku. Kelimeyi bir cerrah gibi aç.\n` +
          `Her hece bir kapı. Her anlam katmanı bir ayna. Sanrı diliyle yaz.\n`;
      }

      if (moduleId === 2) {
        return header +
          `GÖREV: Kullanıcının girdiği ilişki/durum/kişiyi İLİŞKİ KODU olarak oku.\n` +
          `Döngüyü bul. Tekrar eden kalıbı göster. Karmik bağ mı, travma bağı mı, koruma mekanizması mı?\n` +
          `Dişil-eril dengeyi kontrol et. Duygu motorunu tespit et.\n\n` +
          `FORMAT ZORUNLU:\n` +
          `[İLİŞKİ KODU]\nBu ilişkinin/durumun temel kodu ne? Hangi döngü çalışıyor?\n` +
          `Kısa, net, isabet eden. 3-4 satır.\n\n` +
          `[DÖNGÜ HARİTASI]\nTetik → Tepki → Sonuç zinciri.\n` +
          `Bu döngü nerede başladı? Aile mi, geçmiş ilişki mi, öz-değer mi?\n\n` +
          `[GİZLİ MOTOR]\nBu ilişkiyi/durumu besleyen duygu kodu:\n` +
          `Terk edilme / Değersizlik / Kontrol / Görünmeme — hangisi aktif?\n\n` +
          `[KIRILMA NOKTASI]\nDöngüyü kıran tek müdahale. Somut, uygulanabilir.\n\n` +
          `[HATIRLATMA]\nTek cümle. İlişki kodunun özünü veren kapanış.\n\n` +
          `KURAL: Yüzeysel "iletişim kurun" tavsiyesi verme.\n` +
          `Kodu oku. Döngüyü göster. Motoru açığa çıkar. Sanrı dili: keskin, derin, net.\n`;
      }

      return header +
        `GÖREV: Kullanıcının girdiği olay/durum/haberi MATRİX OKUMASI olarak çöz.\n` +
        `Olayı mesaj olarak oku. Sistemin ne söylediğini göster.\n` +
        `Kişisel matrix'i, kör noktaları ve kırılma noktasını tespit et.\n\n` +
        `FORMAT ZORUNLU:\n` +
        `[OLAY KODU]\nBu olayın/durumun 3 satırda özeti:\n` +
        `Ne oldu? Ne hissettirdi? Ne çağrıştırdı?\n\n` +
        `[MATRİX MESAJI]\nBu olay sana ne diyor? Sistem hangi mesajı veriyor?\n` +
        `Kolektif katman + kişisel katman. Sembolik okuma.\n\n` +
        `[KÖR NOKTA]\nBu olayda görmediğin/görmek istemediğin ne var?\n` +
        `Hangi strateji devrede: meşguliyet, şaka, erteleme, inkâr?\n\n` +
        `[KOD YAZIMI]\nBu olaydan çıkan kişisel kod. Kendi matrixine eklenecek kural/işaret.\n\n` +
        `[HATIRLATMA]\nTek cümle. Matrix okumasının özü.\n\n` +
        `KURAL: Haber yorumu yapma. Matrix oku.\n` +
        `Olay bir mesajdır. Mesajı çöz. Sanrı dili: sistemik, sembolik, keskin.\n`;
    }

    // English
    const header =
      `[SANRI_MODE=kod_egitmeni]\n` +
      `INTENT: KOD_OKUMA_DERS_${moduleId}\n` +
      `LANG: EN\n` +
      `ROLE: You are SANRI Code Trainer. You don't give information — you teach code reading, reveal layers.\n` +
      `PERSON: ${nameForPrompt || "Anonymous"} (${userEmail || "no email"})\n` +
      `NOTE: Recognize this person and address them by name. Make it personal.\n` +
      `MODULE: ${mod.titleEN}\n` +
      `LESSON: ${lesson.title}\n` +
      `LESSON_DESCRIPTION: ${lesson.shortDescription}\n` +
      `USER_INPUT: ${input}\n\n`;

    if (moduleId === 1) {
      return header +
        `TASK: Read the user's word/name/concept AS CODE.\n` +
        `Break the word apart. Split into syllables. Show etymology, phonetic resonance, and meaning layers.\n` +
        `Show surface meaning, sub-layer, and deep layer separately.\n\n` +
        `REQUIRED FORMAT:\n` +
        `[SURFACE READING]\nThe visible meaning. What everyone knows. 2-3 lines.\n\n` +
        `[CODE BREAKDOWN]\nSyllable split. Origin and meaning of each part.\n` +
        `Phonetic structure, etymology, numerical value (if any). Deep analysis.\n\n` +
        `[DEEP LAYER]\nPersonal reflection of this code. Connection to user's input.\n` +
        `What does this word/concept tell you? What message is hidden beneath?\n\n` +
        `[REMINDER]\nOne sentence. Sharp. Closing that captures the lesson's essence.\n\n` +
        `RULE: Don't coach. Read the code. Open each word like a surgeon.\n` +
        `Every syllable is a door. Every meaning layer is a mirror. Write in Sanri voice.\n`;
    }

    if (moduleId === 2) {
      return header +
        `TASK: Read the user's relationship/situation/person AS RELATIONSHIP CODE.\n` +
        `Find the cycle. Show the repeating pattern. Karmic bond, trauma bond, or defense mechanism?\n` +
        `Check feminine-masculine balance. Identify the emotion driver.\n\n` +
        `REQUIRED FORMAT:\n` +
        `[RELATIONSHIP CODE]\nCore code of this relationship/situation. Which cycle is running?\n\n` +
        `[CYCLE MAP]\nTrigger → Reaction → Outcome chain.\n` +
        `Where did this cycle begin? Family, past relationship, or self-worth?\n\n` +
        `[HIDDEN ENGINE]\nThe emotion code feeding this:\n` +
        `Abandonment / Worthlessness / Control / Invisibility — which is active?\n\n` +
        `[BREAKPOINT]\nOne intervention that breaks the cycle. Concrete, actionable.\n\n` +
        `[REMINDER]\nOne sentence. The essence of the relationship code.\n\n` +
        `RULE: No shallow "communicate better" advice. Read the code. Show the cycle. Expose the engine.\n`;
    }

    return header +
      `TASK: Read the user's event/situation/news AS MATRIX READING.\n` +
      `Read the event as a message. Show what the system is saying.\n` +
      `Identify personal matrix, blind spots, and breakpoint.\n\n` +
      `REQUIRED FORMAT:\n` +
      `[EVENT CODE]\n3-line summary: What happened? What did it trigger? What did it evoke?\n\n` +
      `[MATRIX MESSAGE]\nWhat is this event telling you? What message is the system sending?\n` +
      `Collective layer + personal layer. Symbolic reading.\n\n` +
      `[BLIND SPOT]\nWhat are you not seeing / not wanting to see?\n` +
      `Which strategy is active: busyness, humor, procrastination, denial?\n\n` +
      `[CODE WRITING]\nPersonal code from this event. A rule/sign for your own matrix.\n\n` +
      `[REMINDER]\nOne sentence. The essence of the matrix reading.\n\n` +
      `RULE: Don't comment on news. Read the matrix. The event is a message. Decode it.\n`;
  }, [lang, lesson, mod]);

  const onAskSanri = useCallback(async () => {
    const input = sanriInput.trim();
    if (!input || sanriBusy || !lesson) return;

    setSanriBusy(true);
    setSanriOutput("");

    try {
      try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}

      const message = buildPrompt(input);

      const data: any = await apiPostJson(
        API.ask,
        {
          message,
          session_id: "mobile-kod-okuma",
          domain: "ust_bilinc",
          gate_mode: "mirror",
          intent: `KOD_EGITMENI_M${mod?.id || 1}`,
          persona: "user",
        },
        45000
      );

      const answer = String(data?.answer || data?.response || "").trim();
      setSanriOutput(answer || (lang === "tr" ? "Cevap boş döndü." : "Empty response."));
    } catch (e: any) {
      setSanriOutput(String(e?.message || "Hata oluştu."));
    } finally {
      setSanriBusy(false);
    }
  }, [buildPrompt, lang, lesson, mod, sanriBusy, sanriInput]);

  if (!lesson || !mod) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Ders bulunamadı.</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtnAlt}>
            <Text style={styles.backBtnAltText}>{t.backToModules}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Text style={styles.backTxt}>{t.back}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Lesson Header */}
          <Text style={styles.lessonKicker}>
            {t.lesson} {String(globalIndex).padStart(2, "0")}
          </Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonDesc}>{lesson.shortDescription}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{t.duration} {lesson.duration}</Text>
            <Text style={styles.metaModule}>
              {lang === "tr" ? mod.titleTR : mod.titleEN}
            </Text>
          </View>

          {/* Lesson Content */}
          <View style={styles.contentCard}>
            <Text style={styles.contentBody}>
              {lesson.shortDescription}
              {"\n\n"}
              {lang === "tr"
                ? `Bu ders "${lesson.title}" konusunu ele alır.\n\nKod okuma, yüzeydeki bilgiyi değil — altındaki mesajı görmektir.\n\nBu dersin tam içeriği web platformunda mevcuttur. Mobilde SANRI ile kişisel okuma alabilirsin.`
                : `This lesson covers "${lesson.title}".\n\nCode reading is not about surface information — it's about seeing the message beneath.\n\nFull lesson content is available on the web platform. On mobile, you can get a personal reading with SANRI.`}
            </Text>
          </View>

          {/* Mark Complete / Next */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={onMarkDone}
              style={[styles.completeBtn, completed && styles.completeBtnDone]}
              disabled={completed}
            >
              <Text style={[styles.completeBtnText, completed && styles.completeBtnTextDone]}>
                {completed ? t.marked : t.markDone}
              </Text>
            </Pressable>

            {next && (
              <Pressable onPress={onNext} style={styles.nextBtn}>
                <Text style={styles.nextBtnText}>{t.nextLesson}</Text>
              </Pressable>
            )}
          </View>

          {/* SANRI ile Çöz */}
          <View style={styles.sanriCard}>
            <Text style={styles.sanriTitle}>{t.sanriTitle}</Text>
            <Text style={styles.sanriSub}>
              {MODULE_HINTS[mod.id]?.[lang]?.sub || ""}
            </Text>

            <TextInput
              value={sanriInput}
              onChangeText={setSanriInput}
              maxLength={500}
              multiline
              placeholder={MODULE_HINTS[mod.id]?.[lang]?.placeholder || ""}
              placeholderTextColor="rgba(255,255,255,0.30)"
              style={styles.sanriInput}
            />

            <Pressable
              onPress={onAskSanri}
              style={[styles.sanriBtn, (!sanriInput.trim() || sanriBusy) && styles.sanriBtnDisabled]}
              disabled={!sanriInput.trim() || sanriBusy}
            >
              <Text style={styles.sanriBtnText}>
                {sanriBusy ? t.sanriReading : t.sanriSend}
              </Text>
            </Pressable>

            {!!sanriOutput && (
              <View style={styles.sanriOutputCard}>
                <Text style={styles.sanriOutputTitle}>{t.output}</Text>
                <Text style={styles.sanriOutputText}>{sanriOutput}</Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontWeight: "900" },

  content: { padding: 18, paddingTop: 4 },

  lessonKicker: {
    color: "#7cf7d8",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 6,
  },
  lessonTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 8,
  },
  lessonDesc: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  metaText: { color: "rgba(255,255,255,0.50)", fontSize: 13 },
  metaModule: {
    color: "rgba(124,247,216,0.60)",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(124,247,216,0.08)",
    overflow: "hidden",
  },

  contentCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  contentBody: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 16,
    lineHeight: 26,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  completeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.75)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  completeBtnDone: {
    backgroundColor: "rgba(124,247,216,0.15)",
    borderColor: "rgba(124,247,216,0.30)",
  },
  completeBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  completeBtnTextDone: { color: "#7cf7d8" },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  nextBtnText: { color: "rgba(255,255,255,0.80)", fontWeight: "900", fontSize: 15 },

  /* SANRI ile Çöz */
  sanriCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(94,59,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.14)",
  },
  sanriTitle: { color: "#7cf7d8", fontSize: 18, fontWeight: "900", marginBottom: 6 },
  sanriSub: { color: "rgba(255,255,255,0.60)", fontSize: 14, lineHeight: 20, marginBottom: 14 },
  sanriInput: {
    minHeight: 80,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: "top",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  sanriBtn: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.70)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  sanriBtnDisabled: { opacity: 0.4 },
  sanriBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  sanriOutputCard: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  sanriOutputTitle: { color: "#7cf7d8", fontWeight: "900", marginBottom: 10, fontSize: 15 },
  sanriOutputText: { color: "rgba(255,255,255,0.88)", lineHeight: 24, fontSize: 15 },

  /* Empty state */
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  emptyText: { color: "rgba(255,255,255,0.55)", fontSize: 16, marginBottom: 20 },
  backBtnAlt: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  backBtnAltText: { color: "#7cf7d8", fontWeight: "900" },
});
