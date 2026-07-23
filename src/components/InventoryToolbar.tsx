import type { ChangeEvent } from "react";
import {
  SORT_OPTIONS,
  type SortOption,
} from "../lib/inventorySelectors";
import styles from "./InventoryToolbar.module.css";

type InventoryToolbarProps = {
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

export function InventoryToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: InventoryToolbarProps) {
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearchChange(event.target.value);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value as SortOption);
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchField}>
        <label className={styles.label} htmlFor="inventory-search">
          Search
        </label>
        <input
          id="inventory-search"
          className={styles.input}
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search make, model, VIN, lot, or dealer"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.sortField}>
        <label className={styles.label} htmlFor="inventory-sort">
          Sort
        </label>
        <select
          id="inventory-sort"
          className={styles.select}
          value={sort}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
