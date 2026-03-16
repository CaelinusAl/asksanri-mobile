import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  buySanriPremium,
  openManageSubscriptions,
  restoreSanriPurchases,
} from "../lib/revenuecat";

type Props = {
  open: boolean;
  lang?: "tr" | "en";
  onClose: () => void;
  onSubscribeSuccess: () => void;
};

export default function VipSheet({
  open,
  lang = "tr",
  onClose,
  onSubscribeSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const tr = lang === "tr";

  const copy = {
    title: tr ? "BİLİNÇ KAPISI" : "CONSCIOUSNESS GATE",
    sub: tr
      ? "Derin katmanlar + tam erişim. Kapı “Derinleş” ile açılır."
      : "Deep layers + full access. The gate opens with “Deepen”.",
    bullets: tr
      ? [
          "Derin şehir okumaları",
          "Sanri kişisel bilinç analizi",
          "Sembol katmanı",
          "Ritüel yönlendirme",
          "Gelecek katmanlar",
        ]
      : [
          "Deep city readings",
          "Personal SANRI analysis",
          "Symbol layer",
          "Ritual guidance",
          "Future layers",
        ],
    price: tr ? "693 TL / ay" : "693 TL / month",
    buy: tr ? "Bilinç Kapısını Aç" : "Open Consciousness Gate",
    restore: tr ? "Satın alımı geri yükle" : "Restore purchase",
    manage: tr ? "Abonelikleri Yönet" : "Manage Subscriptions",
    close: tr ? "Kapat" : "Close",
  };

  const onBuy = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await buySanriPremium();

      if (result.ok) {
        Alert.alert("OK", tr ? "VIP erişim açıldı." : "VIP access unlocked.");
        onSubscribeSuccess();
        return;
      }

      if (
        result.reason === "plan_change_not_allowed" ||
        result.reason === "pending_google_play"
      ) {
        Alert.alert(
          tr ? "Abonelik Durumu" : "Subscription Status",
          result.message,
          [
            {
              text: copy.manage,
              onPress: () => {
                openManageSubscriptions().catch(() => {});
              },
            },
            { text: "OK" },
          ]
        );
        return;
      }

      if (result.reason === "already_active") {
        Alert.alert("OK", result.message);
        onSubscribeSuccess();
        return;
      }

      if (result.reason === "cancelled") {
        return;
      }

      Alert.alert(tr ? "Hata" : "Error", result.message);
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const restored = await restoreSanriPurchases();

      if (restored) {
        Alert.alert("OK", tr ? "Abonelik geri yüklendi." : "Subscription restored.");
        onSubscribeSuccess();
        return;
      }

      Alert.alert(
        tr ? "Bilgi" : "Info",
        tr
          ? "Aktif bir abonelik bulunamadı."
          : "No active subscription was found."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
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

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>{tr ? "Ücret" : "Price"}</Text>
            <Text style={styles.price}>{copy.price}</Text>
            <Text style={styles.priceSub}>39 USD / mo</Text>
          </View>

          <Pressable onPress={onBuy} style={styles.primaryBtn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>{copy.buy}</Text>
            )}
          </Pressable>

          <Pressable onPress={onRestore} style={styles.secondaryBtn} disabled={loading}>
            <Text style={styles.secondaryBtnText}>{copy.restore}</Text>
          </Pressable>

          <Pressable
            onPress={() => openManageSubscriptions().catch(() => {})}
            style={styles.secondaryBtn}
            disabled={loading}
          >
            <Text style={styles.secondaryBtnText}>{copy.manage}</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeBtn} disabled={loading}>
            <Text style={styles.closeText}>{copy.close}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.66)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0b0d16",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  kicker: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 10,
  },
  sub: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: 24,
    fontSize: 17,
  },
  list: {
    marginTop: 18,
    marginBottom: 18,
    gap: 10,
  },
  bullet: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 16,
    lineHeight: 22,
  },
  priceBox: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  priceLabel: {
    color: "rgba(255,255,255,0.58)",
    fontWeight: "700",
    marginBottom: 8,
  },
  price: {
    color: "#7cf7d8",
    fontSize: 22,
    fontWeight: "900",
  },
  priceSub: {
    color: "rgba(255,255,255,0.56)",
    marginTop: 4,
  },
  primaryBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(94,59,255,0.92)",
    marginBottom: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  secondaryBtnText: {
    color: "rgba(255,255,255,0.86)",
    fontWeight: "800",
  },
  closeBtn: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 4,
  },
  closeText: {
    color: "rgba(255,255,255,0.55)",
    fontWeight: "700",
  },
});