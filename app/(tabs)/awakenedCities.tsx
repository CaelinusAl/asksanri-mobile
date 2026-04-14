// app/(tabs)/awakenedCities.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
type Lang = "tr" | "en";

const goBackToGates = () => router.replace("/(tabs)/gates");

// 01-81 Türkiye il listesi (plaka sırasına göre)
const CITIES_TR: string[] = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
  "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri",
  "Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir",
  "Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
  "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
  "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

// 81 Kapı Kanonu (başlık + mühür cümlesi)
// Not: EN seçiliyken de TR gösteriyoruz (istersen sonra EN çevirisini de eklerim)
const GATES_TR: { title: string; seal: string }[] = [
  { title:"Rahim Kapısı", seal:"Boşluk hatırlar." },
  { title:"Dualite Kapısı", seal:"Ayna iki yüz gösterir." },
  { title:"Yaratım Kapısı", seal:"Söz kaderi diker." },
  { title:"Düzen Kapısı", seal:"Sınır inşadır." },
  { title:"Eşik Kapısı", seal:"Geçmeyen kalır." },
  { title:"Aşk Kapısı", seal:"Uyum güçtür." },
  { title:"Sır Kapısı", seal:"Sessizlik sınar." },
  { title:"Kudret Kapısı", seal:"Sorumluluk yükseltir." },
  { title:"Arınma Kapısı", seal:"Biten temizler." },
  { title:"Niyet Kapısı", seal:"Başlangıç geri döner." },
  { title:"Çift Ateş Kapısı", seal:"İki irade çarpışır." },
  { title:"Seçim Kapısı", seal:"Yol ayrımı öğretir." },
  { title:"Kırılım Kapısı", seal:"Eski yapı çatlar." },
  { title:"Sabır Kapısı", seal:"Zemin bekler." },
  { title:"Cesaret Kapısı", seal:"Adım kaderi açar." },
  { title:"Kalp Kapısı", seal:"Sevgi sınavdır." },
  { title:"İçgörü Kapısı", seal:"Görmeyen düşer." },
  { title:"Güç Dengesi Kapısı", seal:"Hüküm aynadır." },
  { title:"Tamamlanış Eşiği", seal:"Döngü kapanır." },
  { title:"Aynalı Rahim", seal:"İç ve dış birleşir." },
  { title:"Bilinç Kapısı", seal:"İrade yön seçer." },
  { title:"Çatallanma Kapısı", seal:"İki yol tek sonuçtur." },
  { title:"Doğum Kapısı", seal:"Yeni form belirir." },
  { title:"Taş Kapısı", seal:"Sabır beden olur." },
  { title:"Değişim Rüzgârı", seal:"Yer değişir." },
  { title:"Uyum Testi", seal:"Aşk ya kalır ya gider." },
  { title:"Derin Sır", seal:"Gizli olan açılır." },
  { title:"Güç Sınavı", seal:"Yetki ağırdır." },
  { title:"Arınma Çarpanı", seal:"Fazla yük düşer." },
  { title:"Üçlü Nefes", seal:"Yaratım genişler." },
  { title:"İrade & Söz", seal:"Başlatan konuşur." },
  { title:"İkili Yaratım", seal:"Ayna doğurur." },
  { title:"Usta Kapısı", seal:"Bilgelik öğretir." },
  { title:"Yapı İnşası", seal:"Hayal somutlaşır." },
  { title:"Sınırdan Geçiş", seal:"Risk büyütür." },
  { title:"Kalbin Kararı", seal:"Sevgi seçilir." },
  { title:"Derin Test", seal:"İç hesap başlar." },
  { title:"Kudret & Sorumluluk", seal:"Güç bedel ister." },
  { title:"Son Çözülme", seal:"Eski bağ çözülür." },
  { title:"Kutsal Dört", seal:"Temel atılır." },
  { title:"Yeni Başlangıç", seal:"İrade tazelenir." },
  { title:"Denge Alanı", seal:"İki kutup sakinleşir." },
  { title:"İnşa Süreci", seal:"Plan görünür." },
  { title:"Taşın Ağırlığı", seal:"Yük taşıyan güçlenir." },
  { title:"Eşiğin İkinci Katı", seal:"Geri dönüş yok." },
  { title:"Kalp Dengesi", seal:"Sevgi korunur." },
  { title:"Sır & Yapı", seal:"Görünmeyen temeldir." },
  { title:"Kudret Dengesi", seal:"Yetki sabitlenir." },
  { title:"Arınma Yükselişi", seal:"Yük hafifler." },
  { title:"Büyük Değişim", seal:"Rüzgâr yön değiştirir." },
  { title:"Ani Ateş", seal:"Şok uyandırır." },
  { title:"İkili Sınav", seal:"Seçim netleşir." },
  { title:"Üretim Alanı", seal:"Yeni form büyür." },
  { title:"Kader İnşası", seal:"Yapı sabitlenir." },
  { title:"Çifte Eşik", seal:"Radikal karar." },
  { title:"Aşkın Dönüşümü", seal:"Uyum değişir." },
  { title:"Derinleşme", seal:"İç kapı açılır." },
  { title:"Güçle Yüzleşme", seal:"Otorite test edilir." },
  { title:"Büyük Arınma", seal:"Temizlik derinleşir." },
  { title:"Kalbin Altıncı Katı", seal:"Sevgi sabitlenir." },
  { title:"Tek Sevgi", seal:"Birlik doğar." },
  { title:"Denge & Aşk", seal:"Uyum öğrenilir." },
  { title:"Yaratım & Sevgi", seal:"Ürün verir." },
  { title:"Yapı & Kalp", seal:"İnşa sevgiyle olur." },
  { title:"Eşik & Aşk", seal:"Cesur kalp geçer." },
  { title:"Çifte Sevgi", seal:"Uyum zirve yapar." },
  { title:"Sır & Kalp", seal:"İç sevgi görünür." },
  { title:"Güç & Sevgi", seal:"Otorite yumuşar." },
  { title:"Tam Aşk", seal:"Birlik kapanır." },
  { title:"Büyük Sır", seal:"Sessizlik konuşur." },
  { title:"Ateşli İçgörü", seal:"Hakikat yakar." },
  { title:"Çifte Test", seal:"Ayna derinleşir." },
  { title:"Bilgeliğin Doğumu", seal:"Usta ortaya çıkar." },
  { title:"Yapı & Sır", seal:"Gizli plan açılır." },
  { title:"Eşik & Gizem", seal:"Risk ruhsaldır." },
  { title:"Sevgi & Sır", seal:"Kalp içe döner." },
  { title:"Çifte Derinlik", seal:"Sır ikiye katlanır." },
  { title:"Güç & Bilgelik", seal:"Hüküm bilinçli olur." },
  { title:"Arınmış Bilgelik", seal:"Gölge çözülür." },
  { title:"Kudret Alanı", seal:"Yönetim başlar." },
  { title:"Birlik Kapısı", seal:"Başlangıç geri döner." },
];

const UI = {
  tr: {
    title: "Awakened Cities",
    sub: "01–81 | Şehrin kodunu seç. Kapı “plaka” ile açılır.",
    search: "Plaka ara… (örn 34) / şehir adı",
    back: "Geri",
    tap: "Tap → City Detail",
  },
  en: {
    title: "Awakened Cities",
    sub: "01–81 | Choose the city code. The gate opens with the plate.",
    search: "Search plate… (e.g. 34) / city name",
    back: "Back",
    tap: "Tap → City Detail",
  },
} as const;

function plateOf(i: number) {
  const n = i + 1;
  return String(n).padStart(2, "0");
}

export default function AwakenedCitiesScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [q, setQ] = useState("");

  const t = UI[lang];

  const items = useMemo(() => {
    const list = Array.from({ length: 81 }).map((_, i) => {
      const plate = plateOf(i);
      const city = CITIES_TR[i] || "";
      const gate = GATES_TR[i] || { title: "Kapı", seal: "" };
      return { plate, city, gateTitle: gate.title, gateSeal: gate.seal };
    });

    const needle = q.trim().toLowerCase();
    if (!needle) return list;

    return list.filter((x) => {
      return (
        x.plate.includes(needle) ||
        x.city.toLowerCase().includes(needle) ||
        x.gateTitle.toLowerCase().includes(needle)
      );
    });
  }, [q]);

  const goCity = (plate: string) => {
    router.push({ pathname: "/city/[code]", params: { code: plate } } as any);
  };

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/gates" as any))}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={18} color="#7cf7d8" />
          <Text style={styles.backTxt}>{t.back}</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langRow}>
          <Pressable onPress={() => setLang("tr")} style={[styles.langChip, lang === "tr" && styles.langChipActive]} hitSlop={10}>
            <Text style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}>TR</Text>
          </Pressable>
          <Pressable onPress={() => setLang("en")} style={[styles.langChip, lang === "en" && styles.langChipActive]} hitSlop={10}>
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.h1}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="rgba(124,247,216,0.8)" />
          <TextInput
            value={q}
            onChangeText={setQ}
            maxLength={100}
            placeholder={t.search}
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.search}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {items.map((it) => (
          <Pressable key={it.plate} onPress={() => goCity(it.plate)} style={styles.card} hitSlop={10}>
            <LinearGradient
              colors={["rgba(255,255,255,0.10)", "rgba(124,247,216,0.05)", "rgba(94,59,255,0.08)"] as any}
              start={{ x: 0, y: 0 } as any}
              end={{ x: 1, y: 1 } as any}
              style={styles.cardGlass}
            >
              <View style={styles.row}>
                <Text style={styles.plate}>{it.plate}</Text>

                <View style={{ flex: 1 }}>
                  <Text style={styles.city}>{it.city}</Text>

                  <View style={styles.gateLine}>
                    <View style={styles.keyPill}>
                      <Ionicons name="key" size={14} color="#7cf7d8" />
                    </View>
                    <Text style={styles.gateTitle}>{it.gateTitle}</Text>
                  </View>

                  <Text style={styles.seal}>{it.gateSeal}</Text>
                  <Text style={styles.tap}>{t.tap}</Text>
                </View>

                <View style={styles.chevPill}>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.75)" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0b10" },

  topbar: { paddingTop: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  backTxt: { color: "#7cf7d8", fontWeight: "800" },

  langRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  langChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
  langChipActive: { backgroundColor: "rgba(124,247,216,0.12)", borderColor: "rgba(124,247,216,0.28)" },
  langTxt: { color: "rgba(255,255,255,0.75)", fontWeight: "900", letterSpacing: 1 },
  langTxtActive: { color: "#7cf7d8" },

  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  h1: { color: "white", fontSize: 36, fontWeight: "900", letterSpacing: 0.4 },
  sub: { color: "rgba(255,255,255,0.70)", marginTop: 6, lineHeight: 20 },

  searchWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  search: { flex: 1, color: "white", fontSize: 15 },

  list: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 20 },

  card: { marginBottom: 12, borderRadius: 22, overflow: "hidden" },
  cardGlass: { borderRadius: 22, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },

  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  plate: { width: 56, textAlign: "center", color: "#7cf7d8", fontWeight: "900", fontSize: 34, letterSpacing: 1 },

  city: { color: "white", fontSize: 24, fontWeight: "900", marginBottom: 6 },

  gateLine: { flexDirection: "row", alignItems: "center", gap: 10 },
  keyPill: { width: 26, height: 26, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(124,247,216,0.12)", borderWidth: 1, borderColor: "rgba(124,247,216,0.22)" },
  gateTitle: { color: "white", fontSize: 18, fontWeight: "900" },

  seal: { color: "rgba(255,255,255,0.78)", marginTop: 6, fontSize: 15 },
  tap: { color: "#7cf7d8", marginTop: 8, fontWeight: "800" },

  chevPill: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.10)" },
});