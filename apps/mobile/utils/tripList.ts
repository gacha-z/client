import type { TripSummary } from '@travel-gacha/types';
import type { TravelListItem, TravelPeriod } from '@/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatDate = (date: string) => date.replaceAll('-', '.');

const toPeriod = (startDate: string, endDate: string): TravelPeriod => {
  const startTime = Date.parse(`${startDate}T00:00:00Z`);
  const endTime = Date.parse(`${endDate}T00:00:00Z`);
  const nights = Math.max(0, Math.round((endTime - startTime) / MS_PER_DAY));

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    nights,
    days: nights + 1
  };
};

const toUiStatus = (trip: TripSummary): TravelListItem['status'] => {
  if (trip.status === 'CANCELLED') return 'cancelled';
  if (trip.status === 'COMPLETED') return 'completed';

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
  ].join('-');

  return trip.startDate > todayKey ? 'scheduled' : 'active';
};

export const toTravelListItem = (trip: TripSummary): TravelListItem => ({
  id: trip.id,
  title: trip.title,
  status: toUiStatus(trip),
  period: toPeriod(trip.startDate, trip.endDate),
  location: trip.tripRegionName ?? '지역 미정',
  members: [],
  items: [],
  joinedMemberCount: trip.joinedMemberCount,
  memberLimit: trip.memberLimit
});
