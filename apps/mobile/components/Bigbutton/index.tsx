import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { colors } from '@travel-gacha/ui';

import { styles } from './index.css';

type BigbuttonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'dark';
  icon?: ReactNode;
  loading?: boolean;
};

/** 화면 하단 주요 액션 버튼 (미션 시작하기/여행 종료하기 등) */
export function Bigbutton({
  label,
  onPress,
  disabled,
  variant = 'default',
  icon,
  loading = false
}: BigbuttonProps) {
  const interactionDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        variant === 'dark' && styles.dark,
        interactionDisabled && styles.disabled,
        pressed && !interactionDisabled && styles.pressed
      ]}
      onPress={onPress}
      disabled={interactionDisabled}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: interactionDisabled }}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : icon}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
