import { useCallback } from "react";
import { useBus } from "react-bus";

export function useAuthTrigger() {
  const bus = useBus();

  const triggerAuth = useCallback(() => {
    bus.emit("auth");
  }, [bus]);

  return triggerAuth;
}
