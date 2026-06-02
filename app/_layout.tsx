import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SystemUI from "expo-system-ui";
import {
  useFonts,
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { AuthProvider } from "../context/AuthContext";
import { initRevenueCat } from "../lib/revenuecat";
import { useEntitlementStore } from "../lib/entitlementStore";
import { useVoiceStore } from "../lib/voice";
import { initSessionTracking, cleanupSessionTracking, trackAppOpen } from "../lib/analytics";

const APP_BG = "#070B16";

// Hatırlatıcı MVP — uygulama her zaman `/` (index) ile açılır.
// Akış:
//   /  →  /rabbit  (atmospheric giriş, matrix + tavşan)
//          ↓ "Frekans Alanı Aç"
//          ↓
//          → /(tabs)         (onboarding henüz tamamlanmadıysa)
//          → /(tabs)/daily   (tamamlandıysa, günün cümlesi)
// Login zorlaması yok — Apple 5.1.1(v) korumalı.
export const unstable_settings = {
  initialRouteName: "index",
};

// Bildirim foreground davranışı — uygulama açıkken de banner görünsün.
// (Lokal scheduled reminder'lar için. expo-notifications SDK 54+ shape.)
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export default function RootLayout() {
  const refreshEntitlements = useEntitlementStore((s) => s.refresh);

  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  // Web-only: tarayıcı otomatik çevirisini kapat. Native'de no-op.
  // Test sırasında Chrome Translate'in metinleri kurcalamasını engeller.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    try {
      if (typeof document !== "undefined") {
        document.documentElement.lang = "tr";
        document.documentElement.setAttribute("translate", "no");
        document.documentElement.classList.add("notranslate");
        let meta = document.querySelector('meta[name="google"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "google");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", "notranslate");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    initRevenueCat()
      .then((ok) => {
        if (ok) refreshEntitlements();
      })
      .catch((e) => {
        if (__DEV__) console.log("RevenueCat init error:", e);
      });
  }, [refreshEntitlements]);

  useEffect(() => {
    initSessionTracking();
    // FAZ 1: açılış + "tekrar gelen kullanıcı" / install yaşı (retention).
    trackAppOpen();
    return () => cleanupSessionTracking();
  }, []);

  // Ses tercihlerini (kalıcı) yükle — UI bağlantıları buna göre görünür.
  useEffect(() => {
    useVoiceStore.getState().load();
  }, []);

  // Sistem UI arka planı koyu — Expo Go ve native build'de Android nav bar
  // ve iOS bottom area uygulamanın rengiyle aynı. Beyaz kenar görünmesin.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(APP_BG).catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: APP_BG }} />;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="rabbit" />
      </Stack>
    </AuthProvider>
  );
}