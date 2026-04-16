// app/(tabs)/gates.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ENTITLEMENT_META,
  type EntitlementId,
} from "../../lib/premium";
import { useEntitlementStore } from "../../lib/entitlementStore";
import { useAuth } from "../../context/AuthContext";

const DOOR_BG = require("../../assets/door_holo.jpg");

type Lang = "tr" | "en";

type GateItemType = {
  title: string;
  sub: string;
  route: string;
  entitlement?: EntitlementId;
};

const GATE_ICONS: Record<string, string> = {
  SANRI: "◈",
  "UYANAN ŞEHİRLER": "◎",
  MATRIX: "⬡",
  "KOD OKUMA": "⟁",
  "RİTÜEL ALANI": "☽",
  "OKUMA ALANI": "⊛",
  "KÜTÜPHANE": "⊞",
  "ANLAŞILMA ALANI": "∞",
  "AWAKENED CITIES": "◎",
  "CODE READING": "⟁",
  "RITUAL SPACE": "☽",
  "READING AREA": "⊛",
  LIBRARY: "⊞",
  UNDERSTANDING: "∞",
};

const COPY: Record<
  Lang,
  { title: string; sub: string; items: GateItemType[] }
> = {
  tr: {
    title: "Kapılar",
    sub: "Her kapı bir hatırlatma.\nHangisi seni çağırıyor?",
    items: [
      { title: "SANRI", sub: "Kişisel yansıma alanı", route: "/(tabs)/sanri_flow" },
      { title: "UYANAN ŞEHİRLER", sub: "Şehrin kodunu seç", route: "/(tabs)/awakenedCities" },
      { title: "MATRIX", sub: "Akışı decode et", route: "/(tabs)/matrix", entitlement: "vip_access" },
      { title: "KOD OKUMA", sub: "Gerçekliğin kodunu oku", route: "/(tabs)/ust_bilinc", entitlement: "code_training_access" },
      { title: "RİTÜEL ALANI", sub: "Oku, hisset, dinle", route: "/(tabs)/rituals", entitlement: "vip_access" },
      { title: "OKUMA ALANI", sub: "Gerçekliğin kodlarını çöz, derinliğe in", route: "/(tabs)/world_events" },
      { title: "KÜTÜPHANE", sub: "Tüm SANRI okuma modülleri", route: "/(tabs)/system_feed" },
      { title: "ANLAŞILMA ALANI", sub: "Hisset, frekansını bul, yankını gör", route: "/global-signal", entitlement: "vip_access" },
    ],
  },
  en: {
    title: "Gates",
    sub: "Every gate is a reminder.\nWhich one is calling you?",
    items: [
      { title: "SANRI", sub: "Personal reflection field", route: "/(tabs)/sanri_flow" },
      { title: "AWAKENED CITIES", sub: "Choose the code of a city", route: "/(tabs)/awakenedCities" },
      { title: "MATRIX", sub: "Decode the stream", route: "/(tabs)/matrix", entitlement: "vip_access" },
      { title: "CODE READING", sub: "Read the code of reality", route: "/(tabs)/ust_bilinc", entitlement: "code_training_access" },
      { title: "RITUAL SPACE", sub: "Read, feel, and listen", route: "/(tabs)/rituals", entitlement: "vip_access" },
      { title: "READING AREA", sub: "Decode the codes of reality, go deep", route: "/(tabs)/world_events" },
      { title: "LIBRARY", sub: "All SANRI reading modules", route: "/(tabs)/system_feed" },
      { title: "UNDERSTANDING", sub: "Feel, find your frequency, see your echo", route: "/global-signal", entitlement: "vip_access" },
    ],
  },
};

export default function GatesScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const { isAdmin } = useAuth();
  const entitlements = useEntitlementStore((s) => s.status);
  const refreshEntitlements = useEntitlementStore((s) => s.refresh);
  const t = useMemo(() => COPY[lang], [lang]);

  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    refreshEntitlements();
  }, [refreshEntitlements]);

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fadeIn]);

  useEffect(() => {
    if (__DEV__) {
      console.log("vip:", entitlements.vip_access);
      console.log("role:", entitlements.role_access);
      console.log("code:", entitlements.code_training_access);
    }
  }, [entitlements]);

  const toggleLang = () => setLang((prev) => (prev === "tr" ? "en" : "tr"));

  const openProfile = () => {
    router.push("/(tabs)/my_area" as any);
  };

  const onOpenGate = (item: GateItemType) => {
    if (item.entitlement && !entitlements[item.entitlement]) {
      router.push({
        pathname: "/(tabs)/vip",
        params: { entitlement: item.entitlement, target: item.route },
      } as any);
      return;
    }
    router.push(item.route as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" translucent={false} />

      <View style={styles.bg}>
        <View style={styles.topbar}>
          <Pressable onPress={openProfile} style={styles.profileBtn} hitSlop={10}>
            <Text style={styles.profileTxt}>◎</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable onPress={toggleLang} style={styles.langChip} hitSlop={10}>
            <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero door image */}
          <View style={styles.heroWrap}>
            <Image source={DOOR_BG} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", "#0a0b10"]}
              style={styles.heroFade}
            />
          </View>

          <Animated.View style={{ opacity: fadeIn }}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.sub}>{t.sub}</Text>

            <View style={{ height: 20 }} />

            {t.items.map((it, idx) => {
              const ent = it.entitlement;
              const isLocked = ent ? !entitlements[ent] : false;
              const meta = ent ? ENTITLEMENT_META[ent] : null;
              const icon = GATE_ICONS[it.title] || "◈";

              return (
                <GateItem
                  key={it.route + it.title}
                  title={it.title}
                  sub={it.sub}
                  locked={isLocked}
                  badgeLabel={meta ? meta.label : undefined}
                  badgeColor={meta ? meta.color : undefined}
                  icon={icon}
                  index={idx}
                  onPress={() => onOpenGate(it)}
                />
              );
            })}

            {isAdmin && (
              <Pressable
                onPress={() => router.push("/(tabs)/admin" as any)}
                style={styles.adminCard}
              >
                <View style={styles.adminAccent} />
                <View style={styles.adminGlass}>
                  <View style={styles.adminIconWrap}>
                    <Text style={styles.adminIcon}>⚙</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.adminTitle}>ADMIN PANEL</Text>
                    <Text style={styles.adminSub}>
                      {lang === "tr" ? "Analytics, kullanıcılar, sistem durumu" : "Analytics, users, system status"}
                    </Text>
                  </View>
                  <View style={styles.chevWrap}>
                    <Text style={styles.chev}>›</Text>
                  </View>
                </View>
              </Pressable>
            )}

            <Text style={styles.disclaimer}>
              {lang === "tr"
                ? "Sanri, kişisel gelişim ve öz-yansıma için tasarlanmış bir yapay zeka aracıdır. Profesyonel sağlık, psikoloji veya finansal danışmanlık yerine geçmez."
                : "Sanri is an AI tool designed for personal development and self-reflection. It is not a substitute for professional health, psychology or financial advice."}
            </Text>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function GateItem({
  title,
  sub,
  locked,
  badgeLabel,
  badgeColor,
  icon,
  index,
  onPress,
}: {
  title: string;
  sub: string;
  locked: boolean;
  badgeLabel?: string;
  badgeColor?: string;
  icon: string;
  index: number;
  onPress: () => void;
}) {
  const slideIn = useRef(new Animated.Value(20)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 500, delay: index * 80, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideIn, index]);

  return (
    <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideIn }] }}>
      <Pressable onPress={onPress} style={styles.card}>
        <View style={styles.cardAccent} />
        <View style={styles.cardGlass}>
          <View style={styles.gateIconWrap}>
            <Text style={[styles.gateIcon, locked && { opacity: 0.4 }]}>{icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, locked && { opacity: 0.65 }]}>{title}</Text>

              {badgeLabel ? (
                <View
                  style={[
                    styles.badge,
                    locked
                      ? { backgroundColor: `${badgeColor}18`, borderColor: `${badgeColor}30` }
                      : { backgroundColor: `${badgeColor}22`, borderColor: `${badgeColor}40` },
                  ]}
                >
                  <Text style={[styles.badgeTxt, { color: badgeColor }]}>
                    {locked ? `🔒 ${badgeLabel}` : `✓ ${badgeLabel}`}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={[styles.cardSub, locked && { opacity: 0.5 }]}>{sub}</Text>
          </View>

          <View style={[styles.chevWrap, locked && { borderColor: "rgba(255,255,255,0.06)" }]}>
            <Text style={styles.chev}>{locked ? "🔒" : "›"}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0b10" },
  bg: { flex: 1 },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
    gap: 8,
    zIndex: 10,
  },

  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.30)",
  },

  profileTxt: { color: "#7cf7d8", fontSize: 20, fontWeight: "900" },

  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },

  langTxt: { color: "#cbbcff", fontWeight: "900", letterSpacing: 1 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 0, paddingBottom: 140 },

  heroWrap: {
    width: "100%",
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 8,
  },

  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.45,
  },

  heroFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  title: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 2,
    letterSpacing: 2,
  },

  sub: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
  },

  card: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "rgba(124,247,216,0.25)",
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },

  cardGlass: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  gateIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.12)",
  },

  gateIcon: {
    color: "#7cf7d8",
    fontSize: 20,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  cardTitle: { color: "white", fontSize: 18, fontWeight: "900", letterSpacing: 1 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  badgeTxt: { fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },

  cardSub: { color: "rgba(255,255,255,0.55)", marginTop: 4, fontSize: 13, lineHeight: 18 },

  chevWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.10)",
  },

  chev: { color: "rgba(255,255,255,0.75)", fontSize: 22, fontWeight: "900" },

  adminCard: {
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(255,59,59,0.20)",
    backgroundColor: "rgba(255,59,59,0.06)",
  },

  adminAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "rgba(255,59,59,0.50)",
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },

  adminGlass: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  adminIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,59,59,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,59,59,0.25)",
  },

  adminIcon: {
    color: "#ff6b6b",
    fontSize: 20,
  },

  adminTitle: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  adminSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    marginTop: 2,
  },

  disclaimer: {
    marginTop: 28,
    marginBottom: 30,
    color: "rgba(255,255,255,0.25)",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
