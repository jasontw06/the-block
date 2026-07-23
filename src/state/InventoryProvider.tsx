import { useCallback, useMemo, useReducer, type ReactNode } from "react";
import { vehicles as baseVehicles } from "../data/vehicles";
import {
  getAuctionSnapshot,
  getBiddingClosedMessage,
} from "../lib/auction";
import {
  auctionBounds,
  auctionNormalizationAnchor,
} from "../lib/auctionBounds";
import {
  applyBidOverrides,
  createBidOverride,
} from "../lib/bidOverrides";
import {
  loadPersistedBidState,
  savePersistedBidState,
  type PersistedBidState,
  type VehicleBidOverride,
} from "../lib/bidStorage";
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
      [vehicleId]: createBidOverride(vehicleId, amount, existing, placedAt),
    },
  };
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
    () => applyBidOverrides(baseVehicles, state.overrides),
    [state.overrides],
  );

  const getVehicleById = useCallback(
    (id: string) => vehicles.find((vehicle) => vehicle.id === id),
    [vehicles],
  );

  const placeBid = useCallback(
    (vehicleId: string, amount: number): PlaceBidResult => {
      const baseVehicle = baseVehicles.find(
        (vehicle) => vehicle.id === vehicleId,
      );

      if (!baseVehicle || !knownVehicleIds.has(vehicleId)) {
        return {
          ok: false,
          message: "We could not place your bid. Please try again.",
        };
      }

      const auction = getAuctionSnapshot(
        baseVehicle.auction_start,
        auctionBounds,
        auctionNormalizationAnchor,
        Date.now(),
      );

      if (auction.status !== "live") {
        return {
          ok: false,
          message: getBiddingClosedMessage(auction.status),
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
