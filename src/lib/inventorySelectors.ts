import type { Vehicle } from "../types/vehicle";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "odometer-asc"
  | "odometer-desc"
  | "bid-count-desc"
  | "auction-soonest"
  | "auction-latest";

export type InventoryControlsState = {
  search: string;
  make: string;
  bodyStyle: string;
  province: string;
  sort: SortOption;
};

export const ALL_OPTION_VALUE = "all";

export const DEFAULT_INVENTORY_CONTROLS: InventoryControlsState = {
  search: "",
  make: ALL_OPTION_VALUE,
  bodyStyle: ALL_OPTION_VALUE,
  province: ALL_OPTION_VALUE,
  sort: "recommended",
};

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> =
  [
    { value: "recommended", label: "Recommended" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "odometer-asc", label: "Odometer: low to high" },
    { value: "odometer-desc", label: "Odometer: high to low" },
    { value: "bid-count-desc", label: "Bid count: high to low" },
    { value: "auction-soonest", label: "Auction time: soonest first" },
    { value: "auction-latest", label: "Auction time: latest first" },
  ];

export function normalizeSearchValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
}

export function getSearchableFields(vehicle: Vehicle): string[] {
  return [
    normalizeSearchValue(vehicle.make),
    normalizeSearchValue(vehicle.model),
    normalizeSearchValue(vehicle.lot),
    normalizeSearchValue(vehicle.vin),
    normalizeSearchValue(vehicle.selling_dealership),
  ];
}

export function matchesSearch(vehicle: Vehicle, rawQuery: string): boolean {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return getSearchableFields(vehicle).some((field) => field.includes(query));
}

export function matchesMake(vehicle: Vehicle, make: string): boolean {
  if (make === ALL_OPTION_VALUE) {
    return true;
  }

  return vehicle.make === make;
}

export function matchesBodyStyle(vehicle: Vehicle, bodyStyle: string): boolean {
  if (bodyStyle === ALL_OPTION_VALUE) {
    return true;
  }

  return vehicle.body_style === bodyStyle;
}

export function matchesProvince(vehicle: Vehicle, province: string): boolean {
  if (province === ALL_OPTION_VALUE) {
    return true;
  }

  return vehicle.province === province;
}

export function getUniqueSortedOptions(
  vehicles: readonly Vehicle[],
  readValue: (vehicle: Vehicle) => unknown,
): string[] {
  const values = new Set<string>();

  for (const vehicle of vehicles) {
    const raw = readValue(vehicle);
    if (raw === null || raw === undefined) {
      continue;
    }

    const value = String(raw).trim();
    if (!value) {
      continue;
    }

    values.add(value);
  }

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function getMakeOptions(vehicles: readonly Vehicle[]): string[] {
  return getUniqueSortedOptions(vehicles, (vehicle) => vehicle.make);
}

export function getBodyStyleOptions(vehicles: readonly Vehicle[]): string[] {
  return getUniqueSortedOptions(vehicles, (vehicle) => vehicle.body_style);
}

export function getProvinceOptions(vehicles: readonly Vehicle[]): string[] {
  return getUniqueSortedOptions(vehicles, (vehicle) => vehicle.province);
}

export function getVehiclePrice(vehicle: Vehicle): number | null {
  const currentBid = toFiniteNumber(vehicle.current_bid);
  if (currentBid !== null) {
    return currentBid;
  }

  return toFiniteNumber(vehicle.starting_bid);
}

export function getVehicleOdometer(vehicle: Vehicle): number | null {
  return toFiniteNumber(vehicle.odometer_km);
}

export function getVehicleBidCount(vehicle: Vehicle): number {
  return toFiniteNumber(vehicle.bid_count) ?? 0;
}

export function getVehicleAuctionTime(vehicle: Vehicle): number | null {
  const raw = vehicle.auction_start;
  if (raw === null || raw === undefined || String(raw).trim() === "") {
    return null;
  }

  const timestamp = Date.parse(String(raw));
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function hasActiveInventoryControls(
  controls: InventoryControlsState,
): boolean {
  return (
    controls.search.trim() !== "" ||
    controls.make !== ALL_OPTION_VALUE ||
    controls.bodyStyle !== ALL_OPTION_VALUE ||
    controls.province !== ALL_OPTION_VALUE ||
    controls.sort !== "recommended"
  );
}

export function filterVehicles(
  vehicles: readonly Vehicle[],
  controls: Pick<
    InventoryControlsState,
    "search" | "make" | "bodyStyle" | "province"
  >,
): Vehicle[] {
  return vehicles.filter(
    (vehicle) =>
      matchesSearch(vehicle, controls.search) &&
      matchesMake(vehicle, controls.make) &&
      matchesBodyStyle(vehicle, controls.bodyStyle) &&
      matchesProvince(vehicle, controls.province),
  );
}

export function sortVehicles(
  vehicles: readonly Vehicle[],
  sort: SortOption,
): Vehicle[] {
  if (sort === "recommended") {
    return [...vehicles];
  }

  const sorted = [...vehicles];

  sorted.sort((left, right) => {
    switch (sort) {
      case "price-asc":
        return compareNullableNumber(
          getVehiclePrice(left),
          getVehiclePrice(right),
          "asc",
        );
      case "price-desc":
        return compareNullableNumber(
          getVehiclePrice(left),
          getVehiclePrice(right),
          "desc",
        );
      case "odometer-asc":
        return compareNullableNumber(
          getVehicleOdometer(left),
          getVehicleOdometer(right),
          "asc",
        );
      case "odometer-desc":
        return compareNullableNumber(
          getVehicleOdometer(left),
          getVehicleOdometer(right),
          "desc",
        );
      case "bid-count-desc":
        return getVehicleBidCount(right) - getVehicleBidCount(left);
      case "auction-soonest":
        return compareNullableNumber(
          getVehicleAuctionTime(left),
          getVehicleAuctionTime(right),
          "asc",
        );
      case "auction-latest":
        return compareNullableNumber(
          getVehicleAuctionTime(left),
          getVehicleAuctionTime(right),
          "desc",
        );
      default: {
        const _exhaustive: never = sort;
        return _exhaustive;
      }
    }
  });

  return sorted;
}

export function selectVisibleVehicles(
  vehicles: readonly Vehicle[],
  controls: InventoryControlsState,
): Vehicle[] {
  const filtered = filterVehicles(vehicles, controls);
  return sortVehicles(filtered, controls.sort);
}

function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function compareNullableNumber(
  left: number | null,
  right: number | null,
  direction: "asc" | "desc",
): number {
  if (left === null && right === null) {
    return 0;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }

  return direction === "asc" ? left - right : right - left;
}
