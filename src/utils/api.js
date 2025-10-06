// API utility functions
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || '';
};

export const apiCall = async (endpoint, options = {}) => {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default getApiUrl;
