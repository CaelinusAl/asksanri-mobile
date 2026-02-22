const API_URL = "https://api.asksanri.com";

export async function askSanri(payload: {
  message: string;
  domain?: string;
  gate_mode?: string;
  persona?: string;
  session_id?: string;
}) {
  const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: payload.message,
      session_id: payload.session_id || "mobile",
      domain: payload.domain || "auto",
      gate_mode: payload.gate_mode || "mirror",
      persona: payload.persona || "user",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(String((data as any)?.detail || `HTTP ${res.status}`));
  return data;
}