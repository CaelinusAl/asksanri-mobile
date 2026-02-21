const API_URL = "https://api.asksanri.com";

async function readJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = String((data as any)?.detail || `HTTP ${res.status}`);
    throw new Error(msg);
  }
  return data;
}

export async function getPremiumStatus(userId: string) {
  const res = await fetch(`${API_URL}/premium/status`, {
    headers: { "X-User-Id": userId },
  });
  return readJson(res) as Promise<{ is_premium?: boolean; days_left?: number | null }>;
}

export async function matrixBase(payload: { name: string; birth_date: string }) {
  const res = await fetch(`${API_URL}/matrix-rol`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return readJson(res);
}

export async function matrixDeep(payload: {
  userId: string;
  name: string;
  birth_date: string;
  context?: string;
}) {
  const res = await fetch(`${API_URL}/matrix-rol/yorum`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": payload.userId,
    },
    body: JSON.stringify({
      name: payload.name,
      birth_date: payload.birth_date,
      context: payload.context || "",
    }),
  });

  // 403 ise JSON detail’ı yakalayalım
  const data = await res.json().catch(() => ({}));
  if (res.status === 403) {
    const msg = String((data as any)?.detail || "SANRI INNER CIRCLE gerekli.");
    const err: any = new Error(msg);
    err.status = 403;
    err.days_left = (() => {
      const m = msg.match(/Days left:\s*(\d+)/i);
      return m ? parseInt(m[1], 10) : null;
    })();
    throw err;
  }

  if (!res.ok) throw new Error(String((data as any)?.detail || `HTTP ${res.status}`));
  return data;
}
