import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Bigbutton } from '@/components/Bigbutton';
import { FormInput } from '@/components/FormInput';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelScheduleCalendar } from '@/components/TravelScheduleCalendar';
import { TRAVEL_MISSION_COUNT_DEFAULTS, TRAVEL_MISSION_COUNT_LIMITS } from '@/constants';
import {
  getValidInitialTravelDateRange,
  toDateKey,
  TRAVEL_HOUR_OPTIONS,
  TRAVEL_MINUTE_OPTIONS,
  updateMissionCountRange,
  type MissionCountRange
} from '@/utils';

import { styles } from './index.css';

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const displayDate = (value: Date | null) => toDateKey(value ?? new Date()).replaceAll('-', '.');

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description && <Text style={styles.sectionDescription}>{description}</Text>}
      </View>
      {children}
    </View>
  );
}

type MemberSelectorProps = {
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
};

type ActiveDateField = 'start' | 'end' | null;

function MemberSelector({ value, onChange, max = 10 }: MemberSelectorProps) {
  return (
    <View style={styles.memberGrid}>
      {Array.from({ length: max }, (_, index) => index + 1).map((count) => {
        const selected = count === value;

        return (
          <Pressable
            key={count}
            accessibilityState={{ selected }}
            onPress={() => onChange(count)}
            style={[styles.memberItem, selected && styles.memberItemSelected]}
          >
            <Text style={[styles.memberText, selected && styles.memberTextSelected]}>{count}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TravelCreateScreen() {
  const params = useLocalSearchParams<{ startDate?: string; endDate?: string }>();
  const [dateRange, setDateRange] = useState(() =>
    getValidInitialTravelDateRange(getParam(params.startDate), getParam(params.endDate))
  );
  const { startDate, endDate } = dateRange;
  const [title, setTitle] = useState('');
  const [missionCount, setMissionCount] = useState<MissionCountRange>({
    ...TRAVEL_MISSION_COUNT_DEFAULTS
  });
  const [missionTime, setMissionTime] = useState({ hour: 10, minute: 0 });
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [activeDateField, setActiveDateField] = useState<ActiveDateField>(null);

  const handleMissionCountChange = (field: keyof MissionCountRange, value: number) => {
    setMissionCount((current) =>
      updateMissionCountRange(
        current,
        field,
        value,
        TRAVEL_MISSION_COUNT_LIMITS.min,
        TRAVEL_MISSION_COUNT_LIMITS.max
      )
    );
  };

  const handleDateRangeChange = (nextStartDate: Date | null, nextEndDate: Date | null) => {
    setDateRange({ startDate: nextStartDate, endDate: nextEndDate });
    if (nextStartDate && nextEndDate) setActiveDateField(null);
  };

  const toggleDateField = (field: Exclude<ActiveDateField, null>) => {
    setActiveDateField((current) => (current === field ? null : field));
  };

  const formComplete = Boolean(startDate && endDate && title.trim() && memberCount);

  return (
    <ScreenLayout title="여행 생성" headerActions showTopbar={false} scrollable>
      <View style={styles.content}>
        <FormSection
          title="여행 정보를 입력해주세요!"
          description="입력한 여행 정보를 바탕으로 어울리는 지역 후보 3곳을 추천해드려요."
        >
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>선택한 여행 날짜</Text>
            <View style={styles.row}>
              <FormInput
                variant="date"
                label="시작"
                value={startDate ? displayDate(startDate) : '-'}
                expanded={activeDateField === 'start'}
                onPress={() => toggleDateField('start')}
              />
              <FormInput
                variant="date"
                label="종료"
                value={endDate ? displayDate(endDate) : '-'}
                expanded={activeDateField === 'end'}
                onPress={() => toggleDateField('end')}
              />
            </View>
            {activeDateField && (
              <TravelScheduleCalendar
                initialStartDate={startDate}
                initialEndDate={endDate}
                onRangeChange={handleDateRangeChange}
              />
            )}
          </View>
          <FormInput
            variant="text"
            label="여행 제목"
            value={title}
            placeholder="예: 강원도 즉흥 여행"
            onChangeText={setTitle}
          />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>하루 미션 수</Text>
            <View style={styles.row}>
              <FormInput
                variant="number"
                label="최소"
                value={missionCount.min}
                suffix="개"
                min={TRAVEL_MISSION_COUNT_LIMITS.min}
                max={missionCount.max}
                onChange={(value) => handleMissionCountChange('min', value)}
              />
              <FormInput
                variant="number"
                label="최대"
                value={missionCount.max}
                suffix="개"
                min={missionCount.min}
                max={TRAVEL_MISSION_COUNT_LIMITS.max}
                onChange={(value) => handleMissionCountChange('max', value)}
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>첫 미션 받을 시각</Text>
            <View style={styles.row}>
              <FormInput
                variant="time"
                value={missionTime.hour}
                options={TRAVEL_HOUR_OPTIONS}
                onValueChange={(hour) => setMissionTime((current) => ({ ...current, hour }))}
              />
              <FormInput
                variant="time"
                value={missionTime.minute}
                options={TRAVEL_MINUTE_OPTIONS}
                onValueChange={(minute) => setMissionTime((current) => ({ ...current, minute }))}
              />
            </View>
            <Text style={styles.hint}>
              여행 둘째 날부터 선택한 시각에 첫 미션 알림을 보내드려요!
            </Text>
          </View>
        </FormSection>

        <FormSection title="여행 인원을 선택해주세요!">
          <MemberSelector value={memberCount} onChange={setMemberCount} />
        </FormSection>

        <Bigbutton label="여행지 추천받기" disabled={!formComplete} onPress={() => {}} />
      </View>
    </ScreenLayout>
  );
}
