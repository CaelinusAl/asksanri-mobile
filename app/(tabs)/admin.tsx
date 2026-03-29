import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { getAnalyticsSummary } from "../../lib/analytics";

const SAFE_TOP = Platform.OS === "ios" ? 56 : (StatusBar.currentHeight ?? 44);

type Summary = Awaited<ReturnType<typeof getAnalyticsSummary>>;

export default function AdminScreen() {
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)/gates");
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsSummary();
      setSummary(data);
    } catch (e) {
      if (__DEV__) console.log("Admin data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  const formatSeconds = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topbar}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/(tabs)/gates");
          }}
          style={styles.backBtn}
          hitSlop={10}
        >
          <Text style={styles.backTxt}>← Kapılar</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable onPress={loadData} style={styles.refreshBtn} hitSlop={10}>
          <Text style={styles.refreshTxt}>Yenile</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.adminBadge}>ADMIN</Text>
          <Text style={styles.h1}>Dashboard</Text>
        </View>

        <Text style={styles.sub}>
          {user?.email ?? user?.name ?? "—"} • {user?.role}
        </Text>

        {loading ? (
          <ActivityIndicator color="#7cf7d8" style={{ marginTop: 40 }} size="large" />
        ) : summary ? (
          <>
            {/* Row 1: Core metrics */}
            <View style={styles.grid}>
              <StatCard label="Toplam Event" value={String(summary.totalEvents)} color="#7cf7d8" />
              <StatCard label="Kullanıcı" value={String(summary.totalUsers)} color="#cbbcff" />
            </View>

            <View style={styles.grid}>
              <StatCard label="Oturum" value={String(summary.sessionStarts)} color="#7cf7d8" />
              <StatCard label="Mesaj" value={String(summary.messageSent)} color="#fff" />
            </View>

            {/* Row 2: VIP */}
            <View style={styles.grid}>
              <StatCard label="VIP Tıklama" value={String(summary.vipClicks)} color="#ff6b6b" />
              <StatCard label="VIP Açılma" value={String(summary.vipUnlocks)} color="#7cf7d8" />
            </View>

            {/* Row 3: Top items */}
            <View style={styles.grid}>
              <StatCard
                label="En Çok Mod"
                value={summary.topMode ? `${summary.topMode.name} (${summary.topMode.count})` : "—"}
                color="#fff"
              />
              <StatCard
                label="En Çok Şehir"
                value={summary.topCity ? `${summary.topCity.name} (${summary.topCity.count})` : "—"}
                color="#fff"
              />
            </View>

            <View style={styles.grid}>
              <StatCard
                label="En Çok Sayfa"
                value={summary.topPage ? `${summary.topPage.name} (${summary.topPage.count})` : "—"}
                color="#cbbcff"
              />
              <StatCard label="Event Türü" value={String(Object.keys(summary.modeCounts).length + Object.keys(summary.cityCounts).length + Object.keys(summary.pageCounts).length)} color="#cbbcff" />
            </View>

            {/* Mod distribution */}
            {Object.keys(summary.modeCounts).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mod Dağılımı</Text>
                {Object.entries(summary.modeCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <View key={name} style={styles.listRow}>
                      <Text style={styles.listLabel}>{name}</Text>
                      <Text style={styles.listValue}>{count}</Text>
                    </View>
                  ))}
              </View>
            ) : null}

            {/* City distribution */}
            {Object.keys(summary.cityCounts).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Şehir Dağılımı</Text>
                {Object.entries(summary.cityCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <View key={name} style={styles.listRow}>
                      <Text style={styles.listLabel}>{name}</Text>
                      <Text style={styles.listValue}>{count}</Text>
                    </View>
                  ))}
              </View>
            ) : null}

            {/* Page views */}
            {Object.keys(summary.pageCounts).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sayfa Görüntüleme</Text>
                {Object.entries(summary.pageCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <View key={name} style={styles.listRow}>
                      <Text style={styles.listLabel}>{name}</Text>
                      <Text style={styles.listValue}>{count}</Text>
                    </View>
                  ))}
              </View>
            ) : null}

            {/* Time spent */}
            {Object.keys(summary.timeSpent).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ekran Süreleri</Text>
                {Object.entries(summary.timeSpent)
                  .sort((a, b) => b[1] - a[1])
                  .map(([screen, seconds]) => (
                    <View key={screen} style={styles.listRow}>
                      <Text style={styles.listLabel}>{screen}</Text>
                      <Text style={styles.listValue}>{formatSeconds(seconds)}</Text>
                    </View>
                  ))}
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.empty}>Veri yüklenemedi.</Text>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#07080d" },

  topbar: {
    paddingTop: SAFE_TOP,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  backTxt: { color: "#7cf7d8", fontWeight: "800" },

  refreshBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(94,59,255,0.20)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.35)",
  },
  refreshTxt: { color: "#cbbcff", fontWeight: "800" },

  container: { paddingHorizontal: 18, paddingTop: 10 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },

  adminBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(255,59,59,0.20)",
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  h1: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
  },

  sub: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  statLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "900",
  },

  section: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  sectionTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 12,
    letterSpacing: 1,
  },

  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  listLabel: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "700",
    fontSize: 15,
  },

  listValue: {
    color: "#cbbcff",
    fontWeight: "900",
    fontSize: 16,
  },

  empty: {
    color: "rgba(255,255,255,0.45)",
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
  },
});
