import React from "react";
import { Pressable, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useVoiceStore } from "../lib/voice";
import type { VoiceLang } from "../lib/voice";
import { COLORS } from "../lib/theme";

/**
 * MicButton — Faz 2 (konuşma → metin) giriş bağlantısı.
 *
 * Faz 2 hazır değilse veya kullanıcı sesi kapattıysa hiçbir şey render
 * etmez (uygulama saf text-first kalır). Hazır olduğunda input alanında
 * mikrofon belirir; basılı tutunca dinler, bırakınca metni `onTranscript`
 * ile iletir.
 */
export function MicButton({
  lang,
  onTranscript,
}: {
  lang: VoiceLang;
  onTranscript: (text: string) => void;
}) {
  const visible = useVoiceStore((s) => s.micVisible());
  const isRecording = useVoiceStore((s) => s.isRecording);
  const start = useVoiceStore((s) => s.startRecording);
  const stop = useVoiceStore((s) => s.stopRecording);
  const pulse = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  if (!visible) return null;

  const onPressIn = () => {
    Haptics.selectionAsync().catch(() => {});
    start(lang).catch(() => {});
  };
  const onPressOut = async () => {
    const text = await stop();
    if (text?.trim()) onTranscript(text.trim());
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} hitSlop={8} style={styles.btn}>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Ionicons
          name={isRecording ? "mic" : "mic-outline"}
          size={22}
          color={isRecording ? COLORS.goldSoft : COLORS.goldDim}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: 42, height: 42, alignItems: "center", justifyContent: "center", marginBottom: 2 },
});
