import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

/**
 * Ana Sayfa — "bilinç alanı" girişi.
 * Tek soru, nefes alan altın halka, örnek kartlar. ChatGPT hissi yok.
 */
export default function HomeScreen() {
  return (
    <PromptLanding
      ctx="home"
      title={"Bugün birlikte ne inşa ediyoruz?"}
      placeholder={[
        "Bir fikri netleştirmek istiyorum…",
        "Bir proje üzerinde çalışıyorum…",
        "Bir karar vermem gerekiyor…",
        "Bugün sadece konuşmak istiyorum…",
        "Nereden başlayacağımı bilmiyorum…",
      ]}
      examples={[
        "Bir fikri netleştir",
        "Bir proje başlat",
        "Bir karar ver",
      ]}
    />
  );
}
