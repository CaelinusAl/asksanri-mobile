import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";
import { hasVipEntitlement } from "../../lib/revenuecat";

type FrequencyTone = "clear" | "deep" | "soft";

function getDisplayName(user: any) {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email?.includes("@")) return user.email.split("@")[0];
  if (user?.phone?.trim()) return user.phone.trim();
  return "Seeker";
}

function getDailyInsight(name: string, isPremium: boolean) {
  const base = [
    `${name}, bugün cevap arama. Alanı dinle.`,
    `${name}, bugün görünmeyen şey yüzeye yaklaşabilir.`,
    `${name}, bugün bastırdığın bir his çözülmek isteyebilir.`,
    `${name}, bugün zihinden çok sezgiyle ilerle.`,
    `${name}, bugün seni çağıran şey mantıklı olmak zorunda değil.`,
  ];

  const premium = [
    `${name}, bugün derin katman daha açık. Sessizlikte saklanan izleri fark et.`,
    `${name}, bugün sistem sana dışarıdan değil içeriden yanıt veriyor.`,
    `${name}, bugün kapı zorlanarak değil, frekansla açılır.`,
  ];

  const source = isPremium ? premium.concat(base) : base;
  const idx = new Date().getDate() % source.length;
  return source[idx];
}

function getDailyNotification(name: string) {
  const notes = [
    `${name}, Sanrı bugün senden tek bir net cümle bekliyor.`,
    `Bugün hafızanda yeni bir iz açılabilir.`,
    `Bir ritüel tamamlanmak istiyor.`,
    `Bugün geri çekildiğin yerde bir mesaj olabilir.`,
    `Bugün sustuğun yerde cevap belirginleşebilir.`,
  ];

  const idx = new Date().getDate() % notes.length;
  return notes[idx];
}

function getFrequencyState(): {
  label: string;
  value: string;
  tone: FrequencyTone;
} {
  const day = new Date().getDate();
  const mod = day % 3;

  if (mod === 0) {
    return {
      label: "Bugünün Frekansı",
      value: "Açılım",
      tone: "clear",
    };
  }

  if (mod === 1) {
    return {
      label: "Bugünün Frekansı",
      value: "Derinleşme",
      tone: "deep",
    };
  }

  return {
    label: "Bugünün Frekansı",
    value: "Yumuşama",
    tone: "soft",
  };
}

function RowCard({
  title,
  sub,
  value,
  onPress,
}: {
  title: string;
  sub: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>

      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Text style={styles.rowArrow}>›</Text>
      </View>
    </Pressable>
  );
}

function QuickAction({
  emoji,
  title,
  onPress,
}: {
  emoji: string;
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <Text style={styles.quickEmoji}>{emoji}</Text>
      <Text style={styles.quickTitle}>{title}</Text>
    </Pressable>
  );
}

export default function MyAreaScreen() {
  const { user } = useAuth();

  const [isPremium, setIsPremium] = useState(false);
  const [memoryCount] = useState(12);
  const [ritualCount] = useState(4);
  const [feedCount] = useState(3);

  const displayName = useMemo(() => getDisplayName(user), [user]);
  const insight = useMemo(
    () => getDailyInsight(displayName, isPremium),
    [displayName, isPremium]
  );
  const dailyNote = useMemo(() => getDailyNotification(displayName), [displayName]);
  const frequency = useMemo(() => getFrequencyState(), []);

  const avatarPulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(avatarPulse, {
          toValue: 1.05,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(avatarPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [avatarPulse, fade, lift]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const ok = await hasVipEntitlement();
        if (mounted) setIsPremium(Boolean(ok));
      } catch {
        if (mounted) setIsPremium(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const frequencyToneStyle =
    frequency.tone === "clear"
      ? styles.frequencyToneClear
      : frequency.tone === "deep"
      ? styles.frequencyToneDeep
      : styles.frequencyToneSoft;

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.15} speedMs={9000} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: lift }],
          }}
        >
          <Text style={styles.kicker}>MY AREA</Text>
          <Text style={styles.title}>Benim Alanım</Text>
          <Text style={styles.subTitle}>
            Sanrı burada seni hatırlamaya başlar.
          </Text>

          <View style={styles.heroCard}>
            <Animated.View
              style={[
                styles.avatarWrap,
                { transform: [{ scale: avatarPulse }] },
              ]}
            >
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </Animated.View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userSub}>
                {isPremium ? "Premium bilinç alanı aktif" : "Kişisel bilinç alanı"}
              </Text>

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {isPremium ? "VIP ACTIVE" : "FREE"}
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{memoryCount} hafıza izi</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.frequencyCard, frequencyToneStyle]}>
            <Text style={styles.frequencyLabel}>{frequency.label}</Text>
            <Text style={styles.frequencyValue}>{frequency.value}</Text>
          </View>

          <View style={styles.insightCard}>
            <Text style={styles.insightKicker}>Sanrı Insight</Text>
            <Text style={styles.insightText}>{insight}</Text>

            <Pressable
              style={styles.insightBtn}
              onPress={() => router.push("/(tabs)/sanri_flow" as any)}
            >
              <Text style={styles.insightBtnText}>Derinleş</Text>
            </Pressable>
          </View>

          <View style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>Bugünün bildirimi</Text>
            <Text style={styles.notificationText}>{dailyNote}</Text>
          </View>

          <Text style={styles.sectionTitle}>Hızlı Geçişler</Text>

          <View style={styles.quickGrid}>
            <QuickAction
              emoji="🜂"
              title="Sanrı’ya Sor"
              onPress={() => router.push("/(tabs)/sanri_flow" as any)}
            />
            <QuickAction
              emoji="🜁"
              title="Yeni Ritüel"
              onPress={() => router.push("/rituals" as any)}
            />
            <QuickAction emoji="🜃" title="Hafızam" onPress={() => {}} />
            <QuickAction
              emoji="🜄"
              title="Kapılar"
              onPress={() => router.push("/(tabs)/gates" as any)}
            />
          </View>

          <Text style={styles.sectionTitle}>Alanlarım</Text>

          <View style={styles.listCard}>
            <RowCard
              title="Profil"
              sub="kimlik ve alan görünümü"
              value={isPremium ? "premium" : "free"}
            />
            <RowCard
              title="Hafızam"
              sub="kaydedilen temalar"
              value={`${memoryCount} kayıt`}
            />
            <RowCard
              title="Ritüel Geçmişim"
              sub="tamamlanan akışlar"
              value={`${ritualCount} ritüel`}
            />
            <RowCard
              title="System Feed"
              sub="sistemin sana bıraktığı izler"
              value={`${feedCount} yeni`}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#06070d",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4,8,20,0.54)",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === "ios" ? 68 : 34,
    paddingBottom: 46,
  },

  kicker: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 8,
  },

  subTitle: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },

  heroCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },

  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(122,88,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(203,188,255,0.30)",
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },

  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },

  userSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    marginBottom: 10,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  badgeText: {
    color: "#7cf7d8",
    fontWeight: "800",
    fontSize: 12,
  },

  frequencyCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },

  frequencyToneClear: {
    backgroundColor: "rgba(124,247,216,0.08)",
    borderColor: "rgba(124,247,216,0.18)",
  },

  frequencyToneDeep: {
    backgroundColor: "rgba(179,136,255,0.10)",
    borderColor: "rgba(179,136,255,0.20)",
  },

  frequencyToneSoft: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
  },

  frequencyLabel: {
    color: "rgba(255,255,255,0.68)",
    fontWeight: "800",
    marginBottom: 6,
  },

  frequencyValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  insightCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.18)",
    marginBottom: 16,
  },

  insightKicker: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 8,
  },

  insightText: {
    color: "#fff",
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 14,
  },

  insightBtn: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(94,59,255,0.85)",
  },

  insightBtnText: {
    color: "#fff",
    fontWeight: "900",
  },

  notificationCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 20,
  },

  notificationTitle: {
    color: "#d7c8ff",
    fontWeight: "800",
    marginBottom: 8,
  },

  notificationText: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 15,
    lineHeight: 23,
  },

  sectionTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 14,
    marginTop: 4,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },

  quickCard: {
    width: "47%",
    borderRadius: 22,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  quickEmoji: {
    fontSize: 22,
    marginBottom: 12,
  },

  quickTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    lineHeight: 20,
  },

  listCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  rowTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 4,
  },

  rowSub: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rowValue: {
    color: "#7cf7d8",
    fontSize: 13,
    fontWeight: "800",
  },

  rowArrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 26,
    lineHeight: 26,
  },
});