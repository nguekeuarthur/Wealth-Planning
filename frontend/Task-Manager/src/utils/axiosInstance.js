import axios from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";
import { getSession, setSession, clearSession } from "./authStorage";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const { token } = getSession();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshRequest = null;

const refreshAccessToken = async () => {
  if (refreshRequest) {
    return refreshRequest;
  }

  const { refreshToken } = getSession();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  refreshRequest = axios
    .post(`${BASE_URL}${API_PATHS.AUTH.REFRESH_TOKEN}`, {
      refreshToken,
    })
    .then((response) => {
      setSession(response.data);
      return response.data;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
};

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const data = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 500) {
      console.error("Server error. Please try again plus tard.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
