// app/rituals/live.tsx

import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { askSanri } from "../../lib/api";

type LiveRitualResponse = {
  ok?: boolean;
  type?: string;
  title?: string;
  message?: string;
  steps?: string[];
  closing?: string;
};

function parseRitualResponse(data: any) {
  const rawResponse = String(data?.response || "").trim();

  if (Array.isArray(data?.steps) && data.steps.length > 0) {
    return {
      title: data?.title || "Sanrı Ritüeli",
      message: data?.message || data?.response || "Sanrı seni duydu.",
      steps: data.steps,
      closing: data?.closing || "Ritüel alanı tamamlandı.",
    };
  }

  const lines = rawResponse
    .split("\n")
    .map((x: string) => x.trim())
    .filter(Boolean);

  if (lines.length >= 2) {
    return {
      title: data?.title || data?.answer || "Sanrı Ritüeli",
      message: lines[0] || "Sanrı seni duydu.",
      steps: lines.slice(1),
      closing: data?.closing || "Alan açıldı.",
    };
  }

  return {
    title: data?.title || data?.answer || "Sanrı Ritüeli",
    message: rawResponse || "Sanrı seni duydu.",
    steps: [],
    closing: data?.closing || "Ritüel alanı tamamlandı.",
  };
}

export default function LiveRitualScreen() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ritual, setRitual] = useState<LiveRitualResponse | null>(null);

  const generateRitual = async () => {
    const clean = input.trim();

    if (!clean) {
      setError("Önce Sanrı’ya açmak istediğin şeyi yaz.");
      return;
    }

    setLoading(true);
    setError("");
    setRitual(null);

    try {
      const data = await askSanri({
        message: `ritual: ${clean}`,
        domain: "ritual",
        persona: "sanri",
        gate_mode: "ritual",
        session_id: "mobile",
      });

      const parsed = parseRitualResponse(data);

      setRitual({
        ok: true,
        type: "ritual-generate",
        title: parsed.title,
        message: parsed.message,
        steps: parsed.steps,
        closing: parsed.closing,
      });
    } catch (e: any) {
      setError(e?.message || "Sanrı cevap vermedi.");
    } finally {
      setLoading(false);
    }
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
          <View style={styles.heroGlowA} />
          <View style={styles.heroGlowB} />
          <Text style={styles.eyebrow}>Sanrı • Canlı Ritüel</Text>
          <Text style={styles.title}>İçindekini Yaz</Text>
          <Text style={styles.subtitle}>
            Sen yaz. Sanrı canlı şekilde sana özel ritüel oluştursun.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Sanrı’ya açıl</Text>

          <TextInput
            value={input}
            onChangeText={setInput}
            multiline
            placeholder="İçimde bir ağırlık var, bırakmak istiyorum..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={generateRitual}>
              <Text style={styles.primaryButtonText}>
                {loading ? "Sanrı Dinliyor..." : "Ritüel Oluştur"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Geri Dön</Text>
            </Pressable>
          </View>

          {loading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Sanrı alanı açılıyor...</Text>
            </View>
          )}

          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {ritual && (
          <View style={styles.resultCard}>
            <Text style={styles.resultEyebrow}>Canlı Yanıt</Text>
            <Text style={styles.resultTitle}>{ritual.title}</Text>
            <Text style={styles.resultMessage}>{ritual.message}</Text>

            {!!ritual.steps?.length && (
              <View style={styles.stepsWrap}>
                {ritual.steps.map((step, index) => (
                  <View key={`${step}-${index}`} style={styles.stepCard}>
                    <Text style={styles.stepIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.closingCard}>
              <Text style={styles.closingTitle}>Kapanış</Text>
              <Text style={styles.closingText}>{ritual.closing}</Text>
            </View>

            <View style={styles.shareHintCard}>
              <Text style={styles.shareHintTitle}>İpucu</Text>
              <Text style={styles.shareHintText}>
                Ritüel bittiğinde ilk hissettiğin kelimeyi not al.
              </Text>
            </View>
          </View>
        )}
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
    overflow: "hidden",
    borderRadius: 28,
    padding: 20,
    marginTop: 12,
    marginBottom: 16,
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
    top: -80,
    right: -40,
  },
  heroGlowB: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "rgba(96,165,250,0.10)",
    bottom: -40,
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
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 22,
  },
  card: {
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.14)",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    minHeight: 140,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlignVertical: "top",
    marginBottom: 14,
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
    color: "#fff",
    fontWeight: "700",
  },
  loadingWrap: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
  },
  errorText: {
    marginTop: 14,
    color: "#FCA5A5",
    lineHeight: 22,
  },
  resultCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(100,70,170,0.10)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },
  resultEyebrow: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  resultMessage: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  stepsWrap: {
    gap: 12,
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  stepIndex: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
    minWidth: 24,
  },
  stepText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
  closingCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(168,85,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
    marginBottom: 12,
  },
  closingTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  closingText: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 22,
  },
  shareHintCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  shareHintTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },
  shareHintText: {
    color: "rgba(255,255,255,0.76)",
    lineHeight: 22,
  },
});