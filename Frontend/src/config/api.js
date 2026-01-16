const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://digitalvoyager.onrender.com';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/api/auth/resend-otp`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: (token) => `${API_BASE_URL}/api/auth/reset-password/${token}`,
  GET_ME: `${API_BASE_URL}/api/auth/me`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/update-profile`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,
  CHAT: `${API_BASE_URL}/api/chat`,
  CONTACT_SEND: `${API_BASE_URL}/api/contact/send`,
};

export default API_BASE_URL;







