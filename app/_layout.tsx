// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
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
