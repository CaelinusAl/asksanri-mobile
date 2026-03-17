import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "sanri_token_v2";

async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function apiGetJson(url: string, timeout = 15000) {
  const token = await getToken();

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("API error: " + res.status);
  }

  return res.json();
}