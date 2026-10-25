
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import MenuManagement from "./pages/MenuManagement";
import OrderManagement from "./pages/OrderManagement";
import ReservationManagement from "./pages/ReservationManagement";
import "./styles.css";
import BillingManagement from "./pages/BillingManagement";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <header>
        <h2>Restaurant Management System</h2>

        <nav>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/reservations">Reservations</NavLink>
          <NavLink to="/billing">Billing</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/reservations" element={<ReservationManagement />} />
        <Route path="/billing" element={<BillingManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
