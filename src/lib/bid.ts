import { formatCurrency, toFiniteNumber } from "./format";

export const BID_INCREMENT = 250;
export const MAX_BID_AMOUNT = 99_999_999;

export type BidValidationResult =
  | {
      valid: true;
      amount: number;
    }
  | {
      valid: false;
      message: string;
    };

export function calculateMinimumBid(
  currentBid: number | null | undefined,
  startingBid: number | null | undefined,
): number | null {
  const current = toFiniteNumber(currentBid);
  const starting = toFiniteNumber(startingBid);

  if (current !== null && current > 0) {
    const minimum = current + BID_INCREMENT;
    return Number.isFinite(minimum) ? minimum : null;
  }

  if (starting !== null && starting > 0) {
    return starting;
  }

  return null;
}

export function validateBid(
  input: string,
  minimumBid: number | null,
): BidValidationResult {
  if (minimumBid === null) {
    return {
      valid: false,
      message: "Bidding is unavailable for this vehicle.",
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      message: "Enter a bid amount.",
    };
  }

  if (/^\d+\.\d+$/.test(trimmed)) {
    return {
      valid: false,
      message: "Enter a whole-dollar amount.",
    };
  }

  if (!/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      message: "Enter a valid bid amount.",
    };
  }

  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      valid: false,
      message: "Enter a valid bid amount.",
    };
  }

  if (!Number.isInteger(amount)) {
    return {
      valid: false,
      message: "Enter a whole-dollar amount.",
    };
  }

  if (amount > MAX_BID_AMOUNT) {
    return {
      valid: false,
      message: `Enter a bid of ${formatCurrency(MAX_BID_AMOUNT)} or less.`,
    };
  }

  if (amount < minimumBid) {
    return {
      valid: false,
      message: `Your bid must be at least ${formatCurrency(minimumBid)}.`,
    };
  }

  return {
    valid: true,
    amount,
  };
}

export function isBiddingAvailable(
  currentBid: number | null | undefined,
  startingBid: number | null | undefined,
): boolean {
  return calculateMinimumBid(currentBid, startingBid) !== null;
}
