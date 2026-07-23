import type { ChangeEvent } from "react";
import { ALL_OPTION_VALUE } from "../lib/inventorySelectors";
import styles from "./InventoryFilters.module.css";

type InventoryFiltersProps = {
  make: string;
  bodyStyle: string;
  province: string;
  makeOptions: readonly string[];
  bodyStyleOptions: readonly string[];
  provinceOptions: readonly string[];
  canClear: boolean;
  onMakeChange: (value: string) => void;
  onBodyStyleChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
  onClearAll: () => void;
};

export function InventoryFilters({
  make,
  bodyStyle,
  province,
  makeOptions,
  bodyStyleOptions,
  provinceOptions,
  canClear,
  onMakeChange,
  onBodyStyleChange,
  onProvinceChange,
  onClearAll,
}: InventoryFiltersProps) {
  function handleMakeChange(event: ChangeEvent<HTMLSelectElement>) {
    onMakeChange(event.target.value);
  }

  function handleBodyStyleChange(event: ChangeEvent<HTMLSelectElement>) {
    onBodyStyleChange(event.target.value);
  }

  function handleProvinceChange(event: ChangeEvent<HTMLSelectElement>) {
    onProvinceChange(event.target.value);
  }

  return (
    <div className={styles.row}>
      <div className={styles.filters}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="inventory-make">
            Make
          </label>
          <select
            id="inventory-make"
            className={styles.select}
            value={make}
            onChange={handleMakeChange}
          >
            <option value={ALL_OPTION_VALUE}>All</option>
            {makeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="inventory-body-style">
            Body style
          </label>
          <select
            id="inventory-body-style"
            className={styles.select}
            value={bodyStyle}
            onChange={handleBodyStyleChange}
          >
            <option value={ALL_OPTION_VALUE}>All</option>
            {bodyStyleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="inventory-province">
            Province
          </label>
          <select
            id="inventory-province"
            className={styles.select}
            value={province}
            onChange={handleProvinceChange}
          >
            <option value={ALL_OPTION_VALUE}>All</option>
            {provinceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.clearWrap}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearAll}
          disabled={!canClear}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
