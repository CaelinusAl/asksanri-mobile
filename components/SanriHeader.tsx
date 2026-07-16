import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../lib/theme";

/**
 * SanriHeader — tüm yüzeylerde ortak üst bar.
 * Sol: iki satırlı SANRI OS wordmark ve AURA katmanı.
 * Sağ: hamburger → Sessizlik + Hesabım (ikincil yüzeyler).
 */
export function SanriHeader() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const go = (path: string) => {
    setOpen(false);
    router.push(path as any);
  };

  return (
    <View style={[styles.bar, { paddingTop: Math.max(insets.top, 10) + 8 }]}>
      <View>
        <Text style={styles.wordmark}>SANRI OS</Text>
        <Text style={styles.byline}>AURA</Text>
      </View>

      <Pressable onPress={() => setOpen(true)} hitSlop={12} style={styles.burger}>
        <Ionicons name="menu" size={26} color={COLORS.goldSoft} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <StatusBar barStyle="light-content" />
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { paddingTop: Math.max(insets.top, 10) + 64 }]}>
            <Text style={styles.sheetTitle}>MENÜ</Text>

            <Pressable style={styles.item} onPress={() => go("/(tabs)/silence")}>
              <Ionicons name="moon-outline" size={22} color={COLORS.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>Sessizlik</Text>
                <Text style={styles.itemSub}>Durup nefes al, sakinleş.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.item} onPress={() => go("/(tabs)/voice_settings")}>
              <Ionicons name="mic-outline" size={22} color={COLORS.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>Ses</Text>
                <Text style={styles.itemSub}>Mikrofon ve sesli yanıt tercihleri.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.item} onPress={() => go("/(tabs)/my_area")}>
              <Ionicons name="person-outline" size={22} color={COLORS.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemLabel}>Hesabım</Text>
                <Text style={styles.itemSub}>Profil, abonelik ve ayarlar.</Text>
              </View>
            </Pressable>

            <Pressable style={styles.close} onPress={() => setOpen(false)}>
              <Text style={styles.closeTxt}>Kapat</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 10,
    zIndex: 10,
  },
  wordmark: {
    color: COLORS.goldSoft,
    fontFamily: FONTS.serifBold,
    fontSize: 26,
    letterSpacing: 6,
    lineHeight: 28,
  },
  byline: {
    color: COLORS.goldDim,
    fontFamily: FONTS.bodyMed,
    fontSize: 9,
    letterSpacing: 6,
    marginTop: 3,
    marginLeft: 2,
  },
  burger: { padding: 4, marginTop: 4 },

  backdrop: { flex: 1, backgroundColor: "rgba(4,6,13,0.7)" },
  sheet: {
    backgroundColor: COLORS.bgRaise,
    paddingHorizontal: 18,
    paddingBottom: 28,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  sheetTitle: {
    color: COLORS.goldDim,
    fontFamily: FONTS.bodyMed,
    letterSpacing: 4,
    fontSize: 12,
    marginBottom: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 10,
  },
  itemLabel: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 20 },
  itemSub: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 12, marginTop: 2 },
  close: { alignItems: "center", paddingVertical: 12, marginTop: 4 },
  closeTxt: { color: COLORS.textFaint, fontFamily: FONTS.bodyMed, fontSize: 14 },
});
