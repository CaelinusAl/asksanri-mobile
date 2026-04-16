import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { MATRIX_ROL_URL, MATRIX_DEEP_URL } from "../../lib/ankodData";
import { useEntitlementStore } from "../../lib/entitlementStore";
import type { EntitlementId } from "../../lib/premium";

const ROLE_COLOR = "#c084fc";
const GLOW_PINK = "#f472b6";
const GLOW_CYAN = "#38bdf8";
const GLOW_AMBER = "#fbbf24";
const BG = "#07080d";
const CARD_BG = "rgba(255,255,255,0.025)";
const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

// ═══════════════ TYPES ═══════════════

type FlowState =
  | "collect_name"
  | "loading"
  | "result"
  | "error"
  | "deep_form"
  | "deep_loading"
  | "deep_result";

type ApiResult = {
  matrix_role?: string;
  life_path?: number;
  life_path_archetype?: string;
  name_archetype?: string;
  teaser?: string;
  relationship_code?: string;
  weekly_focus?: string;
  career_flow?: string;
  person_scenario?: string;
  money_pattern?: string;
  blind_spot?: string;
  cycle_pattern?: string;
  breaking_point?: string;
  [key: string]: unknown;
};

type DeepId = "relationship" | "career" | "weekly" | "person" | "money" | "emotion" | "astro" | "identity" | "blindspot" | "cycle" | "breakpoint";

type SectionData = {
  key: string;
  label: string;
  icon: string;
  shortText: string;
  accentColor: string;
  hookLine?: string;
  deepId?: DeepId;
  free: boolean;
};

type DeepConfig = {
  entitlement: EntitlementId;
  cta: string;
  color: string;
  fields: { key: string; label: string; placeholder: string }[];
};

// ═══════════════ DEEP PRODUCT CONFIG ═══════════════

const DEEP_CONFIG: Record<DeepId, DeepConfig> = {
  relationship: {
    entitlement: "relationship_deep_access",
    cta: "İlişki Yolculuğu",
    color: GLOW_PINK,
    fields: [
      { key: "status", label: "Mevcut ilişki durumun", placeholder: "Bekar / İlişkide / Karmaşık..." },
      { key: "issue", label: "Tekrar eden sorun", placeholder: "Hep aynı noktada tıkanıyorum..." },
      { key: "tone", label: "Şu anki duygusal tonun", placeholder: "Kızgınlık / Kaçış / Özlem / Beklenti..." },
    ],
  },
  career: {
    entitlement: "career_deep_access",
    cta: "Kariyer Yolculuğu",
    color: GLOW_CYAN,
    fields: [
      { key: "work_status", label: "Çalışma durumun", placeholder: "Çalışıyor / Arıyor / Geçiş döneminde..." },
      { key: "field", label: "Alanın", placeholder: "Teknoloji / Sanat / Eğitim / Serbest..." },
      { key: "blockage", label: "En büyük tıkanıklığın", placeholder: "Cesaretsizlik / Maddi / Yön bulmak..." },
      { key: "direction", label: "İstediğin yön", placeholder: "Ne yapmak istiyorsun gerçekten?" },
    ],
  },
  weekly: {
    entitlement: "weekly_flow_access",
    cta: "Haftalık Akış",
    color: "#a78bfa",
    fields: [
      { key: "focus", label: "Bu haftaki odağın", placeholder: "Bir karar / Bir kişi / İş / Değişim..." },
      { key: "stress", label: "Şu anki stres alanın", placeholder: "İlişki / Para / Sağlık / Belirsizlik..." },
    ],
  },
  person: {
    entitlement: "person_deep_access",
    cta: "Kişi Analizi",
    color: "#fb923c",
    fields: [
      { key: "person_name", label: "Kişinin adı", placeholder: "Ad Soyad" },
      { key: "person_dob", label: "Doğum tarihi (biliyorsan)", placeholder: "GG.AA.YYYY" },
      { key: "relation_type", label: "Aranızdaki bağ", placeholder: "Sevgili / Arkadaş / Aile / Eski / İş..." },
    ],
  },
  money: {
    entitlement: "money_deep_access",
    cta: "Para Yolculuğu",
    color: GLOW_AMBER,
    fields: [
      { key: "income_status", label: "Gelir durumun", placeholder: "Düzenli / Düzensiz / Yok..." },
      { key: "block", label: "Para ile en büyük sorunun", placeholder: "Kazanamıyorum / Tutamıyorum / Hak etmiyorum..." },
      { key: "goal", label: "Maddi hedefin", placeholder: "Birikim / Yatırım / Rahatlık / Özgürlük..." },
    ],
  },
  emotion: {
    entitlement: "relationship_deep_access",
    cta: "Duygusal Derinlik",
    color: "#e879f9",
    fields: [
      { key: "dominant_emotion", label: "Şu an en baskın duygun", placeholder: "Öfke / Hüzün / Kaygı / Boşluk / Suçluluk..." },
      { key: "avoided_emotion", label: "En çok kaçındığın duygu", placeholder: "Kırılganlık / Öfke / Yalnızlık..." },
      { key: "body_area", label: "Bedeninde en çok nerede hissediyorsun?", placeholder: "Göğüs / Boğaz / Mide / Omuzlar..." },
    ],
  },
  astro: {
    entitlement: "weekly_flow_access",
    cta: "Kozmik Harita",
    color: "#818cf8",
    fields: [
      { key: "curiosity", label: "En çok merak ettiğin alan", placeholder: "Aşk / Kariyer / Aile / Sağlık / Ruhsal gelişim..." },
      { key: "recurring_theme", label: "Hayatında tekrar eden tema", placeholder: "Kayıp / Yeniden başlangıç / Terk edilme / Arayış..." },
    ],
  },
  identity: {
    entitlement: "career_deep_access",
    cta: "Benlik Yolculuğu",
    color: "#34d399",
    fields: [
      { key: "self_description", label: "Kendini nasıl tanımlarsın?", placeholder: "Güçlü ama yorgun / Kayıp / Arayan / Saklanan..." },
      { key: "dominant_role", label: "En çok hangi rolde hissediyorsun?", placeholder: "Kurtarıcı / Gözlemci / Savaşçı / Kaçak..." },
      { key: "change_wish", label: "Kendinde değiştirmek istediğin şey", placeholder: "Cesaret / Sınır koyma / Özgüven / Karar verebilme..." },
    ],
  },
  blindspot: {
    entitlement: "person_deep_access",
    cta: "Kör Noktanı Aç",
    color: "#ef4444",
    fields: [
      { key: "feedback", label: "En çok duyduğun eleştiri", placeholder: "Çok hassassın / Mesafelisin / Bencilsin..." },
      { key: "trigger", label: "Seni en çok tetikleyen durum", placeholder: "Reddedilmek / Görmezden gelinmek / Kontrolsüzlük..." },
      { key: "pattern", label: "Farkında olduğun ama değiştiremediğin alışkanlık", placeholder: "Kaçış / Savunma / Suçlama / Kapanma..." },
    ],
  },
  cycle: {
    entitlement: "money_deep_access",
    cta: "Döngüyü Kır",
    color: "#94a3b8",
    fields: [
      { key: "repeating", label: "Hayatında tekrar eden olay", placeholder: "Terk edilme / Başarısızlık / Aynı ilişki kalıbı..." },
      { key: "age_range", label: "Bu döngü ne zaman başladı?", placeholder: "Çocukluk / Ergenlik / 20'li yaşlar..." },
      { key: "awareness", label: "Bu döngüyü fark ettiğin an", placeholder: "Bir olay / Bir kişi / Bir kayıp..." },
    ],
  },
  breakpoint: {
    entitlement: "relationship_deep_access",
    cta: "Kırılma Noktanı Gör",
    color: "#fcd34d",
    fields: [
      { key: "turning_point", label: "Hayatında bir şeyin değiştiğini hissettiğin an", placeholder: "Bir kayıp / Bir karar / Bir farkındalık..." },
      { key: "resistance", label: "Değişime en çok nerede direniyorsun?", placeholder: "Alışkanlıklar / İlişkiler / İnanç sistemi..." },
      { key: "readiness", label: "Neyi bırakmaya hazırsın?", placeholder: "Eski ben / Bir ilişki / Bir korku / Bir hikaye..." },
    ],
  },
};

const LOADING_LINES = [
  "Sanrı seni okuyor…",
  "Katmanlar açılıyor…",
  "Frekansın hesaplanıyor…",
  "Derinlik hazırlanıyor…",
  "Zaten biliyorsun. Sadece hatırlamıyorsun.",
];

const DEEP_LOADING_LINES = [
  "Derinlik açılıyor…",
  "Katmanlar işleniyor…",
  "Sana özel okuma hazırlanıyor…",
  "Bu kişisel. Zaman alabilir…",
];

// ═══════════════ SECTION DEFINITIONS ═══════════════

const SECTION_DEFS: {
  key: string;
  apiKey: string;
  label: string;
  icon: string;
  accentColor: string;
  hookLine: string;
  deepId?: DeepId;
  free: boolean;
}[] = [
  { key: "opening", apiKey: "teaser", label: "Kimlik", icon: "◉", accentColor: ROLE_COLOR, hookLine: "", free: true },
  { key: "iliski", apiKey: "relationship_code", label: "İlişki Kodu", icon: "⊘", accentColor: GLOW_PINK, hookLine: "Yaklaştıkça uzaklaşıyorsun. Neden?", deepId: "relationship", free: false },
  { key: "hafta", apiKey: "weekly_focus", label: "Bu Haftanın Kritik Noktası", icon: "⦿", accentColor: "#a78bfa", hookLine: "Bu hafta bir şey sana geri dönüyor.", deepId: "weekly", free: false },
  { key: "kariyer", apiKey: "career_flow", label: "Kariyer Akışı", icon: "⬡", accentColor: GLOW_CYAN, hookLine: "Seni tutan şey yetenek eksikliği değil.", deepId: "career", free: false },
  { key: "kisi", apiKey: "person_scenario", label: "Hayatındaki Kişi", icon: "✦", accentColor: "#fb923c", hookLine: "Bir kişi var. Sana ayna tutuyor.", deepId: "person", free: false },
  { key: "para", apiKey: "money_pattern", label: "Para & Değer", icon: "◇", accentColor: GLOW_AMBER, hookLine: "Bolluk kanalın bir yerde daralıyor.", deepId: "money", free: false },
  { key: "kor_nokta", apiKey: "blind_spot", label: "Kör Nokta", icon: "◌", accentColor: "#ef4444", hookLine: "Göremediğin bir alan var.", deepId: "blindspot", free: false },
  { key: "dongu", apiKey: "cycle_pattern", label: "Döngü", icon: "↻", accentColor: "#94a3b8", hookLine: "Aynı noktaya dönüyorsun. Bilerek mi?", deepId: "cycle", free: false },
  { key: "kirilma", apiKey: "breaking_point", label: "Kırılma Noktası", icon: "⚡", accentColor: "#fcd34d", hookLine: "Döngüyü kırabilirsin. Ama önce gör.", deepId: "breakpoint", free: false },
  { key: "duygu", apiKey: "_emotion", label: "Duygusal Derinlik", icon: "♡", accentColor: "#e879f9", hookLine: "Hissetmekten kaçtığın şey seni buluyor.", deepId: "emotion", free: false },
  { key: "astro", apiKey: "_astro", label: "Kozmik Harita", icon: "☽", accentColor: "#818cf8", hookLine: "Doğum anın bir mesaj taşıyor.", deepId: "astro", free: false },
  { key: "kimlik", apiKey: "_identity", label: "Benlik Yolculuğu", icon: "◐", accentColor: "#34d399", hookLine: "Maskelerin altındaki sen kim?", deepId: "identity", free: false },
];

function buildSections(api: ApiResult, name: string): SectionData[] {
  const role = api.matrix_role || "";
  const lp = api.life_path_archetype || "";
  const na = api.name_archetype || "";
  const ln = api.life_path ?? 0;

  const teaser = typeof api.teaser === "string" ? api.teaser.trim() : "";
  const openingText = teaser || [
    role && `Çekirdek rolün: ${role}`,
    lp && `Yaşam yolu arketipin: ${lp}`,
    na && `İsim arketipin: ${na}`,
    ln && `Yaşam yolu sayın: ${ln}`,
  ].filter(Boolean).join(". ") + ".";

  const sections: SectionData[] = [
    { key: "opening", label: "Kimlik", icon: "◉", accentColor: ROLE_COLOR, free: true, shortText: openingText },
  ];

  for (const def of SECTION_DEFS) {
    if (def.key === "opening") continue;
    const raw = api[def.apiKey];
    const aiText = typeof raw === "string" && raw.trim().length > 10 ? raw.trim() : "";

    if (!aiText) continue;

    sections.push({
      key: def.key,
      label: def.label,
      icon: def.icon,
      accentColor: def.accentColor,
      hookLine: def.hookLine,
      deepId: def.deepId,
      free: def.free,
      shortText: aiText,
    });
  }

  return sections;
}

// ═══════════════ SUB-COMPONENTS ═══════════════

function LockedTeaser({ section, index }: { section: SectionData; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 80,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  const cut = Math.min(section.shortText.length, 90);
  let preview = section.shortText.slice(0, cut);
  const sp = preview.lastIndexOf(" ");
  if (sp > 40) preview = preview.slice(0, sp);

  return (
    <Animated.View style={[st.lockedCard, { opacity: fadeAnim, borderColor: section.accentColor + "15" }]}>
      <View style={[st.lockedGlow, { backgroundColor: section.accentColor + "06" }]} />
      <View style={st.lockedHeader}>
        <Text style={[st.lockedIcon, { color: section.accentColor + "60" }]}>{section.icon}</Text>
        <Text style={[st.lockedLabel, { color: section.accentColor + "70" }]}>{section.label}</Text>
        <Text style={st.lockBadge}>🔒</Text>
      </View>
      {section.hookLine ? (
        <Text style={[st.lockedHook, { color: section.accentColor + "50" }]}>{section.hookLine}</Text>
      ) : null}
      <Text style={st.lockedPreview} numberOfLines={2}>{preview}…</Text>
      <LinearGradient
        colors={["transparent", BG + "ee", BG]}
        style={st.fadeGradient}
      />
    </Animated.View>
  );
}

function CuriosityBreak({ text }: { text: string }) {
  return (
    <View style={st.curiosityBlock}>
      <View style={st.curiosityLine} />
      <Text style={st.curiosityText}>{text}</Text>
      <View style={st.curiosityLine} />
    </View>
  );
}

function GeneralPaywall({ onBuy, name }: { onBuy: () => void; name: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay: 300, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, delay: 300, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const fn = name.split(" ")[0] || name;

  return (
    <Animated.View style={[st.paywallZone, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <Text style={st.paywallGlyph}>◈</Text>
      <Text style={st.paywallTitle}>
        {`${fn}, buraya kadar gördüğün\nsadece yüzeyin %30'u.`}
      </Text>
      <Text style={st.paywallSub}>
        {"İlişki kodun hazır. Kariyer akışın bekliyor.\nPara kalıbın, kör noktan, döngün — hepsi burada.\n\nAma kapı henüz kapalı."}
      </Text>

      <Pressable style={st.paywallCta} onPress={onBuy}>
        <LinearGradient
          colors={[ROLE_COLOR, "#9333ea"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={st.paywallCtaGradient}
        >
          <Text style={st.paywallCtaGlyph}>◈</Text>
          <View style={st.paywallCtaBody}>
            <Text style={st.paywallCtaTitle}>Tüm Okumaları Aç</Text>
            <Text style={st.paywallCtaSub}>Tüm kısa okumalar açılır. Fiyat Google Play ödeme ekranında.</Text>
          </View>
        </LinearGradient>
      </Pressable>

      <Text style={st.paywallFooter}>Açtığın an tüm katmanlar sana açılır.</Text>
    </Animated.View>
  );
}

const DEEP_ONLY_IDS: DeepId[] = ["emotion", "astro", "identity"];

const DEEP_HOOKS: Record<string, string> = {
  relationship: "Kalıbı gör. Aynayı kır. İlişki haritanı aç.",
  career: "İç sabotajını gör. Gerçek yönünü bul.",
  weekly: "Bu haftanın kritik anını ve fırsat penceresini keşfet.",
  person: "Bu kişiyle arandaki ruhsal kontratı oku.",
  money: "Bolluk blokajını çöz. Para inancını gör.",
  emotion: "Bastırdığın duyguyu bul. Bedensel hafızanı aç.",
  astro: "Doğum frekansın, gölge profilin, kozmik yönün.",
  identity: "Maskeleri çıkar. Çekirdek yaranı gör. Otantik seni bul.",
  blindspot: "Göremediğin alan seni yönetiyor. Onu görünür kıl.",
  cycle: "Aynı döngüye neden giriyorsun? Kökeni bul, kır.",
  breakpoint: "Değişim anını yakala. Kırılma noktanı bilmek güçtür.",
};

function ShortSectionCard({
  section,
  deepConfig,
  hasDeep,
  onDeepCta,
}: {
  section: SectionData;
  deepConfig?: DeepConfig;
  hasDeep: boolean;
  onDeepCta: () => void;
}) {
  const hookText = section.deepId ? DEEP_HOOKS[section.deepId] : "";

  return (
    <View style={[st.sectionCard, { borderColor: section.accentColor + "12" }]}>
      <View style={[st.sectionCardAccent, { backgroundColor: section.accentColor + "08" }]} />
      <View style={st.sectionHeader}>
        <Text style={[st.sectionIcon, { color: section.accentColor }]}>{section.icon}</Text>
        <Text style={[st.sectionLabel, { color: section.accentColor }]}>{section.label}</Text>
      </View>
      <Text style={st.sectionText}>{section.shortText}</Text>

      {deepConfig && !hasDeep && (
        <View style={st.deepCtaZone}>
          <View style={[st.deepCtaDivider, { backgroundColor: deepConfig.color + "15" }]} />
          {hookText ? <Text style={[st.deepCtaHook, { color: deepConfig.color + "70" }]}>{hookText}</Text> : null}
          <Pressable
            style={[st.deepCta, { backgroundColor: deepConfig.color + "12", borderColor: deepConfig.color + "25" }]}
            onPress={onDeepCta}
          >
            <Text style={[st.deepCtaIcon, { color: deepConfig.color }]}>◈</Text>
            <View style={st.deepCtaBody}>
              <Text style={[st.deepCtaTitle, { color: deepConfig.color }]}>Derine İn</Text>
              <Text style={st.deepCtaPrice}>Tek seferlik · kişiye özel</Text>
            </View>
            <Text style={[st.deepCtaArrow, { color: deepConfig.color }]}>›</Text>
          </Pressable>
        </View>
      )}
      {deepConfig && hasDeep && (
        <Pressable
          style={[st.deepUnlockedBtn, { borderColor: deepConfig.color + "25", backgroundColor: deepConfig.color + "08" }]}
          onPress={onDeepCta}
        >
          <Text style={[st.deepUnlockedIcon, { color: deepConfig.color }]}>◈</Text>
          <Text style={[st.deepUnlockedText, { color: deepConfig.color }]}>Derin Okumayı Aç</Text>
          <Text style={[st.deepCtaArrow, { color: deepConfig.color }]}>›</Text>
        </Pressable>
      )}
    </View>
  );
}

function DeepOnlyCard({
  deepId,
  def,
  config,
  hasDeep,
  onPress,
}: {
  deepId: DeepId;
  def: (typeof SECTION_DEFS)[number];
  config: DeepConfig;
  hasDeep: boolean;
  onPress: () => void;
}) {
  const hook = DEEP_HOOKS[deepId] || "";
  return (
    <Pressable
      style={[st.deepOnlyCard, { borderColor: config.color + "20", backgroundColor: config.color + "06" }]}
      onPress={onPress}
    >
      <View style={st.deepOnlyHeader}>
        <Text style={[st.deepOnlyIcon, { color: config.color }]}>{def.icon}</Text>
        <View style={st.deepOnlyHeaderText}>
          <Text style={[st.deepOnlyLabel, { color: config.color }]}>{def.label}</Text>
          {hook ? <Text style={[st.deepOnlyHook, { color: config.color + "70" }]}>{hook}</Text> : null}
        </View>
      </View>
      <View style={[st.deepOnlyCta, { backgroundColor: hasDeep ? config.color + "12" : config.color + "15" }]}>
        <Text style={[st.deepOnlyCtaText, { color: config.color }]}>
          {hasDeep ? "Derin Okumayı Aç" : "Derine İn"}
        </Text>
        <Text style={[st.deepCtaArrow, { color: config.color }]}>›</Text>
      </View>
    </Pressable>
  );
}

function DeepIntakeForm({
  config,
  onSubmit,
  onCancel,
}: {
  config: DeepConfig;
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const update = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));
  const filled = config.fields.every((f) => (values[f.key] || "").trim().length > 0);

  return (
    <View style={st.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={st.scroll} contentContainerStyle={st.pad} showsVerticalScrollIndicator={false}>
        <Text style={[st.formGlyph, { color: config.color }]}>◈</Text>
        <Text style={st.formTitle}>Derine inmek için{"\n"}birkaç şey daha bilmem gerekiyor.</Text>
        <Text style={[st.formSub, { color: config.color + "80" }]}>
          Bu bilgiler okumanı sana özel kılar.
        </Text>

        {config.fields.map((f) => (
          <View key={f.key} style={st.formGroup}>
            <Text style={st.formLabel}>{f.label}</Text>
            <TextInput
              style={[st.formInput, { borderColor: config.color + "15" }]}
              value={values[f.key] || ""}
              onChangeText={(v) => update(f.key, v)}
              placeholder={f.placeholder}
              placeholderTextColor="rgba(255,255,255,0.18)"
              autoCorrect={false}
            />
          </View>
        ))}

        <Pressable
          style={[st.formSubmit, { backgroundColor: filled ? config.color : "rgba(255,255,255,0.06)" }]}
          onPress={() => filled && onSubmit(values)}
          disabled={!filled}
        >
          <Text style={[st.formSubmitText, { color: filled ? BG : "rgba(255,255,255,0.20)" }]}>
            Derin Okumayı Başlat
          </Text>
        </Pressable>

        <Pressable style={st.formCancel} onPress={onCancel}>
          <Text style={st.formCancelText}>Geri dön</Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

type DeepSection = { title: string; body: string };

function DeepResultView({
  deepId,
  deepSections,
  onBack,
}: {
  deepId: DeepId;
  deepSections: DeepSection[];
  onBack: () => void;
}) {
  const config = DEEP_CONFIG[deepId];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <View style={st.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.ScrollView style={[st.scroll, { opacity: fadeAnim }]} contentContainerStyle={st.pad} showsVerticalScrollIndicator={false}>
        <Text style={[st.deepResGlyph, { color: config.color }]}>◈</Text>
        <Text style={st.deepResTitle}>Derin Okuma</Text>
        <View style={[st.deepResBadge, { borderColor: config.color + "30" }]}>
          <Text style={[st.deepResBadgeText, { color: config.color }]}>{config.cta.split("–")[0].trim()}</Text>
        </View>

        {deepSections.map((sec, idx) => (
          <DeepSectionCard key={idx} section={sec} index={idx} color={config.color} />
        ))}

        <View style={st.deepResFooter}>
          <Text style={st.deepResFooterText}>Bu okuma sana özeldir.{"\n"}Tekrar eden kalıplar fark edildikçe çözülür.</Text>
        </View>

        <Pressable style={st.deepResBack} onPress={onBack}>
          <Text style={[st.deepResBackText, { color: config.color }]}>← Okumaya Dön</Text>
        </Pressable>
        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </View>
  );
}

function DeepSectionCard({ section, index, color }: { section: DeepSection; index: number; color: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 120, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={[st.deepSecCard, { opacity: fadeAnim, borderColor: color + "10" }]}>
      <View style={[st.deepSecAccent, { backgroundColor: color + "15" }]} />
      <Text style={[st.deepSecNum, { color: color + "50" }]}>{String(index + 1).padStart(2, "0")}</Text>
      <Text style={[st.deepSecTitle, { color: color }]}>{section.title}</Text>
      <Text style={st.deepSecBody}>{section.body}</Text>
    </Animated.View>
  );
}

// ═══════════════ UTILITIES ═══════════════

function extractErrorMessage(e: any): string {
  if (!e) return "Bilinmeyen hata.";
  if (typeof e === "string") return e;
  if (typeof e?.message === "string") return e.message;
  try { return JSON.stringify(e); } catch { return String(e); }
}

function extractApiError(text: string, fallback: string): string {
  try {
    const j = JSON.parse(text);
    if (typeof j?.detail === "string") return j.detail;
    if (Array.isArray(j?.detail)) return j.detail[0]?.msg || j.detail[0]?.message || fallback;
    if (typeof j?.message === "string") return j.message;
  } catch { /* */ }
  return fallback;
}

// ═══════════════ MAIN SCREEN ═══════════════

export default function DeepReadingScreen() {
  const params = useLocalSearchParams<{ name?: string; dob?: string; lang?: string }>();
  const paramName = (params.name || "").trim();
  const paramDob = (params.dob || "").trim();
  const lang = (params.lang || "tr") as "tr" | "en";

  const needsInput = !paramName;
  const [nameInput, setNameInput] = useState(paramName);
  const [dobInput, setDobInput] = useState(paramDob);
  const [flow, setFlow] = useState<FlowState>(needsInput ? "collect_name" : "loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [sections, setSections] = useState<SectionData[]>([]);
  const [role, setRole] = useState("");
  const [archetype, setArchetype] = useState("");
  const [lifePath, setLifePath] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const [resolvedName, setResolvedName] = useState(paramName);
  const [resolvedDob, setResolvedDob] = useState(paramDob);
  const [activeDeepId, setActiveDeepId] = useState<DeepId | null>(null);
  const [deepSections, setDeepSections] = useState<DeepSection[]>([]);

  const ent = useEntitlementStore((s) => s.status);
  const hasGeneral = ent.general_reading_access;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const resultFade = useRef(new Animated.Value(0)).current;

  // ── Fetch ──

  const fetchReading = useCallback(async (useName: string, useDob: string) => {
    setFlow("loading");
    setErrorMsg("");
    const safeDob = useDob || "01.01.2000";
    if (__DEV__) console.log("[deep_reading] fetch →", { name: useName, dob: safeDob });
    try {
      const res = await fetch(MATRIX_ROL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: useName, birth_date: safeDob }),
      });
      if (res.status === 429) throw new Error("Çok fazla istek. Biraz bekle.");
      if (res.status >= 500) throw new Error("Sanrı şu an ulaşılabilir değil. Biraz sonra tekrar dene.");
      const text = await res.text();
      if (__DEV__) console.log("[deep_reading] status:", res.status, "body:", text.slice(0, 500));
      if (!res.ok) throw new Error(extractApiError(text, "Okuma başlatılamadı."));
      const api: ApiResult = JSON.parse(text);
      if (__DEV__) console.log("[deep_reading] API keys:", Object.keys(api));
      const built = buildSections(api, useName);
      if (__DEV__) built.forEach((s) => console.log(`[section] "${s.key}" free=${s.free} len=${s.shortText.length}`));
      setSections(built);
      setRole(api.matrix_role || "Yolcu");
      setArchetype(api.name_archetype || "");
      setLifePath(String(api.life_path ?? ""));
      setFlow("result");
    } catch (e: any) {
      if (__DEV__) console.log("[deep_reading] error:", e);
      setErrorMsg(extractErrorMessage(e));
      setFlow("error");
    }
  }, []);

  const fetchDeepReading = useCallback(async (deepId: DeepId, formData: Record<string, string>) => {
    setFlow("deep_loading");
    setErrorMsg("");
    const safeDob = resolvedDob || "01.01.2000";
    const payload = { name: resolvedName, birth_date: safeDob, deep_type: deepId, form_data: formData, role, archetype, life_path: lifePath };
    if (__DEV__) console.log("[deep] fetch →", payload);
    try {
      const res = await fetch(MATRIX_DEEP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) throw new Error("Çok fazla istek. Biraz bekle.");
      if (res.status >= 500) throw new Error("Sanrı şu an ulaşılabilir değil. Biraz sonra tekrar dene.");
      const text = await res.text();
      if (__DEV__) console.log("[deep] status:", res.status, "body:", text.slice(0, 500));
      if (!res.ok) throw new Error(extractApiError(text, "Derin okuma başlatılamadı."));
      const result = JSON.parse(text);
      const secs: DeepSection[] = result.sections || [];
      if (secs.length === 0 && result.reading) {
        secs.push({ title: "Derin Okuma", body: result.reading });
      }
      if (secs.length === 0) throw new Error("Okuma içeriği boş döndü.");
      setDeepSections(secs);
      setFlow("deep_result");
    } catch (e: any) {
      if (__DEV__) console.log("[deep] error:", e);
      setErrorMsg(extractErrorMessage(e));
      setFlow("error");
    }
  }, [resolvedName, resolvedDob, role, archetype, lifePath]);

  useEffect(() => {
    if (paramName) fetchReading(paramName, paramDob);
  }, [paramName, paramDob, fetchReading]);

  const onSubmitCollect = () => {
    const n = nameInput.trim();
    const d = dobInput.trim();
    if (!n) return;
    setResolvedName(n);
    setResolvedDob(d);
    fetchReading(n, d);
  };

  // ── Animations ──

  useEffect(() => {
    if (flow !== "loading" && flow !== "deep_loading") return;
    let idx = 0;
    const lines = flow === "deep_loading" ? DEEP_LOADING_LINES : LOADING_LINES;
    const iv = setInterval(() => { idx = (idx + 1) % lines.length; setLoadingLine(idx); }, 2200);
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.25, duration: 1200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
    ])).start();
    return () => { clearInterval(iv); pulseAnim.setValue(1); };
  }, [flow, pulseAnim]);

  useEffect(() => {
    if (flow === "result") {
      resultFade.setValue(0);
      Animated.timing(resultFade, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    }
  }, [flow, resultFade]);

  // ── Handlers ──

  const buyGeneral = () => router.push({ pathname: "/(tabs)/vip", params: { entitlement: "general_reading_access", target: "/(tabs)/deep_reading" } } as any);
  const openDeepForm = (d: DeepId) => {
    const cfg = DEEP_CONFIG[d];
    if (!cfg) return;
    const hasDeep = Boolean(ent[cfg.entitlement]);
    if (!hasDeep) {
      router.push({ pathname: "/(tabs)/vip", params: { entitlement: cfg.entitlement, target: "/(tabs)/deep_reading" } } as any);
      return;
    }
    setActiveDeepId(d);
    setFlow("deep_form");
  };
  const onDeepFormSubmit = (d: DeepId, data: Record<string, string>) => { setActiveDeepId(d); fetchDeepReading(d, data); };
  const onDeepFormCancel = () => { setFlow("result"); setActiveDeepId(null); };
  const onDeepResultBack = () => { setFlow("result"); setActiveDeepId(null); setDeepSections([]); };

  // ═══════════════ COLLECT ═══════════════

  if (flow === "collect_name") {
    const canSubmit = nameInput.trim().length > 0 && dobInput.trim().length > 0;
    return (
      <View style={[st.screen, st.center, { paddingHorizontal: 32 }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Animated.Text style={[st.collectGlyph, { opacity: pulseAnim }]}>◈</Animated.Text>
        <Text style={st.collectTitle}>
          {lang === "tr" ? "Devam edebilmem için\nseni biraz daha tanımam gerekiyor." : "To go deeper,\nI need to know you a little more."}
        </Text>
        <TextInput style={st.collectInput} value={nameInput} onChangeText={setNameInput} placeholder={lang === "tr" ? "Ad Soyad" : "Full Name"} placeholderTextColor="rgba(255,255,255,0.22)" autoCapitalize="words" autoCorrect={false} returnKeyType="next" />
        <TextInput style={st.collectInput} value={dobInput} onChangeText={setDobInput} placeholder={lang === "tr" ? "Doğum Tarihi (GG.AA.YYYY)" : "Birth Date (DD.MM.YYYY)"} placeholderTextColor="rgba(255,255,255,0.22)" keyboardType="numeric" autoCorrect={false} onSubmitEditing={onSubmitCollect} returnKeyType="go" />
        <Pressable style={[st.collectBtn, !canSubmit && { opacity: 0.35 }]} onPress={onSubmitCollect} disabled={!canSubmit}>
          <Text style={st.collectBtnText}>{lang === "tr" ? "Derine İn" : "Go Deeper"}</Text>
        </Pressable>
      </View>
    );
  }

  // ═══════════════ LOADING ═══════════════

  if (flow === "loading" || flow === "deep_loading") {
    const lines = flow === "deep_loading" ? DEEP_LOADING_LINES : LOADING_LINES;
    return (
      <View style={[st.screen, st.center]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Animated.Text style={[st.loadGlyph, { opacity: pulseAnim }]}>◈</Animated.Text>
        <ActivityIndicator color={ROLE_COLOR} style={{ marginTop: 24 }} />
        <Text style={st.loadText}>{lines[loadingLine % lines.length]}</Text>
      </View>
    );
  }

  // ═══════════════ ERROR ═══════════════

  if (flow === "error") {
    return (
      <View style={[st.screen, st.center, { paddingHorizontal: 32 }]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Text style={st.errorGlyph}>⚠</Text>
        <Text style={st.errorTitle}>Bir şeyler ters gitti</Text>
        <Text style={st.errorText}>{errorMsg}</Text>
        <Pressable style={st.retryBtn} onPress={() => fetchReading(resolvedName, resolvedDob)}>
          <Text style={st.retryText}>Tekrar Dene</Text>
        </Pressable>
        {sections.length > 0 && (
          <Pressable style={st.backLink} onPress={() => setFlow("result")}>
            <Text style={st.backLinkText}>← Sonuçlara dön</Text>
          </Pressable>
        )}
      </View>
    );
  }

  // ═══════════════ DEEP FORM ═══════════════

  if (flow === "deep_form" && activeDeepId) {
    return <DeepIntakeForm config={DEEP_CONFIG[activeDeepId]} onSubmit={(data) => onDeepFormSubmit(activeDeepId, data)} onCancel={onDeepFormCancel} />;
  }

  // ═══════════════ DEEP RESULT ═══════════════

  if (flow === "deep_result" && activeDeepId && deepSections.length > 0) {
    return <DeepResultView deepId={activeDeepId} deepSections={deepSections} onBack={onDeepResultBack} />;
  }

  // ═══════════════ RESULT ═══════════════

  const freeSections = sections.filter((s) => s.free);
  const paidSections = sections.filter((s) => !s.free);

  return (
    <View style={st.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.ScrollView style={[st.scroll, { opacity: resultFade }]} contentContainerStyle={st.pad} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={st.resultHeader}>
          <View style={{ flex: 1 }}>
            <Text style={st.resultName}>{resolvedName || "Yolcu"}</Text>
            <Text style={st.resultSub}>Sanrı seni okudu. İşte gördükleri.</Text>
          </View>
          <View style={st.roleBadge}>
            <Text style={st.roleText}>{role}</Text>
          </View>
        </View>

        {/* Free sections */}
        {freeSections.map((sec) => (
          <View key={sec.key} style={[st.sectionCard, { borderColor: sec.accentColor + "12" }]}>
            <View style={st.sectionHeader}>
              <Text style={[st.sectionIcon, { color: sec.accentColor }]}>{sec.icon}</Text>
              <Text style={[st.sectionLabel, { color: sec.accentColor }]}>{sec.label}</Text>
            </View>
            <Text style={st.sectionText}>{sec.shortText}</Text>
          </View>
        ))}

        {/* LOCKED FUNNEL */}
        {!hasGeneral && paidSections.length > 0 && (
          <>
            <CuriosityBreak text="Gördüğün sadece yüzeyin %30'u." />

            {paidSections.slice(0, 3).map((sec, i) => (
              <LockedTeaser key={sec.key} section={sec} index={i} />
            ))}

            <View style={st.breatherBlock}>
              <Text style={st.breatherText}>{"Hissediyor musun?\nDevamı var. Ve sana ait."}</Text>
            </View>

            {paidSections.slice(3, 6).map((sec, i) => (
              <LockedTeaser key={sec.key} section={sec} index={i + 3} />
            ))}

            <View style={st.breatherBlock}>
              <Text style={st.breatherText}>{"Kör noktan, döngün, kırılma anın…\nHepsi hazır. Sadece bir kapı var."}</Text>
            </View>

            {paidSections.slice(6).map((sec, i) => (
              <LockedTeaser key={sec.key} section={sec} index={i + 6} />
            ))}

            <GeneralPaywall onBuy={buyGeneral} name={resolvedName} />
          </>
        )}

        {/* UNLOCKED SECTIONS */}
        {hasGeneral && paidSections.map((sec) => {
          const cfg = sec.deepId ? DEEP_CONFIG[sec.deepId] : undefined;
          const hasDeep = sec.deepId ? Boolean(ent[DEEP_CONFIG[sec.deepId].entitlement]) : false;
          return <ShortSectionCard key={sec.key} section={sec} deepConfig={cfg} hasDeep={hasDeep} onDeepCta={() => sec.deepId && openDeepForm(sec.deepId)} />;
        })}

        {/* DEEP-ONLY PRODUCTS */}
        {hasGeneral && DEEP_ONLY_IDS.map((did) => {
          const cfg = DEEP_CONFIG[did];
          const def = SECTION_DEFS.find((d) => d.deepId === did);
          if (!def) return null;
          const hasDeep = Boolean(ent[cfg.entitlement]);
          return (
            <DeepOnlyCard
              key={did}
              deepId={did}
              def={def}
              config={cfg}
              hasDeep={hasDeep}
              onPress={() => openDeepForm(did)}
            />
          );
        })}

        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ═══════════════ STYLES ═══════════════

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  pad: { padding: 20, paddingTop: SAFE_TOP + 12, paddingBottom: 80 },
  center: { alignItems: "center", justifyContent: "center" },

  // Collect
  collectGlyph: { color: ROLE_COLOR, fontSize: 52, marginBottom: 24 },
  collectTitle: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", lineHeight: 32, marginBottom: 32 },
  collectInput: {
    width: "100%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18,
    paddingHorizontal: 20, paddingVertical: 18, color: "#fff", fontSize: 16,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.06)", marginBottom: 14,
  },
  collectBtn: { width: "100%", borderRadius: 22, paddingVertical: 18, alignItems: "center" as const, backgroundColor: ROLE_COLOR, marginTop: 4 },
  collectBtnText: { color: BG, fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },

  // Loading
  loadGlyph: { color: ROLE_COLOR, fontSize: 64, textAlign: "center" },
  loadText: { color: "rgba(255,255,255,0.55)", fontSize: 15, marginTop: 24, textAlign: "center", fontWeight: "600", fontStyle: "italic" },

  // Error
  errorGlyph: { fontSize: 48, marginBottom: 16, opacity: 0.4 },
  errorTitle: { color: "#ef4444", fontSize: 18, fontWeight: "900", marginBottom: 8 },
  errorText: { color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 20, textAlign: "center", marginBottom: 28 },
  retryBtn: { borderRadius: 22, paddingVertical: 16, paddingHorizontal: 40, backgroundColor: ROLE_COLOR },
  retryText: { color: BG, fontSize: 15, fontWeight: "900" },
  backLink: { marginTop: 18, paddingVertical: 10 },
  backLinkText: { color: "rgba(255,255,255,0.40)", fontSize: 13, fontWeight: "700" },

  // Result header
  resultHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28, gap: 12 },
  resultName: { color: "#fff", fontSize: 24, fontWeight: "900" },
  resultSub: { color: "rgba(255,255,255,0.30)", fontSize: 12, fontWeight: "600", marginTop: 4, fontStyle: "italic" },
  roleBadge: { backgroundColor: `${ROLE_COLOR}12`, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: `${ROLE_COLOR}25` },
  roleText: { color: ROLE_COLOR, fontSize: 13, fontWeight: "900" },

  // Section card (free / unlocked)
  sectionCard: { borderRadius: 22, padding: 20, marginBottom: 14, backgroundColor: CARD_BG, borderWidth: 1 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  sectionIcon: { fontSize: 17, opacity: 0.8 },
  sectionLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  sectionText: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 24 },

  // Section card accent
  sectionCardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 22, borderTopRightRadius: 22 },

  // Deep CTA zone
  deepCtaZone: { marginTop: 16 },
  deepCtaDivider: { height: 1, marginBottom: 14 },
  deepCtaHook: { fontSize: 12, fontWeight: "700", fontStyle: "italic", lineHeight: 18, marginBottom: 12 },
  deepCta: { flexDirection: "row", alignItems: "center", borderRadius: 18, paddingVertical: 16, paddingHorizontal: 16, borderWidth: 1, gap: 12 },
  deepCtaIcon: { fontSize: 20, width: 28, textAlign: "center" },
  deepCtaBody: { flex: 1 },
  deepCtaTitle: { fontSize: 15, fontWeight: "900" },
  deepCtaPrice: { color: "rgba(255,255,255,0.30)", fontSize: 11, fontWeight: "700", marginTop: 2 },
  deepCtaArrow: { fontSize: 24, fontWeight: "900" },

  // Deep unlocked
  deepUnlockedBtn: { flexDirection: "row", alignItems: "center", marginTop: 16, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, gap: 12 },
  deepUnlockedIcon: { fontSize: 18, width: 28, textAlign: "center" },
  deepUnlockedText: { flex: 1, fontSize: 14, fontWeight: "800" },

  // Deep-only product card
  deepOnlyCard: { borderRadius: 22, borderWidth: 1, padding: 20, marginBottom: 16, overflow: "hidden" },
  deepOnlyHeader: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 16 },
  deepOnlyIcon: { fontSize: 24, width: 32, textAlign: "center", marginTop: 2 },
  deepOnlyHeaderText: { flex: 1 },
  deepOnlyLabel: { fontSize: 16, fontWeight: "900", marginBottom: 4 },
  deepOnlyHook: { fontSize: 12, fontWeight: "700", fontStyle: "italic", lineHeight: 18 },
  deepOnlyCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, paddingVertical: 14, gap: 8 },
  deepOnlyCtaText: { fontSize: 14, fontWeight: "900" },

  // Locked card
  lockedCard: {
    borderRadius: 22, padding: 20, marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.015)", borderWidth: 1,
    overflow: "hidden", minHeight: 100,
  },
  lockedGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 3, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  lockedHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  lockedIcon: { fontSize: 17 },
  lockedLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase", flex: 1 },
  lockBadge: { fontSize: 12, opacity: 0.35 },
  lockedHook: { fontSize: 13, fontWeight: "700", fontStyle: "italic", marginBottom: 8, lineHeight: 19 },
  lockedPreview: { color: "rgba(255,255,255,0.10)", fontSize: 14, lineHeight: 22 },
  fadeGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60 },

  // Curiosity break
  curiosityBlock: { flexDirection: "row", alignItems: "center", gap: 14, marginVertical: 24, paddingHorizontal: 8 },
  curiosityLine: { flex: 1, height: 1, backgroundColor: `${ROLE_COLOR}18` },
  curiosityText: { color: ROLE_COLOR, fontSize: 13, fontWeight: "800", letterSpacing: 0.5, textAlign: "center" },

  // Breather block
  breatherBlock: { marginVertical: 20, paddingHorizontal: 16 },
  breatherText: { color: "rgba(255,255,255,0.25)", fontSize: 14, lineHeight: 23, textAlign: "center", fontStyle: "italic" },

  // Paywall
  paywallZone: { marginTop: 28, marginBottom: 16, alignItems: "center" },
  paywallGlyph: { color: ROLE_COLOR, fontSize: 40, marginBottom: 16, opacity: 0.6 },
  paywallTitle: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", lineHeight: 32, marginBottom: 12 },
  paywallSub: { color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 22, textAlign: "center", marginBottom: 32 },
  paywallCta: { width: "100%", borderRadius: 24, overflow: "hidden", marginBottom: 12 },
  paywallCtaGradient: { flexDirection: "row", alignItems: "center", paddingVertical: 22, paddingHorizontal: 22, gap: 14 },
  paywallCtaGlyph: { color: "#fff", fontSize: 28, width: 34, textAlign: "center" },
  paywallCtaBody: { flex: 1 },
  paywallCtaTitle: { color: "#fff", fontSize: 19, fontWeight: "900", marginBottom: 3 },
  paywallCtaSub: { color: "rgba(255,255,255,0.60)", fontSize: 12, fontWeight: "600" },
  paywallFooter: { color: "rgba(255,255,255,0.18)", fontSize: 11, fontWeight: "600", marginTop: 8, textAlign: "center" },

  // Deep intake form
  formGlyph: { fontSize: 44, textAlign: "center", marginBottom: 16, opacity: 0.5 },
  formTitle: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", lineHeight: 30, marginBottom: 8 },
  formSub: { fontSize: 13, textAlign: "center", marginBottom: 28 },
  formGroup: { marginBottom: 18 },
  formLabel: { color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: "800", letterSpacing: 0.5, marginBottom: 6 },
  formInput: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 18, paddingHorizontal: 18, paddingVertical: 16, color: "#fff", fontSize: 15, borderWidth: 1 },
  formSubmit: { borderRadius: 22, paddingVertical: 18, alignItems: "center", marginTop: 10 },
  formSubmitText: { fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },
  formCancel: { alignItems: "center", paddingVertical: 16, marginTop: 8 },
  formCancelText: { color: "rgba(255,255,255,0.25)", fontSize: 13, fontWeight: "700" },

  // Deep result
  deepResGlyph: { fontSize: 44, textAlign: "center", marginBottom: 14, opacity: 0.5 },
  deepResTitle: { color: "#fff", fontSize: 24, fontWeight: "900", textAlign: "center", marginBottom: 14 },
  deepResBadge: { alignSelf: "center", borderRadius: 14, paddingVertical: 10, paddingHorizontal: 18, borderWidth: 1, backgroundColor: "rgba(255,255,255,0.02)", marginBottom: 28 },
  deepResBadgeText: { fontSize: 13, fontWeight: "800" },
  deepResFooter: { marginTop: 12, marginBottom: 8, paddingHorizontal: 12 },
  deepResFooterText: { color: "rgba(255,255,255,0.18)", fontSize: 12, lineHeight: 20, textAlign: "center", fontStyle: "italic" },
  deepResBack: { alignItems: "center", paddingVertical: 18 },
  deepResBackText: { fontSize: 14, fontWeight: "800" },

  // Deep section card (journey)
  deepSecCard: { borderRadius: 22, padding: 22, marginBottom: 16, backgroundColor: CARD_BG, borderWidth: 1, overflow: "hidden" },
  deepSecAccent: { position: "absolute", top: 0, left: 0, width: 4, bottom: 0 },
  deepSecNum: { fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },
  deepSecTitle: { fontSize: 16, fontWeight: "900", marginBottom: 10 },
  deepSecBody: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 25 },
});
