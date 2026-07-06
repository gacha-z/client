import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { styles } from './index.css';

type BigbuttonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'dark';
  icon?: ReactNode;
};

/** 화면 하단 주요 액션 버튼 (미션 시작하기/여행 종료하기 등) */
export function Bigbutton({ label, onPress, disabled, variant = 'default', icon }: BigbuttonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        variant === 'dark' && styles.dark,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
