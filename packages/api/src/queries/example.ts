import { queryOptions } from '@tanstack/react-query';

import { getApiClient } from '../client';

export type ExampleResponse = {
  ok: boolean;
};

export const exampleQueryKey = ['example'] as const;

/** 템플릿  */
export const exampleQueryOptions = () =>
  queryOptions({
    queryKey: exampleQueryKey,
    queryFn: async (): Promise<ExampleResponse> => {
      const { data } = await getApiClient().get<ExampleResponse>('/api/example');
      return data;
    },
    staleTime: 60 * 1000,
    retry: 1
  });
