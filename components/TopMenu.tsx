import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { router } from "expo-router";

type Item = { title: string; route: string; sub?: string };

const ITEMS: Item[] = [
  { title: "CITIES", route: "/(tabs)/explore", sub: "Awakened Cities" },
  { title: "SANRI", route: "/(tabs)/sanri", sub: "Personal Field" },
  { title: "MATRIX", route: "/(tabs)/matrix", sub: "Decode Stream" },
  { title: "ÜST BİLİNÇ", route: "/(tabs)/ust_bilinc", sub: "Higher Mind" },
  { title: "WORLD", route: "/(tabs)/world_events", sub: "Dünya Olayları" },
];

export default function TopMenu() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable style={styles.btn} onPress={() => setOpen(true)} hitSlop={12}>
        <Text style={styles.btnTxt}>≡</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>

        <View style={styles.sheet}>
          <Text style={styles.title}>MENU</Text>

          {ITEMS.map((it) => (
            <Pressable
              key={it.route}
              style={styles.item}
              onPress={() => {
                setOpen(false);
                router.push(it.route);
              }}
            >
              <Text style={styles.itemTitle}>{it.title}</Text>
              {it.sub ? <Text style={styles.itemSub}>{it.sub}</Text> : null}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
  position: "absolute",
  top: 14,
  right: 14,
  zIndex: 9999,
  elevation: 9999,   // Android için şart
},
  btn: {
  width: 46,
  height: 46,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.55)",
  borderWidth: 1,
  borderColor: "rgba(120,255,220,0.25)",
},
  btnTxt: { color: "white", fontSize: 20, fontWeight: "900" },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },

  sheet: {
    position: "absolute",
    top: 72,
    right: 14,
    width: 220,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(10,10,18,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "900", marginBottom: 10, letterSpacing: 2 },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  itemTitle: { color: "white", fontWeight: "900" },
  itemSub: { color: "rgba(255,255,255,0.6)", marginTop: 3, fontSize: 12 },
});