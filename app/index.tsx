import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getOnboarding } from "../lib/onboardingStore";

/**
 * Root entry — onboarding-bilen yönlendirici.
 *
 * Kural:
 *  - Onboarding tamamlanmamışsa → /(tabs) (onboarding ekranı = (tabs)/index.tsx)
 *  - Tamamlanmışsa → /(tabs)/daily (günün cümlesi)
 *
 * Eski `/rabbit` ve forced `/(auth)/login` redirect'i KALDIRILDI
 * (Apple 5.1.1(v) uyumu). Login sadece premium gate'inde açılır.
 */
export default function IndexScreen() {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ob = await getOnboarding();
        if (!alive) return;
        setTarget(ob.completed ? "/(tabs)/daily" : "/(tabs)");
      } catch {
        if (alive) setTarget("/(tabs)");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!target) return null;
  return <Redirect href={target as any} />;
}
