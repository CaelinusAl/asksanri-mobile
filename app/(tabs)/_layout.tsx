import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b0d12",
          borderTopColor: "rgba(255,255,255,0.08)",
        },
        tabBarActiveTintColor: "#5e3bff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
      }}
    >
      {/* ✅ Visible tabs */}
      <Tabs.Screen
        name="sanri"
        options={{
          title: "Sanrı",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbubble-ellipses" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />

      {/* Eğer şehirler dosyan explore.tsx ise bu kalsın */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Şehirler",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="map" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="matrix"
        options={{
          title: "Matrix",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="sparkles" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />

      {/* ✅ Hidden routes (tab’da görünmesin ama route çalışsın) */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="sanri_flow" options={{ href: null }} />
    </Tabs>
  );
}