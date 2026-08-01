export type TripMember = {
  id: string;
  name: string;
  avatarUri?: string;
  /** 오늘의 미션 선택자로 랜덤 지정된 멤버인지 여부 (파티 여행 기능) */
  isMissionPicker?: boolean;
};

export type MissionCandidate = {
  id: string;
  placeName: string;
  description: string;
  address: string;
  reward: string;
  imageUri?: string;
  /** 이 후보에 대해 "다시하기"를 아직 사용하지 않았는지 여부 */
  canRetry: boolean;
};

export type MemberVerificationStatus = 'unverified' | 'verified';

export type MissionOutcome = 'success' | 'failure';

/** 'cleared'는 별도 단계로 두지 않는다 — 클리어 모달 확인 즉시 idle로 복귀 (설계 결정 4) */
export type MissionStage = 'idle' | 'selecting' | 'pending';
