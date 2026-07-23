import type { Vehicle } from "../types/vehicle";

export function createTestVehicle(
  overrides: Partial<Vehicle> = {},
): Vehicle {
  return {
    id: "vehicle-1",
    vin: "TESTVIN1234567890",
    year: 2023,
    make: "Ford",
    model: "Bronco",
    trim: "Big Bend",
    body_style: "SUV",
    exterior_color: "Blue",
    interior_color: "Black",
    engine: "2.7L V6",
    transmission: "automatic",
    drivetrain: "4WD",
    odometer_km: 40000,
    fuel_type: "gasoline",
    condition_grade: 4,
    condition_report: "Clean vehicle.",
    damage_notes: [],
    title_status: "clean",
    province: "Ontario",
    city: "Toronto",
    auction_start: "2026-04-05T14:00:00",
    starting_bid: 14500,
    reserve_price: 25000,
    buy_now_price: null,
    images: ["https://placehold.co/800x600?text=Test"],
    selling_dealership: "King City Auto",
    lot: "A-0043",
    current_bid: 22800,
    bid_count: 16,
    ...overrides,
  };
}
