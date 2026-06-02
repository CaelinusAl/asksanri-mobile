import React, { useEffect, useRef } from "react";
import { Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { trackScreenView } from "../../lib/analytics";
import { COLORS, FONTS } from "../../lib/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

const ACTIVE = COLORS.gold;
const INACTIVE = "rgba(243,236,221,0.4)";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size ?? 22} color={color} />
  );
}

/**
 * Tabs layout — 5 görünür sekme (Option E):
 *   Ana Sayfa · Günlük · Rüyalar · İlişkiler · Keşfet
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
          borderTopColor: COLORS.surfaceBorder,
          borderTopWidth: 1,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 11, fontFamily: FONTS.bodyMed, letterSpacing: 0.3 },
      }}
    >
      {/* ─── 5 görünür sekme ─── */}
      <Tabs.Screen
        name="index"
        options={{ title: "Ana Sayfa", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: "Günlük", tabBarIcon: tabIcon("book-outline") }}
      />
      <Tabs.Screen
        name="dreams"
        options={{ title: "Rüyalar", tabBarIcon: tabIcon("moon-outline") }}
      />
      <Tabs.Screen
        name="relationships"
        options={{ title: "İlişkiler", tabBarIcon: tabIcon("heart-outline") }}
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
