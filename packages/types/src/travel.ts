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
  name: string;
  description: string;
  imageUrl: string;
};

export type TripStatus = 'CREATED' | 'CANCELLED' | 'COMPLETED';

export type TripDetail = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
};
