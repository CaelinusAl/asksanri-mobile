import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { trackEvent } from "./analytics";

export function useScreenTime(
  screen: string,
  userId?: string | number
) {
  const startRef = useRef(Date.now());
  const activeRef = useRef(true);

  useEffect(() => {
    startRef.current = Date.now();
    activeRef.current = true;

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background" || state === "inactive") {
        if (activeRef.current) {
          flush();
          activeRef.current = false;
        }
      } else if (state === "active") {
        startRef.current = Date.now();
        activeRef.current = true;
      }
    });

    return () => {
      flush();
      sub.remove();
    };
  }, [screen, userId]);

  function flush() {
    const seconds = Math.round((Date.now() - startRef.current) / 1000);
    if (seconds < 2) return;

    trackEvent("time_spent", {
      userId,
      meta: { screen, seconds },
    });
  }
}
