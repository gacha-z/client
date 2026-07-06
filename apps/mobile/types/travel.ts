export type TripStatus = 'scheduled' | 'active' | 'completed';

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

export type TravelListItem = {
  id: string;
  title: string;
  status: TripStatus;
  period: TravelPeriod;
  location: string;
  members: TravelMember[];
  items: CollectionItemRecord[];
};

export type TravelViewMode = 'list' | 'calendar';

export type CollectionItemRecord = {
  name: string;
  count: number;
};

export type MissionRecord = {
  id: string;
  title: string;
  place: string;
  successTime: string;
  photoUrl: string;
  collectedItems: CollectionItemRecord[];
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
  days: TravelRecordDay[];
};
