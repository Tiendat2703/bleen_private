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
    
    // Debug logging
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check if response has content
    const text = await response.text();
    console.log('Raw response text:', text);
    
    // Try to parse as JSON if not empty
    let data;
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was not valid JSON:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }
    } else {
      console.error('Empty response from server');
      data = {
        success: false,
        message: 'Server returned empty response'
      };
    }
    
    return { response, data };
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export default getApiUrl;
