import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type {
  RegionCandidate,
  TravelCreateRequest,
  TripDetail,
  TripListPage,
  TripMember,
  TripStatus,
  TripSummary,
  TripUpdateRequest
} from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type TripSummaryResponse = {
  tripId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  memberLimit: number;
  joinedMemberCount: number;
  tripRegionId?: number | null;
  tripRegionName?: string | null;
  createdAt: string;
};

type TripListResponse = {
  trips: TripSummaryResponse[];
  nextCursor?: number | null;
  hasNext: boolean;
};

export type TripListParams = {
  title?: string;
  tripRegionId?: number;
  status?: TripStatus;
  dateFrom?: string;
  dateTo?: string;
  size?: number;
  memberId?: number;
};

type TripDetailResponse = {
  tripId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  memberLimit: number;
  joinedMemberCount: number;
  missionMin: number;
  missionMax: number;
  missionStartAt: string;
  ownerMemberId: number;
  tripRegionId?: number | null;
  tripRegionName?: string | null;
  tripRegionImageUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type TripMemberResponse = {
  memberId: number;
  nickname?: string | null;
  profileImageUrl?: string | null;
  role: 'OWNER' | 'MEMBER';
};

type TripRegionResponse = {
  tripCandidateId: number;
  tripRegionId: number;
  tripRegionCode: string;
  tripRegionName: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  useYn?: string | null;
  createdAt?: string | null;
};

type TripCreateResponse = {
  tripId: number;
};

type TripInviteCodeResponse = {
  inviteCode: string;
};

type TripJoinResponse = {
  tripId: number;
};

const toTripDetail = (response: TripDetailResponse): TripDetail => ({
  id: String(response.tripId),
  title: response.title,
  startDate: response.startDate,
  endDate: response.endDate,
  status: response.status,
  memberLimit: response.memberLimit,
  joinedMemberCount: response.joinedMemberCount,
  missionMin: response.missionMin,
  missionMax: response.missionMax,
  missionStartAt: response.missionStartAt,
  ownerMemberId: String(response.ownerMemberId),
  tripRegionId:
    response.tripRegionId === null || response.tripRegionId === undefined
      ? undefined
      : String(response.tripRegionId),
  tripRegionName: response.tripRegionName ?? undefined,
  tripRegionImageUrl: response.tripRegionImageUrl ?? undefined,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt ?? undefined
});

const toTripSummary = (response: TripSummaryResponse): TripSummary => ({
  id: String(response.tripId),
  title: response.title,
  startDate: response.startDate,
  endDate: response.endDate,
  status: response.status,
  memberLimit: response.memberLimit,
  joinedMemberCount: response.joinedMemberCount,
  tripRegionId:
    response.tripRegionId === null || response.tripRegionId === undefined
      ? undefined
      : String(response.tripRegionId),
  tripRegionName: response.tripRegionName ?? undefined,
  createdAt: response.createdAt
});

const toTripMember = (response: TripMemberResponse): TripMember => ({
  id: String(response.memberId),
  name: response.nickname ?? '이름 없음',
  avatarUri: response.profileImageUrl ?? undefined,
  role: response.role
});

const toRegionCandidate = (response: TripRegionResponse): RegionCandidate => ({
  id: String(response.tripRegionId),
  candidateId: String(response.tripCandidateId),
  name: response.tripRegionName,
  description: '랜덤으로 추천된 여행 지역이에요.',
  imageUrl: response.imageUrl ?? ''
});

export type CreateTripParams = TravelCreateRequest & { memberId?: number };

export const createTrip = async ({
  title,
  startDate,
  endDate,
  minimumMissionCount,
  maximumMissionCount,
  firstMissionHour,
  firstMissionMinute,
  memberCount,
  memberId
}: CreateTripParams): Promise<string> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<TripCreateResponse>>(
      '/api/v1/trips',
      {
        title,
        startDate,
        endDate,
        memberLimit: memberCount,
        missionMin: minimumMissionCount,
        missionMax: maximumMissionCount,
        missionStartTime: {
          hour: firstMissionHour,
          minute: firstMissionMinute,
          second: 0,
          nano: 0
        }
      },
      { params: { userId: memberId } }
    )
  );

  return String(response.tripId);
};

export const tripDetailQueryKey = (tripId: string) => ['trips', tripId] as const;

export const tripDetailQueryOptions = (tripId: string, memberId?: number) =>
  queryOptions({
    queryKey: tripDetailQueryKey(tripId),
    queryFn: async (): Promise<TripDetail> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripDetailResponse>>(`/api/v1/trips/${tripId}`, {
          params: { userId: memberId }
        })
      );
      return toTripDetail(response);
    },
    staleTime: 60 * 1000,
    retry: 1
  });

export const tripListRootKey = ['trips', 'list'] as const;

export const tripListQueryKey = (params: TripListParams = {}) =>
  [...tripListRootKey, params] as const;

export const tripListInfiniteQueryOptions = (params: TripListParams = {}) =>
  infiniteQueryOptions({
    queryKey: tripListQueryKey(params),
    queryFn: async ({ pageParam }): Promise<TripListPage> => {
      const { memberId, ...rest } = params;
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripListResponse>>('/api/v1/trips', {
          params: { ...rest, userId: memberId, cursor: pageParam ?? undefined }
        })
      );

      return {
        trips: response.trips.map(toTripSummary),
        nextCursor: response.nextCursor ?? null,
        hasNext: response.hasNext
      };
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor !== null ? lastPage.nextCursor : undefined,
    staleTime: 60 * 1000,
    retry: 1
  });

export const tripRegionsQueryKey = (tripId: string) => ['trips', tripId, 'regions'] as const;

export const randomTripRegionsQueryOptions = (tripId: string, memberId?: number) =>
  queryOptions({
    queryKey: tripRegionsQueryKey(tripId),
    queryFn: async (): Promise<RegionCandidate[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripRegionResponse[]>>('/api/v1/trips/regions/random', {
          params: { tripId: Number(tripId), userId: memberId }
        })
      );
      return response.map(toRegionCandidate);
    },
    staleTime: Infinity,
    retry: 1
  });

export const rerollTripRegion = async ({
  tripId,
  tripCandidateId,
  memberId
}: {
  tripId: string;
  tripCandidateId: string;
  memberId: number;
}): Promise<RegionCandidate> => {
  const response = await unwrap(
    getApiClient().patch<ApiEnvelope<TripRegionResponse>>(
      '/api/v1/trips/regions/reroll',
      { tripId: Number(tripId), tripCandidateId: Number(tripCandidateId) },
      { params: { userId: memberId } }
    )
  );
  return toRegionCandidate(response);
};

export const selectTripRegion = async ({
  tripId,
  tripRegionId,
  memberId
}: {
  tripId: string;
  tripRegionId: string;
  memberId: number;
}): Promise<string> => {
  const response = await unwrap(
    getApiClient().patch<ApiEnvelope<TripCreateResponse>>(
      '/api/v1/trips/regions/select',
      { tripId: Number(tripId), tripRegionId: Number(tripRegionId) },
      { params: { userId: memberId } }
    )
  );
  return String(response.tripId);
};

export const cancelTrip = async ({
  tripId,
  requestMemberId
}: {
  tripId: string;
  requestMemberId: number;
}): Promise<void> => {
  await unwrap(
    getApiClient().patch<ApiEnvelope<unknown>>(`/api/v1/trips/${tripId}/cancel`, undefined, {
      params: { userId: requestMemberId }
    })
  );
};

export const tripMembersQueryKey = (tripId: string) => ['trips', tripId, 'members'] as const;

export const tripMembersQueryOptions = (tripId: string, memberId?: number) =>
  queryOptions({
    queryKey: tripMembersQueryKey(tripId),
    queryFn: async (): Promise<TripMember[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripMemberResponse[]>>(`/api/v1/trips/${tripId}/members`, {
          params: { userId: memberId }
        })
      );
      return response.map(toTripMember);
    },
    staleTime: 30 * 1000,
    retry: 1
  });

export const tripInviteCodeQueryKey = (tripId: string) => ['trips', tripId, 'invite-code'] as const;

export const tripInviteCodeQueryOptions = (tripId: string, memberId?: number) =>
  queryOptions({
    queryKey: tripInviteCodeQueryKey(tripId),
    queryFn: async (): Promise<string> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<TripInviteCodeResponse>>(
          `/api/v1/trips/${tripId}/invite-code`,
          { params: { userId: memberId } }
        )
      );
      return response.inviteCode;
    },
    staleTime: Infinity,
    retry: 1
  });

export const joinTrip = async ({
  code,
  memberId
}: {
  code: string;
  memberId: number;
}): Promise<string> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<TripJoinResponse>>(
      '/api/v1/trips/join',
      { code },
      { params: { userId: memberId } }
    )
  );
  return String(response.tripId);
};

export const leaveTrip = async ({
  tripId,
  memberId
}: {
  tripId: string;
  memberId: number;
}): Promise<void> => {
  await unwrap(
    getApiClient().post<ApiEnvelope<unknown>>(`/api/v1/trips/${tripId}/leave`, undefined, {
      params: { userId: memberId }
    })
  );
};

export const kickTripMember = async ({
  tripId,
  targetMemberId,
  memberId
}: {
  tripId: string;
  targetMemberId: string;
  memberId: number;
}): Promise<void> => {
  await unwrap(
    getApiClient().delete<ApiEnvelope<unknown>>(
      `/api/v1/trips/${tripId}/members/${targetMemberId}`,
      { params: { userId: memberId } }
    )
  );
};

export const transferTripOwner = async ({
  tripId,
  newOwnerMemberId,
  memberId
}: {
  tripId: string;
  newOwnerMemberId: string;
  memberId: number;
}): Promise<void> => {
  await unwrap(
    getApiClient().patch<ApiEnvelope<unknown>>(`/api/v1/trips/${tripId}/owner`, undefined, {
      params: { newOwnerMemberId: Number(newOwnerMemberId), userId: memberId }
    })
  );
};

export type UpdateTripParams = TripUpdateRequest & { tripId: string; memberId: number };

export const updateTrip = async ({
  tripId,
  memberId,
  missionStartHour,
  missionStartMinute,
  ...rest
}: UpdateTripParams): Promise<TripDetail> => {
  const missionStartTime =
    missionStartHour !== undefined && missionStartMinute !== undefined
      ? `${String(missionStartHour).padStart(2, '0')}:${String(missionStartMinute).padStart(2, '0')}`
      : undefined;

  const response = await unwrap(
    getApiClient().patch<ApiEnvelope<TripDetailResponse>>(
      `/api/v1/trips/${tripId}`,
      { ...rest, missionStartTime },
      { params: { userId: memberId } }
    )
  );
  return toTripDetail(response);
};
