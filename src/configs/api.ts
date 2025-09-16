// API Configuration
const getApiBaseUrl = () => {
  // In development, use the proxy (relative URLs)
  if (import.meta.env.DEV) {
    return "";
  }

  // In production, use Vercel API routes to avoid mixed content issues
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

