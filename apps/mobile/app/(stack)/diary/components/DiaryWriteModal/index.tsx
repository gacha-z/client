import { Text, TextInput, View } from 'react-native';

import { Modal } from '@/components/Modal';

import { styles } from './index.css';

type DiaryWriteModalProps = {
  visible: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitLoading: boolean;
  errorMessage?: string;
};

export function DiaryWriteModal({
  visible,
  value,
  onChangeValue,
  onClose,
  onSubmit,
  submitLoading,
  errorMessage
}: DiaryWriteModalProps) {
  return (
    <Modal
      visible={visible}
      title="오늘의 일기 쓰기"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onSubmit}
      cancelText="취소"
      confirmText="작성하기"
      confirmDisabled={value.trim().length === 0}
      confirmLoading={submitLoading}
      closeOnBackdropPress={!submitLoading}
    >
      <View style={styles.field}>
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="오늘 하루를 기록해보세요."
          value={value}
          onChangeText={onChangeValue}
        />
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </Modal>
  );
}
