import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal as RNModal,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@travel-gacha/ui';

import { styles } from './index.css';

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  closeOnBackdropPress?: boolean;
  showCloseButton?: boolean;
  /** 화면별 강조색이 기본값(black/blue500)과 다를 때만 지정 — 예: 미션 클리어 모달 */
  titleColor?: string;
  confirmButtonColor?: string;
};

function CloseIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5564 1.71641C17.7252 1.54761 17.82 1.31868 17.82 1.07998C17.82 0.841271 17.7252 0.61234 17.5564 0.443549C17.3876 0.274758 17.1587 0.179932 16.92 0.179932C16.6813 0.179932 16.4523 0.274758 16.2835 0.443549L8.99998 7.72712L1.71641 0.443549C1.54761 0.274758 1.31868 0.179932 1.07998 0.179932C0.841271 0.179932 0.61234 0.274758 0.443549 0.443549C0.274758 0.61234 0.179932 0.841271 0.179932 1.07998C0.179932 1.31868 0.274758 1.54761 0.443549 1.71641L7.72712 8.99998L0.443549 16.2835C0.274758 16.4523 0.179932 16.6813 0.179932 16.92C0.179932 17.1587 0.274758 17.3876 0.443549 17.5564C0.61234 17.7252 0.841271 17.82 1.07998 17.82C1.31868 17.82 1.54761 17.7252 1.71641 17.5564L8.99998 10.2728L16.2835 17.5564C16.4523 17.7252 16.6813 17.82 16.92 17.82C17.1587 17.82 17.3876 17.7252 17.5564 17.5564C17.7252 17.3876 17.82 17.1587 17.82 16.92C17.82 16.6813 17.7252 16.4523 17.5564 16.2835L10.2728 8.99998L17.5564 1.71641Z"
        fill={colors.grey400}
      />
    </Svg>
  );
}

/** 공통 모달 — 상단 제목 + 본문 + 하단 확인 버튼, 우상단 닫기 */
export function Modal({
  visible,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = '확인',
  confirmDisabled = false,
  confirmLoading = false,
  closeOnBackdropPress = true,
  showCloseButton = true,
  titleColor,
  confirmButtonColor
}: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={closeOnBackdropPress ? onClose : undefined}>
        {/* 빈 onPress: 배경 Pressable로 터치 이벤트가 전파되어 모달이 닫히는 것을 막음 */}
        <Pressable accessibilityViewIsModal style={styles.container} onPress={() => {}}>
          <View style={styles.header}>
            {title ? (
              <Text
                style={[styles.title, titleColor ? { color: titleColor } : undefined]}
                numberOfLines={1}
              >
                {title}
              </Text>
            ) : null}
            {showCloseButton ? (
              <Pressable
                accessibilityLabel="모달 닫기"
                accessibilityRole="button"
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={8}
              >
                <CloseIcon />
              </Pressable>
            ) : null}
          </View>
          <ScrollView contentContainerStyle={styles.contentContainer}>{children}</ScrollView>
          {onConfirm ? (
            <View style={styles.footer}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  busy: confirmLoading,
                  disabled: confirmDisabled || confirmLoading
                }}
                disabled={confirmDisabled || confirmLoading}
                style={[
                  styles.confirmButton,
                  confirmButtonColor ? { backgroundColor: confirmButtonColor } : undefined,
                  (confirmDisabled || confirmLoading) && styles.confirmButtonDisabled
                ]}
                onPress={() => void onConfirm()}
              >
                {confirmLoading ? <ActivityIndicator color={colors.white} /> : null}
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </Pressable>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
