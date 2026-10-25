
import { useEffect, useState } from "react";
import api from "../api";

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    tableNumber: "1",
    guests: "2",
    reservationDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadReservations() {
    try {
      setError("");
      const response = await api.get("/reservations");
      setReservations(response.data);
    } catch {
      setError("Could not load reservations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/reservations", {
        ...form,
        tableNumber: Number(form.tableNumber),
        guests: Number(form.guests),
        reservationDate: new Date(form.reservationDate).toISOString(),
      });

      setForm({
        customerName: "",
        phone: "",
        tableNumber: "1",
        guests: "2",
        reservationDate: "",
      });

      await loadReservations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not create reservation."
      );
    }
  }

  async function updateStatus(id, status) {
    try {
      setError("");
      await api.put(`/reservations/${id}/status`, { status });
      await loadReservations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update reservation."
      );
    }
  }

  return (
    <main className="menu-page">
      <h1>Table Reservation System</h1>
      <p>Book tables and manage customer reservations.</p>

      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Customer name"
          value={form.customerName}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label>
          Table number
          <select
            name="tableNumber"
            value={form.tableNumber}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((table) => (
              <option key={table} value={table}>
                Table {table}
              </option>
            ))}
          </select>
        </label>

        <label>
          Number of guests
          <input
            name="guests"
            type="number"
            min="1"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Reservation date and time
          <input
            name="reservationDate"
            type="datetime-local"
            value={form.reservationDate}
            onChange={handleChange}
            min={new Date(Date.now() + 60000)
              .toISOString()
              .slice(0, 16)}
            required
          />
        </label>

        <button type="submit">Book Table</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Existing Reservations</h2>

      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div className="menu-grid">
          {reservations.map((reservation) => (
            <article className="menu-card" key={reservation._id}>
              <h3>{reservation.customerName}</h3>
              <p>Phone: {reservation.phone}</p>
              <p>Table: {reservation.tableNumber}</p>
              <p>Guests: {reservation.guests}</p>
              <p>
                Date:{" "}
                {new Date(reservation.reservationDate).toLocaleString()}
              </p>
              <p>Status: {reservation.status}</p>

              <select
                value={reservation.status}
                onChange={(event) =>
                  updateStatus(reservation._id, event.target.value)
                }
              >
                <option>Booked</option>
                <option>Seated</option>
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

export default ReservationManagement;
