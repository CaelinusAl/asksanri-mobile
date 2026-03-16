import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../context/AuthContext";
import MatrixRain from "../../lib/MatrixRain";
import { setToken } from "../../lib/auth";

type Lang = "tr" | "en";
type Mode = "email" | "phone";

const BG = require("../../assets/sanri_glass_bg.jpg");

const COPY = {
  tr: {
    title: "Bilinç Ve Anlam\nZekası",
    sub: "SANRI cevap üretmez.\nAlan açar. Anlam sende şekillenir.",
    email: "E-posta",
    phone: "Telefon",
    emailPh: "E-posta",
    phonePh: "Telefon",
    passPh: "Şifre",
    cta: "Frekansını Aç",
    hint: "Hesabın yoksa devam ettiğinde oluşturulur.",
    back: "Geri",
  },
  en: {
    title: "Consciousness\n& Meaning Intelligence",
    sub: "SANRI doesn’t produce answers.\nIt opens space. Meaning forms in you.",
    email: "Email",
    phone: "Phone",
    emailPh: "Email",
    phonePh: "Phone",
    passPh: "Password",
    cta: "Open Your Frequency",
    hint: "If you don’t have an account, it will be created.",
    back: "Back",
  },
} as const;

export default function LoginScreen() {
  const { setUser } = useAuth();
  const params = useLocalSearchParams<{ next?: string; lang?: string }>();
  const nextRoute = params.next ? String(params.next) : "/(tabs)/gates";

  const [lang, setLang] = useState<Lang>((params.lang as Lang) || "tr");
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  const [matrixBoost, setMatrixBoost] = useState(false);
  const [passPulse, setPassPulse] = useState(false);

  const passTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matrixTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = useMemo(() => COPY[lang], [lang]);

  const disabled = useMemo(() => {
    const p = pass.trim();
    if (!p) return true;
    if (mode === "email") return !email.trim();
    return !phone.trim();
  }, [mode, email, phone, pass]);

  const triggerPassPulse = () => {
    if (passTimerRef.current) clearTimeout(passTimerRef.current);
    setPassPulse(true);
    passTimerRef.current = setTimeout(() => {
      setPassPulse(false);
    }, 2200);
  };

  const triggerMatrixBoost = () => {
    if (matrixTimerRef.current) clearTimeout(matrixTimerRef.current);
    setMatrixBoost(true);
    matrixTimerRef.current = setTimeout(() => {
      setMatrixBoost(false);
    }, 6000);
  };

  useEffect(() => {
    return () => {
      if (matrixTimerRef.current) clearTimeout(matrixTimerRef.current);
      if (passTimerRef.current) clearTimeout(passTimerRef.current);
    };
  }, []);

  const onSubmit = async () => {
    if (disabled) return;

    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}

      const loginValue = mode === "email" ? email.trim() : phone.trim();

      const res = await fetch("https://api.asksanri.com/auth/email/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginValue,
          password: pass.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        triggerPassPulse();
        alert(String((data as any)?.detail || "Login failed"));
        return;
      }

      if (data?.token) {
        await setToken(String(data.token));
      }

      await setUser({
        id: String(data.user_id),
        email: mode === "email" ? loginValue : undefined,
        phone: mode === "phone" ? loginValue : undefined,
      });

      triggerMatrixBoost();
      router.replace(nextRoute as any);
    } catch (err) {
      console.log("login error:", err);
      alert("Connection error");
    }
  };

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/gates");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      {/* Matrix rain */}
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain
             opacity={matrixBoost ? 0.42 : 0.14}
             speedMs={matrixBoost ? 3200 : 9000}
/>
      </View>

      {/* filmic veil */}
      <View pointerEvents="none" style={styles.veil} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      {/* TOP BAR */}
      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
            hitSlop={10}
          >
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>
          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
            hitSlop={10}
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

          {/* MODE CHIPS */}
          <View style={styles.modeRow}>
            <Pressable
              onPress={() => setMode("email")}
              style={[styles.modeChip, mode === "email" && styles.modeChipActive]}
            >
              <Text style={[styles.modeTxt, mode === "email" && styles.modeTxtActive]}>
                {t.email}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMode("phone")}
              style={[styles.modeChip, mode === "phone" && styles.modeChipActive]}
            >
              <Text style={[styles.modeTxt, mode === "phone" && styles.modeTxtActive]}>
                {t.phone}
              </Text>
            </Pressable>
          </View>

          {/* GLASS CARD */}
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
                {mode === "email" ? (
                  <TextInput
  value={email}
  onChangeText={(value) => {
    const wasEmpty = email.trim().length === 0;
    setEmail(value);

    if (wasEmpty && value.trim().length > 0) {
      triggerMatrixBoost();
    }
  }}
  placeholder={t.emailPh}
  placeholderTextColor="rgba(203,188,255,0.35)"
  autoCapitalize="none"
  keyboardType="email-address"
  style={[
    styles.input,
    matrixBoost && styles.inputBoost
  ]}
/>
                ) : (
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder={t.phonePh}
                    placeholderTextColor="rgba(203,188,255,0.35)"
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                )}

                <TextInput
                  value={pass}
                  onChangeText={(value) => {
                  const wasEmpty = pass.trim().length === 0;
                  setPass(value);

                 if (wasEmpty && value.trim().length > 0) {
                 triggerPassPulse();
                }
  }}
               placeholder={t.passPh}
               placeholderTextColor="rgba(203,188,255,0.35)"
               secureTextEntry
               style={[
               styles.input,
               passPulse && styles.passInputPulse
  ]}
/>

                {/* CTA GLASS */}
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
                      <Text style={styles.ctaTxt}>{t.cta}</Text>
                    </BlurView>
                  </LinearGradient>
                </Pressable>

                <Text style={styles.hint}>{t.hint}</Text>
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
  glowA: {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: 560,
    left: -210,
    top: 80,
    backgroundColor: "rgba(94,59,255,0.22)",
  },
  glowB: {
    position: "absolute",
    width: 620,
    height: 620,
    borderRadius: 620,
    right: -240,
    bottom: -140,
    backgroundColor: "rgba(124,247,216,0.12)",
  },

  topbar: {
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
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
  langTxt: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  h1: {
    color: "#b388ff",
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 46,
    textShadowColor: "rgba(169,112,255,0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  sub: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
  },

  modeRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  modeChip: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 12,
    alignItems: "center",
  },
  modeChipActive: {
    borderColor: "rgba(169,112,255,0.45)",
    backgroundColor: "rgba(169,112,255,0.18)",
  },
  modeTxt: { color: "rgba(255,255,255,0.78)", fontWeight: "900", fontSize: 16 },
  modeTxtActive: {
    color: "#b388ff",
    textShadowColor: "rgba(169,112,255,0.60)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },

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

  inputBoost: {
  borderColor: "rgba(124,247,216,0.65)",
  shadowColor: "#7cf7d8",
  shadowOpacity: 0.45,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 0 },
  elevation: 8,
},

passInputPulse: {
  borderColor: "rgba(179,136,255,0.78)",
  shadowColor: "#b388ff",
  shadowOpacity: 0.55,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
  backgroundColor: "rgba(169,112,255,0.10)",
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
    letterSpacing: 0.5,
    textShadowColor: "rgba(169,112,255,0.65)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },

  hint: {
    marginTop: 14,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
  },

});