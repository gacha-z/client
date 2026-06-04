export type TabName = 'index' | 'travel' | 'select' | 'collection' | 'mission-log';

export type TabItem = {
  name: TabName;
  label: string;
  title: string;
};

export const TABS: TabItem[] = [
  { name: 'index', label: '홈', title: '홈' },
  { name: 'travel', label: '여행 목록', title: '여행 목록' },
  { name: 'select', label: '증강', title: '증강' },
  { name: 'collection', label: '도감 목록', title: '도감 목록' },
  { name: 'mission-log', label: '미션 로그', title: '미션 로그' }
];

/** expo-router: (tabs)/<name>/index.tsx → 화면 이름 `<name>/index` */
export const tabRouteSegment = (name: TabName): string => `${name}/index`;

export const getTabByRouteName = (routeName: string): TabItem | undefined =>
  TABS.find((tab) => routeName === tab.name || routeName === tabRouteSegment(tab.name));
