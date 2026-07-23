import { Link, useParams } from "react-router-dom";
import { VehicleCondition } from "../components/vehicle-detail/VehicleCondition";
import { VehicleGallery } from "../components/vehicle-detail/VehicleGallery";
import { VehicleHeader } from "../components/vehicle-detail/VehicleHeader";
import { VehiclePricingSummary } from "../components/vehicle-detail/VehiclePricingSummary";
import { VehicleSpecifications } from "../components/vehicle-detail/VehicleSpecifications";
import { SellerInformation } from "../components/vehicle-detail/SellerInformation";
import { useInventory } from "../state/useInventory";
import styles from "./VehicleDetailPage.module.css";

export function VehicleDetailPage() {
  const { id } = useParams();
  const { getVehicleById } = useInventory();
  const vehicle = id ? getVehicleById(id) : undefined;

  if (!vehicle) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1 className={styles.notFoundTitle}>Vehicle not found</h1>
          <p className={styles.notFoundMessage}>
            This vehicle may no longer be available or the link may be
            incorrect.
          </p>
          <Link to="/" className={styles.notFoundAction}>
            Back to inventory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <VehicleHeader vehicle={vehicle} />

      <div className={styles.hero}>
        <VehicleGallery vehicle={vehicle} />
        <VehiclePricingSummary vehicle={vehicle} />
      </div>

      <VehicleSpecifications vehicle={vehicle} />
      <VehicleCondition vehicle={vehicle} />
      <SellerInformation vehicle={vehicle} />
    </main>
  );
}
