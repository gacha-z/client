import type { MissionHistoryDay, SetlogEntry } from '@travel-gacha/types';

import type {
  CollectionItemRecord,
  TravelMember,
  TravelPeriod,
  TravelRecord,
  TravelRecordDay
} from '@/types';

import { parseDateKey, toDateKey } from './calendar';

export type BuildTravelRecordParams = {
  tripId: string;
  title: string;
  period: TravelPeriod;
  members: TravelMember[];
  missionHistory: MissionHistoryDay[];
  setlogs: SetlogEntry[];
};

/** 여행 시작일 기준 dayNo만큼 더한 날짜를 "YYYY.MM.DD" 형식으로 반환한다 */
function addDaysToPeriodStart(startDate: string, dayNo: number): string {
  const base = parseDateKey(startDate.replaceAll('.', '-'));
  if (!base) return startDate;

  const next = new Date(base);
  next.setDate(next.getDate() + (dayNo - 1));
  return toDateKey(next).replaceAll('-', '.');
}

/** 여행 상세/멤버/미션 이력/셋로그 API 응답을 TravelRecord 화면 모델로 합성한다 */
export function buildTravelRecord({
  tripId,
  title,
  period,
  members,
  missionHistory,
  setlogs
}: BuildTravelRecordParams): TravelRecord | null {
  if (missionHistory.length === 0) return null;

  const setlogsByMission = new Map<string, SetlogEntry[]>();
  for (const setlog of setlogs) {
    const list = setlogsByMission.get(setlog.tripMissionId) ?? [];
    list.push(setlog);
    setlogsByMission.set(setlog.tripMissionId, list);
  }

  const days = missionHistory
    .slice()
    .sort((a, b) => a.dayNo - b.dayNo)
    .map(
      (day): TravelRecordDay => ({
        id: `day-${day.dayNo}`,
        dayNumber: day.dayNo,
        date: addDaysToPeriodStart(period.startDate, day.dayNo),
        diaries: [],
        missions: day.missions.map((mission) => ({
          id: mission.tripMissionId,
          title: mission.title,
          description: mission.description,
          difficulty: mission.difficulty,
          status: mission.status,
          completedAt: mission.completedAt,
          setlogs: (setlogsByMission.get(mission.tripMissionId) ?? []).map((setlog) => ({
            id: setlog.id,
            memberNickname: setlog.memberNickname,
            fileUrl: setlog.fileUrl,
            slotNo: setlog.slotNo
          }))
        }))
      })
    );

  if (days.length === 0) return null;

  return {
    id: tripId,
    title,
    period,
    members,
    days: days as [TravelRecordDay, ...TravelRecordDay[]]
  };
}

export function getTravelRecordDaySummary(day: TravelRecordDay) {
  const completedMissionCount = day.missions.filter(
    (mission) => mission.status === 'COMPLETED'
  ).length;
  const setlogCount = day.missions.reduce((total, mission) => total + mission.setlogs.length, 0);

  return {
    completedMissionCount,
    setlogCount
  };
}

export function formatTravelPeriod(period: TravelPeriod): string {
  return `${period.startDate} ~ ${period.endDate}(${period.nights}박 ${period.days}일)`;
}

export function formatTravelMembers(members: TravelMember[]): string {
  return members.map((member) => member.name).join(', ');
}

export function formatCollectionItems(items: CollectionItemRecord[]): string {
  return items.map((item) => `${item.name} ${item.count}개`).join(', ');
}
