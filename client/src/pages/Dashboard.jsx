
import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [menuRes, ordersRes, reservationsRes] =
          await Promise.all([
            api.get("/menu"),
            api.get("/orders"),
            api.get("/reservations"),
          ]);

        setMenu(menuRes.data);
        setOrders(ordersRes.data);
        setReservations(reservationsRes.data);
      } catch {
        setError("Could not load dashboard data. Check the backend.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  );

  const revenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending" ||
               order.status === "Preparing"
  );

  const activeReservations = reservations.filter(
    (reservation) =>
      ["Booked", "Seated"].includes(reservation.status)
  );

  if (loading) return <main className="menu-page"><p>Loading dashboard...</p></main>;

  return (
    <main className="menu-page">
      <h1>Restaurant Dashboard</h1>
      <p>Overview of your restaurant's operations.</p>

      {error && <p className="error">{error}</p>}

      <div className="menu-grid">
        <article className="menu-card">
          <h2>Menu Items</h2>
          <h1>{menu.length}</h1>
        </article>

        <article className="menu-card">
          <h2>Total Orders</h2>
          <h1>{orders.length}</h1>
        </article>

        <article className="menu-card">
          <h2>Pending Orders</h2>
          <h1>{pendingOrders.length}</h1>
        </article>

        <article className="menu-card">
          <h2>Active Reservations</h2>
          <h1>{activeReservations.length}</h1>
        </article>

        <article className="menu-card">
          <h2>Collected Revenue</h2>
          <h1>₹{revenue.toFixed(2)}</h1>
        </article>
      </div>

      <h2>Recent Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        [...orders].reverse().slice(0, 5).map((order) => (
          <article className="menu-card" key={order._id}>
            <h3>{order.customerName}</h3>
            <p>Total: ₹{Number(order.totalAmount || 0).toFixed(2)}</p>
            <p>Order status: {order.status}</p>
            <p>Payment: {order.paymentStatus || "Unpaid"}</p>
          </article>
        ))
      )}
    </main>
  );
}

export default Dashboard;
