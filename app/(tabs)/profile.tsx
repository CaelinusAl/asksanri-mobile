import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
  useEffect(() => {
    // direkt gerçek profile ekranına yönlendir
    router.replace("/(tabs)/my_area");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#05060B",
      }}
    >
      <ActivityIndicator color="#7cf7d8" />
    </View>
  );
}