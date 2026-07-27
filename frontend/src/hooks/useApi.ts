/* Custom hook for API operations
 * Manages loading states, error handling, and data fetching
 */

import { useState, useCallback } from 'react';
import apiService from '../services/api';
import type { ScanResult, HistoryResponse, Statistics } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

function useApiState<T>(initialData: T | null = null): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return { ...state, execute, reset };
}

export function useAnalyzeUrl() {
  const { data, loading, error, execute, reset } = useApiState<ScanResult>();

  const analyzeUrl = useCallback(
    async (url: string) => {
      return execute(() => apiService.analyzeUrl(url));
    },
    [execute]
  );

  return { result: data, loading, error, analyzeUrl, reset };
}

export function useHistory() {
  const { data, loading, error, execute } = useApiState<HistoryResponse>();

  const fetchHistory = useCallback(
    async (params?: { search?: string; skip?: number; limit?: number }) => {
      return execute(() => apiService.getHistory(params));
    },
    [execute]
  );

  const deleteRecord = useCallback(
    async (id: number) => {
      try {
        await apiService.deleteHistoryRecord(id);
        // Refresh history after deletion
        await fetchHistory();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete record';
        console.error(message);
        return false;
      }
    },
    [fetchHistory]
  );

  const clearAll = useCallback(async () => {
    try {
      await apiService.clearAllHistory();
      await fetchHistory();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear history';
      console.error(message);
      return false;
    }
  }, [fetchHistory]);

  return {
    history: data,
    loading,
    error,
    fetchHistory,
    deleteRecord,
    clearAll,
  };
}

export function useStatistics() {
  const { data, loading, error, execute } = useApiState<Statistics>();

  const fetchStatistics = useCallback(async () => {
    return execute(() => apiService.getStatistics());
  }, [execute]);

  return { stats: data, loading, error, fetchStatistics };
}

export function useHealthCheck() {
  const { data, loading, error, execute } = useApiState<{
    status: string;
    app: string;
    version: string;
  }>();

  const checkHealth = useCallback(async () => {
    return execute(() => apiService.healthCheck());
  }, [execute]);

  return { health: data, loading, error, checkHealth };
}

export { useApiState };

