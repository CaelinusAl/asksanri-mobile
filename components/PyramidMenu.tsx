// components/PyramidMenu.tsx
//
// Global hızlı navigasyon — sol üst köşede küçük piramit butonu.
// Dokunulduğunda tüm ana ekranlara kısa yol veren bir sheet açar.
// Hangi ekranda olduğunu pathname üzerinden bilir, aktif kartı vurgular.
//
// Kullanım:
//   <PyramidMenu lang={ob.lang} />
// Component absolute-position çalışır; ekran top bar'ında 60px sol
// padding bırakmak yeterli.

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { router, usePathname } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Lang = "tr" | "en";

type Item = {
  id: string;
  glyph: string;
  labelTr: string;
  labelEn: string;
  route: string;
  // pathname içinde ararız: "/(tabs)/daily" → "daily"
  match: string;
};

const ITEMS: Item[] = [
  {
    id: "daily",
    glyph: "☀",
    labelTr: "Bugün",
    labelEn: "Today",
    route: "/(tabs)/daily",
    match: "daily",
  },
  {
    id: "chat",
    glyph: "✦",
    labelTr: "Sanrı",
    labelEn: "Sanrı",
    route: "/(tabs)/chat",
    match: "chat",
  },
  {
    id: "gates",
    glyph: "◎",
    labelTr: "Kapılar",
    labelEn: "Gates",
    route: "/(tabs)/gates",
    match: "gates",
  },
  {
    id: "archive",
    glyph: "◇",
    labelTr: "Yankılar",
    labelEn: "Echoes",
    route: "/(tabs)/archive",
    match: "archive",
  },
  {
    id: "silence",
    glyph: "☽",
    labelTr: "Sustur",
    labelEn: "Silence",
    route: "/(tabs)/silence",
    match: "silence",
  },
];

type Props = {
  lang?: Lang;
};

export default function PyramidMenu({ lang = "tr" }: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(-24)).current;

  // Sürekli yumuşak nefes — ikon ölü durmasın
  const pulse = useRef(new Animated.Value(0.7)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.7,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const handleOpen = () => {
    Haptics.selectionAsync().catch(() => {});
    setOpen(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: -24,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setOpen(false));
  };

  const handleNavigate = (route: string, isActive: boolean) => {
    Haptics.selectionAsync().catch(() => {});
    handleClose();
    if (isActive) return; // Aynı ekrana atma
    setTimeout(() => {
      router.push(route as any);
    }, 200);
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        hitSlop={14}
        style={[s.btn, { top: Math.max(insets.top + 8, 16) }]}
      >
        <Animated.View style={{ opacity: pulse }}>
          <Text style={s.glyph}>▲</Text>
        </Animated.View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Pressable style={s.backdrop} onPress={handleClose}>
          <Animated.View
            style={[
              s.sheet,
              {
                opacity,
                transform: [{ translateY: slide }],
                paddingTop: insets.top + 14,
              },
            ]}
            // Sheet içine dokunma backdrop'a düşmesin
            onStartShouldSetResponder={() => true}
          >
            <View style={s.handle} />

            {ITEMS.map((item) => {
              const active = pathname.toLowerCase().includes(item.match);
              const label = lang === "tr" ? item.labelTr : item.labelEn;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleNavigate(item.route, active)}
                  style={[s.item, active && s.itemActive]}
                  android_ripple={{
                    color: "rgba(124,247,216,0.10)",
                    borderless: false,
                  }}
                >
                  <Text style={[s.itemGlyph, active && s.itemGlyphActive]}>
                    {item.glyph}
                  </Text>
                  <Text style={[s.itemLabel, active && s.itemLabelActive]}>
                    {label}
                  </Text>
                  {active ? (
                    <Text style={s.activeDot}>•</Text>
                  ) : (
                    <Text style={s.itemArrow}>→</Text>
                  )}
                </Pressable>
              );
            })}

            <Text style={s.hint}>
              {lang === "tr"
                ? "Sanrı seninle her yerde."
                : "Sanrı is with you everywhere."}
            </Text>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  btn: {
    position: "absolute",
    left: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  glyph: {
    color: "#7cf7d8",
    fontSize: 14,
    fontWeight: "900",
    marginTop: -1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(7,8,13,0.78)",
  },
  sheet: {
    backgroundColor: "#0c0e15",
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(124,247,216,0.10)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignSelf: "center",
    marginBottom: 18,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 8,
  },
  itemActive: {
    backgroundColor: "rgba(124,247,216,0.08)",
    borderColor: "rgba(124,247,216,0.30)",
  },
  itemGlyph: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 22,
    width: 30,
    textAlign: "center",
  },
  itemGlyphActive: {
    color: "#7cf7d8",
  },
  itemLabel: {
    flex: 1,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  itemLabelActive: {
    color: "#fff",
  },
  itemArrow: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 16,
    fontWeight: "700",
  },
  activeDot: {
    color: "#7cf7d8",
    fontSize: 24,
    lineHeight: 18,
  },

  hint: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.6,
    marginTop: 10,
  },
});
