import { queryOptions } from '@tanstack/react-query';

import type { SetlogEntry } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type SetlogResponse = {
  setlogId: number;
  tripId: number;
  tripMissionId: number;
  memberId: number;
  memberNickname: string;
  fileUrl: string;
  slotNo: number;
  createdAt: string;
};

type SetlogUploadResponse = {
  setlogId: number;
  tripMissionId: number;
  memberId: number;
  fileUrl: string;
  slotNo: number;
  createdAt: string;
};

const toSetlogEntry = (response: SetlogResponse): SetlogEntry => ({
  id: String(response.setlogId),
  tripId: String(response.tripId),
  tripMissionId: String(response.tripMissionId),
  memberId: String(response.memberId),
  memberNickname: response.memberNickname,
  fileUrl: response.fileUrl,
  slotNo: response.slotNo,
  createdAt: response.createdAt
});

export const missionSetlogsQueryKey = (tripMissionId: string) =>
  ['missions', tripMissionId, 'setlogs'] as const;

export const missionSetlogsQueryOptions = (tripMissionId: string) =>
  queryOptions({
    queryKey: missionSetlogsQueryKey(tripMissionId),
    queryFn: async (): Promise<SetlogEntry[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<SetlogResponse[]>>(
          `/api/v1/missions/${tripMissionId}/setlogs`
        )
      );
      return response.map(toSetlogEntry);
    },
    staleTime: 5 * 1000,
    retry: 1
  });

export type UploadSetlogParams = {
  tripId: string;
  tripMissionId: string;
  memberId: string;
  fileUri: string;
};

/** mp4/mov, 최대 100MB (백엔드 제약) */
export const uploadSetlog = async ({
  tripId,
  tripMissionId,
  memberId,
  fileUri
}: UploadSetlogParams): Promise<SetlogEntry> => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: 'setlog.mp4',
    type: 'video/mp4'
  } as unknown as Blob);

  const response = await unwrap(
    getApiClient().post<ApiEnvelope<SetlogUploadResponse>>('/api/v1/setlogs', formData, {
      params: {
        tripId: Number(tripId),
        tripMissionId: Number(tripMissionId),
        memberId: Number(memberId)
      },
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  );

  return {
    id: String(response.setlogId),
    tripId,
    tripMissionId,
    memberId,
    memberNickname: '',
    fileUrl: response.fileUrl,
    slotNo: response.slotNo,
    createdAt: response.createdAt
  };
};
