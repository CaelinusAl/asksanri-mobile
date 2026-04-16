import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { initRevenueCat } from "../lib/revenuecat";
import { useEntitlementStore } from "../lib/entitlementStore";

export default function RootLayout() {
  const refreshEntitlements = useEntitlementStore((s) => s.refresh);

  useEffect(() => {
    initRevenueCat()
      .then((ok) => {
        if (ok) refreshEntitlements();
      })
      .catch((e) => {
        if (__DEV__) console.log("RevenueCat init error:", e);
      });
  }, [refreshEntitlements]);

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