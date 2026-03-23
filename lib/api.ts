import { API, apiPostJson } from "./apiClient";

export async function askSanri(payload: {
  message: string;
  domain?: string;
  gate_mode?: string;
  persona?: string;
  session_id?: string;
}) {
  return apiPostJson(
    API.ask,
    {
      message: payload.message,
      session_id: payload.session_id || "mobile",
      domain: payload.domain || "auto",
      gate_mode: payload.gate_mode || "mirror",
      persona: payload.persona || "user",
    },
    30000
  );
}