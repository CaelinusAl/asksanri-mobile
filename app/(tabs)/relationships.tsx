import React from "react";
import { PromptLanding } from "../../components/PromptLanding";

/** İlişkiler — "İlişkini anlat". */
export default function RelationshipsScreen() {
  return (
    <PromptLanding
      ctx="relationship"
      title={"İlişkini anlat"}
      subtitle="Duyguları birlikte çözelim."
      placeholder="İlişkinde neler oluyor?"
      examples={["Kırgınım", "Güven sorunu var", "Yalnız hissediyorum", "Kararsızım"]}
    />
  );
}
