import { createQuery } from 'react-query-kit';
import { api } from '../common';

interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp?: string;
  services?: {
    database?: string;
    redis?: string;
    gemini?: string;
  };
}

export const useHealthCheck = createQuery<HealthCheckResponse, void>({
  queryKey: ['health'],
  fetcher: async () => {
    try {
      const { data } = await api.get<{ data: HealthCheckResponse }>('/health', {
        timeout: 10000,
      });

      return data.data;
    } catch {
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
      };
    }
  },
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  refetchOnWindowFocus: true,
  refetchInterval: 60000,
});