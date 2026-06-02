import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SanriHeader } from "./SanriHeader";
import { SanctumBackground } from "./SanctumBackground";
import { MicButton } from "./MicButton";
import { trackEvent } from "../lib/analytics";
import { COLORS, FONTS } from "../lib/theme";

/**
 * PromptLanding — Ana Sayfa / Rüyalar / İlişkiler / Günlük için ortak,
 * premium "bilinç alanı" giriş ekranı.
 *
 * Nefes alan altın halka + serif başlık + altın input + örnek kartlar.
 * Gönderince /(tabs)/chat'e gider; yazılan metin `seed` olarak otomatik
 * Sanrı'ya iletilir. `ctx` chat açılış cümlesini belirler.
 */
export function PromptLanding({
  title,
  subtitle,
  placeholder,
  ctx,
  examples = [],
}: {
  title: string;
  subtitle?: string;
  placeholder: string;
  ctx: "home" | "dream" | "relationship" | "journal";
  examples?: string[];
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  // V1 Insight — sekme/özellik açılış ölçümü (dream_open / relationship_open /
  // journal_open / home_open). Her odaklanmada tetiklenir (sekme kullanımı).
  useFocusEffect(
    useCallback(() => {
      trackEvent(`${ctx}_open`, { meta: { domain: "navigation", ctx } });
    }, [ctx])
  );

  const goChat = (value: string) => {
    const v = value.trim();
    if (!v) return;
    Haptics.selectionAsync().catch(() => {});
    setText("");
    router.push({ pathname: "/(tabs)/chat", params: { seed: v, ctx } } as any);
  };

  return (
    <View style={styles.root}>
      <SanctumBackground showRing>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SanriHeader />

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.center}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

              <View style={styles.inputWrap}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.textFaint}
                  style={styles.input}
                  multiline
                />
                <MicButton
                  lang="tr"
                  onTranscript={(t) => setText((prev) => (prev ? prev + " " + t : t))}
                />
                <Pressable
                  onPress={() => goChat(text)}
                  disabled={!text.trim()}
                  style={[styles.send, !text.trim() && styles.sendOff]}
                  hitSlop={8}
                >
                  <LinearGradient
                    colors={[COLORS.goldSoft, COLORS.gold]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendGrad}
                  >
                    <Ionicons name="arrow-up" size={22} color={COLORS.bgDeep} />
                  </LinearGradient>
                </Pressable>
              </View>

              {examples.length > 0 && (
                <View style={styles.examples}>
                  {examples.map((ex) => (
                    <Pressable key={ex} style={styles.chip} onPress={() => goChat(ex)}>
                      <Text style={styles.chipTxt}>{ex}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={{ height: Math.max(insets.bottom, 8) }} />
        </KeyboardAvoidingView>
      </SanctumBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  body: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  center: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.serif,
    fontSize: 40,
    lineHeight: 46,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.goldDim,
    fontFamily: FONTS.serifItalic,
    fontSize: 19,
    textAlign: "center",
    marginBottom: 34,
  },
  inputWrap: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "rgba(8,12,22,0.66)",
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 24,
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 160,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 11,
  },
  send: { borderRadius: 20, overflow: "hidden", marginBottom: 2 },
  sendOff: { opacity: 0.4 },
  sendGrad: { width: 46, height: 46, alignItems: "center", justifyContent: "center" },

  examples: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 26,
  },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  chipTxt: {
    color: COLORS.goldSoft,
    fontFamily: FONTS.serifMed,
    fontSize: 16,
  },
});
