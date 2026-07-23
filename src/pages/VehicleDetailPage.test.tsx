import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { createTestVehicle } from "../test/fixtures";
import { VehicleDetailPage } from "./VehicleDetailPage";

const vehicle = createTestVehicle({
  id: "detail-1",
  year: 2023,
  make: "Ford",
  model: "Bronco",
});

vi.mock("../state/useInventory", () => ({
  useInventory: () => ({
    vehicles: [vehicle],
    getVehicleById: (id: string) => (id === vehicle.id ? vehicle : undefined),
    placeBid: () => ({ ok: true as const }),
  }),
}));

vi.mock("../state/useNow", () => ({
  useNow: () => Date.parse("2026-04-05T14:30:00"),
}));

vi.mock("../lib/auctionBounds", () => ({
  auctionBounds: {
    min: Date.parse("2026-04-05T14:00:00"),
    max: Date.parse("2026-04-05T14:00:00"),
  },
  auctionNormalizationAnchor: Date.parse("2026-04-05T14:30:00"),
}));

describe("VehicleDetailPage", () => {
  it("renders the correct vehicle for a valid route", () => {
    render(
      <MemoryRouter initialEntries={[`/vehicles/${vehicle.id}`]}>
        <Routes>
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /2023 ford bronco/i }),
    ).toBeInTheDocument();
  });

  it("shows the not-found state for an invalid route", () => {
    render(
      <MemoryRouter initialEntries={["/vehicles/missing-id"]}>
        <Routes>
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /vehicle not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to inventory/i }),
    ).toBeInTheDocument();
  });
});
