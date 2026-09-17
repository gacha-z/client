import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  completeMission,
  failMission,
  isApiError,
  missionCandidatesQueryKey,
  missionCandidatesQueryOptions,
  missionSetlogsQueryOptions,
  rerollMissionCandidate,
  selectMissionCandidate
} from '@travel-gacha/api';
import {
  activeMissionAtom,
  activeMissionTripIdAtom,
  missionOutcomesAtom,
  missionStageAtom,
  setActiveMissionAtom
} from '@travel-gacha/store';
import type { MissionStage } from '@travel-gacha/types';

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
  const rawActiveMission = useAtomValue(activeMissionAtom);
  const activeMissionTripId = useAtomValue(activeMissionTripIdAtom);
  const setActiveMission = useSetAtom(setActiveMissionAtom);
  const setStage = useSetAtom(missionStageAtom);
  const [outcomes, setOutcomes] = useAtom(missionOutcomesAtom);

  // 다른 여행에서 선택했던 미션이 캐시로 남아있으면(완료/실패 처리 없이 여행이 바뀐 경우) 즉시 무시하고,
  // 실제 저장소에서도 지운다. useEffect만으로는 지워지기 전 한 프레임 동안 잘못된 stage가 보일 수 있어
  // 아래 계산에는 effectiveActiveMission을 쓴다.
  const isActiveMissionForThisTrip = !activeMissionTripId || activeMissionTripId === tripId;
  const activeMission = isActiveMissionForThisTrip ? rawActiveMission : null;

  useEffect(() => {
    if (activeMissionTripId && activeMissionTripId !== tripId) {
      setActiveMission(null);
    }
  }, [activeMissionTripId, tripId, setActiveMission]);

  const candidatesQuery = useQuery({
    ...missionCandidatesQueryOptions(tripId, memberId ? Number(memberId) : undefined),
    enabled: Boolean(tripId) && Boolean(memberId)
  });

  const setlogsQuery = useQuery({
    ...missionSetlogsQueryOptions(
      activeMission?.tripMissionId ?? '',
      memberId ? Number(memberId) : undefined
    ),
    enabled: Boolean(activeMission) && Boolean(memberId)
  });

  const round = candidatesQuery.data;
  const activeCandidates = round?.candidates.filter((candidate) => !candidate.isRerolled) ?? [];
  const completedCount = round ? round.assignedOrder - 1 : 0;
  const totalCount = round?.targetRoundCount ?? 0;
  const limitReached = Boolean(round) && !activeMission && completedCount >= totalCount;

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
    onSuccess: (result) => {
      setActiveMission({ tripId, mission: result });
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
      setActiveMission(null);
      queryClient.invalidateQueries({ queryKey: missionCandidatesQueryKey(tripId) });
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
      setActiveMission(null);
      queryClient.invalidateQueries({ queryKey: missionCandidatesQueryKey(tripId) });
    },
    onError: alertMutationError
  });

  return {
    stage,
    dayNo: round?.dayNo ?? 1,
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
