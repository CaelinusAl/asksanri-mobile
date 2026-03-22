// lib/auth.ts — uses same storage layer as AuthContext (lib/storage.ts)
import { storageGet, storageSet, storageDelete } from "./storage";

const TOKEN_KEY = "user_token";

export async function setToken(token: string) {
  await storageSet(TOKEN_KEY, token);
}

export async function getToken() {
  return await storageGet(TOKEN_KEY);
}

export async function clearToken() {
  await storageDelete(TOKEN_KEY);
}