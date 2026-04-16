import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ENTITLEMENT_META, type EntitlementId } from "../lib/premium";

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
  entitlement?: EntitlementId;
  targetAfterPurchase?: string;
};

const CTA_LABELS: Record<string, { tr: string; en: string }> = {
  vip_access: { tr: "VIP'e Geç", en: "Go VIP" },
  role_access: { tr: "Rolünü Aç", en: "Unlock Your Role" },
  code_training_access: { tr: "Eğitimi Aç", en: "Start Training" },
  general_reading_access: { tr: "Tüm Okumaları Aç", en: "Unlock All Readings" },
  relationship_deep_access: { tr: "Derine İn", en: "Go Deeper" },
  career_deep_access: { tr: "Derine İn", en: "Go Deeper" },
  weekly_flow_access: { tr: "Derine İn", en: "Go Deeper" },
  person_deep_access: { tr: "Derine İn", en: "Go Deeper" },
  money_deep_access: { tr: "Derine İn", en: "Go Deeper" },
};

const BADGE_LABELS: Record<string, string> = {
  vip_access: "VIP ile açılır",
  role_access: "Rol Okuma ile açılır",
  code_training_access: "Kod Eğitimi ile açılır",
  general_reading_access: "Genel Okuma ile açılır",
  relationship_deep_access: "Derin İlişki ile açılır",
  career_deep_access: "Derin Kariyer ile açılır",
  weekly_flow_access: "Derin Haftalık ile açılır",
  person_deep_access: "Derin Kişi ile açılır",
  money_deep_access: "Derin Para ile açılır",
};

export default function VipWall({
  title,
  message,
  compact = false,
  entitlement = "vip_access",
  targetAfterPurchase,
}: Props) {
  const meta = ENTITLEMENT_META[entitlement];
  const pulseAnim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.35, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.15, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const resolvedTitle = title || meta.label;
  const resolvedMessage =
    message ||
    `Bu alan "${meta.label}" erişimi gerektirir.\nAçmak için satın al.`;
  const ctaLabel = (CTA_LABELS[entitlement] || CTA_LABELS.vip_access).tr;
  const badgeLabel = BADGE_LABELS[entitlement] || "Satın alımla açılır";

  const goStore = () => {
    const params: Record<string, string> = { entitlement };
    if (targetAfterPurchase) params.target = targetAfterPurchase;
    router.push({ pathname: "/(tabs)/vip", params } as any);
  };

  if (compact) {
    return (
      <Pressable
        style={[s.compactCard, { borderColor: `${meta.color}33` }]}
        onPress={goStore}
      >
        <Text style={s.compactIcon}>🔒</Text>
        <View style={s.compactInfo}>
          <Text style={[s.compactTitle, { color: meta.color }]}>
            {resolvedTitle}
          </Text>
          <Text style={s.compactMsg}>{badgeLabel}</Text>
        </View>
        <Text style={[s.compactArrow, { color: meta.color }]}>→</Text>
      </Pressable>
    );
  }

  return (
    <View style={s.wall}>
      <Animated.Text style={[s.glyph, { opacity: pulseAnim }]}>{meta.glyph}</Animated.Text>
      <Text style={[s.title, { color: meta.color }]}>{resolvedTitle}</Text>
      <Text style={s.msg}>{resolvedMessage}</Text>
      <View style={[s.badgePill, { backgroundColor: `${meta.color}18`, borderColor: `${meta.color}30` }]}>
        <Text style={[s.badgeText, { color: meta.color }]}>{badgeLabel}</Text>
      </View>
      <Pressable style={[s.btn, { backgroundColor: meta.color }]} onPress={goStore}>
        <Text style={s.btnText}>{ctaLabel}</Text>
      </Pressable>
      <Pressable style={s.secondBtn} onPress={() => router.back()}>
        <Text style={s.secondText}>Şimdi değil</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wall: { alignItems: "center", paddingTop: 60, paddingHorizontal: 24 },
  glyph: { color: "rgba(255,255,255,0.15)", fontSize: 52, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "900", marginBottom: 10, textAlign: "center" },
  msg: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  badgePill: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    marginBottom: 28,
  },
  badgeText: { fontSize: 12, fontWeight: "800" },
  btn: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 52,
    marginBottom: 12,
  },
  btnText: { color: "#0a0b10", fontSize: 16, fontWeight: "900" },
  secondBtn: { paddingVertical: 10 },
  secondText: { color: "rgba(255,255,255,0.30)", fontSize: 14, fontWeight: "700" },

  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    gap: 12,
  },
  compactIcon: { fontSize: 20 },
  compactInfo: { flex: 1 },
  compactTitle: { fontSize: 14, fontWeight: "800", marginBottom: 2 },
  compactMsg: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  compactArrow: { fontSize: 18, fontWeight: "700" },
});
