// app/(tabs)/gates.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MatrixRain from "../../lib/MatrixRain";
import { useAuth } from "../../context/AuthContext";

const BG = require("../../assets/hologram_gate_bg.jpg");

export default function GatesScreen() {
  const { user, isLoading } = useAuth();
  const [lang, setLang] = useState<"tr" | "en">("tr");

  useEffect(() => {
  if (isLoading) return;
  if (!user) router.replace("/(auth)/login");
}, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7cf7d8" />
      </View>
    );
  }

  if (!user) return null;

  const t =
    lang === "tr"
      ? {
          title: "Kapılar",
          sub: "Hangi alana geçmek istiyorsun?",
          sanri: "Kişisel yansıma alanı",
          cities: "Şehrin kodunu seç",
          matrix: "Akışı decode et",
          ust: "Seviye 1–5 katmanları",
          world: "Haber → mesaj okuması",
        }
      : {
          title: "Gates",
          sub: "Choose your door.",
          sanri: "Personal reflection field",
          cities: "Choose a city code",
          matrix: "Decode the stream",
          ust: "Level 1–5 layers",
          world: "News → meaning",
        };

  return (
    <ImageBackground source={BG} style={{ flex: 1 }} resizeMode="cover">
      <LinearGradient
        colors={["#07080d", "#12082a", "#050610"]}
        style={StyleSheet.absoluteFillObject}
      />

      <MatrixRain opacity={0.15} />

      {/* TR EN */}
      <View style={styles.langRow}>
        <Pressable
          style={[styles.langBtn, lang === "tr" && styles.langActive]}
          onPress={() => setLang("tr")}
        >
          <Text style={styles.langTxt}>TR</Text>
        </Pressable>

        <Pressable
          style={[styles.langBtn, lang === "en" && styles.langActive]}
          onPress={() => setLang("en")}
        >
          <Text style={styles.langTxt}>EN</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.sub}>{t.sub}</Text>

        <GateItem
          title="SANRI"
          sub={t.sanri}
          onPress={() => router.push("/(tabs)/sanri_flow")}
        />

        <GateItem
          title="AWAKENED CITIES"
          sub={t.cities}
          onPress={() => router.push("/(tabs)/cities")}
        />

        <GateItem
          title="MATRIX"
          sub={t.matrix}
          onPress={() => router.push("/(tabs)/matrix")}
        />

        <GateItem
          title="ÜST BİLİNÇ"
          sub={t.ust}
          onPress={() => router.push("/(tabs)/ust")}
        />

        <GateItem
          title="DÜNYA OLAYLARI"
          sub={t.world}
          onPress={() => router.push("/(tabs)/world")}
        />
      </View>
    </ImageBackground>
  );
}

function GateItem({
  title,
  sub,
  onPress,
}: {
  title: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={["rgba(124,247,216,0.18)", "rgba(94,59,255,0.18)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardInner}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#07080d",
    alignItems: "center",
    justifyContent: "center",
  },
  langRow: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  langActive: {
    backgroundColor: "rgba(124,247,216,0.25)",
  },
  langTxt: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
  },
  sub: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: 30,
  },
  card: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardInner: {
    padding: 18,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSub: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
});