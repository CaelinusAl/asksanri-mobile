// app/(tabs)/index.tsx
import { Redirect } from "expo-router";

/** Varsayılan sekme: Kapılar. `null` + useEffect yerine anında yönlendirme — geri tuşunda boş/beyaz ekran oluşmaz. */
export default function TabsIndex() {
  return <Redirect href="/(tabs)/gates" />;
}
