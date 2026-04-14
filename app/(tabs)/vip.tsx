import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  purchaseEntitlement,
  getCustomerInfo,
  getRevenueCatInitError,
  openManageSubscriptions,
  restoreSanriPurchases,
  getPackageForEntitlement,
} from "../../lib/revenuecat";
import {
  ENTITLEMENT_META,
  getActiveEntitlements,
  type EntitlementId,
  type EntitlementStatus,
} from "../../lib/premium";
import { setVipJustActivated } from "../../lib/vipPulse";
import { useAuth } from "../../context/AuthContext";
import { trackEvent } from "../../lib/analytics";

const PRIVACY_URL = "https://asksanri.com/privacy";
const TERMS_URL = "https://asksanri.com/terms";

type ProductCard = {
  id: EntitlementId;
  glyph: string;
  color: string;
  titleTr: string;
  titleEn: string;
  subTr: string;
  subEn: string;
  bulletsTr: string[];
  bulletsEn: string[];
  ctaTr: string;
  ctaEn: string;
};

const PRODUCTS: ProductCard[] = [
  {
    id: "vip_access",
    glyph: "☽",
    color: "#7cf7d8",
    titleTr: "VIP ERİŞİM",
    titleEn: "VIP ACCESS",
    subTr: "Derin katmanlar + tam erişim. Kapı açılır.",
    subEn: "Deep layers + full access. The gate opens.",
    bulletsTr: [
      "Anlaşılma Alanı",
      "Frekans & Yankı Alanı",
      "Derin şehir okumaları",
      "Sanrı kişisel bilinç analizi",
      "Sembol katmanı",
      "Ritüel yönlendirme",
    ],
    bulletsEn: [
      "Understanding Area",
      "Frequency & Echo Area",
      "Deep city readings",
      "Personal Sanri consciousness analysis",
      "Symbol layer",
      "Ritual guidance",
    ],
    ctaTr: "VIP Kapısını Aç",
    ctaEn: "Open VIP Gate",
  },
  {
    id: "role_access",
    glyph: "◈",
    color: "#c084fc",
    titleTr: "ROL OKUMA",
    titleEn: "ROLE READING",
    subTr: "İsim + doğum tarihi → sistemdeki rolünü hatırla.",
    subEn: "Name + birth date → remember your role in the system.",
    bulletsTr: [
      "Matrix Rol Okuma alanı",
      "Kişiye özel rol sonucu",
      "Derin ilişki / para / içsel okuma",
      "Numeroloji / astroloji katmanları",
      "Haftalık-günlük özel okuma (yakında)",
    ],
    bulletsEn: [
      "Matrix Role Reading area",
      "Personalized role result",
      "Deep relationship / finance / inner reading",
      "Numerology / astrology layers",
      "Weekly-daily special reading (soon)",
    ],
    ctaTr: "Rol Okuma Aç",
    ctaEn: "Open Role Reading",
  },
  {
    id: "code_training_access",
    glyph: "⌬",
    color: "#eab308",
    titleTr: "KOD EĞİTİMİ",
    titleEn: "CODE TRAINING",
    subTr: "Gerçekliğin kodunu oku. Eğitim modülleri ile öğren.",
    subEn: "Read the code of reality. Learn with training modules.",
    bulletsTr: [
      "Kod Eğitimi alanı",
      "3 eğitim modülü",
      "Premium dersler",
      "SANRI ile kişisel kod okuma",
      "İlerleme takibi",
    ],
    bulletsEn: [
      "Code Training area",
      "3 training modules",
      "Premium lessons",
      "Personal code reading with SANRI",
      "Progress tracking",
    ],
    ctaTr: "Kod Eğitimi Aç",
    ctaEn: "Open Code Training",
  },
];

export default function VipScreen() {
  const params = useLocalSearchParams<{
    target?: string;
    entitlement?: string;
    code?: string;
    city?: string;
    lang?: string;
  }>();

  const lang = params.lang === "en" ? "en" : "tr";
  const tr = lang === "tr";
  const { user } = useAuth();

  const requestedEntitlement = (params.entitlement || "") as EntitlementId;
  const hasSpecific = PRODUCTS.some((p) => p.id === requestedEntitlement);

  const [loading, setLoading] = useState<EntitlementId | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [owned, setOwned] = useState<EntitlementStatus>({
    vip_access: false,
    role_access: false,
    code_training_access: false,
  });

  useEffect(() => {
    trackEvent("vip_click", { userId: user?.id, meta: { entitlement: requestedEntitlement } });
  }, []);

  useEffect(() => {
    getActiveEntitlements().then(setOwned).catch(() => {});

    for (const p of PRODUCTS) {
      getPackageForEntitlement(p.id).then((pkg) => {
        if (pkg?.product?.priceString) {
          setPrices((prev) => ({
            ...prev,
            [p.id]: pkg.product.priceString + (tr ? " / ay" : " / month"),
          }));
        }
      });
    }
  }, [tr]);

  const goAfterSuccess = () => {
    setVipJustActivated(true);
    if (params.target) {
      router.replace({
        pathname: params.target as any,
        params: { code: params.code || "", city: params.city || "", lang: params.lang || "tr" },
      } as any);
      return;
    }
    router.back();
  };

  const onPurchase = async (entId: EntitlementId) => {
    if (loading) return;
    try {
      setLoading(entId);
      const result = await purchaseEntitlement(entId);

      if (!result.ok) {
        if (result.reason === "plan_change_not_allowed" || result.reason === "pending_google_play") {
          Alert.alert(tr ? "Abonelik Durumu" : "Subscription Status", result.message, [
            { text: tr ? "Abonelikleri Yönet" : "Manage", onPress: () => openManageSubscriptions().catch(() => {}) },
            { text: "OK" },
          ]);
          return;
        }
        if (result.reason === "already_active") {
          Alert.alert("OK", result.message);
          goAfterSuccess();
          return;
        }
        if (result.reason === "cancelled") return;
        Alert.alert("Alert", result.message);
        return;
      }

      const info = await getCustomerInfo();
      if (!info) {
        Alert.alert("Alert", tr ? "Erişim doğrulanamadı." : "Access could not be verified.");
        return;
      }

      const meta = ENTITLEMENT_META[entId];
      trackEvent("entitlement_unlock", { userId: user?.id, meta: { entitlement: entId, method: "purchase" } });
      Alert.alert("OK", `${meta.label} ${tr ? "aktif!" : "activated!"}`);
      setOwned((prev) => ({ ...prev, [entId]: true }));
      goAfterSuccess();
    } catch (e: any) {
      if (e?.userCancelled) return;
      const devInfo = getRevenueCatInitError() || (tr ? "Satın alma sistemi hazır değil." : "Purchase system not ready.");
      Alert.alert("Alert", e?.message?.trim() ? e.message : devInfo);
    } finally {
      setLoading(null);
    }
  };

  const onRestore = async () => {
    if (loading) return;
    setLoading("vip_access");
    try {
      const restored = await restoreSanriPurchases();
      if (!restored) {
        Alert.alert("Info", tr ? "Aktif bir abonelik bulunamadı." : "No active subscription found.");
        return;
      }
      trackEvent("entitlement_restore", { userId: user?.id });
      Alert.alert("OK", tr ? "Abonelikler geri yüklendi." : "Subscriptions restored.");
      const fresh = await getActiveEntitlements();
      setOwned(fresh);
      goAfterSuccess();
    } catch (e: any) {
      const devInfo = getRevenueCatInitError() || "";
      Alert.alert("Alert", e?.message || devInfo);
    } finally {
      setLoading(null);
    }
  };

  const visibleProducts = hasSpecific
    ? PRODUCTS.filter((p) => p.id === requestedEntitlement)
    : PRODUCTS;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={st.container}>
        <Text style={st.kicker}>SANRI STORE</Text>
        <Text style={st.pageTitle}>{tr ? "Kapıları Aç" : "Open the Gates"}</Text>
        <Text style={st.pageSub}>
          {tr
            ? "Her alan ayrı bir bilinç katmanı. İstediğin kapıyı seç."
            : "Each area is a separate consciousness layer. Choose your gate."}
        </Text>

        {visibleProducts.map((product) => {
          const isOwned = owned[product.id];
          const price = prices[product.id];
          const isLoading = loading === product.id;

          return (
            <View
              key={product.id}
              style={[st.card, { borderColor: `${product.color}28` }]}
            >
              <Text style={[st.cardGlyph, { color: product.color }]}>{product.glyph}</Text>
              <Text style={[st.cardTitle, { color: product.color }]}>
                {tr ? product.titleTr : product.titleEn}
              </Text>
              <Text style={st.cardSub}>{tr ? product.subTr : product.subEn}</Text>

              <View style={st.bulletList}>
                {(tr ? product.bulletsTr : product.bulletsEn).map((b) => (
                  <Text key={b} style={st.bullet}>{"\u2022"} {b}</Text>
                ))}
              </View>

              {isOwned ? (
                <View style={[st.ownedBadge, { backgroundColor: `${product.color}18`, borderColor: `${product.color}30` }]}>
                  <Text style={[st.ownedText, { color: product.color }]}>
                    {tr ? "Aktif ✓" : "Active ✓"}
                  </Text>
                </View>
              ) : (
                <>
                  <Pressable
                    style={[st.cta, { backgroundColor: product.color }, (isLoading || !price) && st.ctaDisabled]}
                    onPress={() => onPurchase(product.id)}
                    disabled={!!loading || !price}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#0a0b10" />
                    ) : (
                      <Text style={st.ctaText}>{tr ? product.ctaTr : product.ctaEn}</Text>
                    )}
                  </Pressable>
                  <Text style={st.priceText}>
                    {price || (tr ? "Fiyat yükleniyor..." : "Loading price...")}
                  </Text>
                </>
              )}
            </View>
          );
        })}

        {/* Restore + Manage */}
        <Pressable style={st.secondaryBtn} onPress={onRestore} disabled={!!loading}>
          <Text style={st.secondaryTxt}>{tr ? "Satın Alımı Geri Yükle" : "Restore Purchase"}</Text>
        </Pressable>

        <Pressable
          style={st.secondaryBtn}
          onPress={() => openManageSubscriptions().catch(() => {})}
          disabled={!!loading}
        >
          <Text style={st.secondaryTxt}>{tr ? "Abonelikleri Yönet" : "Manage Subscriptions"}</Text>
        </Pressable>

        <Text style={st.legalNote}>
          {tr
            ? "Abonelikler aylık olarak otomatik yenilenir. İstediğin zaman hesap ayarlarından iptal edebilirsin."
            : "Subscriptions auto-renew monthly. Cancel anytime from account settings."}
        </Text>

        <View style={st.legalRow}>
          <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
            <Text style={st.legalLink}>{tr ? "Kullanım Şartları" : "Terms of Use"}</Text>
          </Pressable>
          <Text style={st.legalDot}> · </Text>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={st.legalLink}>{tr ? "Gizlilik Politikası" : "Privacy Policy"}</Text>
          </Pressable>
        </View>

        <Pressable style={st.backBtn} onPress={() => router.back()} disabled={!!loading}>
          <Text style={st.backTxt}>{tr ? "Şimdi değil" : "Not now"}</Text>
        </Pressable>

        <Text style={st.footer}>CAELINUS SYSTEM</Text>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },
  container: { padding: 20, paddingTop: 70, paddingBottom: 60, gap: 16 },
  kicker: { color: "rgba(255,255,255,0.4)", letterSpacing: 3, fontSize: 12, fontWeight: "900", textAlign: "center" },
  pageTitle: { color: "#fff", fontSize: 30, fontWeight: "900", textAlign: "center" },
  pageSub: { color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 8 },

  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
  },
  cardGlyph: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 22, fontWeight: "900", marginBottom: 6 },
  cardSub: { color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 20, marginBottom: 14 },
  bulletList: { gap: 6, marginBottom: 18 },
  bullet: { color: "rgba(255,255,255,0.8)", fontSize: 14 },

  cta: { borderRadius: 18, paddingVertical: 14, alignItems: "center" },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: "#0a0b10", fontWeight: "900", letterSpacing: 1, fontSize: 15 },
  priceText: { marginTop: 8, color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center" },

  ownedBadge: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  ownedText: { fontWeight: "900", fontSize: 15 },

  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  secondaryTxt: { color: "rgba(255,255,255,0.8)", fontWeight: "700" },

  legalNote: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  legalRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  legalLink: { color: "rgba(124,247,216,0.6)", fontSize: 12, fontWeight: "700", textDecorationLine: "underline" },
  legalDot: { color: "rgba(255,255,255,0.3)", fontSize: 12 },

  backBtn: { alignItems: "center", paddingVertical: 10 },
  backTxt: { color: "#7cf7d8", fontWeight: "900" },

  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.2)",
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: "800",
    paddingBottom: Platform.OS === "ios" ? 6 : 2,
  },
});
