import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useVoiceStore } from "../lib/voice";
import type { VoiceLang } from "../lib/voice";
import { COLORS, FONTS } from "../lib/theme";

/**
 * SpeakButton — Faz 3 (Aura sesiyle dinleme) bağlantısı.
 *
 * Faz 3 hazır değilse veya ses kapalıysa render edilmez. Hazır olduğunda
 * Sanrı balonunun altında küçük bir "Dinle" düğmesi belirir; basınca metni
 * Aura sesiyle okur, tekrar basınca durur.
 */
export function SpeakButton({
  id,
  text,
  lang,
}: {
  id: string;
  text: string;
  lang: VoiceLang;
}) {
  const visible = useVoiceStore((s) => s.speakVisible());
  const speakingId = useVoiceStore((s) => s.speakingId);
  const speak = useVoiceStore((s) => s.speak);

  if (!visible) return null;

  const active = speakingId === id;

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        speak(id, text, lang);
      }}
      hitSlop={8}
      style={styles.btn}
    >
      <Ionicons
        name={active ? "stop-circle" : "volume-medium-outline"}
        size={15}
        color={COLORS.goldDim}
      />
      <Text style={styles.label}>{active ? "Durdur" : "Dinle"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8, alignSelf: "flex-start" },
  label: { color: COLORS.goldDim, fontFamily: FONTS.bodyMed, fontSize: 12, letterSpacing: 0.3 },
});
