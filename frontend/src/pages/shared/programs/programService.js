import axios from 'axios';

const API_URL = 'http://localhost:5000/api/programs';

// Get the token from local storage with error handling
const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.warn('Unable to access localStorage:', error);
    return null;
  }
};

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: Insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('Unexpected error:', error.response.status);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses safely
const handleApiResponse = (response) => {
  if (response && response.data) {
    return response.data;
  }
  return null;
};

// Helper function to handle errors consistently
const handleApiError = (error, operation) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  console.error(`Error ${operation}:`, errorMessage);
  
  // Return a standardized error object
  throw {
    message: errorMessage,
    status: error.response?.status,
    operation,
    originalError: error
  };
};

// Fetch all programs
export const getPrograms = async () => {
  try {
    const response = await axiosInstance.get('/');
    return handleApiResponse(response) || [];
  } catch (error) {
    handleApiError(error, 'fetching programs');
  }
};

// Create a new program
export const createProgram = async (programData) => {
  try {
    // Validate required fields
    if (!programData.name || !programData.startDate || !programData.endDate) {
      throw new Error('Missing required fields: name, startDate, and endDate are required');
    }

    // Sanitize data
    const sanitizedData = {
      name: String(programData.name).trim(),
      description: String(programData.description || '').trim(),
      startDate: programData.startDate,
      endDate: programData.endDate,
      // Add any other fields you need
    };

    const response = await axiosInstance.post('/', sanitizedData);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, 'creating program');
  }
};

// Update a program
export const updateProgram = async (id, programData) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error('Program ID is required for update');
    }

    // Validate required fields
    if (!programData.name || !programData.startDate || !programData.endDate) {
      throw new Error('Missing required fields: name, startDate, and endDate are required');
    }

    // Sanitize data
    const sanitizedData = {
      name: String(programData.name).trim(),
      description: String(programData.description || '').trim(),
      startDate: programData.startDate,
      endDate: programData.endDate,
      // Add any other fields you need
    };

    const response = await axiosInstance.put(`/${id}`, sanitizedData);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, 'updating program');
  }
};

// Delete a program
export const deleteProgram = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error('Program ID is required for deletion');
    }

    const response = await axiosInstance.delete(`/${id}`);
    return handleApiResponse(response) || { success: true };
  } catch (error) {
    handleApiError(error, 'deleting program');
  }
};

// Get a single program by ID
export const getProgramById = async (id) => {
  try {
    if (!id) {
      throw new Error('Program ID is required');
    }

    const response = await axiosInstance.get(`/${id}`);
    return handleApiResponse(response);
  } catch (error) {
    handleApiError(error, 'fetching program by ID');
  }
};

// Search programs
export const searchPrograms = async (query) => {
  try {
    const response = await axiosInstance.get(`/search?q=${encodeURIComponent(query)}`);
    return handleApiResponse(response) || [];
  } catch (error) {
    handleApiError(error, 'searching programs');
  }
};

// Get programs by status
export const getProgramsByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`/status/${status}`);
    return handleApiResponse(response) || [];
  } catch (error) {
    handleApiError(error, `fetching programs by status: ${status}`);
  }
};

// Export the axios instance for custom requests if needed
export { axiosInstance };