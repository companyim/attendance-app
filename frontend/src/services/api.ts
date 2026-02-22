import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 관리자 인증 토큰이 있다면 추가
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 네트워크/서버 연결 실패 시 사용자 메시지 (배포 시 백엔드 URL 미설정 등)
const NETWORK_ERROR_MESSAGE =
  '서버에 연결할 수 없습니다. 배포 환경이라면 백엔드 URL(VITE_API_URL) 설정을 확인해 주세요.';

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 오류 시 관리자 토큰 제거
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    // 네트워크 오류(연결 거부, CORS, 타임아웃 등) 시 안내 메시지 부여
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message?.includes('Network'))) {
      (error as any).userMessage = NETWORK_ERROR_MESSAGE;
    }
    return Promise.reject(error);
  }
);

export default api;


