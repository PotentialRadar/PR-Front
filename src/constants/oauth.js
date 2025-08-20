const BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}`;

export const KAKAO_AUTH_URL = `${BASE_URL}/oauth2/authorization/kakao`;
export const GOOGLE_AUTH_URL = `${BASE_URL}/oauth2/authorization/google`;
