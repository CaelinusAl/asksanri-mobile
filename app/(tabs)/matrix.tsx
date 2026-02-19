import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

type Base = {
  name_normalized: string;
  name_number: number;
  life_path: number;
  name_archetype: string;
  life_path_archetype: string;
  matrix_role: string;
  note?: string;
};

export default function MatrixScreen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [context, setContext] = useState("");
  const [base, setBase] = useState<Base | null>(null);
  const [yorum, setYorum] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API = "https://api.asksanri.com";

  const fetchBase = async () => {
    setErr(""); setLoading(true); setYorum(""); setBase(null);
    try {
      const res = await fetch(`${API}/matrix-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth_date: birthDate }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data?.detail || `HTTP ${res.status}`); setLoading(false); return; }
      setBase(data);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const fetchYorum = async () => {
    if (!base) return;
    setErr(""); setLoading(true); setYorum("");
    try {
      const res = await fetch(`${API}/matrix-rol/yorum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth_date: birthDate, context }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setErr(data?.detail || `HTTP ${res.status}`); setLoading(false); return; }
      setYorum(data?.yorum || "");
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#07080d" }}>
      <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>Matrix Rol Okuma</Text>
        <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
          Ad–Soyad + Doğum Tarihi → Rol Haritası
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
          placeholderTextColor="#777"
          style={{ backgroundColor: "#111", color: "white", padding: 12, borderRadius: 12, marginBottom: 10 }}
        />
        <TextInput
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="GG.AA.YYYY"
          placeholderTextColor="#777"
          style={{ backgroundColor: "#111", color: "white", padding: 12, borderRadius: 12, marginBottom: 10 }}
        />
        <TextInput
          value={context}
          onChangeText={setContext}
          placeholder="(Opsiyonel) Şu an yaşadığın konu…"
          placeholderTextColor="#777"
          multiline
          style={{ backgroundColor: "#111", color: "white", padding: 12, borderRadius: 12, minHeight: 70, marginBottom: 12 }}
        />

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={fetchBase}
            disabled={loading}
            style={{ flex: 1, backgroundColor: "#5e3bff", padding: 12, borderRadius: 12, alignItems: "center" }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>{loading ? "…" : "Hesapla"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={fetchYorum}
            disabled={loading || !base}
            style={{
              flex: 1,
              backgroundColor: base ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>{loading ? "…" : "Derin Yorum"}</Text>
          </TouchableOpacity>
        </View>

        {err ? (
          <View style={{ marginTop: 12, backgroundColor: "rgba(255,80,120,0.12)", borderRadius: 12, padding: 12 }}>
            <Text style={{ color: "#ffd7e1" }}>{err}</Text>
          </View>
        ) : null}

        {base ? (
          <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
            <Text style={{ color: "white", fontWeight: "900", marginBottom: 6 }}>{base.name_normalized}</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>İsim Sayısı: {base.name_number} • {base.name_archetype}</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Yaşam Yolu: {base.life_path} • {base.life_path_archetype}</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", marginTop: 10 }}>{base.matrix_role}</Text>
          </View>
        ) : null}

        {yorum ? (
          <View style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }}>
            <Text style={{ color: "white", fontWeight: "900", marginBottom: 8 }}>Derin Yorum</Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", lineHeight: 20 }}>{yorum}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}