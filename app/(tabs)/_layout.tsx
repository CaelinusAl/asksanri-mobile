import { Tabs } from "expo-router";
import React from "react";

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
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Şehirler",
        }}
      />
    </Tabs>
  );
}
 <Tabs.Screen
  name="matrix"
  options={{
    title: "Matrix",
    tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
  }}
/>