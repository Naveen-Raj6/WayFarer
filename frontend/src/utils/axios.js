import axios from "axios";


const axiosInstance = axios.create({
    // baseURL: "http://localhost:8000/api/v1",
    // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
    baseURL: ` https://wayfarer-1e0i.onrender.com/api/v1`,
    headers: {
        "Content-Type": "application/json",
    }
})

// Add a request interceptor to attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;