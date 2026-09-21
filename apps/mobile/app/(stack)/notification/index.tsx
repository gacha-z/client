import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  isApiError,
  notificationListInfiniteQueryOptions,
  notificationListRootKey,
  readNotification
} from '@travel-gacha/api';

import { ScreenLayout } from '@/components/ScreenLayout';
import { getCachedMemberId } from '@/services/authSession';
import type { AppNotification } from '@/types/notification';

import { NotificationList } from './components/NotificationList';
import { styles } from './index.css';

export default function NotificationScreen() {
  const queryClient = useQueryClient();
  const memberId = getCachedMemberId();
  const [optimisticReadIds, setOptimisticReadIds] = useState<Set<string>>(() => new Set());
  const notificationsQuery = useInfiniteQuery(
    notificationListInfiniteQueryOptions({ memberId, size: 20 })
  );
  const readMutation = useMutation({
    mutationFn: readNotification,
    onMutate: ({ notificationId }) => {
      setOptimisticReadIds((current) => new Set(current).add(notificationId));
    },
    onError: (error, { notificationId }) => {
      setOptimisticReadIds((current) => {
        const next = new Set(current);
        next.delete(notificationId);
        return next;
      });
      Alert.alert(
        '알림 읽음 처리 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    },
    onSuccess: async (_data, { notificationId }) => {
      await queryClient.invalidateQueries({ queryKey: notificationListRootKey });
      setOptimisticReadIds((current) => {
        const next = new Set(current);
        next.delete(notificationId);
        return next;
      });
    }
  });

  const apiNotifications =
    notificationsQuery.data?.pages.flatMap((page) => page.notifications) ?? [];
  const notifications = apiNotifications.map((notification) =>
    optimisticReadIds.has(notification.id) ? { ...notification, read: true } : notification
  );
  const unreadCount = Math.max(
    0,
    (notificationsQuery.data?.pages[0]?.unreadCount ?? 0) - optimisticReadIds.size
  );

  const handlePressNotification = (selectedNotification: AppNotification) => {
    if (selectedNotification.read) return;

    if (!memberId) return;
    readMutation.mutate({ notificationId: selectedNotification.id, memberId });
  };

  return (
    <ScreenLayout title="알림 내역" showBack fallbackRoute="/" scrollable>
      <View style={styles.content}>
        {!memberId ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>알림을 불러올 수 없어요.</Text>
            <Text style={styles.stateDescription}>회원 정보를 확인한 뒤 다시 시도해주세요.</Text>
          </View>
        ) : notificationsQuery.isPending ? (
          <ActivityIndicator style={styles.state} />
        ) : notificationsQuery.isError ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>알림을 불러오지 못했어요.</Text>
            <Text style={styles.stateDescription}>
              {isApiError(notificationsQuery.error)
                ? notificationsQuery.error.message
                : '잠시 후 다시 시도해주세요.'}
            </Text>
            <Pressable style={styles.retryButton} onPress={() => notificationsQuery.refetch()}>
              <Text style={styles.retryLabel}>다시 시도</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text accessibilityLiveRegion="polite" style={styles.unreadSummary}>
              읽지 않은 알림 {unreadCount}개
            </Text>
            <NotificationList
              notifications={notifications}
              onPressNotification={handlePressNotification}
            />
            {notificationsQuery.hasNextPage ? (
              <Pressable
                style={styles.moreButton}
                disabled={notificationsQuery.isFetchingNextPage}
                onPress={() => notificationsQuery.fetchNextPage()}
              >
                {notificationsQuery.isFetchingNextPage ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.moreLabel}>알림 더 보기</Text>
                )}
              </Pressable>
            ) : null}
          </>
        )}
      </View>
    </ScreenLayout>
  );
}
