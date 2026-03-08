// lib/registerPush.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiPostJson, API } from "@/lib/apiClient";

export async function registerPush(userId: string, lang: "tr" | "en" = "tr") {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const tokenRes = await Notifications.getExpoPushTokenAsync();
  const token = tokenRes.data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await apiPostJson(API.deviceRegister, {
    user_id: userId,
    device_token: token,
    platform: Platform.OS,
    lang,
  });

  return token;
}