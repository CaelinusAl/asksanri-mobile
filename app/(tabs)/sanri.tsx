// app/(tabs)/sanri.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

import StarTrailOverlay from "../../lib/StarTrailOverlay";

type Gate = {
  id: "sanri_flow" | "bilinc" | "frekans" | "rituel" | "kutuphane" | "sehirler";
  title: string;
  desc: string;
  tag?: string;
};

export default function SanriHomeScreen() {
  const bg = useMemo(() => ["#07080d", "#13072e", "#050610"] as const, []);
  const [lastTap, setLastTap] = useState<{ x: number; y: number } | null>(null);

  const tapCounterRef = useRef(0);

  const gates: Gate[] = useMemo(
    () => [
      {
        id: "sanri_flow",
        title: "Sanrı",
        desc: "Bir cümle yaz. Cevap değil — anlam yansıması.",
        tag: "Mirror",
      },
      {
        id: "bilinc",
        title: "Bilinç Alanı",
        desc: "Derin sorgu. Netleşme. Tek adım.",
        tag: "Deep",
      },
      {
        id: "frekans",
        title: "Frekans Alanı",
        desc: "Duygu–beden–zihin senkronu. İnce ayar.",
        tag: "Hz",
      },
      {
        id: "rituel",
        title: "Ritüel Alanı",
        desc: "Niyet + eylem. Küçük bir ritüel taslağı.",
        tag: "Ritual",
      },
      {
        id: "kutuphane",
        title: "Kütüphane",
        desc: "Metinler, kayıtlar, rehberler.",
        tag: "Library",
      },
      {
        id: "sehirler",
        title: "Şehirler",
        desc: "Uyanan şehirler: sembol ve enerji haritası.",
        tag: "Cities",
      },
    ],
    []
  );

  const onTapField = useCallback(async (e: any) => {
    const { locationX, locationY } = e?.nativeEvent || {};
    if (typeof locationX !== "number" || typeof locationY !== "number") return;

    // minik haptics (çok sık olmasın)
    tapCounterRef.current += 1;
    if (tapCounterRef.current % 2 === 0) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }

    setLastTap({ x: locationX, y: locationY });
    // aynı noktayı tekrar spawn etsin diye küçük “jitter”
    setTimeout(() => setLastTap({ x: locationX + 0.01, y: locationY + 0.01 }), 10);
  }, []);

  const openGate = useCallback((g: Gate) => {
    // şimdilik: sanri_flow var. diğerleri sonra route olacak.
    if (g.id === "sanri_flow") router.push("/(tabs)/sanri_flow");
    else if (g.id === "sehirler") router.push("/(tabs)/explore"); // sende "Şehirler" explore tabı
    else if (g.id === "frekans") router.push("/(tabs)/matrix"); // geçici, sonra frekans tabı açarız
    else router.push("/(tabs)/sanri_flow"); // geçici fallback
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient colors={bg} style={StyleSheet.absoluteFillObject} />

      {/* büyük yumuşak glowlar */}
      <View style={styles.glowA} />
      <View style={styles.glowB} />

      {/* dokunma alanı: tüm sayfa */}
      <Pressable onPressIn={onTapField} style={StyleSheet.absoluteFill} />

      {/* yıldız overlay */}
      {/* lastTap state değiştikçe StarTrailOverlay yeni spark üretir (basit hack): */}
      {lastTap ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {/* StarTrailOverlay kendi içinde spark üretmiyor; ama biz spawn tetikleyecek şekilde bir “reset” kullanıyoruz:
              En pratik yöntem: overlay’ı key ile re-mount etmek. */}
          <StarTrailOverlay key={`${lastTap.x}_${lastTap.y}`} />
        </View>
      ) : null}

      {/* içerik */}
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerCardWrap}>
          <BlurView intensity={22} tint="dark" style={styles.headerCard}>
            <Text style={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</Text>
            <Text style={styles.title}>Sanrı</Text>
            <Text style={styles.subtitle}>
              Hoş geldin. Bir cümle yaz. Ben cevap değil,{"\n"}anlam yansıtacağım.
            </Text>

            <Pressable onPress={() => router.push("/(tabs)/sanri_flow")} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Bilinç Akışına Gir</Text>
              <Text style={styles.primaryBtnSub}>Yansıt • Derinleş • Tek soru</Text>
            </Pressable>

            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>İpucu</Text>
              <Text style={styles.hintText}>“Soru yazma.”{"\n"}“Bir cümle yaz.”{"\n"}“Yansıma sende şekillenir.”</Text>
            </View>

            <Text style={styles.footerNote}>Bu alan bir “cevap makinesi” değil. Bir fark ediş alanı.</Text>
          </BlurView>
        </View>

        <View style={{ height: 14 }} />

        <Text style={styles.sectionTitle}>Kapılar</Text>
        <Text style={styles.sectionSub}>Hangi alana geçmek istiyorsun?</Text>

        <View style={{ height: 10 }} />

        {gates.map((g) => (
          <Pressable key={g.id} onPress={() => openGate(g)} style={styles.gatePress}>
            <BlurView intensity={18} tint="dark" style={styles.gateCard}>
              <View style={styles.gateTopRow}>
                <Text style={styles.gateTitle}>{g.title}</Text>
                {g.tag ? <Text style={styles.gateTag}>{g.tag}</Text> : null}
              </View>
              <Text style={styles.gateDesc}>{g.desc}</Text>
            </BlurView>
          </Pressable>
        ))}

        <View style={{ height: 28 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  glowA: {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: 560,
    left: -220,
    top: 20,
    backgroundColor: "rgba(94,59,255,0.18)",
  },
  glowB: {
    position: "absolute",
    width: 620,
    height: 620,
    borderRadius: 620,
    right: -260,
    bottom: -120,
    backgroundColor: "rgba(160,120,255,0.12)",
  },

  container: {
    padding: 16,
    paddingBottom: 26,
  },

  headerCardWrap: { marginTop: 8 },
  headerCard: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(10,12,18,0.35)",
    overflow: "hidden",
  },

  kicker: { color: "rgba(255,255,255,0.65)", letterSpacing: 3, fontSize: 12, fontWeight: "800" },
  title: { color: "white", fontSize: 44, fontWeight: "900", marginTop: 10, letterSpacing: -0.5 },
  subtitle: { color: "rgba(255,255,255,0.82)", marginTop: 10, lineHeight: 22 },

  primaryBtn: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "rgba(94,59,255,0.28)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.40)",
    alignItems: "center",
  },
  primaryBtnText: { color: "white", fontWeight: "900", fontSize: 18 },
  primaryBtnSub: { color: "rgba(255,255,255,0.70)", marginTop: 6, fontWeight: "700" },

  hintCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  hintTitle: { color: "rgba(255,255,255,0.85)", fontWeight: "900", marginBottom: 8 },
  hintText: { color: "rgba(255,255,255,0.78)", lineHeight: 20 },

  footerNote: { marginTop: 12, color: "rgba(255,255,255,0.55)", textAlign: "center" },

  sectionTitle: { color: "white", fontWeight: "900", fontSize: 18, marginTop: 6 },
  sectionSub: { color: "rgba(255,255,255,0.65)", marginTop: 4 },

  gatePress: { marginTop: 10 },
  gateCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  gateTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  gateTitle: { color: "white", fontWeight: "900", fontSize: 16 },
  gateTag: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "900",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  gateDesc: { color: "rgba(255,255,255,0.72)", marginTop: 8, lineHeight: 20 },
});