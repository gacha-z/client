export type CalendarDay = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
};

export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

export const parseDateKey = (value: string | undefined): Date | null => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  const isValidDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValidDate ? date : null;
};

export const isSameDay = (left: Date, right: Date) => toDateKey(left) === toDateKey(right);

export const isBeforeDay = (date: Date, comparisonDate: Date) =>
  startOfDay(date).getTime() < startOfDay(comparisonDate).getTime();

export const canMoveToPreviousMonth = (visibleMonth: Date, today: Date) =>
  startOfMonth(visibleMonth).getTime() > startOfMonth(today).getTime();

export const buildCalendar = (month: Date): CalendarDay[] => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, monthIndex, index - firstWeekday + 1);
    return {
      date,
      key: toDateKey(date),
      isCurrentMonth: date.getMonth() === monthIndex
    };
  });
};
