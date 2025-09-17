// API Configuration
const getApiBaseUrl = () => {
  // In development, use the proxy (relative URLs)
  // if (true) {
  //   return "/api";
  // }

  // In production, use Vercel API routes to avoid mixed content issues
  return "http://37.32.26.173:8081";
};

export const API_BASE_URL = getApiBaseUrl();

