import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Alert,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";

import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";
import { API, apiGetJson, apiDeleteJson } from "../../lib/apiClient";
import { openManageSubscriptions } from "../../lib/revenuecat";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

type ProfileResponse = {
  user_id: number | string;
  data?: {
    name?: string;
    dominant_emotion?: string;
    intent?: string;
    pattern?: string;
    last_message?: string;
    sanri_level?: number;
    sanri_archetype?: string;
    sanri_tone?: string;
  };
  updated_at?: string | null;
};

type MemoryItem = {
  type: string;
  content: string;
  created_at?: string | null;
};

const T = {
  tr: {
    pageTitle: "Benim Alanım",
    pageSubtitle: "Sanrı burada seni tanımaya başlar.",
    personalField: "Kişisel bilinç alanı",
    memoryCount: "hafıza izi",
    level: "Seviye",
    profile: "Sanrı Profili",
    emotion: "Duygu",
    intent: "Niyet",
    pattern: "Örüntü",
    archetype: "Arketip",
    tone: "Ton",
    reading: "Sanrı Seni Nasıl Görüyor",
    reading1: "Şu an baskın niyetin",
    reading2: "olarak okunuyor.",
    reading3: "İç alandaki baskın duygu",
    reading4: "Sanrı bu yüzden",
    reading5: "tonda ve",
    reading6: "arketibiyle sana yanıt veriyor.",
    memories: "Son Hafıza İzleri",
    empty: "Henüz kayıtlı hafıza yok. İlk izini bıraktığında bu alan canlanacak.",
    deepen: "Derinleş",
    retry: "Tekrar Dene",
    systemWarn: "Sistem uyarısı",
    loadError: "Alan yüklenemedi.",
    loading: "Sanrı alanı yükleniyor...",
    you: "sen",
    sanri: "sanrı",
    auto: "otomatik",
  },
  en: {
    pageTitle: "My Area",
    pageSubtitle: "Sanri begins to know you here.",
    personalField: "Personal consciousness field",
    memoryCount: "memory traces",
    level: "Level",
    profile: "Sanri Profile",
    emotion: "Emotion",
    intent: "Intent",
    pattern: "Pattern",
    archetype: "Archetype",
    tone: "Tone",
    reading: "How Sanri Sees You",
    reading1: "Your dominant intent is currently read as",
    reading2: ".",
    reading3: "The dominant inner emotion is",
    reading4: "So Sanri responds in a",
    reading5: "tone with the",
    reading6: "archetype.",
    memories: "Recent Memory Traces",
    empty: "No memory has been recorded yet. This area will awaken when you leave your first trace.",
    deepen: "Go Deeper",
    retry: "Retry",
    systemWarn: "System warning",
    loadError: "Area could not be loaded.",
    loading: "Loading Sanri field...",
    you: "you",
    sanri: "sanri",
    auto: "auto",
  },
} as const;

function mapEmotion(value?: string, lang: Lang = "tr") {
  const tr: Record<string, string> = {
    neutral: "Nötr",
    fear: "Korku",
    loneliness: "Yalnızlık",
    love: "Sevgi",
  };
  const en: Record<string, string> = {
    neutral: "Neutral",
    fear: "Fear",
    loneliness: "Loneliness",
    love: "Love",
  };
  const source = lang === "tr" ? tr : en;
  return source[String(value || "").toLowerCase()] || value || (lang === "tr" ? "Nötr" : "Neutral");
}

function mapIntent(value?: string, lang: Lang = "tr") {
  const tr: Record<string, string> = {
    reflection: "Yansıma",
    memory: "Hafıza",
    direction: "Yön arayışı",
  };
  const en: Record<string, string> = {
    reflection: "Reflection",
    memory: "Memory",
    direction: "Direction seeking",
  };
  const source = lang === "tr" ? tr : en;
  return source[String(value || "").toLowerCase()] || value || (lang === "tr" ? "Yansıma" : "Reflection");
}

function mapPattern(value?: string, lang: Lang = "tr") {
  const tr: Record<string, string> = {
    general: "Genel akış",
    past_reference: "Geçmiş referansı",
    emotional_signal: "Duygusal sinyal",
    inner_void: "İç boşluk",
    guidance_need: "Rehberlik ihtiyacı",
    heart_signal: "Kalp sinyali",
  };
  const en: Record<string, string> = {
    general: "General flow",
    past_reference: "Past reference",
    emotional_signal: "Emotional signal",
    inner_void: "Inner void",
    guidance_need: "Need for guidance",
    heart_signal: "Heart signal",
  };
  const source = lang === "tr" ? tr : en;
  return source[String(value || "").toLowerCase()] || value || (lang === "tr" ? "Genel akış" : "General flow");
}

function mapArchetype(value?: string, lang: Lang = "tr") {
  const tr: Record<string, string> = {
    mirror: "Ayna",
    rememberer: "Hatırlayan",
    heart_reader: "Kalp Okuyucu",
    path_opener: "Yol Açıcı",
    deep_witness: "Derin Tanık",
  };
  const en: Record<string, string> = {
    mirror: "Mirror",
    rememberer: "Rememberer",
    heart_reader: "Heart Reader",
    path_opener: "Path Opener",
    deep_witness: "Deep Witness",
  };
  const source = lang === "tr" ? tr : en;
  return source[String(value || "").toLowerCase()] || value || (lang === "tr" ? "Ayna" : "Mirror");
}

function mapTone(value?: string, lang: Lang = "tr") {
  const tr: Record<string, string> = {
    clear: "Berrak",
    direct: "Doğrudan",
    warm: "Sıcak",
    focused: "Odaklı",
    deep: "Derin",
  };
  const en: Record<string, string> = {
    clear: "Clear",
    direct: "Direct",
    warm: "Warm",
    focused: "Focused",
    deep: "Deep",
  };
  const source = lang === "tr" ? tr : en;
  return source[String(value || "").toLowerCase()] || value || (lang === "tr" ? "Berrak" : "Clear");
}

function mapMemoryType(value?: string, lang: Lang = "tr") {
  const key = String(value || "").toLowerCase();
  if (lang === "tr") {
    if (key === "user") return "sen";
    if (key === "ai") return "sanrı";
    return "otomatik";
  }
  if (key === "user") return "you";
  if (key === "ai") return "sanri";
  return "auto";
}

function getDisplayName(profileName?: string, authName?: string, authEmail?: string) {
  const raw = profileName || authName || authEmail || "Sen";
  const safe = String(raw).trim();
  if (safe.includes("@")) return safe.split("@")[0];
  return safe;
}

function cleanMemoryContent(text?: string) {
  const raw = String(text || "").trim();
  if (!raw) return "";
  return raw.replace(/\s+/g, " ");
}

export default function MyAreaScreen() {
  const { user, logout } = useAuth();

  const [lang, setLang] = useState<Lang>("tr");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = useMemo(() => T[lang], [lang]);

  const load = useCallback(async () => {
    try {
      setError(null);

      const [profileRes, memoryRes] = await Promise.all([
        apiGetJson(`${API.base}/bilinc-alani/profile`, 20000).catch(() => null),
        apiGetJson(`${API.base}/bilinc-alani/memory`, 20000).catch(() => []),
      ]);

      setProfile(profileRes?.data || null);
      setMemories(Array.isArray(memoryRes) ? memoryRes : []);
    } catch (e) {
      if (__DEV__) console.log("my_area load error:", e);
      setError(t.loadError);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t.loadError]);

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

  const displayName = getDisplayName(profile?.name, user?.name, user?.email);
  const emotion = mapEmotion(profile?.dominant_emotion, lang);
  const intent = mapIntent(profile?.intent, lang);
  const pattern = mapPattern(profile?.pattern, lang);
  const sanriLevel = profile?.sanri_level || 1;
  const sanriArchetype = mapArchetype(profile?.sanri_archetype, lang);
  const sanriTone = mapTone(profile?.sanri_tone, lang);

  const recentMemories = memories
    .filter((item) => item?.content)
    .slice(0, 6);

  if (loading) {
    return (
      <View style={styles.loadingRoot}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#8df5d2" />
        <Text style={styles.loadingText}>{t.loading}</Text>
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
        <View style={styles.topRow}>
          <Pressable onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backTxt}>←</Text>
          </Pressable>

          <View style={styles.langRow}>
            <Pressable
              onPress={() => setLang("tr")}
              style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            >
              <Text style={[styles.langText, lang === "tr" && styles.langTextActive]}>TR</Text>
            </Pressable>

            <Pressable
              onPress={() => setLang("en")}
              style={[styles.langChip, lang === "en" && styles.langChipActive]}
            >
              <Text style={[styles.langText, lang === "en" && styles.langTextActive]}>EN</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.kicker}>MY AREA</Text>
        <Text style={styles.title}>{t.pageTitle}</Text>
        <Text style={styles.subtitle}>{t.pageSubtitle}</Text>

        {error ? (
          <BlurView intensity={30} tint="dark" style={styles.errorCard}>
            <Text style={styles.errorTitle}>{t.systemWarn}</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>{t.retry}</Text>
            </Pressable>
          </BlurView>
        ) : null}

        <BlurView intensity={34} tint="dark" style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(String(displayName).slice(0, 1) || "S").toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileContent}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.profileSub}>{t.personalField}</Text>

            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {memories.length} {t.memoryCount}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {t.level} {sanriLevel}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{sanriArchetype}</Text>
              </View>
            </View>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t.profile}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.emotion}</Text>
            <Text style={styles.infoValue}>{emotion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.intent}</Text>
            <Text style={styles.infoValue}>{intent}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.pattern}</Text>
            <Text style={styles.infoValue}>{pattern}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t.archetype}</Text>
            <Text style={styles.infoValue}>{sanriArchetype}</Text>
          </View>

          <View style={styles.infoRowNoBorder}>
            <Text style={styles.infoLabel}>{t.tone}</Text>
            <Text style={styles.infoValue}>{sanriTone}</Text>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t.reading}</Text>
          <Text style={styles.sectionBody}>
            {t.reading1} <Text style={styles.highlight}>"{intent}"</Text> {t.reading2}
          </Text>
          <Text style={styles.sectionBody}>
            {t.reading3} <Text style={styles.highlight}>"{emotion}"</Text>.
          </Text>
          <Text style={styles.sectionBody}>
            {t.reading4} <Text style={styles.highlight}>"{sanriTone}"</Text> {t.reading5}{" "}
            <Text style={styles.highlight}>"{sanriArchetype}"</Text> {t.reading6}
          </Text>

          <Pressable
            onPress={() => router.push("/(tabs)/sanri_flow")}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnTxt}>{t.deepen}</Text>
          </Pressable>
        </BlurView>

        <BlurView intensity={30} tint="dark" style={styles.memoryCard}>
          <Text style={styles.sectionTitle}>{t.memories}</Text>

          {recentMemories.length === 0 ? (
            <Text style={styles.emptyText}>{t.empty}</Text>
          ) : (
            recentMemories.map((item, index) => (
              <View key={`${item.type}-${index}`} style={styles.memoryItem}>
                <View style={styles.memoryTypeWrap}>
                  <Text style={styles.memoryType}>{mapMemoryType(item.type, lang)}</Text>
                </View>

                <Text style={styles.memoryContent}>
                  {cleanMemoryContent(item.content)}
                </Text>
              </View>
            ))
          )}
        </BlurView>

        <View style={styles.accountSection}>
          <Text style={styles.accountSectionTitle}>
            {lang === "tr" ? "Hesap" : "Account"}
          </Text>

          <Pressable
            style={styles.accountBtn}
            onPress={() => {
              openManageSubscriptions().catch(() => {});
            }}
          >
            <Text style={styles.accountBtnText}>
              {lang === "tr" ? "Abonelikleri Yonet" : "Manage Subscriptions"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.accountBtn}
            onPress={() => Linking.openURL("https://asksanri.com/privacy")}
          >
            <Text style={styles.accountBtnText}>
              {lang === "tr" ? "Gizlilik Politikasi" : "Privacy Policy"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.accountBtn}
            onPress={() => Linking.openURL("https://asksanri.com/terms")}
          >
            <Text style={styles.accountBtnText}>
              {lang === "tr" ? "Kullanim Sartlari" : "Terms of Use"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.accountBtn}
            onPress={() => {
              router.push("/(auth)/change-password" as any);
            }}
          >
            <Text style={styles.accountBtnText}>
              {lang === "tr" ? "Şifre Değiştir" : "Change Password"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert(
                lang === "tr" ? "Çıkış Yap" : "Log Out",
                lang === "tr"
                  ? "Hesabından çıkış yapmak istediğinden emin misin?"
                  : "Are you sure you want to log out?",
                [
                  { text: lang === "tr" ? "İptal" : "Cancel", style: "cancel" },
                  {
                    text: lang === "tr" ? "Çıkış Yap" : "Log Out",
                    onPress: async () => {
                      await logout();
                      router.replace("/(auth)/login" as any);
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.logoutText}>
              {lang === "tr" ? "Çıkış Yap" : "Log Out"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteAccountBtn}
            onPress={() => {
              Alert.alert(
                lang === "tr" ? "Hesabi Sil" : "Delete Account",
                lang === "tr"
                  ? "Hesabini kalici olarak silmek istedigindan emin misin? Bu islem geri alinamaz."
                  : "Are you sure you want to permanently delete your account? This action cannot be undone.",
                [
                  {
                    text: lang === "tr" ? "Iptal" : "Cancel",
                    style: "cancel",
                  },
                  {
                    text: lang === "tr" ? "Hesabi Sil" : "Delete Account",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await apiDeleteJson(`${API.base}/auth/account`);
                        await logout();
                        router.replace("/(auth)/login" as any);
                      } catch (e: any) {
                        Alert.alert(
                          "Error",
                          e?.message || "Account deletion failed"
                        );
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteAccountText}>
              {lang === "tr" ? "Hesabimi Sil" : "Delete My Account"}
            </Text>
          </Pressable>
        </View>
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
  topRow: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  backTxt: {
    color: "#8df5d2",
    fontSize: 24,
    fontWeight: "700",
    marginTop: -2,
  },
  langRow: {
    flexDirection: "row",
    gap: 10,
  },
  langChip: {
    minWidth: 58,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(141,245,210,0.12)",
    borderColor: "rgba(141,245,210,0.25)",
  },
  langText: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "800",
    fontSize: 15,
  },
  langTextActive: {
    color: "#8df5d2",
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
    fontSize: 30,
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
    minWidth: 0,
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
  sectionTitle: {
    color: "#8df5d2",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  infoRowNoBorder: {
    paddingTop: 8,
  },
  infoLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionBody: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 10,
  },
  highlight: {
    color: "#8df5d2",
    fontWeight: "800",
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
  memoryCard: {
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  memoryItem: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  memoryTypeWrap: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(141,245,210,0.12)",
    marginBottom: 8,
  },
  memoryType: {
    color: "#8df5d2",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  memoryContent: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 22,
  },
  emptyText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 24,
  },
  accountSection: {
    marginTop: 24,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  accountSectionTitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  accountBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  accountBtnText: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "700",
    fontSize: 15,
  },
  logoutBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "rgba(94,59,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.25)",
  },
  logoutText: {
    color: "#cbbcff",
    fontWeight: "700",
    fontSize: 15,
  },
  deleteAccountBtn: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,60,60,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,60,60,0.20)",
  },
  deleteAccountText: {
    color: "rgba(255,90,90,0.90)",
    fontWeight: "700",
    fontSize: 15,
  },
});