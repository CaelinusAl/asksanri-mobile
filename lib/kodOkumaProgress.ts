import { storageGet, storageSet } from "./storage";
import { ALL_LESSONS, MODULES } from "./kodOkumaData";

const KEY = "kod_okuma_progress";

export type ProgressMap = Record<string, boolean>;

export async function getProgress(): Promise<ProgressMap> {
  try {
    const raw = await storageGet(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function markComplete(lessonId: string): Promise<ProgressMap> {
  const map = await getProgress();
  map[lessonId] = true;
  await storageSet(KEY, JSON.stringify(map));
  return map;
}

export function countCompleted(progress: ProgressMap): number {
  return ALL_LESSONS.filter((l) => progress[l.id]).length;
}

export function getPercentage(progress: ProgressMap): number {
  const total = ALL_LESSONS.length;
  if (total === 0) return 0;
  return Math.round((countCompleted(progress) / total) * 100);
}

export function getActiveModuleId(progress: ProgressMap): number {
  for (const mod of MODULES) {
    const allDone = mod.lessons.every((l) => progress[l.id]);
    if (!allDone) return mod.id;
  }
  return MODULES[MODULES.length - 1].id;
}

export function getNextIncompleteLesson(progress: ProgressMap) {
  return ALL_LESSONS.find((l) => !progress[l.id]) || ALL_LESSONS[0];
}

export function getModuleProgress(moduleId: number, progress: ProgressMap) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return { completed: 0, total: 0, percent: 0 };
  const total = mod.lessons.length;
  const completed = mod.lessons.filter((l) => progress[l.id]).length;
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}
