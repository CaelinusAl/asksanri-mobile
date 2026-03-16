import React, { useEffect } from "react";
import { Tabs, router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05060B",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="my_area" />
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