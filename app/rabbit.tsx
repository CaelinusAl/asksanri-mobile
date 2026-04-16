import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const RABBIT = require("../assets/rabbit.jpg");
const MATRIX_BG = require("../assets/matrix_rain.jpg");
const { width: W, height: H } = Dimensions.get("window");

type Lang = "tr" | "en";

const COPY = {
  tr: {
    follow: "FOLLOW THE RABBIT",
    system: "SANRI • SYSTEM GATE",
    title: "CAELINUS\nAI",
    subtitle: "CONSCIOUSNESS MIRROR",
    guestQuote: "Bazı soruların cevabı yoktur.\nBazı cevapların ise bir sorusu vardır...",
    guestDesc:
      "Sanrı bilgi üretmez.\nAlan açar. Anlam sende şekillenir.",
    guestCardTitle: "SANRI AI",
    guestCardText: "Alanı açmak için giriş yap. Frekansın seni bekliyor.",
    guestButton: "🔑 Frekans Alanı Aç",
    welcome: "Hoş geldin,",
    authedDesc:
      "Sanrı alanı...\nKendinden kendine yapılan bir yolculuktur.\nHer kapı, sende zaten var olanı hatırlatır.",
    authedCardTitle: "FREKANS ALANI",
    authedCardText: "Frekans alanı hazır.\nŞimdi kendi titreşimini duymaya geçebilirsin.",
    authedButton: "Frekans Alanına Geç",
    logout: "Çıkış Yap",
  },
  en: {
    follow: "FOLLOW THE RABBIT",
    system: "SANRI • SYSTEM GATE",
    title: "CAELINUS\nAI",
    subtitle: "CONSCIOUSNESS MIRROR",
    guestQuote: "Some questions have no answer.\nSome answers have a question...",
    guestDesc:
      "SANRI doesn't produce information.\nIt opens meaning — reflects you back to you.",
    guestCardTitle: "SANRI AI",
    guestCardText: "Sign in to open the field. Your frequency awaits.",
    guestButton: "🔑 Open Frequency Gate",
    welcome: "Welcome,",
    authedDesc:
      "The Sanrı field...\nA journey from yourself to yourself.\nEvery gate reminds you of what already exists within.",
    authedCardTitle: "FREQUENCY FIELD",
    authedCardText: "The frequency field is ready.\nNow begin to hear your own vibration.",
    authedButton: "Enter Frequency Field",
    logout: "Sign Out",
  },
} as const;

function getDisplayName(user: any) {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email?.includes("@")) {
    const raw = user.email.split("@")[0];
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return "White Rabbit";
}

/* ── Animated Matrix Rain Columns ── */
function MatrixRainOverlay() {
  const cols = useMemo(() => {
    const count = Math.floor(W / 22);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: i * 22 + Math.random() * 6,
      delay: Math.random() * 6000,
      duration: 4000 + Math.random() * 5000,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      ).join("\n"),
    }));
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {cols.map((col) => (
        <RainColumn key={col.id} {...col} />
      ))}
    </View>
  );
}

function RainColumn({ left, delay, duration, chars }: { left: number; delay: number; duration: number; chars: string }) {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.25, duration: 600, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: H + 100, duration, easing: Easing.linear, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -200, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.Text
      style={{
        position: "absolute",
        left,
        top: 0,
        color: "#7cf7d8",
        fontSize: 13,
        lineHeight: 16,
        fontWeight: "300",
        opacity,
        transform: [{ translateY }],
      }}
    >
      {chars}
    </Animated.Text>
  );
}

export default function RabbitScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [lang, setLang] = useState<Lang>("tr");

  const t = useMemo(() => COPY[lang], [lang]);
  const displayName = useMemo(() => getDisplayName(user), [user]);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;
  const bgPulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(cardFade, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(cardSlide, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, { toValue: 0.5, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bgPulse, { toValue: 0.35, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [fadeIn, slideUp, cardFade, cardSlide, bgPulse]);

  const onEnter = () => {
    if (isAuthenticated) {
      router.replace("/(tabs)/gates" as any);
      return;
    }
    router.replace("/(auth)/login" as any);
  };

  if (isLoading) return null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Matrix rain background */}
      <ImageBackground source={MATRIX_BG} style={StyleSheet.absoluteFill} resizeMode="cover">
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: "#0a0b10", opacity: bgPulse }]} />
      </ImageBackground>

      {/* Animated rain columns */}
      <MatrixRainOverlay />

      {/* Dark gradient overlays for readability */}
      <LinearGradient
        colors={["#0a0b10", "transparent", "transparent", "#0a0b10"]}
        locations={[0, 0.2, 0.7, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10,11,16,0.72)" }]} pointerEvents="none" />

      <View style={styles.topRight}>
        <Pressable
          onPress={() => setLang("tr")}
          style={[styles.langChip, lang === "tr" && styles.langChipActive]}
        >
          <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
        </Pressable>

        <Pressable
          onPress={() => setLang("en")}
          style={[styles.langChip, lang === "en" && styles.langChipActive]}
        >
          <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.container, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
        <View style={styles.rabbitCard}>
          <View style={styles.rabbitGlow} />
          <Image source={RABBIT} style={styles.rabbit} />
          <Text style={styles.follow}>{t.follow}</Text>
          <Text style={styles.system}>{t.system}</Text>
        </View>

        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {isAuthenticated ? (
          <>
            <Text style={styles.welcomeText}>
              {t.welcome} {displayName}
            </Text>
            <Text style={styles.desc}>{t.authedDesc}</Text>
          </>
        ) : (
          <>
            <Text style={styles.quote}>{t.guestQuote}</Text>
            <Text style={styles.desc}>{t.guestDesc}</Text>
          </>
        )}

        <Animated.View style={[styles.infoCard, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
          <View style={styles.infoCardGlow} />
          <Text style={styles.infoTitle}>
            {isAuthenticated ? t.authedCardTitle : t.guestCardTitle}
          </Text>

          <Text style={styles.infoText}>
            {isAuthenticated ? t.authedCardText : t.guestCardText}
          </Text>

          <Pressable onPress={onEnter} style={styles.enterBtn}>
            <LinearGradient
              colors={["rgba(145,110,255,0.25)", "rgba(124,247,216,0.12)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.enterGradient}
            >
              <Text style={styles.enterTxt}>
                {isAuthenticated ? t.authedButton : t.guestButton}
              </Text>
            </LinearGradient>
          </Pressable>

          {isAuthenticated ? (
            <Pressable
              onPress={async () => {
                await logout();
                router.replace("/rabbit" as any);
              }}
              style={styles.logoutBtn}
            >
              <Text style={styles.logoutTxt}>{t.logout}</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0b10",
  },

  topRight: {
    position: "absolute",
    top: 58,
    right: 16,
    zIndex: 20,
    flexDirection: "row",
    gap: 10,
  },

  langChip: {
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },

  langTxt: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "900",
    fontSize: 16,
  },

  langTxtActive: {
    color: "#7cf7d8",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  rabbitCard: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.12)",
    overflow: "hidden",
  },

  rabbitGlow: {
    position: "absolute",
    top: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(124,247,216,0.06)",
  },

  rabbit: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 14,
  },

  follow: {
    color: "#7cf7d8",
    fontWeight: "900",
    letterSpacing: 3,
    fontSize: 16,
  },

  system: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 3,
    textAlign: "center",
  },

  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "900",
    letterSpacing: 6,
    textAlign: "center",
    lineHeight: 54,
  },

  subtitle: {
    color: "rgba(255,255,255,0.38)",
    letterSpacing: 5,
    marginTop: 10,
    marginBottom: 28,
    textAlign: "center",
    fontSize: 14,
  },

  welcomeText: {
    color: "#7cf7d8",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 32,
    marginBottom: 4,
  },

  quote: {
    color: "white",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 34,
  },

  desc: {
    color: "rgba(255,255,255,0.68)",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 26,
    fontSize: 16,
    marginBottom: 30,
    paddingHorizontal: 8,
  },

  infoCard: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.10)",
  },

  infoCardGlow: {
    position: "absolute",
    bottom: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(94,59,255,0.08)",
  },

  infoTitle: {
    color: "#d7c8ff",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: 3,
  },

  infoText: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 22,
  },

  enterBtn: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },

  enterGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  enterTxt: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoutBtn: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 8,
  },

  logoutTxt: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    fontWeight: "700",
  },
});
