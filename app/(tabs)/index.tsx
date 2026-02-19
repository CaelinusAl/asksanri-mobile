import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { GATES } from "@/constants/gates";

export default function Home() {
  const router = useRouter();

  const handlePress = (g: any) => {
    // ✅ Uyanmış Şehirler: Sanrı'ya değil, Şehirler ekranına git
    if (g.domain === "awakened_cities") {
      router.push({
        pathname: "/(tabs)/explore",
        params: { plate: g.prefill || "34" }, // explore ekranında istersen kullanırız
      });
      return;
    }

    // ✅ Diğer kapılar: Sanrı ekranına
    router.push({
      pathname: "/sanri",
      params: {
        mode: g.mode,
        domain: g.domain,
        prefill: g.prefill,
        title: g.title,
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#07080d", padding: 18 }}>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "800", marginTop: 12 }}>
        Kapılar
      </Text>

      <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 6, marginBottom: 16 }}>
        Bir kapı seç. Alan açılır.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {GATES.map((g: any) => (
          <TouchableOpacity
            key={g.id}
            onPress={() => handlePress(g)}
            style={{
              width: "48%",
              backgroundColor: "rgba(255,255,255,0.08)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              padding: 14,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>{g.title}</Text>
            <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{g.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: "rgba(255,255,255,0.45)", marginTop: 16, fontSize: 12 }}>
        © 2026 CaelinusAI • SANRI
      </Text>
    </View>
  );
}
