import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

/** Günlük — "Günlüğünü yaz". */
export default function JournalScreen() {
  return (
    <PromptLanding
      ctx="journal"
      title={"Günlüğünü yaz"}
      subtitle="Bugünü birlikte toplayalım."
      placeholder="Bugün nasıl geçti?"
      examples={["Bugün iyiydi", "Zor bir gündü", "Bir şey fark ettim"]}
    />
  );
}
