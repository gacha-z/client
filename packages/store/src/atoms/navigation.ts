import { atom } from 'jotai';

import { missionStageAtom } from './mission';

/**
 * 현재 활성 여행에서 미션 인증이 필요한 상태인지 여부.
 * - true  : 인증 대기 중 → 네비게이션 바 가운데 버튼이 카메라 아이콘으로 표시됨
 * - false : 인증 불필요(기본값) → 가운데 버튼이 가챠 카드 아이콘으로 표시됨
 *
 * missionStageAtom('pending')에서 파생되는 읽기 전용 atom.
 */
export const missionPendingAtom = atom((get) => get(missionStageAtom) === 'pending');
