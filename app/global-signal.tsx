import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_BASE } from "../lib/config";
import MatrixRain from "../lib/MatrixRain";

const BG = require("../assets/global_signal_bg.jpg");

type Signal = {
  id: number;
  text: string;
  country: string;
  created_at: string;
};

type EchoItem = {
  country: string;
  text: string;
  score?: number;
};

type EchoData = {
  matched: boolean;
  items: EchoItem[];
};

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  items: EchoItem[];
  is_read: boolean;
  created_at: string;
};

const MAP_POINTS: Record<
  string,
  { top: string; left: string; size?: number }
> = {
  TR: { top: "36%", left: "57%", size: 16 },
  DE: { top: "30%", left: "52%", size: 14 },
  FR: { top: "32%", left: "49%", size: 14 },
  GB: { top: "28%", left: "47%", size: 14 },
  US: { top: "34%", left: "23%", size: 18 },
  CA: { top: "24%", left: "22%", size: 16 },
  BR: { top: "61%", left: "33%", size: 16 },
  AR: { top: "74%", left: "32%", size: 14 },
  RU: { top: "23%", left: "68%", size: 16 },
  IN: { top: "47%", left: "68%", size: 16 },
  CN: { top: "40%", left: "77%", size: 18 },
  JP: { top: "37%", left: "86%", size: 14 },
  KR: { top: "38%", left: "82%", size: 12 },
  AU: { top: "75%", left: "84%", size: 16 },
  ZA: { top: "76%", left: "56%", size: 14 },
  EG: { top: "45%", left: "55%", size: 12 },
  EN: { top: "28%", left: "47%", size: 12 },
  UNKNOWN: { top: "50%", left: "50%", size: 12 },
};

function PulseDot({
  top,
  left,
  size = 14,
}: {
  top: string;
  left: string;
  size?: number;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.9,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.18,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.75,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [opacity, scale]);

  return (
    <View
      style={[
        styles.mapPointWrap,
        {
          top: top as any,
          left: left as any,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.mapPulse,
          {
            width: size * 2.5,
            height: size * 2.5,
            borderRadius: size * 1.25,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View
        style={[
          styles.mapDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -size / 2,
            marginTop: -size / 2,
          },
        ]}
      />
    </View>
  );
}

export default function GlobalSignalScreen() {
  const [text, setText] = useState("");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [echo, setEcho] = useState<EchoData | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userId] = useState("selin-device");

  const loadStream = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/global-signal/stream`);
      const data = await res.json();

      setSignals(Array.isArray(data?.signals) ? data.signals : []);
    } catch (e) {
      setError("Akış yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/global-signal/notifications?user_id=${userId}`
      );
      const data = await res.json();
      setNotifications(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {}
  };

  const sendSignal = async () => {
    const clean = text.trim();

    if (!clean) {
      setError("Önce bir cümle yaz.");
      return;
    }

    try {
      setSending(true);
      setError("");
      setEcho(null);

      const res = await fetch(`${API_BASE}/global-signal/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: clean, user_id: userId }),
      });

      const data = await res.json();

      if (!data?.ok) {
        setError("Sinyal gönderilemedi.");
        return;
      }

      setEcho(data?.echo || null);
      setText("");
      await loadStream();

      // v2 test için manuel processor tetikle
      
    } catch (e) {
      setError("Sinyal gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  const activeCountries = useMemo(() => {
    return Array.from(
      new Set(
        signals
          .map((item) => (item.country || "UNKNOWN").toUpperCase())
          .filter(Boolean)
      )
    ).slice(0, 20);
  }, [signals]);

  const formatTime = (value: string) => {
    try {
      return new Date(value).toLocaleString("tr-TR");
    } catch {
      return value;
    }
  };
useEffect(() => {
  loadStream();
  loadNotifications();

  const interval = setInterval(() => {
    loadNotifications();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <View style={styles.bgDark} />
        <View style={styles.bgGlowTop} />
        <View style={styles.bgGlowBottom} />

        <View pointerEvents="none" style={styles.rainWrap}>
          <MatrixRain />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>SANRI • GLOBAL FIELD</Text>
            <Text style={styles.title}>World Signal</Text>
            <Text style={styles.subtitle}>
              Dünyaya tek bir cümle bırak. Sinyalin ortak alana düşsün.
            </Text>
          </View>

          {!!notifications.length && (
            <View style={styles.inboxCard}>
              <Text style={styles.inboxEyebrow}>ECHO INBOX</Text>
              <Text style={styles.inboxTitle}>Your signal echoed.</Text>
              <Text style={styles.inboxSubtitle}>
                Alanın başka yerlerinde benzer hisler belirdi.
              </Text>

              {notifications[0]?.items?.map((item, index) => (
                <View key={`${item.country}-${index}`} style={styles.inboxItem}>
                  <View style={styles.inboxCountryBadge}>
                    <Text style={styles.inboxCountryText}>{item.country}</Text>
                  </View>
                  <Text style={styles.inboxItemText}>{item.text}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.mapCard}>
            <Text style={styles.mapEyebrow}>GLOBAL MAP</Text>
            <Text style={styles.mapTitle}>Signal Activity</Text>
            <Text style={styles.mapSubtitle}>
              Alanda aktif olan ülkeler burada ışık olarak beliriyor.
            </Text>

            <View style={styles.mapStage}>
              {activeCountries.map((code) => {
                const point = MAP_POINTS[code] || MAP_POINTS.UNKNOWN;
                return (
                  <PulseDot
                    key={code}
                    top={point.top}
                    left={point.left}
                    size={point.size}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Signal bırak</Text>

            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Bugün içimde sessiz bir alan var..."
              placeholderTextColor="rgba(255,255,255,0.38)"
              style={styles.input}
            />

            <Pressable
              style={[styles.primaryButton, sending && styles.buttonDisabled]}
              onPress={sendSignal}
              disabled={sending}
            >
              <Text style={styles.primaryButtonText}>
                {sending ? "Signal gönderiliyor..." : "Send Signal"}
              </Text>
            </Pressable>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {!!echo?.matched && (
            <View style={styles.echoCard}>
              <Text style={styles.echoEyebrow}>YOUR SIGNAL ECHOED</Text>
              <Text style={styles.echoSubtitle}>
                Alanın başka yerlerinde benzer hisler belirdi.
              </Text>

              {echo.items.map((item, index) => (
                <View key={`${item.country}-${index}`} style={styles.echoItem}>
                  <View style={styles.echoCountryBadge}>
                    <Text style={styles.echoCountryText}>{item.country}</Text>
                  </View>
                  <Text style={styles.echoItemText}>{item.text}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>Global Stream</Text>

              <Pressable
                style={styles.refreshButton}
                onPress={async () => {
                  await loadStream();
                  await loadNotifications();
                }}
              >
                <Text style={styles.refreshText}>Yenile</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color="#9FE7FF" />
                <Text style={styles.loadingText}>Alan güncelleniyor...</Text>
              </View>
            ) : signals.length === 0 ? (
              <Text style={styles.emptyText}>Henüz sinyal yok.</Text>
            ) : (
              signals.map((item) => (
                <View key={`${item.id}-${item.created_at}`} style={styles.signalCard}>
                  <View style={styles.signalTopRow}>
                    <View style={styles.countryBadge}>
                      <Text style={styles.countryText}>
                        {item.country || "UNKNOWN"}
                      </Text>
                    </View>

                    <Text style={styles.timeText}>
                      {formatTime(item.created_at)}
                    </Text>
                  </View>

                  <Text style={styles.signalText}>{item.text}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#03050A",
  },
  bg: {
    flex: 1,
  },
  bgDark: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2,5,12,0.72)",
  },
  bgGlowTop: {
    position: "absolute",
    top: -120,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(112, 87, 255, 0.18)",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -160,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: "rgba(72, 208, 255, 0.10)",
  },
  rainWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 90,
  },
  hero: {
    borderRadius: 30,
    padding: 20,
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: "rgba(12,16,30,0.58)",
    borderWidth: 1,
    borderColor: "rgba(190,220,255,0.14)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  eyebrow: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    lineHeight: 24,
  },
  inboxCard: {
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(89, 64, 198, 0.30)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.24)",
  },
  inboxEyebrow: {
    color: "#D8C8FF",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "800",
  },
  inboxTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  inboxSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  inboxItem: {
    borderRadius: 18,
    padding: 14,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  inboxCountryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  inboxCountryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  inboxItemText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  mapCard: {
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(10,14,28,0.54)",
    borderWidth: 1,
    borderColor: "rgba(190,220,255,0.12)",
  },
  mapEyebrow: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  mapTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  mapSubtitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  mapStage: {
    height: 220,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  mapPointWrap: {
    position: "absolute",
  },
  mapPulse: {
    position: "absolute",
    left: -12,
    top: -12,
    backgroundColor: "rgba(108,239,220,0.18)",
    borderWidth: 1,
    borderColor: "rgba(108,239,220,0.35)",
  },
  mapDot: {
    backgroundColor: "#8FF7E7",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.95)",
    shadowColor: "#8FF7E7",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(10,14,28,0.62)",
    borderWidth: 1,
    borderColor: "rgba(190,220,255,0.12)",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  input: {
    minHeight: 135,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 14,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6D58FF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#6D58FF",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  errorText: {
    marginTop: 12,
    color: "#FFB4B4",
    lineHeight: 22,
    fontSize: 14,
  },
  echoCard: {
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(79, 56, 170, 0.28)",
    borderWidth: 1,
    borderColor: "rgba(196,181,253,0.20)",
  },
  echoEyebrow: {
    color: "#CBB9FF",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "800",
  },
  echoSubtitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  echoItem: {
    borderRadius: 18,
    padding: 14,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  echoCountryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  echoCountryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  echoItemText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  refreshButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
  },
  emptyText: {
    color: "rgba(255,255,255,0.62)",
    lineHeight: 22,
    fontSize: 15,
    marginTop: 6,
  },
  signalCard: {
    marginTop: 12,
    borderRadius: 22,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  signalTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  countryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(108, 239, 220, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(108, 239, 220, 0.22)",
  },
  countryText: {
    color: "#8FF7E7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  timeText: {
    color: "rgba(255,255,255,0.46)",
    fontSize: 12,
  },
  signalText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  bottomSpace: {
    height: 18,
  },
});