import { ApiResponse, Workflow } from '@/types';
import { createInfiniteQuery } from 'react-query-kit';
import { api } from '../common';

type Response = Workflow[];
type Variables = { limit?: number };

export const useGetWorkflows = createInfiniteQuery<Response, Variables, number>({
  queryKey: ['workflows'],
  fetcher: async (variables, { pageParam }) => {
    const page = pageParam ?? 1;
    const limit = variables?.limit ?? 10;

    const { data } = await api.get<ApiResponse<Workflow[]>>(
      `/workflows?page=${page}&limit=${limit}`
    );

    return data.data;
  },
  getNextPageParam: (lastPage, allPages) => {
    if (!lastPage || lastPage.length < 10) return undefined;
    return allPages.length + 1;
  },
  initialPageParam: 1,
  refetchOnWindowFocus: false,
});
