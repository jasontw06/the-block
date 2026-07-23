import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  calculateMinimumBid,
  isBiddingAvailable,
  validateBid,
} from "../../lib/bid";
import {
  getBiddingClosedMessage,
  type AuctionStatus,
} from "../../lib/auction";
import { formatCurrency } from "../../lib/format";
import { useInventory } from "../../state/useInventory";
import type { Vehicle } from "../../types/vehicle";
import styles from "./BidForm.module.css";

type BidFormProps = {
  vehicle: Vehicle;
  auctionStatus: AuctionStatus;
};

export function BidForm({ vehicle, auctionStatus }: BidFormProps) {
  const { placeBid } = useInventory();
  const inputId = useId();
  const errorId = useId();
  const statusId = useId();

  const minimumBid = useMemo(
    () => calculateMinimumBid(vehicle.current_bid, vehicle.starting_bid),
    [vehicle.current_bid, vehicle.starting_bid],
  );

  const pricingAvailable = isBiddingAvailable(
    vehicle.current_bid,
    vehicle.starting_bid,
  );
  const auctionOpen = auctionStatus === "live";
  const biddingAvailable = pricingAvailable && auctionOpen;

  const [amountInput, setAmountInput] = useState(
    minimumBid !== null ? String(minimumBid) : "",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (minimumBid !== null) {
      setAmountInput(String(minimumBid));
    } else {
      setAmountInput("");
    }
  }, [minimumBid, vehicle.id]);

  useEffect(() => {
    if (!auctionOpen) {
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [auctionOpen]);

  const liveValidation = validateBid(amountInput, minimumBid);
  const canSubmit =
    biddingAvailable && !isSubmitting && liveValidation.valid;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || !auctionOpen) {
      return;
    }

    setSuccessMessage(null);

    const validation = validateBid(amountInput, minimumBid);
    if (!validation.valid) {
      setErrorMessage(validation.message);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await Promise.resolve();
      const result = placeBid(vehicle.id, validation.amount);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setSuccessMessage(
        `Your bid of ${formatCurrency(validation.amount)} has been placed. You are currently the highest bidder.`,
      );
    } catch {
      setErrorMessage("We could not place your bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!pricingAvailable || minimumBid === null) {
    return (
      <div className={styles.unavailable} role="status">
        Bidding is unavailable because pricing information is incomplete.
      </div>
    );
  }

  if (!auctionOpen) {
    return (
      <div className={styles.unavailable} role="status">
        {getBiddingClosedMessage(auctionStatus)}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.minimum}>
        <p className={styles.minimumLabel}>Minimum next bid</p>
        <p className={styles.minimumValue}>{formatCurrency(minimumBid)}</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={inputId}>
          Bid amount (CAD)
        </label>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={amountInput}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={
            [errorMessage ? errorId : null, statusId].filter(Boolean).join(" ") ||
            undefined
          }
          disabled={isSubmitting}
          onChange={(event) => {
            setAmountInput(event.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
            if (successMessage) {
              setSuccessMessage(null);
            }
          }}
        />
        {errorMessage ? (
          <p id={errorId} className={styles.error} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={!canSubmit}
      >
        {isSubmitting ? "Placing bid..." : "Place bid"}
      </button>

      <div id={statusId} className={styles.statusRegion} aria-live="polite">
        {successMessage ? (
          <p className={styles.success}>{successMessage}</p>
        ) : null}
      </div>

      <p className={styles.note}>
        Bids are simulated locally in this prototype and are not a live auction
        transaction.
      </p>
    </form>
  );
}
