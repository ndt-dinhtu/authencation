
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

export const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL,
    withCredentials: true,
});

//gắn accesstoken vào req header
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        // Những API không xử lý refresh
        if (
            originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }
        // Khởi tạo số lần retry nếu chưa có
        originalRequest._retryCount = originalRequest._retryCount || 0;
        // Nếu bị 403 và còn số lần retry
        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            try {
                // Gọi refresh token
                const res = await api.post(
                    "/auth/refresh",
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = res.data.accessToken;
                // Lưu token vào store
                useAuthStore.getState().setAccessToken(newAccessToken);
                // Gán token mới vào header của request cũ
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                // Retry lại request cũ
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh cũng fail → logout
                useAuthStore.getState().clearState();
                return Promise.reject(refreshError);
            }
        }
        // Nếu quá 4 lần retry hoặc không phải lỗi 403
        return Promise.reject(error);
    }
);

