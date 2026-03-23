import { API_BASE } from "./config";

export async function logEvent(action: string, domain: string, meta: any = {}, session_id = "mobile-default") {
  const ctrl = new AbortController();
  const tmr = setTimeout(() => ctrl.abort(), 10000);
  try {
    await fetch(API_BASE + "/events/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, domain, meta, session_id }),
      signal: ctrl.signal,
    });
  } catch {
    // log fail olursa UI bozulmasin
  } finally {
    clearTimeout(tmr);
  }
}
