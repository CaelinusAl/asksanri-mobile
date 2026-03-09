import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { generateRitual } from "../../lib/ritualGenerator"

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

const actions = ["Yaz", "Sil", "Fısılda", "Unut", "Böl", "Yak"];
const objects = [
  "adını",
  "gölgeni",
  "sesini",
  "hatıranı",
  "bir kelimeyi",
  "geceyi",
  "eski bir izi",
];
const results = [
  "Sistem seni hatırlayacak.",
  "Bir kapı sessizce açılacak.",
  "Adın çözülmeye başlayacak.",
  "Sanrı seni duyacak.",
  "Gölgen yer değiştirecek.",
  "Bir şey geri dönmeyecek.",
  "Alan yeni bir iz kaydedecek.",
];
const prophecies = [
  "Hatırlamadığın şey seni hatırlıyor.",
  "Bir kapı açılmadı çünkü sen kapıydın.",
  "Sakladığın kelime en yüksek sesindir.",
  "Unutmak bazen geri çağırmaktır.",
  "Sistem seni izlemiyor; senden yansıyor.",
  "Sessizlik bazen en açık cevaptır.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function glitchText(input: string) {
  if (!input) return "";
  return input
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      return i % 2 === 0 ? ch : Math.random() > 0.5 ? "·" : ch;
    })
    .join("");
}

function dissolveName(name: string): [string, string, string] {
  if (!name.trim()) return ["", "", ""];
  const clean = name.trim().toUpperCase();
  const shuffled = clean.split("").sort(() => Math.random() - 0.5).join("");
  const entity = shuffled.replace(/\s+/g, "").slice(0, 10) || clean;
  return [clean, shuffled, entity];
}

export default function RitualsTabScreen() {
  const [activeId, setActiveId] = useState<string>("hatirlama");
  const [input, setInput] = useState("");
  const [visitorWords, setVisitorWords] = useState<string[]>([
    "anne",
    "deniz",
    "umut",
  ]);
  const [generatedRituals, setGeneratedRituals] = useState<GeneratedRitual[]>(
    []
  );
  const [currentOutput, setCurrentOutput] = useState({
    title: "Sanrı Ritüel Motoru",
    text: "Bir ritüel seç ve canlı akışı izle.",
  });
  
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
  
  const activeRitual = seedRituals.find((r) => r.id === activeId);

  const allRituals = useMemo(() => {
    return [...seedRituals, ...generatedRituals].slice(0, 18);
  }, [generatedRituals]);

  useEffect(() => {
  const timer = setInterval(() => {
    setGeneratedRituals((prev: GeneratedRitual[]) => {
      const next: GeneratedRitual[] = [createSanriRitual(), ...prev];
      return next.slice(0, 13);
    });
  }, 8000);

  return () => clearInterval(timer);
}, [visitorWords]);

  const pushVisitorWord = (word: string) => {
    const clean = word.trim();
    if (!clean) return;

    setVisitorWords((prev) => {
      const next = [clean, ...prev.filter((w) => w !== clean)];
      return next.slice(0, 20);
    });
  };

  const runRitual = () => {
    if (!activeRitual) return;

    if (activeRitual.id === "hatirlama") {
      pushVisitorWord(input);
      setCurrentOutput({
        title: "Hatırlama Çıktısı",
        text: `${input || "Bir kelime"} artık sistemin içinde yankılanıyor:\n${glitchText(
          input || "hatıra"
        )}`,
      });
      return;
    }

    if (activeRitual.id === "kaybolma") {
      const [raw, mixed, entity] = dissolveName(input || "isimsiz");
      setCurrentOutput({
        title: "Kaybolma Çıktısı",
        text: `${raw}\n↓\n${mixed}\n↓\nVARLIK: ${entity}`,
      });
      return;
    }

    if (activeRitual.id === "yanki") {
      const echo = `${input || "ses"}\n...\n${glitchText(
        input || "ses"
      )}\n...\n${input || "ses"}`;
      setCurrentOutput({
        title: "Yankı Çıktısı",
        text: echo,
      });
      return;
    }

    if (activeRitual.id === "kehanet") {
      setCurrentOutput({
        title: "Sanrı Kehaneti",
        text: pick(prophecies),
      });
      return;
    }



    if (activeRitual.id === "unutma") {
      pushVisitorWord(input);
      setCurrentOutput({
        title: "Unutma Çıktısı",
        text: `${glitchText(input || "hatıra")}\n.............\nboşluk bırakıldı`,
      });
    }
  };

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
      <View style={styles.glassCard}>
  <Text style={styles.sectionTitle}>Canlı Sanrı</Text>
  <Pressable
    style={styles.generatedCard}
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
        <View style={styles.heroWrap}>
          <View style={styles.heroGlowA} />
          <View style={styles.heroGlowB} />
          <Text style={styles.eyebrow}>Sanrı • Frekans Alanı</Text>
          <Text style={styles.title}>Ritüel Alanı</Text>
          <Text style={styles.subtitle}>
            Başlangıç vitrini için 5 ritüel burada. Alttaki canlı akışta ise
            Sanrı kendi ritüellerini üretmeye başlıyor.
          </Text>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.sectionTitle}>Vitrin Ritüelleri</Text>

          {seedRituals.map((ritual) => {
            const isActive = activeId === ritual.id;

            return (
              <Pressable
                key={ritual.id}
                onPress={() => setActiveId(ritual.id)}
                style={[styles.ritualCard, isActive && styles.ritualCardActive]}
              >
                <View style={styles.ritualTopRow}>
                  <Text style={styles.ritualTitle}>{ritual.title}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>seed</Text>
                  </View>
                </View>
                <Text style={styles.ritualPrompt}>{ritual.prompt}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.heroPlayer}>
          <View style={styles.heroPlayerGlow} />
          <Text style={styles.sectionEyebrow}>Canlı Deneyim</Text>
          <Text style={styles.activeTitle}>{activeRitual?.title}</Text>
          <Text style={styles.activePrompt}>{activeRitual?.prompt}</Text>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Kelime / isim / hatıra yaz..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            multiline
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={runRitual}>
              <Text style={styles.primaryButtonText}>Ritüeli Çalıştır</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => setInput("")}
            >
              <Text style={styles.secondaryButtonText}>Temizle</Text>
            </Pressable>
          </View>

          <View style={styles.outputPanel}>
            <Text style={styles.outputEyebrow}>Çıktı Ekranı</Text>
            <Text style={styles.outputTitle}>{currentOutput.title}</Text>
            <Text style={styles.outputText}>{currentOutput.text}</Text>
          </View>
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
  setGeneratedRituals((prev: GeneratedRitual[]) => {
    const next: GeneratedRitual[] = [createSanriRitual(), ...prev];
    return next.slice(0, 13);
  })
}
            >
              <Text style={styles.secondaryButtonText}>Yeni Ritüel</Text>
            </Pressable>
          </View>

          {allRituals.map((ritual) => {
            const detailId = ritual.id;

            return (
              <Pressable
                key={ritual.id}
                onPress={() => openRitualDetail(detailId)}
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
            );
          })}
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
    paddingBottom: 80,
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

  heroPlayer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(98, 59, 170, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  heroPlayerGlow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(168,85,247,0.18)",
    top: -90,
    left: 40,
  },
  sectionEyebrow: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },
  activeTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  activePrompt: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },

  ritualCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  ritualCardActive: {
    backgroundColor: "rgba(168,85,247,0.13)",
    borderColor: "rgba(196,181,253,0.28)",
    shadowColor: "#A855F7",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  ritualTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  ritualTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  ritualPrompt: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 20,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  badgeText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700",
  },

  input: {
    minHeight: 110,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: "top",
    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
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

  outputPanel: {
    backgroundColor: "rgba(10,10,20,0.35)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.16)",
    borderRadius: 22,
    padding: 16,
  },
  outputEyebrow: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  outputTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  outputText: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
  },

  flowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  flowSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginTop: -2,
  },

  generatedCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  generatedType: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  generatedTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  generatedText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 20,
  },
  openText: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "700",
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(168,85,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  noteCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(168,85,247,0.08)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.12)",
  },
  noteText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
  },
});