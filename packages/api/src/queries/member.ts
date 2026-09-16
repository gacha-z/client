import { queryOptions } from '@tanstack/react-query';

import { getApiClient, unwrap, type ApiEnvelope } from '../client';

export type CurrentMember = {
  id: string;
  nickname: string;
  age: number;
  avatarUri?: string;
  createdAt?: string;
  updatedAt?: string;
};

type MemberDetailResponse = {
  memberId: number;
  nickname: string;
  age: number;
  profileImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
};

type MemberCreateResponse = {
  memberId: number;
};

export type CreateMemberParams = {
  nickname: string;
  age: number;
};

export type UpdateMemberParams = {
  memberId: number;
  nickname?: string;
  age?: number;
};

const toCurrentMember = (response: MemberDetailResponse): CurrentMember => ({
  id: String(response.memberId),
  nickname: response.nickname,
  age: response.age,
  avatarUri: response.profileImageUrl ?? undefined,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt ?? undefined
});

export const currentMemberQueryKey = ['members', 'me'] as const;

export const createMember = async ({ nickname, age }: CreateMemberParams): Promise<number> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<MemberCreateResponse>>('/api/v1/members', { nickname, age })
  );
  return response.memberId;
};

export const getCurrentMember = async (memberId: number): Promise<CurrentMember> => {
  const response = await unwrap(
    getApiClient().get<ApiEnvelope<MemberDetailResponse>>('/api/v1/members/me', {
      params: { userId: memberId }
    })
  );
  return toCurrentMember(response);
};

export const currentMemberQueryOptions = (memberId?: number) =>
  queryOptions({
    queryKey: [...currentMemberQueryKey, memberId] as const,
    queryFn: async (): Promise<CurrentMember> => {
      if (!memberId) throw new Error('회원 ID가 필요합니다.');
      return getCurrentMember(memberId);
    },
    enabled: Boolean(memberId),
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

export const updateMember = async ({
  memberId,
  nickname,
  age
}: UpdateMemberParams): Promise<CurrentMember> => {
  const response = await unwrap(
    getApiClient().patch<ApiEnvelope<MemberDetailResponse>>(
      '/api/v1/members/me',
      { nickname, age },
      { params: { userId: memberId } }
    )
  );
  return toCurrentMember(response);
};

export const deleteMember = async (memberId: number): Promise<void> => {
  await unwrap(
    getApiClient().delete<ApiEnvelope<null>>('/api/v1/members/me', {
      params: { userId: memberId }
    })
  );
};
