import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, apiPostForm, API } from "@/lib/apiClient";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Lang = "tr" | "en";

type Ritual = {
  ritual_id: string;
  title: string;
  steps: string[];
  note?: string;
};

type RitualPack = {
  ritual_pack_id: string;
  mode?: string;
  description?: string;
  rituals: Ritual[];
};

const BG = require("../../assets/sanri_glass_bg.jpg");

export default function RitualPackScreen() {
  const params = useLocalSearchParams<{ id?: string; lang?: string }>();
  const lang: Lang = String(params.lang || "tr").toLowerCase() === "en" ? "en" : "tr";
  const id = String(params.id || "").trim();

  const [pack, setPack] = useState<RitualPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedUri, setRecordedUri] = useState("");
  const [transcript, setTranscript] = useState("");
  const [ritualReply, setRitualReply] = useState("");

  const recordingRef = useRef<Audio.Recording | null>(null);

  const title = useMemo(() => (lang === "tr" ? "RİTÜEL" : "RITUAL"), [lang]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        if (!id) {
          throw new Error(lang === "tr" ? "Pack ID boş geldi." : "Pack ID is empty.");
        }

        const url = `${API.ritualPack}/${encodeURIComponent(id)}?lang=${lang}`;
        const data: any = await apiGetJson(url, 30000);

        const normalized: RitualPack = {
          ritual_pack_id: String(data?.ritual_pack_id || data?.id || id),
          mode: data?.mode,
          description: data?.description,
          rituals: Array.isArray(data?.rituals) ? data.rituals : [],
        };

        if (!alive) return;
        setPack(normalized);
      } catch (e: any) {
        if (!alive) return;
        setPack(null);
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, lang]);

  const goBack = () => {
    if ((router as any).canGoBack?.()) router.back();
    else router.replace("/(tabs)/rituals" as any);
  };

  const askMicPermission = async () => {
    const permission = await Audio.requestPermissionsAsync();
    return permission.granted;
  };

  const startRecording = async () => {
    try {
      setErr("");

      const granted = await askMicPermission();
      if (!granted) {
        Alert.alert(
          lang === "tr" ? "Mikrofon İzni" : "Microphone Permission",
          lang === "tr"
            ? "Ritüel sesi için mikrofon izni gerekli."
            : "Microphone permission is required for ritual voice."
        );
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
      setRitualReply("");
    } catch (e: any) {
      setErr(String(e?.message || e));
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      const recording = recordingRef.current;
      if (!recording) {
        throw new Error(
          lang === "tr" ? "Aktif kayıt bulunamadı." : "No active recording found."
        );
      }

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) {
        throw new Error(
          lang === "tr" ? "Ses kaydı bulunamadı." : "No audio recording found."
        );
      }

      setRecordedUri(uri);
      await uploadVoice(uri);
    } catch (e: any) {
      setErr(String(e?.message || e));
      setIsRecording(false);
    }
  };

  const uploadVoice = async (uri: string) => {
    try {
      setIsUploading(true);
      setErr("");

      const form = new FormData();
      form.append("file", {
        uri,
        name: "rituel.m4a",
        type: "audio/m4a",
      } as any);
      form.append("lang", lang);
      form.append("ritual_pack_id", pack?.ritual_pack_id || id);

      const json: any = await apiPostForm(
        `${API.base}/content/rituel/voice`,
        form,
        60000
      );

      setTranscript(String(json?.transcript || ""));
      setRitualReply(String(json?.reply || ""));
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setIsUploading(false);
    }
  };

  const speakReply = () => {
    if (!ritualReply.trim()) return;

    Speech.stop();
    Speech.speak(ritualReply, {
      language: lang === "tr" ? "tr-TR" : "en-US",
      pitch: 0.95,
      rate: 0.9,
    });
  };

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
        <Pressable onPress={goBack} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.topTitle}>{title}</Text>

        <View style={{ flex: 1 }} />

        <View style={styles.langPill}>
          <Text style={styles.langTxt}>{lang.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.note}>
            {lang === "tr" ? "Yükleniyor…" : "Loading…"}
          </Text>
        ) : null}

        {err ? <Text style={styles.err}>Hata: {err}</Text> : null}

        {pack ? (
          <>
            <BlurView intensity={26} tint="dark" style={styles.headerCard}>
              <Text style={styles.h1}>{pack.ritual_pack_id}</Text>
              {pack.description ? (
                <Text style={styles.desc}>{pack.description}</Text>
              ) : null}
            </BlurView>

            <View style={{ height: 14 }} />

            <BlurView intensity={22} tint="dark" style={styles.voiceCard}>
              <Text style={styles.voiceTitle}>
                {lang === "tr" ? "SANRI RİTÜEL ALANI" : "SANRI RITUAL FIELD"}
              </Text>

              <Text style={styles.voiceText}>
                {isRecording
                  ? lang === "tr"
                    ? "Sanrı seni dinliyor…"
                    : "Sanri is listening…"
                  : isUploading
                  ? lang === "tr"
                    ? "Ses çözülüyor…"
                    : "Processing voice…"
                  : lang === "tr"
                  ? "Niyetini sesinle bırak."
                  : "Leave your intention through your voice."}
              </Text>

              <View style={styles.voiceActions}>
                {!isRecording ? (
                  <Pressable onPress={startRecording} style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnTxt}>
                      {lang === "tr" ? "Ritüeli Başlat" : "Start Ritual"}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={stopRecording} style={styles.stopBtn}>
                    <Text style={styles.primaryBtnTxt}>
                      {lang === "tr" ? "Bitir" : "Stop"}
                    </Text>
                  </Pressable>
                )}

                {!!ritualReply && (
                  <Pressable onPress={speakReply} style={styles.secondaryBtn}>
                    <Text style={styles.secondaryBtnTxt}>
                      {lang === "tr" ? "Sanrı Oku" : "Speak Reply"}
                    </Text>
                  </Pressable>
                )}
              </View>

              {!!recordedUri && (
                <Text style={styles.miniNote}>
                  {lang === "tr" ? "Ses kaydı alındı." : "Voice recorded."}
                </Text>
              )}
            </BlurView>

            {!!transcript && (
              <BlurView intensity={18} tint="dark" style={styles.card}>
                <Text style={styles.sectionTitle}>
                  {lang === "tr" ? "ÇÖZÜLEN SES" : "TRANSCRIPT"}
                </Text>
                <Text style={styles.step}>{transcript}</Text>
              </BlurView>
            )}

            {!!ritualReply && (
              <BlurView intensity={20} tint="dark" style={styles.replyCard}>
                <Text style={styles.sectionTitle}>
                  {lang === "tr" ? "SANRI YANKISI" : "SANRI ECHO"}
                </Text>
                <Text style={styles.replyText}>{ritualReply}</Text>
              </BlurView>
            )}

            {pack.rituals?.length ? (
              pack.rituals.map((r) => (
                <BlurView key={r.ritual_id} intensity={20} tint="dark" style={styles.card}>
                  <Text style={styles.cardTitle}>{r.title}</Text>

                  {Array.isArray(r.steps) && r.steps.length ? (
                    <View style={{ marginTop: 10 }}>
                      {r.steps.map((s, idx) => (
                        <Text key={idx} style={styles.step}>
                          {idx + 1}. {s}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.note2}>
                      {lang === "tr"
                        ? "Bu ritüelde adım bulunamadı."
                        : "No steps found for this ritual."}
                    </Text>
                  )}

                  {r.note ? <Text style={styles.note2}>{r.note}</Text> : null}
                </BlurView>
              ))
            ) : (
              <Text style={styles.note}>
                {lang === "tr" ? "Ritüel listesi boş geldi." : "Ritual list is empty."}
              </Text>
            )}
          </>
        ) : null}

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontSize: 18, fontWeight: "900" },
  topTitle: { color: "white", fontWeight: "900", fontSize: 16 },

  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  langTxt: { color: "#cbbcff", fontWeight: "900", letterSpacing: 1 },

  content: { padding: 18, paddingTop: 8 },
  note: { color: "rgba(255,255,255,0.55)", marginTop: 10 },
  err: { color: "#ff6b8a", marginTop: 10 },

  headerCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  h1: { color: "white", fontSize: 22, fontWeight: "900" },
  desc: { color: "rgba(255,255,255,0.82)", marginTop: 10, lineHeight: 22 },

  voiceCard: {
    marginTop: 6,
    marginBottom: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.16)",
  },
  voiceTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 18 },
  voiceText: { color: "rgba(255,255,255,0.82)", marginTop: 10, lineHeight: 22 },
  voiceActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },

  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(94,59,255,0.65)",
  },
  stopBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,107,138,0.75)",
  },
  primaryBtnTxt: { color: "white", fontWeight: "900" },

  secondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  secondaryBtnTxt: { color: "white", fontWeight: "800" },
  miniNote: { color: "rgba(255,255,255,0.55)", marginTop: 10 },

  sectionTitle: {
    color: "#cbbcff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  replyCard: {
    marginTop: 2,
    marginBottom: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(94,59,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  replyText: { color: "white", marginTop: 10, lineHeight: 24, fontSize: 16 },

  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardTitle: { color: "#7cf7d8", fontWeight: "900", fontSize: 18 },
  step: { color: "rgba(255,255,255,0.9)", marginTop: 8, lineHeight: 22 },
  note2: {
    color: "rgba(255,255,255,0.65)",
    marginTop: 12,
    fontStyle: "italic",
  },
});