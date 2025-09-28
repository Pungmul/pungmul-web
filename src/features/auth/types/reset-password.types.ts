// API 요청용 타입
export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
  token: string;
}

// API 응답용 타입
export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  data?: unknown;
} 

export interface EmailCheckRequest {
  email: string;
}

export interface EmailCheckResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}