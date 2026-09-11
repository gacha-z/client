import { Pressable, Text, View } from 'react-native';

import type { AppNotification } from '@/types/notification';

import { styles } from './index.css';

type NotificationCardProps = {
  notification: AppNotification;
  onPress?: (notification: AppNotification) => void;
};

const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  DIARY: '일기',
  MISSION: '미션',
  TRIP: '여행'
};

function formatNotificationTime(createdAt: string, now = new Date()): string {
  const createdTime = new Date(createdAt).getTime();
  if (!Number.isFinite(createdTime)) return '';

  const differenceInMinutes = Math.max(0, Math.floor((now.getTime() - createdTime) / 60_000));
  if (differenceInMinutes < 1) return '방금 전';
  if (differenceInMinutes < 60) return `${differenceInMinutes}분 전`;

  const differenceInHours = Math.floor(differenceInMinutes / 60);
  if (differenceInHours < 24) return `${differenceInHours}시간 전`;

  const differenceInDays = Math.floor(differenceInHours / 24);
  if (differenceInDays < 7) return `${differenceInDays}일 전`;

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(createdTime));
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const handlePress = () => onPress?.(notification);
  const category =
    NOTIFICATION_CATEGORY_LABELS[notification.targetType ?? ''] ??
    NOTIFICATION_CATEGORY_LABELS[notification.type.split('_')[0]] ??
    '알림';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.read ? '읽은 알림' : '읽지 않은 알림'}, ${category}, ${notification.title}, ${formatNotificationTime(notification.createdAt)}`}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        !notification.read && styles.unreadCard,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.metaRow}>
        <View style={styles.badges}>
          <Text style={[styles.categoryBadge, notification.read && styles.readCategoryBadge]}>
            {category}
          </Text>
          {!notification.read ? (
            <View style={styles.unreadBadge}>
              <View style={styles.unreadDot} />
              <Text style={styles.unreadLabel}>새 알림</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.time}>{formatNotificationTime(notification.createdAt)}</Text>
      </View>
      <Text style={[styles.title, notification.read && styles.readTitle]}>
        {notification.title}
      </Text>
      <Text style={[styles.body, notification.read && styles.readBody]}>{notification.body}</Text>
    </Pressable>
  );
}
