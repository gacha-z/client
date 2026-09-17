import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage, unwrap } from 'jotai/utils';

import type { MissionOutcome, MissionSelectResult, MissionStage } from '@travel-gacha/types';

const missionStorage = createJSONStorage<MissionSelectResult | null>(() => AsyncStorage);
const missionTripIdStorage = createJSONStorage<string | null>(() => AsyncStorage);

/**
 * 오늘의 미션 진행 단계 — API 연동 후에는 useTodayMission 훅이 서버 응답을 기반으로
 * 이 값을 동기화한다. 이 atom 자체는 더 이상 전환 로직을 갖지 않고, NavigationBar의
 * missionPendingAtom이 계속 참조할 수 있도록 값만 유지한다.
 */
export const missionStageAtom = atom<MissionStage>('idle');

/**
 * 오늘 시도한 미션들의 결과 — 진행바 세그먼트의 성공(파랑)/실패(빨강) 색상에 쓰인다.
 * 한계: 백엔드에 "오늘의 미션 시도 이력" 조회 API가 없어 세션 로컬로만 유지되며,
 * 앱을 재시작하면 초기화된다. 완료/실패 "건수" 자체는 서버의 assignedOrder로 복구된다.
 */
export const missionOutcomesAtom = atom<MissionOutcome[]>([]);

/**
 * 오늘 선택되어 진행 중인 미션 — select API 응답을 그대로 캐시한다.
 * 한계: 백엔드에 "현재 진행 중인 미션" 조회 API가 없어, 이 값의 유일한 출처는 select
 * 응답뿐이다. 앱 재시작 시에도 유지되도록 AsyncStorage에 영속화한다.
 * unwrap으로 감싸 AsyncStorage 조회가 끝나기 전까지는 null을 반환하게 해,
 * 기존 소비처(Suspense 미사용)가 동기 값으로 계속 읽을 수 있도록 한다.
 */
const persistedActiveMissionAtom = atomWithStorage<MissionSelectResult | null>(
  'activeMission',
  null,
  missionStorage
);
export const activeMissionAtom = unwrap(persistedActiveMissionAtom, (prev) => prev ?? null);

/**
 * activeMissionAtom이 어느 여행(tripId)에서 선택된 미션인지 함께 기록한다.
 * MissionSelectResult 자체는 tripId를 포함하지 않아(백엔드 응답 그대로 캐시) 별도 보관이 필요하다.
 * 이 값과 현재 진행중인 tripId가 다르면 다른 여행에서 남은 캐시이므로 지워야 한다
 * (useTodayMission의 정리 로직 참고).
 */
const persistedActiveMissionTripIdAtom = atomWithStorage<string | null>(
  'activeMissionTripId',
  null,
  missionTripIdStorage
);
export const activeMissionTripIdAtom = unwrap(
  persistedActiveMissionTripIdAtom,
  (prev) => prev ?? null
);

/** activeMission과 그 소속 tripId를 항상 함께 쓰기 위한 전용 쓰기 atom. null이면 둘 다 지운다. */
export const setActiveMissionAtom = atom(
  null,
  (_get, set, payload: { tripId: string; mission: MissionSelectResult } | null) => {
    set(persistedActiveMissionAtom, payload?.mission ?? null);
    set(persistedActiveMissionTripIdAtom, payload?.tripId ?? null);
  }
);
