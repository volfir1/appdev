import { useState, useEffect } from 'react';
import axios from 'axios';

const useHouseholdData = () => {
  const [households, setHouseholds] = useState([]);
  const [formData, setFormData] = useState({
    barangay: '',
    householdHead: '',
    address: '',
    familyIncome: '',
    employmentStatus: 'Employed',
    educationLevel: 'High School',
    housingType: 'Owned',
    accessToServices: { water: true, electricity: true, sanitation: true },
    governmentAssistance: '',
  });
  const [barangayList, setBarangayList] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [assignedBarangay, setAssignedBarangay] = useState(null);

  // Fetch barangay list from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/barangays', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setBarangayList(res.data.map(b => ({ label: b.name, value: b._id })));
      })
      .catch(() => setBarangayList([]));
  }, []);

  // Initialize form and fetch households
  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    if (role === 'worker' && userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          setAssignedBarangay(res.data.barangay?._id || null);
          setFormData(prev => ({
            ...prev,
            barangay: res.data.barangay?._id || ''
          }));
        })
        .catch(() => {
          setAssignedBarangay(null);
          setFormData(prev => ({ ...prev, barangay: '' }));
        });
    } else {
      setFormData(prev => ({
        ...prev,
        barangay: ''
      }));
    }
    fetchHouseholds();
  }, [barangayList.length]);

  // Fetch households from backend
  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        setLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/households', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(response.data)) {
        const role = localStorage.getItem('role');
        if (role === 'worker' && assignedBarangay) {
          setHouseholds(response.data.filter(h => h.barangay?._id === assignedBarangay));
        } else {
          setHouseholds(response.data);
        }
      } else {
        setHouseholds([]);
      }
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setError('Session expired or unauthorized. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch households');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    if (name.includes('accessToServices.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        accessToServices: { ...prev.accessToServices, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetFormData = () => {
    setFormData({
      barangay: '',
      householdHead: '',
      address: '',
      familyIncome: '',
      employmentStatus: 'Employed',
      educationLevel: 'High School',
      housingType: 'Owned',
      accessToServices: { water: true, electricity: true, sanitation: true },
      governmentAssistance: '',
    });
  };

  const handleSubmit = async () => {
    // Accept 0 as valid family income, but not empty or null
    if (!formData.barangay || formData.familyIncome === '' || formData.familyIncome === null || isNaN(formData.familyIncome)) {
      setError('Barangay and Family Income are required');
      return;
    }
    // Always use ObjectId for barangay
    let barangayId = formData.barangay;
    if (typeof barangayId === 'string' && barangayId.length < 24) {
      const found = barangayList.find(b => b.label === barangayId);
      if (found) barangayId = found.value;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        return;
      }
      const householdData = {
        ...formData,
        barangay: barangayId,
        familyIncome: Number(formData.familyIncome),
        governmentAssistance: formData.governmentAssistance 
          ? formData.governmentAssistance.split(',').map(s => s.trim()) 
          : [],
      };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/households/${editingId}`, householdData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5000/api/households', householdData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchHouseholds();
      resetFormData();
      setEditingId(null);
      setError('');
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to save household');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (household) => {
    setFormData({
      barangay: household.barangay?.name || '',
      householdHead: household.householdHead || '',
      address: household.address || '',
      familyIncome: household.familyIncome,
      employmentStatus: household.employmentStatus,
      educationLevel: household.educationLevel,
      housingType: household.housingType,
      accessToServices: household.accessToServices,
      governmentAssistance: household.governmentAssistance.join(', '),
    });
    setEditingId(household._id);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        return;
      }

      await axios.delete(`http://localhost:5000/api/households/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh the households list
      await fetchHouseholds();
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete household');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    resetFormData();
    setEditingId(null);
    setError('');
  };

  const handleCsvUpload = async (file) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in');
        return;
      }

      const formData = new FormData();
      formData.append('file', file); // Backend expects 'file' as field name

      await axios.post('http://localhost:5000/api/households/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      // Refresh the households list
      await fetchHouseholds();
      setCsvFile(null);
      setError('');
    } catch (err) {
      console.error('CSV upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload CSV');
    } finally {
      setLoading(false);
    }
  };



  return {
    households,
    formData,
    csvFile,
    editingId,
    error,
    loading,
    barangayList,
    setCsvFile,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    handleCsvUpload,
    fetchHouseholds
  };
};

export default useHouseholdData;