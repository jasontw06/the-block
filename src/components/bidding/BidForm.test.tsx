import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createTestVehicle } from "../../test/fixtures";
import { BidForm } from "./BidForm";

const placeBid = vi.fn(() => ({ ok: true as const }));

vi.mock("../../state/useInventory", () => ({
  useInventory: () => ({
    vehicles: [],
    getVehicleById: () => undefined,
    placeBid,
  }),
}));

describe("BidForm", () => {
  it("disables submit and shows validation errors for invalid bids", async () => {
    const user = userEvent.setup();
    const vehicle = createTestVehicle({
      current_bid: 22800,
      starting_bid: 14500,
    });

    render(<BidForm vehicle={vehicle} auctionStatus="live" />);

    const input = screen.getByLabelText(/bid amount/i);
    await user.clear(input);
    await user.type(input, "100");

    const submit = screen.getByRole("button", { name: /place bid/i });
    expect(submit).toBeDisabled();

    fireEvent.submit(input.closest("form")!);

    expect(await screen.findByRole("alert")).toHaveTextContent(/at least/i);
    expect(placeBid).not.toHaveBeenCalled();
  });

  it("shows success feedback after a valid bid", async () => {
    const user = userEvent.setup();
    const vehicle = createTestVehicle({
      current_bid: 22800,
      starting_bid: 14500,
    });

    render(<BidForm vehicle={vehicle} auctionStatus="live" />);

    await user.click(screen.getByRole("button", { name: /place bid/i }));

    expect(await screen.findByText(/your bid of/i)).toBeInTheDocument();
    expect(placeBid).toHaveBeenCalled();
  });

  it("disables bidding for upcoming auctions", () => {
    render(
      <BidForm vehicle={createTestVehicle()} auctionStatus="upcoming" />,
    );

    expect(
      screen.getByText(/bidding opens when this auction starts/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /place bid/i }),
    ).not.toBeInTheDocument();
  });

  it("disables bidding for ended auctions", () => {
    render(<BidForm vehicle={createTestVehicle()} auctionStatus="ended" />);

    expect(
      screen.getByText(/no longer accepts bids/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /place bid/i }),
    ).not.toBeInTheDocument();
  });
});
