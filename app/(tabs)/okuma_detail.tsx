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
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { API, apiPostJson } from "../../lib/apiClient";
import { getBySlug, getCategoryMeta } from "../../lib/okumaAlaniData";

type Lang = "tr" | "en";

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

  const userName = user?.name?.trim() || "";
  const userEmail = user?.email?.trim() || "";
  const nameForPrompt = userName || userEmail?.split("@")[0] || "";

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
        {/* Category Badge */}
        {cat && (
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

        {/* Premium gate or Excerpt */}
        {item.isPremium ? (
          <View style={s.premiumCard}>
            <Text style={s.premiumIcon}>🔒</Text>
            <Text style={s.premiumText}>{t.premium}</Text>
          </View>
        ) : null}

        {/* Content */}
        <View style={s.contentCard}>
          <Text style={s.contentText}>{item.fullContent || item.excerpt}</Text>
        </View>

        {/* SANRI Reflection */}
        {item.sanriReflection && (
          <View style={s.reflectionCard}>
            <Text style={s.reflectionTag}>SANRI YANSIMASI</Text>
            <Text style={s.reflectionAnalysis}>{item.sanriReflection.analysis}</Text>
            <Text style={s.reflectionStrong}>{item.sanriReflection.strongLine}</Text>
            <Text style={s.reflectionQuestion}>{item.sanriReflection.question}</Text>
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

const ACCENT = "#7cf7d8";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },
  topBar: { paddingTop: 10, paddingHorizontal: 14, paddingBottom: 8 },
  backBtn: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)" },
  backTxt: { color: ACCENT, fontSize: 14, fontWeight: "800" },
  notFound: { color: "rgba(255,255,255,0.5)", fontSize: 16, textAlign: "center", marginTop: 40 },
  scroll: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 40 },

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
  contentText: { color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 26 },

  reflectionCard: { borderRadius: 20, padding: 18, marginBottom: 18, backgroundColor: "rgba(124,247,216,0.06)", borderWidth: 1, borderColor: "rgba(124,247,216,0.15)" },
  reflectionTag: { color: ACCENT, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginBottom: 10 },
  reflectionAnalysis: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 22, marginBottom: 12 },
  reflectionStrong: { color: "#fff", fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 12, fontStyle: "italic" },
  reflectionQuestion: { color: ACCENT, fontSize: 14, lineHeight: 21, fontWeight: "600" },

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
