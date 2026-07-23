import {
  displayText,
  formatDisplayLabel,
  formatOdometer,
  toFiniteNumber,
} from "../../lib/format";
import type { Vehicle } from "../../types/vehicle";
import styles from "./VehicleSpecifications.module.css";

type VehicleSpecificationsProps = {
  vehicle: Vehicle;
};

type SpecItem = {
  label: string;
  value: string;
};

export function VehicleSpecifications({ vehicle }: VehicleSpecificationsProps) {
  const odometer = toFiniteNumber(vehicle.odometer_km);

  const specs: SpecItem[] = [
    { label: "Year", value: displayText(vehicle.year) },
    { label: "Make", value: displayText(vehicle.make) },
    { label: "Model", value: displayText(vehicle.model) },
    {
      label: "Trim",
      value: formatDisplayLabel(vehicle.trim) ?? "Not provided",
    },
    {
      label: "Body style",
      value: formatDisplayLabel(vehicle.body_style) ?? "Not provided",
    },
    { label: "Engine", value: displayText(vehicle.engine) },
    {
      label: "Transmission",
      value: formatDisplayLabel(vehicle.transmission) ?? "Not provided",
    },
    {
      label: "Drivetrain",
      value: formatDisplayLabel(vehicle.drivetrain) ?? "Not provided",
    },
    {
      label: "Fuel",
      value: formatDisplayLabel(vehicle.fuel_type) ?? "Not provided",
    },
    {
      label: "Odometer",
      value: odometer !== null ? formatOdometer(odometer) : "Not provided",
    },
    {
      label: "Exterior color",
      value: formatDisplayLabel(vehicle.exterior_color) ?? "Not provided",
    },
    {
      label: "Interior color",
      value: formatDisplayLabel(vehicle.interior_color) ?? "Not provided",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="specs-heading">
      <h2 id="specs-heading" className={styles.heading}>
        Specifications
      </h2>
      <dl className={styles.grid}>
        {specs.map((spec) => (
          <div key={spec.label} className={styles.item}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
