import {
  formatAuctionDateTime,
  formatCurrency,
  toFiniteNumber,
} from "../../lib/format";
import {
  getReserveStatus,
  getReserveStatusLabel,
} from "../../lib/vehicle";
import type { Vehicle } from "../../types/vehicle";
import { BidForm } from "../bidding/BidForm";
import styles from "./VehiclePricingSummary.module.css";

type VehiclePricingSummaryProps = {
  vehicle: Vehicle;
};

export function VehiclePricingSummary({ vehicle }: VehiclePricingSummaryProps) {
  const currentBid = toFiniteNumber(vehicle.current_bid);
  const startingBid = toFiniteNumber(vehicle.starting_bid);
  const reservePrice = toFiniteNumber(vehicle.reserve_price);
  const buyNowPrice = toFiniteNumber(vehicle.buy_now_price);
  const bidCount = toFiniteNumber(vehicle.bid_count) ?? 0;
  const reserveStatus = getReserveStatus(vehicle);
  const auctionTime = formatAuctionDateTime(vehicle.auction_start);

  return (
    <aside className={styles.panel} aria-labelledby="auction-pricing-heading">
      <h2 id="auction-pricing-heading" className={styles.heading}>
        Auction pricing
      </h2>

      <div className={styles.currentBid}>
        <p className={styles.currentLabel}>Current bid</p>
        <p className={styles.currentValue}>
          {currentBid !== null ? formatCurrency(currentBid) : "Price unavailable"}
        </p>
        <p className={styles.bidCount}>
          {bidCount === 1 ? "1 bid" : `${bidCount} bids`}
        </p>
      </div>

      <dl className={styles.rows}>
        <div className={styles.row}>
          <dt>Starting bid</dt>
          <dd>
            {startingBid !== null
              ? formatCurrency(startingBid)
              : "Price unavailable"}
          </dd>
        </div>

        <div className={styles.row}>
          <dt>Reserve price</dt>
          <dd>
            {reservePrice !== null
              ? formatCurrency(reservePrice)
              : "Not provided"}
          </dd>
        </div>

        <div className={styles.row}>
          <dt>Reserve status</dt>
          <dd>
            <span
              className={
                reserveStatus === "met"
                  ? styles.statusMet
                  : reserveStatus === "not-met"
                    ? styles.statusNotMet
                    : styles.statusNeutral
              }
            >
              {getReserveStatusLabel(reserveStatus)}
            </span>
          </dd>
        </div>

        <div className={styles.row}>
          <dt>Buy now</dt>
          <dd>
            {buyNowPrice !== null
              ? formatCurrency(buyNowPrice)
              : "Not available"}
          </dd>
        </div>

        <div className={styles.row}>
          <dt>Scheduled auction time</dt>
          <dd>{auctionTime ?? "Not provided"}</dd>
        </div>
      </dl>

      <div className={styles.biddingSlot} aria-label="Bidding">
        <h3 className={styles.biddingTitle}>Place a bid</h3>
        <BidForm vehicle={vehicle} />
      </div>
    </aside>
  );
}
