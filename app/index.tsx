import React from "react";
import { Redirect } from "expo-router";

/**
 * Root entry — Rabbit'e yönlendirir.
 *
 * Akış:
 *  /  →  /rabbit  (ruh dolu giriş ekranı, matrix + tavşan)
 *           ↓ kullanıcı "Frekans Alanı Aç" basınca
 *           ↓
 *           rabbit.tsx onboarding state'ini okur:
 *             - tamamlanmamışsa  → /(tabs)         (onboarding)
 *             - tamamlanmışsa    → /(tabs)/daily    (günün cümlesi)
 *
 * Önemli: Eskiden rabbit guest'i /(auth)/login'e zorluyordu — bu Apple
 * 5.1.1(v) ihlaliydi. Artık rabbit kapısı her zaman onboarding ya da
 * daily'ye açılır; login sadece premium gate'inde gerekir.
 */
export default function IndexScreen() {
  return <Redirect href={"/rabbit" as any} />;
}
