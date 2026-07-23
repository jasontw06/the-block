import { describe, expect, it } from "vitest";
import {
  BID_STORAGE_KEY,
  loadPersistedBidState,
  sanitizePersistedBidState,
  savePersistedBidState,
} from "./bidStorage";
import {
  applyBidOverrides,
  createBidOverride,
} from "./bidOverrides";
import { createTestVehicle } from "../test/fixtures";

describe("bid persistence", () => {
  const knownIds = new Set(["vehicle-1", "vehicle-2"]);

  it("saves and restores bid overrides", () => {
    const saved = savePersistedBidState({
      version: 1,
      overrides: {
        "vehicle-1": {
          vehicleId: "vehicle-1",
          currentBid: 23500,
          additionalBidCount: 2,
          latestBidAt: "2026-01-01T00:00:00.000Z",
        },
      },
    });

    expect(saved).toBe(true);
    expect(loadPersistedBidState(knownIds).overrides["vehicle-1"]).toEqual({
      vehicleId: "vehicle-1",
      currentBid: 23500,
      additionalBidCount: 2,
      latestBidAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("ignores corrupted localStorage JSON", () => {
    window.localStorage.setItem(BID_STORAGE_KEY, "{not-json");
    expect(loadPersistedBidState(knownIds)).toEqual({
      version: 1,
      overrides: {},
    });
  });

  it("ignores invalid override shapes and unknown vehicle ids", () => {
    const sanitized = sanitizePersistedBidState(
      {
        version: 1,
        overrides: {
          "vehicle-1": {
            vehicleId: "vehicle-1",
            currentBid: 100,
            additionalBidCount: 1,
            latestBidAt: "2026-01-01T00:00:00.000Z",
          },
          bad: { vehicleId: "missing", currentBid: 100, additionalBidCount: 1 },
          broken: { vehicleId: "vehicle-2", currentBid: "x", additionalBidCount: 1 },
        },
      },
      knownIds,
    );

    expect(Object.keys(sanitized.overrides)).toEqual(["vehicle-1"]);
  });
});

describe("bid overrides", () => {
  it("updates current bid and increments additional bid count", () => {
    const first = createBidOverride("vehicle-1", 23050, undefined, "t1");
    const second = createBidOverride("vehicle-1", 23500, first, "t2");

    expect(first.additionalBidCount).toBe(1);
    expect(second.currentBid).toBe(23500);
    expect(second.additionalBidCount).toBe(2);
  });

  it("applies overrides without double-counting base bid count on reload", () => {
    const base = [
      createTestVehicle({ id: "vehicle-1", current_bid: 22800, bid_count: 16 }),
    ];
    const overrides = {
      "vehicle-1": {
        vehicleId: "vehicle-1",
        currentBid: 23500,
        additionalBidCount: 2,
        latestBidAt: "t2",
      },
    };

    const once = applyBidOverrides(base, overrides);
    const twice = applyBidOverrides(base, overrides);

    expect(once[0]?.current_bid).toBe(23500);
    expect(once[0]?.bid_count).toBe(18);
    expect(twice[0]?.bid_count).toBe(18);
    expect(base[0]?.bid_count).toBe(16);
  });
});
