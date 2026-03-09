// app/rituals/[ritualId].tsx

import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

type RitualPhase = "idle" | "running" | "complete";

const seedRitualMap: Record<
  string,
  { title: string; lines: string[]; closing: string }
> = {
  tanricanin_hatirlayisi: {
    title: "Tanrıçanın Hatırlayışı",
    lines: [
      "Gözlerini yavaşça kapat.",
      "Bir nefes al ve kalbinin merkezine dön.",
      "Şimdi nefesi rahim alanına gönder.",
      "Bedeninin içinde eski bir bilgelik var.",
      "Onu zorlamadan hisset.",
      "Hatırladığın şey yeni değil.",
      "Sadece sana geri dönüyor.",
      "Sen zaten buradaydın.",
    ],
    closing: "Tanrıça hatırlayışı aktive edildi. Bu alan artık seninle.",
  },
  hatirlama: {
    title: "Hatırlama Ritüeli",
    lines: [
      "Bir kelime seç.",
      "O kelimeyi zihninde sessizce tekrar et.",
      "Kelimenin sende bıraktığı izi hisset.",
      "Hatırladığın şey artık seni de hatırlıyor.",
    ],
    closing: "Hatırlama alanı güncellendi.",
  },
  kaybolma: {
    title: "Kaybolma Ritüeli",
    lines: [
      "Adını içinden söyle.",
      "Harflerini tek tek bırak.",
      "Kimliğinin kabuğunu gevşet.",
      "Geriye yalnızca titreşimin kalsın.",
    ],
    closing: "Kimlik izi yumuşatıldı.",
  },
  yanki: {
    title: "Yankı Ritüeli",
    lines: [
      "İçinden bir sözcük söyle.",
      "Sessizliğin içindeki geri dönüşü bekle.",
      "Yankının sana ne anlattığını fark et.",
      "Duyduğun şey senden ayrılmadı.",
    ],
    closing: "Yankı alanı aktive edildi.",
  },
  kehanet: {
    title: "Sanrı Kehaneti",
    lines: [
      "Sorunu hemen söyleme.",
      "Önce sorunun sende uyandırdığı hissi duy.",
      "Cevabın acele etmeden yükselmesine izin ver.",
      "Bazı cevaplar kelime değil, fark ediş olarak gelir.",
    ],
    closing: "Kehanet izi kaydedildi.",
  },
  unutma: {
    title: "Unutma Ritüeli",
    lines: [
      "Bırakmak istediğin şeyi çağır.",
      "Ona bağlı ipleri hisset.",
      "Bir nefesle çözülmesine izin ver.",
      "Boşluk bazen en büyük arınmadır.",
    ],
    closing: "Bırakış alanı tamamlandı.",
  },
};

function buildGeneratedRitual(ritualId: string) {
  const cleaned = decodeURIComponent(ritualId || "generated");
  return {
    title: `Ritüel ${cleaned.replace(/^generated-/, "").slice(0, 12) || "Alan"}`,
    lines: [
      "Sessizce merkezine dön.",
      "Bu ritüelin sende açtığı alanı hisset.",
      "Cümlenin senden geçmesine izin ver.",
      "Bugün ihtiyacın olan şey görünür oluyor.",
    ],
    closing: "Generated ritual alanı kaydedildi.",
  };
}

export default function RitualPlayScreen() {
  const { ritualId } = useLocalSearchParams<{ ritualId: string }>();

  const ritual = useMemo(() => {
    if (!ritualId) {
      return {
        title: "Ritüel Alanı",
        lines: ["Dur.", "Nefes al.", "Alanı hisset.", "Hazır olduğunda başlat."],
        closing: "Alan açıldı.",
      };
    }

    return (
      seedRitualMap[String(ritualId)] ?? buildGeneratedRitual(String(ritualId))
    );
  }, [ritualId]);

  const [phase, setPhase] = useState<RitualPhase>("idle");
  const [visibleStepCount, setVisibleStepCount] = useState(0);
  const [readyToComplete, setReadyToComplete] = useState(false);

  const orbScale = useRef(new Animated.Value(1)).current;
  const orbGlow = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (phase !== "running") return;

    setVisibleStepCount(0);
    setReadyToComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisibleStepCount(current);

      try {
        Haptics.selectionAsync();
      } catch {}

      if (current >= ritual.lines.length) {
        clearInterval(interval);
        setReadyToComplete(true);

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [phase, ritual.lines]);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (phase === "running") {
      animation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(orbScale, {
              toValue: 1.08,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(orbScale, {
              toValue: 0.96,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(orbGlow, {
              toValue: 1,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(orbGlow, {
              toValue: 0.72,
              duration: 1400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    } else if (phase === "complete") {
      animation = Animated.parallel([
        Animated.timing(orbScale, {
          toValue: 1.02,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(orbGlow, {
          toValue: 0.88,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    } else {
      animation = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(orbScale, {
              toValue: 1.03,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(orbScale, {
              toValue: 0.98,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(orbGlow, {
              toValue: 0.82,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(orbGlow, {
              toValue: 0.68,
              duration: 2200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    }

    animation.start();

    return () => {
      animation.stop();
    };
  }, [phase, orbGlow, orbScale]);

  const visibleLines = ritual.lines.slice(0, visibleStepCount);

  const restartRitual = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    setVisibleStepCount(0);
    setReadyToComplete(false);
    setPhase("idle");
  };

  const startRitual = async () => {
    setVisibleStepCount(0);
    setReadyToComplete(false);
    setPhase("running");

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const completeRitual = async () => {
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch {}

    setPhase("complete");
  };

  const goBackToRituals = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    } catch {}

    router.back();
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.glowA} />
          <View style={styles.glowB} />
          <View style={styles.symbol} />
          <Text style={styles.eyebrow}>Sanrı • Ritüel Deneyimi</Text>
          <Text style={styles.title}>{ritual.title}</Text>
          <Text style={styles.subtitle}>
            {ritualId === "tanricanin_hatirlayisi"
              ? "Kalpten rahme inen hatırlayış alanı açılıyor."
              : "Bu alan sabit bir ekran değil. Ritüel senin dikkatine göre açılır."}
          </Text>
        </View>

        <View style={styles.orbCard}>
          <Animated.View
            style={[
              styles.orbOuter,
              {
                transform: [{ scale: orbScale }],
                opacity: orbGlow,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.orbInner,
                {
                  transform: [
                    {
                      scale: orbScale.interpolate({
                        inputRange: [0.96, 1.08],
                        outputRange: [0.99, 1.03],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.orbText}>
                {phase === "idle"
                  ? "Açılış"
                  : phase === "running"
                  ? `${visibleStepCount}/${ritual.lines.length}`
                  : "Aktif"}
              </Text>
            </Animated.View>
          </Animated.View>

          <Text style={styles.stateText}>
            {phase === "idle" && "Ritüel henüz başlamadı"}
            {phase === "running" && "Alan akıyor"}
            {phase === "complete" && "Ritüel tamamlandı"}
          </Text>
        </View>

        <View style={styles.playerCard}>
          <Text style={styles.sectionEyebrow}>Akış</Text>

          {phase === "idle" && (
            <>
              <Text style={styles.introText}>
                Sessizce birkaç nefes al. Hazır olduğunda ritüeli başlat.
              </Text>

              <View style={styles.buttonRow}>
                <Pressable style={styles.primaryButton} onPress={startRitual}>
                  <Text style={styles.primaryButtonText}>Ritüeli Başlat</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={goBackToRituals}
                >
                  <Text style={styles.secondaryButtonText}>Geri Dön</Text>
                </Pressable>
              </View>
            </>
          )}

          {phase === "running" && (
            <>
              <View style={styles.linesWrap}>
                {visibleLines.map((line, index) => (
                  <View key={`${line}-${index}`} style={styles.lineCard}>
                    <Text style={styles.lineIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                    <Text style={styles.lineText}>{line}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.secondaryButton} onPress={restartRitual}>
                  <Text style={styles.secondaryButtonText}>Sıfırla</Text>
                </Pressable>

                {readyToComplete && (
                  <Pressable style={styles.primaryButton} onPress={completeRitual}>
                    <Text style={styles.primaryButtonText}>Devam Et</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {phase === "complete" && (
            <>
              <View style={styles.completeCard}>
                <Text style={styles.completeTitle}>Ritüel Tamamlandı</Text>
                <Text style={styles.completeText}>{ritual.closing}</Text>
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.primaryButton} onPress={restartRitual}>
                  <Text style={styles.primaryButtonText}>Tekrar Aç</Text>
                </Pressable>

                <Pressable
                  style={styles.secondaryButton}
                  onPress={goBackToRituals}
                >
                  <Text style={styles.secondaryButtonText}>Ritüellere Dön</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        <View style={styles.footerHintCard}>
          <Text style={styles.footerHintTitle}>Ritüel İpucu</Text>
          <Text style={styles.footerHintText}>
            Son satırdan sonra gelen ilk his, ritüelin sana bıraktığı izdir.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#06070D",
  },
  container: {
    flex: 1,
    backgroundColor: "#06070D",
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    padding: 22,
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },
  glowA: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "rgba(168,85,247,0.18)",
    top: -80,
    right: -50,
  },
  glowB: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.12)",
    bottom: -60,
    left: -20,
  },
  symbol: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    transform: [{ rotate: "45deg" }],
  },
  eyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: "92%",
  },

  orbCard: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    paddingVertical: 24,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.14)",
  },
  orbOuter: {
    width: 128,
    height: 128,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168,85,247,0.16)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.24)",
    shadowColor: "#A855F7",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  orbInner: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  orbText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  stateText: {
    color: "rgba(255,255,255,0.66)",
    fontSize: 14,
    marginTop: 14,
  },

  playerCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(100,70,170,0.10)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },
  sectionEyebrow: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  introText: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 18,
  },

  linesWrap: {
    gap: 12,
    marginBottom: 18,
  },
  lineCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  lineIndex: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
    minWidth: 24,
  },
  lineText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },

  completeCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    backgroundColor: "rgba(168,85,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.22)",
  },
  completeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  completeText: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 15,
    lineHeight: 24,
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
  },
  primaryButtonText: {
    color: "#111111",
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  footerHintCard: {
    marginTop: 16,
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  footerHintTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },
  footerHintText: {
    color: "rgba(255,255,255,0.76)",
    lineHeight: 22,
  },
});