import { useState, useEffect } from 'react';
import axios from 'axios';

const useProgramsData = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const res = await axios.get(`${API_BASE}/programs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrograms(res.data);
        setError('');
      } catch {
        setError('Failed to fetch programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return { programs, loading, error };
};

export default useProgramsData;
