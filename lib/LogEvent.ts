const API = "https://api.asksanri.com";

export async function logEvent(action: string, domain: string, meta: any = {}, session_id = "mobile-default") {
  try {
    await fetch(API + "/events/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, domain, meta, session_id }),
    });
  } catch {
    // log fail olursa UI bozulmasın
  }
}