import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { AnchoredMenu } from '@/components/AnchoredMenu';
import { MoreIcon } from '@/components/icons';
import { PillButton, TinyIcon } from '@/components/TravelPrimitives';

import { styles } from './index.css';

type TravelRecordHeaderProps = {
  title: string;
  date: string;
  dayNumber: number;
  canGoPreviousDay: boolean;
  canGoNextDay: boolean;
  deleteVisible: boolean;
  onToggleDelete: () => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
};

export function TravelRecordHeader({
  title,
  date,
  dayNumber,
  canGoPreviousDay,
  canGoNextDay,
  deleteVisible,
  onToggleDelete,
  onPreviousDay,
  onNextDay
}: TravelRecordHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.tripTitle}>{title}</Text>
        <AnchoredMenu
          open={deleteVisible}
          onClose={onToggleDelete}
          offset={2}
          menuStyle={styles.deleteButton}
          trigger={
            <Pressable style={styles.moreButton} onPress={onToggleDelete} hitSlop={8}>
              <MoreIcon size={24} color={colors.grey900} />
            </Pressable>
          }
        >
          <Pressable>
            <Text style={styles.deleteText}>삭제하기</Text>
          </Pressable>
        </AnchoredMenu>
      </View>

      <View style={styles.dateRow}>
        <Pressable onPress={onPreviousDay} disabled={!canGoPreviousDay} hitSlop={8}>
          <TinyIcon
            name="caretLeft"
            size={12}
            color={canGoPreviousDay ? colors.grey400 : colors.white}
          />
        </Pressable>
        <Text style={styles.dateText}>{date}</Text>
        <Pressable
          onPress={onNextDay}
          disabled={!canGoNextDay}
          hitSlop={8}
          style={styles.nextDayButton}
        >
          <TinyIcon
            name="caretLeft"
            size={12}
            color={canGoNextDay ? colors.grey400 : colors.white}
          />
        </Pressable>
      </View>

      <View style={styles.dayActionRow}>
        <View style={styles.dayChip}>
          <Text style={styles.dayChipText}>DAY {dayNumber}</Text>
        </View>
        <View style={styles.actionButtons}>
          <PillButton label="미션로그" icon="missionLog" iconPosition="left" />
          <PillButton label="일기" icon="diary" iconPosition="left" />
        </View>
      </View>
    </View>
  );
}
