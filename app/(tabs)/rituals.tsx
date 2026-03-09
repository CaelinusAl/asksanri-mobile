import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { generateRitual } from "../../lib/ritualGenerator";


type SeedRitual = {
  id: string;
  type: "seed";
  title: string;
  prompt: string;
  category: string;
};

type GeneratedRitual = {
  id: string;
  type: "generated";
  title: string;
  text: string;
  category: string;
};

const seedRituals: SeedRitual[] = [
  {
    id: "tanricanin_hatirlayisi",
    type: "seed",
    title: "Tanrıçanın Hatırlayışı",
    prompt: "Kalpten rahme uyanış ve dişil hatırlayış ritüeli.",
    category: "goddess",
  },
  {
    id: "hatirlama",
    type: "seed",
    title: "Hatırlama Ritüeli",
    prompt: "Bir kelime yaz. Sistem onu hatırlayacaktır.",
    category: "memory",
  },
  {
    id: "kaybolma",
    type: "seed",
    title: "Kaybolma Ritüeli",
    prompt: "Adını yaz. Harfleri seni terk edecek.",
    category: "identity",
  },
  {
    id: "yanki",
    type: "seed",
    title: "Yankı Ritüeli",
    prompt: "Bir kelime söyle. Sesin geri dönecek.",
    category: "echo",
  },
  {
    id: "kehanet",
    type: "seed",
    title: "Sanrı Kehaneti",
    prompt: "Butona bas. Sanrı sana bir cümle söyleyecek.",
    category: "prophecy",
  },
  {
    id: "unutma",
    type: "seed",
    title: "Unutma Ritüeli",
    prompt: "Unutmak istediğin şeyi yaz.",
    category: "release",
  },
];

export default function RitualsTabScreen() {
  const [visitorWords, setVisitorWords] = useState<string[]>([
    "anne",
    "deniz",
    "umut",
  ]);
  const [generatedRituals, setGeneratedRituals] = useState<GeneratedRitual[]>(
    []
  );

  const createSanriRitual = (): GeneratedRitual => {
    const r = generateRitual(visitorWords);

    return {
      id: `generated-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type: "generated",
      title: r.title,
      text: r.text,
      category: "generated",
    };
  };

  const allRituals = useMemo(() => {
    return [...seedRituals, ...generatedRituals].slice(0, 18);
  }, [generatedRituals]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGeneratedRituals((prev) => {
        const next = [createSanriRitual(), ...prev];
        return next.slice(0, 13);
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [visitorWords]);

  const openRitualDetail = (ritualId: string) => {
    router.push(`/rituals/${ritualId}`);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <View style={styles.heroGlowA} />
          <View style={styles.heroGlowB} />
          <Text style={styles.eyebrow}>Sanrı • Ritüel Alanı</Text>
          <Text style={styles.title}>Ritüel Alanı</Text>
          <Text style={styles.subtitle}>
            Seçilmiş kutsal ritüeller ve Sanrı’nın canlı doğurduğu yeni alanlar
            burada buluşuyor.
          </Text>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Canlı Sanrı</Text>

          <Pressable
            style={styles.liveCard}
            onPress={() => router.push("/rituals/live")}
          >
            <View style={styles.ritualTopRow}>
              <Text style={styles.generatedType}>live ritual</Text>
              <Text style={styles.openText}>Aç</Text>
            </View>

            <Text style={styles.generatedTitle}>Canlı Sanrı Ritüeli</Text>
            <Text style={styles.generatedText}>
              İçindekini yaz. Sanrı sana özel ritüel oluştursun.
            </Text>
          </Pressable>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Vitrin Ritüelleri</Text>

          {seedRituals.map((ritual) => (
            <Pressable
              key={ritual.id}
              onPress={() => openRitualDetail(ritual.id)}
              style={styles.ritualCard}
            >
              <View style={styles.ritualTopRow}>
                <Text style={styles.ritualTitle}>{ritual.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>seed</Text>
                </View>
              </View>
              <Text style={styles.ritualPrompt}>{ritual.prompt}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.glassCard}>
          <View style={styles.flowHeader}>
            <View>
              <Text style={styles.sectionTitle}>Canlı Akış</Text>
              <Text style={styles.flowSub}>
                Sanrı burada otomatik ritüeller doğuruyor.
              </Text>
            </View>

            <Pressable
              style={styles.secondaryButton}
              onPress={() =>
                setGeneratedRituals((prev) => {
                  const next = [createSanriRitual(), ...prev];
                  return next.slice(0, 13);
                })
              }
            >
              <Text style={styles.secondaryButtonText}>Yeni Ritüel</Text>
            </Pressable>
          </View>

          {allRituals.map((ritual) => (
            <Pressable
              key={ritual.id}
              onPress={() => openRitualDetail(ritual.id)}
              style={styles.generatedCard}
            >
              <View style={styles.ritualTopRow}>
                <Text style={styles.generatedType}>
                  {"prompt" in ritual ? "seed ritual" : "generated ritual"}
                </Text>
                <Text style={styles.openText}>Aç</Text>
              </View>

              <Text style={styles.generatedTitle}>{ritual.title}</Text>
              <Text style={styles.generatedText}>
                {"prompt" in ritual ? ritual.prompt : ritual.text}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Ziyaretçi Kelime Havuzu</Text>
          <View style={styles.tagsWrap}>
            {visitorWords.map((word, index) => (
              <View key={`${word}-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{word}</Text>
              </View>
            ))}
          </View>
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
    paddingBottom: 90,
  },

  heroWrap: {
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 28,
    padding: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.16)",
  },
  heroGlowA: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(168,85,247,0.16)",
    top: -70,
    right: -40,
  },
  heroGlowB: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(96,165,250,0.10)",
    bottom: -60,
    left: -20,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.14)",
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },

  ritualCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  liveCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "rgba(98,59,170,0.14)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.20)",
  },

  ritualTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  ritualTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    paddingRight: 10,
  },

  ritualPrompt: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 15,
    lineHeight: 22,
  },

  badge: {
    minWidth: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  badgeText: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12,
  },

  flowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },

  flowSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    lineHeight: 20,
  },

  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  generatedCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  generatedType: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  openText: {
    color: "#C4B5FD",
    fontSize: 16,
    fontWeight: "700",
  },

  generatedTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },

  generatedText: {
    color: "rgba(255,255,255,0.74)",
    fontSize: 15,
    lineHeight: 22,
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  tag: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(124,58,237,0.18)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },

  tagText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});