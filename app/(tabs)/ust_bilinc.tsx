import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function UstBilinçScreen() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#050610", "#0a0818", "#050610"]}
        style={StyleSheet.absoluteFillObject}
      />

      <Text style={styles.title}>SYSTEM VIEW</Text>

      <Text style={styles.subtitle}>
Reality is a simulation. {"\n"}
It is your choice to interpret.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>🌍 Dünya Olayları</Text>
        </Pressable>

        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>🧬 Sistem Haritası</Text>
        </Pressable>

        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>👁 Kod Görme Modu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 20,
    letterSpacing: 2,
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  btn: {
    backgroundColor: "rgba(94,59,255,0.25)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.45)",
  },
  btnText: {
    color: "white",
    fontWeight: "800",
    textAlign: "center",
  },
});