export type Badge = {
  id: string;
  group: string;
  code: string;
  name: string;
  description: string;
  targetCount: number;
  currentCount: number;
  achieved: boolean;
  achievedAt?: string;
};

export type CollectionItemEntry = {
  id: string;
  regionGroupCode: string;
  regionGroupName: string;
  itemName: string;
  itemType: string;
  imageUrl: string;
  description: string;
  acquired: boolean;
  acquiredAt?: string;
};
