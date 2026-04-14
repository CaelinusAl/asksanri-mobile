import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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
import { hasVipEntitlement } from "../../lib/revenuecat";
import { CATEGORIES as ANKOD_CATS } from "../../lib/ankodData";
import { getFeatured } from "../../lib/okumaAlaniData";
import { BOOKS } from "../../lib/booksData";
import { storageGet } from "../../lib/storage";
import {
  getProgress,
  getPercentage,
  getActiveModuleId,
} from "../../lib/kodOkumaProgress";
import { MODULES } from "../../lib/kodOkumaData";

const ACCENT = "#7cf7d8";
const BG = "#0a0b10";

type LibSection = {
  id: string;
  glyph: string;
  title: string;
  sub: string;
  accent: string;
  route: string;
  badge?: string;
  vipOnly?: boolean;
};

export default function KutuphaneScreen() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [kodProgress, setKodProgress] = useState(0);
  const [activeModule, setActiveModule] = useState("");
  const [ankodDone, setAnkodDone] = useState(0);
  const [hasMatrixCache, setHasMatrixCache] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const featured = useMemo(() => getFeatured().slice(0, 3), []);

  useEffect(() => {
    (async () => {
      try { setIsPremium(await hasVipEntitlement()); } catch { /* */ }
    })();
    (async () => {
      try {
        const progress = await getProgress();
        setKodProgress(getPercentage(progress));
        const modId = getActiveModuleId(progress);
        const mod = MODULES.find((m) => m.id === modId);
        setActiveModule(mod?.title || MODULES[0].title);
      } catch { /* */ }
    })();
    (async () => {
      try {
        const raw = await storageGet("sanri_ankod_completed_quizzes");
        if (raw) setAnkodDone(JSON.parse(raw).length);
      } catch { /* */ }
    })();
    (async () => {
      try {
        const raw = await storageGet("matrix_rol_last_reading");
        if (raw) {
          const p = JSON.parse(raw);
          if (p?.apiData && p?.fullName) setHasMatrixCache(true);
        }
      } catch { /* */ }
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const userName = user?.name?.trim() || user?.email?.split("@")[0] || "";

  const sections: LibSection[] = [
    {
      id: "ankod",
      glyph: "✧",
      title: "AN-KOD",
      sub: "Anın kodunu seç — 4 alan, 5 soru, sana özel yansıma",
      accent: "rgba(168,85,247,0.85)",
      route: "/(tabs)/ankod",
      badge: ankodDone > 0 ? `${ankodDone}/4` : undefined,
      vipOnly: true,
    },
    {
      id: "matrix_rol",
      glyph: "◈",
      title: "Matrix Rol Okuma",
      sub: "İsim + doğum tarihi → sistemdeki rolünü hatırla",
      accent: ACCENT,
      route: "/(tabs)/matrix_rol",
      badge: hasMatrixCache ? "Kayıt var" : undefined,
      vipOnly: true,
    },
    {
      id: "okuma",
      glyph: "◉",
      title: "Okuma Alanı",
      sub: "Gerçekliğin kodlarını çöz, derinliğe in",
      accent: "rgba(236,72,153,0.85)",
      route: "/(tabs)/world_events",
      badge: `${featured.length} öne çıkan`,
    },
    {
      id: "kod",
      glyph: "⌬",
      title: "Kod Okuma Sistemi",
      sub: `${activeModule} · %${kodProgress} tamamlandı`,
      accent: "rgba(234,179,8,0.9)",
      route: "/(tabs)/ust_bilinc",
      badge: kodProgress > 0 ? `%${kodProgress}` : undefined,
      vipOnly: true,
    },
  ];

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={s.scroll} contentContainerStyle={s.pad} showsVerticalScrollIndicator={false}>
        {/* ─── TOP BAR ─── */}
        <View style={s.topRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={s.backText}>← Kapılar</Text>
          </Pressable>
          {isPremium && (
            <View style={s.vipBadge}>
              <Text style={s.vipText}>VIP</Text>
            </View>
          )}
        </View>

        {/* ─── HERO ─── */}
        <View style={s.hero}>
          <Animated.Text style={[s.heroGlyph, { opacity: pulseAnim }]}>☽</Animated.Text>
          <Text style={s.heroEyebrow}>SANRI KÜTÜPHANE</Text>
          <Text style={s.heroTitle}>Bilincin Haritası</Text>
          <Text style={s.heroSub}>
            {userName ? `${userName}, ` : ""}tüm SANRI okuma modülleri burada.{"\n"}
            Hangi kapıdan girmek istersen, alan seni bekliyor.
          </Text>
        </View>

        {/* ─── MAIN SECTIONS ─── */}
        {sections.map((sec) => (
          <Pressable
            key={sec.id}
            style={s.sectionCard}
            onPress={() => router.push(sec.route as any)}
          >
            <View style={s.sectionTop}>
              <Text style={[s.sectionGlyph, { color: sec.accent }]}>{sec.glyph}</Text>
              <View style={s.sectionInfo}>
                <View style={s.sectionTitleRow}>
                  <Text style={[s.sectionTitle, { color: sec.accent }]}>{sec.title}</Text>
                  {sec.vipOnly && !isPremium && (
                    <View style={s.vipTagSmall}>
                      <Text style={s.vipTagText}>VIP</Text>
                    </View>
                  )}
                </View>
                <Text style={s.sectionSub}>
                  {sec.sub}
                  {sec.vipOnly && !isPremium ? " · derin katmanlar VIP" : ""}
                </Text>
              </View>
              {sec.badge && (
                <View style={[s.badge, { backgroundColor: `${sec.accent}22` }]}>
                  <Text style={[s.badgeText, { color: sec.accent }]}>{sec.badge}</Text>
                </View>
              )}
            </View>
            <View style={s.sectionArrow}>
              <Text style={s.arrowText}>→</Text>
            </View>
          </Pressable>
        ))}

        {/* ─── AN-KOD CATEGORIES PREVIEW ─── */}
        <Text style={s.divider}>AN-KOD Alanları</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
          {ANKOD_CATS.map((cat) => (
            <Pressable
              key={cat.id}
              style={[s.catChip, { borderColor: cat.accent }]}
              onPress={() => router.push("/(tabs)/ankod" as any)}
            >
              <Text style={[s.catGlyph, { color: cat.accent }]}>{cat.glyph}</Text>
              <Text style={[s.catTitle, { color: cat.accent }]}>{cat.title}</Text>
              <Text style={s.catBlurb}>{cat.blurb}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ─── FEATURED READINGS ─── */}
        <Text style={s.divider}>Öne Çıkan Okumalar</Text>
        {featured.map((item) => (
          <Pressable
            key={item.id}
            style={s.featCard}
            onPress={() => router.push({ pathname: "/(tabs)/okuma_detail", params: { slug: item.slug } } as any)}
          >
            <Text style={s.featTitle}>{item.title}</Text>
            <Text style={s.featSub}>{item.subtitle}</Text>
            <View style={s.featMeta}>
              <Text style={s.featMetaText}>{item.category.replace(/_/g, " ")}</Text>
              {item.isPremium && <Text style={s.featPremium}>Premium</Text>}
            </View>
          </Pressable>
        ))}

        {/* ─── BOOKS ─── */}
        <Text style={s.divider}>Bilinç Kitaplığı</Text>
        <Text style={s.bookSubtitle}>Her kitap bir kapı. Sayfalar döndükçe bilinç açılır.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.bookScroll}>
          {BOOKS.map((book) => (
            <Pressable
              key={book.id}
              style={s.bookCard}
              onPress={() => router.push({ pathname: "/(tabs)/book_reader", params: { bookId: book.id } } as any)}
            >
              <View style={[s.bookAccent, { backgroundColor: book.color }]} />
              <Text style={[s.bookTitle, { color: book.color }]}>{book.title}</Text>
              <Text style={s.bookAuthor}>{book.author}</Text>
              <Text style={s.bookChapters}>{book.chapters.length} bölüm</Text>
              {book.isPremium ? (
                <Text style={s.bookPrice}>₺{book.price}</Text>
              ) : (
                <Text style={[s.bookPrice, { color: "#48BB78" }]}>Ücretsiz</Text>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* ─── QUICK STATS ─── */}
        <Text style={s.divider}>Senin Yolculuğun</Text>
        <View style={s.statsGrid}>
          <View style={s.statBox}>
            <Text style={s.statNum}>{ankodDone}</Text>
            <Text style={s.statLabel}>AN-KOD{"\n"}Tamamlanan</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>%{kodProgress}</Text>
            <Text style={s.statLabel}>Kod Okuma{"\n"}İlerleme</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{hasMatrixCache ? "✓" : "—"}</Text>
            <Text style={s.statLabel}>Matrix Rol{"\n"}Okuma</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>{BOOKS.length}</Text>
            <Text style={s.statLabel}>Kitap{"\n"}Kütüphane</Text>
          </View>
        </View>

        {/* ─── BOTTOM MESSAGE ─── */}
        <View style={s.bottomMsg}>
          <Text style={s.bottomGlyph}>✧</Text>
          <Text style={s.bottomText}>
            Her kapı seni bekliyor.{"\n"}Ama sadece hazır olan girebilir.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  pad: { padding: 18, paddingTop: 28, paddingBottom: 80 },

  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backText: { color: ACCENT, fontSize: 15, fontWeight: "700" },
  vipBadge: { backgroundColor: "rgba(124,247,216,0.15)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(124,247,216,0.3)" },
  vipText: { color: ACCENT, fontSize: 11, fontWeight: "900", letterSpacing: 1.5 },

  hero: { alignItems: "center", marginBottom: 28 },
  heroGlyph: { color: ACCENT, fontSize: 40, marginBottom: 10 },
  heroEyebrow: { color: "rgba(255,255,255,0.5)", fontSize: 12, letterSpacing: 3, fontWeight: "700", marginBottom: 6 },
  heroTitle: { color: "#fff", fontSize: 28, fontWeight: "900", textAlign: "center", marginBottom: 8 },
  heroSub: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 20, textAlign: "center" },

  sectionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTop: { flex: 1, flexDirection: "row", alignItems: "center", gap: 14 },
  sectionGlyph: { fontSize: 28 },
  sectionInfo: { flex: 1 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  vipTagSmall: { backgroundColor: "rgba(234,179,8,0.15)", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: "rgba(234,179,8,0.25)" },
  vipTagText: { color: "#eab308", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  sectionSub: { color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 17 },
  sectionArrow: { marginLeft: 8 },
  arrowText: { color: "rgba(255,255,255,0.3)", fontSize: 20, fontWeight: "700" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 6 },
  badgeText: { fontSize: 10, fontWeight: "800" },

  divider: { color: ACCENT, fontSize: 13, fontWeight: "800", letterSpacing: 1.5, marginTop: 24, marginBottom: 14 },

  catScroll: { marginBottom: 10 },
  catChip: {
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    width: 130,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
  },
  catGlyph: { fontSize: 20, marginBottom: 6 },
  catTitle: { fontSize: 14, fontWeight: "800", marginBottom: 3 },
  catBlurb: { color: "rgba(255,255,255,0.4)", fontSize: 11, lineHeight: 15 },

  featCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  featTitle: { color: "#fff", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  featSub: { color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 17, marginBottom: 8 },
  featMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  featMetaText: { color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 },
  featPremium: { color: "#eab308", fontSize: 10, fontWeight: "800" },

  bookSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: -8, marginBottom: 14, lineHeight: 17 },
  bookScroll: { marginBottom: 10 },
  bookCard: {
    width: 160,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  bookAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 3 },
  bookTitle: { fontSize: 14, fontWeight: "800", marginTop: 6, marginBottom: 4, lineHeight: 19 },
  bookAuthor: { color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8 },
  bookChapters: { color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 4 },
  bookPrice: { color: "#c8a0ff", fontSize: 12, fontWeight: "800" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  statBox: {
    width: "47%" as any,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
  },
  statNum: { color: ACCENT, fontSize: 24, fontWeight: "900", marginBottom: 4 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 11, textAlign: "center", lineHeight: 15 },

  bottomMsg: { alignItems: "center", marginTop: 20, paddingVertical: 20 },
  bottomGlyph: { color: "rgba(255,255,255,0.15)", fontSize: 32, marginBottom: 10 },
  bottomText: { color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", lineHeight: 20, fontStyle: "italic" },
});
