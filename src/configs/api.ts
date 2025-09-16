// API Configuration
const getApiBaseUrl = () => {
  // In development, use the proxy (relative URLs)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use the actual backend server
  return 'http://37.32.26.173:8080';
};

export const API_BASE_URL = getApiBaseUrl();
