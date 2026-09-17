import { useQuery } from '@tanstack/react-query';

import { missionHistoryQueryOptions } from '@travel-gacha/api';
import type { MissionHistoryDay, MissionHistoryItem } from '@travel-gacha/types';

type UseActiveMissionOptions = {
  tripId: string;
  memberId?: number;
};

/**
 * 백엔드에 "현재 진행 중인 미션" 전용 조회 API가 없어, 미션 이력(/missions/history)의
 * 가장 최근 날짜(dayNo) 항목 중 status가 IN_PROGRESS인 것을 유일한 출처로 삼는다.
 * (이전에는 select 응답을 클라이언트 atom+AsyncStorage에 캐시했으나, 마운트 시 복원 읽기와
 * 방금 쓴 값이 경쟁하는 구조라 선택 직후 화면에 반영되지 않는 문제가 있었다.)
 */
export function useActiveMission({ tripId, memberId }: UseActiveMissionOptions) {
  const historyQuery = useQuery({
    ...missionHistoryQueryOptions({ tripId, memberId }),
    enabled: Boolean(tripId) && Boolean(memberId)
  });

  const todayHistory: MissionHistoryDay | undefined =
    historyQuery.data?.[historyQuery.data.length - 1];
  const activeMission: MissionHistoryItem | null =
    todayHistory?.missions.find((mission) => mission.status === 'IN_PROGRESS') ?? null;

  return { activeMission, todayHistory, historyQuery };
}
