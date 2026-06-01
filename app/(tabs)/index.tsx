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
      title={"Kendini anlat…"}
      subtitle="Sanrı dinliyor."
      placeholder="Aklından geçeni yaz…"
      examples={[
        "Bugün huzursuzum",
        "Bir karar veremiyorum",
        "İçim sıkışıyor",
        "Yorgun hissediyorum",
      ]}
    />
  );
}
