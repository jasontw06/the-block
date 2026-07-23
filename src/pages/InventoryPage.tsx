import { vehicles } from "../data/vehicles";

export function InventoryPage() {
  return (
    <main>
      <h1>Inventory</h1>
      <p>{vehicles.length} vehicles</p>
    </main>
  );
}
