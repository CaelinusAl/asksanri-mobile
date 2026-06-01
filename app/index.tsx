import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { getOnboarding } from "../lib/onboardingStore";

/**
 * Root entry — sadeleştirilmiş açılış.
 *
 * Eski ezoterik "matrix + tavşan" (rabbit) giriş ekranı akıştan çıkarıldı
 * (rabbit.tsx dosyası duruyor ama artık launch'ta değil). Apple 4.3(b) +
 * "3 saniyede anla" hedefi.
 *
 * Akış:
 *   onboarding tamamlanmamış → /onboarding (tek seferlik)
 *   tamamlanmış              → /(tabs)      (Ana Sayfa: "Bugün aklından ne geçiyor?")
 *
 * Login zorlaması yok (5.1.1(v)).
 */
export default function IndexScreen() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ob = await getOnboarding();
        if (!alive) return;
        setTarget(ob.completed ? "/(tabs)" : "/onboarding");
      } catch {
        if (alive) setTarget("/onboarding");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (target) router.replace(target as any);
  }, [target]);

  return <View style={{ flex: 1, backgroundColor: "#07080d" }} />;
}
