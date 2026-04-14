import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
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

const ACCENT = "#7cf7d8";
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

const SECTION_LABELS: { key: keyof NarrativeSections; label: string }[] = [
  { key: "opening", label: "Giriş" },
  { key: "ana_tema", label: "Ana Tema" },
  { key: "derin_iliski", label: "Derin okuma — ilişki" },
  { key: "derin_para", label: "Derin okuma — para" },
  { key: "derin_icsel", label: "Derin okuma — içsel yapı" },
  { key: "derin_davranis", label: "Derin okuma — davranış kalıbı" },
  { key: "kor_nokta", label: "Kör nokta" },
  { key: "dongu", label: "Döngü" },
  { key: "kirilma", label: "Kırılma" },
  { key: "sanri_imza", label: "SANRI" },
];

const LOADING_LINES = [
  "Sanrı seni okuyor...",
  "İsmin çözülüyor...",
  "Doğum frekansın hesaplanıyor...",
  "Katmanlar açılıyor...",
  "Zaten biliyorsun. Sadece hatırlamıyorsun.",
];

// Simple FNV-style hash for deterministic variant selection
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
    opening: "Bu bir analiz değil. Sana zaten bildiğin şeyi hatırlatıyor.",
    ana_tema: `${fullName}, Matrix'teki rolün: ${role}. ${lifePath ? `Yaşam yolu arketipin: ${lifePath}.` : ""} ${nameArch ? `İsim arketipin: ${nameArch}.` : ""} Bu kombinasyon senin frekans imzan.`,
    derin_iliski: pickVariant(ILISKI_VARIANTS, seed, 1),
    derin_para: pickVariant(PARA_VARIANTS, seed, 2),
    derin_icsel: pickVariant(ICSEL_VARIANTS, seed, 3),
    derin_davranis: pickVariant(DAVRANIS_VARIANTS, seed, 4),
    kor_nokta: pickVariant(KOR_VARIANTS, seed, 5),
    dongu: "Bu döngü bilinçli değil.\nBu bir tekrar programı.",
    kirilma: "Bu döngüyü kırabilirsin.\nAma önce görmen gerekiyor.",
    sanri_imza: "Buraya kadar geldiysen…\nzaten çağrıldın.",
  };
}

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

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
    if (flow !== "loading") return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 2000);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
    return () => { clearInterval(interval); pulseAnim.setValue(1); };
  }, [flow, pulseAnim]);

  const submit = useCallback(async () => {
    const fn = firstName.trim();
    if (!fn) { setErrorMsg("Lütfen adını gir."); return; }
    if (!birthDate.trim()) { setErrorMsg("Lütfen doğum tarihini seç."); return; }

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

  // ─── FORM ───
  if (flow === "form" || flow === "error") {
    return (
      <View style={st.screen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView style={st.scroll} contentContainerStyle={st.pad}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={st.back}>← Kütüphane</Text>
          </Pressable>

          <Text style={st.eyebrow}>MATRIX ROL OKUMA</Text>
          <Text style={st.heroTitle}>Sistemdeki Rolünü Hatırla</Text>

          <Text style={st.heroBody}>
            Bu alan sana kim olduğunu söylemez.{"\n"}
            Sana zaten bildiğin şeyi hatırlatır.{"\n\n"}
            Hayatında tekrar eden şeyler — insanlar, olaylar, döngüler — rastgele değil.{"\n"}
            Bir rolün var.{"\n\n"}
            Bu bir analiz değil. Bu bir hatırlayış.{"\n"}
            Buraya kadar geldiysen… zaten çağrıldın.
          </Text>

          <View style={st.formGroup}>
            <Text style={st.label}>Ad *</Text>
            <TextInput
              style={st.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Adın"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </View>

          <View style={st.formGroup}>
            <Text style={st.label}>Soyad</Text>
            <TextInput
              style={st.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Soyadın (opsiyonel)"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />
          </View>

          <View style={st.formGroup}>
            <Text style={st.label}>Doğum Tarihi *</Text>
            <TextInput
              style={st.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="rgba(255,255,255,0.3)"
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
              <Text style={st.cachedText}>Son kayıtlı okumanı göster (cihazından)</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    );
  }

  // ─── LOADING ───
  if (flow === "loading") {
    return (
      <View style={[st.screen, st.center]}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Animated.Text style={[st.loadGlyph, { opacity: pulseAnim }]}>◈</Animated.Text>
        <ActivityIndicator color={ACCENT} style={{ marginTop: 18 }} />
        <Text style={st.loadText}>{LOADING_LINES[loadingLine]}</Text>
      </View>
    );
  }

  // ─── RESULT ───
  return (
    <View style={st.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={st.scroll} contentContainerStyle={st.pad}>
        <Pressable onPress={() => setFlow("form")} hitSlop={12}>
          <Text style={st.back}>← Yeni Okuma</Text>
        </Pressable>

        <View style={st.resultHeader}>
          <Text style={st.resultName}>{fullName}</Text>
          <View style={st.roleBadge}>
            <Text style={st.roleText}>{role}</Text>
          </View>
        </View>

        {narrative &&
          SECTION_LABELS.map((sec) => {
            const text = narrative[sec.key];
            if (!text) return null;
            return (
              <View key={sec.key} style={st.sectionCard}>
                <Text style={st.sectionLabel}>{sec.label}</Text>
                <Text style={st.sectionText}>{text}</Text>
              </View>
            );
          })}

        <Pressable style={st.submitBtn} onPress={() => setFlow("form")}>
          <Text style={st.submitText}>Yeni Okuma Yap</Text>
        </Pressable>

        <Pressable style={st.secondaryBtn} onPress={() => router.back()}>
          <Text style={st.secondaryText}>Kütüphane'ye dön</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  pad: { padding: 18, paddingTop: 28, paddingBottom: 80 },
  center: { alignItems: "center", justifyContent: "center" },
  back: { color: ACCENT, fontSize: 15, fontWeight: "700", marginBottom: 20 },
  eyebrow: { color: "rgba(255,255,255,0.6)", fontSize: 13, letterSpacing: 2.5, marginBottom: 6 },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 14 },
  heroBody: { color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 22, marginBottom: 28 },

  formGroup: { marginBottom: 16 },
  label: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  errorBanner: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  errorTitle: { color: "#ef4444", fontSize: 13, fontWeight: "800", marginBottom: 4 },
  errorText: { color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 17 },

  submitBtn: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: ACCENT,
  },
  submitText: { color: BG, fontSize: 15, fontWeight: "900" },

  cachedBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cachedText: { color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: "600" },

  loadGlyph: { color: ACCENT, fontSize: 48, textAlign: "center" },
  loadText: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 14, textAlign: "center" },

  resultHeader: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 },
  resultName: { color: "#fff", fontSize: 24, fontWeight: "900", flex: 1 },
  roleBadge: {
    backgroundColor: "rgba(124,247,216,0.15)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.3)",
  },
  roleText: { color: ACCENT, fontSize: 13, fontWeight: "800" },

  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  sectionLabel: { color: ACCENT, fontSize: 12, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  sectionText: { color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 22 },

  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  secondaryText: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "700" },
});
