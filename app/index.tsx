import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function IndexScreen() {
  const { isLoading } = useAuth();

  if (isLoading) return null;

  return <Redirect href="/rabbit" />;
}