import { atom } from 'jotai';

import type {
  MemberVerificationStatus,
  MissionCandidate,
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

/** 오늘의 미션 진행 단계 */
export const missionStageAtom = atom<MissionStage>('idle');

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
  const nextSource =
    MISSION_POOL.find((source) => !usedPlaceNames.includes(source.placeName)) ?? MISSION_POOL[0];

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

/** ⑨ "미션 포기하기" — 타이머 없이 즉시 새 미션으로 교체 */
export const giveUpMissionAtom = atom(null, (get, set) => {
  const current = get(selectedMissionAtom);
  const nextSource =
    MISSION_POOL.find((source) => source.placeName !== current?.placeName) ?? MISSION_POOL[0];

  set(selectedMissionAtom, createCandidate(nextSource));
  set(memberVerificationsAtom, initialVerifications());
});

/** ⑩ "미션 완료" 확인 → ① idle 상태로 복귀 */
export const clearMissionAtom = atom(null, (_get, set) => {
  set(missionStageAtom, 'idle');
  set(selectedMissionAtom, null);
  set(memberVerificationsAtom, {});
  set(missionCandidatesAtom, createInitialCandidates());
});
