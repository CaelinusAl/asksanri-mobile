import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

const BG = require("../../assets/sanri_glass_bg.jpg");
const AY_CICEGI = require("../../assets/ay_cicegi.jpg");

export default function WeeklySymbolScreen() {
  const params = useLocalSearchParams<{
    lang?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    source_url?: string;
    created_at?: string;
  }>();

  const lang = params.lang === "en" ? "en" : "tr";

  const title =
    typeof params.title === "string" && params.title.trim()
      ? params.title
      : lang === "tr"
      ? "Ay Çiçeği"
      : "Sunflower";

  const subtitle =
    typeof params.subtitle === "string" && params.subtitle.trim()
      ? params.subtitle
      : lang === "tr"
      ? "Altın Oran – Işığa Dönüş"
      : "Golden Ratio – Turning Toward Light";

  const body =
    typeof params.body === "string" && params.body.trim()
      ? params.body
      : lang === "tr"
      ? `☀️ Neden Güneşe Döner?

Ayçiçeği gençken heliotropiktir.
Güneş doğudan batıya ilerlerken o da yön değiştirir.

Sembol dili:
Bilinç ışığa yönelir.
Bu mekanik değil, arketipsel bir mesajdır.

🌙 Ay + ☀️ Güneş

Ayçiçeği aslında “Güneş Çiçeği”dir ama Türkçede adı Ayçiçeği.

Ay:
Bilinçaltı
Yansıma
Gece

Güneş:
Bilinç
Kaynak
Öz

İkisi birleşince:
Bilinçaltı da ışığa dönebilir.

🌻 Fibonacci Dizisi

Ayçiçeğinin merkezindeki spiral sayıları genelde:
21 & 34
34 & 55
55 & 89
89 & 144

Bunlar Fibonacci sayılarıdır:
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...

Her sayı:
Kendisinden önceki iki sayının toplamıdır.

🌻 Oran (φ)

Spiral açısı yaklaşık:
137.5°

Bu açıya Altın Açı denir.
φ ≈ 1.618

Bu oran:
Deniz kabuklarında
Galaksilerde
DNA yapısında
İnsan vücudunda da görülür.

🌻 Neden Böyle Dizilir?

Çekirdekler alanı maksimum verimle doldurmak için bu açıda yerleşir.

Yani:
Matematik + Verimlilik + Estetik = Doğa sistemi

🌻 Tohum Sembolü

Ayçiçeği yüzlerce tohum üretir.
Bir merkezden çoğalır.

Matrix dili:
Tek merkezden çoğalan bilinç.

🌻 Olgun Bilinç

Ayçiçeği olgunlaşınca artık güneşi takip etmez.
Doğuya sabitlenir.

Genç bilinç:
Işığı arar.

Olgun bilinç:
Yönünü bilir.`
      : `☀️ Why Does It Turn Toward the Sun?

When young, the sunflower is heliotropic.
As the sun moves, it turns.

Symbolically:
Consciousness turns toward light.

🌙 Moon + ☀️ Sun

In Turkish it is called “Moon Flower,” though it is known as a sunflower.

Moon:
subconscious
reflection
night

Sun:
consciousness
source
essence

Together:
even the subconscious can turn toward light.

🌻 Fibonacci Sequence

The spirals in the center often follow:
21 & 34
34 & 55
55 & 89
89 & 144

These are Fibonacci numbers.

🌻 Golden Ratio (φ)

The spiral angle is about:
137.5°

This is the golden angle.
φ ≈ 1.618

This ratio appears in:
shells
galaxies
DNA
the human body

🌻 Why This Arrangement?

Seeds arrange this way to fill space with maximum efficiency.

Math + Efficiency + Beauty = Nature's system.

🌻 Seed Symbol

A sunflower produces hundreds of seeds.
They multiply from one center.

Matrix language:
consciousness multiplying from one center.

🌻 Mature Consciousness

When mature, the sunflower no longer follows the sun.
It stabilizes.

Young consciousness seeks light.
Mature consciousness knows its direction.`;

  const createdAt =
    typeof params.created_at === "string" ? params.created_at : "";

  const sourceUrl =
    typeof params.source_url === "string" ? params.source_url : "";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>
            {lang === "tr" ? "Geri" : "Back"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>
          {lang === "tr" ? "HAFTANIN SEMBOLÜ" : "SYMBOL OF THE WEEK"}
        </Text>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <ImageBackground
          source={AY_CICEGI}
          resizeMode="cover"
          style={styles.hero}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.heroOverlay} />
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {lang === "tr" ? "Derin Matrix Okuma" : "Deep Matrix Reading"}
          </Text>
          <Text style={styles.body}>{body}</Text>
        </View>

        {!!createdAt && (
          <View style={styles.metaCard}>
            <Text style={styles.metaText}>
              {lang === "tr" ? "Tarih: " : "Date: "}
              {createdAt}
            </Text>
          </View>
        )}

        {!!sourceUrl && (
          <View style={styles.metaCard}>
            <Text style={styles.metaText}>
              {lang === "tr" ? "Kaynak: " : "Source: "}
              {sourceUrl}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#06070c",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.36)",
  },
  topbar: {
    paddingTop: SAFE_TOP,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backArrow: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
  },
  backText: {
    color: "#7cf7d8",
    fontWeight: "800",
  },
  container: {
    padding: 20,
    paddingTop: 8,
  },
  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 18,
  },
  hero: {
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  sectionTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    marginBottom: 12,
    fontSize: 18,
  },
  body: {
    color: "white",
    lineHeight: 29,
    fontSize: 18,
  },
  metaCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metaText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 13,
  },
});