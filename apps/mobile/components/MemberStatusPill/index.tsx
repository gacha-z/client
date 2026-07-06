import { Image, Pressable, Text, View } from 'react-native';

import { ExitIcon } from '@/components/icons';

import { styles } from './index.css';

type MemberStatusPillVariant = 'unverified' | 'verified' | 'ghost' | 'kickable';

type MemberStatusPillProps = {
  name: string;
  statusLabel: string;
  avatarUri?: string;
  variant?: MemberStatusPillVariant;
  onPressKick?: () => void;
};

/** 멤버 아바타 + 이름 + 상태 pill (⑨⑩ 미션 인증 상태, ② 관리자 멤버 관리) */
export function MemberStatusPill({
  name,
  statusLabel,
  avatarUri,
  variant = 'unverified',
  onPressKick
}: MemberStatusPillProps) {
  const isKickable = variant === 'kickable';
  const isUnverified = variant === 'unverified';

  return (
    <View
      style={[
        styles.container,
        variant === 'ghost' && styles.ghost,
        isKickable && styles.kickable,
        isUnverified && styles.unverified
      ]}
    >
      <View style={styles.avatarRow}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={[styles.status, isUnverified && styles.statusUnverified]}>
            {statusLabel}
          </Text>
        </View>
      </View>
      {isKickable && (
        <Pressable onPress={onPressKick} hitSlop={8}>
          <ExitIcon size={16} />
        </Pressable>
      )}
    </View>
  );
}
