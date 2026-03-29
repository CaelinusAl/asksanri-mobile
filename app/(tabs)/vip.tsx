import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import MatrixRain from "../../lib/MatrixRain";
import {
  buySanriPremium,
  getCustomerInfo,
  getRevenueCatInitError,
  openManageSubscriptions,
  restoreSanriPurchases,
  getCurrentMonthlyPackage,
} from "../../lib/revenuecat";
import { setVipJustActivated } from "../../lib/vipPulse";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../lib/analytics";

const BG = require("../../assets/sanri_glass_bg.jpg");
const RABBIT = require("../../assets/rabbit.jpg");

const PRIVACY_URL = "https://asksanri.com/privacy";
const TERMS_URL = "https://asksanri.com/terms";

export default function VipScreen() {
  const params = useLocalSearchParams<{
    target?: string;
    code?: string;
    city?: string;
    lang?: string;
  }>();

  const lang = params.lang === "en" ? "en" : "tr";
  const tr = lang === "tr";
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [priceString, setPriceString] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("vip_click", { userId: user?.id });
  }, []);

  useEffect(() => {
    getCurrentMonthlyPackage().then((pkg) => {
      if (pkg?.product?.priceString) {
        setPriceString(pkg.product.priceString + (tr ? " / ay" : " / month"));
      }
    });
  }, [tr]);

  const priceReady = !!priceString;
  const displayPrice = priceString || (tr ? "Fiyat yükleniyor..." : "Loading price...");

  const copy = {
    title: tr ? "BILINC KAPISI" : "CONSCIOUSNESS GATE",
    sub: tr
      ? "Derin katmanlar + tam erisim. Kapi acilir."
      : "Deep layers + full access. The gate opens.",
    bullets: tr
      ? [
          "Derin sehir okumalari",
          "Sanri kisisel bilinc analizi",
          "Sembol katmani",
          "Rituel yonlendirme",
          "Gelecek katmanlar",
        ]
      : [
          "Deep city readings",
          "Personal Sanri consciousness analysis",
          "Symbol layer",
          "Ritual guidance",
          "Future layers",
        ],
    buy: tr ? "Bilinc Kapisini Ac" : "Open Consciousness Gate",
    restore: tr ? "Satin Alimi Geri Yukle" : "Restore Purchase",
    close: tr ? "Simdi degil" : "Not now",
    verifyFail: tr ? "VIP erisimi dogrulanamadi." : "VIP access could not be verified.",
    vipActive: tr ? "VIP aktif!" : "VIP activated!",
    purchaseError: tr ? "Satin alma hatasi" : "Purchase error",
    noActive: tr ? "Aktif bir abonelik bulunamadi." : "No active subscription found.",
    restored: tr ? "Abonelik geri yuklendi." : "Subscription restored.",
    devInfo:
      getRevenueCatInitError() ||
      (tr
        ? "Satin alma sistemi su anda hazir degil."
        : "Purchase system is not ready right now."),
    manage: tr ? "Abonelikleri Yonet" : "Manage Subscriptions",
    pendingTitle: tr ? "Abonelik Durumu" : "Subscription Status",
    autoRenew: tr
      ? "Abonelik aylik olarak otomatik yenilenir. Istedigin zaman hesap ayarlarindan iptal edebilirsin. Odeme isleminden sonra Apple/Google hesabindan tahsil edilir."
      : "Subscription auto-renews monthly. Cancel anytime from account settings. Payment is charged to your Apple/Google account after purchase.",
    termsLabel: tr ? "Kullanim Sartlari" : "Terms of Use",
    privacyLabel: tr ? "Gizlilik Politikasi" : "Privacy Policy",
  };

  const goAfterSuccess = () => {
    setVipJustActivated(true);

    if (params.target) {
      router.replace({
        pathname: params.target as any,
        params: {
          code: params.code || "",
          city: params.city || "",
          lang: params.lang || "tr",
        },
      } as any);
      return;
    }

    router.back();
  };

  const onPurchase = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await buySanriPremium();

      if (!result.ok) {
        if (
          result.reason === "plan_change_not_allowed" ||
          result.reason === "pending_google_play"
        ) {
          Alert.alert(copy.pendingTitle, result.message, [
            {
              text: copy.manage,
              onPress: () => {
                openManageSubscriptions().catch(() => {});
              },
            },
            { text: "OK" },
          ]);
          return;
        }

        if (result.reason === "already_active") {
          Alert.alert("OK", result.message);
          goAfterSuccess();
          return;
        }

        if (result.reason === "cancelled") {
          return;
        }

        Alert.alert("Alert", result.message || copy.purchaseError);
        return;
      }

      const info = await getCustomerInfo();

      if (!info) {
        Alert.alert("Alert", copy.verifyFail);
        return;
      }

      trackEvent("vip_unlock", { userId: user?.id, meta: { method: "purchase" } });
      Alert.alert("OK", copy.vipActive);
      goAfterSuccess();
    } catch (e: any) {
      if (__DEV__) console.log("VIP purchase error:", e);

      if (e?.userCancelled) return;

      const msg =
        typeof e?.message === "string" && e.message.trim()
          ? e.message
          : copy.devInfo;

      Alert.alert("Alert", msg);
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const restored = await restoreSanriPurchases();

      if (!restored) {
        Alert.alert("Info", copy.noActive);
        return;
      }

      trackEvent("vip_unlock", { userId: user?.id, meta: { method: "restore" } });
      Alert.alert("OK", copy.restored);
      goAfterSuccess();
    } catch (e: any) {
      if (__DEV__) console.log("VIP restore error:", e);
      Alert.alert("Alert", e?.message || copy.devInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.rabbitWrap}>
          <View style={styles.rabbitFrame}>
            <ImageBackground
              source={RABBIT}
              resizeMode="contain"
              style={styles.rabbitImg}
            />
            <View style={styles.rabbitTint} />
          </View>

          <Text style={styles.rabbitTag}>SANRI ELITE</Text>
          <Text style={styles.rabbitSub}>WHITE RABBIT PROTOCOL</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.kicker}>SYSTEM TERMINAL</Text>

          <Text style={styles.title}>{copy.title}</Text>

          <Text style={styles.sub}>{copy.sub}</Text>

          <View style={styles.list}>
            {copy.bullets.map((item) => (
              <Text key={item} style={styles.bullet}>
                {"\u2022"} {item}
              </Text>
            ))}
          </View>

          <Pressable
            style={[styles.cta, (loading || !priceReady) && styles.ctaDisabled]}
            onPress={onPurchase}
            disabled={loading || !priceReady}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.ctaText}>{copy.buy}</Text>
            )}
          </Pressable>

          <Text style={styles.alt}>{displayPrice}</Text>

          <Pressable
            style={styles.secondaryBtn}
            onPress={onRestore}
            disabled={loading}
          >
            <Text style={styles.secondaryTxt}>{copy.restore}</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => openManageSubscriptions().catch(() => {})}
            disabled={loading}
          >
            <Text style={styles.secondaryTxt}>{copy.manage}</Text>
          </Pressable>

          <Text style={styles.legalNote}>{copy.autoRenew}</Text>

          <View style={styles.legalRow}>
            <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
              <Text style={styles.legalLink}>{copy.termsLabel}</Text>
            </Pressable>
            <Text style={styles.legalDot}>{" \u00B7 "}</Text>
            <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
              <Text style={styles.legalLink}>{copy.privacyLabel}</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.backBtn}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.backTxt}>{copy.close}</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>CAELINUS SYSTEM</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  container: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 60,
    gap: 20,
  },

  rabbitWrap: {
    alignItems: "center",
  },

  rabbitFrame: {
    width: 170,
    height: 170,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  rabbitImg: {
    width: 150,
    height: 150,
  },

  rabbitTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(94,59,255,0.10)",
  },

  rabbitTag: {
    marginTop: 12,
    color: "rgba(124,247,216,0.80)",
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: "900",
  },

  rabbitSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.6,
    fontSize: 11,
    fontWeight: "700",
  },

  card: {
    borderRadius: 26,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
  },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },

  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  sub: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 10,
    lineHeight: 20,
    textAlign: "center",
  },

  list: {
    marginTop: 16,
    gap: 8,
  },

  bullet: {
    color: "rgba(255,255,255,0.85)",
  },

  cta: {
    marginTop: 18,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.90)",
  },

  ctaDisabled: {
    opacity: 0.7,
  },

  ctaText: {
    color: "white",
    fontWeight: "900",
    letterSpacing: 1,
  },

  alt: {
    marginTop: 12,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    textAlign: "center",
  },

  secondaryBtn: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  secondaryTxt: {
    color: "rgba(255,255,255,0.88)",
    fontWeight: "700",
  },

  legalNote: {
    marginTop: 16,
    color: "rgba(255,255,255,0.38)",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },

  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  legalLink: {
    color: "rgba(124,247,216,0.65)",
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  legalDot: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 12,
  },

  backBtn: {
    marginTop: 14,
    alignItems: "center",
  },

  backTxt: {
    color: "#7cf7d8",
    fontWeight: "900",
  },

  footer: {
    marginTop: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.22)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "800",
    paddingBottom: Platform.OS === "ios" ? 6 : 2,
  },
});
