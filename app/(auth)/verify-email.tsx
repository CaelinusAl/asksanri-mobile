import React, { useMemo, useState } from "react";
import { API_BASE } from "../../lib/config";
import {
  View,
  Text,
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
    title: "Mailini\nDoğrula",
    sub: "Hesabını aktive etmek için e-posta adresine gönderilen bağlantıyı onayla.",
    resend: "Doğrulama Mailini Yeniden Gönder",
    openLogin: "Giriş Ekranına Dön",
    sent: "Doğrulama maili tekrar gönderildi.",
    error: "Mail gönderilemedi.",
    missingEmail: "E-posta bilgisi bulunamadı.",
    checking: "Gönderiliyor...",
  },
  en: {
    title: "Verify\nYour Email",
    sub: "Activate your account by confirming the link sent to your email address.",
    resend: "Resend Verification Email",
    openLogin: "Back to Login",
    sent: "Verification email sent again.",
    error: "Could not send email.",
    missingEmail: "Email information is missing.",
    checking: "Sending...",
  },
} as const;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams<{ email?: string; lang?: string }>();
  const lang = ((params.lang as Lang) || "tr") as Lang;
  const email = params.email ? String(params.email) : "";
  const t = useMemo(() => COPY[lang], [lang]);

  const [loading, setLoading] = useState(false);

  const onResend = async () => {
    if (!email) {
      Alert.alert("Alert", t.missingEmail);
      return;
    }

    try {
      setLoading(true);

      const controller = new AbortController();
      const tmr = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${API_BASE}/auth/email/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      clearTimeout(tmr);

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        Alert.alert("Alert", data?.detail || t.error);
        return;
      }

      Alert.alert("Alert", t.sent);
    } catch (e) {
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
              <Text style={styles.emailLabel}>{email || "—"}</Text>

              <Pressable onPress={onResend} disabled={loading} style={styles.btnOuter}>
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
                      <Text style={styles.btnTxt}>{t.resend}</Text>
                    )}
                  </BlurView>
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={() => router.replace({ pathname: "/(auth)/login", params: { lang } } as any)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryTxt}>{t.openLogin}</Text>
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

  emailLabel: {
    color: "#7cf7d8",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 18,
  },

  btnOuter: {
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