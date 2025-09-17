// API Configuration
const getApiBaseUrl = () => {
  // In development, use the proxy (relative URLs)
  // if (true) {
  //   return "/api";
  // }

  // In production, use Vercel API routes to avoid mixed content issues
  return "https://hafkhan.duckwichtrust.tech";
};

export const API_BASE_URL = getApiBaseUrl();

