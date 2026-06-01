import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from "react-native";
import { SanriHeader } from "../../components/SanriHeader";
import { SanctumBackground } from "../../components/SanctumBackground";
import { useVoiceStore, VOICE_PHASE } from "../../lib/voice";
import { COLORS, FONTS } from "../../lib/theme";

/**
 * Ses Ayarları — yol haritası mimarisi.
 * Faz hazır değilken tercih saklanır ama "Yakında" rozetiyle gösterilir;
 * faz açıldığında (config.ts) düğmeler otomatik etkin olur.
 */

function Row({
  title,
  desc,
  value,
  onChange,
  comingSoon,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  comingSoon?: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 14 }}>
        <View style={styles.titleLine}>
          <Text style={styles.rowTitle}>{title}</Text>
          {comingSoon ? (
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>YAKINDA</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "rgba(243,236,221,0.15)", true: "rgba(212,178,106,0.5)" }}
        thumbColor={value ? COLORS.gold : "#9a9384"}
        {...(Platform.OS === "web" ? { activeThumbColor: COLORS.gold } : {})}
      />
    </View>
  );
}

export default function VoiceSettingsScreen() {
  const sttEnabled = useVoiceStore((s) => s.sttEnabled);
  const ttsEnabled = useVoiceStore((s) => s.ttsEnabled);
  const autoPlay = useVoiceStore((s) => s.autoPlay);
  const setStt = useVoiceStore((s) => s.setSttEnabled);
  const setTts = useVoiceStore((s) => s.setTtsEnabled);
  const setAuto = useVoiceStore((s) => s.setAutoPlay);

  return (
    <View style={styles.root}>
      <SanctumBackground showRing={false}>
        <SanriHeader />
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.center}>
            <Text style={styles.h1}>Ses</Text>
            <Text style={styles.sub}>
              Sanrı'yı sesle kullanmak tamamen senin tercihin. İstediğin an kapatabilirsin.
            </Text>

            <Text style={styles.section}>KONUŞMA</Text>
            <Row
              title="Mikrofonla yaz"
              desc="Konuşarak yaz; Sanrı söylediklerini metne çevirsin."
              value={sttEnabled}
              onChange={setStt}
              comingSoon={!VOICE_PHASE.stt}
            />

            <Text style={styles.section}>DİNLEME</Text>
            <Row
              title="Sesli yanıt (Aura)"
              desc="Sanrı'nın yanıtlarını Aura'nın sesiyle dinle."
              value={ttsEnabled}
              onChange={setTts}
              comingSoon={!VOICE_PHASE.tts}
            />
            <Row
              title="Otomatik oynat"
              desc="Yeni yanıt geldiğinde kendiliğinden seslendirilsin."
              value={autoPlay}
              onChange={setAuto}
              comingSoon={!VOICE_PHASE.tts}
            />

            <Text style={styles.note}>
              Ses özellikleri aşamalı geliyor. Tercihlerin şimdiden kayıtlı tutulur; özellik
              açıldığında ek bir ayar yapmana gerek kalmaz.
            </Text>
          </View>
        </ScrollView>
      </SanctumBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  body: { paddingHorizontal: 22, paddingBottom: 36 },
  center: { width: "100%", maxWidth: 560, alignSelf: "center" },
  h1: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 36, letterSpacing: 0.3 },
  sub: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 15, lineHeight: 22, marginTop: 6 },
  section: {
    color: COLORS.goldDim,
    fontFamily: FONTS.bodyMed,
    letterSpacing: 3,
    fontSize: 12,
    marginTop: 26,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
  },
  titleLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowTitle: { color: COLORS.text, fontFamily: FONTS.serif, fontSize: 20 },
  rowDesc: { color: COLORS.textMuted, fontFamily: FONTS.body, fontSize: 13, lineHeight: 19, marginTop: 4 },
  badge: {
    backgroundColor: "rgba(212,178,106,0.16)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeTxt: { color: COLORS.gold, fontFamily: FONTS.bodyMed, fontSize: 9, letterSpacing: 1 },
  note: {
    color: COLORS.textFaint,
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
  },
});
