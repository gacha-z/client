import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import {
  ArrowDownIcon,
  CalendarViewIcon,
  CategoryIcon,
  ClockIcon,
  DiaryIcon,
  LineArrowIcon,
  ListViewIcon,
  MovieIcon,
  PeopleIcon,
  PlaceIcon,
  SolidCaretIcon
} from '@/components/icons';
import type { TripStatus } from '@/types';

import { commonStyles } from './index.css';

type TinyIconName =
  | 'calendar'
  | 'location'
  | 'people'
  | 'items'
  | 'lineArrowLeft'
  | 'lineArrowRight'
  | 'list'
  | 'calendarView'
  | 'chevronDown'
  | 'missionLog'
  | 'diary'
  | 'clock'
  | 'solidCaretLeft'
  | 'solidCaretRight';

type TinyIconProps = {
  name: TinyIconName;
  size?: number;
  color?: string;
};

const statusMeta: Record<TripStatus, { label: string; color: string; backgroundColor: string }> = {
  scheduled: { label: '여행 예정', color: '#ff5a4f', backgroundColor: colors.white },
  active: { label: '진행중', color: colors.blue500, backgroundColor: colors.white },
  completed: { label: '여행 완료', color: colors.grey500, backgroundColor: colors.white }
};

export function TinyIcon({ name, size = 16, color = colors.grey400 }: TinyIconProps) {
  switch (name) {
    case 'calendar':
      return <CalendarViewIcon size={size} color={color} />;
    case 'location':
      return <PlaceIcon size={size} color={color} />;
    case 'people':
      return <PeopleIcon size={size} color={color} />;
    case 'items':
      return <CategoryIcon size={size} color={color} />;
    case 'lineArrowLeft':
      return (
        <View style={{ transform: [{ rotate: '180deg' }] }}>
          <LineArrowIcon size={size} color={color} />
        </View>
      );
    case 'lineArrowRight':
      return <LineArrowIcon size={size} color={color} />;
    case 'list':
      return <ListViewIcon size={size} color={color} />;
    case 'calendarView':
      return <CalendarViewIcon size={size} color={color} />;
    case 'chevronDown':
      return <ArrowDownIcon size={size} color={color} />;
    case 'missionLog':
      return <MovieIcon size={size} color={color} />;
    case 'diary':
      return <DiaryIcon size={size} color={color} />;
    case 'clock':
      return <ClockIcon size={size} color={color} />;
    case 'solidCaretLeft':
      return <SolidCaretIcon size={size} color={color} />;
    case 'solidCaretRight':
      return (
        <View style={{ transform: [{ rotate: '180deg' }] }}>
          <SolidCaretIcon size={size} color={color} />
        </View>
      );
    default:
      return null;
  }
}

export function InfoRow({
  icon,
  children,
  iconColor = colors.grey400
}: {
  icon: TinyIconName;
  children: ReactNode;
  iconColor?: string;
}) {
  return (
    <View style={commonStyles.row}>
      <TinyIcon name={icon} size={16} color={iconColor} />
      <Text style={commonStyles.infoText} numberOfLines={1} ellipsizeMode="tail">
        {children}
      </Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: TripStatus }) {
  const meta = statusMeta[status];

  return (
    <View
      style={[
        commonStyles.badge,
        { borderColor: meta.color, backgroundColor: meta.backgroundColor }
      ]}
    >
      <Text style={[commonStyles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

export function PillButton({
  label,
  icon = 'lineArrowRight',
  iconPosition = 'right',
  onPress,
  disabled = false
}: {
  label: string;
  icon?: TinyIconName;
  iconPosition?: 'left' | 'right';
  onPress?: () => void;
  disabled?: boolean;
}) {
  const iconElement = (
    <TinyIcon name={icon} size={15} color={disabled ? colors.grey400 : colors.white} />
  );
  const textElement = (
    <Text style={[commonStyles.pillButtonText, disabled && commonStyles.pillButtonTextDisabled]}>
      {label}
    </Text>
  );

  return (
    <Pressable
      style={[commonStyles.pillButton, disabled && commonStyles.pillButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {iconPosition === 'left' ? iconElement : textElement}
      {iconPosition === 'left' ? textElement : iconElement}
    </Pressable>
  );
}
