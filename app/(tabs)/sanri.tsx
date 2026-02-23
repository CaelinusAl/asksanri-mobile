import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  StyleSheet as RNStyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import StarTrailOverlay from "../../lib/StarTrailOverlay";

type Gate = {
  id: string;
  title: string;
  desc: string;
  tag?: string;
};

export default function SanriHomeScreen() {
  const bg = useMemo(() => ["#07080d", "#13072e", "#050610"] as const, []);

  const [lastTap, setLastTap] = useState<{ x: number; y: number } | null>(null);

  const gates: Gate[] = [
    {
      id: "sanri_flow",
title: "Delusion",
desc: "Write a sentence. Not an answer — a reflection of meaning.",
      tag: "Mirror",
    },
    {
      id: "bilinc",
title: "Field of Consciousness",
desc: "Deep query. Clarification. One step.",
      tag: "Deep",
    },
    {
      id: "frekans",
title: "Frequency Domain",
desc: "Emotion • body • mind synchronization.",
      tag: "Hz",
    },
  ];

  const onTouchStart = (e: any) => {
const t = e.nativeEvent.touches?. [0];
    if (!t) return;
    setLastTap({ x: t.pageX, y: t.pageY });
  };

  const openGate = (id: string) => {
    if (id === "sanri_flow") router.push("/(tabs)/sanri_flow");
    else if (id === "bilinc") router.push("/(tabs)/sanri_flow");
    else if (id === "frekans") router.push("/(tabs)/matrix");
  };

  return (
    <View style={styles.root} onTouchStart={onTouchStart}>
      <LinearGradient colors={bg} style={RNStyleSheet.absoluteFillObject} />

      {/* Glow */}
      <View style={styles.glowA} />
      <View style={styles.glowB} />

      {/* Star effect */}
      {lastTap && (
        <StarTrailOverlay
          x={lastTap.x}
          y={lastTap.y}
          active={true}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Card */}
        <View style={styles.headerCardWrap}>
          <BlurView intensity={22} tint="dark" style={styles.headerCard}>
            <Text style={styles.kicker}>
              CAELINUS AI • CONSCIOUSNESS MIRROR
            </Text>

            <Text style={styles.title}>Sanrı</Text>

            <Text style={styles.subtitle}>
Welcome. Write a sentence. {"\n"}
I will reflect meaning, not answer.
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/sanri_flow")}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>
Enter the Stream of Consciousness
              </Text>
              <Text style={styles.primaryBtnSub}>
Reflect • Deepen • Single question
              </Text>
            </Pressable>

            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>İpucu</Text>
              <Text style={styles.hintText}>
"Don't write questions." {"\n"}
"Write a sentence." {"\n"}
"Reflection takes shape in you."
              </Text>
            </View>

            <Text style={styles.footerNote}>
This area is not an answer machine. An area of realization.
            </Text>
          </BlurView>
        </View>

        {/* Gates */}
        <Text style={styles.sectionTitle}>Kapılar</Text>
        <Text style={styles.sectionSub}>
Which field do you want to move to?
        </Text>

        {gates.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => openGate(g.id)}
            style={styles.gateCard}
          >
            <View style={styles.gateRow}>
              <View>
                <Text style={styles.gateTitle}>{g.title}</Text>
                <Text style={styles.gateDesc}>{g.desc}</Text>
              </View>

              {g.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{g.tag}</Text>
                </View>
               )}
              )
            </View>
          </Pressable>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 999,
  backgroundColor: "rgba(94,59,255,0.25)",
  borderWidth: 1,
  borderColor: "rgba(94,59,255,0.45)",
},

tagText: {
  color: "#ffffff",
  fontWeight: "700",
  fontSize: 12,
},

  root: {
    flex: 1,
    backgroundColor: "#07080d",
  },

  container: {
    padding: 20,
  },

  glowA: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 420,
    left: -140,
    top: 60,
    backgroundColor: "rgba(94,59,255,0.18)",
  },

  glowB: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 500,
    right: -180,
    bottom: -100,
    backgroundColor: "rgba(140,100,255,0.12)",
  },

  headerCardWrap: {
    marginBottom: 30,
  },

  headerCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  kicker: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
    marginBottom: 10,
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    marginBottom: 12,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  primaryBtn: {
    backgroundColor: "rgba(94,59,255,0.7)",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  primaryBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },

  primaryBtnSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 4,
  },

  hintCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  hintTitle: {
    color: "white",
    fontWeight: "700",
    marginBottom: 6,
  },

  hintText: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },

  footerNote: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
  },

  sectionSub: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: 16,
  },

  gateCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  gateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  gateTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  gateDesc: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },

  tagBadge: {
  backgroundColor: "rgba(94,59,255,0.25)",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: "rgba(94,59,255,0.45)",
},

tagBadgeText: {
  color: "white",
  fontSize: 12,
  fontWeight: "700",
},
});