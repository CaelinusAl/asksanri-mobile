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
      <Tabs.Screen
        name="index"
        options={{
          title: "Sanrı",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbubble-ellipses" size={focused ? 24 : 20} color={color} />
          ),
        }}
      />

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
    </Tabs>
  );
}