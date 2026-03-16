import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { logEvent } from "../../lib/LogEvent";
import { useLangStore } from "@/data/langStore";
import { CITY_NAMES, type CityCode } from "@/data/awakenedCities";
import { getCityContent, type Layer } from "@/data/awakenedContent";
import { hasVipEntitlement } from "../../lib/premium";

import MatrixRain from "../../lib/MatrixRain";
import VipSheet from "../../components/VipSheet";
import { consumeVipJustActivated } from "@/lib/vipPulse";

const KEY_BG = require("../../assets/key_holo.jpg");
const DOOR_IMG = require("../../assets/door_holo.jpg");

export default function CityCodeScreen() {
  const router = useRouter();
  const appLang = useLangStore((s) => s.lang);
  const toggleLang = useLangStore((s) => s.toggle);

  const { code } = useLocalSearchParams<{ code?: string }>();
  const cityCode = String(code || "01").padStart(2, "0") as CityCode;
  const cityName = CITY_NAMES?.[cityCode] ?? "Unknown";

  const [layer, setLayer] = useState<Layer>("base");
  const [isVip, setIsVip] = useState(false);
  const [vipOpen, setVipOpen] = useState(false);
  const [vipRain, setVipRain] = useState(false);
  const [pendingDeepAsk, setPendingDeepAsk] = useState(false);

  const breathe = useRef(new Animated.Value(0)).current;
  const doorAnim = useRef(new Animated.Value(0)).current;
  const [doorOpen, setDoorOpen] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [breathe]);

  const keyScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035],
  });

  const keyOpacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.16, 0.26],
  });

  const playDoorOpen = useCallback(() => {
    setDoorOpen(true);
    doorAnim.setValue(0);

    Animated.timing(doorAnim, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setDoorOpen(false);
        doorAnim.setValue(0);
      }, 450);
    });
  }, [doorAnim]);

  const doorOpacity = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.85],
  });

  const doorScale = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.02],
  });

  const doorLift = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const glowOpacity = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    (async () => {
      try {
        const ok = await hasVipEntitlement();
        setIsVip(Boolean(ok));
      } catch {
        setIsVip(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (consumeVipJustActivated()) {
      setVipRain(true);
      const t = setTimeout(() => setVipRain(false), 9000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    logEvent("screen_view", "awakened_cities", {
      screen: "city",
      code: cityCode,
    });
  }, [cityCode]);

  const headerTitle = useMemo(() => `${cityCode} · ${cityName}`, [cityCode, cityName]);
  const content = getCityContent(cityCode, appLang, layer);

  const deepenSub =
    appLang === "en"
      ? "Deep layer is VIP. Open the gate."
      : "Derin katman VIP. Kapıyı aç.";

  const hint =
    appLang === "en"
      ? '"wake up" is not a command — it is a remembrance.'
      : '"wake up" bir komut değil — bir hatırlayış.';

  const goToSanri = useCallback(
    (gateMode: "mirror" | "divine") => {
      router.push({
        pathname: "/(tabs)/sanri_flow",
        params: {
          lang: appLang,
          code: cityCode,
          city: cityName,
          layer,
          title: headerTitle,
          source: "city_detail",
          domain: "city",
          gateMode,
          intent: gateMode === "divine" ? "deep_city_reading" : "city_reading",
        },
      } as any);
    },
    [router, appLang, cityCode, cityName, layer, headerTitle]
  );

  const onPressDeepen = useCallback(async () => {
    try {
      const ok = await hasVipEntitlement();

      if (!ok) {
        setPendingDeepAsk(false);
        setVipOpen(true);
        return;
      }

      setIsVip(true);
      playDoorOpen();
      setTimeout(() => setLayer("deepC"), 520);
    } catch {
      setPendingDeepAsk(false);
      setVipOpen(true);
    }
  }, [playDoorOpen]);

  const onPressAsk = useCallback(async () => {
    const wantsDeep = layer === "deepC";

    if (!wantsDeep) {
      goToSanri("mirror");
      return;
    }

    try {
      const ok = await hasVipEntitlement();

      if (!ok) {
        setPendingDeepAsk(true);
        setVipOpen(true);
        return;
      }

      setIsVip(true);
      goToSanri("divine");
    } catch {
      setPendingDeepAsk(true);
      setVipOpen(true);
    }
  }, [layer, goToSanri]);

  const onSubscribeSuccess = useCallback(async () => {
    setIsVip(true);
    setVipOpen(false);

    if (pendingDeepAsk) {
      setPendingDeepAsk(false);
      goToSanri("divine");
      return;
    }

    playDoorOpen();
    setTimeout(() => setLayer("deepC"), 520);
  }, [pendingDeepAsk, goToSanri, playDoorOpen]);

  const onBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/awakenedCities" as any);
  }, [router]);

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <Image source={KEY_BG} style={styles.bg} resizeMode="cover" />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={vipRain ? 0.28 : 0.14} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <Pressable onPress={onBack} style={styles.topBtn}>
            <Text style={styles.topBtnTxt}>{appLang === "en" ? "Back" : "Geri"}</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable onPress={toggleLang} style={styles.topBtn}>
            <Text style={styles.topBtnTxt}>{appLang.toUpperCase()}</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.keyWrap,
              {
                transform: [{ scale: keyScale }],
                opacity: keyOpacity,
              },
            ]}
          >
            <Image source={KEY_BG} style={styles.keyImg} resizeMode="cover" />
          </Animated.View>

          <Text style={styles.cityCode}>{cityCode}</Text>
          <Text style={styles.cityName}>{cityName}</Text>
          <Text style={styles.layerBadge}>
            {layer === "deepC"
              ? appLang === "en"
                ? "Deep Layer"
                : "Derin Katman"
              : appLang === "en"
              ? "Base Layer"
              : "Temel Katman"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{content.title}</Text>
          <Text style={styles.cardStory}>{content.story}</Text>

          <View style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>
              {appLang === "en" ? "Reflection" : "Yansıma"}
            </Text>
            <Text style={styles.reflectionText}>{content.reflection}</Text>
          </View>

          {layer !== "deepC" ? (
            <View style={styles.deepCard}>
              <Text style={styles.deepTitle}>
                {appLang === "en" ? "Open Consciousness Gate" : "Bilinç Kapısını Aç"}
              </Text>
              <Text style={styles.deepSub}>{deepenSub}</Text>

              <Pressable onPress={onPressDeepen} style={styles.deepBtn}>
                <Text style={styles.deepBtnText}>
                  {isVip
                    ? appLang === "en"
                      ? "Open Deep Layer"
                      : "Derin Katmanı Aç"
                    : appLang === "en"
                    ? "Open VIP Gate"
                    : "VIP Kapısını Aç"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.deepUnlockedCard}>
              <Text style={styles.deepUnlockedTitle}>
                {appLang === "en" ? "Deep Layer Active" : "Derin Katman Aktif"}
              </Text>
              <Text style={styles.deepUnlockedText}>
                {appLang === "en"
                  ? "The city is now speaking from its deeper code."
                  : "Şehir şimdi daha derin kodundan konuşuyor."}
              </Text>
            </View>
          )}

          <View style={styles.askCard}>
            <Text style={styles.askTitle}>
              {appLang === "en" ? "Ask SANRI" : "SANRI'ye Sor"}
            </Text>
            <Text style={styles.askText}>{hint}</Text>

            <Pressable onPress={onPressAsk} style={styles.askBtn}>
              <Text style={styles.askBtnText}>
                {layer === "deepC"
                  ? appLang === "en"
                    ? "Ask from Deep Layer"
                    : "Derin Katmandan Sor"
                  : appLang === "en"
                  ? "Ask SANRI"
                  : "SANRI'ye Sor"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {doorOpen ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.doorOverlay,
            {
              opacity: doorOpacity,
              transform: [{ scale: doorScale }, { translateY: doorLift }],
            },
          ]}
        >
          <Image source={DOOR_IMG} style={styles.doorImg} resizeMode="cover" />
          <Animated.View style={[styles.doorGlow, { opacity: glowOpacity }]} />
        </Animated.View>
      ) : null}

      <VipSheet
        open={vipOpen}
        onClose={() => {
          setVipOpen(false);
          setPendingDeepAsk(false);
        }}
        onSubscribeSuccess={onSubscribeSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05060B",
  },

  bg: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3,6,18,0.58)",
  },

  scroll: {
    padding: 16,
    paddingBottom: 48,
  },

  topbar: {
    marginTop: Platform.OS === "ios" ? 48 : 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  topBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  topBtnTxt: {
    color: "white",
    fontWeight: "800",
  },

  hero: {
    alignItems: "center",
    marginBottom: 18,
  },

  keyWrap: {
    width: 104,
    height: 104,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.22)",
  },

  keyImg: {
    width: "100%",
    height: "100%",
  },

  cityCode: {
    color: "#7cf7d8",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 1,
  },

  cityName: {
    marginTop: 4,
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  layerBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
    color: "#cbbcff",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    fontWeight: "800",
  },

  card: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },

  cardStory: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 24,
    fontSize: 15,
  },

  reflectionCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  reflectionTitle: {
    color: "#cbbcff",
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
  },

  reflectionText: {
    color: "white",
    lineHeight: 22,
    fontSize: 15,
  },

  deepCard: {
    marginTop: 18,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },

  deepTitle: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  deepSub: {
    color: "rgba(255,255,255,0.78)",
    lineHeight: 22,
  },

  deepBtn: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.88)",
  },

  deepBtnText: {
    color: "white",
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  deepUnlockedCard: {
    marginTop: 18,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(94,59,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.22)",
  },

  deepUnlockedTitle: {
    color: "#cbbcff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  deepUnlockedText: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 22,
  },

  askCard: {
    marginTop: 18,
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  askTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  askText: {
    color: "rgba(255,255,255,0.74)",
    lineHeight: 22,
  },

  askBtn: {
    marginTop: 14,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  askBtnText: {
    color: "white",
    fontWeight: "800",
  },

  doorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  doorImg: {
    width: 260,
    height: 420,
    borderRadius: 28,
    opacity: 0.96,
  },

  doorGlow: {
    position: "absolute",
    width: 320,
    height: 460,
    borderRadius: 32,
    backgroundColor: "rgba(124,247,216,0.08)",
  },
});