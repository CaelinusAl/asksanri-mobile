import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

type Section = { label: string; text: string };
type Journey = { title: string; answer: string; sections: Section[] };

export default function AwakenedCitiesScreen() {
  const [plate, setPlate] = useState("34");
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchJourney = async () => {
    const p = plate.trim();
    if (!/^\d{2}$/.test(p)) {
      setErr("Lütfen 2 haneli plaka yaz. Örnek: 34");
      return;
    }

    setErr("");
    setLoading(true);
    setJourney(null);

    try {
      const res = await fetch(`https://api.asksanri.com/awakenmis-sehirler/${p}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.detail || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      setJourney(data);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#07080d" }}>
      <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>Uyanmış Şehirler</Text>
        <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
          Plakanı yaz. Harita açılır. Sanrı sormaz—şehir konuşur.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <TextInput
            value={plate}
            onChangeText={setPlate}
            keyboardType="number-pad"
            placeholder="34"
            placeholderTextColor="#777"
            style={{
              flex: 1,
              backgroundColor: "#111",
              color: "white",
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 12,
              fontSize: 16,
            }}
          />

          <TouchableOpacity
            onPress={fetchJourney}
            disabled={loading}
            style={{
              backgroundColor: "#5e3bff",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>{loading ? "…" : "Oku"}</Text>
          </TouchableOpacity>
        </View>

        {err ? (
          <View style={{ backgroundColor: "rgba(255,80,120,0.12)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <Text style={{ color: "#ffd7e1" }}>{err}</Text>
          </View>
        ) : null}

        {journey ? (
          <>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "800", marginBottom: 10 }}>
              {journey.title}
            </Text>

            {journey.sections?.map((s, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "white", fontWeight: "800", marginBottom: 6 }}>{s.label}</Text>
                <Text style={{ color: "rgba(255,255,255,0.85)", lineHeight: 20 }}>{s.text}</Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ color: "rgba(255,255,255,0.45)", marginTop: 10 }}>
            Örnek: 34, 06, 35, 42…
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

