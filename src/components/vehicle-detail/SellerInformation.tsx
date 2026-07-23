import {
  displayText,
  formatAuctionDateTime,
} from "../../lib/format";
import { getVehicleLocation } from "../../lib/vehicle";
import type { Vehicle } from "../../types/vehicle";
import styles from "./SellerInformation.module.css";

type SellerInformationProps = {
  vehicle: Vehicle;
};

export function SellerInformation({ vehicle }: SellerInformationProps) {
  const auctionTime = formatAuctionDateTime(vehicle.auction_start);

  return (
    <section className={styles.section} aria-labelledby="seller-heading">
      <h2 id="seller-heading" className={styles.heading}>
        Seller information
      </h2>

      <dl className={styles.grid}>
        <div className={styles.item}>
          <dt>Selling dealership</dt>
          <dd>{displayText(vehicle.selling_dealership)}</dd>
        </div>
        <div className={styles.item}>
          <dt>Location</dt>
          <dd>{getVehicleLocation(vehicle)}</dd>
        </div>
        <div className={styles.item}>
          <dt>Lot</dt>
          <dd>{displayText(vehicle.lot)}</dd>
        </div>
        <div className={styles.item}>
          <dt>VIN</dt>
          <dd className={styles.vin}>{displayText(vehicle.vin)}</dd>
        </div>
        <div className={styles.item}>
          <dt>Scheduled auction time</dt>
          <dd>{auctionTime ?? "Not provided"}</dd>
        </div>
      </dl>
    </section>
  );
}
