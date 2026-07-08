import { useState } from 'react';
import { View } from 'react-native';

import type { TravelRecord as TravelRecordData } from '@/types';
import { getTravelRecordDaySummary } from '@/utils';

import { MissionCard } from '../MissionCard';
import { SummaryBox } from '../SummaryBox';
import { TravelRecordHeader } from '../TravelRecordHeader';
import { styles } from './index.css';

type TravelRecordProps = {
  travel?: TravelRecordData;
};

export function TravelRecord({ travel }: TravelRecordProps) {
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = travel?.days ?? [];

  if (!travel || days.length === 0) {
    return null;
  }

  const selectedDay = days[selectedDayIndex] ?? days[0];
  const daySummary = getTravelRecordDaySummary(selectedDay);
  const canGoPreviousDay = selectedDayIndex > 0;
  const canGoNextDay = selectedDayIndex < days.length - 1;

  return (
    <View style={styles.screen}>
      <TravelRecordHeader
        title={travel.title}
        date={selectedDay.date}
        dayNumber={selectedDay.dayNumber}
        canGoPreviousDay={canGoPreviousDay}
        canGoNextDay={canGoNextDay}
        deleteVisible={deleteVisible}
        onToggleDelete={() => setDeleteVisible((visible) => !visible)}
        onPreviousDay={() => canGoPreviousDay && setSelectedDayIndex((index) => index - 1)}
        onNextDay={() => canGoNextDay && setSelectedDayIndex((index) => index + 1)}
      />

      <View style={styles.summaryRow}>
        <SummaryBox label="달성한 미션" value={`${daySummary.completedMissionCount} 개`} />
        <SummaryBox label="수집 아이템" value={`${daySummary.collectedItemCount} 개`} />
      </View>

      <View style={styles.missionList}>
        {selectedDay.missions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </View>
    </View>
  );
}
