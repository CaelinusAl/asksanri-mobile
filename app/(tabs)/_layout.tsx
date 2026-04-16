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
      <Tabs.Screen name="index" />
      <Tabs.Screen name="my_area" />
      <Tabs.Screen name="gates" />
      <Tabs.Screen name="sanri_flow" />
      <Tabs.Screen name="awakenedCities" />
      <Tabs.Screen name="matrix" />
      <Tabs.Screen name="matrix_mini" />
      <Tabs.Screen name="matrix_rol" />
      <Tabs.Screen name="deep_reading" />
      <Tabs.Screen name="ust_bilinc" />
      <Tabs.Screen name="kod_ders" />
      <Tabs.Screen name="world_events" />
      <Tabs.Screen name="world" />
      <Tabs.Screen name="okuma_detail" />
      <Tabs.Screen name="ankod" />
      <Tabs.Screen name="book_reader" />
      <Tabs.Screen name="rituals" />
      <Tabs.Screen name="system_feed" />
      <Tabs.Screen name="daily_stream" />
      <Tabs.Screen name="weekly_symbol" />
      <Tabs.Screen name="symbol" />
      <Tabs.Screen name="pattern" />
      <Tabs.Screen name="observer" />
      <Tabs.Screen name="vip" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="admin" />
    </Tabs>
  );
}