import type {
  MissionHistoryStatus,
  RegionCandidate as SharedRegionCandidate
} from '@travel-gacha/types';

export type TripStatus = 'scheduled' | 'active' | 'cancelled' | 'completed';

export type TravelPeriod = {
  startDate: string;
  endDate: string;
  nights: number;
  days: number;
};

export type TravelMember = {
  id: string;
  name: string;
};

export type RegionCandidate = SharedRegionCandidate;

export type RegionCandidateSlot = {
  id: string;
  region: RegionCandidate;
  rerollUsed: boolean;
};

export type TravelListItem = {
  id: string;
  title: string;
  status: TripStatus;
  period: TravelPeriod;
  location: string;
  members: TravelMember[];
  items: CollectionItemRecord[];
  joinedMemberCount?: number;
  memberLimit?: number;
};

export type TravelViewMode = 'list' | 'calendar';

export type CollectionItemRecord = {
  name: string;
  count: number;
};

export type MissionSetlogRecord = {
  id: string;
  memberNickname: string;
  fileUrl: string;
  slotNo: number;
};

export type MissionRecord = {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  status: MissionHistoryStatus;
  completedAt?: string;
  setlogs: MissionSetlogRecord[];
};

export type DiaryRecord = {
  memberId: string;
  memberName: string;
  content: string;
};

export type TravelRecordDay = {
  id: string;
  dayNumber: number;
  date: string;
  missions: MissionRecord[];
  diaries: DiaryRecord[];
};

export type TravelRecord = {
  id: string;
  title: string;
  period: TravelPeriod;
  members: TravelMember[];
  days: [TravelRecordDay, ...TravelRecordDay[]];
};
