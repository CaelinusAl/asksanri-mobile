// app/(tabs)/gates.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getActiveEntitlements,
  ENTITLEMENT_META,
  type EntitlementId,
  type EntitlementStatus,
} from "../../lib/premium";

type Lang = "tr" | "en";

type GateItemType = {
  title: string;
  sub: string;
  route: string;
  entitlement?: EntitlementId;
};

const COPY: Record<
  Lang,
  { title: string; sub: string; items: GateItemType[] }
> = {
  tr: {
    title: "Kapılar",
    sub: "Hangi alana geçmek istiyorsun?",
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
    sub: "Which field would you like to enter?",
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
  const [entitlements, setEntitlements] = useState<EntitlementStatus>({
    vip_access: false,
    role_access: false,
    code_training_access: false,
  });
  const t = useMemo(() => COPY[lang], [lang]);

  useEffect(() => {
    getActiveEntitlements().then(setEntitlements).catch(() => {});
  }, []);

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
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>

          <View style={{ height: 14 }} />

          {t.items.map((it) => {
            const ent = it.entitlement;
            const isLocked = ent ? !entitlements[ent] : false;
            const meta = ent ? ENTITLEMENT_META[ent] : null;

            return (
              <GateItem
                key={it.route + it.title}
                title={it.title}
                sub={it.sub}
                locked={isLocked}
                badgeLabel={meta ? meta.label : undefined}
                badgeColor={meta ? meta.color : undefined}
                onPress={() => onOpenGate(it)}
              />
            );
          })}

          <Text style={styles.disclaimer}>
            {lang === "tr"
              ? "Sanri, kisisel gelisim ve oz-yansima icin tasarlanmis bir yapay zeka aracidir. Profesyonel saglik, psikoloji veya finansal danismanlik yerine gecmez."
              : "Sanri is an AI tool designed for personal development and self-reflection. It is not a substitute for professional health, psychology or financial advice."}
          </Text>
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
  onPress,
}: {
  title: string;
  sub: string;
  locked: boolean;
  badgeLabel?: string;
  badgeColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardGlass}>
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>

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

          <Text style={styles.cardSub}>{sub}</Text>
        </View>

        <View style={styles.chevWrap}>
          <Text style={styles.chev}>›</Text>
        </View>
      </View>
    </Pressable>
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
  scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 140 },

  title: { color: "white", fontSize: 40, fontWeight: "900", marginTop: 6 },
  sub: { color: "rgba(255,255,255,0.70)", marginTop: 6, fontSize: 16 },

  card: {
    borderRadius: 26,
    overflow: "hidden",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  cardGlass: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  cardTitle: { color: "white", fontSize: 22, fontWeight: "900" },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  badgeTxt: { fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },

  cardSub: { color: "rgba(255,255,255,0.68)", marginTop: 6, fontSize: 14 },

  chevWrap: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  chev: { color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: "900" },

  disclaimer: {
    marginTop: 20,
    marginBottom: 30,
    color: "rgba(255,255,255,0.30)",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
