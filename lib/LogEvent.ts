import { API_BASE } from "./config";
import { getSupabaseSession } from "./supabase";
import { getEventSessionId } from "./eventSession";

export async function logEvent(action: string, domain: string, meta: any = {}) {
  const ctrl = new AbortController();
  const tmr = setTimeout(() => ctrl.abort(), 10000);
  try {
    const session = await getSupabaseSession();
    if (!session?.access_token) return;
    const sessionId = await getEventSessionId();
    await fetch(API_BASE + "/events/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action, domain, meta, session_id: sessionId }),
      signal: ctrl.signal,
    });
  } catch {
    // log fail olursa UI bozulmasin
  } finally {
    clearTimeout(tmr);
  }
}
