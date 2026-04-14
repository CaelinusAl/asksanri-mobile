import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  TextInput,
  Animated,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { API, apiGetJson, apiPostJson, apiDeleteJson } from "../../lib/apiClient";
import { openManageSubscriptions, hasVipEntitlement } from "../../lib/revenuecat";
import { getProgress, countCompleted, getPercentage, getActiveModuleId, getNextIncompleteLesson } from "../../lib/kodOkumaProgress";
import { MODULES, ALL_LESSONS } from "../../lib/kodOkumaData";
import { storageGet, storageSet } from "../../lib/storage";
import type { ProgressMap } from "../../lib/kodOkumaProgress";

type Lang = "tr" | "en";

type ProfileData = {
  name?: string;
  dominant_emotion?: string;
  intent?: string;
  pattern?: string;
  last_message?: string;
  sanri_level?: number;
  sanri_archetype?: string;
  sanri_tone?: string;
};

type MemoryItem = { type: string; content: string; created_at?: string | null };
type NotebookTab = "notes" | "saved" | "questions" | "echoes";

const STREAK_KEY = "sanri_streak";
const DAILY_FREQ_KEY = "sanri_daily_freq";
const NOTEBOOK_KEY = "sanri_notebook";

/* ── Duygular (Günlük Frekans) ── */
const DAILY_EMOTIONS = [
  { id: "huzur", tr: "Huzur", en: "Peace", icon: "🍃" },
  { id: "merak", tr: "Merak", en: "Curiosity", icon: "🔍" },
  { id: "umut", tr: "Umut", en: "Hope", icon: "🌱" },
  { id: "karanlik", tr: "Karanlık", en: "Darkness", icon: "🌑" },
  { id: "akis", tr: "Akış", en: "Flow", icon: "🌊" },
  { id: "firtina", tr: "Fırtına", en: "Storm", icon: "⚡" },
  { id: "bosluk", tr: "Boşluk", en: "Void", icon: "⬛" },
  { id: "ates", tr: "Ateş", en: "Fire", icon: "🔥" },
];

/* ── Rozetler ── */
const BADGES = [
  { id: "ilk_kapi", tr: "İlk Kapı", en: "First Gate", icon: "🚪", desc_tr: "Alana adım attın", desc_en: "Stepped into the field" },
  { id: "yanki_birakici", tr: "Yankı Bırakıcı", en: "Echo Maker", icon: "🔔", desc_tr: "İlk yankını bıraktın", desc_en: "Left your first echo" },
  { id: "kod_tasiyicisi", tr: "Kod Taşıyıcısı", en: "Code Carrier", icon: "📋", desc_tr: "İlk dersi tamamladın", desc_en: "Completed first lesson" },
  { id: "hatirlayan", tr: "Hatırlayan", en: "Rememberer", icon: "✨", desc_tr: "21 dersi tamamladın", desc_en: "Completed 21 lessons" },
  { id: "ayna_tutan", tr: "Ayna Tutan", en: "Mirror Holder", icon: "🛡️", desc_tr: "SANRI kod yorumu aldın", desc_en: "Got SANRI code reading" },
  { id: "frekans_bekcisi", tr: "Frekans Bekçisi", en: "Frequency Guardian", icon: "🎵", desc_tr: "Premium erişim açıldı", desc_en: "Premium access unlocked" },
  { id: "ritual_yolcusu", tr: "Ritüel Yolcusu", en: "Ritual Traveler", icon: "🏛️", desc_tr: "İlk ritüeli tamamladın", desc_en: "Completed first ritual" },
  { id: "derin_okuyucu", tr: "Derin Okuyucu", en: "Deep Reader", icon: "📖", desc_tr: "7 gün üst üste giriş", desc_en: "7 day streak" },
  { id: "matrix_cozucu", tr: "Matrix Çözücü", en: "Matrix Solver", icon: "🧩", desc_tr: "Tüm modülleri aç", desc_en: "Unlock all modules" },
  { id: "hafiza_tasiyicisi", tr: "Hafıza Taşıyıcısı", en: "Memory Carrier", icon: "🧠", desc_tr: "21 gün streak", desc_en: "21 day streak" },
];

/* ── Kod Haritası Elementleri ── */
const ELEMENTS_TR = ["Ay", "Güneş", "Su", "Ateş", "Toprak", "Rüzgar"];
const ELEMENTS_EN = ["Moon", "Sun", "Water", "Fire", "Earth", "Wind"];

/* ── Lokalizasyon ── */
const T = {
  tr: {
    title: "BENİM ALANIM",
    back: "← Kapılar",
    bio: "Henüz bir bio yazmadın...",
    premium: "PREMIUM AKTİF",
    free: "KEŞFET",
    streak: "Streak", gates: "Kapılar", echoes: "Yankılar", reflections: "Yansımalar",
    sanriSees: "SANRI BUGÜN SENİ BÖYLE GÖRÜYOR",
    streakTitle: "gün",
    streakGoal: "gün hedefine",
    streakLeft: "gün kaldı.",
    codeMap: "Benim Kod Haritam",
    dominant: "BASKIN ELEMENT", todayGate: "BUGÜN AÇILAN KAPI",
    repeatTheme: "TEKRARLAYAN TEMA", avoidTheme: "KAÇINILAN TEMA",
    lastGate: "SON AÇILAN KAPI", unsolvedKnot: "ÇÖZÜLMEYEN DÜĞÜM",
    sanriNote: "SANRI NOTU",
    kodSystem: "SANRI Kod Okuma Sistemi™",
    goPanel: "Panele git →",
    activeModule: "AKTİF MODÜL", completed: "TAMAMLANAN",
    todayLesson: "BUGÜNKÜ DERS", goLesson: "Derse gir →",
    dailyFreq: "Günlük Frekans",
    dailyQ: "Bugün sende ne açıldı?",
    miniIntent: "Mini niyetini yaz...",
    saveReflect: "Kaydet & SANRI Yansıtsın",
    notebook: "Benim Defterim",
    nbNotes: "Notlarım", nbSaved: "Kaydettiklerim", nbQuestions: "Sorularım", nbEchoes: "Yankılarım",
    nbPlaceholder: "Bir not, bir farkındalık, bir düşünce bırak...",
    nbSave: "Kaydet",
    nbEmpty: "Bu odada henüz ilk not bırakılmadı.",
    badgesTitle: "Rozetler / Açılan Kapılar",
    profile: "Sanrı Profili",
    emotion: "DUYGU", intent: "NİYET", patternLabel: "ÖRÜNTÜ", archetype: "ARKETİP", tone: "TON",
    reading: "Sanrı Seni Nasıl Görüyor",
    reading1: "Şu an baskın niyetin", reading2: "olarak okunuyor.",
    reading3: "İç alandaki baskın duygu", reading4: "Sanrı bu yüzden",
    reading5: "tonda ve", reading6: "arketibiyle sana yanıt veriyor.",
    deepen: "Derinleş",
    memories: "Son Hafıza İzleri",
    memEmpty: "Henüz kayıtlı hafıza yok.",
    account: "HESAP",
    manageSubs: "Abonelikleri Yönet", privacy: "Gizlilik Politikası",
    terms: "Kullanım Şartları", deleteAccount: "Hesabımı Sil",
    deleteConfirm: "Hesabını kalıcı olarak silmek istediğinden emin misin?",
    cancel: "İptal",
    loading: "Sanrı alanı yükleniyor...",
    error: "Alan yüklenemedi.", retry: "Tekrar Dene",
    notSet: "Henüz açılmadı",
    sanriReflecting: "SANRI yansıtıyor...",
  },
  en: {
    title: "MY AREA",
    back: "← Gates",
    bio: "No bio yet...",
    premium: "PREMIUM ACTIVE",
    free: "EXPLORE",
    streak: "Streak", gates: "Gates", echoes: "Echoes", reflections: "Reflections",
    sanriSees: "SANRI SEES YOU TODAY LIKE THIS",
    streakTitle: "days",
    streakGoal: "day goal,",
    streakLeft: "days left.",
    codeMap: "My Code Map",
    dominant: "DOMINANT ELEMENT", todayGate: "TODAY'S GATE",
    repeatTheme: "REPEATING THEME", avoidTheme: "AVOIDED THEME",
    lastGate: "LAST OPENED GATE", unsolvedKnot: "UNSOLVED KNOT",
    sanriNote: "SANRI NOTE",
    kodSystem: "SANRI Code Reading System™",
    goPanel: "Go to Panel →",
    activeModule: "ACTIVE MODULE", completed: "COMPLETED",
    todayLesson: "TODAY'S LESSON", goLesson: "Enter Lesson →",
    dailyFreq: "Daily Frequency",
    dailyQ: "What opened in you today?",
    miniIntent: "Write your mini intention...",
    saveReflect: "Save & SANRI Reflect",
    notebook: "My Notebook",
    nbNotes: "Notes", nbSaved: "Saved", nbQuestions: "Questions", nbEchoes: "Echoes",
    nbPlaceholder: "Leave a note, an awareness, a thought...",
    nbSave: "Save",
    nbEmpty: "No notes left in this room yet.",
    badgesTitle: "Badges / Opened Gates",
    profile: "Sanri Profile",
    emotion: "EMOTION", intent: "INTENT", patternLabel: "PATTERN", archetype: "ARCHETYPE", tone: "TONE",
    reading: "How Sanri Sees You",
    reading1: "Your dominant intent is read as", reading2: ".",
    reading3: "The dominant inner emotion is", reading4: "So Sanri responds in a",
    reading5: "tone with the", reading6: "archetype.",
    deepen: "Go Deeper",
    memories: "Recent Memory Traces",
    memEmpty: "No memory recorded yet.",
    account: "ACCOUNT",
    manageSubs: "Manage Subscriptions", privacy: "Privacy Policy",
    terms: "Terms of Use", deleteAccount: "Delete My Account",
    deleteConfirm: "Are you sure you want to permanently delete your account?",
    cancel: "Cancel",
    loading: "Loading Sanri field...",
    error: "Area could not be loaded.", retry: "Retry",
    notSet: "Not opened yet",
    sanriReflecting: "SANRI is reflecting...",
  },
} as const;

/* ── Map helpers ── */
function mapVal(value: string | undefined, maps: Record<string, string>, fallback: string) {
  return maps[String(value || "").toLowerCase()] || value || fallback;
}
const emotionMap = { tr: { neutral: "Nötr", fear: "Korku", loneliness: "Yalnızlık", love: "Sevgi", hope: "Umut", anger: "Öfke" }, en: { neutral: "Neutral", fear: "Fear", loneliness: "Loneliness", love: "Love", hope: "Hope", anger: "Anger" } };
const intentMap = { tr: { reflection: "Yansıma", memory: "Hafıza", direction: "Yön arayışı" }, en: { reflection: "Reflection", memory: "Memory", direction: "Direction seeking" } };
const patternMap = { tr: { general: "Genel akış", past_reference: "Geçmiş referansı", emotional_signal: "Duygusal sinyal" }, en: { general: "General flow", past_reference: "Past reference", emotional_signal: "Emotional signal" } };
const archetypeMap = { tr: { mirror: "Ayna", rememberer: "Hatırlayan", heart_reader: "Kalp Okuyucu", path_opener: "Yol Açıcı", deep_witness: "Derin Tanık" }, en: { mirror: "Mirror", rememberer: "Rememberer", heart_reader: "Heart Reader", path_opener: "Path Opener", deep_witness: "Deep Witness" } };
const toneMap = { tr: { clear: "Berrak", direct: "Doğrudan", warm: "Sıcak", focused: "Odaklı", deep: "Derin" }, en: { clear: "Clear", direct: "Direct", warm: "Warm", focused: "Focused", deep: "Deep" } };

function memTag(type: string | undefined, lang: Lang) {
  const k = String(type || "").toLowerCase();
  if (lang === "tr") return k === "user" ? "SEN" : k === "ai" ? "SANRI" : "OTOMATİK";
  return k === "user" ? "YOU" : k === "ai" ? "SANRI" : "AUTO";
}

function displayName(pName?: string, aName?: string, aEmail?: string) {
  const raw = pName || aName || aEmail || "Sen";
  const s = String(raw).trim();
  return s.includes("@") ? s.split("@")[0] : s;
}

/* ── Daily SANRI messages ── */
const DAILY_SANRI = {
  tr: [
    "Bugün senin için bir mesaj var. Dikkat et.",
    "Alan bugün sessiz ama seni dinliyor.",
    "Bugün frekansın yüksek — dikkatini yönlendir.",
    "Bugün içeride bir şey kıpırdıyor. Onu bul.",
  ],
  en: [
    "There's a message for you today. Pay attention.",
    "The field is quiet today but listening to you.",
    "Your frequency is high today — direct your attention.",
    "Something is stirring inside today. Find it.",
  ],
};

function getDailySanriMsg(lang: Lang) {
  const d = new Date().getDate();
  const arr = DAILY_SANRI[lang];
  return arr[d % arr.length];
}

/* ── Streak helpers ── */
async function loadStreak(): Promise<{ count: number; lastDate: string }> {
  try {
    const raw = await storageGet(STREAK_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lastDate: "" };
  } catch { return { count: 0, lastDate: "" }; }
}

async function bumpStreak(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const s = await loadStreak();
  if (s.lastDate === today) return s.count;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = s.lastDate === yesterday ? s.count + 1 : 1;
  await storageSet(STREAK_KEY, JSON.stringify({ count: newCount, lastDate: today }));
  return newCount;
}

/* ── Notebook helpers ── */
type NotebookData = Record<NotebookTab, string[]>;
async function loadNotebook(): Promise<NotebookData> {
  try {
    const raw = await storageGet(NOTEBOOK_KEY);
    return raw ? JSON.parse(raw) : { notes: [], saved: [], questions: [], echoes: [] };
  } catch { return { notes: [], saved: [], questions: [], echoes: [] }; }
}
async function saveNotebook(data: NotebookData) {
  await storageSet(NOTEBOOK_KEY, JSON.stringify(data));
}

/* ── Derive code map from profile ── */
function deriveCodeMap(profile: ProfileData | null, progress: ProgressMap, lang: Lang) {
  const elements = lang === "tr" ? ELEMENTS_TR : ELEMENTS_EN;
  const emotion = profile?.dominant_emotion || "neutral";
  const idx = Math.abs(emotion.charCodeAt(0)) % elements.length;

  const completedLessons = ALL_LESSONS.filter((l) => progress[l.id]);
  const lastLesson = completedLessons.length > 0 ? completedLessons[completedLessons.length - 1] : null;

  const themes = lang === "tr"
    ? ["Işık", "Gölge", "Dönüşüm", "Akış", "Sınır", "Derinlik"]
    : ["Light", "Shadow", "Transformation", "Flow", "Boundary", "Depth"];
  const avoidThemes = lang === "tr"
    ? ["Kabul", "Kontrol", "Bağımlılık", "Korku", "Yalnızlık", "Öfke"]
    : ["Acceptance", "Control", "Dependency", "Fear", "Loneliness", "Anger"];

  const hash = (emotion.charCodeAt(0) + (profile?.intent?.charCodeAt(0) || 0)) % themes.length;
  const knots = lang === "tr"
    ? ["İnsan = Kod", "Gölge = Ayna", "Tekrar = Mesaj"]
    : ["Human = Code", "Shadow = Mirror", "Repetition = Message"];

  return {
    dominant: elements[idx],
    todayGate: lastLesson ? lastLesson.title : (lang === "tr" ? "Henüz açılmadı" : "Not opened yet"),
    repeatTheme: themes[hash],
    avoidTheme: avoidThemes[(hash + 2) % avoidThemes.length],
    lastGate: lastLesson ? lastLesson.title : (lang === "tr" ? "Henüz yok" : "None yet"),
    unsolved: knots[hash % knots.length],
  };
}

/* ── Derive daily SANRI note ── */
function deriveSanriNote(profile: ProfileData | null, lang: Lang) {
  const notes = lang === "tr"
    ? [
        "Tohumlar ekildi. Ama kökler daha derine inecek.",
        "Frekansın değişiyor. Dikkat et — alan seni yeniden konumlandırıyor.",
        "Bugün bir şeyi bırakabilirsin. O şey seni tutmuyor — sen onu tutuyorsun.",
        "Sessizliğin içinde bir cevap bekliyor. Onu duy.",
      ]
    : [
        "Seeds planted. But roots will go deeper.",
        "Your frequency is shifting. Pay attention — the field is repositioning you.",
        "Today you can let go of something. It's not holding you — you're holding it.",
        "An answer waits in the silence. Hear it.",
      ];
  const d = new Date().getDate();
  const off = (profile?.dominant_emotion?.charCodeAt(0) || 0) % notes.length;
  return notes[(d + off) % notes.length];
}

/* ── Badge check ── */
function checkBadge(id: string, streak: number, progress: ProgressMap, memories: MemoryItem[], isPremium: boolean): boolean {
  const completed = countCompleted(progress);
  switch (id) {
    case "ilk_kapi": return memories.length > 0 || completed > 0;
    case "yanki_birakici": return memories.some((m) => m.type === "user");
    case "kod_tasiyicisi": return completed >= 1;
    case "hatirlayan": return completed >= 21;
    case "ayna_tutan": return memories.some((m) => m.type === "ai");
    case "frekans_bekcisi": return isPremium;
    case "ritual_yolcusu": return completed >= 3;
    case "derin_okuyucu": return streak >= 7;
    case "matrix_cozucu": return completed >= 14;
    case "hafiza_tasiyicisi": return streak >= 21;
    default: return false;
  }
}

/* ══════════════════════ MAIN SCREEN ══════════════════════ */
export default function MyAreaScreen() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState<Lang>("tr");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isPremium, setIsPremium] = useState(false);

  // Günlük Frekans
  const [dailyEmotion, setDailyEmotion] = useState<string | null>(null);
  const [dailyIntent, setDailyIntent] = useState("");
  const [dailySaving, setDailySaving] = useState(false);
  const [dailySanriReply, setDailySanriReply] = useState("");

  // Defterim
  const [nbTab, setNbTab] = useState<NotebookTab>("notes");
  const [nbText, setNbText] = useState("");
  const [notebook, setNotebook] = useState<NotebookData>({ notes: [], saved: [], questions: [], echoes: [] });

  const t = useMemo(() => T[lang], [lang]);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [profileRes, memoryRes, prog, s, nb, vip] = await Promise.all([
        apiGetJson(`${API.base}/bilinc-alani/profile`, 20000).catch(() => null),
        apiGetJson(`${API.base}/bilinc-alani/memory`, 20000).catch(() => []),
        getProgress(),
        bumpStreak(),
        loadNotebook(),
        hasVipEntitlement().catch(() => false),
      ]);
      setProfile(profileRes?.data || null);
      setMemories(Array.isArray(memoryRes) ? memoryRes : []);
      setProgress(prog);
      setStreak(s);
      setNotebook(nb);
      setIsPremium(!!vip);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.error, user?.email]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => { setRefreshing(true); await load(); };

  /* ── Derived data ── */
  const name = displayName(profile?.name, user?.name, user?.email);
  const emotion = mapVal(profile?.dominant_emotion, emotionMap[lang], lang === "tr" ? "Nötr" : "Neutral");
  const intent = mapVal(profile?.intent, intentMap[lang], lang === "tr" ? "Yansıma" : "Reflection");
  const pattern = mapVal(profile?.pattern, patternMap[lang], lang === "tr" ? "Genel akış" : "General flow");
  const archetype = mapVal(profile?.sanri_archetype, archetypeMap[lang], lang === "tr" ? "Ayna" : "Mirror");
  const tone = mapVal(profile?.sanri_tone, toneMap[lang], lang === "tr" ? "Berrak" : "Clear");
  const codeMap = deriveCodeMap(profile, progress, lang);
  const sanriNote = deriveSanriNote(profile, lang);
  const completedCount = countCompleted(progress);
  const pct = getPercentage(progress);
  const activeModId = getActiveModuleId(progress);
  const activeMod = MODULES.find((m) => m.id === activeModId);
  const nextLesson = getNextIncompleteLesson(progress);
  const streakGoal = streak < 3 ? 3 : streak < 7 ? 7 : 21;
  const streakLeft = Math.max(0, streakGoal - streak);

  /* ── Günlük Frekans Kaydet ── */
  const saveDailyFreq = async () => {
    if (!dailyEmotion) return;
    setDailySaving(true);
    setDailySanriReply("");
    try {
      const emoLabel = DAILY_EMOTIONS.find((e) => e.id === dailyEmotion);
      const emoName = lang === "tr" ? emoLabel?.tr : emoLabel?.en;
      const prompt = lang === "tr"
        ? `[SANRI_MODE=gunluk_frekans]\nKİŞİ: ${name}\nBugünkü duygu: ${emoName}\nMini niyet: ${dailyIntent || "(belirtilmedi)"}\n\nGörev: Bu kişinin bugünkü frekansını 2-3 cümle ile yansıt. Kısa, sezgisel, kişisel. İsmini kullan.`
        : `[SANRI_MODE=daily_frequency]\nPERSON: ${name}\nToday's feeling: ${emoName}\nMini intention: ${dailyIntent || "(not specified)"}\n\nTask: Reflect this person's frequency today in 2-3 sentences. Short, intuitive, personal. Use their name.`;

      const data = await apiPostJson(API.ask, {
        message: prompt,
        sanri_flow: "gunluk_frekans",
        user_id: user?.id,
        user_name: name,
        user_email: user?.email,
      }, 30000);

      const reply = typeof data === "string" ? data : (data?.reply || data?.response || data?.answer || "");
      if (reply) setDailySanriReply(reply);
      await storageSet(DAILY_FREQ_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), emotion: dailyEmotion, intent: dailyIntent }));
    } catch {} finally { setDailySaving(false); }
  };

  /* ── Defter Kaydet ── */
  const saveNote = async () => {
    const clean = nbText.trim();
    if (!clean) return;
    const updated = { ...notebook, [nbTab]: [clean, ...notebook[nbTab]].slice(0, 50) };
    setNotebook(updated);
    setNbText("");
    await saveNotebook(updated);
  };

  if (loading) {
    return (
      <View style={s.loadRoot}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#7cf7d8" />
        <Text style={s.loadText}>{t.loading}</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7cf7d8" />}
      >
        {/* ── Top Bar ── */}
        <View style={s.topRow}>
          <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/gates")} style={s.backBtn}>
            <Text style={s.backTxt}>{t.back}</Text>
          </Pressable>
          <Text style={s.pageTitle}>{t.title}</Text>
          <View style={s.langRow}>
            {(["tr", "en"] as Lang[]).map((l) => (
              <Pressable key={l} onPress={() => setLang(l)} style={[s.langChip, lang === l && s.langActive]}>
                <Text style={[s.langText, lang === l && s.langTextActive]}>{l.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && (
          <View style={s.errorCard}>
            <Text style={s.errorText}>{error}</Text>
            <Pressable onPress={load} style={s.retryBtn}><Text style={s.retryTxt}>{t.retry}</Text></Pressable>
          </View>
        )}

        {/* ══════ 1. PROFİL KARTI ══════ */}
        <View style={s.profileCard}>
          <View style={s.profileTop}>
            <View style={s.avatar}><Text style={s.avatarText}>{(name.slice(0, 1) || "S").toUpperCase()}</Text></View>
            <View style={s.profileInfo}>
              <Text style={s.profileName} numberOfLines={1}>{name}</Text>
              <Text style={s.profileBio}>{t.bio}</Text>
              <View style={[s.premiumBadge, isPremium ? s.premiumActive : s.premiumFree]}>
                <Text style={s.premiumText}>{isPremium ? `✦ ${t.premium}` : t.free}</Text>
              </View>
            </View>
          </View>
          <View style={s.statsGrid}>
            {[
              { val: streak, label: t.streak },
              { val: completedCount, label: t.gates },
              { val: memories.filter((m) => m.type === "user").length, label: t.echoes },
              { val: memories.filter((m) => m.type === "ai").length, label: t.reflections },
            ].map((item) => (
              <View key={item.label} style={s.statBox}>
                <Text style={s.statVal}>{item.val}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ══════ 2. SANRI BUGÜN SENİ BÖYLE GÖRÜYOR ══════ */}
        <View style={s.dailyBanner}>
          <Text style={s.dailyKicker}>{t.sanriSees}</Text>
          <Text style={s.dailyMsg}>"{getDailySanriMsg(lang)}"</Text>
        </View>

        {/* ══════ 3. STREAK ══════ */}
        <View style={s.streakCard}>
          <Animated.Text style={[s.streakIcon, { opacity: pulseAnim }]}>🔥</Animated.Text>
          <View style={{ flex: 1 }}>
            <Text style={s.streakCount}>{streak} <Text style={s.streakUnit}>{t.streakTitle}</Text></Text>
            <Text style={s.streakSub}>{streakGoal} {t.streakGoal} {streakLeft} {t.streakLeft}</Text>
          </View>
          <View style={s.milestoneRow}>
            {[3, 7, 21].map((m) => (
              <View key={m} style={[s.milestone, streak >= m && s.milestoneActive]}>
                <Text style={[s.milestoneText, streak >= m && s.milestoneTextActive]}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ══════ 4. BENİM KOD HARİTAM ══════ */}
        <Text style={s.sectionHeader}>📘 {t.codeMap}</Text>
        <View style={s.codeMapCard}>
          <View style={s.cmGrid}>
            {[
              { icon: "🌙", label: t.dominant, value: codeMap.dominant },
              { icon: "🔐", label: t.todayGate, value: codeMap.todayGate },
              { icon: "🔄", label: t.repeatTheme, value: codeMap.repeatTheme },
              { icon: "🚫", label: t.avoidTheme, value: codeMap.avoidTheme },
              { icon: "🚪", label: t.lastGate, value: codeMap.lastGate },
              { icon: "✖️", label: t.unsolvedKnot, value: codeMap.unsolved },
            ].map((item) => (
              <View key={item.label} style={s.cmCell}>
                <Text style={s.cmIcon}>{item.icon}</Text>
                <Text style={s.cmLabel}>{item.label}</Text>
                <Text style={s.cmValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={s.sanriNoteCard}>
            <Text style={s.sanriNoteKicker}>{t.sanriNote}</Text>
            <Text style={s.sanriNoteText}>"{sanriNote}"</Text>
          </View>
        </View>

        {/* ══════ 5. KOD OKUMA SİSTEMİ MINI PANEL ══════ */}
        <View style={s.kodPanel}>
          <View style={s.kodPanelHeader}>
            <Text style={s.kodPanelTitle}>◆ {t.kodSystem}</Text>
            <Pressable onPress={() => router.push("/(tabs)/ust_bilinc" as any)}>
              <Text style={s.kodPanelLink}>{t.goPanel}</Text>
            </Pressable>
          </View>
          <View style={s.kodPanelGrid}>
            <View style={s.kodPanelCell}>
              <Text style={s.kodPanelLabel}>{t.activeModule}</Text>
              <Text style={s.kodPanelValue}>{lang === "tr" ? activeMod?.titleTR : activeMod?.titleEN}</Text>
            </View>
            <View style={s.kodPanelCell}>
              <Text style={s.kodPanelLabel}>{t.completed}</Text>
              <Text style={s.kodPanelValue}>{completedCount} / {ALL_LESSONS.length}</Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${pct}%` }]} />
              </View>
            </View>
          </View>
          {nextLesson && (
            <View style={s.todayLessonCard}>
              <View style={{ flex: 1 }}>
                <Text style={s.todayLessonLabel}>{t.todayLesson}</Text>
                <Text style={s.todayLessonTitle}>{nextLesson.title}</Text>
              </View>
              <Pressable onPress={() => router.push({ pathname: "/(tabs)/kod_ders", params: { lessonId: nextLesson.id, lang } } as any)} style={s.todayLessonBtn}>
                <Text style={s.todayLessonBtnText}>{t.goLesson}</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ══════ 6. GÜNLÜK FREKANS ══════ */}
        <Text style={s.sectionHeader}>🎵 {t.dailyFreq}</Text>
        <View style={s.freqCard}>
          <Text style={s.freqQ}>{t.dailyQ}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.freqRow}>
            {DAILY_EMOTIONS.map((emo) => (
              <Pressable key={emo.id} onPress={() => setDailyEmotion(emo.id)} style={[s.freqChip, dailyEmotion === emo.id && s.freqChipActive]}>
                <Text style={s.freqIcon}>{emo.icon}</Text>
                <Text style={[s.freqChipText, dailyEmotion === emo.id && s.freqChipTextActive]}>{lang === "tr" ? emo.tr : emo.en}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <TextInput
            value={dailyIntent}
            onChangeText={setDailyIntent}
            placeholder={t.miniIntent}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={s.freqInput}
            maxLength={120}
          />
          <Pressable onPress={saveDailyFreq} style={[s.freqBtn, (!dailyEmotion || dailySaving) && s.btnDisabled]} disabled={!dailyEmotion || dailySaving}>
            <Text style={s.freqBtnText}>{dailySaving ? t.sanriReflecting : t.saveReflect}</Text>
          </Pressable>
          {!!dailySanriReply && (
            <View style={s.freqReply}>
              <Text style={s.freqReplyText}>{dailySanriReply}</Text>
            </View>
          )}
        </View>

        {/* ══════ 7. SANRI PROFİLİ ══════ */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t.profile}</Text>
          {[
            { label: t.emotion, value: emotion },
            { label: t.intent, value: intent },
            { label: t.patternLabel, value: pattern },
            { label: t.archetype, value: archetype },
            { label: t.tone, value: tone },
          ].map((row, i, arr) => (
            <View key={row.label} style={[s.infoRow, i < arr.length - 1 && s.infoRowBorder]}>
              <Text style={s.infoLabel}>{row.label}</Text>
              <Text style={s.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ══════ 8. SANRI SENİ NASIL GÖRÜYOR ══════ */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t.reading}</Text>
          <Text style={s.bodyText}>{t.reading1} <Text style={s.hl}>"{intent}"</Text> {t.reading2}</Text>
          <Text style={s.bodyText}>{t.reading3} <Text style={s.hl}>"{emotion}"</Text>.</Text>
          <Text style={s.bodyText}>{t.reading4} <Text style={s.hl}>"{tone}"</Text> {t.reading5} <Text style={s.hl}>"{archetype}"</Text> {t.reading6}</Text>
          <Pressable onPress={() => router.push("/(tabs)/sanri_flow")} style={s.primaryBtn}>
            <Text style={s.primaryBtnTxt}>{t.deepen}</Text>
          </Pressable>
        </View>

        {/* ══════ 9. BENİM DEFTERİM ══════ */}
        <Text style={s.sectionHeader}>📓 {t.notebook}</Text>
        <View style={s.card}>
          <View style={s.nbTabs}>
            {([
              { id: "notes" as NotebookTab, label: t.nbNotes },
              { id: "saved" as NotebookTab, label: t.nbSaved },
              { id: "questions" as NotebookTab, label: t.nbQuestions },
              { id: "echoes" as NotebookTab, label: t.nbEchoes },
            ]).map((tab) => (
              <Pressable key={tab.id} onPress={() => setNbTab(tab.id)} style={[s.nbTabChip, nbTab === tab.id && s.nbTabActive]}>
                <Text style={[s.nbTabText, nbTab === tab.id && s.nbTabTextActive]}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={nbText}
            onChangeText={setNbText}
            placeholder={t.nbPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.30)"
            style={s.nbInput}
            multiline
            maxLength={500}
          />
          <Pressable onPress={saveNote} style={s.nbSaveBtn} disabled={!nbText.trim()}>
            <Text style={s.nbSaveTxt}>{t.nbSave}</Text>
          </Pressable>
          {notebook[nbTab].length === 0 ? (
            <Text style={s.nbEmpty}>{t.nbEmpty}</Text>
          ) : (
            notebook[nbTab].slice(0, 5).map((note, i) => (
              <View key={i} style={s.nbNote}><Text style={s.nbNoteText}>{note}</Text></View>
            ))
          )}
        </View>

        {/* ══════ 10. ROZETLER ══════ */}
        <Text style={s.sectionHeader}>🏅 {t.badgesTitle}</Text>
        <View style={s.badgeGrid}>
          {BADGES.map((b) => {
            const earned = checkBadge(b.id, streak, progress, memories, isPremium);
            return (
              <View key={b.id} style={[s.badgeCard, earned && s.badgeEarned]}>
                <Text style={s.badgeIcon}>{b.icon}</Text>
                <Text style={[s.badgeName, earned && s.badgeNameEarned]}>{lang === "tr" ? b.tr : b.en}</Text>
                <Text style={s.badgeDesc}>{lang === "tr" ? b.desc_tr : b.desc_en}</Text>
              </View>
            );
          })}
        </View>

        {/* ══════ 11. SON HAFIZA İZLERİ ══════ */}
        <View style={s.card}>
          <Text style={s.cardTitle}>{t.memories}</Text>
          {memories.filter((m) => m.content).length === 0 ? (
            <Text style={s.emptyText}>{t.memEmpty}</Text>
          ) : (
            memories.filter((m) => m.content).slice(0, 6).map((item, i) => (
              <View key={i} style={s.memItem}>
                <View style={s.memTag}><Text style={s.memTagText}>{memTag(item.type, lang)}</Text></View>
                <Text style={s.memContent}>{item.content.replace(/\s+/g, " ").trim()}</Text>
              </View>
            ))
          )}
        </View>

        {/* ══════ 12. HESAP ══════ */}
        <View style={s.accountCard}>
          <Text style={s.accountTitle}>{t.account}</Text>
          <Pressable style={s.accBtn} onPress={() => openManageSubscriptions().catch(() => {})}>
            <Text style={s.accBtnText}>{t.manageSubs}</Text>
          </Pressable>
          <Pressable style={s.accBtn} onPress={() => Linking.openURL("https://asksanri.com/privacy")}>
            <Text style={s.accBtnText}>{t.privacy}</Text>
          </Pressable>
          <Pressable style={s.accBtn} onPress={() => Linking.openURL("https://asksanri.com/terms")}>
            <Text style={s.accBtnText}>{t.terms}</Text>
          </Pressable>
          <Pressable style={s.deleteBtn} onPress={() => {
            Alert.alert(t.deleteAccount, t.deleteConfirm, [
              { text: t.cancel, style: "cancel" },
              { text: t.deleteAccount, style: "destructive", onPress: async () => {
                try { await apiDeleteJson(`${API.base}/auth/account`); await logout(); router.replace("/(auth)/login" as any); }
                catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
              }},
            ]);
          }}>
            <Text style={s.deleteTxt}>{t.deleteAccount}</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ══════════════════════ STYLES ══════════════════════ */
const ACCENT = "#7cf7d8";
const BG = "#0a0b10";
const CARD_BG = "rgba(255,255,255,0.05)";
const CARD_BORDER = "rgba(255,255,255,0.08)";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  loadRoot: { flex: 1, backgroundColor: BG, alignItems: "center", justifyContent: "center" },
  loadText: { marginTop: 12, color: "rgba(255,255,255,0.7)", fontSize: 15 },
  scroll: { paddingTop: 56, paddingBottom: 40, paddingHorizontal: 16 },

  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)" },
  backTxt: { color: ACCENT, fontSize: 14, fontWeight: "800" },
  pageTitle: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  langRow: { flexDirection: "row", gap: 6 },
  langChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  langActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.25)" },
  langText: { color: "rgba(255,255,255,0.6)", fontWeight: "800", fontSize: 13 },
  langTextActive: { color: ACCENT },

  errorCard: { borderRadius: 20, padding: 16, marginBottom: 14, backgroundColor: "rgba(255,60,60,0.08)", borderWidth: 1, borderColor: "rgba(255,60,60,0.15)" },
  errorText: { color: "#ffb0b0", fontSize: 14, lineHeight: 22 },
  retryBtn: { marginTop: 10, alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)" },
  retryTxt: { color: "#fff", fontWeight: "700" },

  /* Profile */
  profileCard: { borderRadius: 24, padding: 18, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER },
  profileTop: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(116,92,255,0.85)", alignItems: "center", justifyContent: "center", marginRight: 14 },
  avatarText: { color: "#fff", fontSize: 34, fontWeight: "900" },
  profileInfo: { flex: 1 },
  profileName: { color: "#fff", fontSize: 20, fontWeight: "900" },
  profileBio: { color: "rgba(255,255,255,0.50)", fontSize: 13, marginTop: 3 },
  premiumBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, marginTop: 8 },
  premiumActive: { backgroundColor: "rgba(124,247,216,0.15)", borderWidth: 1, borderColor: "rgba(124,247,216,0.30)" },
  premiumFree: { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  premiumText: { color: ACCENT, fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  statsGrid: { flexDirection: "row", gap: 8 },
  statBox: { flex: 1, borderRadius: 16, paddingVertical: 12, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: CARD_BORDER },
  statVal: { color: "#fff", fontSize: 22, fontWeight: "900" },
  statLabel: { color: "rgba(255,255,255,0.50)", fontSize: 11, fontWeight: "700", marginTop: 2 },

  /* Daily Banner */
  dailyBanner: { borderRadius: 20, padding: 18, marginBottom: 14, backgroundColor: "rgba(94,59,255,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)", alignItems: "center" },
  dailyKicker: { color: "rgba(124,247,216,0.65)", fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
  dailyMsg: { color: "rgba(255,255,255,0.88)", fontSize: 16, fontWeight: "600", textAlign: "center", fontStyle: "italic", lineHeight: 24 },

  /* Streak */
  streakCard: { flexDirection: "row", alignItems: "center", borderRadius: 20, padding: 16, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER, gap: 12 },
  streakIcon: { fontSize: 36 },
  streakCount: { color: "#fff", fontSize: 28, fontWeight: "900" },
  streakUnit: { fontSize: 16, fontWeight: "700", color: "rgba(255,255,255,0.60)" },
  streakSub: { color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 },
  milestoneRow: { flexDirection: "row", gap: 8 },
  milestone: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", alignItems: "center", justifyContent: "center" },
  milestoneActive: { backgroundColor: "rgba(124,247,216,0.15)", borderColor: ACCENT },
  milestoneText: { color: "rgba(255,255,255,0.40)", fontSize: 13, fontWeight: "900" },
  milestoneTextActive: { color: ACCENT },

  /* Section Header */
  sectionHeader: { color: ACCENT, fontSize: 17, fontWeight: "900", marginBottom: 10, marginTop: 6 },

  /* Code Map */
  codeMapCard: { borderRadius: 22, padding: 14, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER },
  cmGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cmCell: { width: "48%" as any, borderRadius: 16, padding: 14, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  cmIcon: { fontSize: 22, marginBottom: 6 },
  cmLabel: { color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: "900", letterSpacing: 1, marginBottom: 4 },
  cmValue: { color: "#fff", fontSize: 16, fontWeight: "800" },
  sanriNoteCard: { marginTop: 12, borderRadius: 16, padding: 14, backgroundColor: "rgba(94,59,255,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.10)" },
  sanriNoteKicker: { color: "rgba(124,247,216,0.60)", fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },
  sanriNoteText: { color: "rgba(255,255,255,0.80)", fontSize: 15, fontStyle: "italic", lineHeight: 22 },

  /* Kod Panel */
  kodPanel: { borderRadius: 22, padding: 16, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER },
  kodPanelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  kodPanelTitle: { color: "#fff", fontSize: 15, fontWeight: "900" },
  kodPanelLink: { color: ACCENT, fontSize: 13, fontWeight: "800" },
  kodPanelGrid: { flexDirection: "row", gap: 8, marginBottom: 10 },
  kodPanelCell: { flex: 1, borderRadius: 16, padding: 12, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  kodPanelLabel: { color: "rgba(124,247,216,0.55)", fontSize: 10, fontWeight: "900", letterSpacing: 1, marginBottom: 4 },
  kodPanelValue: { color: "#fff", fontSize: 16, fontWeight: "800" },
  progressBar: { height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)", marginTop: 8 },
  progressFill: { height: 4, borderRadius: 2, backgroundColor: ACCENT },
  todayLessonCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, padding: 12, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  todayLessonLabel: { color: "rgba(124,247,216,0.55)", fontSize: 10, fontWeight: "900", letterSpacing: 1, marginBottom: 3 },
  todayLessonTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  todayLessonBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: "rgba(124,247,216,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.25)" },
  todayLessonBtnText: { color: ACCENT, fontSize: 13, fontWeight: "800" },

  /* Günlük Frekans */
  freqCard: { borderRadius: 22, padding: 16, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER },
  freqQ: { color: "rgba(255,255,255,0.70)", fontSize: 15, fontStyle: "italic", marginBottom: 12 },
  freqRow: { gap: 10, paddingBottom: 10 },
  freqChip: { alignItems: "center", width: 68, paddingVertical: 10, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  freqChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: ACCENT },
  freqIcon: { fontSize: 26, marginBottom: 4 },
  freqChipText: { color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: "700" },
  freqChipTextActive: { color: ACCENT },
  freqInput: { borderRadius: 16, padding: 14, color: "#fff", fontSize: 15, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", marginBottom: 10 },
  freqBtn: { borderRadius: 18, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(94,59,255,0.50)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)" },
  freqBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  btnDisabled: { opacity: 0.35 },
  freqReply: { marginTop: 12, borderRadius: 16, padding: 14, backgroundColor: "rgba(94,59,255,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.10)" },
  freqReplyText: { color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 24, fontWeight: "500" },

  /* Generic Card */
  card: { borderRadius: 22, padding: 18, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER },
  cardTitle: { color: ACCENT, fontSize: 16, fontWeight: "900", marginBottom: 12 },
  infoRow: { paddingVertical: 8 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  infoLabel: { color: "rgba(255,255,255,0.50)", fontSize: 11, fontWeight: "900", letterSpacing: 1, marginBottom: 2 },
  infoValue: { color: "#fff", fontSize: 17, fontWeight: "700" },
  bodyText: { color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 26, marginBottom: 8 },
  hl: { color: ACCENT, fontWeight: "800" },
  primaryBtn: { marginTop: 14, alignSelf: "flex-start", borderRadius: 16, backgroundColor: "rgba(98,61,255,0.90)", paddingHorizontal: 20, paddingVertical: 12 },
  primaryBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "900" },
  emptyText: { color: "rgba(255,255,255,0.55)", fontSize: 14, fontStyle: "italic" },

  /* Notebook */
  nbTabs: { flexDirection: "row", gap: 6, marginBottom: 14 },
  nbTabChip: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  nbTabActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: ACCENT },
  nbTabText: { color: "rgba(255,255,255,0.50)", fontSize: 12, fontWeight: "800" },
  nbTabTextActive: { color: ACCENT },
  nbInput: { borderRadius: 16, padding: 14, minHeight: 80, color: "#fff", fontSize: 15, textAlignVertical: "top", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", marginBottom: 10 },
  nbSaveBtn: { alignSelf: "flex-end", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(124,247,216,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.20)", marginBottom: 12 },
  nbSaveTxt: { color: ACCENT, fontSize: 13, fontWeight: "800" },
  nbEmpty: { color: "rgba(255,255,255,0.40)", fontSize: 14, fontStyle: "italic", textAlign: "center", paddingVertical: 16 },
  nbNote: { borderRadius: 14, padding: 12, marginBottom: 8, backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  nbNoteText: { color: "rgba(255,255,255,0.80)", fontSize: 14, lineHeight: 20 },

  /* Badges */
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  badgeCard: { width: "31%" as any, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 8, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  badgeEarned: { backgroundColor: "rgba(124,247,216,0.08)", borderColor: "rgba(124,247,216,0.18)" },
  badgeIcon: { fontSize: 28, marginBottom: 6, opacity: 0.4 },
  badgeName: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "800", textAlign: "center", marginBottom: 3 },
  badgeNameEarned: { color: ACCENT },
  badgeDesc: { color: "rgba(255,255,255,0.30)", fontSize: 10, textAlign: "center" },

  /* Memory */
  memItem: { marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  memTag: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: "rgba(124,247,216,0.12)", marginBottom: 6 },
  memTagText: { color: ACCENT, fontSize: 11, fontWeight: "900" },
  memContent: { color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 21 },

  /* Account */
  accountCard: { marginTop: 10, borderRadius: 22, padding: 16, backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER, gap: 8 },
  accountTitle: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 4 },
  accBtn: { borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: "rgba(255,255,255,0.05)" },
  accBtnText: { color: "rgba(255,255,255,0.80)", fontWeight: "700", fontSize: 15 },
  deleteBtn: { borderRadius: 14, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: "rgba(255,60,60,0.08)", borderWidth: 1, borderColor: "rgba(255,60,60,0.18)", marginTop: 4 },
  deleteTxt: { color: "rgba(255,90,90,0.90)", fontWeight: "700", fontSize: 15 },
});
