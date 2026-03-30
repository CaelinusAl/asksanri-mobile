import React, { useMemo, useState } from "react";
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
  KeyboardAvoidingView,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";
import { apiPostJson, API } from "../../lib/apiClient";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);
const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Şifre\nDeğiştir",
    sub: "Mevcut şifreni gir ve yeni şifreni belirle.",
    current: "Mevcut Şifre",
    newPass: "Yeni Şifre",
    confirm: "Yeni Şifre Tekrar",
    cta: "Şifreyi Güncelle",
    success: "Şifre başarıyla değiştirildi.",
    mismatch: "Yeni şifreler eşleşmiyor.",
    short: "Yeni şifre en az 6 karakter olmalı.",
    wrongCurrent: "Mevcut şifre hatalı.",
    error: "Bir hata oluştu.",
    back: "Geri",
  },
  en: {
    title: "Change\nPassword",
    sub: "Enter your current password and set a new one.",
    current: "Current Password",
    newPass: "New Password",
    confirm: "Confirm New Password",
    cta: "Update Password",
    success: "Password changed successfully.",
    mismatch: "New passwords do not match.",
    short: "New password must be at least 6 characters.",
    wrongCurrent: "Current password is incorrect.",
    error: "Something went wrong.",
    back: "Back",
  },
} as const;

export default function ChangePasswordScreen() {
  const { user } = useAuth();
  const [lang] = useState<Lang>("tr");
  const t = useMemo(() => COPY[lang], [lang]);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = currentPass.trim().length > 0 && newPass.trim().length >= 6 && confirmPass.trim().length >= 6 && !loading;

  const onSubmit = async () => {
    if (newPass.trim().length < 6) {
      Alert.alert("Sanrı", t.short);
      return;
    }
    if (newPass.trim() !== confirmPass.trim()) {
      Alert.alert("Sanrı", t.mismatch);
      return;
    }
    setLoading(true);
    try {
      await apiPostJson(`${API.base}/auth/change-password`, {
        current_password: currentPass.trim(),
        new_password: newPass.trim(),
      });
      Alert.alert("Sanrı", t.success);
      router.back();
    } catch (e: any) {
      const msg = e?.message || "";
      if (msg.includes("Mevcut") || msg.includes("current") || msg.includes("hatalı")) {
        Alert.alert("Sanrı", t.wrongCurrent);
      } else {
        Alert.alert("Sanrı", msg || t.error);
      }
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
          <Text style={styles.backBtnTxt}>← {t.back}</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
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
                  value={currentPass}
                  onChangeText={setCurrentPass}
                  maxLength={72}
                  placeholder={t.current}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  secureTextEntry
                  style={styles.input}
                />

                <TextInput
                  value={newPass}
                  onChangeText={setNewPass}
                  maxLength={72}
                  placeholder={t.newPass}
                  placeholderTextColor="rgba(203,188,255,0.35)"
                  secureTextEntry
                  style={styles.input}
                />

                <TextInput
                  value={confirmPass}
                  onChangeText={setConfirmPass}
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
  topbar: { paddingTop: SAFE_TOP, paddingHorizontal: 14, paddingBottom: 8 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backBtnTxt: { color: "#7cf7d8", fontWeight: "800" },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  title: {
    color: "#b388ff",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    marginTop: 20,
  },
  sub: { marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 22 },
  cardOuter: { marginTop: 24, borderRadius: 26, overflow: "hidden" },
  cardGrad: { borderRadius: 26, padding: 1 },
  cardGlass: { borderRadius: 26, padding: 18, backgroundColor: "rgba(10,10,18,0.40)" },
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
  ctaTxt: { color: "#d7c8ff", fontWeight: "900", fontSize: 18 },
});
