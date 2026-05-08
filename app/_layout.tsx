import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SystemUI from "expo-system-ui";
import { AuthProvider } from "../context/AuthContext";
import { initRevenueCat } from "../lib/revenuecat";
import { useEntitlementStore } from "../lib/entitlementStore";
import { initSessionTracking, cleanupSessionTracking } from "../lib/analytics";

const APP_BG = "#07080d";

// Hatırlatıcı MVP — uygulama her zaman `/` (index) ile açılır.
// Buradaki `index.tsx` onboarding state'ine göre /(tabs) ya da
// /(tabs)/daily'ye yönlendirir. Eski `/rabbit` artık entry değil.
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
    return () => cleanupSessionTracking();
  }, []);

  // Sistem UI arka planı koyu — Expo Go ve native build'de Android nav bar
  // ve iOS bottom area uygulamanın rengiyle aynı. Beyaz kenar görünmesin.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(APP_BG).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="rabbit" />
      </Stack>
    </AuthProvider>
  );
}