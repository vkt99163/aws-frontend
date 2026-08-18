import axios from "axios";

const API = axios.create({
  baseURL: "https://aws-backend-93wl.onrender.com", 
});

// Request Interceptor: Har API request ke sath token bhejne ke liye
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: 401 aane par token clear aur redirect karne ke liye
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default API;