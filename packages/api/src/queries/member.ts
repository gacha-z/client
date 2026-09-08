import { queryOptions } from '@tanstack/react-query';

import { getApiClient, unwrap, type ApiEnvelope } from '../client';

export type CurrentMember = {
  id: string;
  nickname: string;
  age: number;
  avatarUri?: string;
};

type MemberDetailResponse = {
  memberId: number;
  nickname: string;
  age: number;
  profileImageUrl?: string | null;
};

const toCurrentMember = (response: MemberDetailResponse): CurrentMember => ({
  id: String(response.memberId),
  nickname: response.nickname,
  age: response.age,
  avatarUri: response.profileImageUrl ?? undefined
});

export const currentMemberQueryKey = ['members', 'me'] as const;

export const currentMemberQueryOptions = () =>
  queryOptions({
    queryKey: currentMemberQueryKey,
    queryFn: async (): Promise<CurrentMember> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<MemberDetailResponse>>('/api/v1/members/me')
      );
      return toCurrentMember(response);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
