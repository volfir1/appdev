
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = `${API_BASE}/users`;

export const getAllUsers = async () => {
  const res = await axios.get(`${BASE_URL}/all`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const softDeleteUser = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const recoverUser = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.patch(`${BASE_URL}/recover/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};