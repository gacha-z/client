export type CollectionCategory =
  | 'REGION_ITEM'
  | 'TRAVEL_COUNT'
  | 'REGION_EXPLORATION'
  | 'REGION_ACHIEVEMENT'
  | 'MISSION_DIARY'
  | 'FOOD_CAFE';

export type CollectionIconName =
  | 'regionItem'
  | 'travel'
  | 'exploration'
  | 'regionBadge'
  | 'mission'
  | 'diary'
  | 'food'
  | 'cafe';

export type CollectionEntry = {
  id: string;
  category: CollectionCategory;
  title: string;
  requirement: string;
  icon: CollectionIconName;
};

export type CollectionFilterValue = 'ALL' | CollectionCategory;

export const COLLECTION_CATEGORY_LABELS: Record<CollectionCategory, string> = {
  REGION_ITEM: '지역 아이템',
  TRAVEL_COUNT: '여행 횟수',
  REGION_EXPLORATION: '지역 탐험',
  REGION_ACHIEVEMENT: '지역별 업적',
  MISSION_DIARY: '미션/일기',
  FOOD_CAFE: '음식/카페'
};

export const COLLECTION_FILTERS: ReadonlyArray<{
  label: string;
  value: CollectionFilterValue;
}> = [
  { label: '전체', value: 'ALL' },
  { label: COLLECTION_CATEGORY_LABELS.REGION_ITEM, value: 'REGION_ITEM' },
  { label: COLLECTION_CATEGORY_LABELS.TRAVEL_COUNT, value: 'TRAVEL_COUNT' },
  { label: COLLECTION_CATEGORY_LABELS.REGION_EXPLORATION, value: 'REGION_EXPLORATION' },
  { label: COLLECTION_CATEGORY_LABELS.REGION_ACHIEVEMENT, value: 'REGION_ACHIEVEMENT' },
  { label: COLLECTION_CATEGORY_LABELS.MISSION_DIARY, value: 'MISSION_DIARY' },
  { label: COLLECTION_CATEGORY_LABELS.FOOD_CAFE, value: 'FOOD_CAFE' }
];

const REGION_ITEMS: ReadonlyArray<CollectionEntry> = [
  ['gyeonggi', '경기도의 나침반', '경기도'],
  ['gangwon', '강원도의 산맥', '강원도'],
  ['chungbuk', '충청북도의 지도', '충청북도'],
  ['chungnam', '충청남도의 파도', '충청남도'],
  ['jeonbuk', '전라북도의 풍년', '전라북도'],
  ['jeonnam', '전라남도의 햇살', '전라남도'],
  ['gyeongbuk', '경상북도의 유산', '경상북도'],
  ['gyeongnam', '경상남도의 등대', '경상남도']
].map(([id, title, region]) => ({
  id: `region-item-${id}`,
  category: 'REGION_ITEM',
  title,
  requirement: `${region} 여행 완료`,
  icon: 'regionItem'
}));

const REGIONS = [
  ['seoul', '서울'],
  ['busan', '부산'],
  ['daegu', '대구'],
  ['incheon', '인천'],
  ['gwangju', '광주'],
  ['daejeon', '대전'],
  ['ulsan', '울산'],
  ['sejong', '세종'],
  ['gyeonggi', '경기'],
  ['gangwon', '강원'],
  ['chungbuk', '충북'],
  ['chungnam', '충남'],
  ['jeonbuk', '전북'],
  ['jeonnam', '전남'],
  ['gyeongbuk', '경북'],
  ['gyeongnam', '경남'],
  ['jeju', '제주']
] as const;

const REGION_ACHIEVEMENT_BADGES: ReadonlyArray<CollectionEntry> = REGIONS.map(([id, region]) => ({
  id: `region-badge-${id}`,
  category: 'REGION_ACHIEVEMENT',
  title: `${region} 탐험가`,
  requirement: `${region} 첫 여행 완료`,
  icon: 'regionBadge'
}));

export const COLLECTION_ENTRIES: ReadonlyArray<CollectionEntry> = [
  ...REGION_ITEMS,
  {
    id: 'travel-first',
    category: 'TRAVEL_COUNT',
    title: '첫 여행 완료',
    requirement: '여행 1회 완료',
    icon: 'travel'
  },
  {
    id: 'travel-five',
    category: 'TRAVEL_COUNT',
    title: '여행의 재미',
    requirement: '여행 5회 완료',
    icon: 'travel'
  },
  {
    id: 'travel-ten',
    category: 'TRAVEL_COUNT',
    title: '프로 여행자',
    requirement: '여행 10회 완료',
    icon: 'travel'
  },
  {
    id: 'exploration-three-regions',
    category: 'REGION_EXPLORATION',
    title: '새로운 곳으로',
    requirement: '서로 다른 지역 3곳 방문',
    icon: 'exploration'
  },
  {
    id: 'exploration-same-region-three',
    category: 'REGION_EXPLORATION',
    title: '단골 여행지',
    requirement: '동일 지역 3회 방문',
    icon: 'exploration'
  },
  ...REGION_ACHIEVEMENT_BADGES,
  {
    id: 'mission-first',
    category: 'MISSION_DIARY',
    title: '첫 미션 성공',
    requirement: '미션 최초 성공',
    icon: 'mission'
  },
  {
    id: 'mission-five',
    category: 'MISSION_DIARY',
    title: '미션 전문가',
    requirement: '미션 5회 성공',
    icon: 'mission'
  },
  {
    id: 'diary-first',
    category: 'MISSION_DIARY',
    title: '오늘을 기록하다',
    requirement: '일기 최초 작성',
    icon: 'diary'
  },
  {
    id: 'diary-ten',
    category: 'MISSION_DIARY',
    title: '여행 기록가',
    requirement: '일기 10회 작성',
    icon: 'diary'
  },
  {
    id: 'food-first',
    category: 'FOOD_CAFE',
    title: '금강산도 식후경',
    requirement: 'FOOD 활동 최초 완료',
    icon: 'food'
  },
  {
    id: 'food-ten',
    category: 'FOOD_CAFE',
    title: '여행 미식가',
    requirement: 'FOOD 활동 10회 완료',
    icon: 'food'
  },
  {
    id: 'cafe-first',
    category: 'FOOD_CAFE',
    title: '카페인 충전',
    requirement: 'CAFE 활동 최초 완료',
    icon: 'cafe'
  },
  {
    id: 'cafe-ten',
    category: 'FOOD_CAFE',
    title: '카페 탐험가',
    requirement: 'CAFE 활동 10회 완료',
    icon: 'cafe'
  }
];

/** API 연동 전 화면 확인용 획득 상태. 추후 사용자 도감 ID 목록으로 교체합니다. */
export const PREVIEW_UNLOCKED_COLLECTION_IDS: ReadonlySet<string> = new Set([
  'region-item-gyeonggi',
  'region-item-gangwon',
  'travel-first',
  'exploration-three-regions',
  'region-badge-seoul',
  'mission-first',
  'diary-first',
  'food-first',
  'cafe-first'
]);
