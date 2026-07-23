import { vehicles } from "../data/vehicles";
import { VehicleCard } from "../components/VehicleCard";
import styles from "./InventoryPage.module.css";

export function InventoryPage() {
  const count = vehicles.length;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.summary}>
            {count} {count === 1 ? "vehicle" : "vehicles"}
          </p>
        </div>
      </header>

      {count === 0 ? (
        <p className={styles.empty}>No vehicles available.</p>
      ) : (
        <ul className={styles.grid}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className={styles.item}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
