import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

/** Rüyalar — "Rüyanı anlat". */
export default function DreamsScreen() {
  return (
    <PromptLanding
      ctx="dream"
      title={"Rüyanı anlat"}
      subtitle="Sembollerine birlikte bakalım."
      placeholder="Rüyanda ne gördün?"
      examples={["Düşüyordum", "Eski bir evdeydim", "Su gördüm", "Birini kaybettim"]}
    />
  );
}
