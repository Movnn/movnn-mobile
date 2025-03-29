import api from "./apiConfig";

const authApi = {
  login: (data) => api.post("/login", data),
  logout: () => api.post("/logout"),
  verifyOtp: (data) => api.post("/verify-otp", data),
  signUp: (data) => api.post("/users/sign-up", data),
  resendOtp: (data) => api.post("/resend-otp", data),
};

export default authApi;
