import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { hasVipEntitlement } from "../lib/revenuecat";

export default function ConsciousMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    hasVipEntitlement().then(setIsVip).catch(() => setIsVip(false));
  }, [open]);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.avatar} onPress={() => setOpen(true)}>
        <Text style={styles.avatarText}>◉</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.panel}>
          <Text style={styles.name}>
            {user ? user.email : "Misafir"}
          </Text>

          <Text style={styles.vip}>
            {isVip ? "VIP: Aktif ✦" : "VIP: Pasif"}
          </Text>

          <Pressable style={styles.item} onPress={() => { setOpen(false); router.push("/(tabs)/my_area"); }}>
            <Text style={styles.itemText}>Bilinç Alanım</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={() => { setOpen(false); router.push("/(tabs)/vip"); }}>
            <Text style={styles.itemText}>VIP Kapısını Aç</Text>
          </Pressable>

          <Pressable
            style={styles.item}
            onPress={() => {
              logout();
              setOpen(false);
            }}
          >
            <Text style={styles.itemText}>Çıkış</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 999,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.6)",
  },
  avatarText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    position: "absolute",
    top: 100,
    left: 16,
    width: 260,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(15,15,25,0.95)",
  },
  name: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
  level: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 6,
  },
  vip: {
    color: "#7cf7d8",
    marginTop: 6,
  },
  item: {
    marginTop: 18,
  },
  itemText: {
    color: "white",
  },
});