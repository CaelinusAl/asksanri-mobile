import "react-native-reanimated";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { initRevenueCatOnce } from "../lib/revenuecat";

export default function RootLayout() {
  useEffect(() => {
    initRevenueCatOnce();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}