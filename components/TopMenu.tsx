// components/TopMenu.tsx
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { router, usePathname } from "expo-router";

type Item = {
  key: string;
  title: string;
  sub: string;
  route: string;
  icon: string;      // emoji
  premium?: boolean; // true => VIP gate
};

export default function TopMenu({ isVip = false }: { isVip?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const ITEMS: Item[] = useMemo(
    () => [
      { key: "home", title: "HOME", sub: "Start", route: "/(tabs)/home", icon: "⌂" },
      { key: "gates", title: "GATES", sub: "Kapılar", route: "/(tabs)/gates", icon: "⟠" },

      { key: "cities", title: "CITIES", sub: "Awakened Cities", route: "/(tabs)/explore", icon: "⧉" },
      { key: "sanri", title: "SANRI", sub: "Personal Field", route: "/(tabs)/sanri_flow", icon: "◉" },
      { key: "matrix", title: "MATRIX", sub: "Decode Stream", route: "/(tabs)/matrix", icon: "⌬" },

      // VIP gates (örnek: istersen kapıları değiştirebiliriz)
      { key: "ust", title: "ÜST BİLİNÇ", sub: "Higher Mind", route: "/(tabs)/ust_bilinc", icon: "✶", premium: true },
      { key: "world", title: "WORLD", sub: "World Events", route: "/(tabs)/world_events", icon: "⌁", premium: true },
    ],
    []
  );

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
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>GATES</Text>
            <Text style={styles.sheetSub}>Choose your door.</Text>
          </View>

          {ITEMS.map((it) => {
            const active = pathname === it.route;
            const locked = Boolean(it.premium) && !isVip;

            return (
              <Pressable
                key={it.key}
                style={[styles.card, active && styles.cardActive, locked && styles.cardLocked]}
                onPress={() => {
                  setOpen(false);
                  if (locked) {
                    router.push("/(tabs)/vip");
                    return;
                  }
                  router.push(it.route as any);
                }}
              >
                <View style={styles.cardLeft}>
                  <Text style={[styles.icon, locked && { opacity: 0.55 }]}>{it.icon}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <Text style={[styles.cardTitle, locked && { opacity: 0.85 }]}>{it.title}</Text>

                    {it.premium ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{locked ? "LOCKED" : "VIP"}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={[styles.cardSub, locked && { opacity: 0.7 }]}>{it.sub}</Text>
                </View>

                <Text style={styles.chev}>{locked ? "🔒" : "›"}</Text>
              </Pressable>
            );
          })}
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
    elevation: 9999,
  },
  btn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(124,247,216,0.25)",
  },
  btnTxt: { color: "white", fontSize: 20, fontWeight: "900" },

  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },

  sheet: {
    position: "absolute",
    top: 72,
    right: 14,
    width: 292,
    borderRadius: 20,
    padding: 12,
    backgroundColor: "rgba(10,10,18,0.94)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  sheetHeader: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 10 },
  sheetTitle: { color: "rgba(124,247,216,0.9)", fontSize: 12, fontWeight: "900", letterSpacing: 3 },
  sheetSub: { color: "rgba(255,255,255,0.45)", marginTop: 4, fontSize: 12 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 10,
  },
  cardActive: {
    borderColor: "rgba(124,247,216,0.35)",
    backgroundColor: "rgba(124,247,216,0.08)",
  },
  cardLocked: {
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  cardLeft: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(94,59,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(94,59,255,0.25)",
  },
  icon: { color: "white", fontWeight: "900", fontSize: 16 },

  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  cardTitle: { color: "white", fontWeight: "900", letterSpacing: 1 },
  cardSub: { color: "rgba(255,255,255,0.6)", marginTop: 3, fontSize: 12 },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(94,59,255,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  chev: { color: "rgba(255,255,255,0.6)", fontSize: 18, fontWeight: "900" },
});