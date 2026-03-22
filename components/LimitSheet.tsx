import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { getCurrentMonthlyPackage } from "../lib/revenuecat";

type Props = {
  open: boolean;
  onClose: () => void;
  lang: "tr" | "en";
  role?: string;
  used?: number;
  limit?: number;
};

export default function LimitSheet(props: Props) {
  const lang = props.lang || "tr";
  const tr = lang === "tr";

  const [priceLabel, setPriceLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!props.open) return;
    let alive = true;
    getCurrentMonthlyPackage().then((pkg) => {
      if (!alive) return;
      if (pkg?.product?.priceString) {
        setPriceLabel(
          "Premium \u2022 " +
            pkg.product.priceString +
            (tr ? " / aylik" : " / monthly")
        );
      }
    });
    return () => { alive = false; };
  }, [props.open, tr]);

  const title = tr ? "Bugunku akis tamamlandi." : "Daily flow completed.";
  const sub = tr ? "Bilinc dinlenmek ister." : "Consciousness wants to rest.";

  const noteFree = tr
    ? "Ucretsiz alanda gunluk 20 soru."
    : "Free tier: 20 questions/day.";

  const notePrem = tr
    ? "Premium alanda gunluk 74 soru."
    : "Premium tier: 74 questions/day.";

  const noteElite = tr
    ? "Elite Katman: sinirsiz akis."
    : "Elite: unlimited flow.";

  const hint =
    props.role === "free"
      ? noteFree
      : props.role === "premium"
        ? notePrem
        : noteElite;

  const onPremium = () => {
    props.onClose();
    router.push({
      pathname: "/(tabs)/vip",
      params: { plan: "premium", lang },
    } as any);
  };

  return (
    <Modal
      visible={props.open}
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
    >
      <View style={s.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={props.onClose}
        />

        <BlurView intensity={30} tint="dark" style={s.sheet}>
          <Text style={s.title}>{title}</Text>
          <Text style={s.sub}>{sub}</Text>

          <View style={s.sep} />

          <Text style={s.hint}>{hint}</Text>

          {typeof props.used === "number" &&
          typeof props.limit === "number" ? (
            <Text style={s.count}>
              {tr ? "Bugun: " : "Today: "}
              {String(props.used)} / {String(props.limit)}
            </Text>
          ) : null}

          <View style={{ height: 14 }} />

          <Pressable onPress={onPremium} style={s.primary} hitSlop={10}>
            <Text style={s.primaryTitle}>
              {tr ? "Frekans Yukselt" : "Upgrade Frequency"}
            </Text>
            <Text style={s.primarySub}>
              {priceLabel || (tr ? "Premium" : "Premium")}
            </Text>
          </Pressable>

          <Pressable onPress={props.onClose} style={s.close} hitSlop={10}>
            <Text style={s.closeTxt}>
              {tr ? "Simdilik Kapat" : "Close for now"}
            </Text>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  sheet: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 26,
    padding: 18,
    backgroundColor: "rgba(20,16,34,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: { color: "white", fontWeight: "900", fontSize: 22 },
  sub: {
    color: "rgba(255,255,255,0.70)",
    marginTop: 8,
    lineHeight: 20,
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginTop: 14,
    marginBottom: 12,
  },
  hint: { color: "#7cf7d8", fontWeight: "900" },
  count: { color: "rgba(255,255,255,0.60)", marginTop: 6 },
  primary: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "rgba(94,59,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  primaryTitle: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
  primarySub: { color: "rgba(255,255,255,0.78)", marginTop: 6 },
  close: { marginTop: 14, alignSelf: "center" },
  closeTxt: { color: "rgba(255,255,255,0.55)", fontWeight: "800" },
});
