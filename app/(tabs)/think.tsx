import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

export default function ThinkScreen() {
  return (
    <PromptLanding
      ctx="think"
      title="Birlikte düşünelim."
      subtitle="AURA cevap vermeden önce soruyu netleştirir."
      placeholder={[
        "Bir meseleyi netleştirmek istiyorum…",
        "Karar vermekte zorlanıyorum…",
        "Buna başka nasıl bakabilirim?",
      ]}
      examples={[
        "Bir kararın içindeyim",
        "Kafam çok dağınık",
        "Farklı bir perspektif istiyorum",
      ]}
    />
  );
}
