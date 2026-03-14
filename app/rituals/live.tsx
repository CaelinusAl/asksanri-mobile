import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { askSanri } from "../../lib/api";
import { API } from "@/lib/apiClient";

const RITUAL_AUDIO = {
  tr: {
    "60": require("./60_tr.mp3"),
    "112_intro": require("./112_intro_tr.mp3"),
    "112_gate1": require("./112-gate1-tr.mp3"),
    "gate1_mind_heart": require("./gate1_mind_heart_tr.mp3"),
    "vitrin_rituel": require("./vitrin_rituel_tr.mp3"),
  },
  en: {
    "60": require("./60_en.mp3"),
    "112_intro": require("./112_intro_en.mp3"),
    "112_gate1": require("./112-gate1-en.mp3"),
    "gate1_mind_heart": require("./gate1_mind_heart_en.mp3"),
    "vitrin_rituel": require("./vitrin_rituel_en.mp3"),
  },
} as const;

const READY_RITUALS = [
  { id: "60", title: "60 Saniyelik Açılış" },
  { id: "112_intro", title: "112 Giriş" },
  { id: "112_gate1", title: "112 Kapı 1" },
  { id: "gate1_mind_heart", title: "Zihin ve Kalp Kapısı" },
  { id: "vitrin_rituel", title: "Vitrin Ritüeli" },
];

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
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [error, setError] = useState("");
  const [ritual, setRitual] = useState<LiveRitualResponse | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState("");
  const [transcript, setTranscript] = useState("");
  const [selectedReadyRitual, setSelectedReadyRitual] = useState<string>("vitrin_rituel");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlayingReady, setIsPlayingReady] = useState(false);

  useEffect(() => {
  return () => {
    if (sound) {
      sound.unloadAsync();
    }
  };
}, [sound]);
  
const playReadyRitual = async () => {
  try {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    const source =
      RITUAL_AUDIO.tr[selectedReadyRitual as keyof typeof RITUAL_AUDIO.tr];

    const { sound: newSound } = await Audio.Sound.createAsync(source, {
      shouldPlay: true,
    });

    setSound(newSound);
    setIsPlayingReady(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      setIsPlayingReady(status.isPlaying);
    });
  } catch (e: any) {
    setError(e?.message || "Hazır ritüel sesi çalınamadı.");
  }
};

const stopReadyRitual = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlayingReady(false);
  } catch (e: any) {
    setError(e?.message || "Ses durdurulamadı.");
  }
};
  const recordingRef = useRef<Audio.Recording | null>(null);

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

  const askMicPermission = async () => {
    const permission = await Audio.requestPermissionsAsync();
    return permission.granted;
  };

  const startVoiceRitual = async () => {
    try {
      setError("");
      const granted = await askMicPermission();

      if (!granted) {
        Alert.alert("Mikrofon İzni", "Sesli ritüel için mikrofon izni gerekli.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
      setRecordedUri("");
      setTranscript("");
      setRitual(null);
    } catch (e: any) {
      setError(e?.message || "Kayıt başlatılamadı.");
      setIsRecording(false);
    }
  };

  const stopVoiceRitual = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) {
        throw new Error("Aktif kayıt bulunamadı.");
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) {
        throw new Error("Ses kaydı bulunamadı.");
      }

      setRecordedUri(uri);
      await uploadVoice(uri);
    } catch (e: any) {
      setError(e?.message || "Kayıt durdurulamadı.");
      setIsRecording(false);
    }
  };

  const uploadVoice = async (uri: string) => {
    try {
      setVoiceLoading(true);
      setError("");

      const form = new FormData();
      form.append("file", {
        uri,
        name: "live_ritual.m4a",
        type: "audio/m4a",
      } as any);
      form.append("lang", "tr");
      form.append("ritual_pack_id", "live");

      const res = await fetch(`${API.base}/content/rituel/voice`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.detail || json?.error || "Ses yüklenemedi.");
      }

      const heard = String(json?.transcript || "");
      const reply = String(json?.reply || "");

      setTranscript(heard);
      setInput(heard);

      setRitual({
        ok: true,
        type: "ritual-voice",
        title: "Sanrı Ritüeli",
        message: reply || "Sanrı seni duydu.",
        steps: [],
        closing: "Alan açıldı.",
      });
    } catch (e: any) {
      setError(e?.message || "Sesli ritüel işlenemedi.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const speakRitual = () => {
    if (!ritual?.message?.trim()) return;

    Speech.stop();
    Speech.speak(ritual.message, {
      language: "tr-TR",
      pitch: 0.95,
      rate: 0.9,
    });
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

          <View style={styles.readyCard}>
  <Text style={styles.readyTitle}>Hazır Sesli Ritüeller</Text>

  <View style={styles.readyList}>
    {READY_RITUALS.map((item) => (
      <Pressable
        key={item.id}
        onPress={() => setSelectedReadyRitual(item.id)}
        style={[
          styles.readyChip,
          selectedReadyRitual === item.id && styles.readyChipActive,
        ]}
      >
        <Text
          style={[
            styles.readyChipText,
            selectedReadyRitual === item.id && styles.readyChipTextActive,
          ]}
        >
          {item.title}
        </Text>
      </Pressable>
    ))}
  </View>

  <View style={styles.buttonRow}>
    {!isPlayingReady ? (
      <Pressable style={styles.voiceButton} onPress={playReadyRitual}>
        <Text style={styles.voiceButtonText}>Hazır Ritüeli Dinle</Text>
      </Pressable>
    ) : (
      <Pressable style={styles.stopButton} onPress={stopReadyRitual}>
        <Text style={styles.stopButtonText}>Hazır Ritüeli Durdur</Text>
      </Pressable>
    )}
  </View>
</View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={generateRitual}>
              <Text style={styles.primaryButtonText}>
                {loading ? "Sanrı Dinliyor..." : "Ritüel Oluştur"}
              </Text>
            </Pressable>

            {!isRecording ? (
              <Pressable style={styles.voiceButton} onPress={startVoiceRitual}>
                <Text style={styles.voiceButtonText}>
                  {voiceLoading ? "Ses Çözülüyor..." : "Sesle Aç"}
                </Text>
              </Pressable>
            ) : (
              <Pressable style={styles.stopButton} onPress={stopVoiceRitual}>
                <Text style={styles.stopButtonText}>Kaydı Bitir</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Geri Dön</Text>
            </Pressable>
          </View>

          {(loading || voiceLoading) && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>
                {voiceLoading ? "Sesli alan açılıyor..." : "Sanrı alanı açılıyor..."}
              </Text>
            </View>
          )}

          {isRecording && (
            <Text style={styles.recordingText}>
              Sanrı seni dinliyor... Konuşmanı bitirince “Kaydı Bitir”e bas.
            </Text>
          )}

          {!!recordedUri && (
            <Text style={styles.recordInfo}>Ses kaydı alındı.</Text>
          )}

          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {!!transcript && (
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptTitle}>Çözülen Ses</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        )}

        {ritual && (
          <View style={styles.resultCard}>
            <View style={styles.resultTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultEyebrow}>Canlı Yanıt</Text>
                <Text style={styles.resultTitle}>{ritual.title}</Text>
              </View>

              <Pressable style={styles.listenButton} onPress={speakRitual}>
                <Text style={styles.listenButtonText}>Sanrı Oku</Text>
              </Pressable>
            </View>

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
  voiceButton: {
    backgroundColor: "rgba(96,165,250,0.16)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.28)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
  },
  voiceButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  stopButton: {
    backgroundColor: "rgba(248,113,113,0.18)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.30)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
  },
  stopButtonText: {
    color: "#fff",
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
  recordingText: {
    marginTop: 14,
    color: "#93C5FD",
    lineHeight: 22,
  },
  recordInfo: {
    marginTop: 10,
    color: "rgba(255,255,255,0.60)",
  },
  errorText: {
    marginTop: 14,
    color: "#FCA5A5",
    lineHeight: 22,
  },
  transcriptCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  transcriptTitle: {
    color: "#C4B5FD",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  transcriptText: {
    color: "rgba(255,255,255,0.84)",
    lineHeight: 22,
  },
  resultCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(100,70,170,0.10)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.18)",
  },
  resultTopRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listenButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  listenButtonText: {
    color: "#fff",
    fontWeight: "700",
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
  readyCard: {
  marginTop: 14,
  borderRadius: 20,
  padding: 14,
  backgroundColor: "rgba(255,255,255,0.04)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
readyTitle: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "800",
  marginBottom: 10,
},
readyList: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 12,
},
readyChip: {
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 16,
  backgroundColor: "rgba(255,255,255,0.06)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},
readyChipActive: {
  backgroundColor: "rgba(168,85,247,0.18)",
  borderColor: "rgba(196,181,253,0.24)",
},
readyChipText: {
  color: "rgba(255,255,255,0.78)",
  fontWeight: "700",
},
readyChipTextActive: {
  color: "#fff",
},
});