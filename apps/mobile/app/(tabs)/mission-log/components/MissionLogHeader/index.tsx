import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { ArrowDownIcon, CalendarViewIcon, DownloadIcon } from '@/components/icons';
import type { TravelListItem } from '@/types';

import { styles } from './index.css';

type MissionLogHeaderProps = {
  selectedTrip: TravelListItem | undefined;
  onSelectTrip: () => void;
  canSelectTrip: boolean;
  date: string;
  canGoPreviousDay: boolean;
  canGoNextDay: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onDownload: () => void;
  downloadDisabled: boolean;
};

export function MissionLogHeader({
  selectedTrip,
  onSelectTrip,
  canSelectTrip,
  date,
  canGoPreviousDay,
  canGoNextDay,
  onPreviousDay,
  onNextDay,
  onDownload,
  downloadDisabled
}: MissionLogHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tripRow}>
        <Pressable
          style={styles.tripSelect}
          onPress={onSelectTrip}
          disabled={!canSelectTrip}
          hitSlop={8}
        >
          <Text style={styles.tripName} numberOfLines={1}>
            {selectedTrip?.title ?? '여행 선택'}
          </Text>
          {canSelectTrip ? <ArrowDownIcon size={10} color={colors.grey900} /> : null}
        </Pressable>
        <View style={styles.actions}>
          <CalendarViewIcon size={20} color={colors.blue500} />
          <Pressable hitSlop={8} disabled={downloadDisabled} onPress={onDownload}>
            <DownloadIcon size={20} color={downloadDisabled ? colors.grey300 : colors.blue500} />
          </Pressable>
        </View>
      </View>
      <View style={styles.dateRow}>
        <Pressable onPress={onPreviousDay} disabled={!canGoPreviousDay} hitSlop={8}>
          <Text style={[styles.dateArrow, !canGoPreviousDay && styles.dateArrowDisabled]}>‹</Text>
        </Pressable>
        <Text style={styles.dateText}>{date}</Text>
        <Pressable onPress={onNextDay} disabled={!canGoNextDay} hitSlop={8}>
          <Text style={[styles.dateArrow, !canGoNextDay && styles.dateArrowDisabled]}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}
