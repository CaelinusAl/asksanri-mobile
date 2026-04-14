import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API, apiPostJson } from "../../lib/apiClient";
import {
  CATEGORIES,
  READINGS,
  getCategoryMeta,
  getByCategory,
  getFeatured,
  type OkumaCategory,
  type OkumaItem,
} from "../../lib/okumaAlaniData";

type Lang = "tr" | "en";

const T = {
  tr: {
    title: "Okuma Alanı",
    subtitle: "Hologram Matrix sistem okumaları — gerçekliğin kodlarını çöz.",
    readingNow: "kişi şu an okuyor",
    featured: "ÖNE ÇIKAN",
    enter: "Metne gir →",
    views: "göz",
    comments: "yorum",
    premium: "PREMİUM",
    myReading: "Kendi Okumam",
    myReadingSub: "Bir haber linki veya olay gir — SANRI derin okuma yapsın.",
    urlLabel: "Haber Linki / Olay",
    urlPlaceholder: "https://... veya olayı yaz",
    noteLabel: "1 Cümlelik Not",
    notePlaceholder: "Bu sana neyi düşündürdü?",
    readNow: "SANRI Okusun",
    reading: "SANRI okuyor...",
    needFields: "Link/olay ve not gerekli.",
    result: "Okuma Sonucu",
    back: "← Kapılar",
    empty: "Bu kategoride henüz içerik yok.",
  },
  en: {
    title: "Reading Area",
    subtitle: "Hologram Matrix system readings — decode the codes of reality.",
    readingNow: "people reading now",
    featured: "FEATURED",
    enter: "Read →",
    views: "views",
    comments: "comments",
    premium: "PREMIUM",
    myReading: "My Reading",
    myReadingSub: "Enter a news link or event — let SANRI do a deep reading.",
    urlLabel: "News Link / Event",
    urlPlaceholder: "https://... or describe the event",
    noteLabel: "One-line Note",
    notePlaceholder: "What does this make you think of?",
    readNow: "SANRI Read",
    reading: "SANRI is reading...",
    needFields: "Link/event and note are required.",
    result: "Reading Result",
    back: "← Gates",
    empty: "No content in this category yet.",
  },
} as const;

function formatDate(iso: string, lang: Lang) {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (hours < 24) return lang === "tr" ? `${hours} sa` : `${hours}h`;
  if (days < 7) return lang === "tr" ? `${days} gün` : `${days}d`;
  return lang === "tr" ? `${weeks} hafta` : `${weeks}w`;
}

/* ── Reading Card ── */
function ReadingCard({ item, lang, onPress }: { item: OkumaItem; lang: Lang; onPress: () => void }) {
  const cat = getCategoryMeta(item.category);
  const t = T[lang];
  return (
    <Pressable onPress={onPress} style={styles.readCard}>
      <View style={[styles.readCatBadge, { backgroundColor: cat.color + "20", borderColor: cat.color + "40" }]}>
        <Text style={[styles.readCatText, { color: cat.color }]}>{lang === "tr" ? cat.tr : cat.en}</Text>
      </View>
      <Text style={styles.readTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.readExcerpt} numberOfLines={3}>{item.excerpt}</Text>
      <View style={styles.readMeta}>
        {item.isPremium && <Text style={styles.readPremium}>{t.premium}</Text>}
        <Text style={styles.readStat}>💬 {item.commentCount}</Text>
        <Text style={styles.readStat}>👁 {item.viewCount}</Text>
        <Text style={styles.readStat}>{formatDate(item.createdAt, lang)}</Text>
      </View>
    </Pressable>
  );
}

/* ── Featured Card ── */
function FeaturedCard({ item, lang, onPress }: { item: OkumaItem; lang: Lang; onPress: () => void }) {
  const cat = getCategoryMeta(item.category);
  const t = T[lang];
  return (
    <Pressable onPress={onPress} style={styles.featCard}>
      <View style={styles.featLeft}>
        <View style={[styles.featCatBadge, { backgroundColor: cat.color + "20", borderColor: cat.color + "40" }]}>
          <Text style={[styles.featCatText, { color: cat.color }]}>{lang === "tr" ? cat.tr : cat.en}</Text>
        </View>
        <Text style={styles.featTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.featSub} numberOfLines={2}>{item.subtitle}</Text>
      </View>
      <Pressable onPress={onPress} style={styles.featBtn}>
        <Text style={styles.featBtnText}>{t.enter}</Text>
      </Pressable>
    </Pressable>
  );
}

/* ══════════════════════ MAIN ══════════════════════ */
export default function OkumaAlaniScreen() {
  const { user } = useAuth();
  const [lang, setLang] = useState<Lang>("tr");
  const [activeCat, setActiveCat] = useState<OkumaCategory>("all");
  const [showMyReading, setShowMyReading] = useState(false);

  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");

  const t = useMemo(() => T[lang], [lang]);
  const featured = useMemo(() => getFeatured(), []);
  const filtered = useMemo(() => getByCategory(activeCat), [activeCat]);
  const liveCount = useMemo(() => 3 + Math.floor(Math.random() * 12), []);

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

  const onOpenReading = useCallback((item: OkumaItem) => {
    router.push({
      pathname: "/(tabs)/okuma_detail",
      params: { slug: item.slug, lang },
    } as any);
  }, [lang]);

  const doMyReading = useCallback(async () => {
    const u = url.trim();
    const n = note.trim();
    if (!u || !n) { Alert.alert("!", t.needFields); return; }

    setBusy(true);
    setResult("");
    try {
      const prompt = lang === "tr"
        ? `[SANRI_MODE=okuma_alani]\nKİŞİ: ${nameForPrompt}\nKaynak: ${u}\nKullanıcı Notu: ${n}\n\nGörev: Bu olayı / haberi derin kod okuması olarak çöz.\nFormat:\n1) SİNYAL — Olayın frekans özeti (2-3 satır)\n2) SEMBOL DECODE — Görünenin altındaki semboller\n3) KOD AKIŞI — Sayı/harf/isim akışı varsa çöz\n4) KOLEKTİF DERS — Bu olay kolektife ne diyor?\n5) KİŞİSEL UYGULAMA — ${nameForPrompt} için tek somut adım\n\nKURAL: Haber yorumu yapma. Kodu oku. Keskin, derin, Sanrı dili.`
        : `[SANRI_MODE=reading_area]\nPERSON: ${nameForPrompt}\nSource: ${u}\nUser Note: ${n}\n\nTask: Decode this event/news as a deep code reading.\nFormat:\n1) SIGNAL — Frequency summary (2-3 lines)\n2) SYMBOL DECODE — Symbols beneath the surface\n3) CODE FLOW — Number/letter/name patterns\n4) COLLECTIVE LESSON — What does this say to the collective?\n5) PERSONAL ACTION — One concrete step for ${nameForPrompt}\n\nRULE: Don't do news commentary. Read the code. Sharp, deep, Sanri voice.`;

      const data: any = await apiPostJson(API.ask, {
        message: prompt,
        sanri_flow: "okuma_alani",
        user_id: user?.id,
        user_name: userName,
        user_email: userEmail,
      }, 60000);

      const answer = String(data?.answer || data?.response || data?.reply || "").trim() || "-";
      setResult(answer);
    } catch (e: any) {
      Alert.alert("Hata", String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }, [url, note, lang, t.needFields, nameForPrompt, user?.id, userName, userEmail]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Top Bar */}
      <View style={styles.topRow}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/gates")} style={styles.backBtn}>
          <Text style={styles.backTxt}>{t.back}</Text>
        </Pressable>
        <View style={styles.langRow}>
          {(["tr", "en"] as Lang[]).map((l) => (
            <Pressable key={l} onPress={() => setLang(l)} style={[styles.langChip, lang === l && styles.langActive]}>
              <Text style={[styles.langText, lang === l && styles.langTextActive]}>{l.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Live Counter */}
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{liveCount} {t.readingNow}</Text>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setActiveCat(cat.id)}
              style={[styles.catChip, activeCat === cat.id && styles.catChipActive]}
            >
              <Text style={[styles.catChipText, activeCat === cat.id && styles.catChipTextActive]}>
                {lang === "tr" ? cat.tr : cat.en}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Featured */}
        {activeCat === "all" && featured.length > 0 && (
          <>
            {featured.slice(0, 2).map((item) => (
              <FeaturedCard key={item.id} item={item} lang={lang} onPress={() => onOpenReading(item)} />
            ))}
          </>
        )}

        {/* Reading Grid */}
        {filtered.length === 0 ? (
          <View style={styles.emptyCard}><Text style={styles.emptyText}>{t.empty}</Text></View>
        ) : (
          <View style={styles.gridWrap}>
            {filtered.map((item) => (
              <ReadingCard key={item.id} item={item} lang={lang} onPress={() => onOpenReading(item)} />
            ))}
          </View>
        )}

        {/* ── Kendi Okumam Toggle ── */}
        <Pressable onPress={() => setShowMyReading(!showMyReading)} style={styles.myToggle}>
          <Text style={styles.myToggleText}>{showMyReading ? "▲" : "▼"} {t.myReading}</Text>
        </Pressable>

        {showMyReading && (
          <View style={styles.myCard}>
            <Text style={styles.myCardSub}>{t.myReadingSub}</Text>

            <Text style={styles.myLabel}>{t.urlLabel}</Text>
            <TextInput value={url} onChangeText={setUrl} maxLength={2000} placeholder={t.urlPlaceholder} placeholderTextColor="rgba(255,255,255,0.35)" autoCapitalize="none" keyboardType="url" style={styles.myInput} />

            <Text style={styles.myLabel}>{t.noteLabel}</Text>
            <TextInput value={note} onChangeText={setNote} maxLength={500} placeholder={t.notePlaceholder} placeholderTextColor="rgba(255,255,255,0.35)" multiline style={[styles.myInput, { minHeight: 80, textAlignVertical: "top" }]} />

            <Pressable onPress={doMyReading} style={[styles.myBtn, (!url.trim() || !note.trim() || busy) && { opacity: 0.4 }]} disabled={busy || !url.trim() || !note.trim()}>
              {busy ? (
                <View style={styles.myBtnRow}><ActivityIndicator size="small" color="#fff" /><Text style={styles.myBtnText}>{t.reading}</Text></View>
              ) : (
                <Text style={styles.myBtnText}>{t.readNow}</Text>
              )}
            </Pressable>

            {!!result && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>{t.result}</Text>
                <Text style={styles.resultBody}>{result}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

/* ══════════════════════ STYLES ══════════════════════ */
const ACCENT = "#7cf7d8";
const BG = "#0a0b10";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

  topRow: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)" },
  backTxt: { color: ACCENT, fontSize: 14, fontWeight: "800" },
  langRow: { flexDirection: "row", gap: 6 },
  langChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  langActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.25)" },
  langText: { color: "rgba(255,255,255,0.6)", fontWeight: "800", fontSize: 13 },
  langTextActive: { color: ACCENT },

  title: { color: "#fff", fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 8 },
  subtitle: { color: "rgba(255,255,255,0.60)", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 20, marginBottom: 14 },

  liveRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4caf50" },
  liveText: { color: "#4caf50", fontSize: 14, fontWeight: "800" },

  catRow: { gap: 8, paddingBottom: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  catChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: ACCENT },
  catChipText: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "800" },
  catChipTextActive: { color: ACCENT },

  /* Featured */
  featCard: { borderRadius: 22, padding: 18, marginBottom: 12, backgroundColor: "rgba(94,59,255,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)", flexDirection: "row", alignItems: "center" },
  featLeft: { flex: 1, marginRight: 12 },
  featCatBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, marginBottom: 8 },
  featCatText: { fontSize: 11, fontWeight: "900" },
  featTitle: { color: "#fff", fontSize: 17, fontWeight: "900", lineHeight: 22 },
  featSub: { color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 4, lineHeight: 18 },
  featBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  featBtnText: { color: "#fff", fontSize: 13, fontWeight: "800" },

  /* Grid */
  gridWrap: { gap: 10 },
  readCard: { borderRadius: 20, padding: 16, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  readCatBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, borderWidth: 1, marginBottom: 8 },
  readCatText: { fontSize: 11, fontWeight: "900" },
  readTitle: { color: "#fff", fontSize: 16, fontWeight: "900", lineHeight: 21, marginBottom: 6 },
  readExcerpt: { color: "rgba(255,255,255,0.60)", fontSize: 13, lineHeight: 19, marginBottom: 10 },
  readMeta: { flexDirection: "row", alignItems: "center", gap: 12 },
  readStat: { color: "rgba(255,255,255,0.40)", fontSize: 12, fontWeight: "700" },
  readPremium: { color: "#FFD93D", fontSize: 11, fontWeight: "900", backgroundColor: "rgba(255,217,61,0.12)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },

  emptyCard: { borderRadius: 20, padding: 24, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  emptyText: { color: "rgba(255,255,255,0.45)", fontSize: 14, fontStyle: "italic" },

  /* My Reading */
  myToggle: { marginTop: 18, borderRadius: 18, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)" },
  myToggleText: { color: ACCENT, fontSize: 15, fontWeight: "900" },
  myCard: { marginTop: 10, borderRadius: 22, padding: 18, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  myCardSub: { color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 14, lineHeight: 19 },
  myLabel: { color: ACCENT, fontWeight: "900", fontSize: 13, marginBottom: 6, marginTop: 10 },
  myInput: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, color: "#fff", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  myBtn: { marginTop: 14, borderRadius: 18, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(94,59,255,0.70)" },
  myBtnRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  myBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  resultCard: { marginTop: 14, borderRadius: 20, padding: 16, backgroundColor: "rgba(94,59,255,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)" },
  resultTitle: { color: ACCENT, fontWeight: "900", fontSize: 14, marginBottom: 10 },
  resultBody: { color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 22 },
});
