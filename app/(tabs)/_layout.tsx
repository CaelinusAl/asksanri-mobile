import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { trackScreenView } from "../../lib/analytics";
import { COLORS, FONTS } from "../../lib/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

const ACTIVE = COLORS.cyan;
const INACTIVE = "rgba(244,247,255,0.4)";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  const TabIcon = ({ color, size }: { color: string; size: number }) => {
    const active = color === ACTIVE;
    return (
      <View style={[styles.iconWrap, active && styles.iconActive]}>
        <Ionicons name={name} size={size ?? 24} color={color} />
      </View>
    );
  };
  TabIcon.displayName = `TabIcon(${name})`;
  return TabIcon;
}

/**
 * Tabs layout — 5 görünür sekme:
 *   Ana · Düşün · Üret · Projeler · Keşfet
 *
 * Sessizlik ve Hesabım hamburger menüye alındı (SanriHeader).
 * Diğer tüm eski/ezoterik ekranlar dosya olarak duruyor ama tab bar'dan
 * çıkarıldı (href: null) — gerekirse router.push ile hâlâ erişilebilir.
 * Apple 4.3(b) + "3 saniyede anla" hedefi.
 */
export default function TabsLayout() {
  const pathname = usePathname();
  const prevPath = useRef<string>("");
  const insets = useSafeAreaInsets();
  // Android sistem navigasyon barı / iOS home indicator ile çakışmasın.
  const bottomInset = Math.max(insets.bottom, 8);

  useEffect(() => {
    if (pathname && pathname !== prevPath.current) {
      prevPath.current = pathname;
      const screenName =
        pathname.replace(/^\/\(tabs\)\/?/, "").replace(/^\//, "") || "home";
      trackScreenView(screenName);
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: COLORS.bgDeep,
          borderTopWidth: 0,
          height: 66 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
          shadowColor: COLORS.cyan,
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 },
          elevation: 0,
        },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 12, fontFamily: FONTS.bodyMed, letterSpacing: 0.4 },
      }}
    >
      {/* ─── 5 görünür sekme ─── */}
      <Tabs.Screen
        name="index"
        options={{ title: "Ana", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="think"
        options={{ title: "Düşün", tabBarIcon: tabIcon("bulb-outline") }}
      />
      <Tabs.Screen
        name="create"
        options={{ title: "Üret", tabBarIcon: tabIcon("create-outline") }}
      />
      <Tabs.Screen
        name="projects"
        options={{ title: "Projeler", tabBarIcon: tabIcon("briefcase-outline") }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Keşfet", tabBarIcon: tabIcon("compass-outline") }}
      />

      {/* ─── Tab bar'dan gizli (erişilebilir) ─── */}
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="daily" options={{ href: null }} />
      <Tabs.Screen name="archive" options={{ href: null }} />
      <Tabs.Screen name="silence" options={{ href: null }} />
      <Tabs.Screen name="voice_settings" options={{ href: null }} />
      <Tabs.Screen name="my_area" options={{ href: null }} />
      <Tabs.Screen name="vip" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="dreams" options={{ href: null }} />
      <Tabs.Screen name="relationships" options={{ href: null }} />

      {/* ─── Eski / ezoterik ekranlar — gizli ─── */}
      <Tabs.Screen name="gates" options={{ href: null }} />
      <Tabs.Screen name="sanri_flow" options={{ href: null }} />
      <Tabs.Screen name="awakenedCities" options={{ href: null }} />
      <Tabs.Screen name="matrix" options={{ href: null }} />
      <Tabs.Screen name="matrix_mini" options={{ href: null }} />
      <Tabs.Screen name="matrix_rol" options={{ href: null }} />
      <Tabs.Screen name="deep_reading" options={{ href: null }} />
      <Tabs.Screen name="ust_bilinc" options={{ href: null }} />
      <Tabs.Screen name="kod_ders" options={{ href: null }} />
      <Tabs.Screen name="world_events" options={{ href: null }} />
      <Tabs.Screen name="world" options={{ href: null }} />
      <Tabs.Screen name="okuma_detail" options={{ href: null }} />
      <Tabs.Screen name="ankod" options={{ href: null }} />
      <Tabs.Screen name="book_reader" options={{ href: null }} />
      <Tabs.Screen name="rituals" options={{ href: null }} />
      <Tabs.Screen name="system_feed" options={{ href: null }} />
      <Tabs.Screen name="daily_stream" options={{ href: null }} />
      <Tabs.Screen name="weekly_symbol" options={{ href: null }} />
      <Tabs.Screen name="symbol" options={{ href: null }} />
      <Tabs.Screen name="pattern" options={{ href: null }} />
      <Tabs.Screen name="observer" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActive: {
    backgroundColor: "rgba(169,244,242,0.08)",
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
});
