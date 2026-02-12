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
    const { data } = await api.get<{ data: HealthCheckResponse }>('/health', {
      timeout: 15000,
    });

    return data.data;
  },
  retry: 8,
  retryDelay: (attemptIndex) =>
    Math.min(2000 * 2 ** attemptIndex, 30000), // exponential backoff (max 30s)
  refetchOnWindowFocus: true,
  refetchInterval: (query) =>
    query.state.data?.status === 'ok' ? false : 5000,
});