import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";
import { API, apiPostJson } from "../../lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";
type Tab = "login" | "register";

const COPY = {
  tr: {
    title: "Bilinç ve Anlam\nZekası",
    sub: "SANRI cevap üretmez. Alan açar. Anlam sende şekillenir.",
    email: "E-posta",
    pass: "Şifre",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    loginBtn: "Frekansını Aç",
    registerBtn: "Hesap Oluştur",
    registerHint: "Kayıt sonrası hesabınla giriş yapabilirsin.",
    loginError: "E-posta veya şifre hatalı.",
    registerExists: "Bu e-posta zaten kayıtlı. Giriş Yap sekmesine geç.",
    registerOk: "Kayıt tamamlandı. Şimdi giriş yapabilirsin.",
    network: "Bağlantı hatası.",
  },
  en: {
    title: "Consciousness & Meaning\nIntelligence",
    sub: "SANRI doesn’t produce answers. It opens space. Meaning forms in you.",
    email: "Email",
    pass: "Password",
    login: "Login",
    register: "Register",
    loginBtn: "Open Your Frequency",
    registerBtn: "Create Account",
    registerHint: "After registering, you can log in with your account.",
    loginError: "Email or password is incorrect.",
    registerExists: "This email is already registered. Switch to Login.",
    registerOk: "Registration completed. You can log in now.",
    network: "Connection error.",
  },
} as const;

export default function LoginScreen() {
  const { setSession, isAuthenticated, isLoading } = useAuth();

  const [lang, setLang] = useState<Lang>("tr");
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const t = useMemo(() => COPY[lang], [lang]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/rabbit" as any);
    }
  }, [isLoading, isAuthenticated]);

  const disabled = useMemo(() => {
    return !email.trim() || !pass.trim() || submitting;
  }, [email, pass, submitting]);

  const showDetail = (error: any, fallback: string) => {
    const msg = error?.message || error?.detail || fallback;
    Alert.alert("Alert", String(msg));
  };

  const onSubmit = async () => {
    if (disabled) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    try {
      setSubmitting(true);

      if (tab === "login") {
        const normalizedEmail = email.trim().toLowerCase();

        const data = await apiPostJson(`${API.base}/auth/login`, {
          email: normalizedEmail,
          password: pass.trim(),
        });

        if (data?.requires_2fa) {
          router.push({
            pathname: "/2fa" as any,
            params: { email: normalizedEmail },
          });
          return;
        }

        await setSession({
          token: String(data.token),
          user: {
            id: String(data.user?.id ?? data.user_id ?? normalizedEmail),
            name: data.user?.name ?? "",
            email: data.user?.email ?? normalizedEmail,
            phone: data.user?.phone ?? "",
          },
        });

        router.replace("/rabbit" as any);
        return;
      }

      if (tab === "register") {
        await apiPostJson(`${API.base}/auth/register`, {
          email: email.trim().toLowerCase(),
          password: pass.trim(),
        });

        Alert.alert("Alert", t.registerOk);
        setTab("login");
        return;
      }
    } catch (error: any) {
      const text = String(error?.message || "");

      if (tab === "login") {
        showDetail(error, t.loginError);
        return;
      }

      if (tab === "register") {
        if (
          text.toLowerCase().includes("already") ||
          text.toLowerCase().includes("exists") ||
          text.toLowerCase().includes("registered")
        ) {
          Alert.alert("Alert", t.registerExists);
          setTab("login");
          return;
        }

        showDetail(error, t.network);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const primaryText = tab === "login" ? t.loginBtn : t.registerBtn;

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.14} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.veil} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.replace("/rabbit" as any)} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
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
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <View style={styles.container}>
          <Text style={styles.h1}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>

          <View style={styles.tabRow}>
            <Pressable
              onPress={() => setTab("login")}
              style={[styles.tabBtn, tab === "login" && styles.tabBtnActive]}
            >
              <Text style={[styles.tabTxt, tab === "login" && styles.tabTxtActive]}>
                {t.login}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setTab("register")}
              style={[styles.tabBtn, tab === "register" && styles.tabBtnActive]}
            >
              <Text style={[styles.tabTxt, tab === "register" && styles.tabTxtActive]}>
                {t.register}
              </Text>
            </Pressable>
          </View>

          <View style={styles.cardOuter}>
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.14)",
                "rgba(255,255,255,0.06)",
                "rgba(124,247,216,0.06)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGrad}
            >
              <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t.email}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />

                <TextInput
                  value={pass}
                  onChangeText={setPass}
                  placeholder={t.pass}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  secureTextEntry
                  style={styles.input}
                />

                <Pressable
                  onPress={onSubmit}
                  disabled={disabled}
                  style={[styles.ctaOuter, disabled && { opacity: 0.55 }]}
                >
                  <LinearGradient
                    colors={[
                      "rgba(169,112,255,0.42)",
                      "rgba(94,59,255,0.30)",
                      "rgba(124,247,216,0.10)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaGrad}
                  >
                    <BlurView intensity={22} tint="dark" style={styles.ctaGlass}>
                      <Text style={styles.ctaTxt}>
                        {submitting ? "..." : primaryText}
                      </Text>
                    </BlurView>
                  </LinearGradient>
                </Pressable>

                <Text style={styles.hint}>
                  {tab === "register" ? t.registerHint : ""}
                </Text>
              </BlurView>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  veil: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,8,20,0.52)" },

  topbar: {
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
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

  langRow: { flexDirection: "row", gap: 8 },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.25)",
  },
  langTxt: { color: "rgba(255,255,255,0.70)", fontWeight: "900" },
  langTxtActive: { color: "#7cf7d8" },

  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  h1: {
    color: "#b388ff",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    marginTop: 40,
  },
  sub: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },

  tabRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  tabBtn: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  tabBtnActive: {
    borderColor: "rgba(169,112,255,0.45)",
    backgroundColor: "rgba(169,112,255,0.18)",
  },
  tabTxt: { color: "rgba(255,255,255,0.78)", fontWeight: "900", fontSize: 16 },
  tabTxtActive: { color: "#b388ff" },

  cardOuter: { marginTop: 18, borderRadius: 26, overflow: "hidden" },
  cardGrad: { borderRadius: 26, padding: 1 },
  cardGlass: {
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(10,10,18,0.40)",
  },

  input: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 12,
  },

  ctaOuter: { marginTop: 10, borderRadius: 22, overflow: "hidden" },
  ctaGrad: { borderRadius: 22, padding: 1 },
  ctaGlass: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(10,10,18,0.35)",
  },
  ctaTxt: {
    color: "#d7c8ff",
    fontWeight: "900",
    fontSize: 18,
  },

  hint: {
    color: "rgba(255,255,255,0.58)",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});