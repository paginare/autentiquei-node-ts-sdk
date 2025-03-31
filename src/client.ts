import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SdkConfig,
  SendCodeParams,
  SendCodeResponse,
  VerifyCodeParams,
  VerifyCodeResponse,
  AutentiqueiApiErrorData
} from './types';

const DEFAULT_BASE_URL = 'https://secure.autentiquei.app/api';

export class AutentiqueiSDK {
  private apiClient: AxiosInstance;
  private apiKey: string;

  constructor(config: SdkConfig) {
    if (!config.apiKey || !config.apiKey.startsWith('autq_')) {
      throw new Error('Chave de API Autentiquei inválida ou não fornecida.');
    }
    this.apiKey = config.apiKey;

    this.apiClient = axios.create({
      baseURL: config.baseURL || DEFAULT_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      timeout: 15000, // Timeout de 15 segundos
    });
  }

  /**
   * Formata erros da API Axios para um Error padrão.
   */
  private handleError(error: unknown): Error {
      let errorMessage = 'Erro desconhecido ao comunicar com a API Autentiquei.';

      if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<AutentiqueiApiErrorData>; // Tipar o erro Axios
          if (axiosError.response) {
              // Tenta pegar a mensagem de erro da API
              errorMessage = axiosError.response.data?.error || `Erro ${axiosError.response.status}: ${axiosError.response.statusText}`;
          } else if (axiosError.request) {
              // A requisição foi feita mas não houve resposta
              errorMessage = 'Não foi possível conectar à API Autentiquei. Verifique sua conexão.';
          } else {
              // Erro ao configurar a requisição
              errorMessage = `Erro ao configurar requisição: ${axiosError.message}`;
          }
      } else if (error instanceof Error) {
          errorMessage = error.message;
      }

      return new Error(errorMessage);
  }

  /**
   * Envia um código de verificação.
   * @param params - Parâmetros para envio (phone, method).
   * @returns Promise com a resposta da API.
   */
  async sendCode(params: SendCodeParams): Promise<SendCodeResponse> {
    try {
      const response = await this.apiClient.post<SendCodeResponse>('/verifications/send', params);
      return response.data;
    } catch (error) {
      // Rejeita a promise com um erro formatado
      throw this.handleError(error);
    }
  }

  /**
   * Verifica um código de verificação.
   * @param params - Parâmetros para verificação (hash, code).
   * @returns Promise com a resposta da API.
   */
  async verifyCode(params: VerifyCodeParams): Promise<VerifyCodeResponse> {
    try {
      const response = await this.apiClient.post<VerifyCodeResponse>('/verifications/verify', params);
      return response.data;
    } catch (error) {
      // Rejeita a promise com um erro formatado
      throw this.handleError(error);
    }
  }
}