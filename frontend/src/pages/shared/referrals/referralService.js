import axios from "axios";
const API_BASE = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export async function fetchReferrals() {
  const headers = { Authorization: `Bearer ${getToken()}` };
  const res = await axios.get(`${API_BASE}/referrals`, { headers });
  return res.data;
}

export async function updateReferral(id, data) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  return axios.put(`${API_BASE}/referrals/${id}`, data, { headers });
}