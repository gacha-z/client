import type { RegionCandidate, RegionCandidateSlot } from '@/types';
import { findUnusedRegionCandidate } from '@/utils/regionCandidates';

export const REGION_CANDIDATE_MOCK: RegionCandidate[] = [
  {
    id: 'hwacheon',
    name: '강원도 화천군',
    description: '물길 산책과 지역 축제를 함께 즐기기 좋은 랜덤 여행 코스예요.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=520&fit=crop'
  },
  {
    id: 'taean',
    name: '충청남도 태안군',
    description: '해안 드라이브와 조용한 바닷마을 풍경을 한 번에 담을 수 있어요.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=520&fit=crop'
  },
  {
    id: 'damyang',
    name: '전라남도 담양군',
    description: '대나무 숲길과 한적한 골목을 따라 걷기 좋은 감성 여행지예요.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=520&fit=crop'
  }
];

/** 후보 카드별 1회 리롤 응답 mock. 실제 API 연결 시 응답 데이터로 교체한다. */
export const REGION_CANDIDATE_REROLL_MOCK: RegionCandidate[] = [
  {
    id: 'sokcho',
    name: '강원도 속초시',
    description: '바다와 시장 먹거리를 함께 즐길 수 있는 활기찬 여행지예요.',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&h=520&fit=crop'
  },
  {
    id: 'gyeongju',
    name: '경상북도 경주시',
    description: '고즈넉한 유적과 야경을 따라 천천히 걷기 좋은 도시예요.',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7c897d834c7d?w=400&h=520&fit=crop'
  },
  {
    id: 'suncheon',
    name: '전라남도 순천시',
    description: '넓은 정원과 생태 습지를 둘러보며 여유를 즐기기 좋은 곳이에요.',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=520&fit=crop'
  }
];

/** 실제 API 연결 전까지 비동기 리롤 응답의 경계를 대신한다. */
export const requestRegionCandidateRerollMock = async (slots: RegionCandidateSlot[]) => {
  const replacement = findUnusedRegionCandidate(slots, REGION_CANDIDATE_REROLL_MOCK);
  if (!replacement) throw new Error('No region candidate replacement available');

  return replacement;
};
