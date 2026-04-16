// app/(tabs)/matrix.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { getCurrentMonthlyPackage } from "../../lib/revenuecat";
import { useEntitlementStore } from "../../lib/entitlementStore";
import { trackEvent } from "../../lib/analytics";
import { useScreenTime } from "../../lib/useScreenTime";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Lang = "tr" | "en";
type Mode = "name" | "dob";

const T = {
  tr: {
    kicker: "CAELINUS AI · BİLİNÇ AYNASI",
    title: "MATRIX OKUMA",
    sub: "İsim veya Doğum Tarihi gir. Sistem frekansını, arketipini ve rolünü okur.",
    modeName: "İsim Frekans Okuma",
    modeDob: "Doğum Tarihi Frekans Okuma",
    cycle: "Cycle: ",
    nameLabel: "Ad Soyad",
    namePh: "Ad Soyad",
    dobLabel: "Doğum Tarihi (GG.AA.YYYY)",
    dobPh: "GG.AA.YYYY",
    freeBtn: "Ücretsiz Hızlı Okuma",
    needName: "Lütfen ad soyad gir.",
    needDob: "Lütfen doğum tarihini gir (GG.AA.YYYY).",
    roleTitle: "Matrix Rol Okuma",
    roleSub: "Sistem rolü · akıştaki görevin · karakter kodu",
    roleBtn: "Rolü Aç",
    premiumTitle: "Premium Aylık Okuma",
    premiumSub: "Aşk · ilişki · iş · para · kader rotası · haftalık akış",
    premiumBtn: "Premium",
  },
  en: {
    kicker: "CAELINUS AI · CONSCIOUSNESS MIRROR",
    title: "MATRIX READING",
    sub: "Enter your Name or Birth Date. It reads frequency, archetype, and role.",
    modeName: "Name Frequency",
    modeDob: "Birth Date Frequency",
    cycle: "Cycle: ",
    nameLabel: "Full Name",
    namePh: "Full Name",
    dobLabel: "Birth Date (DD.MM.YYYY)",
    dobPh: "DD.MM.YYYY",
    freeBtn: "Free Quick Reading",
    needName: "Please enter your name.",
    needDob: "Please enter birth date (DD.MM.YYYY).",
    roleTitle: "Matrix Role Reading",
    roleSub: "System role · duty in the stream · character code",
    roleBtn: "Unlock Role",
    premiumTitle: "Premium Monthly",
    premiumSub: "Love · relationships · work · money · destiny path · weekly flow",
    premiumBtn: "Premium",
  },
} as const;

export default function MatrixScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const t = T[lang];

  const [mode, setMode] = useState<Mode>("name");
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");

  const now = new Date();
  const cycle = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;

  const { user } = useAuth();
  useScreenTime("matrix", user?.id);

  const entitlements = useEntitlementStore((s) => s.status);
  const isPremium = entitlements.vip_access;
  const matrixRoleUnlocked = entitlements.role_access;

  useEffect(() => {
    trackEvent("page_view", { userId: user?.id, meta: { page: "matrix" } });
    if (__DEV__) {
      console.log("vip:", entitlements.vip_access);
      console.log("role:", entitlements.role_access);
      console.log("code:", entitlements.code_training_access);
    }
  }, []);

  const onBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/gates");
  };

  // ✅ sadece mini ekrana gider (sanri_flow yok)
  const onFree = () => {
    const safeName = (name || "").trim();
    const safeDob = (dob || "").trim();

    if (mode === "name" && !safeName) {
      Alert.alert("Sanrı", t.needName);
      return;
    }
    if (mode === "dob" && !safeDob) {
      Alert.alert("Sanrı", t.needDob);
      return;
    }

    router.push({
      pathname: "/(tabs)/matrix_mini",
      params: {
        lang,
        mode, // "name" | "dob"
        name: safeName,
        dob: safeDob,
        cycle,
      },
    } as any);
  };

  const goVip = (source: "role" | "premium_monthly") => {
    if (source === "role") {
      if (matrixRoleUnlocked) {
        Alert.alert("Sanrı", lang === "tr" ? "Rol Okuma zaten aktif." : "Role Reading is already active.");
        return;
      }
      router.push({ pathname: "/(tabs)/vip", params: { lang, entitlement: "role_access" } } as any);
    } else {
      if (isPremium) {
        Alert.alert("Sanrı", lang === "tr" ? "VIP zaten aktif." : "VIP is already active.");
        return;
      }
      router.push({ pathname: "/(tabs)/vip", params: { lang, entitlement: "vip_access" } } as any);
    }
  };

  const [dynamicPrice, setDynamicPrice] = useState<string | null>(null);

  useEffect(() => {
    getCurrentMonthlyPackage().then((pkg) => {
      if (pkg?.product?.priceString) {
        setDynamicPrice(pkg.product.priceString + (lang === "tr" ? " / ay" : " / month"));
      }
    });
  }, [lang]);

  const priceDisplay = dynamicPrice || "Premium";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent={false} />

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

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{t.kicker}</Text>
        <Text style={styles.h1}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

        {/* MODE */}
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setMode("name")}
            style={[styles.modeBtn, mode === "name" && styles.modeBtnActive]}
            hitSlop={10}
          >
            <Text style={[styles.modeText, mode === "name" && styles.modeTextActive]}>
              {t.modeName}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setMode("dob")}
            style={[styles.modeBtn, mode === "dob" && styles.modeBtnActive]}
            hitSlop={10}
          >
            <Text style={[styles.modeText, mode === "dob" && styles.modeTextActive]}>
              {t.modeDob}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.cycle}>
          {t.cycle}
          {cycle}
        </Text>

        {/* INPUT CARD */}
        <View style={styles.formCard}>
          {mode === "name" ? (
            <>
              <Text style={styles.label}>{t.nameLabel}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                maxLength={100}
                placeholder={t.namePh}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </>
          ) : null}

          {mode === "dob" ? (
            <>
              <Text style={styles.label}>{t.dobLabel}</Text>
              <TextInput
                value={dob}
                onChangeText={setDob}
                maxLength={20}
                placeholder={t.dobPh}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.input}
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                autoCorrect={false}
              />
            </>
          ) : null}

          <Pressable onPress={onFree} style={styles.freeBtn} hitSlop={12}>
            <Text style={styles.freeTxt}>{t.freeBtn}</Text>
          </Pressable>
        </View>

        {/* ROLE CARD */}
        <View style={styles.payCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.payTitle}>{t.roleTitle}</Text>
            <Text style={styles.paySub}>{t.roleSub}</Text>
          </View>

          <View style={styles.payRight}>
            <Text style={styles.priceTag}>{priceDisplay}</Text>
            <Pressable
  onPress={() => goVip("role")}
  style={styles.ghostBtn}
  hitSlop={10}
>
  <Text style={styles.ghostBtnTxt}>
    {matrixRoleUnlocked ? (lang === "tr" ? "Rol Açıldı" : "Unlocked") : t.roleBtn}
  </Text>
</Pressable>
          </View>
        </View>

        {/* PREMIUM MONTHLY */}
        <View style={styles.payCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.payTitle}>{t.premiumTitle}</Text>
            <Text style={styles.paySub}>{t.premiumSub}</Text>
          </View>

          <View style={styles.payRight}>
            <Text style={styles.priceTag}>{priceDisplay}</Text>
            <Pressable
  onPress={() => goVip("premium_monthly")}
  style={styles.ghostBtn}
  hitSlop={10}
>
  <Text style={styles.ghostBtnTxt}>
    {isPremium ? (lang === "tr" ? "VIP Aktif" : "VIP Active") : t.premiumBtn}
  </Text>
</Pressable>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
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
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.28)",
  },
  langTxt: { color: "rgba(255,255,255,0.70)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  container: { paddingHorizontal: 18, paddingTop: 8 },

  kicker: { color: "rgba(255,255,255,0.55)", letterSpacing: 2, fontWeight: "800" },
  h1: { color: "white", fontSize: 44, fontWeight: "900", marginTop: 10 },
  sub: { color: "rgba(255,255,255,0.72)", marginTop: 10, fontSize: 16, lineHeight: 22 },

  modeRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  modeBtnActive: {
    backgroundColor: "rgba(94,59,255,0.55)",
    borderColor: "rgba(94,59,255,0.35)",
  },
  modeText: { color: "rgba(255,255,255,0.78)", fontWeight: "900", textAlign: "center" },
  modeTextActive: { color: "white" },

  cycle: { marginTop: 12, color: "#7cf7d8", fontWeight: "900", fontSize: 16 },

  formCard: {
    marginTop: 14,
    borderRadius: 26,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  label: { color: "rgba(255,255,255,0.70)", fontWeight: "800", marginBottom: 8, marginTop: 10 },
  input: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "white",
    fontSize: 16,
  },
  freeBtn: {
    marginTop: 14,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.70)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  freeTxt: { color: "white", fontWeight: "900", fontSize: 16 },

  payCard: {
    marginTop: 14,
    borderRadius: 26,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  payTitle: { color: "white", fontWeight: "900", fontSize: 20 },
  paySub: { color: "rgba(255,255,255,0.70)", marginTop: 6, lineHeight: 20 },

  payRight: { alignItems: "flex-end", gap: 10 },
  priceTag: { color: "#7cf7d8", fontWeight: "900", fontSize: 16 },
  ghostBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
  },
  ghostBtnTxt: { color: "#7cf7d8", fontWeight: "900" },
});