import { Text, View } from 'react-native';

import type { AppNotification } from '@/types/notification';

import { NotificationCard } from '../NotificationCard';
import { styles } from './index.css';

type NotificationListProps = {
  notifications: AppNotification[];
  onPressNotification?: (notification: AppNotification) => void;
  emptyMessage?: string;
};

export function NotificationList({
  notifications,
  onPressNotification,
  emptyMessage = '새로운 알림이 없어요.'
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>{emptyMessage}</Text>
        <Text style={styles.emptyDescription}>새로운 소식이 생기면 이곳에서 알려드릴게요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onPress={onPressNotification}
        />
      ))}
    </View>
  );
}
