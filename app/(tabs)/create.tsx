import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

export default function CreateScreen() {
  return (
    <PromptLanding
      ctx="create"
      title="Bir şey inşa edelim."
      subtitle="Fikri yapılandır, sesini koru, üretime geç."
      placeholder={[
        "Bir kitap fikrim var…",
        "Bir reel serisi oluşturmak istiyorum…",
        "Markamı anlatan bir sistem kurmak istiyorum…",
        "Aklımda bir hikâye var…",
      ]}
      examples={["Kitap", "Reel", "Podcast", "Marka", "Sunum"]}
    />
  );
}
