export const TRAVEL_MISSION_COUNT_LIMITS = {
  min: 1,
  max: 20
} as const;

export const TRAVEL_MISSION_COUNT_DEFAULTS = {
  min: 1,
  max: 10
} as const;

export const TRAVEL_HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 || 12;
  return { label: `${period} ${displayHour}시`, value: hour };
});

export const TRAVEL_MINUTE_OPTIONS = [
  { label: '00분', value: 0 },
  { label: '30분', value: 30 }
];
