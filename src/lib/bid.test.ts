import { describe, expect, it } from "vitest";
import { calculateMinimumBid, validateBid } from "../lib/bid";

describe("calculateMinimumBid", () => {
  it("uses current bid plus CAD $250 when current bid exists", () => {
    expect(calculateMinimumBid(22800, 14500)).toBe(23050);
  });

  it("uses starting bid when current bid is missing or zero", () => {
    expect(calculateMinimumBid(null, 14500)).toBe(14500);
    expect(calculateMinimumBid(0, 14500)).toBe(14500);
    expect(calculateMinimumBid(undefined, 14500)).toBe(14500);
  });

  it("returns null when pricing is unavailable", () => {
    expect(calculateMinimumBid(null, null)).toBeNull();
  });
});

describe("validateBid", () => {
  const minimumBid = 23050;

  it("rejects empty and whitespace-only bids", () => {
    expect(validateBid("", minimumBid)).toEqual({
      valid: false,
      message: "Enter a bid amount.",
    });
    expect(validateBid("   ", minimumBid)).toEqual({
      valid: false,
      message: "Enter a bid amount.",
    });
  });

  it("rejects non-numeric bids", () => {
    expect(validateBid("abc", minimumBid).valid).toBe(false);
  });

  it("rejects decimal bids", () => {
    expect(validateBid("23050.5", minimumBid)).toEqual({
      valid: false,
      message: "Enter a whole-dollar amount.",
    });
  });

  it("rejects negative and zero bids", () => {
    expect(validateBid("-100", minimumBid).valid).toBe(false);
    expect(validateBid("0", minimumBid).valid).toBe(false);
  });

  it("rejects bids below the minimum", () => {
    const result = validateBid("23000", minimumBid);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.message).toContain("at least");
    }
  });

  it("accepts a valid whole-dollar bid at or above the minimum", () => {
    expect(validateBid("23050", minimumBid)).toEqual({
      valid: true,
      amount: 23050,
    });
    expect(validateBid("24000", minimumBid)).toEqual({
      valid: true,
      amount: 24000,
    });
  });

  it("rejects bidding when minimum bid is unavailable", () => {
    expect(validateBid("1000", null)).toEqual({
      valid: false,
      message: "Bidding is unavailable for this vehicle.",
    });
  });
});
