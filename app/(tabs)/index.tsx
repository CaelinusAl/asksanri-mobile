// app/(tabs)/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";

export default function TabsIndex() {
  useEffect(() => {
    router.replace("/(tabs)/home");
  }, []);

  return null;
}