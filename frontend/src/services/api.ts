/* PhishGuard API Service
 * Handles all HTTP communication with the FastAPI backend.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ScanResult, HistoryResponse, Statistics, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          const message = error.response.data?.detail || 'An unexpected error occurred';
          console.error('API Error:', message);
          return Promise.reject(new Error(message));
        } else if (error.request) {
          console.error('Network Error:', error.message);
          return Promise.reject(new Error('Unable to connect to the server. Please ensure the backend is running.'));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check - verify backend connectivity
   */
  async healthCheck(): Promise<{ status: string; app: string; version: string }> {
    const response = await this.client.get('/');
    return response.data;
  }

  /**
   * Analyze a URL for phishing indicators
   */
  async analyzeUrl(url: string): Promise<ScanResult> {
    const response = await this.client.post<ScanResult>('/analyze', { url });
    return response.data;
  }

  /**
   * Get paginated scan history with optional search
   */
  async getHistory(params?: {
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<HistoryResponse> {
    const response = await this.client.get<HistoryResponse>('/history', {
      params: {
        search: params?.search || undefined,
        skip: params?.skip || 0,
        limit: params?.limit || 50,
      },
    });
    return response.data;
  }

  /**
   * Delete a specific history record
   */
  async deleteHistoryRecord(id: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/history/${id}`);
    return response.data;
  }

  /**
   * Clear all history records
   */
  async clearAllHistory(): Promise<{ message: string }> {
    const response = await this.client.delete('/history');
    return response.data;
  }

  /**
   * Get dashboard statistics
   */
  async getStatistics(): Promise<Statistics> {
    const response = await this.client.get<Statistics>('/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

