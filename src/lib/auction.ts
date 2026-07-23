import type { Vehicle } from "../types/vehicle";

export type AuctionStatus = "upcoming" | "live" | "ended";

export type AuctionBounds = {
  min: number;
  max: number;
};

export type NormalizedAuctionWindow = {
  start: number;
  end: number;
};

export type AuctionSnapshot = {
  status: AuctionStatus;
  window: NormalizedAuctionWindow | null;
  label: string;
  detail: string;
};

const HOUR_MS = 60 * 60 * 1000;
export const AUCTION_DURATION_MS = 2 * HOUR_MS;
export const NORMALIZATION_PAST_MS = 24 * HOUR_MS;
export const NORMALIZATION_FUTURE_MS = 24 * HOUR_MS;

export function parseAuctionTimestamp(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const raw = String(value).trim();
  if (!raw) {
    return null;
  }

  const timestamp = Date.parse(raw);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function buildAuctionBounds(
  vehicles: ReadonlyArray<Pick<Vehicle, "auction_start">>,
): AuctionBounds | null {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const vehicle of vehicles) {
    const timestamp = parseAuctionTimestamp(vehicle.auction_start);
    if (timestamp === null) {
      continue;
    }

    if (timestamp < min) {
      min = timestamp;
    }
    if (timestamp > max) {
      max = timestamp;
    }
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  return { min, max };
}

export function normalizeAuctionStart(
  originalStart: number,
  bounds: AuctionBounds,
  anchorNow: number,
): number {
  const rangeStart = anchorNow - NORMALIZATION_PAST_MS;
  const rangeEnd = anchorNow + NORMALIZATION_FUTURE_MS;

  if (bounds.min === bounds.max) {
    return anchorNow;
  }

  const progress = (originalStart - bounds.min) / (bounds.max - bounds.min);
  const clamped = Math.min(1, Math.max(0, progress));
  return rangeStart + clamped * (rangeEnd - rangeStart);
}

export function getNormalizedAuctionWindow(
  auctionStart: unknown,
  bounds: AuctionBounds | null,
  anchorNow: number,
): NormalizedAuctionWindow | null {
  const originalStart = parseAuctionTimestamp(auctionStart);
  if (originalStart === null || bounds === null) {
    return null;
  }

  const start = normalizeAuctionStart(originalStart, bounds, anchorNow);
  return {
    start,
    end: start + AUCTION_DURATION_MS,
  };
}

export function getAuctionStatus(
  now: number,
  window: NormalizedAuctionWindow | null,
): AuctionStatus {
  if (window === null) {
    return "ended";
  }

  if (now < window.start) {
    return "upcoming";
  }

  if (now < window.end) {
    return "live";
  }

  return "ended";
}

export function formatCountdown(durationMs: number): string {
  const totalMinutes = Math.max(0, Math.ceil(durationMs / (60 * 1000)));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${Math.max(1, minutes)}m`;
}

export function getAuctionStatusLabel(status: AuctionStatus): string {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "live":
      return "Live";
    case "ended":
      return "Ended";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function getAuctionDetailMessage(
  status: AuctionStatus,
  now: number,
  window: NormalizedAuctionWindow | null,
): string {
  if (window === null) {
    return "Auction schedule unavailable";
  }

  if (status === "upcoming") {
    return `Starts in ${formatCountdown(window.start - now)}`;
  }

  if (status === "live") {
    return `Ends in ${formatCountdown(window.end - now)}`;
  }

  return "Auction ended";
}

export function getAuctionSnapshot(
  auctionStart: unknown,
  bounds: AuctionBounds | null,
  anchorNow: number,
  now: number,
): AuctionSnapshot {
  const window = getNormalizedAuctionWindow(auctionStart, bounds, anchorNow);
  const status = getAuctionStatus(now, window);

  return {
    status,
    window,
    label: getAuctionStatusLabel(status),
    detail: getAuctionDetailMessage(status, now, window),
  };
}

export function getBiddingClosedMessage(status: AuctionStatus): string {
  if (status === "upcoming") {
    return "Bidding opens when this auction starts.";
  }

  if (status === "ended") {
    return "This auction has ended and no longer accepts bids.";
  }

  return "Bidding is unavailable for this vehicle.";
}
