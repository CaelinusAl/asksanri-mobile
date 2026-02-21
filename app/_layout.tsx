import { Stack } from "expo-router";
import "react-native-reanimated";

import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export default function RootLayout() {
  useEffect(() => {
    const initRevenueCat = async () => {
      try {
       
        const ANDROID_PUBLIC_KEY = "test_CveiYtwWpfCbhKzLDyFvwdrutcq";

        if (Platform.OS === "android") {
          await Purchases.configure({
            apiKey: ANDROID_PUBLIC_KEY,
          });
        }

        console.log("RevenueCat initialized");
      } catch (e) {
        console.log("RevenueCat init error:", e);
      }
    };

    initRevenueCat();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}