import { ApiResponse, Workflow } from '@/types';
import { createQuery } from 'react-query-kit';
import { api } from '../common';

export const useGetWorkflows = createQuery<Workflow[], void>({
  queryKey: ['workflows'],
  fetcher: async () => {
    const { data } = await api.get<ApiResponse<Workflow[]>>('/workflows');
    return data.data;
  },
  retry: false,
  refetchOnWindowFocus: false,
});