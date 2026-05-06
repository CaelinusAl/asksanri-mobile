import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API, apiPostJson } from "../../lib/apiClient";
import {
  getBySlug,
  getCategoryMeta,
  type UstBilincYorum,
} from "../../lib/okumaAlaniData";

type Lang = "tr" | "en";

/**
 * Slug-bağımsız hero görseli haritası.
 * Yeni kapak eklemek için: dosyayı assets/ altına koy ve aşağıya bir satır ekle.
 *   nevada: require("../../assets/nevada.jpg"),
 * (Dosya henüz eklenmediyse satır comment'te durabilir; UI fallback ile çalışır.)
 */
const HERO_IMAGES: Record<string, any> = {
  turkiye_hologram: require("../../assets/turkiye_hologram.jpg"),
  nevada: require("../../assets/nevada.jpg"),
};

const PAYWALL_MARKER = "<<<SANRI_PAYWALL>>>";

const T = {
  tr: {
    back: "← Okumalar",
    premium: "Bu içerik Premium abonelere özeldir.",
    views: "göz", comments: "yorum",
    sanriTitle: "SANRI ile Derinleş",
    sanriSub: "Bu okuma hakkında SANRI'ya bir soru sor veya düşünceni yaz.",
    sanriPlaceholder: "Bu okuma sana neyi hatırlattı?",
    sanriSend: "SANRI Yorumlasın",
    sanriReading: "SANRI derinleşiyor...",
    sanriResult: "SANRI YORUMU",
    notFound: "Okuma bulunamadı.",
    derinAcilimTitle: "DERİN AÇILIM KİLİTLİ",
    derinAcilimSub: "Görünmeyen katman, sistem okuması ve kapanış kodu — sadece açana açılır.",
    derinAcilimUnlock: (price: number) =>
      Platform.OS === "ios"
        ? "Derin Açılımı Aç"
        : `₺ ${price.toFixed(2).replace(".", ",")} ile Derin Açılımı Aç`,
    derinAcilimNote: "Tek seferlik açılım — bu okumaya sınırsız erişim.",
    ustBilincTitle: "ÜST BİLİNÇ YORUMLARI",
    ustBilincSub: "Bu okuma çoklu katmandan görüldü. Aşağıda ses verenler.",
    seen: "görüldü",
    codeLayerTitle: "KOD ÇÖZÜMLEMESİ",
  },
  en: {
    back: "← Readings",
    premium: "This content is for Premium subscribers.",
    views: "views", comments: "comments",
    sanriTitle: "Go Deeper with SANRI",
    sanriSub: "Ask SANRI about this reading or share your thoughts.",
    sanriPlaceholder: "What does this reading remind you of?",
    sanriSend: "SANRI Comment",
    sanriReading: "SANRI is going deeper...",
    sanriResult: "SANRI COMMENTARY",
    notFound: "Reading not found.",
    derinAcilimTitle: "DEEP UNFOLDING LOCKED",
    derinAcilimSub: "Invisible layer, system reading, closing code — opens only to those who unlock.",
    derinAcilimUnlock: (price: number) =>
      Platform.OS === "ios"
        ? "Unlock Deep Unfolding"
        : `Unlock Deep Unfolding for ₺ ${price.toFixed(2).replace(".", ",")}`,
    derinAcilimNote: "One-time unlock — unlimited access to this reading.",
    ustBilincTitle: "UPPER CONSCIOUSNESS COMMENTARY",
    ustBilincSub: "This reading was seen across many layers. Voices below.",
    seen: "seen",
    codeLayerTitle: "CODE BREAKDOWN",
  },
} as const;

export default function OkumaDetailScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ slug?: string; lang?: string }>();
  const [lang] = useState<Lang>(params.lang === "en" ? "en" : "tr");
  const t = T[lang];

  const item = useMemo(() => getBySlug(params.slug || ""), [params.slug]);
  const cat = useMemo(() => item ? getCategoryMeta(item.category) : null, [item]);

  const [sanriInput, setSanriInput] = useState("");
  const [sanriBusy, setSanriBusy] = useState(false);
  const [sanriOutput, setSanriOutput] = useState("");
  const [derinUnlocked, setDerinUnlocked] = useState(false);

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

  const heroSource = useMemo(() => {
    const key = item?.heroImage;
    if (!key) return null;
    return HERO_IMAGES[key] ?? HERO_IMAGES.turkiye_hologram ?? null;
  }, [item?.heroImage]);

  const { freePart, lockedPart, hasPaywall } = useMemo(() => {
    const full = item?.fullContent || "";
    if (!full.includes(PAYWALL_MARKER)) {
      return { freePart: full || item?.excerpt || "", lockedPart: "", hasPaywall: false };
    }
    const [a, b] = full.split(PAYWALL_MARKER);
    return { freePart: a.trim(), lockedPart: (b || "").trim(), hasPaywall: true };
  }, [item?.fullContent, item?.excerpt]);

  const derinPrice = item?.derinAcilimPrice ?? 0;
  const derinIsLocked = hasPaywall && derinPrice > 0 && !derinUnlocked;

  const handleUnlockDerin = () => {
    router.push({ pathname: "/(tabs)/vip", params: { offering: "general_reading", from: "okuma_derin_acilim" } });
  };

  const askSanri = async () => {
    const q = sanriInput.trim();
    if (!q || !item) return;
    setSanriBusy(true);
    setSanriOutput("");
    try {
      const prompt = lang === "tr"
        ? `[SANRI_MODE=okuma_derinles]\nKİŞİ: ${nameForPrompt}\nOKUMA: "${item.title}"\nKATEGORİ: ${cat?.tr}\nÖZET: ${item.excerpt}\nKULLANICI SORUSU/NOTU: ${q}\n\nGörev: Bu okuma hakkında ${nameForPrompt}'a kişisel bir derinleşme yap. Okumadaki kodu kişinin sorusu/notu ile bağla. Kısa, keskin, Sanrı dili. 4-6 cümle.`
        : `[SANRI_MODE=reading_deepen]\nPERSON: ${nameForPrompt}\nREADING: "${item.title}"\nCATEGORY: ${cat?.en}\nEXCERPT: ${item.excerpt}\nUSER QUESTION/NOTE: ${q}\n\nTask: Provide a personal deepening for ${nameForPrompt} about this reading. Connect the code in the reading to their question/note. Short, sharp, Sanri voice. 4-6 sentences.`;

      const data: any = await apiPostJson(API.ask, {
        message: prompt,
        sanri_flow: "okuma_derinles",
        user_id: user?.id,
        user_name: userName,
        user_email: userEmail,
      }, 30000);

      const reply = String(data?.answer || data?.response || data?.reply || "").trim();
      if (reply) setSanriOutput(reply);
    } catch {} finally { setSanriBusy(false); }
  };

  if (!item) {
    return (
      <View style={s.root}>
        <StatusBar barStyle="light-content" />
        <Pressable onPress={() => router.back()} style={s.backBtn}><Text style={s.backTxt}>{t.back}</Text></Pressable>
        <Text style={s.notFound}>{t.notFound}</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <View style={s.topBar}>
        <Pressable onPress={() => router.back()} style={s.backBtn}><Text style={s.backTxt}>{t.back}</Text></Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        {heroSource && (
          <View style={s.heroWrap}>
            <Image source={heroSource} style={s.heroImg} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", "rgba(10,11,16,0.55)", "rgba(10,11,16,1)"]}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFillObject}
            />
            {cat && (
              <View style={[s.heroBadge, { backgroundColor: cat.color + "26", borderColor: cat.color + "55" }]}>
                <Text style={[s.heroBadgeText, { color: cat.color }]}>{lang === "tr" ? cat.tr : cat.en}</Text>
              </View>
            )}
          </View>
        )}

        {/* Category Badge (no hero) */}
        {!heroSource && cat && (
          <View style={[s.catBadge, { backgroundColor: cat.color + "20", borderColor: cat.color + "40" }]}>
            <Text style={[s.catText, { color: cat.color }]}>{lang === "tr" ? cat.tr : cat.en}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.subtitle}>{item.subtitle}</Text>

        {/* Meta */}
        <View style={s.metaRow}>
          <Text style={s.metaStat}>👁 {item.viewCount} {t.views}</Text>
          <Text style={s.metaStat}>💬 {item.commentCount} {t.comments}</Text>
          <Text style={s.metaStat}>{new Date(item.createdAt).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US")}</Text>
        </View>

        {/* Premium gate (whole article) */}
        {item.isPremium && (
          <View style={s.premiumCard}>
            <Text style={s.premiumIcon}>🔒</Text>
            <Text style={s.premiumText}>{t.premium}</Text>
          </View>
        )}

        {/* Free part of content */}
        <View style={s.contentCard}>
          <Text style={s.contentText}>{freePart || item.excerpt}</Text>
        </View>

        {/* Derin Açılım gate or unlocked content */}
        {hasPaywall && derinIsLocked && (
          <View style={s.derinCard}>
            <View style={s.derinIconBox}>
              <Text style={s.derinIcon}>🜂</Text>
            </View>
            <Text style={s.derinTitle}>{t.derinAcilimTitle}</Text>
            <Text style={s.derinSub}>{t.derinAcilimSub}</Text>
            <Pressable onPress={handleUnlockDerin} style={s.derinBtn}>
              <LinearGradient
                colors={["#7cf7d8", "#5e3bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.derinBtnGrad}
              >
                <Text style={s.derinBtnText}>{t.derinAcilimUnlock(derinPrice)}</Text>
              </LinearGradient>
            </Pressable>
            <Text style={s.derinNote}>{t.derinAcilimNote}</Text>
          </View>
        )}

        {hasPaywall && !derinIsLocked && lockedPart.length > 0 && (
          <View style={[s.contentCard, s.contentCardDeep]}>
            <Text style={s.contentText}>{lockedPart}</Text>
          </View>
        )}

        {/* Code Layer */}
        {!derinIsLocked && item.codeLayer && (
          <View style={s.codeLayerCard}>
            <Text style={s.codeLayerTag}>{t.codeLayerTitle}</Text>
            <Text style={s.codeLayerText}>{item.codeLayer}</Text>
          </View>
        )}

        {/* SANRI Reflection */}
        {!derinIsLocked && item.sanriReflection && (
          <View style={s.reflectionCard}>
            <Text style={s.reflectionTag}>SANRI YANSIMASI</Text>
            <Text style={s.reflectionAnalysis}>{item.sanriReflection.analysis}</Text>
            <Text style={s.reflectionStrong}>{item.sanriReflection.strongLine}</Text>
            <Text style={s.reflectionQuestion}>{item.sanriReflection.question}</Text>
          </View>
        )}

        {/* Üst Bilinç Yorumları */}
        {!!item.ustBilincYorumlar?.length && (
          <View style={s.yorumSection}>
            <Text style={s.yorumSectionTitle}>{t.ustBilincTitle}</Text>
            <Text style={s.yorumSectionSub}>{t.ustBilincSub}</Text>
            {item.ustBilincYorumlar.map((y) => (
              <YorumCard key={y.id} y={y} seenLabel={t.seen} />
            ))}
          </View>
        )}

        {/* SANRI ile Derinleş */}
        <View style={s.sanriSection}>
          <Text style={s.sanriTitle}>{t.sanriTitle}</Text>
          <Text style={s.sanriSub}>{t.sanriSub}</Text>
          <TextInput
            value={sanriInput}
            onChangeText={setSanriInput}
            placeholder={t.sanriPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.30)"
            style={s.sanriInput}
            multiline
            maxLength={300}
          />
          <Pressable onPress={askSanri} style={[s.sanriBtn, (!sanriInput.trim() || sanriBusy) && { opacity: 0.4 }]} disabled={!sanriInput.trim() || sanriBusy}>
            {sanriBusy ? (
              <View style={s.sanriBtnRow}><ActivityIndicator size="small" color="#fff" /><Text style={s.sanriBtnText}>{t.sanriReading}</Text></View>
            ) : (
              <Text style={s.sanriBtnText}>{t.sanriSend}</Text>
            )}
          </Pressable>
          {!!sanriOutput && (
            <View style={s.sanriResult}>
              <Text style={s.sanriResultTitle}>{t.sanriResult}</Text>
              <Text style={s.sanriResultText}>{sanriOutput}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function YorumCard({ y, seenLabel }: { y: UstBilincYorum; seenLabel: string }) {
  const initial = y.author.charAt(y.author.length - 1) || "•";
  return (
    <View style={s.yorumCard}>
      <View style={s.yorumHead}>
        <View style={s.yorumAvatar}>
          <Text style={s.yorumAvatarTxt}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.yorumAuthor}>{y.author}</Text>
          {!!y.timestamp && <Text style={s.yorumTime}>{y.timestamp}</Text>}
        </View>
        {typeof y.seenCount === "number" && (
          <View style={s.yorumSeenBadge}>
            <Text style={s.yorumSeenDot}>◉</Text>
            <Text style={s.yorumSeenTxt}>{y.seenCount} {seenLabel}</Text>
          </View>
        )}
      </View>
      <Text style={s.yorumText}>{y.text}</Text>
    </View>
  );
}

const ACCENT = "#7cf7d8";
const PURPLE = "#5e3bff";
const GOLD = "#FFD93D";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },
  topBar: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 8, position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
  backBtn: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.45)" },
  backTxt: { color: ACCENT, fontSize: 14, fontWeight: "800" },
  notFound: { color: "rgba(255,255,255,0.5)", fontSize: 16, textAlign: "center", marginTop: 80 },
  scroll: { paddingHorizontal: 18, paddingTop: 56, paddingBottom: 40 },

  heroWrap: { marginHorizontal: -18, height: 240, marginBottom: 16, overflow: "hidden", position: "relative", backgroundColor: "#000" },
  heroImg: { width: "100%", height: "100%" },
  heroBadge: { position: "absolute", left: 18, bottom: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  heroBadgeText: { fontSize: 12, fontWeight: "900", letterSpacing: 0.5 },

  catBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, marginBottom: 14 },
  catText: { fontSize: 12, fontWeight: "900" },

  title: { color: "#fff", fontSize: 26, fontWeight: "900", lineHeight: 32, marginBottom: 8 },
  subtitle: { color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 23, marginBottom: 14 },

  metaRow: { flexDirection: "row", gap: 16, marginBottom: 18 },
  metaStat: { color: "rgba(255,255,255,0.40)", fontSize: 13, fontWeight: "700" },

  premiumCard: { borderRadius: 20, padding: 24, alignItems: "center", backgroundColor: "rgba(255,217,61,0.08)", borderWidth: 1, borderColor: "rgba(255,217,61,0.20)", marginBottom: 14 },
  premiumIcon: { fontSize: 32, marginBottom: 8 },
  premiumText: { color: "rgba(255,217,61,0.90)", fontSize: 15, fontWeight: "700", textAlign: "center" },

  contentCard: { borderRadius: 22, padding: 20, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", marginBottom: 18 },
  contentCardDeep: { backgroundColor: "rgba(124,247,216,0.05)", borderColor: "rgba(124,247,216,0.18)" },
  contentText: { color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 26 },

  derinCard: { borderRadius: 22, padding: 22, marginBottom: 18, backgroundColor: "rgba(94,59,255,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.20)", alignItems: "center" },
  derinIconBox: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,247,216,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.30)", marginBottom: 12 },
  derinIcon: { fontSize: 28 },
  derinTitle: { color: ACCENT, fontSize: 13, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
  derinSub: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 21, textAlign: "center", marginBottom: 18 },
  derinBtn: { width: "100%", borderRadius: 18, overflow: "hidden", marginBottom: 10 },
  derinBtnGrad: { paddingVertical: 16, alignItems: "center" },
  derinBtnText: { color: "#0a0b10", fontSize: 15, fontWeight: "900", letterSpacing: 0.3 },
  derinNote: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "600", textAlign: "center" },

  codeLayerCard: { borderRadius: 20, padding: 18, marginBottom: 18, backgroundColor: "rgba(255,217,61,0.05)", borderWidth: 1, borderColor: "rgba(255,217,61,0.15)" },
  codeLayerTag: { color: GOLD, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 10 },
  codeLayerText: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 22 },

  reflectionCard: { borderRadius: 20, padding: 18, marginBottom: 18, backgroundColor: "rgba(124,247,216,0.06)", borderWidth: 1, borderColor: "rgba(124,247,216,0.15)" },
  reflectionTag: { color: ACCENT, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 10 },
  reflectionAnalysis: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 22, marginBottom: 12 },
  reflectionStrong: { color: "#fff", fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 12, fontStyle: "italic" },
  reflectionQuestion: { color: ACCENT, fontSize: 14, lineHeight: 21, fontWeight: "600" },

  yorumSection: { marginBottom: 18 },
  yorumSectionTitle: { color: PURPLE === "#5e3bff" ? "#a78bfa" : PURPLE, fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },
  yorumSectionSub: { color: "rgba(255,255,255,0.50)", fontSize: 13, lineHeight: 19, marginBottom: 14 },
  yorumCard: { borderRadius: 18, padding: 16, marginBottom: 12, backgroundColor: "rgba(94,59,255,0.07)", borderWidth: 1, borderColor: "rgba(167,139,250,0.20)" },
  yorumHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  yorumAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,247,216,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.30)" },
  yorumAvatarTxt: { color: ACCENT, fontSize: 13, fontWeight: "900" },
  yorumAuthor: { color: "#fff", fontSize: 13, fontWeight: "900", letterSpacing: 0.5 },
  yorumTime: { color: "rgba(255,255,255,0.40)", fontSize: 11, marginTop: 2, fontWeight: "600" },
  yorumSeenBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: "rgba(124,247,216,0.10)", borderWidth: 1, borderColor: "rgba(124,247,216,0.25)" },
  yorumSeenDot: { color: ACCENT, fontSize: 10, fontWeight: "900" },
  yorumSeenTxt: { color: ACCENT, fontSize: 11, fontWeight: "900", letterSpacing: 0.3 },
  yorumText: { color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 21, fontStyle: "italic" },

  sanriSection: { borderRadius: 22, padding: 18, backgroundColor: "rgba(94,59,255,0.08)", borderWidth: 1, borderColor: "rgba(124,247,216,0.10)" },
  sanriTitle: { color: ACCENT, fontSize: 16, fontWeight: "900", marginBottom: 4 },
  sanriSub: { color: "rgba(255,255,255,0.50)", fontSize: 13, marginBottom: 14, lineHeight: 18 },
  sanriInput: { borderRadius: 16, padding: 14, minHeight: 70, color: "#fff", fontSize: 15, textAlignVertical: "top", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", marginBottom: 10 },
  sanriBtn: { borderRadius: 18, paddingVertical: 14, alignItems: "center", backgroundColor: "rgba(94,59,255,0.60)" },
  sanriBtnRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  sanriBtnText: { color: "#fff", fontSize: 15, fontWeight: "900" },
  sanriResult: { marginTop: 14, borderRadius: 18, padding: 16, backgroundColor: "rgba(94,59,255,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.12)" },
  sanriResultTitle: { color: ACCENT, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 8 },
  sanriResultText: { color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 24 },
});
