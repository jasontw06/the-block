import { useContext } from "react";
import { InventoryContext } from "./inventoryContext";

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }

  return context;
}
