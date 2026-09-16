import { queryOptions } from '@tanstack/react-query';

import type { Badge, CollectionItemEntry } from '@travel-gacha/types';
import { getApiClient, unwrap, type ApiEnvelope } from '../client';

type BadgeResponse = {
  badgeId: number;
  badgeGroup: string;
  badgeCode: string;
  badgeName: string;
  description: string;
  targetCount: number;
  currentCount: number;
  achievedYn: string;
  achievedAt?: string | null;
};

type CollectionItemResponse = {
  collectionItemId: number;
  regionGroupCode: string;
  regionGroupName: string;
  itemName: string;
  itemType: string;
  imageUrl: string;
  description: string;
  acquiredYn: string;
  acquiredAt?: string | null;
};

const toBadge = (response: BadgeResponse): Badge => ({
  id: String(response.badgeId),
  group: response.badgeGroup,
  code: response.badgeCode,
  name: response.badgeName,
  description: response.description,
  targetCount: response.targetCount,
  currentCount: response.currentCount,
  achieved: response.achievedYn === 'Y',
  achievedAt: response.achievedAt ?? undefined
});

const toCollectionItem = (response: CollectionItemResponse): CollectionItemEntry => ({
  id: String(response.collectionItemId),
  regionGroupCode: response.regionGroupCode,
  regionGroupName: response.regionGroupName,
  itemName: response.itemName,
  itemType: response.itemType,
  imageUrl: response.imageUrl,
  description: response.description,
  acquired: response.acquiredYn === 'Y',
  acquiredAt: response.acquiredAt ?? undefined
});

export const badgesQueryKey = ['collection', 'badges'] as const;

export const badgesQueryOptions = (memberId?: number) =>
  queryOptions({
    queryKey: badgesQueryKey,
    queryFn: async (): Promise<Badge[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<BadgeResponse[]>>('/api/v1/collection/badges', {
          params: { userId: memberId }
        })
      );
      return response.map(toBadge);
    },
    enabled: Boolean(memberId),
    staleTime: 30 * 1000,
    retry: 1
  });

export const collectionItemsQueryKey = ['collection', 'items'] as const;

export const itemsQueryOptions = (memberId?: number) =>
  queryOptions({
    queryKey: collectionItemsQueryKey,
    queryFn: async (): Promise<CollectionItemEntry[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<CollectionItemResponse[]>>('/api/v1/collection/items', {
          params: { userId: memberId }
        })
      );
      return response.map(toCollectionItem);
    },
    enabled: Boolean(memberId),
    staleTime: 30 * 1000,
    retry: 1
  });

export const tripCollectionItemsQueryKey = (tripId: string) =>
  ['trips', tripId, 'collection-items'] as const;

export const tripCollectionItemsQueryOptions = ({
  tripId,
  memberId
}: {
  tripId: string;
  memberId?: number;
}) =>
  queryOptions({
    queryKey: tripCollectionItemsQueryKey(tripId),
    queryFn: async (): Promise<CollectionItemEntry[]> => {
      const response = await unwrap(
        getApiClient().get<ApiEnvelope<CollectionItemResponse[]>>(
          `/api/v1/trips/${tripId}/collection-items`,
          { params: { userId: memberId } }
        )
      );
      return response.map(toCollectionItem);
    },
    staleTime: 30 * 1000,
    retry: 1
  });
