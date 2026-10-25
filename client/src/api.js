
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getMenu = async () => {
  const response = await api.get("/menu");
  return response.data;
};

export const addMenuItem = async (item) => {
  const response = await api.post("/menu", item);
  return response.data;
};

export const updateMenuItem = async (id, item) => {
  const response = await api.put(`/menu/${id}`, item);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

export default api;
