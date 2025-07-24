import { useState } from 'react';
import axios from 'axios';

const useDeletedHouseholds = () => {
  const [deletedHouseholds, setDeletedHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDeletedHouseholds = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const res = await axios.get(`${API_BASE}/households?deleted=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedHouseholds(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch deleted households');
      setDeletedHouseholds([]);
    } finally {
      setLoading(false);
    }
  };

  const recoverHousehold = async (id) => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      await axios.patch(`${API_BASE}/households/${id}/recover`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from local list
      setDeletedHouseholds(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to recover household');
    } finally {
      setLoading(false);
    }
  };

  return { deletedHouseholds, loading, error, fetchDeletedHouseholds, recoverHousehold };
};

export default useDeletedHouseholds;
