import { Link, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          The Block
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
