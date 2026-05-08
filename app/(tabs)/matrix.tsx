// app/(tabs)/matrix.tsx
import React, { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";

import { getCurrentMonthlyPackage } from "../../lib/revenuecat";
import { useEntitlementStore } from "../../lib/entitlementStore";
import { trackEvent } from "../../lib/analytics";
import { useScreenTime } from "../../lib/useScreenTime";
import { getMatrixTrialState } from "../../lib/matrixTrialStore";
import PyramidMenu from "../../components/PyramidMenu";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Lang = "tr" | "en";
type Mode = "name" | "dob";

const T = {
  tr: {
    kicker: "CAELINUS AI · BİLİNÇ AYNASI",
    title: "MATRIX OKUMA",
    sub: "İsim veya doğum tarihi gir. Sistem frekansını, arketipini ve gizli rolünü okur.",
    modeName: "İsim Frekans Okuma",
    modeDob: "Doğum Tarihi Frekans Okuma",
    cycle: "Cycle: ",
    nameLabel: "Ad Soyad",
    namePh: "Ad Soyad",
    dobLabel: "Doğum Tarihi (GG.AA.YYYY)",
    dobPh: "GG.AA.YYYY",
    freeBtn: "Ücretsiz Sezgisel Okuma",
    freeBtnUsed: "Kısa okumayı gördün — Derin Analiz'e geç",
    trialBadgeFree: "1 ücretsiz sezgisel okuma hakkın var",
    trialBadgeUsed: "Ücretsiz okumanı kullandın",
    trialHelper: "Önce kısa, nokta atışı bir yansıma alırsın. Devamını isteyince Derin Analiz açılır.",
    needName: "Lütfen ad soyad gir.",
    needDob: "Lütfen doğum tarihini gir (GG.AA.YYYY).",
    deepTitle: "DERİN MATRIX ANALİZİ",
    deepSub: "Karakter kodun, gizli rolün, ilişki frekansın, para hattın ve haftalık akışın — uzun, kişiye özel okuma.",
    deepBullets: [
      "Tam karakter kodu çözümlemesi",
      "Gizli rol ve gölge frekansı",
      "İlişki / iş / para hatları",
      "Haftalık akış uyarıları",
    ],
    deepBtn: "Derin Analizi Aç",
    deepActive: "Derin Analiz Aktif",
    rolePill: "ROL OKUMA",
    roleTagline: "Akıştaki gizli görevin — karakter kodun.",
  },
  en: {
    kicker: "CAELINUS AI · CONSCIOUSNESS MIRROR",
    title: "MATRIX READING",
    sub: "Enter your name or birth date. It reads your frequency, archetype, and hidden role.",
    modeName: "Name Frequency",
    modeDob: "Birth Date Frequency",
    cycle: "Cycle: ",
    nameLabel: "Full Name",
    namePh: "Full Name",
    dobLabel: "Birth Date (DD.MM.YYYY)",
    dobPh: "DD.MM.YYYY",
    freeBtn: "Free Intuitive Reading",
    freeBtnUsed: "You've seen the short one — go to Deep Analysis",
    trialBadgeFree: "1 free intuitive reading available",
    trialBadgeUsed: "Free reading already used",
    trialHelper: "First a short, on-point reflection. Want more? Deep Analysis opens up.",
    needName: "Please enter your name.",
    needDob: "Please enter birth date (DD.MM.YYYY).",
    deepTitle: "DEEP MATRIX ANALYSIS",
    deepSub: "Your character code, hidden role, relationship frequency, money line, and weekly flow — long, personal.",
    deepBullets: [
      "Full character code breakdown",
      "Hidden role and shadow frequency",
      "Relationship / work / money lines",
      "Weekly flow alerts",
    ],
    deepBtn: "Unlock Deep Analysis",
    deepActive: "Deep Analysis Active",
    rolePill: "ROLE READING",
    roleTagline: "Your hidden duty in the stream — character code.",
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

  // Trial: cihazda ücretsiz okuma hakkı var mı? Ekran her odaklandığında tazele.
  const [trialUsed, setTrialUsed] = useState<boolean>(false);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getMatrixTrialState().then((s) => {
        if (active) setTrialUsed(s.used);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  useEffect(() => {
    trackEvent("page_view", { userId: user?.id, meta: { page: "matrix" } });
    if (__DEV__) {
      console.log("vip:", entitlements.vip_access);
      console.log("role:", entitlements.role_access);
      console.log("code:", entitlements.code_training_access);
    }
  }, []);

  const onBack = () => {
    // Kapılara dön. `router.back()` bazen (tabs)/index veya boş rota üzerine düşüp beyaz ekran verebiliyor.
    router.replace("/(tabs)/gates" as any);
  };

  // Ürün akışı:
  //   - Trial kullanılmamışsa → matrix_mini (kısa Sanrı yansıması + numeroloji)
  //   - Trial kullanılmışsa → doğrudan Derin Analiz paywall'ı (vip.tsx)
  // Her iki durumda da kullanıcıdan ad/dob alınır (paywall'a anlamlı bir önizleme verebilmek için).
  const onPrimaryAction = () => {
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

    if (trialUsed) {
      goDeep(safeName, safeDob);
      return;
    }

    router.push({
      pathname: "/(tabs)/matrix_mini",
      params: {
        lang,
        mode,
        name: safeName,
        dob: safeDob,
        cycle,
      },
    } as any);
  };

  const goDeep = (presetName?: string, presetDob?: string) => {
    if (isPremium) {
      Alert.alert(
        "Sanrı",
        lang === "tr" ? "Derin Analiz zaten aktif." : "Deep Analysis is already active."
      );
      router.push({
        pathname: "/(tabs)/deep_reading",
        params: {
          lang,
          name: presetName ?? name ?? "",
          dob: presetDob ?? dob ?? "",
        },
      } as any);
      return;
    }
    router.push({
      pathname: "/(tabs)/vip",
      params: {
        lang,
        entitlement: "vip_access",
        source: "matrix_deep",
        name: presetName ?? name ?? "",
        dob: presetDob ?? dob ?? "",
      },
    } as any);
  };

  const goRole = () => {
    if (matrixRoleUnlocked) {
      Alert.alert(
        "Sanrı",
        lang === "tr" ? "Rol Okuma zaten aktif." : "Role Reading is already active."
      );
      return;
    }
    router.push({
      pathname: "/(tabs)/vip",
      params: { lang, entitlement: "role_access", source: "matrix_role" },
    } as any);
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

      <PyramidMenu lang={lang} />

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

          <Pressable onPress={onPrimaryAction} style={styles.freeBtn} hitSlop={12}>
            <Text style={styles.freeTxt}>
              {trialUsed ? t.freeBtnUsed : t.freeBtn}
            </Text>
          </Pressable>

          <View
            style={[
              styles.trialBadge,
              trialUsed ? styles.trialBadgeUsed : styles.trialBadgeFree,
            ]}
          >
            <Text style={styles.trialBadgeIcon}>{trialUsed ? "◌" : "◉"}</Text>
            <Text style={styles.trialBadgeText}>
              {trialUsed ? t.trialBadgeUsed : t.trialBadgeFree}
            </Text>
          </View>

          <Text style={styles.trialHelper}>{t.trialHelper}</Text>
        </View>

        {/* DERİN MATRIX ANALİZİ — ürün vitrini */}
        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <Text style={styles.productGlyph}>⬢</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.productKicker}>SANRI · DERİN ÜRÜN</Text>
              <Text style={styles.productTitle}>{t.deepTitle}</Text>
            </View>
          </View>

          <Text style={styles.productSub}>{t.deepSub}</Text>

          <View style={styles.productBullets}>
            {t.deepBullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{priceDisplay}</Text>
            <Pressable
              onPress={() => goDeep()}
              style={styles.productBtn}
              hitSlop={10}
            >
              <Text style={styles.productBtnTxt}>
                {isPremium ? t.deepActive : t.deepBtn}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ROLE — ikincil küçük ürün */}
        <Pressable onPress={goRole} style={styles.roleCard} hitSlop={8}>
          <View style={styles.rolePillBox}>
            <Text style={styles.rolePillTxt}>{t.rolePill}</Text>
          </View>
          <Text style={styles.roleTagline}>{t.roleTagline}</Text>
          <Text style={styles.roleArrow}>{matrixRoleUnlocked ? "✓" : "›"}</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingLeft: 64,
    paddingRight: 14,
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
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.70)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  freeTxt: { color: "white", fontWeight: "900", fontSize: 16, textAlign: "center" },

  trialBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trialBadgeFree: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.28)",
  },
  trialBadgeUsed: {
    backgroundColor: "rgba(255,180,180,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,180,180,0.18)",
  },
  trialBadgeIcon: { color: "#7cf7d8", fontSize: 14, fontWeight: "900" },
  trialBadgeText: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "700", flex: 1 },
  trialHelper: {
    marginTop: 10,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    lineHeight: 18,
  },

  productCard: {
    marginTop: 18,
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(94,59,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.32)",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  productGlyph: { color: "#a78bfa", fontSize: 32 },
  productKicker: {
    color: "rgba(167,139,250,0.85)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  productTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  productSub: {
    color: "rgba(255,255,255,0.78)",
    marginTop: 12,
    lineHeight: 22,
  },
  productBullets: { marginTop: 14, gap: 8 },
  bulletRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  bulletDot: { color: "#a78bfa", fontWeight: "900", fontSize: 16, lineHeight: 20 },
  bulletText: { color: "rgba(255,255,255,0.86)", flex: 1, lineHeight: 20 },

  productFooter: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  productPrice: { color: "#a78bfa", fontWeight: "900", fontSize: 16 },
  productBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(167,139,250,0.18)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.45)",
  },
  productBtnTxt: { color: "#c4b5fd", fontWeight: "900", fontSize: 14 },

  roleCard: {
    marginTop: 14,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rolePillBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(192,132,252,0.18)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.35)",
  },
  rolePillTxt: {
    color: "#c084fc",
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  roleTagline: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    flex: 1,
  },
  roleArrow: {
    color: "#c084fc",
    fontSize: 20,
    fontWeight: "900",
  },
});