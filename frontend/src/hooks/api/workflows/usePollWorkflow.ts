import { ApiResponse, Workflow } from '@/types';
import { createQuery } from 'react-query-kit';
import { api } from '../common';

interface PollWorkflowVariables {
  id: string;
}

export const usePollWorkflow = createQuery<Workflow, PollWorkflowVariables>({
  queryKey: ['workflow-poll'],
  fetcher: async ({ id }) => {
    const { data } = await api.get<ApiResponse<Workflow>>(`/workflows/${id}`);
    return data.data;
  },
  refetchInterval: (query) => {
    const data = query.state.data;

    if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
      return false;
    }

    return 2000;
  },
  retry: false,
  refetchOnWindowFocus: false,
});
