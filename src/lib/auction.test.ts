import { describe, expect, it } from "vitest";
import {
  AUCTION_DURATION_MS,
  getAuctionSnapshot,
  getAuctionStatus,
  getBiddingClosedMessage,
  normalizeAuctionStart,
  type AuctionBounds,
} from "./auction";

describe("auction status", () => {
  const window = {
    start: 1_000_000,
    end: 1_000_000 + AUCTION_DURATION_MS,
  };

  it("is upcoming before start", () => {
    expect(getAuctionStatus(window.start - 1, window)).toBe("upcoming");
  });

  it("is live at the exact start boundary", () => {
    expect(getAuctionStatus(window.start, window)).toBe("live");
  });

  it("is live between start and end", () => {
    expect(getAuctionStatus(window.start + 60_000, window)).toBe("live");
  });

  it("is ended at the exact end boundary", () => {
    expect(getAuctionStatus(window.end, window)).toBe("ended");
  });

  it("is ended after the auction ends", () => {
    expect(getAuctionStatus(window.end + 1, window)).toBe("ended");
  });

  it("returns ended when the window is unavailable", () => {
    expect(getAuctionStatus(Date.now(), null)).toBe("ended");
  });
});

describe("auction normalization", () => {
  it("preserves relative order of timestamps", () => {
    const bounds: AuctionBounds = { min: 100, max: 300 };
    const anchorNow = 10_000_000;
    const early = normalizeAuctionStart(100, bounds, anchorNow);
    const mid = normalizeAuctionStart(200, bounds, anchorNow);
    const late = normalizeAuctionStart(300, bounds, anchorNow);

    expect(early).toBeLessThan(mid);
    expect(mid).toBeLessThan(late);
  });

  it("builds matching status snapshots for injected times", () => {
    const bounds: AuctionBounds = { min: 0, max: 0 };
    const anchorNow = 5_000_000;
    const snapshot = getAuctionSnapshot(
      "2026-04-01T12:00:00",
      bounds,
      anchorNow,
      anchorNow + 30_000,
    );

    expect(snapshot.status).toBe("live");
    expect(snapshot.window?.start).toBe(anchorNow);
    expect(snapshot.window?.end).toBe(anchorNow + AUCTION_DURATION_MS);
  });
});

describe("bidding closed messages", () => {
  it("explains why non-live vehicles reject bids", () => {
    expect(getBiddingClosedMessage("upcoming")).toBe(
      "Bidding opens when this auction starts.",
    );
    expect(getBiddingClosedMessage("ended")).toBe(
      "This auction has ended and no longer accepts bids.",
    );
  });
});
