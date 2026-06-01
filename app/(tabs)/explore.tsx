import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { SanriHeader } from "../../components/SanriHeader";
import { SanctumBackground } from "../../components/SanctumBackground";
import { COLORS, FONTS } from "../../lib/theme";

type Card = {
  tag: string;
  title: string;
  body: string;
  seed?: string;
};

/**
 * Keşfet — içgörü, sembol, farkındalık ve öneriler.
 * Premium altın/lacivert dil; kart dokununca Sanrı sohbetine geçer.
 */
const SECTIONS: { heading: string; cards: Card[] }[] = [
  {
    heading: "Günün İçgörüsü",
    cards: [
      {
        tag: "İçgörü",
        title: "Duyguların bir mesajı vardır",
        body: "Hissettiğin şey seni yargılamaz; sana bir şey anlatmaya çalışır. Bugün bir duygunu adlandır.",
        seed: "Bugün yoğun bir duygu hissediyorum ama adını koyamıyorum.",
      },
    ],
  },
  {
    heading: "Bir Sembol",
    cards: [
      {
        tag: "Sembol",
        title: "Kapı",
        body: "Kapı, bir geçiş ve seçim anını temsil eder. Şu an hayatında hangi kapının önünde duruyorsun?",
        seed: "Bir karar eşiğindeyim, hangi yöne gideceğimi bilemiyorum.",
      },
    ],
  },
  {
    heading: "Farkındalık",
    cards: [
      {
        tag: "Alışkanlık",
        title: "Üç nefes kuralı",
        body: "Tepki vermeden önce üç yavaş nefes al. Bu küçük boşluk, davranışını seçme alanını açar.",
      },
    ],
  },
  {
    heading: "Öneriler",
    cards: [
      {
        tag: "Dene",
        title: "Bugünü tek cümlede özetle",
        body: "Günlüğüne bugünü anlatan tek bir cümle yaz. Netlik çoğu zaman sadelikte saklıdır.",
        seed: "Bugünü tek bir cümlede özetlemek istiyorum.",
      },
    ],
  },
];

export default function ExploreScreen() {
  const open = (seed?: string) => {
    if (seed) router.push({ pathname: "/(tabs)/chat", params: { seed, ctx: "home" } } as any);
  };

  return (
    <View style={styles.root}>
      <SanctumBackground showRing={false}>
        <SanriHeader />
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.center}>
            <Text style={styles.h1}>Keşfet</Text>
            <Text style={styles.sub}>İçgörü, sembol ve küçük farkındalık adımları.</Text>

            {SECTIONS.map((sec) => (
              <View key={sec.heading} style={{ marginTop: 24, width: "100%" }}>
                <Text style={styles.heading}>{sec.heading}</Text>
                {sec.cards.map((c) => (
                  <Pressable key={c.title} onPress={() => open(c.seed)} style={styles.card}>
                    <Text style={styles.cardTag}>{c.tag.toUpperCase()}</Text>
                    <Text style={styles.cardTitle}>{c.title}</Text>
                    <Text style={styles.cardBody}>{c.body}</Text>
                    {c.seed ? <Text style={styles.cardCta}>Sanrı ile konuş →</Text> : null}
                  </Pressable>
                ))}
              </View>
            ))}

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>
      </SanctumBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  body: { paddingHorizontal: 22, paddingBottom: 24 },
  center: { width: "100%", maxWidth: 560, alignSelf: "center" },
  h1: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 36, letterSpacing: 0.3 },
  sub: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 15, marginTop: 6 },
  heading: {
    color: COLORS.goldDim,
    fontFamily: FONTS.bodyMed,
    letterSpacing: 3,
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  cardTag: { color: COLORS.gold, fontFamily: FONTS.bodyMed, fontSize: 11, letterSpacing: 2, marginBottom: 8 },
  cardTitle: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 22, marginBottom: 8 },
  cardBody: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 14, lineHeight: 21 },
  cardCta: { color: COLORS.gold, fontFamily: FONTS.bodyMed, fontSize: 13, marginTop: 12 },
});
