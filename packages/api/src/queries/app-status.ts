import { queryOptions } from '@tanstack/react-query';

import { getApiClient } from '../client';

export type AppStatusResponse = {
  status: 'ok';
};

/** 백엔드 연동 전 스켈레톤용 쿼리 (연결되면 queryFn만 교체) */
export const appStatusQueryOptions = queryOptions({
  queryKey: ['app', 'status'],
  queryFn: async (): Promise<AppStatusResponse> => {
    try {
      const { data } = await getApiClient().get<AppStatusResponse>('/api/health');
      return data;
    } catch {
      return { status: 'ok' };
    }
  }
});
