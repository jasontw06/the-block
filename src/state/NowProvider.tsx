import { useEffect, useState, type ReactNode } from "react";
import { NowContext } from "./nowContext";

const DEFAULT_INTERVAL_MS = 60_000;

type NowProviderProps = {
  children: ReactNode;
  intervalMs?: number;
};

export function NowProvider({
  children,
  intervalMs = DEFAULT_INTERVAL_MS,
}: NowProviderProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}
