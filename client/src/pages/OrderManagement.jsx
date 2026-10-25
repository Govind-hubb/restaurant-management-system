
import { useEffect, useState } from "react";
import api, { getMenu } from "../api";

function OrderManagement() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setError("");
      const [menuData, orderResponse] = await Promise.all([
        getMenu(),
        api.get("/orders"),
      ]);
      setMenu(menuData);
      setOrders(orderResponse.data);
    } catch {
      setError("Unable to load menu or orders. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const total = menu.reduce(
    (sum, item) =>
      sum + item.price * Number(quantities[item._id] || 0),
    0
  );

  async function placeOrder(event) {
    event.preventDefault();
    setError("");

    const items = menu
      .filter((item) => Number(quantities[item._id]) > 0)
      .map((item) => ({
        menuItem: item._id,
        quantity: Number(quantities[item._id]),
      }));

    if (!customerName.trim() || items.length === 0) {
      setError("Enter a customer name and select at least one food item.");
      return;
    }

    if (
      items.some(
        (item) =>
          !Number.isInteger(item.quantity) || item.quantity < 1
      )
    ) {
      setError("Quantities must be positive whole numbers.");
      return;
    }

    try {
      await api.post("/orders", {
        customerName: customerName.trim(),
        items,
      });

      setCustomerName("");
      setQuantities({});
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not place the order."
      );
    }
  }

  async function updateStatus(orderId, status) {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      await loadData();
    } catch {
      setError("Could not update order status.");
    }
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <main className="menu-page">
      <h1>Order Management</h1>
      <p>Create customer orders and manage their status.</p>

      <form className="menu-form" onSubmit={placeOrder}>
        <input
          placeholder="Customer name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          required
        />

        <h2>Available Menu</h2>

        {menu.filter((item) => item.available).map((item) => (
          <label key={item._id}>
            {item.name} · ₹{item.price}
            <input
              type="number"
              min="0"
              step="1"
              value={quantities[item._id] || ""}
              placeholder="Qty"
              onChange={(event) =>
                setQuantities({
                  ...quantities,
                  [item._id]: event.target.value,
                })
              }
            />
          </label>
        ))}

        <h3>Estimated total: ₹{total.toFixed(2)}</h3>
        <button type="submit">Place Order</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Existing Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="menu-grid">
          {orders.map((order) => (
            <article className="menu-card" key={order._id}>
              <h3>{order.customerName}</h3>
              <p>Order ID: {order._id}</p>

              {order.items.map((item, index) => (
                <p key={item._id || index}>
                  {item.name} × {item.quantity} · ₹
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              ))}

              <strong>
                Total: ₹{order.totalAmount.toFixed(2)}
              </strong>

              <p>Status: {order.status}</p>

              <select
                value={order.status}
                onChange={(event) =>
                  updateStatus(order._id, event.target.value)
                }
              >
                <option>Pending</option>
                <option>Preparing</option>
                <option>Ready</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default OrderManagement;
