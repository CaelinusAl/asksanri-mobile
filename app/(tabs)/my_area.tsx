// app/(tabs)/my_area.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Me = {
  id: number | null;
  name: string;
  email: string;
  language?: string;
  bio?: string;
  intention?: string;
  vip?: boolean;
};

type MemoryItem = {
  id: number;
  user_id: number;
  type: string;
  content: string;
  created_at: string;
};

type ActivityItem = {
  id: number;
  user_id: number;
  type: string;
  data: string;
  created_at: string;
};

function takeTop(items: string[], n = 3) {
  return items.filter(Boolean).slice(0, n);
}

export default function MyAreaScreen() {
  const [me, setMe] = useState<Me | null>(null);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setErr("");

    try {
      const meData = await apiGetJson<Me>(`${API.base}/me`, 30000);
      setMe(meData);

      if (meData?.id) {
        const memData = await apiGetJson<MemoryItem[]>(
          `${API.base}/memory/${meData.id}`,
          30000
        );

        const actData = await apiGetJson<ActivityItem[]>(
          `${API.base}/activity/${meData.id}`,
          30000
        );

        setMemory(Array.isArray(memData) ? memData : []);
        setActivity(Array.isArray(actData) ? actData : []);
      } else {
        setMemory([]);
        setActivity([]);
      }
    } catch (e: any) {
      setErr(String(e?.message || e || "Bir hata oluştu."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const profileText = useMemo(() => {
    if (!me) return "Profil yükleniyor…";

    return [
      `İsim: ${me.name || "Guest"}`,
      `E-posta: ${me.email || "-"}`,
      `Dil: ${me.language || "tr"}`,
      `VIP: ${me.vip ? "Aktif" : "Pasif"}`,
      `Bio: ${me.bio || "-"}`,
      `Niyet: ${me.intention || "-"}`,
    ].join("\n");
  }, [me]);

  const memoryText = useMemo(() => {
    const rows = takeTop(memory.map((m) => `${m.type}: ${m.content}`), 3);
    return rows.length ? rows.join("\n") : "Henüz kayıtlı hafıza yok.";
  }, [memory]);

  const ritualText = useMemo(() => {
    const rows = takeTop(
      activity
        .filter((a) => a.type.toLowerCase().includes("ritual"))
        .map((a) => a.data),
      3
    );
    return rows.length ? rows.join("\n") : "Henüz ritüel geçmişi yok.";
  }, [activity]);

  const readingText = useMemo(() => {
    const rows = takeTop(
      activity
        .filter((a) => !a.type.toLowerCase().includes("ritual"))
        .map((a) => `${a.type}: ${a.data}`),
      3
    );
    return rows.length ? rows.join("\n") : "Henüz kayıtlı okuma yok.";
  }, [activity]);

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
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable onPress={loadAll} style={styles.profileBadge}>
          <Text style={styles.profileBadgeTxt}>◎</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>MY AREA</Text>
        <Text style={styles.title}>Benim Alanım</Text>
        <Text style={styles.sub}>
          Sanrı burada seni hatırlamaya başlıyor.
        </Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.loadingTxt}>Yükleniyor…</Text>
          </View>
        ) : null}

        {err ? (
          <View style={styles.errCard}>
            <Text style={styles.errText}>{err}</Text>
          </View>
        ) : null}

        <Pressable
          style={styles.card}
          onPress={() => router.push("/(tabs)/profile" as any)}
        >
          <Text style={styles.cardTitle}>Profil</Text>
          <Text style={styles.cardText}>{profileText}</Text>
          <Text style={styles.cardHint}>Düzenlemek için dokun</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hafızam</Text>
          <Text style={styles.cardText}>{memoryText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ritüel Geçmişim</Text>
          <Text style={styles.cardText}>{ritualText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Okumalarım</Text>
          <Text style={styles.cardText}>{readingText}</Text>
        </View>

        <Pressable style={styles.actionBtn} onPress={loadAll}>
          <Text style={styles.actionTxt}>Yenile</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#07080d",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.36)",
  },

  topbar: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  backTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  profileBadge: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,247,216,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.28)",
  },

  profileBadgeTxt: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 120,
  },

  kicker: {
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
    marginBottom: 8,
  },

  sub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 22,
  },

  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  loadingTxt: {
    color: "rgba(255,255,255,0.7)",
  },

  errCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "rgba(255,90,90,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.18)",
  },

  errText: {
    color: "#ffd0d0",
    lineHeight: 20,
  },

  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardTitle: {
    color: "#7cf7d8",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },

  cardText: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 15,
    lineHeight: 24,
  },

  cardHint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },

  actionBtn: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.80)",
  },

  actionTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
});