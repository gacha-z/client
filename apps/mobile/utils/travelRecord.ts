import type { CollectionItemRecord, TravelMember, TravelPeriod } from '@/types';

export function formatTravelPeriod(period: TravelPeriod): string {
  return `${period.startDate} ~ ${period.endDate}(${period.nights}박 ${period.days}일)`;
}

export function formatTravelMembers(members: TravelMember[]): string {
  return members.map((member) => member.name).join(', ');
}

export function formatCollectionItems(items: CollectionItemRecord[]): string {
  return items.map((item) => `${item.name} ${item.count}개`).join(', ');
}
