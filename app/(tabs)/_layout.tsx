// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // ✅ tabbar tamamen kapalı
        tabBarStyle: { display: "none" },
      }}
    >
      {/* Tabs içinde hangi ekranlar varsa tanımlı kalsın, ama tabbar görünmeyecek */}
      <Tabs.Screen name="gates" />
      <Tabs.Screen name="sanri_flow" />
      <Tabs.Screen name="awakenedCities" />
      <Tabs.Screen name="matrix" />
      <Tabs.Screen name="ust_bilinc" />
      <Tabs.Screen name="world_events" />
      <Tabs.Screen name="vip" />
      <Tabs.Screen name="explore" />
    </Tabs>
  );
}