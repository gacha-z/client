import { atom } from 'jotai';

import type {
  MemberVerificationStatus,
  MissionCandidate,
  MissionOutcome,
  MissionStage,
  TripMember
} from '@travel-gacha/types';

export const MOCK_MEMBERS: TripMember[] = [
  { id: 'member-1', name: '이정선', isMissionPicker: true },
  { id: 'member-2', name: '이정선' },
  { id: 'member-3', name: '이정선' },
  { id: 'member-4', name: '이정선' }
];

export const MOCK_TRIP = {
  name: '봄날의 랜덤 여행',
  day: 1
};

export const MOCK_TODAY_PROGRESS = { completed: 4, total: 5 };

type MissionSource = Omit<MissionCandidate, 'id' | 'canRetry'>;

/** 불변식: 풀 크기는 항상 동시 표시 후보 수보다 커야 함 — 그렇지 않으면 retryCandidateAtom의 중복 방지 로직이 조용히 실패함 */
const MISSION_POOL: MissionSource[] = [
  {
    placeName: '경포해변',
    description: '미션 내용이 들어갑니다. 미션 내용이 들어갑니다.',
    address: '강원도 강릉시 강문동 산1-1',
    reward: '🌊 파도 조각 x 1'
  },
  {
    placeName: '안목해변 카페거리',
    description: '미션 내용이 들어갑니다. 미션 내용이 들어갑니다.',
    address: '강원도 강릉시 창해로 14',
    reward: '☕ 아메리카노 x 1'
  },
  {
    placeName: '강릉 중앙시장',
    description: '미션 내용이 들어갑니다. 미션 내용이 들어갑니다.',
    address: '강원도 강릉시 중앙시장길 30',
    reward: '🍢 먹거리 x 1'
  },
  {
    placeName: '오죽헌',
    description: '미션 내용이 들어갑니다. 미션 내용이 들어갑니다.',
    address: '강원도 강릉시 율곡로 3139번길 24',
    reward: '🖋️ 붓 조각 x 1'
  }
];

let missionIdCounter = 0;
const nextMissionId = () => `mission-${(missionIdCounter += 1)}`;

const createCandidate = (source: MissionSource): MissionCandidate => ({
  ...source,
  id: nextMissionId(),
  canRetry: true
});

const createInitialCandidates = (): MissionCandidate[] =>
  MISSION_POOL.slice(0, 3).map(createCandidate);

const initialVerifications = (): Record<string, MemberVerificationStatus> =>
  Object.fromEntries(MOCK_MEMBERS.map((member) => [member.id, 'unverified']));

/**
 * 오늘의 미션 진행 단계
 * 한계: 'selecting' 진입 후 선택 없이 이탈(탭 전환 등)해도 'idle'로 되돌리는 전환이 없음.
 * 탭 화면이 마운트 상태를 유지하므로 재진입 시 이탈 시점 그대로("selecting")가 다시 보임 —
 * 현재 설계상 의도된 동작(진행 중이던 선택을 보존)이지만 명시적인 취소 동선은 없음.
 * 추후 'selecting' 상태를 직접 참조/분기하는 기능 추가 시 이 점을 재검토 필요.
 */
export const missionStageAtom = atom<MissionStage>('idle');

/** 오늘 시도한 미션들의 결과를 시간순으로 기록 — 상단 진행도 바를 성공(파랑)/실패(빨강) 순서로 채우는 데 쓰인다 */
export const missionOutcomesAtom = atom<MissionOutcome[]>([]);

/** ③⑦ 캐러셀에 표시되는 미션 후보 3개 */
export const missionCandidatesAtom = atom<MissionCandidate[]>(createInitialCandidates());

/** ⑨⑩에서 진행 중인 선택된 미션 */
export const selectedMissionAtom = atom<MissionCandidate | null>(null);

/** 멤버별 미션로그 인증 상태 */
export const memberVerificationsAtom = atom<Record<string, MemberVerificationStatus>>({});

/** 전원 인증 완료 여부 (⑩ 클리어 모달 트리거) */
export const allMembersVerifiedAtom = atom((get) => {
  const verifications = get(memberVerificationsAtom);
  return MOCK_MEMBERS.every((member) => verifications[member.id] === 'verified');
});

/** ① "미션 시작하기" → ③⑦ 캐러셀 화면으로 진입 */
export const startMissionSelectionAtom = atom(null, (_get, set) => {
  set(missionCandidatesAtom, createInitialCandidates());
  set(missionStageAtom, 'selecting');
});

/** ③⑦ 후보 카드의 "다시하기" — 후보 하나를 아직 쓰지 않은 다른 미션으로 교체 (후보당 1회) */
export const retryCandidateAtom = atom(null, (get, set, candidateId: string) => {
  const candidates = get(missionCandidatesAtom);
  const target = candidates.find((candidate) => candidate.id === candidateId);
  if (!target || !target.canRetry) return;

  const usedPlaceNames = candidates.map((candidate) => candidate.placeName);
  const unusedSource = MISSION_POOL.find((source) => !usedPlaceNames.includes(source.placeName));
  if (!unusedSource) {
    console.warn(
      'retryCandidateAtom: MISSION_POOL에 미사용 후보가 없어 중복 미션이 표시될 수 있습니다.'
    );
  }
  const nextSource = unusedSource ?? MISSION_POOL[0];

  set(
    missionCandidatesAtom,
    candidates.map((candidate) =>
      candidate.id === candidateId ? { ...createCandidate(nextSource), canRetry: false } : candidate
    )
  );
});

/** ③⑦ "미션 선택하기" → ⑨ 인증 대기 상태로 전환 */
export const selectMissionAtom = atom(null, (get, set, candidateId: string) => {
  const candidate = get(missionCandidatesAtom).find((item) => item.id === candidateId);
  if (!candidate) return;

  set(selectedMissionAtom, candidate);
  set(memberVerificationsAtom, initialVerifications());
  set(missionStageAtom, 'pending');
});

/** ⑫ 촬영 셔터 스텁 — 실제 카메라 없이 바로 해당 멤버를 인증 처리 */
export const verifyMemberAtom = atom(null, (get, set, memberId: string) => {
  set(memberVerificationsAtom, { ...get(memberVerificationsAtom), [memberId]: 'verified' });
});

/** ⑨ "미션 포기하기" — 진행 중이던 미션을 접고 처음부터 다시 후보를 고르도록 selecting 상태로 되돌린다 */
export const giveUpMissionAtom = atom(null, (_get, set) => {
  set(missionOutcomesAtom, (outcomes) => [...outcomes, 'failure']);
  set(missionCandidatesAtom, createInitialCandidates());
  set(selectedMissionAtom, null);
  set(memberVerificationsAtom, {});
  set(missionStageAtom, 'selecting');
});

/** ⑩ "미션 완료" 확인 → ① idle 상태로 복귀 */
export const clearMissionAtom = atom(null, (_get, set) => {
  set(missionOutcomesAtom, (outcomes) => [...outcomes, 'success']);
  set(missionStageAtom, 'idle');
  set(selectedMissionAtom, null);
  set(memberVerificationsAtom, {});
  set(missionCandidatesAtom, createInitialCandidates());
});
