import type { Vehicle } from "../types/vehicle";

export function getVehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
}

export function getVehicleSubtitle(vehicle: Vehicle): string {
  return vehicle.trim;
}

export function getDisplayBid(vehicle: Vehicle): number {
  return vehicle.current_bid > 0 ? vehicle.current_bid : vehicle.starting_bid;
}

export function getVehicleLocation(vehicle: Vehicle): string {
  return `${vehicle.city}, ${vehicle.province}`;
}

export function getVehicleImageAlt(vehicle: Vehicle): string {
  return `${getVehicleTitle(vehicle)} ${vehicle.trim}`.trim();
}
