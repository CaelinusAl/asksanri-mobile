import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { hasVipEntitlement } from "../../lib/revenuecat";
import { BookPage, getBookById } from "../../lib/booksData";

const ACCENT = "#7cf7d8";
const BG = "#0a0b10";

type FlowState = "cover" | "toc" | "reading" | "loading";

const bookModules: Record<string, () => BookPage[]> = {
  kitap_112: () => require("../../assets/books/kitap_112.json") as BookPage[],
  matrix_code: () => require("../../assets/books/matrix_code.json") as BookPage[],
  nurun_frekansi: () => require("../../assets/books/nurun_frekansi.json") as BookPage[],
  oku: () => require("../../assets/books/oku.json") as BookPage[],
};

export default function BookReaderScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const bookId = params.bookId || "";

  const meta = useMemo(() => getBookById(bookId), [bookId]);

  const [flow, setFlow] = useState<FlowState>("cover");
  const [pages, setPages] = useState<BookPage[]>([]);
  const [pageIdx, setPageIdx] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try { setIsPremium(await hasVipEntitlement()); } catch { /* */ }
    })();
  }, []);

  useEffect(() => {
    if (!bookId || !bookModules[bookId]) return;
    setFlow("loading");
    try {
      const data = bookModules[bookId]();
      setPages(Array.isArray(data) ? data : []);
      setFlow("cover");
    } catch {
      setPages([]);
      setFlow("cover");
    }
  }, [bookId]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [pageIdx, flow, fadeAnim]);

  const canAccess = useMemo(() => {
    if (!meta) return false;
    if (!meta.isPremium) return true;
    return isPremium;
  }, [meta, isPremium]);

  const maxPreview = meta?.freePreviewPages ?? 6;

  const isPageLocked = useCallback(
    (idx: number) => {
      if (canAccess) return false;
      return idx >= maxPreview;
    },
    [canAccess, maxPreview]
  );

  const chapters = useMemo(() => {
    return pages
      .map((p, i) => ({ ...p, _idx: i }))
      .filter((p) => p.type === "chapter");
  }, [pages]);

  const goPage = useCallback(
    (idx: number) => {
      if (isPageLocked(idx)) return;
      setPageIdx(idx);
      setFlow("reading");
    },
    [isPageLocked]
  );

  const nextPage = useCallback(() => {
    if (pageIdx < pages.length - 1 && !isPageLocked(pageIdx + 1)) {
      setPageIdx(pageIdx + 1);
    }
  }, [pageIdx, pages.length, isPageLocked]);

  const prevPage = useCallback(() => {
    if (pageIdx > 0) setPageIdx(pageIdx - 1);
  }, [pageIdx]);

  if (!meta) {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Pressable onPress={() => router.back()} style={s.backRow}>
          <Text style={s.back}>← Kütüphane</Text>
        </Pressable>
        <Text style={s.empty}>Kitap bulunamadı.</Text>
      </View>
    );
  }

  if (flow === "loading") {
    return (
      <View style={[s.screen, s.center]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ActivityIndicator color={ACCENT} size="large" />
        <Text style={s.loadText}>Sayfalar yükleniyor…</Text>
      </View>
    );
  }

  // ─── COVER ───
  if (flow === "cover") {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={s.scroll} contentContainerStyle={s.pad} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={s.back}>← Kütüphane</Text>
          </Pressable>

          <View style={[s.coverCard, { borderColor: meta.color + "60" }]}>
            <View style={[s.coverAccent, { backgroundColor: meta.color }]} />
            <Text style={[s.coverTitle, { color: meta.color }]}>{meta.title}</Text>
            <Text style={s.coverAuthor}>{meta.author}</Text>
            <Text style={s.coverDesc}>{meta.description}</Text>

            <View style={s.coverMeta}>
              <Text style={s.coverChapters}>{meta.chapters.length} bölüm</Text>
              {meta.isPremium ? (
                <View style={s.priceBadge}>
                  <Text style={s.priceText}>
                    {canAccess ? "Erişim Açık" : `₺${meta.price}`}
                  </Text>
                </View>
              ) : (
                <View style={[s.priceBadge, { backgroundColor: "rgba(72,187,120,0.15)", borderColor: "rgba(72,187,120,0.3)" }]}>
                  <Text style={[s.priceText, { color: "#48BB78" }]}>Ücretsiz</Text>
                </View>
              )}
            </View>
          </View>

          <Pressable style={[s.mainBtn, { backgroundColor: meta.color }]} onPress={() => setFlow("toc")}>
            <Text style={s.mainBtnText}>İçindekiler</Text>
          </Pressable>

          {pages.length > 0 && (
            <Pressable style={s.secondBtn} onPress={() => goPage(0)}>
              <Text style={s.secondBtnText}>Baştan Oku</Text>
            </Pressable>
          )}

          {/* First page preview */}
          {pages[0]?.type === "cover" && pages[1] && (
            <View style={s.previewCard}>
              <Text style={s.previewLabel}>ÖN İZLEME</Text>
              <Text style={s.previewText}>
                {pages[1].body?.slice(0, 300)}
                {(pages[1].body?.length || 0) > 300 ? "…" : ""}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─── TABLE OF CONTENTS ───
  if (flow === "toc") {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={s.scroll} contentContainerStyle={s.pad} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setFlow("cover")} hitSlop={12}>
            <Text style={s.back}>← Kapak</Text>
          </Pressable>

          <Text style={[s.tocTitle, { color: meta.color }]}>İçindekiler</Text>
          <Text style={s.tocSub}>{meta.title}</Text>

          {chapters.map((ch, i) => {
            const locked = isPageLocked(ch._idx);
            return (
              <Pressable
                key={`ch-${i}`}
                style={[s.tocItem, locked && s.tocLocked]}
                onPress={() => !locked && goPage(ch._idx)}
                disabled={locked}
              >
                <Text style={s.tocNum}>{ch.number || i + 1}</Text>
                <Text style={[s.tocChTitle, locked && { color: "rgba(255,255,255,0.25)" }]}>
                  {ch.title}
                </Text>
                {locked && <Text style={s.lockIcon}>🔒</Text>}
              </Pressable>
            );
          })}

          {!canAccess && meta.isPremium && (
            <View style={s.lockBanner}>
              <Text style={s.lockBannerTitle}>Premium İçerik</Text>
              <Text style={s.lockBannerText}>
                İlk {maxPreview} sayfa ücretsiz. Devamı için VIP erişim gerekli.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─── READING ───
  const page = pages[pageIdx];
  if (!page) {
    setFlow("cover");
    return null;
  }

  const locked = isPageLocked(pageIdx);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top bar */}
      <View style={s.readTopBar}>
        <Pressable onPress={() => setFlow("toc")} hitSlop={12}>
          <Text style={s.back}>← İçindekiler</Text>
        </Pressable>
        <Text style={s.pageCounter}>{pageIdx + 1} / {pages.length}</Text>
      </View>

      <Animated.ScrollView
        style={[s.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={s.readPad}
        showsVerticalScrollIndicator={false}
      >
        {locked ? (
          <View style={s.lockedPage}>
            <Text style={s.lockedGlyph}>🔒</Text>
            <Text style={s.lockedTitle}>Premium İçerik</Text>
            <Text style={s.lockedText}>
              Bu sayfa ve sonrası VIP erişim gerektirir.{"\n"}
              ₺{meta.price} ile tüm kitabı açabilirsin.
            </Text>
            <Pressable style={[s.mainBtn, { backgroundColor: meta.color }]} onPress={() => router.push("/(tabs)/vip" as any)}>
              <Text style={s.mainBtnText}>VIP'e Geç</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Chapter header */}
            {page.type === "chapter" && (
              <View style={s.chapterHeader}>
                {page.number != null && (
                  <Text style={[s.chapterNum, { color: meta.color }]}>
                    {typeof page.number === "number" ? `Bölüm ${page.number}` : page.number}
                  </Text>
                )}
                <Text style={s.chapterTitle}>{page.title}</Text>
                {page.epigraph ? <Text style={s.epigraph}>{page.epigraph}</Text> : null}
              </View>
            )}

            {/* Cover page */}
            {page.type === "cover" && (
              <View style={s.chapterHeader}>
                <Text style={[s.chapterTitle, { color: meta.color }]}>{page.title}</Text>
                {page.subtitle && <Text style={s.coverSubtitle}>{page.subtitle}</Text>}
                {page.author && <Text style={s.readAuthor}>{page.author}</Text>}
              </View>
            )}

            {/* Dedication / quote */}
            {(page.type === "dedication" || page.type === "quote") && (
              <View style={s.quoteBlock}>
                {page.title ? <Text style={s.quoteTitle}>{page.title}</Text> : null}
                <Text style={s.quoteBody}>{page.body}</Text>
              </View>
            )}

            {/* TOC page */}
            {page.type === "toc" && (
              <View style={s.tocPage}>
                <Text style={s.tocPageTitle}>{page.title}</Text>
                {page.body ? <Text style={s.tocPageBody}>{page.body}</Text> : null}
                {page.items?.map((it, i) => (
                  <Text key={i} style={s.tocPageItem}>• {it}</Text>
                ))}
              </View>
            )}

            {/* Content / closing */}
            {(page.type === "content" || page.type === "closing") && (
              <View style={s.contentBlock}>
                {page.title ? (
                  <Text style={s.contentTitle}>{page.title}</Text>
                ) : null}
                <Text style={s.contentBody}>{page.body}</Text>
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>

      {/* Bottom navigation */}
      <View style={s.navBar}>
        <Pressable
          style={[s.navBtn, pageIdx === 0 && { opacity: 0.3 }]}
          onPress={prevPage}
          disabled={pageIdx === 0}
        >
          <Text style={s.navBtnText}>← Önceki</Text>
        </Pressable>
        <Pressable
          style={[s.navBtn, (pageIdx >= pages.length - 1 || isPageLocked(pageIdx + 1)) && { opacity: 0.3 }]}
          onPress={nextPage}
          disabled={pageIdx >= pages.length - 1 || isPageLocked(pageIdx + 1)}
        >
          <Text style={s.navBtnText}>Sonraki →</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 18, paddingTop: 28, paddingBottom: 80 },
  readPad: { padding: 20, paddingTop: 10, paddingBottom: 100 },

  backRow: { padding: 18, paddingTop: 28 },
  back: { color: ACCENT, fontSize: 15, fontWeight: "700", marginBottom: 16 },
  empty: { color: "rgba(255,255,255,0.5)", fontSize: 16, textAlign: "center", marginTop: 40 },
  loadText: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 14 },

  coverCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    overflow: "hidden",
  },
  coverAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 4, borderRadius: 4 },
  coverTitle: { fontSize: 24, fontWeight: "900", marginTop: 12, marginBottom: 6 },
  coverAuthor: { color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: "600", marginBottom: 12 },
  coverDesc: { color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 22, marginBottom: 16 },
  coverMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coverChapters: { color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "700" },
  priceBadge: {
    backgroundColor: "rgba(200,160,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(200,160,255,0.3)",
  },
  priceText: { color: "#c8a0ff", fontSize: 13, fontWeight: "800" },

  mainBtn: { borderRadius: 18, paddingVertical: 16, alignItems: "center", marginBottom: 10 },
  mainBtnText: { color: "#0a0b10", fontSize: 15, fontWeight: "900" },
  secondBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  secondBtnText: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "700" },

  previewCard: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  previewLabel: { color: ACCENT, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 8 },
  previewText: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 22, fontStyle: "italic" },

  tocTitle: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  tocSub: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20 },
  tocItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  tocLocked: { opacity: 0.4 },
  tocNum: { color: ACCENT, fontSize: 14, fontWeight: "800", minWidth: 28 },
  tocChTitle: { color: "#fff", fontSize: 14, fontWeight: "600", flex: 1 },
  lockIcon: { fontSize: 14 },

  lockBanner: {
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    backgroundColor: "rgba(234,179,8,0.10)",
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.25)",
  },
  lockBannerTitle: { color: "#eab308", fontSize: 14, fontWeight: "800", marginBottom: 4 },
  lockBannerText: { color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 19 },

  readTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 4,
  },
  pageCounter: { color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: "700" },

  chapterHeader: { marginBottom: 24 },
  chapterNum: { fontSize: 13, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 },
  chapterTitle: { color: "#fff", fontSize: 24, fontWeight: "900", lineHeight: 32, marginBottom: 10 },
  epigraph: { color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 24, fontStyle: "italic", marginTop: 4 },
  coverSubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontWeight: "600", marginBottom: 6 },
  readAuthor: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "600" },

  quoteBlock: { marginBottom: 20, paddingLeft: 16, borderLeftWidth: 3, borderLeftColor: "rgba(124,247,216,0.3)" },
  quoteTitle: { color: ACCENT, fontSize: 15, fontWeight: "800", marginBottom: 8 },
  quoteBody: { color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 26, fontStyle: "italic" },

  tocPage: { marginBottom: 20 },
  tocPageTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  tocPageBody: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 12 },
  tocPageItem: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 24, paddingLeft: 8 },

  contentBlock: { marginBottom: 20 },
  contentTitle: { color: "#fff", fontSize: 18, fontWeight: "800", lineHeight: 26, marginBottom: 12 },
  contentBody: { color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 28 },

  lockedPage: { alignItems: "center", paddingTop: 60 },
  lockedGlyph: { fontSize: 48, marginBottom: 16 },
  lockedTitle: { color: "#eab308", fontSize: 18, fontWeight: "900", marginBottom: 8 },
  lockedText: { color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 24 },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: BG,
  },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  navBtnText: { color: ACCENT, fontSize: 14, fontWeight: "700" },
});
