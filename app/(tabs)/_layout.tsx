// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="gates" options={{ title: "Gates" }} />
      <Tabs.Screen name="awakenedCities" options={{ title: "Cities" }} />
      <Tabs.Screen name="sanri_flow" options={{ title: "Sanri" }} />
      <Tabs.Screen name="vip" options={{ title: "VIP" }} />
    </Tabs>
  );
}