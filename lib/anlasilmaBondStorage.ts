/**
 * Anlaşılma Alanı — ziyaret / paylaşım durumu (yerel, isteğe bağlı geri dönüş mesajları).
 */
import { storageGet, storageSet } from "./storage";

export type AnlasilmaBondState = {
  totalVisits: number;
  shareCount: number;
  streak: number;
  lastVisitDay: string;
};

const KEY = (userId: string) => `sanri_anlasilma_bond_v1_${userId}`;

function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function loadBond(userId: string): Promise<AnlasilmaBondState | null> {
  try {
    const raw = await storageGet(KEY(userId));
    if (!raw) return null;
    const p = JSON.parse(raw) as AnlasilmaBondState;
    if (typeof p.totalVisits !== "number") return null;
    return p;
  } catch {
    return null;
  }
}

/** Ekran her odaklandığında: ziyaret sayısı + günlük seri. */
export async function recordVisit(userId: string): Promise<AnlasilmaBondState> {
  const prev = await loadBond(userId);
  const today = dayKey();
  let streak = prev?.streak ?? 0;
  const lastVisitDay = prev?.lastVisitDay ?? "";
  const totalVisits = (prev?.totalVisits ?? 0) + 1;
  const shareCount = prev?.shareCount ?? 0;

  if (lastVisitDay === today) {
    /* aynı gün tekrar giriş — seri aynı */
  } else if (lastVisitDay === yesterdayKey()) {
    streak = Math.max(1, streak + 1);
  } else if (!lastVisitDay) {
    streak = 1;
  } else {
    streak = 1;
  }

  const next: AnlasilmaBondState = {
    totalVisits,
    shareCount,
    streak,
    lastVisitDay: today,
  };
  await storageSet(KEY(userId), JSON.stringify(next));
  return next;
}

export async function recordShare(userId: string): Promise<void> {
  const prev = await loadBond(userId);
  if (!prev) {
    await storageSet(
      KEY(userId),
      JSON.stringify({
        totalVisits: 1,
        shareCount: 1,
        streak: 1,
        lastVisitDay: dayKey(),
      } satisfies AnlasilmaBondState)
    );
    return;
  }
  await storageSet(
    KEY(userId),
    JSON.stringify({ ...prev, shareCount: prev.shareCount + 1 } satisfies AnlasilmaBondState)
  );
}

export function displayNameHint(user: { name?: string | null; email?: string | null } | null | undefined): string {
  const n = user?.name?.trim();
  if (n) return n.split(/\s+/)[0] ?? n;
  const e = user?.email?.trim();
  if (e) return e.split("@")[0] || "";
  return "";
}

/** Karşılama metni — geri dönüş / seri / paylaşım sayısına göre kişiselleştirilir. */
export function getBondHero(
  lang: "tr" | "en",
  firstName: string,
  bond: AnlasilmaBondState | null,
  repeatVisitSameDay: boolean
): { line1: string; line2: string } {
  const name = firstName.trim();
  const streak = bond?.streak ?? 0;
  const shares = bond?.shareCount ?? 0;
  const visits = bond?.totalVisits ?? 1;

  if (lang === "tr") {
    if (visits <= 1) {
      return {
        line1: name ? `${name}, şu an yalnız değilsin.` : "Şu an yalnız değilsin.",
        line2: "Bu alan seni yargılamıyor — sadece gerçekten duymaya çalışıyor.",
      };
    }
    if (repeatVisitSameDay) {
      return {
        line1: "Yine buradasın.",
        line2: "İyi ki geldin — alan bugün de senin için açık.",
      };
    }
    if (streak >= 7) {
      return {
        line1: name ? `${name}, bir haftadır bu eşiği geçiyorsun.` : "Bir haftadır bu eşiği geçiyorsun.",
        line2: "Bu bir zorunluluk değil; tekrar dönmek istediğin bir yer oluştu.",
      };
    }
    if (streak >= 3) {
      return {
        line1: "Üç gündür alana adım atıyorsun.",
        line2: "Beden bunu hatırlar: burada dünya durmadan dinlendi.",
      };
    }
    if (shares >= 5) {
      return {
        line1: name ? `${name}, kelimelerin burada iz bıraktı.` : "Kelimelerin burada iz bıraktı.",
        line2: "Her bırakış, alanın seni biraz daha tanımasına izin veriyor.",
      };
    }
    return {
      line1: name ? `Tekrar hoş geldin, ${name}.` : "Tekrar hoş geldin.",
      line2: "Anlaşılmak için burada olman yeterli — açıklama borcun yok.",
    };
  }

  if (visits <= 1) {
    return {
      line1: name ? `${name}, you're not alone in this room.` : "You're not alone in this room.",
      line2: "No verdict here — only a real attempt to hear you.",
    };
  }
  if (repeatVisitSameDay) {
    return {
      line1: "You're still here.",
      line2: "Good. The field stays open for you today.",
    };
  }
  if (streak >= 7) {
    return {
      line1: name ? `${name}, a week of crossings.` : "A week of crossings.",
      line2: "Not an obligation — a corner that learned your name.",
    };
  }
  if (streak >= 3) {
    return {
      line1: "Three days in a row.",
      line2: "Your body remembers: here, you were heard without pleading.",
    };
  }
  if (shares >= 5) {
    return {
      line1: name ? `${name}, your words left traces.` : "Your words left traces here.",
      line2: "Each share lets the field recognise you a little more.",
    };
  }
  return {
    line1: name ? `Welcome back, ${name}.` : "Welcome back.",
    line2: "Being here to be understood is enough — you owe no proof.",
  };
}
