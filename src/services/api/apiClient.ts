import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");

      // Check if we're in the admin section
      if (window.location.pathname.startsWith("/admin")) {
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
