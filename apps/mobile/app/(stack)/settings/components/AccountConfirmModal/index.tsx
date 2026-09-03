import { Text } from 'react-native';

import { Modal } from '@/components/Modal';

import { styles } from './index.css';

type AccountConfirmModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  danger?: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function AccountConfirmModal({
  visible,
  title,
  description,
  danger = false,
  loading = false,
  onClose,
  onConfirm
}: AccountConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      title={title}
      confirmText="확인"
      confirmVariant={danger ? 'danger' : 'primary'}
      confirmLoading={loading}
      closeOnBackdropPress={!loading}
      showCloseButton={false}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </Modal>
  );
}
