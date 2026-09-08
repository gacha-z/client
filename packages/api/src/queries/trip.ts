import { queryOptions } from '@tanstack/react-query';

import type { TripDetail, TripMember, TripStatus } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type TripDetailResponse = {
  tripId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
};

type TripMemberResponse = {
  memberId: number;
  nickname: string;
  profileImageUrl?: string | null;
  role: 'OWNER' | 'MEMBER';
};

const toTripDetail = (response: TripDetailResponse): TripDetail => ({
  id: String(response.tripId),
  title: response.title,
  startDate: response.startDate,
  endDate: response.endDate,
  status: response.status
});

const toTripMember = (response: TripMemberResponse): TripMember => ({
  id: String(response.memberId),
  name: response.nickname,
  avatarUri: response.profileImageUrl ?? undefined,
  role: response.role
});

export const tripDetailQueryKey = (tripId: string) => ['trips', tripId] as const;

export const tripDetailQueryOptions = (tripId: string) =>
  queryOptions({
    queryKey: tripDetailQueryKey(tripId),
    queryFn: async (): Promise<TripDetail> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripDetailResponse>>(`/api/v1/trips/${tripId}`)
      );
      return toTripDetail(response);
    },
    staleTime: 60 * 1000,
    retry: 1
  });

export const tripMembersQueryKey = (tripId: string) => ['trips', tripId, 'members'] as const;

export const tripMembersQueryOptions = (tripId: string) =>
  queryOptions({
    queryKey: tripMembersQueryKey(tripId),
    queryFn: async (): Promise<TripMember[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripMemberResponse[]>>(`/api/v1/trips/${tripId}/members`)
      );
      return response.map(toTripMember);
    },
    staleTime: 30 * 1000,
    retry: 1
  });
