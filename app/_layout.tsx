// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { initRevenueCat } from "../lib/revenuecat"; // ✅ yol: app/_layout.tsx -> lib/revenuecat.ts

export default function RootLayout() {
  useEffect(() => {
    // ✅ RevenueCat init (app açılışında 1 kez)
    initRevenueCat().catch((e) => {
      console.log("RevenueCat init error:", e);
    });
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs ana uygulama */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* City detail: app/city/[code].tsx */}
      <Stack.Screen
        name="city/[code]"
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack>
  );
}