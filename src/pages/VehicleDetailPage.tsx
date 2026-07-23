import { Link, useParams } from "react-router-dom";
import { vehicles } from "../data/vehicles";

export function VehicleDetailPage() {
  const { id } = useParams();
  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <main>
        <p>Vehicle not found.</p>
        <Link to="/">Back to inventory</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">← Inventory</Link>
      <h1>
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>
    </main>
  );
}
