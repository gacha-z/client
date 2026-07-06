import type { TravelListItem, TravelViewMode } from '@/types';

export const TRAVEL_VIEW_MODE_OPTIONS: {
  value: TravelViewMode;
  label: string;
  icon: 'list' | 'calendarView';
}[] = [
  { value: 'list', label: '목록형', icon: 'list' },
  { value: 'calendar', label: '달력형', icon: 'calendarView' }
];

export const TRAVEL_LIST_MOCK: TravelListItem[] = [
  {
    id: 'scheduled-gwangju',
    title: '광주 미식 투어',
    status: 'scheduled',
    period: {
      startDate: '2025.09.21',
      endDate: '2025.09.23',
      nights: 2,
      days: 3
    },
    location: '광주광역시',
    members: [
      { id: 'donghyun', name: '김동현' },
      { id: 'daeun', name: '김다은' },
      { id: 'jeongseon', name: '이정선' },
      { id: 'sangmin', name: '한상민' }
    ],
    items: [
      { name: '파도 조각', count: 1 },
      { name: '아메리카노', count: 1 },
      { name: '먹거리', count: 1 }
    ]
  },
  {
    id: 'active-gwangju',
    title: '강릉 바다 여행',
    status: 'active',
    period: {
      startDate: '2025.09.21',
      endDate: '2025.09.23',
      nights: 2,
      days: 3
    },
    location: '광주광역시',
    members: [
      { id: 'donghyun', name: '김동현' },
      { id: 'daeun', name: '김다은' },
      { id: 'jeongseon', name: '이정선' },
      { id: 'sangmin', name: '한상민' }
    ],
    items: [
      { name: '아침 햇살', count: 1 },
      { name: '기념 엽서', count: 1 },
      { name: '순두부 배지', count: 2 }
    ]
  },
  {
    id: 'completed-gwangju',
    title: '부산 주말 여행',
    status: 'completed',
    period: {
      startDate: '2025.09.21',
      endDate: '2025.09.23',
      nights: 2,
      days: 3
    },
    location: '광주광역시',
    members: [
      { id: 'donghyun', name: '김동현' },
      { id: 'daeun', name: '김다은' },
      { id: 'jeongseon', name: '이정선' },
      { id: 'sangmin', name: '한상민' }
    ],
    items: [
      { name: '기념 마그넷', count: 1 },
      { name: '강릉 스티커', count: 3 },
      { name: '단체 사진', count: 1 }
    ]
  }
];
