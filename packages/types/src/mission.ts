export type TripMember = {
  id: string;
  name: string;
  avatarUri?: string;
  role: 'OWNER' | 'MEMBER';
  /** 오늘의 미션 선택자로 표시할 멤버인지 여부 (클라이언트 전용 — 백엔드는 이 개념을 모델링하지 않는다) */
  isMissionPicker?: boolean;
};

export type MissionCandidate = {
  id: string;
  missionId: string;
  missionType: string;
  title: string;
  description: string;
  difficulty: number;
  isSelected: boolean;
  isRerolled: boolean;
};

export type MissionRound = {
  dayNo: number;
  assignedOrder: number;
  targetRoundCount: number;
  candidates: MissionCandidate[];
};

export type MissionSelectResult = {
  tripMissionId: string;
  missionId: string;
  missionType: string;
  title: string;
  description: string;
  difficulty: number;
  startedAt: string;
};

export type SetlogEntry = {
  id: string;
  tripId: string;
  tripMissionId: string;
  memberId: string;
  memberNickname: string;
  fileUrl: string;
  slotNo: number;
  createdAt: string;
};

export type MemberVerificationStatus = 'unverified' | 'verified';

export type MissionOutcome = 'success' | 'failure';

export type MissionStage = 'idle' | 'selecting' | 'pending';
