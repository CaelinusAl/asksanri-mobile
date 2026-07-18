import { storageGet, storageSet } from "./storage";

const EVENT_SESSION_KEY = "sanri_event_session_uuid";

function createUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function getEventSessionId(): Promise<string> {
  const stored = await storageGet(EVENT_SESSION_KEY);
  if (stored && /^[0-9a-f-]{36}$/i.test(stored)) {
    return stored;
  }

  const sessionId = createUuid();
  await storageSet(EVENT_SESSION_KEY, sessionId);
  return sessionId;
}
