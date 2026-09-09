import { queryOptions } from '@tanstack/react-query';

import type { MissionCandidate, MissionRound, MissionSelectResult } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type MissionCandidateResponse = {
  missionCandidateId: number;
  missionId: number;
  missionType: string;
  title: string;
  description: string;
  difficulty: number;
  selectedYn: 'Y' | 'N';
  rerolledYn: 'Y' | 'N';
};

type MissionCandidateListResponse = {
  dayNo: number;
  assignedOrder: number;
  targetRoundCount: number;
  candidates: MissionCandidateResponse[];
};

type MissionSelectResponse = {
  tripMissionId: number;
  missionId: number;
  missionType: string;
  title: string;
  description: string;
  difficulty: number;
  startedAt: string;
};

const toMissionCandidate = (response: MissionCandidateResponse): MissionCandidate => ({
  id: String(response.missionCandidateId),
  missionId: String(response.missionId),
  missionType: response.missionType,
  title: response.title,
  description: response.description,
  difficulty: response.difficulty,
  isSelected: response.selectedYn === 'Y',
  isRerolled: response.rerolledYn === 'Y'
});

const toMissionSelectResult = (response: MissionSelectResponse): MissionSelectResult => ({
  tripMissionId: String(response.tripMissionId),
  missionId: String(response.missionId),
  missionType: response.missionType,
  title: response.title,
  description: response.description,
  difficulty: response.difficulty,
  startedAt: response.startedAt
});

export const missionCandidatesQueryKey = (tripId: string) =>
  ['trips', tripId, 'missions', 'candidates'] as const;

export const missionCandidatesQueryOptions = (tripId: string) =>
  queryOptions({
    queryKey: missionCandidatesQueryKey(tripId),
    queryFn: async (): Promise<MissionRound> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<MissionCandidateListResponse>>(
          `/api/v1/trips/${tripId}/missions/candidates`
        )
      );
      return {
        dayNo: response.dayNo,
        assignedOrder: response.assignedOrder,
        targetRoundCount: response.targetRoundCount,
        candidates: response.candidates.map(toMissionCandidate)
      };
    },
    staleTime: 10 * 1000,
    retry: 1
  });

export type SelectMissionCandidateParams = {
  tripId: string;
  missionCandidateId: string;
};

export const selectMissionCandidate = async ({
  tripId,
  missionCandidateId
}: SelectMissionCandidateParams): Promise<MissionSelectResult> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<MissionSelectResponse>>(
      `/api/v1/trips/${tripId}/missions/${missionCandidateId}/select`
    )
  );
  return toMissionSelectResult(response);
};

export type RerollMissionCandidateParams = {
  tripId: string;
  missionCandidateId: string;
  memberId: string;
};

export const rerollMissionCandidate = async ({
  tripId,
  missionCandidateId,
  memberId
}: RerollMissionCandidateParams): Promise<MissionCandidate> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<MissionCandidateResponse>>(
      `/api/v1/trips/${tripId}/missions/${missionCandidateId}/reroll`,
      undefined,
      { params: { memberId: Number(memberId) } }
    )
  );
  return toMissionCandidate(response);
};

export type CompleteMissionParams = {
  tripId: string;
  tripMissionId: string;
  memberId: string;
  latitude: number;
  longitude: number;
};

export const completeMission = async ({
  tripId,
  tripMissionId,
  memberId,
  latitude,
  longitude
}: CompleteMissionParams): Promise<void> => {
  await unwrap(
    getApiClient().post<ApiEnvelope<unknown>>(
      `/api/v1/trips/${tripId}/missions/${tripMissionId}/complete`,
      { memberId: Number(memberId), latitude, longitude }
    )
  );
};

export type FailMissionParams = {
  tripId: string;
  tripMissionId: string;
};

export const failMission = async ({ tripId, tripMissionId }: FailMissionParams): Promise<void> => {
  await unwrap(
    getApiClient().post<ApiEnvelope<unknown>>(
      `/api/v1/trips/${tripId}/missions/${tripMissionId}/fail`
    )
  );
};
