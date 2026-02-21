import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPremiumStatus, matrixBase, matrixDeep } from "../../lib/api"; // yolunu klasörüne göre düzelt

type Base = {
  name_normalized: string;
  name_number: number;
  life_path: number;
  name_archetype?: string;
  life_path_archetype?: string;
  matrix_role: string;
  note?: string;
  teaser?: string;
};

const USER_ID_KEY = "sanri_user_id_v1";

export default function MatrixScreen() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [context, setContext] = useState("");

  const [userId, setUserId] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const [base, setBase] = useState<Base | null>(null);
  const [yorum, setYorum] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const canDeep = useMemo(() => !!base && !loading, [base, loading]);

  // ✅ USER ID üret
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(USER_ID_KEY);
      if (stored) return setUserId(stored);

      const fresh = "u_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
      await AsyncStorage.setItem(USER_ID_KEY, fresh);
      setUserId(fresh);
    })();
  }, []);

  const refreshPremium = async () => {
    if (!userId) return;
    try {
      const data = await getPremiumStatus(userId);
      setIsPremium(Boolean(data?.is_premium));
      setDaysLeft(data?.days_left ?? null);
    } catch {}
  };

  useEffect(() => {
    refreshPremium();
  }, [userId]);

  // ✅ BASE (Free)
  const fetchBase = async () => {
    setErr("");
    setLoading(true);
    setYorum("");
    setBase(null);

    try {
      const data = await matrixBase({ name, birth_date: birthDate });
      setBase(data as Base);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEEP (Premium)
  const fetchYorum = async () => {
    if (!base) return;

    setErr("");
    setLoading(true);
    setYorum("");

    try {
      const data = await matrixDeep({
        userId,
        name,
        birth_date: birthDate,
        context,
      });

      setYorum(String((data as any)?.yorum || ""));
      refreshPremium();
    } catch (e: any) {
      if (e?.status === 403) {
        setErr(String(e?.message || "SANRI INNER CIRCLE gerekli."));
        if (typeof e?.days_left === "number") setDaysLeft(e.days_left);
        return;
      }
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const onJoinInnerCircle = () => {
    setErr("Store doğrulaması tamamlanınca satın alma aktif olacak.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#07080d" }}>
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
            borderWidth: 1,
            borderColor: "rgba(94,59,255,0.30)",
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "900" }}>
            SANRI INNER CIRCLE
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.65)", textAlign: "center", marginTop: 6 }}>
            {isPremium
              ? daysLeft === 0 || daysLeft === null
                ? "Bugün erişim hakkın var"
                : `${daysLeft} gün sonra tekrar`
              : "Premium ile Derin Katmana Geç"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
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

        <TouchableOpacity
          onPress={fetchBase}
          style={{ backgroundColor: "#5e3bff", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>
            {loading ? "…" : "Hesapla"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={fetchYorum}
          disabled={!canDeep}
          style={{
            backgroundColor: canDeep ? "#222" : "#111",
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 10,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>
            {isPremium ? "Derin Analiz" : "Derin Analiz (Kilitli) 🔒"}
          </Text>
        </TouchableOpacity>

        {!isPremium && (
          <TouchableOpacity
            onPress={onJoinInnerCircle}
            style={{
              backgroundColor: "rgba(94,59,255,0.35)",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "rgba(94,59,255,0.35)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>
              SANRI INNER CIRCLE’e Katıl
            </Text>
          </TouchableOpacity>
        )}

        {err ? <Text style={{ color: "#ff6b8a", marginTop: 6 }}>{err}</Text> : null}

        {base && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>
              {base.name_normalized}
            </Text>

            <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
              İsim: {base.name_number} • Yol: {base.life_path}
            </Text>

            <Text style={{ color: "rgba(255,255,255,0.9)", marginTop: 10 }}>
              {base.matrix_role}
            </Text>

            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontWeight: "900" }}>
                Mini Açılım
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 20 }}>
                {String(base.teaser || "—")}
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 12 }}>
                Derin Analizde açılacaklar:
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.75)", marginTop: 6, lineHeight: 20 }}>
                • Kişisel Rol (3-6 madde){"\n"}
                • Kolektif Rol (3-6 madde){"\n"}
                • Ruh Görevi + Bugün 1 Adım
              </Text>

              <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 10 }}>
                Bu açılımın kökü Derin Analizde açılır.
              </Text>
            </View>
          </View>
        )}

        {yorum ? (
          <View
            style={{
              marginTop: 12,
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            <Text style={{ color: "white", fontWeight: "900", marginBottom: 8 }}>
              Derin Analiz
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.9)", lineHeight: 20 }}>
              {yorum}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}