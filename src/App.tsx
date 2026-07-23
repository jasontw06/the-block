import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { InventoryPage } from "./pages/InventoryPage";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { InventoryProvider } from "./state/InventoryProvider";

export default function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<InventoryPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  );
}
