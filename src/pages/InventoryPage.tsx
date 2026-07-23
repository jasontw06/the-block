import { useMemo, useState } from "react";
import { InventoryFilters } from "../components/InventoryFilters";
import { InventoryToolbar } from "../components/InventoryToolbar";
import { VehicleCard } from "../components/VehicleCard";
import {
  DEFAULT_INVENTORY_CONTROLS,
  getBodyStyleOptions,
  getMakeOptions,
  getProvinceOptions,
  hasActiveInventoryControls,
  selectVisibleVehicles,
  type InventoryControlsState,
  type SortOption,
} from "../lib/inventorySelectors";
import { useInventory } from "../state/useInventory";
import styles from "./InventoryPage.module.css";

export function InventoryPage() {
  const { vehicles } = useInventory();
  const [controls, setControls] = useState<InventoryControlsState>(
    DEFAULT_INVENTORY_CONTROLS,
  );

  const makeOptions = useMemo(() => getMakeOptions(vehicles), [vehicles]);
  const bodyStyleOptions = useMemo(
    () => getBodyStyleOptions(vehicles),
    [vehicles],
  );
  const provinceOptions = useMemo(
    () => getProvinceOptions(vehicles),
    [vehicles],
  );

  const visibleVehicles = useMemo(
    () => selectVisibleVehicles(vehicles, controls),
    [vehicles, controls],
  );

  const canClear = useMemo(
    () => hasActiveInventoryControls(controls),
    [controls],
  );

  const count = visibleVehicles.length;

  function updateControls(patch: Partial<InventoryControlsState>) {
    setControls((current) => ({ ...current, ...patch }));
  }

  function handleClearAll() {
    setControls(DEFAULT_INVENTORY_CONTROLS);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Browse vehicles</h1>
      </header>

      <section className={styles.controls} aria-label="Inventory controls">
        <InventoryToolbar
          search={controls.search}
          sort={controls.sort}
          onSearchChange={(search) => updateControls({ search })}
          onSortChange={(sort: SortOption) => updateControls({ sort })}
        />

        <InventoryFilters
          make={controls.make}
          bodyStyle={controls.bodyStyle}
          province={controls.province}
          makeOptions={makeOptions}
          bodyStyleOptions={bodyStyleOptions}
          provinceOptions={provinceOptions}
          canClear={canClear}
          onMakeChange={(make) => updateControls({ make })}
          onBodyStyleChange={(bodyStyle) => updateControls({ bodyStyle })}
          onProvinceChange={(province) => updateControls({ province })}
          onClearAll={handleClearAll}
        />
      </section>

      <div className={styles.resultBar}>
        <p className={styles.summary}>
          {count} {count === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>

      {count === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No vehicles found</h2>
          <p className={styles.emptyMessage}>
            Try adjusting your search or filters.
          </p>
          <button
            type="button"
            className={styles.emptyAction}
            onClick={handleClearAll}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className={styles.grid}>
          {visibleVehicles.map((vehicle) => (
            <li key={vehicle.id} className={styles.item}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
