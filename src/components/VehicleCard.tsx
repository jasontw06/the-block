import { Link } from "react-router-dom";
import {
  formatConditionGrade,
  formatCurrency,
  formatOdometer,
} from "../lib/format";
import {
  getDisplayBid,
  getVehicleImageAlt,
  getVehicleLocation,
  getVehicleSubtitle,
  getVehicleTitle,
} from "../lib/vehicle";
import type { Vehicle } from "../types/vehicle";
import styles from "./VehicleCard.module.css";

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const imageUrl = vehicle.images[0];
  const title = getVehicleTitle(vehicle);
  const subtitle = getVehicleSubtitle(vehicle);
  const bid = getDisplayBid(vehicle);

  return (
    <article className={styles.card}>
      <Link
        to={`/vehicles/${vehicle.id}`}
        className={styles.link}
        aria-label={`View ${title}`}
      >
        <div className={styles.media}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={getVehicleImageAlt(vehicle)}
              className={styles.image}
              loading="lazy"
              decoding="async"
              width={800}
              height={600}
            />
          ) : (
            <div className={styles.imageFallback} aria-hidden="true" />
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.topline}>
            <span className={styles.lot}>{vehicle.lot}</span>
            <span className={styles.grade}>
              Cond. {formatConditionGrade(vehicle.condition_grade)}
            </span>
          </div>

          <h2 className={styles.title}>{title}</h2>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

          <dl className={styles.meta}>
            <div>
              <dt className={styles.srOnly}>Odometer</dt>
              <dd>{formatOdometer(vehicle.odometer_km)}</dd>
            </div>
            <div>
              <dt className={styles.srOnly}>Location</dt>
              <dd>{getVehicleLocation(vehicle)}</dd>
            </div>
          </dl>

          <div className={styles.pricing}>
            <div>
              <p className={styles.priceLabel}>
                {vehicle.bid_count > 0 ? "Current bid" : "Starting bid"}
              </p>
              <p className={styles.price}>{formatCurrency(bid)}</p>
            </div>
            <p className={styles.bidCount}>
              {vehicle.bid_count === 1
                ? "1 bid"
                : `${vehicle.bid_count} bids`}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
