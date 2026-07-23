import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { applyBidOverrides } from "../lib/bidOverrides";
import { createTestVehicle } from "../test/fixtures";
import { VehicleCard } from "./VehicleCard";

vi.mock("../state/useNow", () => ({
  useNow: () => Date.parse("2026-04-05T12:00:00"),
}));

vi.mock("../lib/auctionBounds", () => ({
  auctionBounds: {
    min: Date.parse("2026-04-05T14:00:00"),
    max: Date.parse("2026-04-05T14:00:00"),
  },
  auctionNormalizationAnchor: Date.parse("2026-04-05T12:00:00"),
}));

describe("VehicleCard shared bid state", () => {
  it("reflects an updated bid from shared overrides", () => {
    const base = createTestVehicle({
      id: "card-1",
      current_bid: 22800,
      bid_count: 16,
    });
    const [updated] = applyBidOverrides([base], {
      "card-1": {
        vehicleId: "card-1",
        currentBid: 23500,
        additionalBidCount: 1,
        latestBidAt: "t1",
      },
    });

    render(
      <MemoryRouter>
        <VehicleCard vehicle={updated!} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/\$23,500/)).toBeInTheDocument();
    expect(screen.getByText("17 bids")).toBeInTheDocument();
  });
});
