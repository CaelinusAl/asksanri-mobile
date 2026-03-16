import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import MatrixRain from "../lib/MatrixRain";
import { setVipJustActivated } from "@/lib/vipPulse";

type Lang = "tr" | "en";

type Props = {
  open?: boolean;
  visible?: boolean;
  lang?: Lang;
  priceTry?: string;
  priceUsd?: string;
  onClose: () => void;
  onSubscribe?: () => Promise<void> | void;
  onSubscribeSuccess?: () => Promise<void> | void;
  onGoVip?: () => void;
};

const BG = require("../assets/sanri_glass_bg.jpg");

const COPY = {
  tr: {
    kicker: "SYSTEM TERMINAL",
    title: "BİLİNÇ KAPISI",
    sub: "Derin katmanlar + tam erişim. Kapı “Derinleş” ile açılır.",
    priceTitle: "Ücret",
    cta: "Bilinç Kapısını Aç",
    loading: "Bağlanıyor...",
    later: "Şimdi değil",
    hint: "VIP ile: Derinleş aktif olur, kapılar daha fazla konuşur.",
    purchaseError: "Satın alma hatası",
    missingHandler: "Satın alma sistemi henüz bağlanmamış.",
  },
  en: {
    kicker: "SYSTEM TERMINAL",
    title: "CONSCIOUSNESS GATE",
    sub: "Deep layers + full access. The gate opens via “Deepen”.",
    priceTitle: "Price",
    cta: "Open the Gate",
    loading: "Connecting...",
    later: "Not now",
    hint: "With VIP: Deepen unlocks, gates speak deeper.",
    purchaseError: "Purchase error",
    missingHandler: "Purchase flow is not connected yet.",
  },
} as const;

export default function VipSheet(props: Props) {
  const isOpen = Boolean(props.open ?? props.visible);
  const lang: Lang = props.lang || "tr";
  const t = COPY[lang];

  const priceTry = props.priceTry || "693 TL / ay";
  const priceUsd = props.priceUsd || "39 USD / mo";

  const [busy, setBusy] = useState(false);

  const onClose = () => {
    if (busy) return;
    props.onClose();
  };

  const handleSubscribe = async () => {
    if (busy) return;
    setBusy(true);

    try {
      if (!props.onSubscribe) {
        Alert.alert("Alert", t.missingHandler);
        return;
      }

      await Promise.resolve(props.onSubscribe());

      setVipJustActivated(true);

      if (props.onSubscribeSuccess) {
        await Promise.resolve(props.onSubscribeSuccess());
      } else {
        props.onClose();
      }
    } catch (e: any) {
      console.log("VipSheet purchase error:", e);

      let message = t.purchaseError;

      if (typeof e?.message === "string" && e.message.trim()) {
        message = e.message;
      }

      Alert.alert("Alert", message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <View pointerEvents="none" style={styles.overlay} />
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <MatrixRain opacity={0.14} />
        </View>

        <BlurView intensity={30} tint="dark" style={styles.sheet}>
          <Text style={styles.kicker}>{t.kicker}</Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.sub}>{t.sub}</Text>

          <View style={styles.priceCard}>
            <Text style={styles.priceTitle}>{t.priceTitle}</Text>
            <Text style={styles.priceMain}>{priceTry}</Text>
            <Text style={styles.priceAlt}>{priceUsd}</Text>
          </View>

          <Pressable
            onPress={handleSubscribe}
            style={[styles.ctaBtn, busy && { opacity: 0.6 }]}
            disabled={busy}
          >
            <LinearGradient
              colors={["rgba(124,247,216,0.18)", "rgba(94,59,255,0.22)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGlass}
            >
              <Text style={styles.ctaTxt}>{busy ? t.loading : t.cta}</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onClose} style={styles.laterBtn} hitSlop={10}>
            <Text style={styles.laterTxt}>{t.later}</Text>
          </Pressable>

          <Text style={styles.hint}>{t.hint}</Text>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    padding: 18,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(10,10,18,0.55)",
  },
  kicker: {
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
    fontWeight: "900",
    fontSize: 12,
  },
  title: {
    color: "white",
    fontWeight: "900",
    fontSize: 28,
    marginTop: 6,
  },
  sub: {
    color: "rgba(255,255,255,0.75)",
    marginTop: 8,
    lineHeight: 20,
  },
  priceCard: {
    marginTop: 14,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  priceTitle: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "800",
  },
  priceMain: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 22,
    marginTop: 6,
  },
  priceAlt: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 4,
  },
  ctaBtn: {
    marginTop: 14,
    borderRadius: 20,
    overflow: "hidden",
  },
  ctaGlass: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(140,100,255,0.35)",
  },
  ctaTxt: {
    color: "white",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1,
  },
  laterBtn: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  laterTxt: {
    color: "rgba(255,255,255,0.65)",
    fontWeight: "800",
  },
  hint: {
    marginTop: 6,
    color: "rgba(180,255,230,0.55)",
    fontStyle: "italic",
    textAlign: "center",
  },
});