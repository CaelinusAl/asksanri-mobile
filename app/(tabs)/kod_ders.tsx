import React, { useCallback, useMemo, useState } from "react";
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
import {
  getLessonById,
  getNextLesson,
  getModuleForLesson,
  ALL_LESSONS,
  getLessonDisplayTitle,
  getLessonShortDescription,
} from "../../lib/kodOkumaData";
import { getLessonBody } from "../../lib/kodOkumaLessonBodies";
import { getLessonSanriHints } from "../../lib/kodOkumaSanriHints";
import { markComplete } from "../../lib/kodOkumaProgress";
import { API, apiPostJson } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";

type Lang = "tr" | "en";

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

  const sanriHints = useMemo(() => {
    if (!lesson) return { sub: "", placeholder: "" };
    return getLessonSanriHints(lesson.id, mod?.id ?? 1, lang);
  }, [lesson, mod?.id, lang]);

  const lessonBodyText = useMemo(() => {
    if (!lesson) return "";
    const rich = getLessonBody(lesson.id, lang);
    if (rich) return rich;
    const displayTitle = getLessonDisplayTitle(lesson, lang);
    return lang === "tr"
      ? `Bu derste «${displayTitle}» üzerinde çalışıyorsun. Kod okuma, yüzeydeki bilgiyi değil — altındaki mesajı duymaktır.\n\nAşağıdan SANRI’ya kendi örneğini yazarak bu derse özel kişisel okuma alabilirsin.`
      : `In this lesson you work on "${displayTitle}". Code reading means hearing the message beneath surface information.\n\nBelow, send your own example to SANRI for a reading tailored to this lesson.`;
  }, [lesson, lang]);

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
        `DERS: ${getLessonDisplayTitle(lesson, "tr")}\n` +
        `DERS_AÇIKLAMA: ${getLessonShortDescription(lesson, "tr")}\n` +
        `KULLANICI_GİRDİSİ: ${input}\n\n`;

      if (moduleId === 1) {
        if (lesson.id === "kod-nedir") {
          return header +
            `GÖREV: Ders «Kod Nedir? — Sayıların ritmi». Kod = gerçeğin üstüne giydirilmiş düzen. Sen bilgi vermezsin; yön ve katman gösterirsin. Ton: Sanrı — kişisel, keskin, mistik şişirmeden.\n\n` +
            `Önce girdi türünü ayırt et:\n\n` +
            `(A) Girdi SAYI / TARİH / SAAT / TUTAR ağırlıklıysa: tam sayısal kod okuma.\n` +
            `ZORUNLU: tek/çift; basamaklar; basamak toplamı ve gerekirse indirgeme; tekrar eden rakam (11, 22…); bu ritmin kişiye sembolik vurgusu.\n` +
            `ŞU İKİ SORUYU METNE AÇIKÇA YANSIT: «Bu beni nereye çağırıyor?» / «Bu tekrar neyi hatırlatıyor?»\n\n` +
            `(B) Girdi CÜMLE veya KISA KELİME / KAVRAM ise: yüzeyi söyle; tekrar eden ses, damga, tempo; alt katman; yine yön soruları.\n` +
            `«Kod kutusu» denemesi: mümkünse anlamlı parçalara ayırma ipucu — EN FAZLA 2–3 satır; tam hece/ters/anagram bu derste derinleştirme, bir cümleyle sonraki derslere köprü.\n\n` +
            `(C) Hem sayı hem cümle varsa: kısa köprü — tek düzen altında nasıl konuşuyorlar?\n\n` +
            `FORMAT ZORUNLU:\n` +
            `[YÜZEY OKUMA]\nGörünen katman.\n\n` +
            `[KOD ÇÖZÜMÜ]\n(A) veya (B) veya (C)’ye göre somut parçalar.\n\n` +
            `[YÖN]\nBu girdi kişiyi nereye çağırıyor? (en az bir paragraf)\n\n` +
            `[DERİN KATMAN]\nAlt mesaj — yine mitoloji uydurmadan.\n\n` +
            `[HATIRLATMA]\nTek cümle.\n\n` +
            `KURAL: Öğretme; göster. Düz ansiklopedi yok. Sanrı dili.\n`;
        }
        if (lesson.id === "insan-kod") {
          return header +
            `GÖREV: Ders «İnsan = Kod — Harf ve desen». İnsanı küçültme; yapı ve desen olarak oku. «Taşınan frekans» ihtimalini nazikçe aç: bu korku / «yetmiyorum» hissi kullanıcıya tam mı ait?\n\n` +
            `Girdi isim, lakap, kısa kelime veya tek harf olabilir.\n` +
            `[KOD KUTUSU] Mümkünse bir «Ses + kök» veya anlamlı hece kırılımı dene — örnek kalibre: «Selin → ses + lin» tarzı (tek doğru değil; bir bakış). Uzun kelimede tam ters/anagram üçüncü derste; burada maksimum 4–5 satır parça okuma.\n` +
            `Her harf veya hece için: ses (nefeste nerede), İ/i I/ı ayrımı, komşu harf titreşimi, kısa yön sorusu: Bu ses beni içeride nereye iter?\n\n` +
            `FORMAT ZORUNLU:\n` +
            `[YÜZEY OKUMA]\nGörünen: isim/kelime ve gündelik anlam.\n\n` +
            `[DESEN]\nHata listesi değil; tekrar eden titreşim / desen cümlesi.\n\n` +
            `[KOD ÇÖZÜMÜ]\nKod kutusu + harf-hece katmanı (somut).\n\n` +
            `[TAŞINAN?]\nKısa: Bu his tamamen kişinin mi, yoksa yüklü mü? — yargısız.\n\n` +
            `[DERİN KATMAN]\nKişisel mesaj.\n\n` +
            `[HATIRLATMA]\nTek cümle.\n\n` +
            `KURAL: Koçluk yok; kod okuma. Sanrı dili.\n`;
        }
        if (lesson.id === "kelimeyi-parcalamak") {
          return header +
            `GÖREV: «Kelimeyi Parçalamak ve Aynalama» müfredatı. Bu cevapta ÜÇ ŞEYİ KARIŞTIRMA: (1) heceleme, (2) karakter karakter TERS yazılış, (3) anagram (aynı harf çantası / multiset).\n` +
            `Örnek kalibrasyon: «Mayıs» için TERS (küçük harf birleşik) «sıyam»dır; «sayım» ise TERS değil, ANAGRAMdır (mayıs ve sayım aynı harf çantasını paylaşır) — ikisini ayrı başlıkta göster.\n\n` +
            `ZORUNLU BAŞLIKLAR (SIRA DEĞİŞMEZ, ATLAMA YOK):\n\n` +
            `[NORMALİZASYON]\nKüçük harf, Türkçe i/ı, fazla boşlukları at. Son diziyi göster.\n\n` +
            `[HARFLER TEK TEK]\nTireyle: m-a-y-ı-s gibi. Harf sayısını yaz. Hiç harf atlama.\n\n` +
            `[HECELER]\nTürkçe heceleme ile böl (örn. MA-yıs).\n\n` +
            `[TERS AYNA — TİRELİ]\nUnicode harf sırasını sondan başa tire ile yaz.\n\n` +
            `[TERS AYNA — BİRLEŞİK]\nAynı diziyi boşluksuz birleştir (örn. sıyam).\n\n` +
            `[ANAGRAM — ÇANTA]\nHer harfin adet tablosu (multiset). Bunu açıkça listele.\n\n` +
            `[ANAGRAM — ADAYLAR]\nAynı çantayla yazılabilen anlamlı Türkçe kelimeler varsa yaz; yoksa gerekçelendir.\n\n` +
            `[FARK ÖZETİ]\nTek kısa paragraf: «ters = sıra tersi» / «anagram = aynı harfler farklı sıra».\n\n` +
            `[YÜZEY OKUMA]\nKelimenin gündelik anlamı.\n\n` +
            `[DERİN KATMAN]\nKişisel kod mesajı.\n\n` +
            `[HATIRLATMA]\nTek cümle.\n\n` +
            `KURAL: Anagramı ters yazılış sanma. İkisini ayrı ve kanıtlı göster. Sanrı dili.\n`;
        }
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
      `LESSON: ${getLessonDisplayTitle(lesson, "en")}\n` +
      `LESSON_DESCRIPTION: ${getLessonShortDescription(lesson, "en")}\n` +
      `USER_INPUT: ${input}\n\n`;

    if (moduleId === 1) {
      if (lesson.id === "kod-nedir") {
        return header +
          `TASK: Lesson "What is code? — rhythm of numbers". Code = order laid over reality. Don't lecture; show direction and layers. Sanri tone: personal, sharp, no mystic fog.\n\n` +
          `Detect input type:\n\n` +
          `(A) Mostly NUMBER / DATE / TIME / AMOUNT: full numeric reading — odd/even, digits, sum/reduction, repeats (11, 22…), symbolic emphasis.\n` +
          `Explicitly echo: "Where is this calling me?" / "What does this repetition remind me of?"\n\n` +
          `(B) SENTENCE or SHORT WORD/CONCEPT: state surface; repeated sound/motif/tempo; sub-layer; direction questions.\n` +
          `Optional "code box" split — AT MOST 2–3 lines; do not do full syllable/reversal/anagram here — bridge to later lessons in one sentence.\n\n` +
          `(C) MIXED: short bridge — one weave.\n\n` +
          `REQUIRED FORMAT:\n` +
          `[SURFACE READING]\nVisible layer.\n\n` +
          `[CODE BREAKDOWN]\nConcrete parts per (A)/(B)/(C).\n\n` +
          `[DIRECTION]\nWhere does this call the person? (at least one short paragraph)\n\n` +
          `[DEEP LAYER]\nSub-message without inventing myth.\n\n` +
          `[REMINDER]\nOne sentence.\n\n` +
          `RULE: Show, don't teach encyclopedia. Sanri voice.\n`;
      }
      if (lesson.id === "insan-kod") {
        return header +
          `TASK: Lesson "Human = code — letter and pattern". See structure, not shrink the person. Gently open "carried" frequency: is this fear fully theirs?\n\n` +
          `Input may be name, nickname, short word, or one letter. Optional "code box" split (sound + hinge) — one gaze, not one correct answer; max 4–5 lines for parts; full reversal/anagram is lesson 3.\n\n` +
          `REQUIRED FORMAT:\n` +
          `[SURFACE READING]\nVisible meaning.\n\n` +
          `[PATTERN]\nNot a fault list — tremor / pattern line.\n\n` +
          `[CODE BREAKDOWN]\nCode box + letter/syllable layer.\n\n` +
          `[CARRIED?]\nShort: is this feeling fully theirs or loaded? — no moral heat.\n\n` +
          `[DEEP LAYER]\nPersonal message.\n\n` +
          `[REMINDER]\nOne sentence.\n\n` +
          `RULE: Sanri voice.\n`;
      }
      if (lesson.id === "kelimeyi-parcalamak") {
        return header +
          `TASK: Lesson "Split words and mirror". Do NOT confuse: (1) syllables, (2) character-by-character reversal, (3) anagram (same multiset of letters).\n` +
          `Calibration example for Turkish "Mayıs": reversed join (lowercase) is NOT "sayım"; "sayım" is an anagram candidate sharing the same letter bag — show both under separate headers.\n\n` +
          `MANDATORY SECTIONS (order fixed, none skipped):\n\n` +
          `[NORMALIZATION]\nLowercase, trim, show final string.\n\n` +
          `[LETTERS HYPHENATED]\ne.g. m-a-y-ı-s. State letter count. No skipped characters.\n\n` +
          `[SYLLABLES]\nLanguage-appropriate split.\n\n` +
          `[REVERSAL HYPHENATED]\nReverse Unicode letter order with hyphens.\n\n` +
          `[REVERSAL JOINED]\nJoin without spaces.\n\n` +
          `[ANAGRAM BAG]\nMultiset counts explicitly.\n\n` +
          `[ANAGRAM CANDIDATES]\nMeaningful words from same bag, or justify none.\n\n` +
          `[DIFFERENCE SUMMARY]\nOne short paragraph: reversal vs anagram.\n\n` +
          `[SURFACE READING]\nDictionary meaning.\n\n` +
          `[DEEP LAYER]\nPersonal code message.\n\n` +
          `[REMINDER]\nOne sentence.\n\n` +
          `RULE: Never call anagram "reversal". Evidence-based. Sanri voice.\n`;
      }
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
          <Text style={styles.lessonTitle}>{getLessonDisplayTitle(lesson, lang)}</Text>
          <Text style={styles.lessonDesc}>{getLessonShortDescription(lesson, lang)}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{t.duration} {lesson.duration}</Text>
            <Text style={styles.metaModule}>
              {lang === "tr" ? mod.titleTR : mod.titleEN}
            </Text>
          </View>

          {/* Lesson Content */}
          <View style={styles.contentCard}>
            <Text style={styles.contentBody}>{lessonBodyText}</Text>
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
            <Text style={styles.sanriSub}>{sanriHints.sub}</Text>

            <TextInput
              value={sanriInput}
              onChangeText={setSanriInput}
              maxLength={500}
              multiline
              placeholder={sanriHints.placeholder}
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
