import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../context/AuthContext";

type Lang = "tr" | "en";

const T = {
  tr: {
    title: "Frekansını Aç",
    sub: "E-posta veya telefon ile devam et.",
    email: "E-posta",
    phone: "Telefon",
    pass: "Şifre",
    cta: "Devam Et",
    back: "Geri",
    hint: "Hesabın yoksa devam ettiğinde oluşturulur.",
  },
  en: {
    title: "Activate Your Frequency",
    sub: "Continue with email or phone.",
    email: "Email",
    phone: "Phone",
    pass: "Password",
    cta: "Continue",
    back: "Back",
    hint: "If you don’t have an account, it will be created.",
  },
} as const;

export default function LoginScreen() {
  const { setUser } = useAuth();

  const params = useLocalSearchParams<{ next?: string }>();
  const nextRoute = params.next ? String(params.next) : "/(tabs)/gates";

  const [lang, setLang] = useState<Lang>("tr");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const t = T[lang];

  const disabled =
    !pass.trim() ||
    (mode === "email" ? !email.trim() : !phone.trim());

  const handleSubmit = async () => {
    if (disabled) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const id = Date.now().toString(16);

    await setUser({
      id,
      email: mode === "email" ? email.trim() : undefined,
      phone: mode === "phone" ? phone.trim() : undefined,
    });

    router.replace(nextRoute as any);
  };

  const handleBack = () => {
    if ((router as any).canGoBack?.()) router.back();
    else router.replace("/");
  };

  const bg = useMemo(
  () => ["#07080d", "#12082a", "#1a0d3a"] as const,
  []
);

  return (
    <LinearGradient colors={bg} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* TR EN */}
        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langBtn, lang === "tr" && styles.langActive]}
          >
            <Text style={styles.langText}>TR</Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langBtn, lang === "en" && styles.langActive]}
          >
            <Text style={styles.langText}>EN</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

        {/* MODE */}
        <View style={styles.modeRow}>
          <Pressable
            style={[styles.modeBtn, mode === "email" && styles.modeActive]}
            onPress={() => setMode("email")}
          >
            <Text style={styles.modeText}>{t.email}</Text>
          </Pressable>

          <Pressable
            style={[styles.modeBtn, mode === "phone" && styles.modeActive]}
            onPress={() => setMode("phone")}
          >
            <Text style={styles.modeText}>{t.phone}</Text>
          </Pressable>
        </View>

        {mode === "email" ? (
          <TextInput
            placeholder={t.email}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        ) : (
          <TextInput
            placeholder={t.phone}
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        )}

        <TextInput
          placeholder={t.pass}
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={styles.input}
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <Pressable
          onPress={handleSubmit}
          style={[styles.cta, disabled && { opacity: 0.5 }]}
          disabled={disabled}
        >
          <Text style={styles.ctaText}>{t.cta}</Text>
        </Pressable>

        <Text style={styles.hint}>{t.hint}</Text>

        <Pressable onPress={handleBack} style={{ marginTop: 20 }}>
          <Text style={{ color: "#7cf7d8" }}>{t.back}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 90,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
  },

  sub: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
    marginBottom: 24,
  },

  modeRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },

  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
  },

  modeActive: {
    backgroundColor: "rgba(94,59,255,0.5)",
  },

  modeText: {
    color: "white",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 14,
    color: "white",
    marginBottom: 14,
  },

  cta: {
    backgroundColor: "#5e3bff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },

  ctaText: {
    color: "white",
    fontWeight: "700",
  },

  hint: {
    color: "rgba(255,255,255,0.4)",
    marginTop: 12,
    fontSize: 12,
  },

  langRow: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },

  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  langActive: {
    backgroundColor: "rgba(124,247,216,0.2)",
  },

  langText: {
    color: "white",
    fontWeight: "700",
  },
});