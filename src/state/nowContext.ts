import { createContext } from "react";

export const NowContext = createContext<number>(Date.now());
