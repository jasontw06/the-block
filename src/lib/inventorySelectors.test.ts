import { describe, expect, it } from "vitest";
import {
  ALL_OPTION_VALUE,
  selectVisibleVehicles,
  type InventoryControlsState,
} from "./inventorySelectors";
import { createTestVehicle } from "../test/fixtures";

const baseControls: InventoryControlsState = {
  search: "",
  make: ALL_OPTION_VALUE,
  bodyStyle: ALL_OPTION_VALUE,
  province: ALL_OPTION_VALUE,
  sort: "recommended",
};

const vehicles = [
  createTestVehicle({
    id: "1",
    make: "Ford",
    model: "Bronco",
    vin: "FORDVIN001",
    lot: "A-100",
    selling_dealership: "King City Auto",
    body_style: "SUV",
    province: "Ontario",
    current_bid: 20000,
    odometer_km: 50000,
    bid_count: 5,
    auction_start: "2026-04-01T10:00:00",
  }),
  createTestVehicle({
    id: "2",
    make: "Toyota",
    model: "Camry",
    vin: "TOYOTAVIN02",
    lot: "B-200",
    selling_dealership: "Highway Motors",
    body_style: "sedan",
    province: "Quebec",
    current_bid: 15000,
    odometer_km: 30000,
    bid_count: 2,
    auction_start: "2026-04-03T10:00:00",
  }),
  createTestVehicle({
    id: "3",
    make: "Ford",
    model: "Escape",
    vin: "FORDVIN003",
    lot: "C-300",
    selling_dealership: "King City Auto",
    body_style: "SUV",
    province: "Ontario",
    current_bid: 25000,
    odometer_km: 70000,
    bid_count: 8,
    auction_start: "2026-04-02T10:00:00",
  }),
];

describe("inventory selectors", () => {
  it("searches by make, model, VIN, lot, and dealership", () => {
    expect(
      selectVisibleVehicles(vehicles, { ...baseControls, search: "ford" }).map(
        (v) => v.id,
      ),
    ).toEqual(["1", "3"]);
    expect(
      selectVisibleVehicles(vehicles, { ...baseControls, search: "camry" })[0]
        ?.id,
    ).toBe("2");
    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        search: "toyotavin",
      })[0]?.id,
    ).toBe("2");
    expect(
      selectVisibleVehicles(vehicles, { ...baseControls, search: "b-200" })[0]
        ?.id,
    ).toBe("2");
    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        search: "highway",
      })[0]?.id,
    ).toBe("2");
  });

  it("supports case-insensitive partial matching", () => {
    expect(
      selectVisibleVehicles(vehicles, { ...baseControls, search: "RoN" }).map(
        (v) => v.id,
      ),
    ).toEqual(["1"]);
  });

  it("applies make, body-style, and province filters with AND logic", () => {
    const result = selectVisibleVehicles(vehicles, {
      ...baseControls,
      make: "Ford",
      bodyStyle: "SUV",
      province: "Ontario",
    });
    expect(result.map((v) => v.id)).toEqual(["1", "3"]);

    const narrowed = selectVisibleVehicles(vehicles, {
      ...baseControls,
      make: "Ford",
      bodyStyle: "sedan",
      province: "Ontario",
    });
    expect(narrowed).toHaveLength(0);
  });

  it("sorts by price, odometer, bid count, and auction time", () => {
    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        sort: "price-asc",
      }).map((v) => v.id),
    ).toEqual(["2", "1", "3"]);

    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        sort: "odometer-desc",
      }).map((v) => v.id),
    ).toEqual(["3", "1", "2"]);

    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        sort: "bid-count-desc",
      }).map((v) => v.id),
    ).toEqual(["3", "1", "2"]);

    expect(
      selectVisibleVehicles(vehicles, {
        ...baseControls,
        sort: "auction-soonest",
      }).map((v) => v.id),
    ).toEqual(["1", "3", "2"]);
  });

  it("does not mutate the original vehicle array", () => {
    const originalOrder = vehicles.map((v) => v.id);
    selectVisibleVehicles(vehicles, { ...baseControls, sort: "price-desc" });
    expect(vehicles.map((v) => v.id)).toEqual(originalOrder);
  });
});
