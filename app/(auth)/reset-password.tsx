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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);
const BG = require("../../assets/sanri_glass_bg.jpg");
const CODE_LENGTH = 6;

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Şifreni\nYenile",
    sub: "E-postana gelen 6 haneli kodu ve yeni şifreni gir.",
    code: "Doğrulama Kodu",
    pass: "Yeni Şifre",
    confirm: "Şifre Tekrar",
    cta: "Şifreyi Güncelle",
    success: "Şifre başarıyla güncellendi. Şimdi giriş yapabilirsin.",
    mismatch: "Şifreler eşleşmiyor.",
    short: "Şifre en az 6 karakter olmalı.",
    invalid: "Geçersiz veya süresi dolmuş kod.",
    error: "Bir hata oluştu.",
    back: "Girişe Dön",
  },
  en: {
    title: "Reset\nPassword",
    sub: "Enter the 6-digit code from your email and your new password.",
    code: "Verification Code",
    pass: "New Password",
    confirm: "Confirm Password",
    cta: "Update Password",
    success: "Password updated. You can log in now.",
    mismatch: "Passwords do not match.",
    short: "Password must be at least 6 characters.",
    invalid: "Invalid or expired code.",
    error: "Something went wrong.",
    back: "Back to Login",
  },
} as const;

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string; lang?: string }>();
  const lang = ((params.lang as Lang) || "tr") as Lang;
  const email = params.email ? String(params.email) : "";
  const t = useMemo(() => COPY[lang], [lang]);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    if (cleaned && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      Alert.alert("Sanrı", t.invalid);
      return;
    }
    if (pass.trim().length < 6) {
      Alert.alert("Sanrı", t.short);
      return;
    }
    if (pass.trim() !== confirm.trim()) {
      Alert.alert("Sanrı", t.mismatch);
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const controller = new AbortController();
      const tmr = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(`${API_BASE}/auth/email/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password: pass.trim() }),
        signal: controller.signal,
      });
      clearTimeout(tmr);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert("Sanrı", data?.detail || t.invalid);
        return;
      }
      Alert.alert("Sanrı", t.success);
      router.replace("/(auth)/login" as any);
    } catch {
      Alert.alert("Sanrı", t.error);
    } finally {
      setLoading(false);
    }
  };

  const codeComplete = digits.every((d) => d !== "");
  const canSubmit = codeComplete && pass.trim().length >= 6 && confirm.trim().length >= 6 && !loading;

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>
          {email ? <Text style={styles.emailLabel}>{email}</Text> : null}

          <View style={styles.cardOuter}>
            <LinearGradient
              colors={["rgba(255,255,255,0.14)", "rgba(255,255,255,0.06)", "rgba(124,247,216,0.06)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGrad}
            >
              <BlurView intensity={24} tint="dark" style={styles.cardGlass}>
                <Text style={styles.label}>{t.code}</Text>
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

                <TextInput
                  value={pass}
                  onChangeText={setPass}
                  maxLength={72}
                  placeholder={t.pass}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  secureTextEntry
                  style={styles.input}
                />

                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  maxLength={72}
                  placeholder={t.confirm}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  secureTextEntry
                  style={styles.input}
                />

                <Pressable
                  onPress={onSubmit}
                  disabled={!canSubmit}
                  style={[styles.ctaOuter, !canSubmit && { opacity: 0.55 }]}
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

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  container: { paddingHorizontal: 18, paddingTop: 10 },
  title: {
    color: "#b388ff", fontSize: 36, fontWeight: "900", lineHeight: 42,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
  },
  sub: { marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 22 },
  emailLabel: { color: "#7cf7d8", fontWeight: "800", fontSize: 15, marginTop: 6 },
  label: { color: "rgba(255,255,255,0.6)", fontWeight: "800", fontSize: 13, marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" },
  cardOuter: { marginTop: 20, borderRadius: 26, overflow: "hidden" },
  cardGrad: { borderRadius: 26, padding: 1 },
  cardGlass: { borderRadius: 26, padding: 18, backgroundColor: "rgba(10,10,18,0.40)" },
  codeRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  codeInput: {
    width: 42, height: 52, borderRadius: 12, textAlign: "center",
    fontSize: 22, fontWeight: "900", color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.10)",
  },
  codeInputFilled: { borderColor: "rgba(124,247,216,0.4)", backgroundColor: "rgba(124,247,216,0.06)" },
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
