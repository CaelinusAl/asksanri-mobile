import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function TwoFAScreen() {
  const { setSession } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");

  const onVerify = async () => {
  try {
    const res = await fetch("https://api.asksanri.com/auth/2fa/verify-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      Alert.alert("Hata", data?.detail || "2FA başarısız");
      return;
    }

    await setSession({
      token: data.token,
      user: {
        id: String(data.user_id || email),
        email,
      },
    });

    router.replace("/(tabs)/gates");
  } catch (e) {
    Alert.alert("Hata", "Bağlantı hatası");
  }
};

  return (
    <View style={styles.root}>
      <Text style={styles.title}>2FA Kodunu Gir</Text>
      <Text style={styles.sub}>{email}</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="6 haneli kod"
        keyboardType="number-pad"
        maxLength={6}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={onVerify}>
        <Text style={styles.buttonText}>Doğrula</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0d14",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  sub: {
    color: "#aaa",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#161a24",
    color: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#6c4cff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});