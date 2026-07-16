import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

/** Rüyalar — sakin bir hatırlama alanı. */
export default function DreamsScreen() {
  return (
    <PromptLanding
      ctx="dream"
      title={"Bu gece ne gördün?"}
      subtitle="Hatırladığın ilk görüntü ne?"
      placeholder={["Anlat…", "Hatırladığın ilk görüntü ne?", "Bu gece aklında kalan neydi?"]}
      examples={["🫧 Su", "🏠 Ev", "🕊️ Uçmak", "👤 Tanıdık biri", "🌑 Karanlık", "🌳 Orman"]}
    />
  );
}
