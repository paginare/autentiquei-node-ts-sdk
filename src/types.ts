export interface SdkConfig {
  apiKey: string;
  baseURL?: string;
}

export interface AutentiqueiApiErrorData {
  success: false;
  error: string;
}

// ================== Send Code Types ==================

export interface SendCodeParams {
  phone: string;
  method: 'whatsapp' | 'sms';
}

export interface SendCodeSuccessResponse {
  success: true;
  message: string;
  hash: string;
}

export type SendCodeResponse = SendCodeSuccessResponse | AutentiqueiApiErrorData;

// ================== Verify Code Types =================

export interface VerifyCodeParams {
  hash: string;
  code: string;
}

export interface VerifyCodeSuccessResponse {
  success: true;
  message: string;
}

export type VerifyCodeResponse = VerifyCodeSuccessResponse | AutentiqueiApiErrorData;