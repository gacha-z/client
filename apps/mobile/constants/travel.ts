import type { TravelListItem, TravelRecord, TravelViewMode } from '@/types';

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

export const TRAVEL_RECORD_MOCK: TravelRecord = {
  id: 'gangneung-2025',
  title: '강릉 바다 여행',
  period: {
    startDate: '2025.09.21',
    endDate: '2025.09.23',
    nights: 2,
    days: 3
  },
  members: [
    { id: 'donghyun', name: '김동현' },
    { id: 'daeun', name: '김다은' },
    { id: 'jeongseon', name: '이정선' },
    { id: 'sangmin', name: '한상민' }
  ],
  days: [
    {
      id: 'day-1',
      dayNumber: 1,
      date: '2025.09.21',
      missions: [
        {
          id: 'beach-photo',
          title: '“파도 위 첫 장면 찍기”\n경포해변',
          place: '강원도 강릉시 강문동 산1-1',
          successTime: '12:23',
          photoUrl:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=320&fit=crop',
          collectedItems: [
            { name: '파도 조각', count: 1 },
            { name: '바다 유리', count: 2 }
          ]
        },
        {
          id: 'cafe-note',
          title: '“감성 카페 한 컷 남기기”\n안목해변 카페거리',
          place: '강원도 강릉시 강문동 산1-1',
          successTime: '14:13',
          photoUrl:
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=320&fit=crop',
          collectedItems: [{ name: '아메리카노', count: 1 }]
        },
        {
          id: 'market-food',
          title: '“시장 먹방 인증하기”\n강릉 중앙시장',
          place: '강원도 강릉시 강문동 산1-1',
          successTime: '16:54',
          photoUrl:
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=320&fit=crop',
          collectedItems: [
            { name: '먹거리', count: 1 },
            { name: '닭강정', count: 1 }
          ]
        }
      ],
      diaries: [
        {
          memberId: 'donghyun',
          memberName: '김동현',
          content:
            '첫날이라 이동이 조금 길었지만 경포해변에 도착하자마자 여행이 시작된 느낌이 확 났다.'
        },
        {
          memberId: 'daeun',
          memberName: '김다은',
          content: '바다를 보면서 마신 커피가 가장 기억에 남는다. 사진도 생각보다 잘 나왔다.'
        },
        {
          memberId: 'jeongseon',
          memberName: '이정선',
          content: '중앙시장에서 먹은 간식들이 좋았다. 다음에는 저녁 시간에 다시 와보고 싶다.'
        },
        {
          memberId: 'sangmin',
          memberName: '한상민',
          content: '미션을 따라 움직이니 동선이 자연스럽게 잡혀서 편했다.'
        }
      ]
    },
    {
      id: 'day-2',
      dayNumber: 2,
      date: '2025.09.22',
      missions: [
        {
          id: 'sunrise-walk',
          title: '“아침 바다 산책하기”\n강문해변',
          place: '강원도 강릉시 강문동',
          successTime: '08:10',
          photoUrl:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=320&fit=crop',
          collectedItems: [{ name: '아침 햇살', count: 1 }]
        },
        {
          id: 'museum-visit',
          title: '“지역 전시 둘러보기”\n오죽헌',
          place: '강원도 강릉시 율곡로3139번길 24',
          successTime: '11:42',
          photoUrl:
            'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=400&h=320&fit=crop',
          collectedItems: [
            { name: '기념 엽서', count: 1 },
            { name: '역사 배지', count: 1 }
          ]
        },
        {
          id: 'dinner-shot',
          title: '“저녁 메뉴 인증하기”\n초당순두부마을',
          place: '강원도 강릉시 초당동',
          successTime: '18:28',
          photoUrl:
            'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=320&fit=crop',
          collectedItems: [{ name: '순두부 배지', count: 2 }]
        }
      ],
      diaries: [
        {
          memberId: 'donghyun',
          memberName: '김동현',
          content: '아침 산책이 생각보다 좋았다. 조용한 시간에 바다를 보니 어제와 다른 느낌이었다.'
        },
        {
          memberId: 'daeun',
          memberName: '김다은',
          content: '오죽헌에서 천천히 둘러본 시간이 좋았다. 여행 중간에 잠깐 쉬어가는 느낌이었다.'
        },
        {
          memberId: 'jeongseon',
          memberName: '이정선',
          content: '초당순두부는 기대했던 것보다 더 맛있었다. 오늘의 베스트였다.'
        },
        {
          memberId: 'sangmin',
          memberName: '한상민',
          content: '둘째 날은 미션 간격이 적당해서 여유 있게 다닐 수 있었다.'
        }
      ]
    },
    {
      id: 'day-3',
      dayNumber: 3,
      date: '2025.09.23',
      missions: [
        {
          id: 'souvenir-buy',
          title: '“여행 기념품 고르기”\n강릉역 기념품샵',
          place: '강원도 강릉시 용지로 176',
          successTime: '10:05',
          photoUrl:
            'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=320&fit=crop',
          collectedItems: [
            { name: '기념 마그넷', count: 1 },
            { name: '강릉 스티커', count: 3 }
          ]
        },
        {
          id: 'last-photo',
          title: '“마지막 단체 사진 찍기”\n강릉역',
          place: '강원도 강릉시 용지로 176',
          successTime: '11:20',
          photoUrl:
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=320&fit=crop',
          collectedItems: [{ name: '단체 사진', count: 1 }]
        }
      ],
      diaries: [
        {
          memberId: 'donghyun',
          memberName: '김동현',
          content: '짧았지만 알차게 다닌 여행이었다. 마지막 단체 사진이 마음에 든다.'
        },
        {
          memberId: 'daeun',
          memberName: '김다은',
          content: '기념품을 고르면서 여행이 끝난다는 게 실감났다. 다음 여행도 기대된다.'
        },
        {
          memberId: 'jeongseon',
          memberName: '이정선',
          content: '강릉역에서 찍은 마지막 사진이 제일 여행답게 남았다.'
        },
        {
          memberId: 'sangmin',
          memberName: '한상민',
          content: '다음에는 더 길게 와도 좋을 것 같다. 이동도 편하고 코스도 만족스러웠다.'
        }
      ]
    }
  ]
};
