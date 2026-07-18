import { LEGACY_ASK_DISABLED_MESSAGE } from "./apiClient";

/**
 * Legacy ask helper. Intentionally fail-closed under PMP-01A.1.
 * Callers must migrate to authenticated V1 chat instead of this transport.
 */
export async function askSanri(_payload: {
  message: string;
  domain?: string;
  gate_mode?: string;
  persona?: string;
  session_id?: string;
}) {
  throw new Error(LEGACY_ASK_DISABLED_MESSAGE);
}
