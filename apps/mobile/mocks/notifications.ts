import type { AppNotification } from '@/types/notification';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

export const NOTIFICATION_MOCK: AppNotification[] = [
  {
    id: 'mission-picker-1',
    type: 'MISSION_PICKER_SELECTED',
    title: '다음 미션 선택자로 선정되었어요!',
    body: '미션 선택창에서 마음에 드는 미션을 하나 선택해주세요!!',
    targetType: 'MISSION',
    targetId: '101',
    read: false,
    createdAt: minutesAgo(10)
  },
  {
    id: 'diary-created-1',
    type: 'DIARY_CREATED',
    title: '제주 여행에 새 일기가 등록됐어요',
    body: '여행러버님이 함께한 여행의 새로운 일기를 남겼어요.',
    targetType: 'DIARY',
    targetId: '31',
    read: true,
    createdAt: minutesAgo(80)
  },
  {
    id: 'trip-reminder-1',
    type: 'TRIP_REMINDER',
    title: '여행 출발일이 얼마 남지 않았어요!',
    body: '부산 바다 여행 일정을 확인하고 떠날 준비를 해주세요.',
    targetType: 'TRIP',
    targetId: '12',
    read: false,
    createdAt: minutesAgo(26 * 60)
  }
];
