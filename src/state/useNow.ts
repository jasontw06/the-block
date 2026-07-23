import { useContext } from "react";
import { NowContext } from "./nowContext";

export function useNow(): number {
  return useContext(NowContext);
}
