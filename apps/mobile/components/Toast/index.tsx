import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { styles } from './index.css';

export type ToastVariant = 'success' | 'error';

type ToastProps = {
  visible: boolean;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: () => void;
};

/** 사용자 액션 결과를 잠시 안내하는 공통 토스트 */
export function Toast({
  visible,
  message,
  variant = 'success',
  duration = 2000,
  onDismiss
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;

    const timeoutId = setTimeout(onDismiss, duration);
    return () => clearTimeout(timeoutId);
  }, [duration, message, onDismiss, visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.positioner}>
      <View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[styles.toast, variant === 'error' ? styles.error : styles.success]}
      >
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}
