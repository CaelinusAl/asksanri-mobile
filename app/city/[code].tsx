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

  const keyScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const keyOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.16, 0.26] });

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

  const doorOpacity = doorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.85] });
  const doorScale = doorAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.02] });
  const doorLift = doorAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const glowOpacity = doorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

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
    logEvent("screen_view", "awakened_cities", { screen: "city", code: cityCode });
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
        setVipOpen(true);
        return;
      }
      setIsVip(true);
      playDoorOpen();
      setTimeout(() => setLayer("deepC"), 520);
    } catch {
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

    playDoorOpen();
    setTimeout(() => setLayer("deepC"), 520);

    setVipRain(true);
    setTimeout(() => setVipRain(false), 3500);

    if (pendingDeepAsk) {
      setPendingDeepAsk(false);
      setTimeout(() => {
        goToSanri("divine");
      }, 720);
    }
  }, [pendingDeepAsk, playDoorOpen, goToSanri]);

  return (
    <View style={styles.root}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.keyBgWrap,
          { opacity: keyOpacity, transform: [{ scale: keyScale }] },
        ]}
      >
        <Image source={KEY_BG} style={styles.keyBg} resizeMode="cover" />
      </Animated.View>

      {vipRain ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <MatrixRain opacity={0.18} />
        </View>
      ) : null}

      {doorOpen ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.doorWrap,
            {
              opacity: doorOpacity,
              transform: [{ translateY: doorLift }, { scale: doorScale }],
            },
          ]}
        >
          <Image source={DOOR_IMG} style={styles.doorImg} resizeMode="contain" />
          <Animated.View
            pointerEvents="none"
            style={[styles.doorGlow, { opacity: glowOpacity }]}
          />
        </Animated.View>
      ) : null}

      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.topKicker}>SYSTEM TERMINAL</Text>

        <View style={styles.layerRow}>
          <View style={styles.layerChip}>
            <Text style={styles.layerChipTxt}>{String(layer).toUpperCase()}</Text>
          </View>

          <Pressable onPress={toggleLang} style={styles.langChip} hitSlop={10}>
            <Text style={styles.langChipTxt}>{String(appLang).toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>

      <VipSheet
        open={vipOpen}
        lang={appLang as any}
        priceTry="693 TL / ay"
        priceUsd="39 USD / mo"
        onClose={() => {
          setVipOpen(false);
          setPendingDeepAsk(false);
        }}
        onSubscribe={onSubscribeSuccess}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>{headerTitle}</Text>

        <Pressable onPress={onPressDeepen} style={styles.vipGlass} hitSlop={10}>
          <View style={{ flex: 1 }}>
            <Text style={styles.vipTitle}>BİLİNÇ KAPISI</Text>
            <Text style={styles.vipSub}>{deepenSub}</Text>
          </View>
          <Text style={styles.vipArrow}>›</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{content.title}</Text>
          <Text style={styles.story}>
            {String(content.story || "")
              .split("\n")
              .filter((line) => !line.trim().startsWith("$"))
              .join("\n")}
          </Text>
        </View>

        <Pressable onPress={onPressAsk} style={styles.askGlass} hitSlop={10}>
          <Text style={styles.askTitle}>ASK SANRI GO</Text>
          <Text style={styles.askSub}>
            {layer === "deepC"
              ? appLang === "en"
                ? "Deep city analysis will open through Sanri Elite."
                : "Derin şehir analizi Sanrı Elite üzerinden açılır."
              : appLang === "en"
              ? "Write one sentence. The system reflects meaning, not answers."
              : "Bir cümle yaz. Sistem cevap değil, anlam yansıtır."}
          </Text>
        </Pressable>

        <Text style={styles.hint}>{hint}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07080d",
    paddingTop: Platform.OS === "android" ? 14 : 0,
  },

  keyBgWrap: { ...StyleSheet.absoluteFillObject },
  keyBg: { width: "100%", height: "100%" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.48)" },

  doorWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 70,
    height: 420,
    alignItems: "center",
    justifyContent: "center",
  },
  doorImg: { width: "92%", height: "100%" },
  doorGlow: {
    position: "absolute",
    width: "92%",
    height: "100%",
    borderRadius: 28,
    backgroundColor: "rgba(124,247,216,0.08)",
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },

  topKicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "800",
    flex: 1,
  },

  layerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  layerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  layerChipTxt: { color: "#7ef9d6", fontWeight: "900", fontSize: 12, letterSpacing: 1 },

  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.4)",
  },
  langChipTxt: { color: "#cbbcff", fontWeight: "900", fontSize: 12, letterSpacing: 1 },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 56 },

  h1: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 14,
  },

  vipGlass: {
    marginHorizontal: 18,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.26)",
    borderWidth: 1,
    borderColor: "rgba(140,100,255,0.35)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#7cf7d8",
    shadowOpacity: 0.22,
    shadowRadius: 18,
  },
  vipTitle: { color: "#cbbcff", fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  vipSub: { color: "rgba(255,255,255,0.82)", marginTop: 6, fontSize: 14, lineHeight: 20 },
  vipArrow: { color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: "900" },

  card: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardTitle: { color: "#7cf7d8", fontSize: 20, fontWeight: "900", marginBottom: 12 },
  story: { color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 24 },

  askGlass: {
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(140,100,255,0.28)",
  },
  askTitle: { color: "#bda8ff", fontSize: 22, fontWeight: "900", letterSpacing: 2 },
  askSub: { color: "rgba(255,255,255,0.75)", marginTop: 8, fontSize: 14, lineHeight: 20 },

  hint: {
    color: "rgba(180,255,230,0.55)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
    paddingHorizontal: 18,
  },
});