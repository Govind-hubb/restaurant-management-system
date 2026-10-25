
import { useEffect, useState } from "react";
import { getMenu, addMenuItem, deleteMenuItem } from "../api";

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadMenu() {
    try {
      setError("");
      const data = await getMenu();
      setItems(data);
    } catch {
      setError("Could not load the menu. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.category.trim() ||
        form.price === "" || !Number.isFinite(Number(form.price)) ||
        Number(form.price) < 0) {
      setError("Enter a food name, category, and valid price.");
      return;
    }

    try {
      await addMenuItem({
        ...form,
        name: form.name.trim(),
        price: Number(form.price),
        available: true,
      });

      setForm({
        name: "",
        category: "Main Course",
        price: "",
        description: "",
      });

      await loadMenu();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add food item.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this food item?")) return;

    try {
      await deleteMenuItem(id);
      await loadMenu();
    } catch {
      setError("Could not delete the food item.");
    }
  }

  return (
    <main className="menu-page">
      <h1>Restaurant Menu Management</h1>
      <p>Add and manage your restaurant's food items.</p>

      <form className="menu-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Food name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Starter</option>
          <option>Main Course</option>
          <option>Bread</option>
          <option>Dessert</option>
          <option>Beverage</option>
        </select>

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Price in ₹"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Add Food Item</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Food Menu</h2>

      {loading ? (
        <p>Loading menu...</p>
      ) : items.length === 0 ? (
        <p>No food items yet. Add your first item above.</p>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <article className="menu-card" key={item._id}>
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>{item.description}</p>
              <strong>₹{item.price.toFixed(2)}</strong>
              <p>{item.available ? "Available" : "Unavailable"}</p>
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MenuManagement;
