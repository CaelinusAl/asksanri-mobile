import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);
const BG = require("../../assets/sanri_glass_bg.jpg");
const CODE_LENGTH = 6;

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Mailini\nDoğrula",
    sub: "E-posta adresine gönderilen 6 haneli kodu gir.",
    resend: "Kodu Tekrar Gönder",
    resendIn: "Tekrar gönder",
    back: "Girişe Dön",
    verifying: "Doğrulanıyor...",
    success: "E-posta doğrulandı!",
    invalid: "Geçersiz veya süresi dolmuş kod.",
    sent: "Yeni kod gönderildi.",
    error: "Bir hata oluştu.",
  },
  en: {
    title: "Verify\nYour Email",
    sub: "Enter the 6-digit code sent to your email address.",
    resend: "Resend Code",
    resendIn: "Resend in",
    back: "Back to Login",
    verifying: "Verifying...",
    success: "Email verified!",
    invalid: "Invalid or expired code.",
    sent: "New code sent.",
    error: "Something went wrong.",
  },
} as const;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string; lang?: string; token?: string }>();
  const lang = ((params.lang as Lang) || "tr") as Lang;
  const email = params.email ? String(params.email) : "";
  const tempToken = params.token ? String(params.token) : "";
  const t = useMemo(() => COPY[lang], [lang]);
  const { setSession } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  const handleDigitChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, CODE_LENGTH).split("");
      const newDigits = [...digits];
      chars.forEach((ch, i) => {
        if (index + i < CODE_LENGTH) newDigits[index + i] = ch;
      });
      setDigits(newDigits);
      const nextIdx = Math.min(index + chars.length, CODE_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      if (newDigits.every((d) => d !== "")) submitCode(newDigits.join(""));
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    if (cleaned && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (newDigits.every((d) => d !== "")) submitCode(newDigits.join(""));
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (code: string) => {
    if (loading) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const controller = new AbortController();
      const tmr = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(`${API_BASE}/auth/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        signal: controller.signal,
      });
      clearTimeout(tmr);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert("Sanrı", data?.detail || t.invalid);
        setDigits(Array(CODE_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 200);
        return;
      }
      if (data?.token && data?.user) {
        await setSession({
          token: String(data.token),
          user: {
            id: String(data.user.id ?? ""),
            name: data.user.name ?? "",
            email: data.user.email ?? email,
            phone: data.user.phone ?? "",
            isPremium: data.user.is_premium ?? false,
            role: data.user.role ?? "free",
          },
        });
        router.replace("/rabbit" as any);
      } else {
        Alert.alert("Sanrı", t.success);
        router.replace("/(auth)/login" as any);
      }
    } catch {
      Alert.alert("Sanrı", t.error);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const res = await fetch(`${API_BASE}/auth/email/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json().catch(() => ({}));
      Alert.alert("Sanrı", t.sent);
      setResendCooldown(60);
    } catch {
      Alert.alert("Sanrı", t.error);
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
        <Pressable onPress={() => router.replace("/(auth)/login" as any)} style={styles.backBtn}>
          <Text style={styles.backBtnTxt}>←</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>
        <Text style={styles.emailLabel}>{email}</Text>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.06)", "rgba(124,247,216,0.06)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGrad}
          >
            <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
              <View style={styles.codeRow}>
                {digits.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { inputRefs.current[i] = r; }}
                    value={digit}
                    onChangeText={(v) => handleDigitChange(v, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={CODE_LENGTH}
                    selectTextOnFocus
                    style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                  />
                ))}
              </View>

              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#7cf7d8" />
                  <Text style={styles.loadingTxt}>{t.verifying}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={onResend}
                disabled={resendCooldown > 0}
                style={[styles.resendBtn, resendCooldown > 0 && { opacity: 0.4 }]}
              >
                <Text style={styles.resendTxt}>
                  {resendCooldown > 0
                    ? `${t.resendIn} ${resendCooldown}s`
                    : t.resend}
                </Text>
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
  },
  sub: { marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 22 },
  emailLabel: { color: "#7cf7d8", fontWeight: "800", fontSize: 16, marginTop: 8 },
  cardOuter: { marginTop: 24, borderRadius: 26, overflow: "hidden" },
  cardGrad: { borderRadius: 26, padding: 1 },
  cardGlass: { borderRadius: 26, padding: 18, backgroundColor: "rgba(10,10,18,0.40)" },
  codeRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 },
  codeInput: {
    width: 46, height: 56, borderRadius: 14, textAlign: "center",
    fontSize: 24, fontWeight: "900", color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.10)",
  },
  codeInputFilled: { borderColor: "rgba(124,247,216,0.4)", backgroundColor: "rgba(124,247,216,0.06)" },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 },
  loadingTxt: { color: "#7cf7d8", fontWeight: "700" },
  resendBtn: { alignItems: "center", paddingVertical: 14 },
  resendTxt: { color: "#cbbcff", fontWeight: "800", fontSize: 15 },
  secondaryBtn: { alignItems: "center", paddingVertical: 12 },
  secondaryTxt: { color: "rgba(255,255,255,0.60)", fontWeight: "700" },
});
