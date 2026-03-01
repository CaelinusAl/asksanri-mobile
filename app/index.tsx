// app/index.tsx
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/(tabs)/home");
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}