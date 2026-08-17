import { useCallback, useState } from 'react';

import type { TravelCreateRequest } from '@travel-gacha/types';
import { TRAVEL_MISSION_COUNT_DEFAULTS, TRAVEL_MISSION_COUNT_LIMITS } from '@/constants';
import {
  formatMissionTime,
  getValidInitialTravelDateRange,
  toDateKey,
  updateMissionCountRange,
  type MissionCountRange
} from '@/utils';

type ActiveDateField = 'start' | 'end' | null;

/** 여행 생성 폼을 처음 열 때 적용할 날짜 쿼리 값이다. */
type UseTravelCreateFormOptions = {
  /** `YYYY-MM-DD` 형식의 초기 여행 시작일 */
  initialStartDate?: string;
  /** `YYYY-MM-DD` 형식의 초기 여행 종료일 */
  initialEndDate?: string;
};

const DEFAULT_MISSION_TIME = { hour: 10, minute: 0 };

/**
 * 여행 생성 화면의 입력 상태와 변경 규칙을 관리한다.
 *
 * 초기 날짜는 오늘 이후의 유효한 범위일 때만 반영하며, 최소·최대 미션 수가
 * 서로 역전되지 않도록 보정한다. `createRequest`는 버튼 활성화 여부와 별개로
 * 필수 입력값을 다시 검증하고, 유효할 때만 백엔드 요청 형식으로 변환한다.
 */
export function useTravelCreateForm({
  initialStartDate,
  initialEndDate
}: UseTravelCreateFormOptions = {}) {
  const [dateRange, setDateRange] = useState(() =>
    getValidInitialTravelDateRange(initialStartDate, initialEndDate)
  );
  const [title, setTitle] = useState('');
  const [missionCount, setMissionCount] = useState<MissionCountRange>({
    ...TRAVEL_MISSION_COUNT_DEFAULTS
  });
  const [missionTime, setMissionTime] = useState(DEFAULT_MISSION_TIME);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [activeDateField, setActiveDateField] = useState<ActiveDateField>(null);

  const { startDate, endDate } = dateRange;
  const trimmedTitle = title.trim();
  const formComplete = Boolean(startDate && endDate && trimmedTitle && memberCount);
  const missionTimeLabel = formatMissionTime(missionTime.hour, missionTime.minute);

  /** 기획 상한·하한과 최소/최대 간 순서를 모두 지키도록 미션 수를 변경한다. */
  const handleMissionCountChange = useCallback((field: keyof MissionCountRange, value: number) => {
    setMissionCount((current) =>
      updateMissionCountRange(
        current,
        field,
        value,
        TRAVEL_MISSION_COUNT_LIMITS.min,
        TRAVEL_MISSION_COUNT_LIMITS.max
      )
    );
  }, []);

  /** 선택된 날짜 범위를 저장하고, 범위 선택이 완료되면 캘린더를 닫는다. */
  const handleDateRangeChange = useCallback(
    (nextStartDate: Date | null, nextEndDate: Date | null) => {
      setDateRange({ startDate: nextStartDate, endDate: nextEndDate });
      if (nextStartDate && nextEndDate) setActiveDateField(null);
    },
    []
  );

  const toggleDateField = useCallback((field: Exclude<ActiveDateField, null>) => {
    setActiveDateField((current) => (current === field ? null : field));
  }, []);

  const setMissionHour = useCallback((hour: number) => {
    setMissionTime((current) => ({ ...current, hour }));
  }, []);

  const setMissionMinute = useCallback((minute: number) => {
    setMissionTime((current) => ({ ...current, minute }));
  }, []);

  /** 필수 입력이 유효하면 여행 생성 요청을 만들고, 그렇지 않으면 `null`을 반환한다. */
  const createRequest = useCallback((): TravelCreateRequest | null => {
    if (!startDate || !endDate || !trimmedTitle || !memberCount) return null;

    return {
      title: trimmedTitle,
      startDate: toDateKey(startDate),
      endDate: toDateKey(endDate),
      minimumMissionCount: missionCount.min,
      maximumMissionCount: missionCount.max,
      firstMissionHour: missionTime.hour,
      firstMissionMinute: missionTime.minute,
      memberCount
    };
  }, [endDate, memberCount, missionCount, missionTime, startDate, trimmedTitle]);

  return {
    startDate,
    endDate,
    title,
    missionCount,
    missionTime,
    memberCount,
    activeDateField,
    formComplete,
    missionTimeLabel,
    setTitle,
    setMemberCount,
    setMissionHour,
    setMissionMinute,
    handleMissionCountChange,
    handleDateRangeChange,
    toggleDateField,
    createRequest
  };
}
