import { atom } from 'jotai';

import type { MissionOutcome, MissionSelectResult, MissionStage } from '@travel-gacha/types';

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
 * 응답뿐이다. 앱을 재시작하면 이 값을 잃고 selecting 단계로 되돌아간다 (알려진 제약).
 */
export const activeMissionAtom = atom<MissionSelectResult | null>(null);
