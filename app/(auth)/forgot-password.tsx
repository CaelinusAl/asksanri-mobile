import React, { useMemo, useState } from "react";
import { API_BASE } from "../../lib/config";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);
const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Şifreni\nSıfırla",
    sub: "E-posta adresini gir, sana sıfırlama kodu gönderelim.",
    email: "E-posta",
    cta: "Sıfırlama Kodu Gönder",
    back: "Girişe Dön",
    sent: "Sıfırlama kodu gönderildi. E-postanı kontrol et.",
    error: "Bir hata oluştu.",
    empty: "E-posta adresi gir.",
  },
  en: {
    title: "Reset\nPassword",
    sub: "Enter your email and we'll send you a reset code.",
    email: "Email",
    cta: "Send Reset Code",
    back: "Back to Login",
    sent: "Reset code sent. Check your email.",
    error: "Something went wrong.",
    empty: "Enter your email address.",
  },
} as const;

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const lang = ((params.lang as Lang) || "tr") as Lang;
  const t = useMemo(() => COPY[lang], [lang]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert("Sanrı", t.empty);
      return;
    }
    setLoading(true);
    try {
      const controller = new AbortController();
      const tmr = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(`${API_BASE}/auth/email/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
        signal: controller.signal,
      });
      clearTimeout(tmr);
      await res.json().catch(() => ({}));
      Alert.alert("Sanrı", t.sent);
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email: trimmed, lang },
      } as any);
    } catch {
      Alert.alert("Sanrı", t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.14} speedMs={9000} />
      </View>
      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>←</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.06)", "rgba(124,247,216,0.06)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGrad}
          >
            <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                maxLength={254}
                placeholder={t.email}
                placeholderTextColor="rgba(203,188,255,0.35)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Pressable
                onPress={onSubmit}
                disabled={loading || !email.trim()}
                style={[styles.ctaOuter, (!email.trim() || loading) && { opacity: 0.55 }]}
              >
                <LinearGradient
                  colors={["rgba(169,112,255,0.42)", "rgba(94,59,255,0.30)", "rgba(124,247,216,0.10)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGrad}
                >
                  <View style={styles.ctaGlass}>
                    {loading ? (
                      <ActivityIndicator color="#d7c8ff" size="small" />
                    ) : (
                      <Text style={styles.ctaTxt}>{t.cta}</Text>
                    )}
                  </View>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.replace("/(auth)/login" as any)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryTxt}>{t.back}</Text>
              </Pressable>
            </BlurView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.52)" },
  topbar: { paddingTop: SAFE_TOP, paddingHorizontal: 14, paddingBottom: 8 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.10)",
  },
  backBtnTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  title: {
    color: "#b388ff", fontSize: 42, fontWeight: "900", lineHeight: 46,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
    marginTop: 40,
  },
  sub: { marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 22 },
  cardOuter: { marginTop: 24, borderRadius: 26, overflow: "hidden" },
  cardGrad: { borderRadius: 26, padding: 1 },
  cardGlass: { borderRadius: 26, padding: 18, backgroundColor: "rgba(10,10,18,0.40)" },
  input: {
    borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14,
    color: "white", backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", marginBottom: 12,
  },
  ctaOuter: { marginTop: 10, borderRadius: 22, overflow: "hidden" },
  ctaGrad: { borderRadius: 22, padding: 1 },
  ctaGlass: { borderRadius: 22, paddingVertical: 16, alignItems: "center", backgroundColor: "rgba(10,10,18,0.35)" },
  ctaTxt: { color: "#d7c8ff", fontWeight: "900", fontSize: 18 },
  secondaryBtn: { marginTop: 14, alignItems: "center", paddingVertical: 12 },
  secondaryTxt: { color: "rgba(255,255,255,0.72)", fontWeight: "700" },
});
