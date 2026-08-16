import { TRAVEL_HOUR_OPTIONS } from '@/constants';

import { toDateKey } from './calendar';

export const formatTravelDate = (value: Date | null) =>
  value ? toDateKey(value).replaceAll('-', '.') : '-';

export const formatKoreanDateRange = (startDate: string, endDate: string) => {
  const [startYear, startMonth, startDay] = startDate.split('-');
  const [endYear, endMonth, endDay] = endDate.split('-');

  if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) return '-';

  const formattedStartDate = `${startYear}년 ${startMonth}월 ${startDay}일`;
  const formattedEndDate =
    startYear === endYear ? `${endMonth}월 ${endDay}일` : `${endYear}년 ${endMonth}월 ${endDay}일`;

  return `${formattedStartDate} ~ ${formattedEndDate}`;
};

export const formatMissionTime = (hour: number, minute: number) => {
  const hourLabel = TRAVEL_HOUR_OPTIONS.find(({ value }) => value === hour)?.label ?? '-';
  return `${hourLabel} ${String(minute).padStart(2, '0')}분`;
};
