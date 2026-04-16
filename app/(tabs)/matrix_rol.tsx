import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { MATRIX_ROL_URL } from "../../lib/ankodData";
import { storageGet, storageSet } from "../../lib/storage";
import { useEntitlementStore } from "../../lib/entitlementStore";

const ACCENT = "#7cf7d8";
const ROLE_COLOR = "#c084fc";
const VIP_COLOR = "#7cf7d8";
const CODE_COLOR = "#eab308";
const BG = "#0a0b10";
const CACHE_KEY = "matrix_rol_last_reading";

type FlowState = "form" | "loading" | "result" | "error";

type ApiResult = {
  matrix_role?: string;
  life_path?: number;
  life_path_archetype?: string;
  name_archetype?: string;
  teaser?: string;
  [key: string]: unknown;
};

type NarrativeSections = {
  opening: string;
  ana_tema: string;
  derin_iliski: string;
  derin_para: string;
  derin_icsel: string;
  derin_davranis: string;
  kor_nokta: string;
  dongu: string;
  kirilma: string;
  sanri_imza: string;
};

type SectionDef = {
  key: keyof NarrativeSections;
  label: string;
  icon: string;
  category: "free" | "identity" | "relationships" | "money" | "lifepath";
};

const SECTION_DEFS: SectionDef[] = [
  { key: "opening", label: "Kimlik", icon: "◉", category: "free" },
  { key: "ana_tema", label: "Frekans İmzan", icon: "◎", category: "free" },
  { key: "derin_davranis", label: "Davranış Kalıbı", icon: "⟐", category: "identity" },
  { key: "derin_iliski", label: "İlişki Kodu", icon: "⊘", category: "relationships" },
  { key: "derin_para", label: "Para & Değer", icon: "◇", category: "money" },
  { key: "derin_icsel", label: "İçsel Yapı", icon: "△", category: "lifepath" },
  { key: "kor_nokta", label: "Kör Nokta", icon: "◌", category: "lifepath" },
  { key: "dongu", label: "Döngü", icon: "↻", category: "lifepath" },
  { key: "kirilma", label: "Kırılma Noktası", icon: "⚡", category: "lifepath" },
  { key: "sanri_imza", label: "SANRI İmzası", icon: "✦", category: "lifepath" },
];

const FREE_KEYS = new Set<string>(["opening", "ana_tema"]);

const LOADING_LINES = [
  "Sanrı seni okuyor…",
  "İsmin çözülüyor…",
  "Doğum frekansın hesaplanıyor…",
  "Katmanlar açılıyor…",
  "Zaten biliyorsun. Sadece hatırlamıyorsun.",
];

// ─── Deterministic variant selection ───

function hashStr(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pickVariant(variants: string[], seed: number, offset = 0): string {
  return variants[Math.abs(seed + offset) % variants.length] || variants[0];
}

const ILISKI_VARIANTS = [
  "İlişki alanın, yakınlığa olan ihtiyacınla mesafe koyma refleksinin arasında salınıyor. Birine çekildiğinde aslında kendi içindeki bir parçayı tanımaya çalışıyorsun.",
  "İlişkilerde tekrar eden sahne: yakınlaştıkça uzaklaşma dürtüsü. Bu bir zayıflık değil, bilinçaltının seni koruma mekanizması. Ama artık farkında olma zamanı.",
  "Sınırların belirsiz olduğu yerde ilişki değil, yansıma var. Karşındaki sana aynı şeyi göstermeye devam edecek — ta ki kendi sınırını çizene kadar.",
];
const PARA_VARIANTS = [
  "Para ile ilişkin aslında değer ile ilişkin. Ne kadar hak ettiğini sorguladığın her an, bolluk kanalını daraltıyorsun.",
  "Maddi alandaki gerilim, güvenlik ihtiyacınla özgürlük arzunun çatışmasından doğuyor. Biri sabitlik isterken diğeri uçmak istiyor.",
  "Para senin için bir sonuç değil, bir ayna. Harcama biçimin, neye değer verdiğini sessizce anlatıyor.",
];
const ICSEL_VARIANTS = [
  "İçsel yapın katmanlı ve derin. Yüzeyde sakin görünürsün ama altında sürekli bir hesaplama var. Bu seni güçlü kılıyor — ama aynı zamanda yoruyor.",
  "Kendini tanıma biçimin, başkalarını gözlemlemekten geçiyor. Ama ayna her zaman dışarıda değil — bazen içeri bakmak cesaret ister.",
  "İçsel dünyanda bir gerilim var: kontrol etme ihtiyacı ile akışa bırakma arzusu. İkisi de senin, ikisi de geçerli.",
];
const DAVRANIS_VARIANTS = [
  "Davranış kalıbın tekrar ediyor ama sen bunu 'tercih' sanıyorsun. Aslında otopilotsun. Farkındalık burada başlıyor.",
  "Zorlandığında ilk refleksin kaçmak — fiziksel değil, zihinsel. Düşünceye sığınıyorsun. Ama bazı şeyler hissedilerek çözülür.",
  "Rutin içinde kaybolma eğilimin var. Rutin seni korur ama aynı zamanda büyümeni sınırlar. Kırılma noktası, rutinin dışına adım attığın an.",
];
const KOR_VARIANTS = [
  "Göremediğin alan: başkalarının seni nasıl gördüğü ile senin kendini nasıl gördüğün arasındaki uçurum. Bu boşluk, en büyük büyüme alanın.",
  "Kör noktan, kendine olan inancınla dış dünyanın sana verdiği geri bildirim arasında. Birini seçmek zorunda değilsin — ikisini de tutabilirsin.",
];

function buildNarrative(api: ApiResult, fullName: string, birthDate: string): NarrativeSections {
  const role = api.matrix_role || "Yolcu";
  const lifePath = api.life_path_archetype || "";
  const nameArch = api.name_archetype || "";
  const seed = hashStr(`${fullName}|${birthDate}|${role}`);

  return {
    opening: `${fullName} — bu bir analiz değil.\nSana zaten bildiğin şeyi hatırlatıyor.\n\nHayatında tekrar eden şeyler rastgele değil. Bir kalıbın var. Ve o kalıp, seni buraya getirdi.`,
    ana_tema: `Matrix'teki rolün: ${role}.\n${lifePath ? `Yaşam yolu arketipin: ${lifePath}. ` : ""}${nameArch ? `İsim arketipin: ${nameArch}. ` : ""}\nBu kombinasyon senin frekans imzan. Seni tanımlayan değil — seni hatırlatan.`,
    derin_iliski: pickVariant(ILISKI_VARIANTS, seed, 1),
    derin_para: pickVariant(PARA_VARIANTS, seed, 2),
    derin_icsel: pickVariant(ICSEL_VARIANTS, seed, 3),
    derin_davranis: pickVariant(DAVRANIS_VARIANTS, seed, 4),
    kor_nokta: pickVariant(KOR_VARIANTS, seed, 5),
    dongu: "Bu döngü bilinçli değil.\nBu bir tekrar programı.\nHer seferinde aynı noktaya dönüyorsun — çünkü görmemen gereken bir şey var.",
    kirilma: "Bu döngüyü kırabilirsin.\nAma önce görmen gerekiyor.\nKırılma noktası, döngüyü fark ettiğin an başlar.",
    sanri_imza: "Buraya kadar geldiysen…\nzaten çağrıldın.\n\nSanrı seni gördü. Şimdi sen de gör.",
  };
}

// ─── Locked Section Card (blurred preview) ───

function LockedSectionCard({ def, previewText }: { def: SectionDef; previewText: string }) {
  const preview = previewText.slice(0, 60);

  return (
    <View style={st.lockedCard}>
      <View style={st.lockedHeader}>
        <Text style={st.lockedIcon}>{def.icon}</Text>
        <Text style={st.lockedLabel}>{def.label}</Text>
        <View style={st.lockBadge}>
          <Text style={st.lockBadgeText}>🔒</Text>
        </View>
      </View>
      <Text style={st.lockedPreview} numberOfLines={2}>
        {preview}…
      </Text>
      <View style={st.blurOverlay} />
    </View>
  );
}

// ─── Inline Paywall ───

function InlinePaywall({ onNavigate }: { onNavigate: (entitlement: string) => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[st.paywallZone, { opacity: fadeAnim }]}>
      <Text style={st.paywallHook}>Devamını görmek ister misin?</Text>
      <Text style={st.paywallSub}>
        Rolünü gördün. Ama asıl hikaye burada başlıyor.{"\n"}
        İlişki kodun, para kalıbın, kör noktan — hepsi hazır.
      </Text>

      {/* Role Reading — primary */}
      <Pressable style={[st.paywallCard, { borderColor: `${ROLE_COLOR}30` }]} onPress={() => onNavigate("role_access")}>
        <Text style={[st.paywallCardGlyph, { color: ROLE_COLOR }]}>◈</Text>
        <View style={st.paywallCardBody}>
          <Text style={[st.paywallCardTitle, { color: ROLE_COLOR }]}>Rol Okuma</Text>
          <Text style={st.paywallCardDesc}>Kişilik, kör nokta, döngü, ilişki & para analizi</Text>
        </View>
        <View style={[st.paywallCta, { backgroundColor: ROLE_COLOR }]}>
          <Text style={st.paywallCtaText}>Rolünü Aç</Text>
        </View>
      </Pressable>

      {/* VIP */}
      <Pressable style={[st.paywallCard, { borderColor: `${VIP_COLOR}20` }]} onPress={() => onNavigate("vip_access")}>
        <Text style={[st.paywallCardGlyph, { color: VIP_COLOR }]}>☽</Text>
        <View style={st.paywallCardBody}>
          <Text style={[st.paywallCardTitle, { color: VIP_COLOR }]}>VIP Erişim</Text>
          <Text style={st.paywallCardDesc}>Haftalık akış, günlük yönlendirme, tam deneyim</Text>
        </View>
        <View style={[st.paywallCta, { backgroundColor: VIP_COLOR }]}>
          <Text style={st.paywallCtaText}>VIP'e Geç</Text>
        </View>
      </Pressable>

      {/* Code Training */}
      <Pressable style={[st.paywallCard, { borderColor: `${CODE_COLOR}20` }]} onPress={() => onNavigate("code_training_access")}>
        <Text style={[st.paywallCardGlyph, { color: CODE_COLOR }]}>⌬</Text>
        <View style={st.paywallCardBody}>
          <Text style={[st.paywallCardTitle, { color: CODE_COLOR }]}>Kod Eğitimi</Text>
          <Text style={st.paywallCardDesc}>Sistemi okumayı öğren, kodları çöz</Text>
        </View>
        <View style={[st.paywallCta, { backgroundColor: CODE_COLOR }]}>
          <Text style={st.paywallCtaText}>Eğitimi Aç</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ───

export default function MatrixRolScreen() {
  const { user } = useAuth();

  const [flow, setFlow] = useState<FlowState>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [narrative, setNarrative] = useState<NarrativeSections | null>(null);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const [hasCached, setHasCached] = useState(false);

  const entitlements = useEntitlementStore((s) => s.status);
  const hasRole = entitlements.role_access;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const resultFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (__DEV__) {
      console.log("vip:", entitlements.vip_access);
      console.log("role:", entitlements.role_access);
      console.log("code:", entitlements.code_training_access);
    }
    (async () => {
      try {
        const raw = await storageGet(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.apiData && parsed?.fullName) setHasCached(true);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  useEffect(() => {
    if (flow === "result") {
      resultFade.setValue(0);
      Animated.timing(resultFade, { toValue: 1, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    }
  }, [flow, resultFade]);

  useEffect(() => {
    if (flow !== "loading") return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 2000);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    return () => { clearInterval(interval); pulseAnim.setValue(1); };
  }, [flow, pulseAnim]);

  const submit = useCallback(async () => {
    const fn = firstName.trim();
    if (!fn) { setErrorMsg("Lütfen adını gir."); return; }
    if (!birthDate.trim()) { setErrorMsg("Lütfen doğum tarihini gir."); return; }

    const name = lastName.trim() ? `${fn} ${lastName.trim()}` : fn;
    setFullName(name);
    setErrorMsg("");
    setFlow("loading");

    try {
      const res = await fetch(MATRIX_ROL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth_date: birthDate.trim() }),
      });

      if (res.status === 429) throw new Error("Çok fazla istek. Biraz bekle.");
      if (res.status >= 500) throw new Error("Sunucu hatası. Sonra tekrar dene.");
      if (!res.ok) throw new Error("İstek başarısız oldu.");

      const text = await res.text();
      const api: ApiResult = JSON.parse(text);

      const sections = buildNarrative(api, name, birthDate.trim());
      setNarrative(sections);
      setRole(api.matrix_role || "Yolcu");

      await storageSet(CACHE_KEY, JSON.stringify({
        apiData: api,
        fullName: name,
        birthDate: birthDate.trim(),
        savedAt: Date.now(),
      }));
      setHasCached(true);
      setFlow("result");
    } catch (e: any) {
      setErrorMsg(e?.message || "Okuma tamamlanamadı.");
      setFlow("error");
    }
  }, [firstName, lastName, birthDate]);

  const loadCached = useCallback(async () => {
    try {
      const raw = await storageGet(CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.apiData || !parsed?.fullName) return;

      const sections = buildNarrative(parsed.apiData, parsed.fullName, parsed.birthDate || "");
      setNarrative(sections);
      setRole(parsed.apiData.matrix_role || "Yolcu");
      setFullName(parsed.fullName);
      setFlow("result");
    } catch { /* ignore */ }
  }, []);

  const goPaywall = (entitlement: string) => {
    router.push({
      pathname: "/(tabs)/vip",
      params: { entitlement, target: "/(tabs)/matrix_rol" },
    } as any);
  };

  // ═══════════════ FORM ═══════════════
  if (flow === "form" || flow === "error") {
    return (
      <View style={st.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={st.scroll} contentContainerStyle={st.pad} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={st.back}>← Geri</Text>
          </Pressable>

          <Text style={st.formGlyph}>◈</Text>
          <Text style={st.formEyebrow}>MATRIX ROL OKUMA</Text>
          <Text style={st.formTitle}>Sen aslında kim{"\n"}olduğunu biliyor musun?</Text>
          <Text style={st.formHook}>
            Hayatında tekrar eden şeyler rastgele değil.{"\n"}
            Bir rolün var. Bu alan onu hatırlatır.
          </Text>

          <View style={st.formGroup}>
            <Text style={st.label}>Ad *</Text>
            <TextInput
              style={st.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Adın"
              placeholderTextColor="rgba(255,255,255,0.25)"
            />
          </View>

          <View style={st.formGroup}>
            <Text style={st.label}>Soyad</Text>
            <TextInput
              style={st.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadın (opsiyonel)"
              placeholderTextColor="rgba(255,255,255,0.25)"
            />
          </View>

          <View style={st.formGroup}>
            <Text style={st.label}>Doğum Tarihi *</Text>
            <TextInput
              style={st.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(255,255,255,0.25)"
              keyboardType="default"
            />
          </View>

          {(errorMsg || flow === "error") && (
            <View style={st.errorBanner}>
              <Text style={st.errorTitle}>Sonuç gösterilemedi</Text>
              <Text style={st.errorText}>{errorMsg}</Text>
            </View>
          )}

          <Pressable style={st.submitBtn} onPress={submit}>
            <Text style={st.submitText}>Rolünü Gör</Text>
          </Pressable>

          {hasCached && (
            <Pressable style={st.cachedBtn} onPress={loadCached}>
              <Text style={st.cachedText}>Son okumana dön</Text>
            </Pressable>
          )}

          <Text style={st.formDisclaimer}>
            Ücretsiz. Kısa bir önizleme alacaksın.
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ═══════════════ LOADING ═══════════════
  if (flow === "loading") {
    return (
      <View style={[st.screen, st.center]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Animated.Text style={[st.loadGlyph, { opacity: pulseAnim }]}>◈</Animated.Text>
        <ActivityIndicator color={ROLE_COLOR} style={{ marginTop: 20 }} />
        <Text style={st.loadText}>{LOADING_LINES[loadingLine]}</Text>
        <Text style={st.loadSub}>Bu birkaç saniye sürebilir</Text>
      </View>
    );
  }

  // ═══════════════ RESULT (FUNNEL) ═══════════════
  return (
    <View style={st.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.ScrollView
        style={[st.scroll, { opacity: resultFade }]}
        contentContainerStyle={st.pad}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => setFlow("form")} hitSlop={12}>
          <Text style={st.back}>← Yeni Okuma</Text>
        </Pressable>

        {/* ── Header ── */}
        <View style={st.resultHeader}>
          <View>
            <Text style={st.resultName}>{fullName}</Text>
            <Text style={st.resultSub}>Matrix Rol Okuma sonucun hazır</Text>
          </View>
          <View style={st.roleBadge}>
            <Text style={st.roleText}>{role}</Text>
          </View>
        </View>

        {/* ── FREE sections (visible) ── */}
        {narrative && SECTION_DEFS.filter((d) => FREE_KEYS.has(d.key)).map((def) => {
          const text = narrative[def.key];
          if (!text) return null;
          return (
            <View key={def.key} style={st.sectionCard}>
              <View style={st.sectionHeader}>
                <Text style={st.sectionIcon}>{def.icon}</Text>
                <Text style={st.sectionLabel}>{def.label}</Text>
              </View>
              <Text style={st.sectionText}>{text}</Text>
            </View>
          );
        })}

        {/* ── Curiosity gap ── */}
        {!hasRole && (
          <View style={st.curiosityGap}>
            <View style={st.curiosityLine} />
            <Text style={st.curiosityText}>Bu sadece %30'u.</Text>
            <View style={st.curiosityLine} />
          </View>
        )}

        {/* ── LOCKED sections (blurred preview) — only for non-owners ── */}
        {!hasRole && narrative && SECTION_DEFS.filter((d) => !FREE_KEYS.has(d.key)).map((def) => {
          const text = narrative[def.key];
          if (!text) return null;
          return <LockedSectionCard key={def.key} def={def} previewText={text} />;
        })}

        {/* ── UNLOCKED sections — for owners ── */}
        {hasRole && narrative && SECTION_DEFS.filter((d) => !FREE_KEYS.has(d.key)).map((def) => {
          const text = narrative[def.key];
          if (!text) return null;
          return (
            <View key={def.key} style={st.sectionCard}>
              <View style={st.sectionHeader}>
                <Text style={st.sectionIcon}>{def.icon}</Text>
                <Text style={st.sectionLabel}>{def.label}</Text>
              </View>
              <Text style={st.sectionText}>{text}</Text>
            </View>
          );
        })}

        {/* ── Inline Paywall ── */}
        {!hasRole && <InlinePaywall onNavigate={goPaywall} />}

        {/* ── Bottom actions ── */}
        <Pressable style={st.newReadingBtn} onPress={() => setFlow("form")}>
          <Text style={st.newReadingText}>Yeni Okuma Yap</Text>
        </Pressable>

        <Pressable style={st.secondaryBtn} onPress={() => router.back()}>
          <Text style={st.secondaryText}>Geri dön</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ═══════════════ STYLES ═══════════════

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  pad: { padding: 20, paddingTop: 32, paddingBottom: 80 },
  center: { alignItems: "center", justifyContent: "center" },

  back: { color: ACCENT, fontSize: 14, fontWeight: "700", marginBottom: 24 },

  // ── Form ──
  formGlyph: { color: ROLE_COLOR, fontSize: 44, textAlign: "center", marginBottom: 16, opacity: 0.4 },
  formEyebrow: { color: "rgba(255,255,255,0.35)", fontSize: 12, letterSpacing: 3, fontWeight: "900", textAlign: "center", marginBottom: 8 },
  formTitle: { color: "#fff", fontSize: 26, fontWeight: "900", textAlign: "center", lineHeight: 34, marginBottom: 12 },
  formHook: { color: "rgba(255,255,255,0.50)", fontSize: 14, lineHeight: 22, textAlign: "center", marginBottom: 32 },

  formGroup: { marginBottom: 16 },
  label: { color: "rgba(255,255,255,0.50)", fontSize: 12, fontWeight: "800", letterSpacing: 0.5, marginBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  errorBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "rgba(239,68,68,0.10)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
  },
  errorTitle: { color: "#ef4444", fontSize: 13, fontWeight: "800", marginBottom: 4 },
  errorText: { color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 17 },

  submitBtn: {
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: ROLE_COLOR,
  },
  submitText: { color: BG, fontSize: 16, fontWeight: "900", letterSpacing: 0.5 },

  cachedBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cachedText: { color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: "700" },

  formDisclaimer: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
  },

  // ── Loading ──
  loadGlyph: { color: ROLE_COLOR, fontSize: 56, textAlign: "center" },
  loadText: { color: "rgba(255,255,255,0.65)", fontSize: 15, marginTop: 18, textAlign: "center", fontWeight: "600" },
  loadSub: { color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 8, textAlign: "center" },

  // ── Result header ──
  resultHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12 },
  resultName: { color: "#fff", fontSize: 22, fontWeight: "900" },
  resultSub: { color: "rgba(255,255,255,0.40)", fontSize: 12, fontWeight: "600", marginTop: 2 },
  roleBadge: {
    backgroundColor: `${ROLE_COLOR}18`,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: `${ROLE_COLOR}35`,
  },
  roleText: { color: ROLE_COLOR, fontSize: 14, fontWeight: "900" },

  // ── Section cards (unlocked) ──
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  sectionIcon: { color: ROLE_COLOR, fontSize: 16, opacity: 0.7 },
  sectionLabel: { color: ROLE_COLOR, fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  sectionText: { color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 23 },

  // ── Locked section cards ──
  lockedCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(192,132,252,0.12)",
    overflow: "hidden",
  },
  lockedHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  lockedIcon: { color: "rgba(192,132,252,0.40)", fontSize: 16 },
  lockedLabel: { color: "rgba(192,132,252,0.55)", fontSize: 12, fontWeight: "900", letterSpacing: 1, flex: 1 },
  lockBadge: { opacity: 0.6 },
  lockBadgeText: { fontSize: 12 },
  lockedPreview: { color: "rgba(255,255,255,0.20)", fontSize: 14, lineHeight: 22 },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: BG,
    opacity: 0.85,
  },

  // ── Curiosity gap ──
  curiosityGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  curiosityLine: { flex: 1, height: 1, backgroundColor: `${ROLE_COLOR}20` },
  curiosityText: { color: ROLE_COLOR, fontSize: 14, fontWeight: "900", letterSpacing: 0.5 },

  // ── Inline Paywall ──
  paywallZone: { marginTop: 8, marginBottom: 24 },
  paywallHook: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", marginBottom: 8 },
  paywallSub: { color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 20, textAlign: "center", marginBottom: 24 },

  paywallCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    gap: 12,
  },
  paywallCardGlyph: { fontSize: 24, width: 36, textAlign: "center" },
  paywallCardBody: { flex: 1 },
  paywallCardTitle: { fontSize: 15, fontWeight: "900", marginBottom: 2 },
  paywallCardDesc: { color: "rgba(255,255,255,0.40)", fontSize: 12, lineHeight: 16 },
  paywallCta: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  paywallCtaText: { color: BG, fontSize: 12, fontWeight: "900" },

  // ── Bottom ──
  newReadingBtn: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginTop: 8,
  },
  newReadingText: { color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: "800" },

  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: { color: "rgba(255,255,255,0.30)", fontSize: 13, fontWeight: "700" },
});
