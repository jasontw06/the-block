import { Link } from "react-router-dom";
import { displayText } from "../../lib/format";
import {
  getVehicleDetailSubtitle,
  getVehicleTitle,
} from "../../lib/vehicle";
import type { Vehicle } from "../../types/vehicle";
import styles from "./VehicleHeader.module.css";

type VehicleHeaderProps = {
  vehicle: Vehicle;
};

export function VehicleHeader({ vehicle }: VehicleHeaderProps) {
  const title = getVehicleTitle(vehicle);
  const subtitle = getVehicleDetailSubtitle(vehicle);
  const lot = displayText(vehicle.lot, "");
  const vin = displayText(vehicle.vin, "");

  const metaParts = [
    lot ? `Lot ${lot}` : null,
    vin ? `VIN ${vin}` : null,
  ].filter((part): part is string => Boolean(part));

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.backLink}>
        Back to inventory
      </Link>

      <h1 className={styles.title}>{title}</h1>

      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

      {metaParts.length > 0 ? (
        <p className={styles.meta}>{metaParts.join(" · ")}</p>
      ) : null}
    </header>
  );
}
