import { useInfiniteQuery } from '@tanstack/react-query';

import { tripListInfiniteQueryOptions } from '@travel-gacha/api';
import { getDevMemberId } from '@/services/authSession';
import { toTravelListItem } from '@/utils';

/** 현재 "진행중"인 여행 하나를 찾는다 (여러 개면 첫 번째) — 하단 탭바 중앙 버튼처럼 tripId를 모르는 곳에서 사용 */
export function useActiveTrip() {
  const tripListQuery = useInfiniteQuery(
    tripListInfiniteQueryOptions({ memberId: getDevMemberId() })
  );
  const activeTrip = tripListQuery.data?.pages
    .flatMap((page) => page.trips)
    .map(toTravelListItem)
    .find((trip) => trip.status === 'active');

  return { tripId: activeTrip?.id, isPending: tripListQuery.isPending };
}
