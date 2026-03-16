import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { initRevenueCat } from "../lib/revenuecat";

export default function RootLayout() {
  useEffect(() => {
    initRevenueCat().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="rabbit" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}