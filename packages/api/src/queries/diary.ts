import { queryOptions } from '@tanstack/react-query';

import type { DiaryEntry } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type DiaryResponse = {
  diaryId: number;
  tripId: number;
  memberId: number;
  memberNickname: string;
  content: string;
  createdAt: string;
};

type CreateDiaryResponse = {
  diaryId: number;
};

const toDiaryEntry = (response: DiaryResponse): DiaryEntry => ({
  id: String(response.diaryId),
  tripId: String(response.tripId),
  memberId: String(response.memberId),
  memberNickname: response.memberNickname,
  content: response.content,
  createdAt: response.createdAt
});

export const tripDiariesQueryKey = (tripId: string) => ['trips', tripId, 'diaries'] as const;

export const tripDiariesQueryOptions = ({
  tripId,
  memberId
}: {
  tripId: string;
  memberId?: number;
}) =>
  queryOptions({
    queryKey: tripDiariesQueryKey(tripId),
    queryFn: async (): Promise<DiaryEntry[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<DiaryResponse[]>>(`/api/v1/trips/${tripId}/diaries`, {
          params: { userId: memberId }
        })
      );
      return response.map(toDiaryEntry);
    },
    staleTime: 10 * 1000,
    retry: 1
  });

export type CreateDiaryParams = {
  tripId: string;
  memberId: number;
  content: string;
};

export const createDiary = async ({
  tripId,
  memberId,
  content
}: CreateDiaryParams): Promise<string> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<CreateDiaryResponse>>(
      '/api/v1/diaries',
      { tripId: Number(tripId), content },
      { params: { userId: memberId } }
    )
  );
  return String(response.diaryId);
};
