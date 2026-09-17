import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAtom, useSetAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  completeMission,
  failMission,
  isApiError,
  missionCandidatesQueryKey,
  missionCandidatesQueryOptions,
  missionHistoryQueryKey,
  missionSetlogsQueryOptions,
  rerollMissionCandidate,
  selectMissionCandidate
} from '@travel-gacha/api';
import { missionOutcomesAtom, missionStageAtom } from '@travel-gacha/store';
import type { MissionStage } from '@travel-gacha/types';

import { useActiveMission } from './useActiveMission';

/** 뮤테이션 실패는 Alert로만 알린다 — 쿼리 로딩/에러 상태만 화면에 인라인으로 표시한다 */
const alertMutationError = (error: unknown) => {
  Alert.alert('오류', isApiError(error) ? error.message : '요청 처리에 실패했어요.');
};

type UseTodayMissionOptions = {
  tripId: string;
  memberId: string | null;
  totalMemberCount: number;
};

/** mission-select/mission-log-capture가 공유하는 "오늘의 미션" 상태와 액션 */
export function useTodayMission({ tripId, memberId, totalMemberCount }: UseTodayMissionOptions) {
  const queryClient = useQueryClient();
  const setStage = useSetAtom(missionStageAtom);
  const [outcomes, setOutcomes] = useAtom(missionOutcomesAtom);

  const numericMemberId = memberId ? Number(memberId) : undefined;

  const candidatesQuery = useQuery({
    ...missionCandidatesQueryOptions(tripId, numericMemberId),
    enabled: Boolean(tripId) && Boolean(memberId)
  });

  // "지금 진행 중인 미션"은 이력(/missions/history)의 오늘자 IN_PROGRESS 항목이 유일한 출처다.
  const { activeMission, todayHistory } = useActiveMission({ tripId, memberId: numericMemberId });

  // candidates API는 오늘 목표 라운드를 모두 완료/실패 처리했을 때만 409를 던진다 — 이때는
  // 이력의 오늘자 라운드 수로 진행도를 채운다.
  const isDailyQuotaCompleted =
    !activeMission &&
    candidatesQuery.isError &&
    isApiError(candidatesQuery.error) &&
    candidatesQuery.error.status === 409;

  const setlogsQuery = useQuery({
    ...missionSetlogsQueryOptions(activeMission?.tripMissionId ?? '', numericMemberId),
    enabled: Boolean(activeMission) && Boolean(memberId)
  });

  const round = candidatesQuery.data;
  const activeCandidates = round?.candidates.filter((candidate) => !candidate.isRerolled) ?? [];
  const completedCount = round ? round.assignedOrder - 1 : (todayHistory?.missions.length ?? 0);
  const totalCount = round?.targetRoundCount ?? todayHistory?.missions.length ?? 0;
  const limitReached =
    isDailyQuotaCompleted || (Boolean(round) && !activeMission && completedCount >= totalCount);

  const stage: MissionStage = activeMission
    ? 'pending'
    : round && !limitReached
      ? 'selecting'
      : 'idle';

  const verifiedMemberIds = [...new Set((setlogsQuery.data ?? []).map((entry) => entry.memberId))];
  const allVerified = totalMemberCount > 0 && verifiedMemberIds.length >= totalMemberCount;

  useEffect(() => {
    setStage(stage);
  }, [stage, setStage]);

  const selectMutation = useMutation({
    mutationFn: (candidateId: string) => {
      if (!memberId) throw new Error('회원 정보를 불러오는 중이에요.');
      return selectMissionCandidate({ tripId, missionCandidateId: candidateId, memberId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionHistoryQueryKey(tripId) });
    },
    onError: alertMutationError
  });

  const rerollMutation = useMutation({
    mutationFn: (candidateId: string) => {
      if (!memberId) throw new Error('회원 정보를 불러오는 중이에요.');
      return rerollMissionCandidate({ tripId, missionCandidateId: candidateId, memberId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionCandidatesQueryKey(tripId) });
    },
    onError: alertMutationError
  });

  const completeMutation = useMutation({
    mutationFn: (coords: { latitude: number; longitude: number }) => {
      if (!activeMission || !memberId) throw new Error('진행 중인 미션이 없어요.');
      return completeMission({
        tripId,
        tripMissionId: activeMission.tripMissionId,
        memberId,
        ...coords
      });
    },
    onSuccess: () => {
      setOutcomes((current) => [...current, 'success']);
      queryClient.invalidateQueries({ queryKey: missionCandidatesQueryKey(tripId) });
      queryClient.invalidateQueries({ queryKey: missionHistoryQueryKey(tripId) });
    },
    onError: alertMutationError
  });

  const failMutation = useMutation({
    mutationFn: () => {
      if (!activeMission || !memberId) throw new Error('진행 중인 미션이 없어요.');
      return failMission({ tripId, tripMissionId: activeMission.tripMissionId, memberId });
    },
    onSuccess: () => {
      setOutcomes((current) => [...current, 'failure']);
      queryClient.invalidateQueries({ queryKey: missionCandidatesQueryKey(tripId) });
      queryClient.invalidateQueries({ queryKey: missionHistoryQueryKey(tripId) });
    },
    onError: alertMutationError
  });

  return {
    stage,
    dayNo: round?.dayNo ?? todayHistory?.dayNo ?? 1,
    candidates: activeCandidates,
    selectedMission: activeMission,
    verifiedMemberIds,
    allVerified,
    completedCount,
    totalCount,
    limitReached,
    outcomes,
    select: selectMutation.mutate,
    reroll: rerollMutation.mutate,
    complete: completeMutation.mutate,
    fail: failMutation.mutate,
    isCompleting: completeMutation.isPending
  };
}
