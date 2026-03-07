// app/(tabs)/vip.tsx

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
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import Purchases from "react-native-purchases";

import MatrixRain from "../../lib/MatrixRain";

const BG = require("../../assets/sanri_glass_bg.jpg");
const RABBIT = require("../../assets/rabbit.jpg");

export default function VipScreen() {
  const params = useLocalSearchParams<{
    target?: string;
    code?: string;
    city?: string;
    lang?: string;
  }>();

  const [loading, setLoading] = useState(false);

  const onPurchase = async () => {
    try {
      setLoading(true);

      const offerings = await Purchases.getOfferings();

      if (!offerings.current) {
        alert("Offer bulunamadı");
        return;
      }

      const pkg = offerings.current.availablePackages[0];

      const res = await Purchases.purchasePackage(pkg);

      if (res.customerInfo.entitlements.active["vip"]) {
        alert("VIP aktif!");

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
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        alert("Satın alma hatası");
      }
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
        {/* Rabbit visual */}
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

        {/* Main card */}
        <View style={styles.card}>
          <Text style={styles.kicker}>SYSTEM TERMINAL</Text>

          <Text style={styles.title}>BİLİNÇ KAPISI</Text>

          <Text style={styles.sub}>
            Derin katmanlar + tam erişim.{"\n"}
            Kapı “Derinleş” ile açılır.
          </Text>

          <View style={styles.list}>
            <Text style={styles.bullet}>• Derin şehir okumaları</Text>
            <Text style={styles.bullet}>• Sanrı kişisel bilinç analizi</Text>
            <Text style={styles.bullet}>• Sembol katmanı</Text>
            <Text style={styles.bullet}>• Ritüel yönlendirme</Text>
            <Text style={styles.bullet}>• Gelecek katmanlar</Text>
          </View>

          <Pressable style={styles.cta} onPress={onPurchase}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.ctaText}>Bilinç Kapısını Aç</Text>
            )}
          </Pressable>

          <Text style={styles.alt}>693 TL / ay</Text>

          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backTxt}>Şimdi değil</Text>
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