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
