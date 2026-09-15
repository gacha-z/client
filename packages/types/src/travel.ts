export type TravelCreateRequest = {
  title: string;
  startDate: string;
  endDate: string;
  minimumMissionCount: number;
  maximumMissionCount: number;
  firstMissionHour: number;
  firstMissionMinute: number;
  memberCount: number;
};

export type RegionCandidate = {
  id: string;
  candidateId?: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type TripStatus = 'CREATED' | 'CANCELLED' | 'COMPLETED';

export type TripUpdateRequest = {
  title?: string;
  startDate?: string;
  endDate?: string;
  memberLimit?: number;
  missionMin?: number;
  missionMax?: number;
  missionStartHour?: number;
  missionStartMinute?: number;
};

export type TripDetail = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  memberLimit: number;
  joinedMemberCount: number;
  missionMin: number;
  missionMax: number;
  missionStartAt: string;
  ownerMemberId: string;
  tripRegionId?: string;
  tripRegionName?: string;
  tripRegionImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
};

export type TripSummary = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  memberLimit: number;
  joinedMemberCount: number;
  tripRegionId?: string;
  tripRegionName?: string;
  createdAt: string;
};

export type TripListPage = {
  trips: TripSummary[];
  nextCursor: number | null;
  hasNext: boolean;
};
