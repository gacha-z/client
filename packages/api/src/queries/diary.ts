import { queryOptions } from '@tanstack/react-query';

import type { DiaryDetail, DiaryListItem, DiaryVisibility } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type DiaryListItemResponse = {
  diaryId: number;
  tripId: number;
  memberId: number;
  nickname: string;
  diaryDate: string;
};

type DiaryDetailResponse = {
  diaryId: number;
  tripId: number;
  memberId: number;
  nickname: string;
  content: string;
  diaryDate: string;
};

const toDiaryListItem = (response: DiaryListItemResponse): DiaryListItem => ({
  id: String(response.diaryId),
  tripId: String(response.tripId),
  memberId: String(response.memberId),
  memberNickname: response.nickname,
  diaryDate: response.diaryDate
});

const toDiaryDetail = (response: DiaryDetailResponse): DiaryDetail => ({
  id: String(response.diaryId),
  tripId: String(response.tripId),
  memberId: String(response.memberId),
  memberNickname: response.nickname,
  content: response.content,
  diaryDate: response.diaryDate
});

export const tripDiaryListQueryKey = (tripId: string, diaryDate: string) =>
  ['trips', tripId, 'diaries', diaryDate] as const;

export const tripDiaryListQueryOptions = ({
  tripId,
  diaryDate,
  memberId
}: {
  tripId: string;
  diaryDate: string;
  memberId?: number;
}) =>
  queryOptions({
    queryKey: tripDiaryListQueryKey(tripId, diaryDate),
    queryFn: async (): Promise<DiaryListItem[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<DiaryListItemResponse[]>>(
          `/api/v1/trips/${tripId}/diaries`,
          { params: { userId: memberId, diaryDate } }
        )
      );
      return response.map(toDiaryListItem);
    },
    staleTime: 10 * 1000,
    retry: 1
  });

export const tripDiaryDetailQueryKey = (tripId: string, diaryId: string) =>
  ['trips', tripId, 'diaries', 'detail', diaryId] as const;

export const tripDiaryDetailQueryOptions = ({
  tripId,
  diaryId,
  memberId
}: {
  tripId: string;
  diaryId: string;
  memberId?: number;
}) =>
  queryOptions({
    queryKey: tripDiaryDetailQueryKey(tripId, diaryId),
    queryFn: async (): Promise<DiaryDetail> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<DiaryDetailResponse>>(
          `/api/v1/trips/${tripId}/diaries/${diaryId}`,
          { params: { userId: memberId } }
        )
      );
      return toDiaryDetail(response);
    },
    staleTime: 10 * 1000,
    retry: 1
  });

export type CreateDiaryParams = {
  tripId: string;
  memberId: number;
  content: string;
  diaryDate: string;
  visibility?: DiaryVisibility;
  isAiGenerated?: boolean;
  sourceContent?: string;
};

export const createDiary = async ({
  tripId,
  memberId,
  content,
  diaryDate,
  visibility = 'TEAM',
  isAiGenerated,
  sourceContent
}: CreateDiaryParams): Promise<DiaryDetail> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<DiaryDetailResponse>>(
      '/api/v1/diaries',
      { tripId: Number(tripId), content, diaryDate, visibility, isAiGenerated, sourceContent },
      { params: { userId: memberId } }
    )
  );
  return toDiaryDetail(response);
};

export type UpdateDiaryParams = {
  diaryId: string;
  memberId: number;
  content: string;
  visibility?: DiaryVisibility;
};

export const updateDiary = async ({
  diaryId,
  memberId,
  content,
  visibility = 'TEAM'
}: UpdateDiaryParams): Promise<DiaryDetail> => {
  const response = await unwrap(
    getApiClient().patch<ApiEnvelope<DiaryDetailResponse>>(
      `/api/v1/diaries/${diaryId}`,
      { memberId, content, visibility },
      { params: { userId: memberId } }
    )
  );
  return toDiaryDetail(response);
};

export const deleteDiary = async ({
  diaryId,
  memberId
}: {
  diaryId: string;
  memberId: number;
}): Promise<void> => {
  await unwrap(
    getApiClient().delete<ApiEnvelope<unknown>>(`/api/v1/diaries/${diaryId}`, {
      params: { userId: memberId }
    })
  );
};

export type GenerateDiaryDraftParams = {
  tripId: string;
  memberId: number;
  content: string;
};

export const generateDiaryDraft = async ({
  tripId,
  memberId,
  content
}: GenerateDiaryDraftParams): Promise<string> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<{ content: string; aiGenerated: boolean }>>(
      '/api/v1/diaries/generate',
      { tripId: Number(tripId), content },
      { params: { userId: memberId } }
    )
  );
  return response.content;
};
