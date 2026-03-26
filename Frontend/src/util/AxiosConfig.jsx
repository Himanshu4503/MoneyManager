import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Endpoints that do NOT require Authorization
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// Request interceptor
axiosConfig.interceptors.request.use(
    (config) => {

        // Safety check
        if (!config || !config.url) {
            return config;
        }

        const shouldSkipToken = excludeEndpoints.some((endpoint) => {
     return config.url?.includes(endpoint)
    });

        if (!shouldSkipToken) {
            const accessToken = localStorage.getItem("token");
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Response interceptor
axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }

        return Promise.reject(error);
    }
);

export default axiosConfig;
