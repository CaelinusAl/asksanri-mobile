import React, { useEffect, useRef, useState } from "react";
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
  Animated,
  Easing,
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
import { useEntitlementStore } from "../../lib/entitlementStore";

const PRIVACY_URL = "https://asksanri.com/privacy";
const TERMS_URL = "https://asksanri.com/terms";
const BG = "#0a0b10";

// ─── Product definitions ───

type PaywallProduct = {
  id: EntitlementId;
  glyph: string;
  color: string;
  headlineTr: string;
  headlineEn: string;
  hookTr: string;
  hookEn: string;
  benefitsTr: string[];
  benefitsEn: string[];
  ctaTr: string;
  ctaEn: string;
  isSubscription: boolean;
  legalTr?: string;
  legalEn?: string;
};

const PAYWALL_PRODUCTS: PaywallProduct[] = [
  {
    id: "vip_access",
    glyph: "☽",
    color: "#7cf7d8",
    headlineTr: "Sanrı'yı gerçekten\ndeneyimlemek ister misin?",
    headlineEn: "Do you really want to\nexperience Sanri?",
    hookTr: "Yüzeyde kaldın.\nAlan seni bekliyor.",
    hookEn: "You stayed on the surface.\nThe field is waiting.",
    benefitsTr: [
      "Anlaşılma Alanı — duyulduğun yer",
      "Frekans Alanı — titreşimini oku",
      "Yankı Alanı — yansımanı gör",
      "Sınırsız bilinç analizi",
      "Derin şehir okumaları",
      "Ritüel yönlendirme",
    ],
    benefitsEn: [
      "Understanding Area — where you're heard",
      "Frequency Area — read your vibration",
      "Echo Area — see your reflection",
      "Unlimited consciousness analysis",
      "Deep city readings",
      "Ritual guidance",
    ],
    ctaTr: "VIP'e Geç",
    ctaEn: "Go VIP",
    isSubscription: true,
    legalTr: "Aylık abonelik. İstediğin zaman iptal et.",
    legalEn: "Monthly subscription. Cancel anytime.",
  },
  {
    id: "role_access",
    glyph: "◈",
    color: "#c084fc",
    headlineTr: "Sen aslında kim\nolduğunu biliyor musun?",
    headlineEn: "Do you actually know\nwho you are?",
    hookTr: "Bu sadece bir analiz değil.\nHayatındaki döngülerin nedenini göreceksin.",
    hookEn: "This is not just an analysis.\nYou'll see why your life keeps repeating.",
    benefitsTr: [
      "Matrix Rol Okuma — sistemdeki yerin",
      "Kişiye özel rol sonucu",
      "İlişki, para, içsel yapı analizi",
      "Kör nokta & döngü haritası",
      "Numeroloji katmanları",
    ],
    benefitsEn: [
      "Matrix Role Reading — your place in the system",
      "Personalized role result",
      "Relationship, finance, inner structure analysis",
      "Blind spot & cycle map",
      "Numerology layers",
    ],
    ctaTr: "Rolünü Aç",
    ctaEn: "Unlock Your Role",
    isSubscription: false,
  },
  {
    id: "code_training_access",
    glyph: "⌬",
    color: "#eab308",
    headlineTr: "Gerçeği görmek yetmez.\nOkumayı öğren.",
    headlineEn: "Seeing the truth isn't enough.\nLearn to read it.",
    hookTr: "Sistem sana sürekli konuşuyor.\nDinlemeyi öğreneceksin.",
    hookEn: "The system keeps talking to you.\nYou'll learn to listen.",
    benefitsTr: [
      "3 eğitim modülü — adım adım",
      "Kod Okuma dersleri",
      "SANRI ile kişisel kod çözümleme",
      "İlerleme takibi",
      "Derin decode sistemi",
    ],
    benefitsEn: [
      "3 training modules — step by step",
      "Code Reading lessons",
      "Personal code decoding with SANRI",
      "Progress tracking",
      "Deep decode system",
    ],
    ctaTr: "Eğitimi Aç",
    ctaEn: "Start Training",
    isSubscription: false,
  },
  {
    id: "general_reading_access",
    glyph: "◈",
    color: "#c084fc",
    headlineTr: "Tüm okumaları aç.\nKalıplarını gör.",
    headlineEn: "Unlock all readings.\nSee your patterns.",
    hookTr: "İlişki, kariyer, para, döngü, kör nokta…\nHer katmanı aç.",
    hookEn: "Relationship, career, money, cycle, blind spot…\nUnlock every layer.",
    benefitsTr: [
      "İlişki Kodu — yakınlık kalıbın",
      "Kariyer Akışı — seni tutan şey",
      "Bu Haftanın Kritik Noktası",
      "Para & Değer — bolluk kanalın",
      "Kör Nokta — göremediğin alan",
      "Döngü — tekrar eden kalıp",
      "Kırılma Noktası — dönüşüm kapısı",
    ],
    benefitsEn: [
      "Relationship Code — your intimacy pattern",
      "Career Flow — what holds you back",
      "This Week's Critical Point",
      "Money & Value — your abundance channel",
      "Blind Spot — what you can't see",
      "Cycle — the repeating pattern",
      "Breaking Point — your transformation gate",
    ],
    ctaTr: "Tüm Okumaları Aç",
    ctaEn: "Unlock All Readings",
    isSubscription: false,
  },
  {
    id: "relationship_deep_access",
    glyph: "♡",
    color: "#f472b6",
    headlineTr: "İlişki kalıbını\nderinlemesine gör.",
    headlineEn: "See your relationship\npattern deeply.",
    hookTr: "Yakınlaştıkça uzaklaşıyorsun.\nNedenini görmek ister misin?",
    hookEn: "You pull away as you get close.\nWant to see why?",
    benefitsTr: [
      "Kişiye özel ilişki analizi",
      "Duygusal kalıp haritası",
      "Olası senaryolar ve farkındalıklar",
      "Astrolojik Sanrı dili ile derin okuma",
    ],
    benefitsEn: [
      "Personalized relationship analysis",
      "Emotional pattern map",
      "Possible scenarios and insights",
      "Deep reading in astrological Sanri language",
    ],
    ctaTr: "Derine İn",
    ctaEn: "Go Deeper",
    isSubscription: false,
  },
  {
    id: "career_deep_access",
    glyph: "⬡",
    color: "#38bdf8",
    headlineTr: "Kariyer akışını\nderinlemesine gör.",
    headlineEn: "See your career\nflow deeply.",
    hookTr: "Seni tutan şey yetenek değil.\nSistemsel bir kalıp var.",
    hookEn: "What holds you back isn't talent.\nThere's a systemic pattern.",
    benefitsTr: [
      "Kişiye özel kariyer analizi",
      "Blokaj haritası ve çıkış yolu",
      "Olası senaryolar ve farkındalıklar",
      "Astrolojik Sanrı dili ile derin okuma",
    ],
    benefitsEn: [
      "Personalized career analysis",
      "Blockage map and exit path",
      "Possible scenarios and insights",
      "Deep reading in astrological Sanri language",
    ],
    ctaTr: "Derine İn",
    ctaEn: "Go Deeper",
    isSubscription: false,
  },
  {
    id: "weekly_flow_access",
    glyph: "⦿",
    color: "#a78bfa",
    headlineTr: "Bu haftanın akışını\nderinlemesine gör.",
    headlineEn: "See this week's\nflow deeply.",
    hookTr: "Bu hafta bir şey sana geri dönüyor.\nNe olduğunu görmek ister misin?",
    hookEn: "Something is coming back to you this week.\nWant to see what?",
    benefitsTr: [
      "Kişiye özel haftalık okuma",
      "Kritik nokta ve farkındalıklar",
      "Olası senaryolar",
      "Astrolojik Sanrı dili ile derin okuma",
    ],
    benefitsEn: [
      "Personalized weekly reading",
      "Critical points and insights",
      "Possible scenarios",
      "Deep reading in astrological Sanri language",
    ],
    ctaTr: "Derine İn",
    ctaEn: "Go Deeper",
    isSubscription: false,
  },
  {
    id: "person_deep_access",
    glyph: "✦",
    color: "#fb923c",
    headlineTr: "Hayatındaki kişiyi\nderinlemesine gör.",
    headlineEn: "See the person in your life\ndeeply.",
    hookTr: "Bir kişi var. Sana ayna tutuyor.\nO aynada ne var?",
    hookEn: "There's someone. They mirror you.\nWhat's in that mirror?",
    benefitsTr: [
      "Kişiye özel karşılaştırmalı analiz",
      "İlişki dinamiği haritası",
      "Olası senaryolar ve farkındalıklar",
      "Astrolojik Sanrı dili ile derin okuma",
    ],
    benefitsEn: [
      "Personalized comparative analysis",
      "Relationship dynamics map",
      "Possible scenarios and insights",
      "Deep reading in astrological Sanri language",
    ],
    ctaTr: "Derine İn",
    ctaEn: "Go Deeper",
    isSubscription: false,
  },
  {
    id: "money_deep_access",
    glyph: "◇",
    color: "#fbbf24",
    headlineTr: "Para akışını\nderinlemesine gör.",
    headlineEn: "See your money\nflow deeply.",
    hookTr: "Bolluk kanalın bir yerde daralıyor.\nNerede olduğunu görmek ister misin?",
    hookEn: "Your abundance channel narrows somewhere.\nWant to see where?",
    benefitsTr: [
      "Kişiye özel para kalıbı analizi",
      "Bolluk blokajı haritası",
      "Olası senaryolar ve farkındalıklar",
      "Astrolojik Sanrı dili ile derin okuma",
    ],
    benefitsEn: [
      "Personalized money pattern analysis",
      "Abundance blockage map",
      "Possible scenarios and insights",
      "Deep reading in astrological Sanri language",
    ],
    ctaTr: "Derine İn",
    ctaEn: "Go Deeper",
    isSubscription: false,
  },
];

// ─── Paywall Card (single product, full-screen focus) ───

type PaywallCardProps = {
  product: PaywallProduct;
  price: string | null;
  isOwned: boolean;
  isLoading: boolean;
  disabled: boolean;
  tr: boolean;
  onPurchase: () => void;
};

function PaywallCard({ product, price, isOwned, isLoading, disabled, tr, onPurchase }: PaywallCardProps) {
  const glyphAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glyphAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glyphAnim, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, glyphAnim]);

  useEffect(() => {
    if (isOwned) {
      Animated.parallel([
        Animated.spring(successScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
        Animated.timing(successOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [isOwned, successScale, successOpacity]);

  const glyphTranslateY = glyphAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const glyphOpacity = glyphAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.25, 0.5, 0.25] });

  const ctaLabel = tr ? product.ctaTr : product.ctaEn;
  const priceLabel = price || (tr ? "Fiyat yükleniyor…" : "Loading price…");
  const ctaWithPrice = product.isSubscription
    ? ctaLabel
    : `${ctaLabel} – ${priceLabel}`;

  if (isOwned) {
    return (
      <Animated.View style={[st.card, { borderColor: `${product.color}30`, opacity: successOpacity, transform: [{ scale: successScale }] }]}>
        <Text style={[st.successGlyph, { color: product.color }]}>{product.glyph}</Text>
        <Text style={[st.successTitle, { color: product.color }]}>
          {tr ? "Aktif" : "Active"}
        </Text>
        <Text style={st.successSub}>
          {tr ? "Bu alan artık sana açık." : "This area is now open to you."}
        </Text>
        <Pressable
          style={[st.ctaBtn, { backgroundColor: `${product.color}20`, borderColor: `${product.color}40`, borderWidth: 1 }]}
          onPress={() => router.back()}
        >
          <Text style={[st.ctaBtnText, { color: product.color }]}>
            {tr ? "Devam et" : "Continue"}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[st.card, { borderColor: `${product.color}18`, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Animated.Text
        style={[
          st.glyph,
          { color: product.color, opacity: glyphOpacity, transform: [{ translateY: glyphTranslateY }] },
        ]}
      >
        {product.glyph}
      </Animated.Text>

      <Text style={[st.headline, { color: product.color }]}>
        {tr ? product.headlineTr : product.headlineEn}
      </Text>

      <Text style={st.hook}>
        {tr ? product.hookTr : product.hookEn}
      </Text>

      <View style={st.divider} />

      <View style={st.benefitList}>
        {(tr ? product.benefitsTr : product.benefitsEn).map((b, i) => (
          <View key={i} style={st.benefitRow}>
            <View style={[st.benefitDot, { backgroundColor: product.color }]} />
            <Text style={st.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      <View style={st.ctaZone}>
        <Pressable
          style={[st.ctaBtn, { backgroundColor: product.color }, (isLoading || (!price && !product.isSubscription)) && st.ctaDisabled]}
          onPress={onPurchase}
          disabled={disabled || isLoading || (!price && !product.isSubscription)}
        >
          {isLoading ? (
            <ActivityIndicator color={BG} size="small" />
          ) : (
            <Text style={st.ctaBtnText}>
              {product.isSubscription ? ctaLabel : ctaWithPrice}
            </Text>
          )}
        </Pressable>

        {product.isSubscription && price && (
          <Text style={[st.priceBelow, { color: `${product.color}90` }]}>{priceLabel}</Text>
        )}
      </View>

      {product.legalTr && (
        <Text style={st.productLegal}>
          {tr ? product.legalTr : product.legalEn}
        </Text>
      )}
    </Animated.View>
  );
}

// ─── Main Screen ───

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
  const refreshEntitlements = useEntitlementStore((s) => s.refresh);

  const requestedEntitlement = (params.entitlement || "") as EntitlementId;
  const hasSpecific = PAYWALL_PRODUCTS.some((p) => p.id === requestedEntitlement);

  const [loading, setLoading] = useState<EntitlementId | null>(null);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [owned, setOwned] = useState<EntitlementStatus>({
    vip_access: false,
    role_access: false,
    code_training_access: false,
    general_reading_access: false,
    relationship_deep_access: false,
    career_deep_access: false,
    weekly_flow_access: false,
    person_deep_access: false,
    money_deep_access: false,
  });

  useEffect(() => {
    trackEvent("vip_click", { userId: user?.id, meta: { entitlement: requestedEntitlement } });
  }, []);

  useEffect(() => {
    getActiveEntitlements().then(setOwned).catch(() => {});

    for (const p of PAYWALL_PRODUCTS) {
      getPackageForEntitlement(p.id).then((pkg) => {
        if (pkg?.product?.priceString) {
          setPrices((prev) => ({
            ...prev,
            [p.id]: p.isSubscription
              ? pkg.product.priceString + (tr ? " / ay" : " / mo")
              : pkg.product.priceString,
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
      if (__DEV__) console.log(`[PAYWALL] Purchasing: ${entId}`);

      const result = await purchaseEntitlement(entId);

      if (!result.ok) {
        if (__DEV__) console.log(`[PAYWALL] Purchase failed: ${result.reason} — ${result.message}`);

        if (result.reason === "plan_change_not_allowed" || result.reason === "pending_google_play") {
          Alert.alert(tr ? "Abonelik Durumu" : "Subscription Status", result.message, [
            { text: tr ? "Abonelikleri Yönet" : "Manage", onPress: () => openManageSubscriptions().catch(() => {}) },
            { text: "OK" },
          ]);
          return;
        }
        if (result.reason === "already_active") {
          setOwned((prev) => ({ ...prev, [entId]: true }));
          refreshEntitlements();
          return;
        }
        if (result.reason === "cancelled") return;
        Alert.alert(tr ? "Hata" : "Error", result.message);
        return;
      }

      const info = await getCustomerInfo();
      if (!info) {
        Alert.alert(tr ? "Hata" : "Error", tr ? "Erişim doğrulanamadı." : "Access could not be verified.");
        return;
      }

      if (__DEV__) console.log(`[PAYWALL] Purchase success: ${entId}`);

      const meta = ENTITLEMENT_META[entId];
      trackEvent("entitlement_unlock", { userId: user?.id, meta: { entitlement: entId, method: "purchase" } });
      setOwned((prev) => ({ ...prev, [entId]: true }));
      refreshEntitlements();

      setTimeout(() => goAfterSuccess(), 1800);
    } catch (e: any) {
      if (e?.userCancelled) return;
      const devInfo = getRevenueCatInitError() || (tr ? "Satın alma sistemi hazır değil." : "Purchase system not ready.");
      Alert.alert(tr ? "Hata" : "Error", e?.message?.trim() ? e.message : devInfo);
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
        Alert.alert(tr ? "Bilgi" : "Info", tr ? "Aktif bir abonelik bulunamadı." : "No active subscription found.");
        return;
      }
      if (__DEV__) console.log("[PAYWALL] Restore success");
      trackEvent("entitlement_restore", { userId: user?.id });
      const fresh = await getActiveEntitlements();
      setOwned(fresh);
      refreshEntitlements();
      Alert.alert("OK", tr ? "Satın alımlar geri yüklendi." : "Purchases restored.");
    } catch (e: any) {
      const devInfo = getRevenueCatInitError() || "";
      Alert.alert(tr ? "Hata" : "Error", e?.message || devInfo);
    } finally {
      setLoading(null);
    }
  };

  const visibleProducts = hasSpecific
    ? PAYWALL_PRODUCTS.filter((p) => p.id === requestedEntitlement)
    : PAYWALL_PRODUCTS;

  const isSingleProduct = visibleProducts.length === 1;
  const singleProduct = isSingleProduct ? visibleProducts[0] : null;

  return (
    <View style={st.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[st.container, isSingleProduct && st.containerSingle]}
        showsVerticalScrollIndicator={false}
      >
        {!isSingleProduct && (
          <>
            <Text style={st.kicker}>CAELINUS</Text>
            <Text style={st.pageTitle}>{tr ? "Hangi katmana hazırsın?" : "Which layer are you ready for?"}</Text>
            <Text style={st.pageSub}>
              {tr
                ? "Her kapı farklı bir farkındalık."
                : "Every gate is a different awareness."}
            </Text>
          </>
        )}

        {visibleProducts.map((product) => (
          <PaywallCard
            key={product.id}
            product={product}
            price={prices[product.id] || null}
            isOwned={owned[product.id]}
            isLoading={loading === product.id}
            disabled={!!loading}
            tr={tr}
            onPurchase={() => onPurchase(product.id)}
          />
        ))}

        {/* Restore */}
        <Pressable style={st.secondaryBtn} onPress={onRestore} disabled={!!loading}>
          <Text style={st.secondaryTxt}>
            {tr ? "Satın alımı geri yükle" : "Restore purchase"}
          </Text>
        </Pressable>

        {/* Manage (only for VIP subscription) */}
        {(!singleProduct || singleProduct.isSubscription) && (
          <Pressable
            style={st.secondaryBtn}
            onPress={() => openManageSubscriptions().catch(() => {})}
            disabled={!!loading}
          >
            <Text style={st.secondaryTxt}>
              {tr ? "Abonelikleri yönet" : "Manage subscriptions"}
            </Text>
          </Pressable>
        )}

        {/* Legal */}
        <View style={st.legalRow}>
          <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
            <Text style={st.legalLink}>{tr ? "Kullanım Şartları" : "Terms"}</Text>
          </Pressable>
          <Text style={st.legalDot}>·</Text>
          <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
            <Text style={st.legalLink}>{tr ? "Gizlilik" : "Privacy"}</Text>
          </Pressable>
        </View>

        {/* Dismiss */}
        <Pressable style={st.dismissBtn} onPress={() => router.back()} disabled={!!loading}>
          <Text style={st.dismissTxt}>{tr ? "Şimdi değil" : "Not now"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 64 : 48,
    paddingBottom: 60,
    gap: 20,
  },
  containerSingle: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    justifyContent: "center",
  },

  kicker: {
    color: "rgba(255,255,255,0.30)",
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  pageTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  pageSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 4,
  },

  // Card
  card: {
    borderRadius: 28,
    padding: 28,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
  },
  glyph: {
    fontSize: 44,
    textAlign: "center",
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  hook: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 20,
  },

  // Benefits
  benefitList: { gap: 12, marginBottom: 28 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  benefitText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  // CTA
  ctaZone: { alignItems: "center" },
  ctaBtn: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 58,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaBtnText: {
    color: BG,
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  priceBelow: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  productLegal: {
    marginTop: 12,
    color: "rgba(255,255,255,0.28)",
    fontSize: 11,
    textAlign: "center",
  },

  // Success state
  successGlyph: {
    fontSize: 52,
    textAlign: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  successSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },

  // Secondary
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  secondaryTxt: {
    color: "rgba(255,255,255,0.50)",
    fontWeight: "700",
    fontSize: 14,
  },

  // Legal
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  legalLink: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 12,
    fontWeight: "700",
  },
  legalDot: { color: "rgba(255,255,255,0.15)", fontSize: 12 },

  // Dismiss
  dismissBtn: { alignItems: "center", paddingVertical: 12 },
  dismissTxt: {
    color: "rgba(255,255,255,0.30)",
    fontWeight: "800",
    fontSize: 14,
  },
});
