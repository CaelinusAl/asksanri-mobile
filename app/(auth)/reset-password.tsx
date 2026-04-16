import React, { useMemo, useState } from "react";
import { API_BASE } from "../../lib/config";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

type Lang = "tr" | "en";

const COPY = {
  tr: {
    title: "Şifreni\nYenile",
    sub: "Yeni bir şifre belirle ve hesabına tekrar bağlan.",
    pass: "Yeni Şifre",
    confirm: "Şifre Tekrar",
    cta: "Şifreyi Güncelle",
    success: "Şifre başarıyla güncellendi.",
    mismatch: "Şifreler eşleşmiyor.",
    short: "Şifre en az 6 karakter olmalı.",
    missingToken: "Reset token bulunamadı.",
    error: "Şifre güncellenemedi.",
    login: "Girişe Dön",
  },
  en: {
    title: "Reset\nPassword",
    sub: "Set a new password and reconnect to your account.",
    pass: "New Password",
    confirm: "Confirm Password",
    cta: "Update Password",
    success: "Password updated successfully.",
    mismatch: "Passwords do not match.",
    short: "Password must be at least 6 characters.",
    missingToken: "Reset token is missing.",
    error: "Could not update password.",
    login: "Back to Login",
  },
} as const;

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string; lang?: string }>();
  const lang = ((params.lang as Lang) || "tr") as Lang;
  const token = params.token ? String(params.token) : "";
  const t = useMemo(() => COPY[lang], [lang]);

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!token) {
      Alert.alert("Alert", t.missingToken);
      return;
    }

    if (pass.trim().length < 6) {
      Alert.alert("Alert", t.short);
      return;
    }

    if (pass.trim() !== confirm.trim()) {
      Alert.alert("Alert", t.mismatch);
      return;
    }

    try {
      setLoading(true);

      const controller = new AbortController();
      const tmr = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${API_BASE}/auth/email/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: pass.trim(),
        }),
        signal: controller.signal,
      });
      clearTimeout(tmr);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.alert("Alert", data?.detail || t.error);
        return;
      }

      Alert.alert("Alert", t.success);
      router.replace({ pathname: "/(auth)/login", params: { lang } } as any);
    } catch {
      Alert.alert("Alert", t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

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

              <Pressable onPress={onSubmit} disabled={loading} style={styles.btnOuter}>
                <LinearGradient
                  colors={[
                    "rgba(169,112,255,0.42)",
                    "rgba(94,59,255,0.30)",
                    "rgba(124,247,216,0.10)",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGrad}
                >
                  <BlurView intensity={22} tint="dark" style={styles.btnGlass}>
                    {loading ? (
                      <ActivityIndicator color="#d7c8ff" />
                    ) : (
                      <Text style={styles.btnTxt}>{t.cta}</Text>
                    )}
                  </BlurView>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.replace({ pathname: "/(auth)/login", params: { lang } } as any)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryTxt}>{t.login}</Text>
              </Pressable>
            </BlurView>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  title: {
    color: "#b388ff",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },

  sub: {
    marginTop: 12,
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 23,
  },

  cardOuter: {
    marginTop: 24,
    borderRadius: 26,
    overflow: "hidden",
  },

  cardGrad: {
    borderRadius: 26,
    padding: 1,
  },

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

  btnOuter: {
    marginTop: 10,
    borderRadius: 22,
    overflow: "hidden",
  },

  btnGrad: {
    borderRadius: 22,
    padding: 1,
  },

  btnGlass: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(10,10,18,0.35)",
  },

  btnTxt: {
    color: "#d7c8ff",
    fontWeight: "900",
    fontSize: 17,
  },

  secondaryBtn: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 12,
  },

  secondaryTxt: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "700",
  },
});