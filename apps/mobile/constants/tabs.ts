export type TabName = 'index' | 'travel' | 'mission-select' | 'collection' | 'mission-log';

export type TabItem = {
  name: TabName;
  label: string;
  title: string;
  isCenter?: boolean;
};

export const TABS: TabItem[] = [
  { name: 'index', label: '홈', title: '홈' },
  { name: 'travel', label: '여행 목록', title: '여행 목록' },
  { name: 'mission-select', label: '', title: '증강', isCenter: true },
  { name: 'collection', label: '도감 목록', title: '도감 목록' },
  { name: 'mission-log', label: '미션 로그', title: '미션 로그' }
];

/** 홈은 내부 Stack을 가지며, 나머지 탭은 `<name>/index` 화면을 직접 사용한다. */
export const tabRouteSegment = (name: TabName): string =>
  name === 'index' ? 'index' : `${name}/index`;

export const getTabByRouteName = (routeName: string): TabItem | undefined =>
  TABS.find((tab) => routeName === tab.name || routeName === tabRouteSegment(tab.name));
