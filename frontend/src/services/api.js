import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Prevent multiple logout actions
let isLoggingOut = false;

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !isLoggingOut) {

            isLoggingOut = true;

            // Remove expired tokens
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            // Notify the user
            alert("Your session has expired. Please log in again.");

            // Redirect to login page
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;