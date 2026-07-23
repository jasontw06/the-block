import { displayText, formatDisplayLabel, toFiniteNumber } from "./format";
import type { Vehicle } from "../types/vehicle";

export function getVehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

export function getVehicleSubtitle(vehicle: Vehicle): string {
  return displayText(vehicle.trim, "");
}

export function getVehicleDetailSubtitle(vehicle: Vehicle): string {
  const parts = [vehicle.trim, vehicle.body_style]
    .map((part) => formatDisplayLabel(part))
    .filter((part): part is string => Boolean(part));

  return parts.join(" · ");
}

export function getDisplayBid(vehicle: Vehicle): number {
  const currentBid = toFiniteNumber(vehicle.current_bid);
  if (currentBid !== null) {
    return currentBid;
  }

  return toFiniteNumber(vehicle.starting_bid) ?? 0;
}

export function getVehicleLocation(vehicle: Vehicle): string {
  const parts = [vehicle.city, vehicle.province]
    .map((part) => displayText(part, "").trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Not provided";
}

export function getVehicleImageAlt(vehicle: Vehicle): string {
  return `${getVehicleTitle(vehicle)} ${vehicle.trim}`.trim();
}

export function getVehicleImages(vehicle: Vehicle): string[] {
  if (!Array.isArray(vehicle.images)) {
    return [];
  }

  return vehicle.images
    .map((image) => (typeof image === "string" ? image.trim() : ""))
    .filter(Boolean);
}

export type ReserveStatus = "met" | "not-met" | "not-provided";

export function getReserveStatus(vehicle: Vehicle): ReserveStatus {
  const reservePrice = toFiniteNumber(vehicle.reserve_price);
  if (reservePrice === null) {
    return "not-provided";
  }

  const currentBid = toFiniteNumber(vehicle.current_bid);
  const startingBid = toFiniteNumber(vehicle.starting_bid);
  const effectiveBid = currentBid ?? startingBid;

  if (effectiveBid === null) {
    return "not-met";
  }

  return effectiveBid >= reservePrice ? "met" : "not-met";
}

export function getReserveStatusLabel(status: ReserveStatus): string {
  switch (status) {
    case "met":
      return "Reserve met";
    case "not-met":
      return "Reserve not met";
    case "not-provided":
      return "Reserve not provided";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
