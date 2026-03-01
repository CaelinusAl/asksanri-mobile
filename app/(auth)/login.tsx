// app/(auth)/login.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../context/AuthContext";
import MatrixRain from "../../lib/MatrixRain";

type Lang = "tr" | "en";

export default function LoginScreen() {
  const { setUser } = useAuth();
  const params = useLocalSearchParams<{ next?: string }>();
  const nextRoute = params.next ? String(params.next) : "/(tabs)/gates";

  const [lang, setLang] = useState<Lang>("tr");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const bg = useMemo(() => ["#07080d", "#12082a", "#05060a"] as const, []);

  const disabled =
    pass.trim().length < 3 || (mode === "email" ? email.trim().length < 3 : phone.trim().length < 6);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/rabbit");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (disabled) return;

    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}

    // Şimdilik “local login”
    const id = Date.now().toString(16);
    await setUser({
      id,
      email: mode === "email" ? email.trim() : undefined,
      phone: mode === "phone" ? phone.trim() : undefined,
    });

    // LOGIN SONRASI
    router.replace(nextRoute as any);
  }, [disabled, email, phone, mode, nextRoute, setUser]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />
      <MatrixRain opacity={0.18} />

      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={10}>
            <Text style={styles.backTxt}>←</Text>
          </Pressable>

          <View style={styles.langRow}>
            <Pressable onPress={() => setLang("tr")} style={[styles.langBtn, lang === "tr" && styles.langActive]} hitSlop={10}>
              <Text style={styles.langTxt}>TR</Text>
            </Pressable>
            <Pressable onPress={() => setLang("en")} style={[styles.langBtn, lang === "en" && styles.langActive]} hitSlop={10}>
              <Text style={styles.langTxt}>EN</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>{lang === "tr" ? "Frekansını Aç" : "Activate Your Frequency"}</Text>
        <Text style={styles.sub}>{lang === "tr" ? "E-posta veya telefon ile devam et." : "Continue with email or phone."}</Text>

        <View style={styles.modeRow}>
          <Pressable onPress={() => setMode("email")} style={[styles.modeBtn, mode === "email" && styles.modeActive]}>
            <Text style={styles.modeTxt}>{lang === "tr" ? "E-posta" : "Email"}</Text>
          </Pressable>
          <Pressable onPress={() => setMode("phone")} style={[styles.modeBtn, mode === "phone" && styles.modeActive]}>
            <Text style={styles.modeTxt}>{lang === "tr" ? "Telefon" : "Phone"}</Text>
          </Pressable>
        </View>

        {mode === "email" ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={lang === "tr" ? "E-posta" : "Email"}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            autoCapitalize="none"
          />
        ) : (
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={lang === "tr" ? "Telefon" : "Phone"}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
            keyboardType="phone-pad"
          />
        )}

        <TextInput
          value={pass}
          onChangeText={setPass}
          placeholder={lang === "tr" ? "Şifre" : "Password"}
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          secureTextEntry
        />

        <Pressable onPress={handleSubmit} disabled={disabled} style={[styles.cta, disabled && { opacity: 0.5 }]}>
          <Text style={styles.ctaTxt}>{lang === "tr" ? "Devam Et" : "Continue"}</Text>
        </Pressable>

        <Text style={styles.hint}>
          {lang === "tr"
            ? "Hesabın yoksa devam ettiğinde oluşturulur."
            : "If you don’t have an account, it will be created."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, paddingTop: 60 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  backTxt: { color: "white", fontSize: 18, fontWeight: "900" },

  langRow: { flexDirection: "row", gap: 8 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  langActive: { borderColor: "rgba(124,247,216,0.35)", backgroundColor: "rgba(124,247,216,0.10)" },
  langTxt: { color: "white", fontWeight: "900" },

  title: { color: "white", fontSize: 42, fontWeight: "900", marginTop: 22 },
  sub: { color: "rgba(255,255,255,0.60)", marginTop: 10 },

  modeRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  modeBtn: { flex: 1, paddingVertical: 12, borderRadius: 999, alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  modeActive: { backgroundColor: "rgba(94,59,255,0.35)", borderColor: "rgba(94,59,255,0.55)" },
  modeTxt: { color: "white", fontWeight: "900" },

  input: { marginTop: 14, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)", color: "white" },

  cta: { marginTop: 18, borderRadius: 18, paddingVertical: 16, alignItems: "center", backgroundColor: "#5e3bff" },
  ctaTxt: { color: "white", fontWeight: "900", fontSize: 16 },

  hint: { color: "rgba(255,255,255,0.50)", marginTop: 14 },
});