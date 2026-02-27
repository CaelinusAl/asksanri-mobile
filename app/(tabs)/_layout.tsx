import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      // ✅ tabbar'ı tamamen kaldırır
      tabBar={() => null}
    >
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="sanri" />
      <Tabs.Screen name="matrix" />
      <Tabs.Screen name="ust_bilinc" />
      <Tabs.Screen name="sanri_flow" options={{ href: null }} />
    </Tabs>
  );
}