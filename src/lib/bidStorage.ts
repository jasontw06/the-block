import { toFiniteNumber } from "./format";

export const BID_STORAGE_KEY = "openlane-auction-bids:v1";

export type VehicleBidOverride = {
  vehicleId: string;
  currentBid: number;
  additionalBidCount: number;
  latestBidAt: string;
};

export type PersistedBidState = {
  version: 1;
  overrides: Record<string, VehicleBidOverride>;
};

export function createEmptyPersistedBidState(): PersistedBidState {
  return {
    version: 1,
    overrides: {},
  };
}

export function loadPersistedBidState(
  knownVehicleIds: ReadonlySet<string>,
): PersistedBidState {
  try {
    const raw = window.localStorage.getItem(BID_STORAGE_KEY);
    if (!raw) {
      return createEmptyPersistedBidState();
    }

    const parsed: unknown = JSON.parse(raw);
    return sanitizePersistedBidState(parsed, knownVehicleIds);
  } catch {
    return createEmptyPersistedBidState();
  }
}

export function savePersistedBidState(state: PersistedBidState): boolean {
  try {
    window.localStorage.setItem(BID_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function sanitizePersistedBidState(
  value: unknown,
  knownVehicleIds: ReadonlySet<string>,
): PersistedBidState {
  if (!isRecord(value) || value.version !== 1) {
    return createEmptyPersistedBidState();
  }

  const source = value.overrides;
  if (!isRecord(source)) {
    return createEmptyPersistedBidState();
  }

  const overrides: Record<string, VehicleBidOverride> = {};

  for (const [key, entry] of Object.entries(source)) {
    const override = sanitizeOverride(key, entry, knownVehicleIds);
    if (override) {
      overrides[override.vehicleId] = override;
    }
  }

  return {
    version: 1,
    overrides,
  };
}

function sanitizeOverride(
  key: string,
  value: unknown,
  knownVehicleIds: ReadonlySet<string>,
): VehicleBidOverride | null {
  if (!isRecord(value)) {
    return null;
  }

  const vehicleId =
    typeof value.vehicleId === "string" && value.vehicleId.trim()
      ? value.vehicleId.trim()
      : key.trim();

  if (!vehicleId || !knownVehicleIds.has(vehicleId)) {
    return null;
  }

  const currentBid = toFiniteNumber(value.currentBid);
  const additionalBidCount = toFiniteNumber(value.additionalBidCount);

  if (
    currentBid === null ||
    currentBid <= 0 ||
    !Number.isInteger(currentBid) ||
    additionalBidCount === null ||
    additionalBidCount < 1 ||
    !Number.isInteger(additionalBidCount)
  ) {
    return null;
  }

  const latestBidAt =
    typeof value.latestBidAt === "string" && value.latestBidAt.trim()
      ? value.latestBidAt
      : new Date(0).toISOString();

  return {
    vehicleId,
    currentBid,
    additionalBidCount,
    latestBidAt,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
