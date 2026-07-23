import type { Vehicle } from "../types/vehicle";
import type { VehicleBidOverride } from "./bidStorage";
import { toFiniteNumber } from "./format";

export function applyBidOverrides(
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

export function createBidOverride(
  vehicleId: string,
  amount: number,
  existing: VehicleBidOverride | undefined,
  placedAt: string,
): VehicleBidOverride {
  return {
    vehicleId,
    currentBid: amount,
    additionalBidCount: (existing?.additionalBidCount ?? 0) + 1,
    latestBidAt: placedAt,
  };
}
