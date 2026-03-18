import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import MatrixRain from "../lib/MatrixRain";
import { useAuth } from "../context/AuthContext";

const BG = require("../assets/sanri_glass_bg.jpg");
const RABBIT = require("../assets/rabbit.jpg");

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
    guestCardText: "Sanrı bilgi üretmez. Alan açar. Anlam sende şekillenir.",
    guestButton: "🔑 Frekans Alanı Aç",
    welcome: "Hoş geldin,",
    authedDesc:
      "SANRI alanı seni tanıdı. Çıkış yapmadığın sürece yeniden giriş istenmez.",
    authedCardTitle: "FREKANS ALANI",
    authedCardText: "Kapı açık. Şimdi frekans alanına geçebilirsin.",
    authedButton: "Frekans Alanına Gir",
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
    guestCardText: "SANRI doesn't produce information. It opens meaning.",
    guestButton: "🔑 Open Frequency Gate",
    welcome: "Welcome,",
    authedDesc:
      "SANRI recognized your field. It won't ask you to log in again unless you sign out.",
    authedCardTitle: "FREQUENCY FIELD",
    authedCardText: "The gate is open. You may now enter the frequency field.",
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

export default function RabbitScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [lang, setLang] = useState<Lang>("tr");

  const t = useMemo(() => COPY[lang], [lang]);
  const displayName = useMemo(() => getDisplayName(user), [user]);

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

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <MatrixRain opacity={0.15} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

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

      <View style={styles.container}>
        <View style={styles.rabbitCard}>
          <Image source={RABBIT} style={styles.rabbit} />
          <Text style={styles.follow}>{t.follow}</Text>
          <Text style={styles.system}>{t.system}</Text>
        </View>

        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {isAuthenticated ? (
          <>
            <Text style={styles.quote}>
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

        <BlurView intensity={24} tint="dark" style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {isAuthenticated ? t.authedCardTitle : t.guestCardTitle}
          </Text>

          <Text style={styles.infoText}>
            {isAuthenticated ? t.authedCardText : t.guestCardText}
          </Text>

          <Pressable onPress={onEnter} style={styles.enterBtn}>
            <Text style={styles.enterTxt}>
              {isAuthenticated ? t.authedButton : t.guestButton}
            </Text>
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
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#06070b",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,8,18,0.56)",
  },

  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 220,
    top: 60,
    left: -140,
    backgroundColor: "rgba(94,59,255,0.16)",
  },

  glowB: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: 230,
    bottom: -120,
    right: -160,
    backgroundColor: "rgba(124,247,216,0.10)",
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
    marginBottom: 26,
    paddingHorizontal: 28,
    paddingVertical: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  rabbit: {
    width: 100,
    height: 100,
    borderRadius: 24,
    marginBottom: 12,
  },

  follow: {
    color: "#7cf7d8",
    fontWeight: "900",
    letterSpacing: 3,
    fontSize: 16,
  },

  system: {
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 2,
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
    color: "rgba(255,255,255,0.42)",
    letterSpacing: 5,
    marginTop: 10,
    marginBottom: 24,
    textAlign: "center",
    fontSize: 15,
  },

  quote: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "900",
    lineHeight: 36,
  },

  desc: {
    color: "rgba(255,255,255,0.78)",
    textAlign: "center",
    marginTop: 18,
    lineHeight: 25,
    fontSize: 16,
    marginBottom: 26,
  },

  infoCard: {
    width: "100%",
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  infoTitle: {
    color: "#d7c8ff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: 1,
  },

  infoText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },

  enterBtn: {
    borderRadius: 24,
    backgroundColor: "rgba(145,110,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(203,188,255,0.22)",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  enterTxt: {
    color: "#d7c8ff",
    fontSize: 18,
    fontWeight: "900",
  },

  logoutBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 8,
  },

  logoutTxt: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 15,
    fontWeight: "700",
  },
});