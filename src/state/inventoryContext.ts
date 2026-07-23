import { createContext } from "react";
import type { Vehicle } from "../types/vehicle";

export type PlaceBidResult =
  | { ok: true }
  | { ok: false; message: string };

export type InventoryContextValue = {
  vehicles: Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  placeBid: (vehicleId: string, amount: number) => PlaceBidResult;
};

export const InventoryContext = createContext<InventoryContextValue | null>(
  null,
);
