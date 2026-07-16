import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

export default function ProjectsScreen() {
  return (
    <PromptLanding
      ctx="projects"
      title="Projeyi birlikte taşıyalım."
      subtitle="Hedef, sprint, kararlar ve sonraki en küçük adım."
      placeholder={[
        "Yeni bir proje başlatmak istiyorum…",
        "Projem dağıldı; nereden devam edelim?",
        "Bugünkü en küçük adımı bulalım…",
      ]}
      examples={["Yeni proje", "Sprint planla", "Son checkpoint", "Riskleri gör"]}
    />
  );
}
