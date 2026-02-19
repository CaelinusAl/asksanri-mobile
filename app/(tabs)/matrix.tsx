import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Base = {
  name_normalized: string;
  name_number: number;
  life_path: number;
  name_archetype: string;
  life_path_archetype: string;
  matrix_role: string;
  note?: string;
};

type HistoryItem = {
  ts: number;
  name: string;
  birth_date: string;
  base: Base;
  yorum?: string;
};

const HISTORY_KEY = "matrix_history_v1";
const USER_ID_KEY = "sanri_user_id_v1";

export default function MatrixScreen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [context, setContext] = useState("");

  const [userId, setUserId] = useState("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const [base, setBase] = useState<Base | null>(null);
  const [yorum, setYorum] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const API = "https://api.asksanri.com";

  const canSave = useMemo(() => !!base, [base]);
  const canDeep = useMemo(() => !!base && !loading, [base, loading]);

  // 🔹 USER ID üret
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(USER_ID_KEY);
      if (stored) {
        setUserId(stored);
        return;
      }

      const fresh =
        "u_" +
        Math.random().toString(16).slice(2) +
        Date.now().toString(16);

      await AsyncStorage.setItem(USER_ID_KEY, fresh);
      setUserId(fresh);
    })();
  }, []);

  // 🔹 Premium status çek
  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const res = await fetch(`${API}/premium/status`, {
          headers: {
            "X-User-Id": userId,
          },
        });

        const data = await res.json().catch(() => ({}));
        setDaysLeft(data?.days_left ?? null);
      } catch {}
    })();
  }, [userId]);

  // 🔹 History load
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    })();
  }, []);

  const persistHistory = async (items: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {}
  };

  const saveToHistory = async () => {
    if (!base) return;

    const item: HistoryItem = {
      ts: Date.now(),
      name,
      birth_date: birthDate,
      base,
      yorum: yorum || undefined,
    };

    const next = [item, ...history].slice(0, 10);
    setHistory(next);
    await persistHistory(next);
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  // 🔹 BASE ANALİZ
  const fetchBase = async () => {
    setErr("");
    setLoading(true);
    setYorum("");
    setBase(null);

    try {
      const res = await fetch(`${API}/matrix-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth_date: birthDate }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.detail || `HTTP ${res.status}`);
        return;
      }

      setBase(data);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 DERİN ANALİZ
  const fetchYorum = async () => {
    if (!base) return;

    setErr("");
    setLoading(true);
    setYorum("");

    try {
      const res = await fetch(`${API}/matrix-rol/yorum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId, // ✅ Premium kontrol
        },
        body: JSON.stringify({
          name,
          birth_date: birthDate,
          context,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 403) {
        const msg = String(data?.detail || "Premium gerekli.");
        setErr(msg);

        const match = msg.match(/Days left:\s*(\d+)/i);
        if (match) setDaysLeft(parseInt(match[1], 10));

        return;
      }

      if (!res.ok) {
        setErr(data?.detail || `HTTP ${res.status}`);
        return;
      }

      setYorum(String(data?.yorum || ""));
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#07080d" }}>
      {/* HEADER */}
      <View style={{ padding: 18 }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
          Matrix Rol Okuma
        </Text>

        <View
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 14,
            backgroundColor: "rgba(94,59,255,0.18)",
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "800" }}>
            Derin Analiz • Premium
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
            {daysLeft !== null
              ? `${daysLeft} gün sonra tekrar`
              : "30 günde 1 erişim"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Inputs */}
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
          placeholder="(Opsiyonel) Konu"
          placeholderTextColor="#777"
          multiline
          style={{ backgroundColor: "#111", color: "white", padding: 12, borderRadius: 12, minHeight: 70, marginBottom: 12 }}
        />

        {/* Buttons */}
        <TouchableOpacity
          onPress={fetchBase}
          style={{ backgroundColor: "#5e3bff", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>
            {loading ? "…" : "Hesapla"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={fetchYorum}
          disabled={!canDeep}
          style={{ backgroundColor: canDeep ? "#222" : "#111", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>
            Derin Analiz
          </Text>
        </TouchableOpacity>

        {err ? (
          <Text style={{ color: "#ff6b8a", marginTop: 6 }}>{err}</Text>
        ) : null}

        {base && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: "white", fontWeight: "800" }}>
              {base.name_normalized}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              İsim: {base.name_number} • Yol: {base.life_path}
            </Text>
          </View>
        )}

        {yorum && (
          <Text style={{ color: "white", marginTop: 12 }}>{yorum}</Text>
        )}
      </ScrollView>
    </View>
  );
}