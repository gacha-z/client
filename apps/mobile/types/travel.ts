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
