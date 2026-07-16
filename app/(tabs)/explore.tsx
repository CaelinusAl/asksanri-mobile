import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

export default function ExploreScreen() {
  return (
    <PromptLanding
      ctx="explore"
      title="İçeride ne hareket ediyor?"
      subtitle="AURA yorum dayatmaz; kendi anlamını bulmana eşlik eder."
      placeholder={[
        "Bu gece aklımda kalan bir rüya var…",
        "Bir sembolü anlamaya çalışıyorum…",
        "Bugün kendime dürüstçe bakmak istiyorum…",
        "Serbestçe çağrışım yapmak istiyorum…",
      ]}
      examples={["🫧 Rüya", "◌ Sembol", "✎ Günlük", "∞ Serbest çağrışım"]}
    />
  );
}
