import React, { useEffect, useRef } from "react";
import { Tabs, usePathname } from "expo-router";
import { trackScreenView } from "../../lib/analytics";

/**
 * Tabs layout — yeni hatırlatıcı MVP yapısı.
 *
 * Apple uyumluluğu:
 * - Forced login KALDIRILDI (5.1.1(v)). Login sadece premium gate'inde
 *   tetiklenir. Diğer tüm yüzeyler anonim çalışır.
 * - Tab bar gizli (push-driven flow). Navigation: router.push("/(tabs)/X").
 * - Aktif yüzey ekranlar: index (onboarding), daily, chat, archive,
 *   silence, vip, my_area. Eski 21 ekran dosya olarak kalır ama tab
 *   listesinden çıkarıldı (web'de yaşamaya devam eder).
 */
export default function TabsLayout() {
  const pathname = usePathname();
  const prevPath = useRef<string>("");

  useEffect(() => {
    if (pathname && pathname !== prevPath.current) {
      prevPath.current = pathname;
      const screenName =
        pathname.replace(/^\/\(tabs\)\/?/, "").replace(/^\//, "") || "daily";
      trackScreenView(screenName);
    }
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      {/* ─── Yeni hatırlatıcı yüzeyi (5 ekran) ─── */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="daily" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="archive" />
      <Tabs.Screen name="silence" />

      {/* ─── Korunan altyapı ─── */}
      <Tabs.Screen name="vip" />
      <Tabs.Screen name="my_area" />
      <Tabs.Screen name="admin" />

      {/* ─── Eski ekranlar (kod kalır, tab listesinden çıkar) ─── */}
      {/* Web'e taşındı; Apple gözünden saklı. Geri açmak için yorumdan çıkar. */}
      {/*
      <Tabs.Screen name="gates" />
      <Tabs.Screen name="sanri_flow" />
      <Tabs.Screen name="awakenedCities" />
      <Tabs.Screen name="matrix" />
      <Tabs.Screen name="matrix_mini" />
      <Tabs.Screen name="matrix_rol" />
      <Tabs.Screen name="deep_reading" />
      <Tabs.Screen name="ust_bilinc" />
      <Tabs.Screen name="kod_ders" />
      <Tabs.Screen name="world_events" />
      <Tabs.Screen name="world" />
      <Tabs.Screen name="okuma_detail" />
      <Tabs.Screen name="ankod" />
      <Tabs.Screen name="book_reader" />
      <Tabs.Screen name="rituals" />
      <Tabs.Screen name="system_feed" />
      <Tabs.Screen name="daily_stream" />
      <Tabs.Screen name="weekly_symbol" />
      <Tabs.Screen name="symbol" />
      <Tabs.Screen name="pattern" />
      <Tabs.Screen name="observer" />
      <Tabs.Screen name="explore" />
      */}
    </Tabs>
  );
}
