import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ENTITLEMENT_META, type EntitlementId } from "../lib/premium";

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
  entitlement?: EntitlementId;
  targetAfterPurchase?: string;
};

export default function VipWall({
  title,
  message,
  compact = false,
  entitlement = "vip_access",
  targetAfterPurchase,
}: Props) {
  const meta = ENTITLEMENT_META[entitlement];

  const resolvedTitle = title || meta.label;
  const resolvedMessage =
    message ||
    `Bu alan "${meta.label}" erişimi gerektirir.\nAçmak için satın al.`;

  const ctaLabel =
    entitlement === "vip_access"
      ? "VIP'e Geç"
      : entitlement === "role_access"
        ? "Rol Okuma Aç"
        : "Kod Eğitimi Aç";

  const badgeLabel =
    entitlement === "vip_access"
      ? "VIP ile açılır"
      : entitlement === "role_access"
        ? "Rol Okuma ile açılır"
        : "Kod Eğitimi ile açılır";

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
      <Text style={s.glyph}>{meta.glyph}</Text>
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
  glyph: { color: "rgba(255,255,255,0.15)", fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "900", marginBottom: 10, textAlign: "center" },
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
    marginBottom: 24,
  },
  badgeText: { fontSize: 12, fontWeight: "800" },
  btn: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 12,
  },
  btnText: { color: "#0a0b10", fontSize: 15, fontWeight: "900" },
  secondBtn: { paddingVertical: 10 },
  secondText: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "700" },

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
