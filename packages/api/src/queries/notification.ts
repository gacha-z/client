import { infiniteQueryOptions } from '@tanstack/react-query';

import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type NotificationResponse = {
  notificationId: number;
  type: string;
  title: string;
  body: string;
  targetType?: string | null;
  targetId?: number | null;
  read: boolean;
  createdAt: string;
};

type NotificationListResponse = {
  notifications: NotificationResponse[];
  nextCursor?: number | null;
  hasNext: boolean;
  unreadCount: number;
};

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  targetType?: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
};

export type NotificationListPage = {
  notifications: NotificationItem[];
  nextCursor: number | null;
  hasNext: boolean;
  unreadCount: number;
};

export type NotificationListParams = {
  memberId?: number;
  size?: number;
};

export type ReadNotificationParams = {
  notificationId: string;
  memberId: number;
};

const toNotificationItem = (response: NotificationResponse): NotificationItem => ({
  id: String(response.notificationId),
  type: response.type,
  title: response.title,
  body: response.body,
  targetType: response.targetType ?? undefined,
  targetId:
    response.targetId === null || response.targetId === undefined
      ? undefined
      : String(response.targetId),
  read: response.read,
  createdAt: response.createdAt
});

export const notificationListRootKey = ['notifications'] as const;

export const notificationListQueryKey = ({ memberId, size = 20 }: NotificationListParams) =>
  [...notificationListRootKey, { memberId, size }] as const;

export const notificationListInfiniteQueryOptions = ({
  memberId,
  size = 20
}: NotificationListParams) =>
  infiniteQueryOptions({
    queryKey: notificationListQueryKey({ memberId, size }),
    queryFn: async ({ pageParam }): Promise<NotificationListPage> => {
      if (!memberId) throw new Error('회원 ID가 필요합니다.');

      const response = await unwrap(
        getApiClient().get<ApiEnvelope<NotificationListResponse>>('/api/v1/notifications', {
          params: { memberId, cursor: pageParam ?? undefined, size }
        })
      );

      return {
        notifications: (response.notifications ?? []).map(toNotificationItem),
        nextCursor: response.nextCursor ?? null,
        hasNext: response.hasNext,
        unreadCount: response.unreadCount
      };
    },
    enabled: Boolean(memberId),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext && lastPage.nextCursor !== null ? lastPage.nextCursor : undefined,
    staleTime: 30 * 1000,
    retry: 1
  });

export const readNotification = async ({
  notificationId,
  memberId
}: ReadNotificationParams): Promise<void> => {
  await unwrap(
    getApiClient().patch<ApiEnvelope<null>>(
      `/api/v1/notifications/${notificationId}/read`,
      undefined,
      { params: { memberId } }
    )
  );
};
