import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { BookMeta, BookPage, getBookById, mergeChapterWithFollowingContent } from "../../lib/booksData";
import { useEntitlementStore } from "../../lib/entitlementStore";

const ACCENT = "#7cf7d8";
const BG = "#0a0b10";
const EDGE_GUTTER = 20;
const TAP_ZONE_W = 44;
/** Okuma kartı iç yatay padding (bookPageScrollInner ile aynı) */
const PAGE_INNER_PAD_H = 18;

function splitContentParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function isNumberedSectionParagraph(p: string): boolean {
  return /^\d+\.\s/.test(p.trim());
}

/** AŞAMA / alt ritüel satırları (🔹 🔸 vb.) */
function isSubSectionParagraph(p: string): boolean {
  return /^[🔹🔸🔮🌀⚡🌬]\s/.test(p.trim());
}

function isOpeningKickerParagraph(p: string): boolean {
  return /^🧠✨/.test(p.trim());
}

type FlowState = "cover" | "toc" | "reading" | "loading";

const bookModules: Record<string, () => BookPage[]> = {
  kitap_112: () => require("../../assets/books/kitap_112.json") as BookPage[],
  matrix_code: () => require("../../assets/books/matrix_code.json") as BookPage[],
  nurun_frekansi: () => require("../../assets/books/nurun_frekansi.json") as BookPage[],
  oku: () => require("../../assets/books/oku.json") as BookPage[],
  beyin_orgazm: () => require("../../assets/books/beyin_orgazm.json") as BookPage[],
};

export default function BookReaderScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ bookId?: string }>();
  const bookId = params.bookId || "";

  const meta = useMemo(() => getBookById(bookId), [bookId]);

  const [flow, setFlow] = useState<FlowState>("cover");
  const [pages, setPages] = useState<BookPage[]>([]);
  const [pageIdx, setPageIdx] = useState(0);
  const pagerRef = useRef<FlatList<BookPage> | null>(null);
  const isPremium = useEntitlementStore((s) => s.status.vip_access);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width: winW, height: winH } = useWindowDimensions();
  /** Web: yatay FlatList hücresine sabit yükseklik; dikey ScrollView kesmeden kayar. */
  const pagerSlotHeight = Math.max(280, winH - insets.top - insets.bottom - 112);

  useEffect(() => {
    if (!bookId || !bookModules[bookId]) return;
    setPageIdx(0);
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
  const usePager = meta?.readingLayout === "pager";
  const pageWidth = winW - EDGE_GUTTER * 2 - TAP_ZONE_W * 2;

  /** Ham JSON; okuma akışı bölüm başlığı + gövdeyi tek sayfada gösterir. */
  const readingPages = useMemo(() => mergeChapterWithFollowingContent(pages), [pages]);

  const isPageLocked = useCallback(
    (idx: number) => {
      if (canAccess) return false;
      return idx >= maxPreview;
    },
    [canAccess, maxPreview]
  );

  const chapters = useMemo(() => {
    return readingPages
      .map((p, i) => ({ ...p, _idx: i }))
      .filter((p) => p.type === "chapter" || (p.type === "content" && p.chapterLead));
  }, [readingPages]);

  const goPage = useCallback(
    (idx: number) => {
      if (isPageLocked(idx)) return;
      setPageIdx(idx);
      setFlow("reading");
      if (meta?.readingLayout === "pager") {
        requestAnimationFrame(() => {
          try {
            pagerRef.current?.scrollToOffset({ offset: idx * pageWidth, animated: false });
          } catch {}
        });
      }
    },
    [isPageLocked, meta?.readingLayout, pageWidth]
  );

  const nextPage = useCallback(() => {
    if (pageIdx < readingPages.length - 1 && !isPageLocked(pageIdx + 1)) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      const n = pageIdx + 1;
      setPageIdx(n);
      if (meta?.readingLayout === "pager") {
        try {
          pagerRef.current?.scrollToOffset({ offset: n * pageWidth, animated: true });
        } catch {}
      }
    }
  }, [pageIdx, readingPages.length, isPageLocked, meta?.readingLayout, pageWidth]);

  const prevPage = useCallback(() => {
    if (pageIdx > 0) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      const n = pageIdx - 1;
      setPageIdx(n);
      if (meta?.readingLayout === "pager") {
        try {
          pagerRef.current?.scrollToOffset({ offset: n * pageWidth, animated: true });
        } catch {}
      }
    }
  }, [pageIdx, meta?.readingLayout, pageWidth]);

  const goVipPurchase = useCallback(() => {
    router.push({ pathname: "/(tabs)/vip", params: { entitlement: "vip_access" } } as any);
  }, []);

  const renderPageInner = useCallback(
    (page: BookPage, locked: boolean, m: BookMeta) => {
      if (locked) {
        return (
          <View style={s.lockedPage}>
            <Text style={s.lockedGlyph}>🔒</Text>
            <Text style={s.lockedTitle}>Premium İçerik</Text>
            <Text style={s.lockedText}>
              Bu sayfa ve sonrası VIP erişim gerektirir.{"\n"}
              ₺{m.price} ile tüm kitabı açabilirsin.
            </Text>
            <Pressable style={[s.mainBtn, { backgroundColor: m.color }]} onPress={goVipPurchase}>
              <Text style={s.mainBtnText}>{"VIP\u2019e Geç"}</Text>
            </Pressable>
          </View>
        );
      }
      return (
        <>
          {page.type === "chapter" && (
            <View style={s.chapterHeader}>
              {page.number != null && (
                <Text style={[s.chapterNum, { color: m.color }]}>
                  {typeof page.number === "number" ? `Bölüm ${page.number}` : page.number}
                </Text>
              )}
              <Text style={s.chapterTitle}>{page.title}</Text>
              {page.epigraph ? <Text style={s.epigraph}>{page.epigraph}</Text> : null}
            </View>
          )}
          {page.type === "content" && page.chapterLead && (
            <View style={s.chapterHeader}>
              {page.chapterLead.number != null && page.chapterLead.number !== "" && (
                <Text style={[s.chapterNum, { color: m.color }]}>
                  {typeof page.chapterLead.number === "number"
                    ? `Bölüm ${page.chapterLead.number}`
                    : page.chapterLead.number}
                </Text>
              )}
              <Text style={s.chapterTitle}>{page.chapterLead.title}</Text>
              {page.chapterLead.epigraph ? (
                <Text style={s.epigraph}>{page.chapterLead.epigraph}</Text>
              ) : null}
            </View>
          )}
          {page.type === "cover" && (
            <View style={s.chapterHeader}>
              <Text style={[s.chapterTitle, { color: m.color }]}>{page.title}</Text>
              {page.subtitle && <Text style={s.coverSubtitle}>{page.subtitle}</Text>}
              {page.author && <Text style={s.readAuthor}>{page.author}</Text>}
            </View>
          )}
          {(page.type === "dedication" || page.type === "quote") && (
            <View style={s.quoteBlock}>
              {page.title ? <Text style={s.quoteTitle}>{page.title}</Text> : null}
              <Text style={s.quoteBody}>{page.body}</Text>
            </View>
          )}
          {page.type === "toc" && (
            <View style={s.tocPage}>
              <Text style={s.tocPageTitle}>{page.title}</Text>
              {page.body ? <Text style={s.tocPageBody}>{page.body}</Text> : null}
              {page.items?.map((it, i) => (
                <Text key={i} style={s.tocPageItem}>
                  • {it}
                </Text>
              ))}
            </View>
          )}
          {(page.type === "content" || page.type === "closing") && (
            <View style={s.contentBlock}>
              {page.title ? <Text style={s.contentTitle}>{page.title}</Text> : null}
              {page.body
                ? splitContentParagraphs(page.body).map((para, i) => {
                    const numbered = isNumberedSectionParagraph(para);
                    const kicker = isOpeningKickerParagraph(para);
                    const sub = isSubSectionParagraph(para);
                    return (
                      <View
                        key={`p-${i}`}
                        style={[
                          s.contentParaWrap,
                          numbered && [s.contentParaNumbered, { borderLeftColor: `${m.color}55` }],
                          kicker && s.contentParaKicker,
                          sub && !numbered && s.contentParaSubSection,
                        ]}
                      >
                        <Text
                          style={[
                            s.contentBody,
                            kicker && s.contentBodyKicker,
                            numbered && s.contentBodyNumberedLead,
                          ]}
                        >
                          {para}
                        </Text>
                      </View>
                    );
                  })
                : null}
            </View>
          )}
        </>
      );
    },
    [goVipPurchase]
  );

  /** Piksel kayması / web yatay snap düzeltmesi — getItemLayout ile aynı adım: pageWidth */
  const syncPagerIndexFromEvent = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const vw = e.nativeEvent.layoutMeasurement?.width;
      const step = Math.abs(vw - pageWidth) < 2 ? pageWidth : vw || pageWidth;
      let idx = Math.round(x / Math.max(step, 1));
      idx = Math.max(0, Math.min(readingPages.length - 1, idx));
      setPageIdx(idx);
      const target = idx * pageWidth;
      if (Number.isFinite(target) && Math.abs(x - target) > 2) {
        requestAnimationFrame(() => {
          try {
            pagerRef.current?.scrollToOffset({ offset: target, animated: false });
          } catch {
            /* */
          }
        });
      }
    },
    [pageWidth, readingPages.length]
  );

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
              <Text style={s.coverChapters}>
                {meta.pageCount != null ? `${meta.pageCount} sayfa` : `${meta.chapters.length} bölüm`}
              </Text>
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

          {meta.isPremium && !canAccess && (
            <Pressable style={[s.mainBtn, { backgroundColor: meta.color }]} onPress={goVipPurchase}>
              <Text style={s.mainBtnText}>{`VIP ile satın al · ₺${meta.price}`}</Text>
            </Pressable>
          )}

          <Pressable
            style={
              meta.isPremium && !canAccess ? s.secondBtn : [s.mainBtn, { backgroundColor: meta.color }]
            }
            onPress={() => setFlow("toc")}
          >
            <Text
              style={meta.isPremium && !canAccess ? s.secondBtnText : s.mainBtnText}
            >
              İçindekiler
            </Text>
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
                <Text style={s.tocNum}>
                  {(ch.type === "chapter" ? ch.number : ch.chapterLead?.number) ?? i + 1}
                </Text>
                <Text style={[s.tocChTitle, locked && { color: "rgba(255,255,255,0.25)" }]}>
                  {ch.type === "chapter" ? ch.title : ch.chapterLead?.title ?? ""}
                </Text>
                {locked && <Text style={s.lockIcon}>🔒</Text>}
              </Pressable>
            );
          })}

          {!canAccess && meta.isPremium && (
            <View style={s.lockBanner}>
              <Text style={s.lockBannerTitle}>Premium İçerik</Text>
              <Text style={s.lockBannerText}>
                {`İlk ${maxPreview} sayfa ücretsiz. Devamı için VIP erişim gerekli.`}
              </Text>
              <Pressable
                style={[s.tocBuyBtn, { borderColor: meta.color + "55", backgroundColor: meta.color + "18" }]}
                onPress={goVipPurchase}
              >
                <Text style={[s.tocBuyBtnText, { color: meta.color }]}>{`VIP ile satın al · ₺${meta.price}`}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─── READING ───
  if (usePager) {
    return (
      <View style={s.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={[s.readTopBar, { paddingTop: Math.max(insets.top, 10) + 4 }]}>
          <Pressable onPress={() => setFlow("toc")} hitSlop={12}>
            <Text style={s.back}>← İçindekiler</Text>
          </Pressable>
          <Text style={s.pageCounter}>
            {pageIdx + 1} / {readingPages.length}
          </Text>
        </View>
        <View style={[s.readRow, { paddingHorizontal: EDGE_GUTTER }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Önceki sayfa"
            style={[s.pageTapZone, pageIdx === 0 && s.pageTapDisabled]}
            onPress={prevPage}
            disabled={pageIdx === 0}
          >
            <Text style={s.pageTapChev}>‹</Text>
          </Pressable>
          <FlatList
            ref={pagerRef}
            style={s.pagerList}
            data={readingPages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `pg-${bookId}-${i}`}
            getItemLayout={(_, index) => ({
              length: pageWidth,
              offset: pageWidth * index,
              index,
            })}
            key={`pager-${bookId}`}
            initialScrollIndex={
              pageIdx > 0 && pageIdx < readingPages.length ? pageIdx : undefined
            }
            initialNumToRender={Math.min(readingPages.length, Math.max(12, pageIdx + 4))}
            maxToRenderPerBatch={8}
            windowSize={9}
            removeClippedSubviews={Platform.OS !== "web"}
            onMomentumScrollEnd={syncPagerIndexFromEvent}
            renderItem={({ item, index }: ListRenderItemInfo<BookPage>) => {
              const innerTextW = pageWidth - PAGE_INNER_PAD_H * 2;
              return (
                <View
                  style={[
                    s.pagerPage,
                    { width: pageWidth },
                    Platform.OS === "web" && ({ height: pagerSlotHeight } as object),
                  ]}
                >
                  <View style={[s.bookPageSheet, { borderColor: meta.color + "35" }]}>
                    <ScrollView
                      key={`vscroll-${bookId}-${index}`}
                      style={[
                        s.bookPageScroll,
                        Platform.OS === "web" && ({ touchAction: "pan-y" as const } as object),
                      ]}
                      contentContainerStyle={s.bookPageScrollInner}
                      showsVerticalScrollIndicator
                      nestedScrollEnabled
                      scrollEventThrottle={16}
                      keyboardShouldPersistTaps="handled"
                    >
                      <View style={[s.pageTextColumn, { width: innerTextW, maxWidth: "100%" }]}>
                        {renderPageInner(item, isPageLocked(index), meta)}
                      </View>
                    </ScrollView>
                  </View>
                </View>
              );
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sonraki sayfa"
            style={[
              s.pageTapZone,
              (pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)) && s.pageTapDisabled,
            ]}
            onPress={nextPage}
            disabled={pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)}
          >
            <Text style={s.pageTapChev}>›</Text>
          </Pressable>
        </View>
        <View style={[s.navBar, { paddingBottom: Math.max(insets.bottom, 10) + 6 }]}>
          <View style={s.navBarSpacer} />
          <View style={s.navCluster}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Önceki sayfa"
              style={[s.navRound, pageIdx === 0 && s.navRoundDisabled]}
              onPress={prevPage}
              disabled={pageIdx === 0}
            >
              <Text style={s.navRoundTxt}>‹</Text>
            </Pressable>
            <Text style={s.navMiniCount}>
              {pageIdx + 1} / {readingPages.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sonraki sayfa"
              style={[
                s.navRound,
                (pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)) && s.navRoundDisabled,
              ]}
              onPress={nextPage}
              disabled={pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)}
            >
              <Text style={s.navRoundTxt}>›</Text>
            </Pressable>
          </View>
          <View style={s.navBarSpacer} />
        </View>
      </View>
    );
  }

  const page = readingPages[pageIdx];
  if (!page) {
    setFlow("cover");
    return null;
  }

  const locked = isPageLocked(pageIdx);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[s.readTopBar, { paddingTop: Math.max(insets.top, 10) + 4 }]}>
        <Pressable onPress={() => setFlow("toc")} hitSlop={12}>
          <Text style={s.back}>← İçindekiler</Text>
        </Pressable>
        <Text style={s.pageCounter}>
          {pageIdx + 1} / {readingPages.length}
        </Text>
      </View>

      <View style={[s.readRow, { paddingHorizontal: EDGE_GUTTER }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Önceki sayfa"
          style={[s.pageTapZone, pageIdx === 0 && s.pageTapDisabled]}
          onPress={prevPage}
          disabled={pageIdx === 0}
        >
          <Text style={s.pageTapChev}>‹</Text>
        </Pressable>

        <Animated.ScrollView
          style={[s.scroll, s.readScroll, { opacity: fadeAnim }]}
          contentContainerStyle={[s.readPad, { paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {renderPageInner(page, locked, meta)}
        </Animated.ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sonraki sayfa"
          style={[
            s.pageTapZone,
            (pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)) && s.pageTapDisabled,
          ]}
          onPress={nextPage}
          disabled={pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)}
        >
          <Text style={s.pageTapChev}>›</Text>
        </Pressable>
      </View>

      <View style={[s.navBar, { paddingBottom: Math.max(insets.bottom, 10) + 6 }]}>
        <View style={s.navBarSpacer} />
        <View style={s.navCluster}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Önceki sayfa"
            style={[s.navRound, pageIdx === 0 && s.navRoundDisabled]}
            onPress={prevPage}
            disabled={pageIdx === 0}
          >
            <Text style={s.navRoundTxt}>‹</Text>
          </Pressable>
          <Text style={s.navMiniCount}>
            {pageIdx + 1} / {readingPages.length}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sonraki sayfa"
            style={[
              s.navRound,
              (pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)) && s.navRoundDisabled,
            ]}
            onPress={nextPage}
            disabled={pageIdx >= readingPages.length - 1 || isPageLocked(pageIdx + 1)}
          >
            <Text style={s.navRoundTxt}>›</Text>
          </Pressable>
        </View>
        <View style={s.navBarSpacer} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    ...Platform.select({ web: { minHeight: "100vh" } as object, default: {} }),
  },
  scroll: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 18, paddingTop: 28, paddingBottom: 80 },
  readPad: { padding: 16, paddingTop: 6 },
  readRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 0,
    ...Platform.select({ web: { flexBasis: 0 } as object, default: {} }),
  },
  readScroll: { flex: 1, minWidth: 0 },
  pageTapZone: {
    width: TAP_ZONE_W,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    opacity: 0.55,
  },
  pageTapDisabled: { opacity: 0.18 },
  pageTapChev: { color: ACCENT, fontSize: 28, fontWeight: "200", marginTop: -2 },

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
  tocBuyBtn: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  tocBuyBtnText: { fontSize: 13, fontWeight: "900" },

  readTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  pageCounter: { color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: "700" },

  pagerList: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    ...Platform.select({ web: { height: "100%", alignSelf: "stretch" } as object, default: {} }),
  },
  pagerPage: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignSelf: "stretch",
    minHeight: 0,
    ...Platform.select({ web: { height: "100%", maxHeight: "100%" } as object, default: {} }),
  },
  bookPageSheet: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.045)",
    overflow: "hidden",
    minHeight: 0,
    ...Platform.select({
      web: {
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      } as object,
      default: {},
    }),
  },
  bookPageScroll: {
    flex: 1,
    width: "100%",
    minHeight: 0,
    ...Platform.select({
      web: {
        flexGrow: 1,
        minHeight: 0,
        maxHeight: "100%",
        overflowY: "scroll",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      } as object,
      default: {},
    }),
  },
  /** flexGrow: 0 — içerik doğal yükseklikte; dikey ScrollView kesmeden kayar. */
  bookPageScrollInner: {
    padding: PAGE_INNER_PAD_H,
    paddingBottom: 28,
    width: "100%",
    alignSelf: "stretch",
    flexGrow: 0,
    ...Platform.select({ web: { boxSizing: "border-box" } as object, default: {} }),
  },
  /** Metin genişliğini sayfaya kilitle (özellikle web’de tek satır ölçümünü önler) */
  pageTextColumn: { alignSelf: "center" },

  chapterHeader: { marginBottom: 24 },
  chapterNum: { fontSize: 13, fontWeight: "800", letterSpacing: 1.5, marginBottom: 6 },
  chapterTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 32,
    marginBottom: 10,
    ...Platform.select({
      web: { whiteSpace: "normal", maxWidth: "100%", wordBreak: "break-word" } as object,
      default: {},
    }),
  },
  epigraph: { color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 24, fontStyle: "italic", marginTop: 4 },
  coverSubtitle: { color: "rgba(255,255,255,0.6)", fontSize: 16, fontWeight: "600", marginBottom: 6 },
  readAuthor: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "600" },

  quoteBlock: { marginBottom: 20, paddingLeft: 16, borderLeftWidth: 3, borderLeftColor: "rgba(124,247,216,0.3)" },
  quoteTitle: { color: ACCENT, fontSize: 15, fontWeight: "800", marginBottom: 8 },
  quoteBody: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    lineHeight: 26,
    fontStyle: "italic",
    ...Platform.select({
      web: { whiteSpace: "normal", maxWidth: "100%", wordBreak: "break-word" } as object,
      default: {},
    }),
  },

  tocPage: { marginBottom: 20 },
  tocPageTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  tocPageBody: { color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 12 },
  tocPageItem: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 24, paddingLeft: 8 },

  contentBlock: { marginBottom: 20, width: "100%", alignSelf: "stretch" },
  contentParaWrap: {
    marginBottom: 12,
    width: "100%",
  },
  contentParaKicker: {
    marginBottom: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  contentParaNumbered: {
    marginTop: 6,
    paddingTop: 12,
    paddingBottom: 6,
    paddingLeft: 12,
    marginBottom: 18,
    borderLeftWidth: 3,
  },
  contentParaSubSection: {
    marginTop: 10,
    paddingTop: 8,
    marginBottom: 14,
  },
  contentBodyKicker: {
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  contentBodyNumberedLead: {
    fontWeight: "600",
  },
  contentTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 12,
    width: "100%",
    flexShrink: 1,
  },
  contentBody: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    lineHeight: 28,
    width: "100%",
    flexShrink: 1,
    ...Platform.select({
      web: {
        wordBreak: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        maxWidth: "100%",
      } as object,
      default: {},
    }),
  },

  lockedPage: { alignItems: "center", paddingTop: 60 },
  lockedGlyph: { fontSize: 48, marginBottom: 16 },
  lockedTitle: { color: "#eab308", fontSize: 18, fontWeight: "900", marginBottom: 8 },
  lockedText: { color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 24 },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: BG,
  },
  navBarSpacer: { flex: 1, minWidth: 0 },
  navCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  navRound: {
    minWidth: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },
  navRoundDisabled: { opacity: 0.32 },
  navRoundTxt: { color: ACCENT, fontSize: 26, fontWeight: "300", marginTop: -2 },
  navMiniCount: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "700", minWidth: 56, textAlign: "center" },
});
