import React, { useState } from "react";
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
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import MatrixRain from "../../lib/MatrixRain";
import {
  buySanriPremium,
  getCustomerInfo,
  getRevenueCatInitError,
  openManageSubscriptions,
} from "../../lib/revenuecat";
import { setVipJustActivated } from "../../lib/vipPulse";

const BG = require("../../assets/sanri_glass_bg.jpg");
const RABBIT = require("../../assets/rabbit.jpg");

export default function VipScreen() {
  const params = useLocalSearchParams<{
    target?: string;
    code?: string;
    city?: string;
    lang?: string;
  }>();

  const lang = params.lang === "en" ? "en" : "tr";
  const tr = lang === "tr";

  const [loading, setLoading] = useState(false);

  const copy = {
    title: tr ? "BİLİNÇ KAPISI" : "CONSCIOUSNESS GATE",
    sub: tr
      ? "Derin katmanlar + tam erişim. Kapı “Derinleş” ile açılır."
      : "Deep layers + full access. The gate opens with “Deepen”.",
    bullets: tr
      ? [
          "Derin şehir okumaları",
          "Sanrı kişisel bilinç analizi",
          "Sembol katmanı",
          "Ritüel yönlendirme",
          "Gelecek katmanlar",
        ]
      : [
          "Deep city readings",
          "Personal Sanri consciousness analysis",
          "Symbol layer",
          "Ritual guidance",
          "Future layers",
        ],
    buy: tr ? "Bilinç Kapısını Aç" : "Open Consciousness Gate",
    close: tr ? "Şimdi değil" : "Not now",
    verifyFail: tr ? "VIP erişimi doğrulanamadı." : "VIP access could not be verified.",
    vipActive: tr ? "VIP aktif!" : "VIP activated!",
    purchaseError: tr ? "Satın alma hatası" : "Purchase error",
    devInfo:
      getRevenueCatInitError() ||
      (tr
        ? "Satın alma sistemi şu anda hazır değil."
        : "Purchase system is not ready right now."),
    manage: tr ? "Abonelikleri Yönet" : "Manage Subscriptions",
    pendingTitle: tr ? "Abonelik Durumu" : "Subscription Status",
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
      const hasVip = Boolean(info?.entitlements?.active?.["vip_access"]);

      if (!hasVip) {
        Alert.alert("Alert", copy.verifyFail);
        return;
      }

      Alert.alert("Alert", copy.vipActive);
      goAfterSuccess();
    } catch (e: any) {
      console.log("VIP purchase error:", e);

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
                • {item}
              </Text>
            ))}
          </View>

          <Pressable
            style={[styles.cta, loading && styles.ctaDisabled]}
            onPress={onPurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.ctaText}>{copy.buy}</Text>
            )}
          </Pressable>

          <Text style={styles.alt}>693 TL / ay</Text>

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