import { queryOptions } from '@tanstack/react-query';

import { getApiClient } from '../client';

export type BootstrapResponse = {
  ok: true;
  checkedAt: string;
};

export const bootstrapQueryKey = ['bootstrap'] as const;

export const bootstrapQueryOptions = () =>
  queryOptions({
    queryKey: bootstrapQueryKey,
    queryFn: async (): Promise<BootstrapResponse> => {
      try {
        const { data } = await getApiClient().get<BootstrapResponse>('/api/bootstrap');
        return data;
      } catch {
        return { ok: true, checkedAt: new Date().toISOString() };
      }
    },
    staleTime: 60 * 1000
  });
