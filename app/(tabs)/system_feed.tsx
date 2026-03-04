import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  Pressable,
} from "react-native";

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import MatrixRain from "../../lib/MatrixRain";
import { apiGetJson, API } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Feed = {
  date: string;
  signal: string;
  symbol: string;
  message: string;
  action: string;
  share: string;
};

export default function SystemFeedScreen() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const data = await apiGetJson<Feed>(API.systemFeed, 30000);

        if (!alive) return;

        setFeed(data);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={BG} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.12} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />

      {/* TOP */}
      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </Pressable>

        <Text style={styles.title}>SYSTEM FEED</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {loading && <Text style={styles.note}>Loading...</Text>}

        {err ? <Text style={styles.err}>Error: {err}</Text> : null}

        {feed && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧠 Signal</Text>
              <Text style={styles.cardText}>{feed.signal}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔑 Symbol</Text>
              <Text style={styles.cardText}>{feed.symbol}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📡 Message</Text>
              <Text style={styles.cardText}>{feed.message}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚡ Action</Text>
              <Text style={styles.cardText}>{feed.action}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🌍 Share</Text>
              <Text style={styles.cardText}>{feed.share}</Text>
            </View>
          </>
        )}

        <View style={{ height: 160 }} />
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
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 10,
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
  },

  backTxt: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    padding: 18,
  },

  card: {
    marginTop: 14,
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  cardTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    fontSize: 16,
  },

  cardText: {
    color: "white",
    marginTop: 8,
    lineHeight: 22,
  },

  note: {
    color: "rgba(255,255,255,0.6)",
  },

  err: {
    color: "#ff6b8a",
  },
});