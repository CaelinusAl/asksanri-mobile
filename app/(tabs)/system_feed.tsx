import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { API, apiGetJson } from "../../lib/apiClient";
import MatrixRain from "../../lib/MatrixRain";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type RawSystemFeed = {
  id?: number | string;
  created_at?: string | null;
  kind?: string;
  title?: string;
  subtitle?: string;
  body_tr?: string;
  body_en?: string;
  source_url?: string;
  tags?: string;
  warning?: string;
};

type UiSystemFeed = {
  signal: string;
  symbol: string;
  message: string;
  action: string;
  share: string;
};

const MATRIX_BG = require("../../assets/sanri_glass_bg.jpg")

function normalizeFeed(data: RawSystemFeed, lang: "tr" | "en"): UiSystemFeed {
  const title = String(data?.title || "").trim();
  const subtitle = String(data?.subtitle || "").trim();
  const message =
    lang === "tr"
      ? String(data?.body_tr || "").trim()
      : String(data?.body_en || "").trim();
  const tags = String(data?.tags || "").trim();
  const sourceUrl = String(data?.source_url || "").trim();

  return {
    signal: title || (lang === "tr" ? "Sinyal alındı." : "Signal received."),
    symbol:
      subtitle ||
      (lang === "tr"
        ? "Sistem yeni bir katman açıyor."
        : "System is opening a new layer."),
    message:
      message ||
      (lang === "tr"
        ? "Bugün sistem senden netlik istiyor."
        : "Today the system asks for clarity."),
    action:
      tags ||
      (lang === "tr"
        ? "Bir cümle yaz. Bir karar seç. Bir adım at."
        : "Write one sentence. Choose one decision. Take one step."),
    share:
      sourceUrl ||
      (lang === "tr"
        ? "Bugünün sinyalini kendinle paylaş."
        : "Share today's signal with yourself."),
  };
}

export default function SystemFeedScreen() {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [rawFeed, setRawFeed] = useState<RawSystemFeed | null>(null);

  const feed = useMemo(() => normalizeFeed(rawFeed || {}, lang), [rawFeed, lang]);

  const fetchFeed = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const data: any = await apiGetJson(`${API.base}/content/system-feed?lang=${lang}`, 15000);
      setRawFeed(data || {});
    } catch (e: any) {
      setError(e?.message || "System feed alınamadı.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchFeed(false);
  }, [fetchFeed]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground source={MATRIX_BG} style={styles.bg} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <View style={styles.greenTint} />
        <View style={styles.purpleGlow} />
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <MatrixRain opacity={0.16} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchFeed(true)}
              tintColor="#ffffff"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>

            <View style={styles.langRow}>
              <Pressable
                style={[styles.langButton, lang === "tr" && styles.langButtonActive]}
                onPress={() => setLang("tr")}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    lang === "tr" && styles.langButtonTextActive,
                  ]}
                >
                  TR
                </Text>
              </Pressable>

              <Pressable
                style={[styles.langButton, lang === "en" && styles.langButtonActive]}
                onPress={() => setLang("en")}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    lang === "en" && styles.langButtonTextActive,
                  ]}
                >
                  EN
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.eyebrow}>SYSTEM TERMINAL</Text>
          <Text style={styles.title}>SYSTEM FEED</Text>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Sistem akışı yükleniyor...</Text>
            </View>
          ) : error ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>ERROR</Text>
              <Text style={styles.cardText}>{error}</Text>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>SIGNAL</Text>
                <Text style={styles.cardText}>{feed.signal}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>SYMBOL</Text>
                <Text style={styles.cardText}>{feed.symbol}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>MESSAGE</Text>
                <Text style={styles.cardText}>{feed.message}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>ACTION</Text>
                <Text style={styles.cardText}>{feed.action}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>SHARE</Text>
                <Text style={styles.cardText}>{feed.share}</Text>
              </View>

              <Pressable style={styles.bigButton} onPress={() => fetchFeed(false)}>
                <Text style={styles.bigButtonText}>Refresh Feed</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#02030A",
  },
  bg: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,4,12,0.60)",
  },
  greenTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,255,170,0.06)",
  },
  purpleGlow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(140,80,255,0.18)",
    bottom: -80,
    left: -40,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingTop: SAFE_TOP,
    paddingBottom: 80,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  backText: {
    color: "#D8FFF6",
    fontSize: 16,
    fontWeight: "700",
  },
  langRow: {
    flexDirection: "row",
    gap: 10,
  },
  langButton: {
    minWidth: 56,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langButtonActive: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  langButtonText: {
    color: "rgba(255,255,255,0.78)",
    fontWeight: "800",
  },
  langButtonTextActive: {
    color: "#C2FFF3",
  },
  eyebrow: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
    letterSpacing: 2.4,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 18,
  },
  loadingCard: {
    borderRadius: 26,
    padding: 24,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  loadingText: {
    color: "#EAFBF6",
    marginTop: 12,
    textAlign: "center",
  },
  card: {
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginBottom: 18,
    backgroundColor: "rgba(16,18,30,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardLabel: {
    color: "#8BFFF1",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  cardText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
  },
  bigButton: {
    marginTop: 8,
    backgroundColor: "#5D3CF2",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
  },
  bigButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});