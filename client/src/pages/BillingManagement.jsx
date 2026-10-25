
import { useEffect, useState } from "react";
import api from "../api";

function BillingManagement() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setError("");
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch {
      setError("Could not load billing information.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function recordPayment(orderId, paymentMethod) {
    try {
      setError("");

      await api.put(`/orders/${orderId}/payment`, {
        paymentMethod
      });

      await loadOrders();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not record payment."
      );
    }
  }

  if (loading) return <p>Loading bills...</p>;

  return (
    <main className="menu-page">
      <h1>Billing Management</h1>
      <p>Review order totals and record customer payments.</p>

      {error && <p className="error">{error}</p>}

      {orders.length === 0 ? (
        <p>No orders available for billing.</p>
      ) : (
        <div className="menu-grid">
          {orders.map((order) => (
            <article className="menu-card" key={order._id}>
              <h3>{order.customerName}</h3>
              <p>Order ID: {order._id}</p>

              {order.items.map((item, index) => (
                <p key={item._id || index}>
                  {item.name} × {item.quantity} = ₹
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              ))}

              <h3>Total: ₹{order.totalAmount.toFixed(2)}</h3>

              <p>
                Payment: {order.paymentStatus || "Unpaid"}
              </p>
              <p>
                Method: {order.paymentMethod || "Not recorded"}
              </p>

              {order.paymentStatus !== "Paid" &&
              order.status !== "Cancelled" ? (
                <>
                  <label>
                    Payment method
                    <select
                      id={`payment-${order._id}`}
                      defaultValue="Cash"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const select = document.getElementById(
                        `payment-${order._id}`
                      );

                      recordPayment(order._id, select.value);
                    }}
                  >
                    Mark as Paid
                  </button>
                </>
              ) : (
                <p>
                  {order.paymentStatus === "Paid"
                    ? "Payment completed"
                    : "Order cancelled"}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default BillingManagement;
