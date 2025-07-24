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
        const res = await axios.get('http://localhost:5000/api/programs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrograms(res.data);
        setError('');
      } catch (err) {
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
