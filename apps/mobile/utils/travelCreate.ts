import { isBeforeDay, parseDateKey, startOfDay } from './calendar';

export const getTravelRoomTitle = (title: string | undefined) => `${title?.trim() || '랜덤 여행'}`;

export type TravelPartyType = 'solo' | 'group';

export const getTravelPartyType = (memberCount: number): TravelPartyType =>
  memberCount === 1 ? 'solo' : 'group';

export const getTravelPartyLabel = (partyType: TravelPartyType) =>
  partyType === 'solo' ? '혼자여행' : '함께 여행';

export type TravelDateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export const getValidInitialTravelDateRange = (
  startDateKey: string | undefined,
  endDateKey: string | undefined,
  today = new Date()
): TravelDateRange => {
  const startDate = parseDateKey(startDateKey);
  const endDate = parseDateKey(endDateKey);
  const minimumDate = startOfDay(today);

  if (
    !startDate ||
    !endDate ||
    isBeforeDay(startDate, minimumDate) ||
    isBeforeDay(endDate, startDate)
  ) {
    return { startDate: null, endDate: null };
  }

  return { startDate, endDate };
};

export type MissionCountRange = {
  min: number;
  max: number;
};

type MissionCountField = keyof MissionCountRange;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** 최소 미션 수가 최대 미션 수를 넘지 않도록 변경값을 보정한다. */
export const updateMissionCountRange = (
  range: MissionCountRange,
  field: MissionCountField,
  value: number,
  lowerLimit: number,
  upperLimit: number
): MissionCountRange => {
  if (field === 'min') {
    const nextMin = clamp(value, lowerLimit, upperLimit);
    return {
      min: nextMin,
      max: Math.max(range.max, nextMin)
    };
  }

  const nextMax = clamp(value, lowerLimit, upperLimit);
  return {
    min: Math.min(range.min, nextMax),
    max: nextMax
  };
};
