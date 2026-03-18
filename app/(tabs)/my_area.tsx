import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ImageBackground,
  StatusBar,

  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";
import { API, apiGetJson } from "../../lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type MeResponse = {
  id: number | string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  birth_date?: string | null;
  is_verified?: boolean;
  role?: string;
  plan?: string;
  is_premium?: boolean;
  premium_until?: string | null;
  premium_source?: string | null;
  matrix_role_unlocked?: boolean;
  last_login_at?: string | null;
  last_seen_at?: string | null;
};

type InsightResponse = {
  theme?: string;
  focus?: string;
  symbol?: string;
  ritual_direction?: string;
  next_area?: string;
  raw_json?: any;
};

type MemoryItem = {
  id: number | string;
  type: string;
  content: string;
  created_at?: string | null;
};

export default function MyAreaScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
  try {
    setError(null);

    const meData = await apiGetJson(`${API.base}/auth/me`, 20000);
    setMe(meData || null);

    const [insightData, memoryData] = await Promise.all([
      apiGetJson(`${API.base}/insights`, 20000).catch(() => null),
      apiGetJson(`${API.base}/memory/${meData.id}`, 20000).catch(() => []),
    ]);

    setInsight(insightData || null);
    setMemories(Array.isArray(memoryData) ? memoryData : []);
  } catch (e: any) {
    console.log("my_area load error:", e);
    setError("Alan yüklenemedi. API bağlantısını ve token akışını kontrol et.");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/gates");
  };

  const displayName =
    me?.name ||
    user?.name ||
    me?.email ||
    user?.email ||
    me?.phone ||
    user?.phone ||
    "Guest";

  const badgeText = me?.is_premium
    ? "PREMIUM"
    : (me?.plan || me?.role || "FREE").toUpperCase();

  const memoryCount = memories.length;

  if (loading) {
    return (
      <View style={styles.loadingRoot}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#8df5d2" />
        <Text style={styles.loadingText}>Sanrı alanı yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <MatrixRain opacity={0.12} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={styles.glowLeft} />
      <View pointerEvents="none" style={styles.glowRight} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8df5d2"
          />
        }
      >
        <Pressable onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.kicker}>MY AREA</Text>
        <Text style={styles.title}>Benim Alanım</Text>
        <Text style={styles.subtitle}>Sanrı burada seni hatırlamaya başlar.</Text>

        {error ? (
          <BlurView intensity={30} tint="dark" style={styles.errorCard}>
            <Text style={styles.errorTitle}>Sistem uyarısı</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>Tekrar Dene</Text>
            </Pressable>
          </BlurView>
        ) : null}

        <BlurView intensity={34} tint="dark" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(String(displayName).slice(0, 1) || "G").toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileContent}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.profileSub}>Kişisel bilinç alanı</Text>

            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{memoryCount} hafıza izi</Text>
              </View>

              {me?.is_verified ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              ) : null}
            </View>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
          <Text style={styles.sectionMini}>Bugünün Frekansı</Text>
          <Text style={styles.sectionBig}>{insight?.theme || "Yumuşama"}</Text>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sanrı Insight</Text>
          <Text style={styles.sectionBody}>
            {insight?.focus ||
              `${displayName}, bugün bastırdığın bir his çözülmek isteyebilir.`}
          </Text>

          <Pressable
            onPress={() => router.push("/(tabs)/sanri_flow")}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnTxt}>Derinleş</Text>
          </Pressable>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bugünün bildirimi</Text>
          <Text style={styles.sectionBody}>
            {insight?.ritual_direction || "Bir ritüel tamamlanmak istiyor."}
          </Text>
        </BlurView>

        <View style={styles.grid}>
          <Pressable
            onPress={() => router.push("/profile" as any)}
            style={styles.gridCard}
          >
            <BlurView intensity={28} tint="dark" style={styles.gridInner}>
              <Text style={styles.gridTitle}>Profil</Text>
              <Text style={styles.gridDesc}>kimlik bilgilerin</Text>
            </BlurView>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/memory")}
            style={styles.gridCard}
          >
            <BlurView intensity={28} tint="dark" style={styles.gridInner}>
              <Text style={styles.gridTitle}>Hafızam</Text>
              <Text style={styles.gridDesc}>kaydedilen temalar</Text>
            </BlurView>
          </Pressable>

          <Pressable
            onPress={() => router.push("/rituel-history" as any)}
            style={styles.gridCard}
          >
            <BlurView intensity={28} tint="dark" style={styles.gridInner}>
              <Text style={styles.gridTitle}>Ritüel Geçmişim</Text>
              <Text style={styles.gridDesc}>Sanrı’nın önerileri</Text>
            </BlurView>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/sanri_flow")}
            style={styles.gridCard}
          >
            <BlurView intensity={28} tint="dark" style={styles.gridInner}>
              <Text style={styles.gridTitle}>System Feed</Text>
              <Text style={styles.gridDesc}>sistem feed ve analizler</Text>
            </BlurView>
          </Pressable>
        </View>

        <BlurView intensity={28} tint="dark" style={styles.memoryCard}>
          <Text style={styles.sectionTitle}>Son Hafıza İzleri</Text>

          {memories.length === 0 ? (
            <Text style={styles.emptyText}>
              Henüz kayıtlı hafıza yok. İlk izini bıraktığında bu alan canlanacak.
            </Text>
          ) : (
            memories.slice(0, 5).map((item) => (
              <View key={String(item.id)} style={styles.memoryItem}>
                <View style={styles.memoryTypeWrap}>
                  <Text style={styles.memoryType}>{item.type || "auto"}</Text>
                </View>

                <Text style={styles.memoryContent} numberOfLines={3}>
                  {item.content}
                </Text>
              </View>
            ))
          )}
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05060B",
  },
  loadingRoot: {
    flex: 1,
    backgroundColor: "#05060B",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,18,0.56)",
  },
  glowLeft: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 180,
    top: 110,
    left: -110,
    backgroundColor: "rgba(84,255,207,0.10)",
  },
  glowRight: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    bottom: -100,
    right: -100,
    backgroundColor: "rgba(104,92,255,0.12)",
  },
  scrollContent: {
    paddingTop: 64,
    paddingBottom: 40,
    paddingHorizontal: 18,
  },
  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 18,
  },
  backTxt: {
    color: "#8df5d2",
    fontSize: 24,
    fontWeight: "700",
    marginTop: -2,
  },
  kicker: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    letterSpacing: 4,
    marginBottom: 8,
    fontWeight: "700",
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 10,
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
  },
  errorCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.16)",
    backgroundColor: "rgba(30,10,12,0.34)",
  },
  errorTitle: {
    color: "#ffb0b0",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  errorText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  retryTxt: {
    color: "white",
    fontWeight: "700",
  },
  profileCard: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(116,92,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
  },
  profileContent: {
    flex: 1,
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },
  profileSub: {
    marginTop: 4,
    color: "rgba(255,255,255,0.74)",
    fontSize: 15,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(141,245,210,0.16)",
  },
  badgeText: {
    color: "#8df5d2",
    fontSize: 13,
    fontWeight: "800",
  },
  sectionCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sectionMini: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionBig: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#8df5d2",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  sectionBody: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 17,
    lineHeight: 30,
  },
  primaryBtn: {
    marginTop: 18,
    alignSelf: "flex-start",
    borderRadius: 18,
    backgroundColor: "rgba(98,61,255,0.95)",
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  primaryBtnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  grid: {
    gap: 14,
    marginBottom: 16,
  },
  gridCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  gridInner: {
    minHeight: 104,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
  },
  gridTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  gridDesc: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 15,
  },
  memoryCard: {
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  emptyText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 15,
    lineHeight: 24,
  },
  memoryItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  memoryTypeWrap: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 8,
  },
  memoryType: {
    color: "#8df5d2",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  memoryContent: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 24,
  },
});