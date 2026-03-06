import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import MatrixRain from "../../lib/MatrixRain";
import { API, apiGetJson, apiPostJson } from "@/lib/apiClient";

const BG = require("../../assets/sanri_glass_bg.jpg");

type Lang = "tr" | "en";

type ProfileData = {
  id?: number | null;
  name: string;
  email: string;
  language: string;
  bio: string;
  intention: string;
  vip?: boolean;
};

export default function ProfileScreen() {
  const [lang, setLang] = useState<Lang>("tr");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    language: "tr",
    bio: "",
    intention: "",
    vip: false,
  });

  const t = useMemo(
    () =>
      lang === "tr"
        ? {
            kicker: "MY IDENTITY FIELD",
            title: "Profil",
            subtitle: "Burada Sanrı seni daha derinden tanımaya başlar.",
            back: "Geri",
            name: "İsim",
            email: "Email",
            bio: "Bio",
            intention: "Niyet",
            bioPlaceholder: "Kendini birkaç cümleyle anlat...",
            intentionPlaceholder: "Şu anki ana niyetin ne?",
            save: "Kaydet",
            saving: "Kaydediliyor...",
            loading: "Profil yükleniyor...",
            saved: "Profil kaydedildi.",
            retry: "Tekrar Dene",
            vipOn: "VIP Aktif",
            vipOff: "Standart Katman",
            error: "Profil alınamadı.",
            langTitle: "Dil Alanı",
          }
        : {
            kicker: "MY IDENTITY FIELD",
            title: "Profile",
            subtitle: "This is where Sanri begins to know you more deeply.",
            back: "Back",
            name: "Name",
            email: "Email",
            bio: "Bio",
            intention: "Intention",
            bioPlaceholder: "Describe yourself in a few lines...",
            intentionPlaceholder: "What is your current main intention?",
            save: "Save",
            saving: "Saving...",
            loading: "Loading profile...",
            saved: "Profile saved.",
            retry: "Try Again",
            vipOn: "VIP Active",
            vipOff: "Standard Layer",
            error: "Profile could not be loaded.",
            langTitle: "Language Field",
          },
    [lang]
  );

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setErr("");

    try {
      const data = await apiGetJson<ProfileData>(`${API.base}/profile`, 30000);

      setProfile({
        id: data?.id ?? null,
        name: data?.name || "",
        email: data?.email || "",
        language: data?.language || "tr",
        bio: data?.bio || "",
        intention: data?.intention || "",
        vip: Boolean(data?.vip || false),
      });

      const incomingLang =
        String(data?.language || "tr").toLowerCase() === "en" ? "en" : "tr";
      setLang(incomingLang);
    } catch (e: any) {
      setErr(String(e?.message || e || t.error));
      setProfile({
        name: "",
        email: "",
        language: "tr",
        bio: "",
        intention: "",
        vip: false,
      });
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setErr("");

    try {
      const payload = {
        ...profile,
        language: lang,
      };

      await apiPostJson(`${API.base}/profile/update`, payload, 30000);

      setProfile((prev) => ({
        ...prev,
        language: lang,
      }));

      Alert.alert("Sanrı", t.saved);
    } catch (e: any) {
      setErr(String(e?.message || e || "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={BG}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <MatrixRain opacity={0.08} />
      </View>

      <View pointerEvents="none" style={styles.overlay} />
      <View pointerEvents="none" style={styles.glowA} />
      <View pointerEvents="none" style={styles.glowB} />

      <View style={styles.topbar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>{t.back}</Text>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View style={styles.langWrap}>
          <Pressable
            onPress={() => setLang("tr")}
            style={[styles.langChip, lang === "tr" && styles.langChipActive]}
          >
            <Text
              style={[styles.langTxt, lang === "tr" && styles.langTxtActive]}
            >
              TR
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setLang("en")}
            style={[styles.langChip, lang === "en" && styles.langChipActive]}
          >
            <Text
              style={[styles.langTxt, lang === "en" && styles.langTxtActive]}
            >
              EN
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{t.kicker}</Text>
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <BlurView intensity={28} tint="dark" style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {(profile.name || "S").slice(0, 1).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>
                {profile.name || (lang === "tr" ? "İsimsiz Alan" : "Unnamed Field")}
              </Text>
              <Text style={styles.heroMail}>
                {profile.email || (lang === "tr" ? "email henüz girilmedi" : "email not entered yet")}
              </Text>
            </View>

            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>
                {profile.vip ? t.vipOn : t.vipOff}
              </Text>
            </View>
          </View>
        </BlurView>

        {loading ? (
          <View style={styles.infoCard}>
            <ActivityIndicator />
            <Text style={styles.infoText}>{t.loading}</Text>
          </View>
        ) : err ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{err}</Text>
            <Pressable onPress={loadProfile} style={styles.retryBtn}>
              <Text style={styles.retryText}>{t.retry}</Text>
            </Pressable>
          </View>
        ) : null}

        <BlurView intensity={24} tint="dark" style={styles.formCard}>
          <Text style={styles.sectionTitle}>{t.name}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.name}
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={profile.name}
            onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))}
          />

          <Text style={styles.sectionTitle}>{t.email}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.email}
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={profile.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(v) => setProfile((p) => ({ ...p, email: v }))}
          />

          <Text style={styles.sectionTitle}>{t.bio}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder={t.bioPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={profile.bio}
            multiline
            textAlignVertical="top"
            onChangeText={(v) => setProfile((p) => ({ ...p, bio: v }))}
          />

          <Text style={styles.sectionTitle}>{t.intention}</Text>
          <TextInput
            style={[styles.input, styles.textareaSmall]}
            placeholder={t.intentionPlaceholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={profile.intention}
            multiline
            textAlignVertical="top"
            onChangeText={(v) => setProfile((p) => ({ ...p, intention: v }))}
          />

          <Text style={styles.sectionTitle}>{t.langTitle}</Text>
          <View style={styles.langFieldRow}>
            <Pressable
              onPress={() => setLang("tr")}
              style={[styles.selectChip, lang === "tr" && styles.selectChipActive]}
            >
              <Text
                style={[
                  styles.selectChipText,
                  lang === "tr" && styles.selectChipTextActive,
                ]}
              >
                Türkçe
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLang("en")}
              style={[styles.selectChip, lang === "en" && styles.selectChipActive]}
            >
              <Text
                style={[
                  styles.selectChipText,
                  lang === "en" && styles.selectChipTextActive,
                ]}
              >
                English
              </Text>
            </Pressable>
          </View>
        </BlurView>

        <Pressable
          onPress={saveProfile}
          disabled={saving}
          style={[styles.saveBtn, saving && { opacity: 0.75 }]}
        >
          {saving ? (
            <View style={styles.saveRow}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.saveText}>{t.saving}</Text>
            </View>
          ) : (
            <Text style={styles.saveText}>{t.save}</Text>
          )}
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
    backgroundColor: "rgba(4,6,14,0.42)",
  },

  glowA: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(104, 76, 255, 0.16)",
    top: 120,
    left: -80,
  },

  glowB: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(124,247,216,0.08)",
    bottom: 120,
    right: -60,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  backArrow: {
    color: "#7cf7d8",
    fontSize: 18,
    fontWeight: "900",
  },

  backText: {
    color: "rgba(255,255,255,0.82)",
    fontWeight: "800",
  },

  langWrap: {
    flexDirection: "row",
    gap: 8,
  },

  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  langChipActive: {
    backgroundColor: "rgba(124,247,216,0.10)",
    borderColor: "rgba(124,247,216,0.28)",
  },

  langTxt: {
    color: "rgba(255,255,255,0.68)",
    fontWeight: "900",
    letterSpacing: 1,
  },

  langTxtActive: {
    color: "#7cf7d8",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 120,
  },

  kicker: {
    color: "rgba(255,255,255,0.50)",
    letterSpacing: 2,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.74)",
    marginTop: 8,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
  },

  heroCard: {
    borderRadius: 26,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  heroName: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },

  heroMail: {
    marginTop: 4,
    color: "rgba(255,255,255,0.60)",
    fontSize: 13,
  },

  vipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(124,247,216,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.24)",
  },

  vipBadgeText: {
    color: "#7cf7d8",
    fontSize: 11,
    fontWeight: "900",
  },

  infoCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    gap: 10,
  },

  infoText: {
    color: "rgba(255,255,255,0.80)",
  },

  errorCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "rgba(255,90,90,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,120,120,0.20)",
  },

  errorText: {
    color: "#ffd2d2",
    lineHeight: 22,
  },

  retryBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(94,59,255,0.80)",
  },

  retryText: {
    color: "white",
    fontWeight: "900",
  },

  formCard: {
    borderRadius: 26,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  sectionTitle: {
    color: "#7cf7d8",
    fontWeight: "900",
    marginBottom: 8,
    marginTop: 10,
    fontSize: 15,
  },

  input: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    fontSize: 15,
  },

  textarea: {
    minHeight: 120,
  },

  textareaSmall: {
    minHeight: 92,
  },

  langFieldRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  selectChip: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  selectChipActive: {
    backgroundColor: "rgba(124,247,216,0.12)",
    borderColor: "rgba(124,247,216,0.24)",
  },

  selectChipText: {
    color: "rgba(255,255,255,0.72)",
    fontWeight: "800",
  },

  selectChipTextActive: {
    color: "#7cf7d8",
  },

  saveBtn: {
    marginTop: 18,
    borderRadius: 20,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  saveText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});