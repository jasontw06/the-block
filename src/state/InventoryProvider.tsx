import { useCallback, useMemo, useReducer, type ReactNode } from "react";
import { vehicles as baseVehicles } from "../data/vehicles";
import {
  loadPersistedBidState,
  savePersistedBidState,
  type PersistedBidState,
  type VehicleBidOverride,
} from "../lib/bidStorage";
import { toFiniteNumber } from "../lib/format";
import type { Vehicle } from "../types/vehicle";
import {
  InventoryContext,
  type InventoryContextValue,
  type PlaceBidResult,
} from "./inventoryContext";

type InventoryState = {
  overrides: Record<string, VehicleBidOverride>;
};

type PlaceBidPayload = {
  vehicleId: string;
  amount: number;
  placedAt: string;
};

type InventoryAction = { type: "PLACE_BID"; payload: PlaceBidPayload };

const knownVehicleIds = new Set(baseVehicles.map((vehicle) => vehicle.id));

function inventoryReducer(
  state: InventoryState,
  action: InventoryAction,
): InventoryState {
  if (action.type !== "PLACE_BID") {
    return state;
  }

  const { vehicleId, amount, placedAt } = action.payload;
  const existing = state.overrides[vehicleId];

  return {
    overrides: {
      ...state.overrides,
      [vehicleId]: {
        vehicleId,
        currentBid: amount,
        additionalBidCount: (existing?.additionalBidCount ?? 0) + 1,
        latestBidAt: placedAt,
      },
    },
  };
}

function applyOverrides(
  vehicles: readonly Vehicle[],
  overrides: Record<string, VehicleBidOverride>,
): Vehicle[] {
  return vehicles.map((vehicle) => {
    const override = overrides[vehicle.id];
    if (!override) {
      return vehicle;
    }

    const baseBidCount = toFiniteNumber(vehicle.bid_count) ?? 0;

    return {
      ...vehicle,
      current_bid: override.currentBid,
      bid_count: baseBidCount + override.additionalBidCount,
    };
  });
}

function createInitialState(): InventoryState {
  if (typeof window === "undefined") {
    return { overrides: {} };
  }

  const persisted = loadPersistedBidState(knownVehicleIds);
  return { overrides: persisted.overrides };
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    inventoryReducer,
    undefined,
    createInitialState,
  );

  const vehicles = useMemo(
    () => applyOverrides(baseVehicles, state.overrides),
    [state.overrides],
  );

  const getVehicleById = useCallback(
    (id: string) => vehicles.find((vehicle) => vehicle.id === id),
    [vehicles],
  );

  const placeBid = useCallback(
    (vehicleId: string, amount: number): PlaceBidResult => {
      if (!knownVehicleIds.has(vehicleId)) {
        return {
          ok: false,
          message: "We could not place your bid. Please try again.",
        };
      }

      const placedAt = new Date().toISOString();
      const action: InventoryAction = {
        type: "PLACE_BID",
        payload: { vehicleId, amount, placedAt },
      };
      const nextState = inventoryReducer(state, action);

      dispatch(action);

      const persisted: PersistedBidState = {
        version: 1,
        overrides: nextState.overrides,
      };
      savePersistedBidState(persisted);

      return { ok: true };
    },
    [state],
  );

  const value = useMemo<InventoryContextValue>(
    () => ({
      vehicles,
      getVehicleById,
      placeBid,
    }),
    [vehicles, getVehicleById, placeBid],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
