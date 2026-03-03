import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  leftLabel?: string;          // örn: "Geri"
  onBack?: () => void;

  // sağ taraf
  lang?: "tr" | "en";
  onToggleLang?: () => void;

  // layer chip
  layer?: "base" | "deepc";
  onToggleLayer?: () => void;
};

export default function TopBar({
  title = "SYSTEM TERMINAL",
  leftLabel = "Geri",
  onBack,
  lang = "tr",
  onToggleLang,
  layer = "base",
  onToggleLayer,
}: Props) {
  const layerLabel = layer === "deepc" ? "DEEPC" : "BASE";

  return (
    <View style={s.wrap}>
      <View style={s.left}>
        <Pressable onPress={onBack} style={s.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={18} color="#7cf7d8" />
          <Text style={s.backTxt}>{leftLabel}</Text>
        </Pressable>

        <Text style={s.title} numberOfLines={1}>{title}</Text>
      </View>

      <View style={s.right}>
        <Pressable onPress={onToggleLayer} style={s.chip} hitSlop={10}>
          <Text style={s.chipTxt}>{layerLabel}</Text>
        </Pressable>

        <Pressable onPress={onToggleLang} style={[s.langPill]} hitSlop={10}>
          <Text style={s.langTxt}>{lang.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontWeight: "900" },
  title: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },
  chipTxt: { color: "#7cf7d8", fontWeight: "900", letterSpacing: 1 },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.30)",
  },
  langTxt: { color: "white", fontWeight: "900", letterSpacing: 1 },
});