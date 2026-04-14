import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

const ACCENT = "#7cf7d8";

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
  targetAfterPurchase?: string;
};

export default function VipWall({
  title = "Premium İçerik",
  message = "Bu alan VIP erişim gerektirir.\nTüm kapıları açmak için VIP'e geç.",
  compact = false,
  targetAfterPurchase,
}: Props) {
  const goVip = () => {
    const params: Record<string, string> = {};
    if (targetAfterPurchase) params.target = targetAfterPurchase;
    router.push({ pathname: "/(tabs)/vip", params } as any);
  };

  if (compact) {
    return (
      <Pressable style={s.compactCard} onPress={goVip}>
        <Text style={s.compactIcon}>🔒</Text>
        <View style={s.compactInfo}>
          <Text style={s.compactTitle}>{title}</Text>
          <Text style={s.compactMsg}>VIP erişim gerekli</Text>
        </View>
        <Text style={s.compactArrow}>→</Text>
      </Pressable>
    );
  }

  return (
    <View style={s.wall}>
      <Text style={s.glyph}>☽</Text>
      <Text style={s.title}>{title}</Text>
      <Text style={s.msg}>{message}</Text>
      <Pressable style={s.btn} onPress={goVip}>
        <Text style={s.btnText}>VIP'e Geç</Text>
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
  title: { color: "#eab308", fontSize: 20, fontWeight: "900", marginBottom: 10, textAlign: "center" },
  msg: { color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 22, textAlign: "center", marginBottom: 24 },
  btn: { borderRadius: 18, paddingVertical: 16, paddingHorizontal: 48, backgroundColor: ACCENT, marginBottom: 12 },
  btnText: { color: "#0a0b10", fontSize: 15, fontWeight: "900" },
  secondBtn: { paddingVertical: 10 },
  secondText: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "700" },

  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(234,179,8,0.08)",
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.20)",
    gap: 12,
  },
  compactIcon: { fontSize: 20 },
  compactInfo: { flex: 1 },
  compactTitle: { color: "#eab308", fontSize: 14, fontWeight: "800", marginBottom: 2 },
  compactMsg: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  compactArrow: { color: "#eab308", fontSize: 18, fontWeight: "700" },
});
