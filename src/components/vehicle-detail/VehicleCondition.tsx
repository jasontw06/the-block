import {
  displayText,
  formatConditionGrade,
  formatDisplayLabel,
  toFiniteNumber,
} from "../../lib/format";
import type { Vehicle } from "../../types/vehicle";
import styles from "./VehicleCondition.module.css";

type VehicleConditionProps = {
  vehicle: Vehicle;
};

export function VehicleCondition({ vehicle }: VehicleConditionProps) {
  const grade = toFiniteNumber(vehicle.condition_grade);
  const report = displayText(vehicle.condition_report, "");
  const titleStatus = formatDisplayLabel(vehicle.title_status);
  const damageNotes = Array.isArray(vehicle.damage_notes)
    ? vehicle.damage_notes
        .map((note) => String(note).trim())
        .filter(Boolean)
    : [];

  const titleIsClean = (vehicle.title_status ?? "")
    .toString()
    .trim()
    .toLowerCase() === "clean";

  return (
    <section className={styles.section} aria-labelledby="condition-heading">
      <h2 id="condition-heading" className={styles.heading}>
        Condition
      </h2>

      <div className={styles.meta}>
        <p className={styles.grade}>
          Condition grade{" "}
          <strong>
            {grade !== null ? formatConditionGrade(grade) : "Not provided"}
          </strong>
        </p>
        <p className={styles.titleStatus}>
          <span className={styles.titleLabel}>Title status</span>
          <span
            className={
              titleIsClean ? styles.badgeClean : styles.badgeAttention
            }
          >
            {titleStatus ?? "Not provided"}
          </span>
        </p>
      </div>

      <div className={styles.report}>
        <h3 className={styles.subheading}>Condition report</h3>
        <p className={styles.reportText}>
          {report || "Not provided"}
        </p>
      </div>

      <div className={styles.damage}>
        <h3 className={styles.subheading}>Damage notes</h3>
        {damageNotes.length === 0 ? (
          <p className={styles.emptyDamage}>No damage notes reported.</p>
        ) : (
          <ul className={styles.damageList}>
            {damageNotes.map((note, index) => (
              <li key={`${index}-${note}`}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
